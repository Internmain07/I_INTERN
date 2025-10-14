from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user_profile import UserProfile, UserProfileUpdate
from app.models.user import User

router = APIRouter()

@router.get("/profile")
def get_my_profile(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get current user's profile - includes student profile data if user is a student"""
    from app.models.profile import StudentProfile
    
    # Refresh the user to get latest data including relationships
    db.refresh(current_user)
    
    # Build response dict
    profile_data = {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "avatar_url": current_user.avatar_url,
    }
    
    # If user is a student, add student profile fields
    if current_user.role == 'student' or current_user.role == 'intern':
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        
        if student_profile:
            profile_data.update({
                "location": student_profile.location,
                "date_of_birth": student_profile.date_of_birth,
                "bio": student_profile.bio,
                "linkedin": student_profile.linkedin_url,
                "github": student_profile.github_url,
                "portfolio": student_profile.portfolio_url,
                "university": student_profile.university,
                "major": student_profile.major,
                "graduation_year": student_profile.graduation_year,
                "grading_type": student_profile.grading_type,
                "grading_score": student_profile.grading_score,
                "skills": student_profile.skills,
            })
        else:
            # Add None values for student fields if no profile exists
            profile_data.update({
                "location": None,
                "date_of_birth": None,
                "bio": None,
                "linkedin": None,
                "github": None,
                "portfolio": None,
                "university": None,
                "major": None,
                "graduation_year": None,
                "grading_type": None,
                "grading_score": None,
                "skills": None,
            })
    
    return profile_data

@router.put("/profile")
def update_my_profile(
    profile_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update current user's profile"""
    # Debug: Print received data
    print(f"DEBUG: Received profile update for user {current_user.email}")
    print(f"DEBUG: Raw profile data: {profile_data}")
    
    try:
        from app.models.profile import StudentProfile
        from datetime import datetime, date
        
        # Get the user from database to ensure it's attached to the session
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Separate fields that belong to User vs StudentProfile
        user_fields = ['full_name', 'phone', 'avatar_url']
        student_profile_fields = [
            'location', 'date_of_birth', 'bio', 'linkedin', 'github', 'portfolio',
            'university', 'major', 'graduation_year', 'grading_type', 'grading_score', 'skills'
        ]
        
        # Update User fields
        for field in user_fields:
            if field in profile_data:
                # Map 'name' to 'full_name' if needed
                db_field = 'full_name' if field == 'name' else field
                print(f"DEBUG: Setting User.{db_field} = {profile_data[field]}")
                setattr(db_user, db_field, profile_data[field])
        
        # Handle StudentProfile fields (only for students/interns)
        student_profile = None
        if db_user.role in ['student', 'intern']:
            # Get or create student profile
            student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == db_user.id).first()
            if not student_profile:
                print(f"DEBUG: Creating new student profile for user {db_user.id}")
                student_profile = StudentProfile(user_id=db_user.id)
                db.add(student_profile)
            
            # Update StudentProfile fields
            for field in student_profile_fields:
                if field in profile_data:
                    value = profile_data[field]
                    
                    # Map field names (linkedin -> linkedin_url, etc.)
                    db_field = field
                    if field == 'linkedin':
                        db_field = 'linkedin_url'
                    elif field == 'github':
                        db_field = 'github_url'
                    elif field == 'portfolio':
                        db_field = 'portfolio_url'
                    
                    # Handle date_of_birth conversion
                    if db_field == 'date_of_birth' and value:
                        if isinstance(value, str):
                            try:
                                value = date.fromisoformat(value)
                            except ValueError:
                                print(f"WARNING: Invalid date format for date_of_birth: {value}")
                                value = None
                    
                    print(f"DEBUG: Setting StudentProfile.{db_field} = {value}")
                    setattr(student_profile, db_field, value)
            
            # Update timestamps
            student_profile.updated_at = datetime.utcnow()
        
        # Flush changes to ensure they're written
        db.flush()
        db.commit()
        db.refresh(db_user)
        if student_profile:
            db.refresh(student_profile)
        
        print(f"DEBUG: Successfully updated profile for user {db_user.id}")
        
        # Build response dict
        response_data = {
            "id": db_user.id,
            "email": db_user.email,
            "role": db_user.role,
            "full_name": db_user.full_name,
            "phone": db_user.phone,
            "avatar_url": db_user.avatar_url,
        }
        
        # Add student profile fields if applicable
        if student_profile:
            response_data.update({
                "location": student_profile.location,
                "date_of_birth": student_profile.date_of_birth.isoformat() if student_profile.date_of_birth else None,
                "bio": student_profile.bio,
                "linkedin": student_profile.linkedin_url,
                "github": student_profile.github_url,
                "portfolio": student_profile.portfolio_url,
                "university": student_profile.university,
                "major": student_profile.major,
                "graduation_year": student_profile.graduation_year,
                "grading_type": student_profile.grading_type,
                "grading_score": student_profile.grading_score,
                "skills": student_profile.skills,
            })
        else:
            # Add None values for student fields
            response_data.update({
                "location": None,
                "date_of_birth": None,
                "bio": None,
                "linkedin": None,
                "github": None,
                "portfolio": None,
                "university": None,
                "major": None,
                "graduation_year": None,
                "grading_type": None,
                "grading_score": None,
                "skills": None,
            })
        
        return response_data
        
    except Exception as e:
        print(f"ERROR: Failed to update profile: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")
