from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from pathlib import Path
import uuid
from app.api import deps
from app.schemas.profile import (
    WorkExperienceCreate,
    WorkExperienceUpdate,
    WorkExperience as WorkExperienceSchema,
    ProjectCreate,
    ProjectUpdate,
    Project as ProjectSchema
)
from app.schemas.user_profile import UserProfileUpdate
from app.models.profile import WorkExperience, Project
from app.models.user import User

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ==================== PROFILE PICTURE ENDPOINT ====================

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Upload profile picture/avatar"""
    print(f"DEBUG: Uploading avatar for user {current_user.email}")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 5MB)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get position (file size)
    file.file.seek(0)  # Reset to beginning
    
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        raise HTTPException(status_code=400, detail="File size too large. Maximum size is 5MB")
    
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update user's avatar_url
        avatar_url = f"/uploads/avatars/{unique_filename}"
        current_user.avatar_url = avatar_url
        db.commit()
        db.refresh(current_user)
        
        print(f"DEBUG: Successfully uploaded avatar: {avatar_url}")
        
        return {
            "message": "Avatar uploaded successfully",
            "avatar_url": avatar_url
        }
    
    except Exception as e:
        print(f"ERROR: Failed to upload avatar: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

# ==================== WORK EXPERIENCE ENDPOINTS ====================

@router.get("/work-experiences", response_model=List[WorkExperienceSchema])
def get_my_work_experiences(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get all work experiences for current user"""
    return current_user.work_experiences

@router.post("/work-experiences", response_model=WorkExperienceSchema, status_code=201)
def create_work_experience(
    work_exp: WorkExperienceCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Create a new work experience entry"""
    print(f"DEBUG: Creating work experience for user {current_user.email}")
    print(f"DEBUG: Data: {work_exp.dict()}")
    
    try:
        # Check for duplicates before creating
        existing = db.query(WorkExperience).filter(
            WorkExperience.user_id == current_user.id,
            WorkExperience.company == work_exp.company,
            WorkExperience.position == work_exp.position,
            WorkExperience.start_date == work_exp.start_date,
            WorkExperience.end_date == work_exp.end_date
        ).first()
        
        if existing:
            print(f"WARNING: Duplicate work experience detected, returning existing entry")
            return existing
        
        # Create new work experience
        db_work_exp = WorkExperience(
            **work_exp.dict(),
            user_id=current_user.id
        )
        
        db.add(db_work_exp)
        db.flush()
        db.commit()
        db.refresh(db_work_exp)
        
        print(f"DEBUG: Successfully created work experience ID {db_work_exp.id}")
        
        # Verify it was saved
        verification = db.query(WorkExperience).filter(WorkExperience.id == db_work_exp.id).first()
        if verification:
            print(f"DEBUG: Verified - found work experience in database")
        else:
            print(f"WARNING: Work experience not found in database after commit!")
        
        return db_work_exp
    except Exception as e:
        print(f"ERROR: Failed to create work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create work experience: {str(e)}")

@router.put("/work-experiences/{exp_id}", response_model=WorkExperienceSchema)
def update_work_experience(
    exp_id: int,
    work_exp: WorkExperienceUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update an existing work experience"""
    print(f"DEBUG: Updating work experience {exp_id} for user {current_user.email}")
    
    try:
        # Get the work experience
        db_work_exp = db.query(WorkExperience).filter(
            WorkExperience.id == exp_id,
            WorkExperience.user_id == current_user.id
        ).first()
        
        if not db_work_exp:
            raise HTTPException(status_code=404, detail="Work experience not found")
        
        # Update fields
        update_data = work_exp.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_work_exp, field, value)
        
        db.flush()
        db.commit()
        db.refresh(db_work_exp)
        
        print(f"DEBUG: Successfully updated work experience {exp_id}")
        return db_work_exp
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update work experience: {str(e)}")

