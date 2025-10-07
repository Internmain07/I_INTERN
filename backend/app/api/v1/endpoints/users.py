from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user_profile import UserProfile, UserProfileUpdate
from app.models.user import User

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
def get_my_profile(
    current_user: User = Depends(deps.get_current_user),
):
    """Get current user's profile"""
    return current_user

@router.put("/profile", response_model=UserProfile)
def update_my_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update current user's profile"""
    # Debug: Print received data
    print(f"DEBUG: Received profile update for user {current_user.email}")
    print(f"DEBUG: Update data: {profile_in.dict(exclude_unset=True)}")
    
    try:
        # Get the user from database to ensure it's attached to the session
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update only provided fields
        update_data = profile_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            print(f"DEBUG: Setting {field} = {value}")
            setattr(db_user, field, value)
        
        # Flush changes to ensure they're written
        db.flush()
        db.commit()
        db.refresh(db_user)
        
        # Verify the data was actually saved by re-querying
        verification_user = db.query(User).filter(User.id == current_user.id).first()
        print(f"DEBUG: After commit - name: {db_user.name}, phone: {db_user.phone}")
        print(f"DEBUG: Verification query - name: {verification_user.name}, phone: {verification_user.phone}")
        print(f"DEBUG: Successfully updated user {db_user.id}")
        
        # Check if verification matches
        if verification_user.name != db_user.name:
            print(f"WARNING: Data mismatch! Set name={db_user.name}, but DB has name={verification_user.name}")
        
        return db_user
    except Exception as e:
        print(f"ERROR: Failed to update profile: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")