@router.delete("/work-experiences/{exp_id}", status_code=204)
def delete_work_experience(
    exp_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Delete a work experience"""
    print(f"DEBUG: Deleting work experience {exp_id} for user {current_user.email}")
    
    try:
        db_work_exp = db.query(WorkExperience).filter(
            WorkExperience.id == exp_id,
            WorkExperience.user_id == current_user.id
        ).first()
        
        if not db_work_exp:
            raise HTTPException(status_code=404, detail="Work experience not found")
        
        db.delete(db_work_exp)
        db.commit()
        
        print(f"DEBUG: Successfully deleted work experience {exp_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete work experience: {str(e)}")

# ==================== PROJECT ENDPOINTS ====================

@router.get("/projects", response_model=List[ProjectSchema])
def get_my_projects(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get all projects for current user"""
    return current_user.projects

@router.post("/projects", response_model=ProjectSchema, status_code=201)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Create a new project"""
    print(f"DEBUG: Creating project for user {current_user.email}")
    print(f"DEBUG: Data: {project.dict()}")
    
    try:
        # Check for duplicates before creating
        existing = db.query(Project).filter(
            Project.user_id == current_user.id,
            Project.title == project.title,
            Project.description == project.description,
            Project.start_date == project.start_date,
            Project.end_date == project.end_date
        ).first()
        
        if existing:
            print(f"WARNING: Duplicate project detected, returning existing entry")
            return existing
        
        # Create new project (technologies already converted by validator)
        db_project = Project(
            **project.dict(),
            user_id=current_user.id
        )
        
        db.add(db_project)
        db.flush()
        db.commit()
        db.refresh(db_project)
        
        print(f"DEBUG: Successfully created project ID {db_project.id}")
        
        # Verify it was saved
        verification = db.query(Project).filter(Project.id == db_project.id).first()
        if verification:
            print(f"DEBUG: Verified - found project in database")
        else:
            print(f"WARNING: Project not found in database after commit!")
        
        return db_project
    except Exception as e:
        print(f"ERROR: Failed to create project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update an existing project"""
    print(f"DEBUG: Updating project {project_id} for user {current_user.email}")
    
    try:
        # Get the project
        db_project = db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        ).first()
        
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update fields (technologies already converted by validator)
        update_data = project.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        
        db.flush()
        db.commit()
        db.refresh(db_project)
        
        print(f"DEBUG: Successfully updated project {project_id}")
        return db_project
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Delete a project"""
    print(f"DEBUG: Deleting project {project_id} for user {current_user.email}")
    
    try:
        db_project = db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        ).first()
        
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        db.delete(db_project)
        db.commit()
        
        print(f"DEBUG: Successfully deleted project {project_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

# ==================== EDUCATION ENDPOINTS ====================

@router.get("/education")
def get_my_education(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get education information for current user"""
    print(f"DEBUG: Getting education for user {current_user.email}")
    
    # Get from student_profile if exists
    student_profile = current_user.student_profile if hasattr(current_user, 'student_profile') else None
    
    education = {
        "university": student_profile.university if student_profile else None,
        "major": student_profile.major if student_profile else None,
        "graduation_year": student_profile.graduation_year if student_profile else None,
        "grading_type": student_profile.grading_type if student_profile else None,
        "grading_score": student_profile.grading_score if student_profile else None,
    }
    
    print(f"DEBUG: Education data: {education}")
    return education

@router.put("/education")
def update_my_education(
    education_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update education information for current user"""
    print(f"DEBUG: Updating education for user {current_user.email}")
    print(f"DEBUG: Education data: {education_data}")
    
    try:
        from app.models.profile import StudentProfile
        
        # Get or create student profile
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not student_profile:
            print(f"DEBUG: Creating new student profile for user {current_user.id}")
            student_profile = StudentProfile(user_id=current_user.id)
            db.add(student_profile)
        
        # Update education fields in student_profile
        education_fields = ['university', 'major', 'graduation_year', 'grading_type', 'grading_score']
        for field in education_fields:
            if field in education_data:
                print(f"DEBUG: Setting {field} = {education_data[field]}")
                setattr(student_profile, field, education_data[field])
        
        # Update timestamps
        student_profile.updated_at = datetime.utcnow()
        
        # Flush and commit changes
        db.flush()
        db.commit()
        db.refresh(student_profile)
        
        print(f"DEBUG: Successfully updated education for user {current_user.id}")
        
        # Return updated education data
        updated_education = {
            "university": student_profile.university,
            "major": student_profile.major,
            "graduation_year": student_profile.graduation_year,
            "grading_type": student_profile.grading_type,
            "grading_score": student_profile.grading_score,
        }
        
        return updated_education
    except Exception as e:
        print(f"ERROR: Failed to update education: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update education: {str(e)}")

# ==================== STUDENT PROFILE ENDPOINTS ====================

@router.get("/student-profile")
def get_student_profile(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get complete student profile information"""
    print(f"DEBUG: Getting student profile for user {current_user.email}")
    
    from app.models.profile import StudentProfile
    
    # Get student profile
    student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    if not student_profile:
        print(f"DEBUG: No student profile found for user {current_user.id}")
        return {
            "user_id": current_user.id,
            "date_of_birth": None,
            "location": None,
            "bio": None,
            "university": None,
            "major": None,
            "graduation_year": None,
            "grading_type": None,
            "grading_score": None,
            "linkedin_url": None,
            "github_url": None,
            "portfolio_url": None,
            "skills": None,
            "career_goals": None,
            "internship_preferences": None,
            "resume_url": None,
            "certifications": None,
        }
    
    return {
        "user_id": student_profile.user_id,
        "date_of_birth": student_profile.date_of_birth.isoformat() if student_profile.date_of_birth else None,
        "location": student_profile.location,
        "bio": student_profile.bio,
        "university": student_profile.university,
        "major": student_profile.major,
        "graduation_year": student_profile.graduation_year,
        "grading_type": student_profile.grading_type,
        "grading_score": student_profile.grading_score,
        "linkedin_url": student_profile.linkedin_url,
        "github_url": student_profile.github_url,
        "portfolio_url": student_profile.portfolio_url,
        "skills": student_profile.skills,
        "career_goals": student_profile.career_goals,
        "internship_preferences": student_profile.internship_preferences,
        "resume_url": student_profile.resume_url,
        "certifications": student_profile.certifications,
    }

@router.put("/student-profile")
def update_student_profile(
    profile_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update complete student profile information"""
    print(f"DEBUG: Updating student profile for user {current_user.email}")
    print(f"DEBUG: Profile data: {profile_data}")
    
    try:
        from app.models.profile import StudentProfile
        from datetime import datetime, date
        
        # Get or create student profile
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not student_profile:
            print(f"DEBUG: Creating new student profile for user {current_user.id}")
            student_profile = StudentProfile(user_id=current_user.id)
            db.add(student_profile)
        
        # Update all allowed fields
        allowed_fields = [
            'date_of_birth', 'location', 'bio', 'university', 'major', 
            'graduation_year', 'grading_type', 'grading_score', 
            'linkedin_url', 'github_url', 'portfolio_url', 'skills',
            'career_goals', 'internship_preferences', 'resume_url', 'certifications'
        ]
        
        for field in allowed_fields:
            if field in profile_data:
                value = profile_data[field]
                
                # Handle date_of_birth conversion
                if field == 'date_of_birth' and value:
                    if isinstance(value, str):
                        value = date.fromisoformat(value)
                
                print(f"DEBUG: Setting {field} = {value}")
                setattr(student_profile, field, value)
        
        # Update timestamps
        student_profile.updated_at = datetime.utcnow()
        
        # Flush and commit changes
        db.flush()
        db.commit()
        db.refresh(student_profile)
        
        print(f"DEBUG: Successfully updated student profile for user {current_user.id}")
        
        # Return updated profile
        return {
            "user_id": student_profile.user_id,
            "date_of_birth": student_profile.date_of_birth.isoformat() if student_profile.date_of_birth else None,
            "location": student_profile.location,
            "bio": student_profile.bio,
            "university": student_profile.university,
            "major": student_profile.major,
            "graduation_year": student_profile.graduation_year,
            "grading_type": student_profile.grading_type,
            "grading_score": student_profile.grading_score,
            "linkedin_url": student_profile.linkedin_url,
            "github_url": student_profile.github_url,
            "portfolio_url": student_profile.portfolio_url,
            "skills": student_profile.skills,
            "career_goals": student_profile.career_goals,
            "internship_preferences": student_profile.internship_preferences,
            "resume_url": student_profile.resume_url,
            "certifications": student_profile.certifications,
        }
    except Exception as e:
        print(f"ERROR: Failed to update student profile: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update student profile: {str(e)}")

