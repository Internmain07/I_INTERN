from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.api import deps
from app.models.company import Company
from app.core.security import get_password_hash
import uuid
from pathlib import Path
import shutil

router = APIRouter()


class CompanyProfileResponse(BaseModel):
    id: int
    email: Optional[str] = None
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_number: Optional[str] = None
    company_website: Optional[str] = None
    industry_type: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    logo_url: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True

    class Config:
        from_attributes = True


class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_number: Optional[str] = None
    company_website: Optional[str] = None
    industry_type: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str


@router.get("/profile", response_model=CompanyProfileResponse)
def get_company_profile(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get the current company's profile"""
    return current_company


@router.put("/profile", response_model=CompanyProfileResponse)
def update_company_profile(
    profile_update: CompanyProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Update company profile information"""
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    
    # Check for contact number uniqueness if it's being updated
    if 'contact_number' in update_data and update_data['contact_number']:
        existing_company = db.query(Company).filter(
            Company.contact_number == update_data['contact_number'],
            Company.id != current_company.id
        ).first()
        if existing_company:
            raise HTTPException(
                status_code=400,
                detail=f"Contact number {update_data['contact_number']} is already used by another company"
            )
    
    try:
        for field, value in update_data.items():
            setattr(current_company, field, value)
        
        db.commit()
        db.refresh(current_company)
        
        return current_company
    except IntegrityError as e:
        db.rollback()
        # Handle specific constraint violations
        if "contact_number" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Contact number already exists for another company"
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Data integrity violation. Please check your input data."
            )


@router.patch("/profile", response_model=CompanyProfileResponse)
def partial_update_company_profile(
    profile_update: CompanyProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Partially update company profile (only provided fields)"""
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    
    # Check for contact number uniqueness if it's being updated
    if 'contact_number' in update_data and update_data['contact_number']:
        existing_company = db.query(Company).filter(
            Company.contact_number == update_data['contact_number'],
            Company.id != current_company.id
        ).first()
        if existing_company:
            raise HTTPException(
                status_code=400,
                detail=f"Contact number {update_data['contact_number']} is already used by another company"
            )
    
    try:
        for field, value in update_data.items():
            setattr(current_company, field, value)
        
        db.commit()
        db.refresh(current_company)
        
        return current_company
    except IntegrityError as e:
        db.rollback()
        # Handle specific constraint violations
        if "contact_number" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Contact number already exists for another company"
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Data integrity violation. Please check your input data."
            )


@router.put("/password")
def update_password(
    password_update: PasswordUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Update company password"""
    from app.core.security import verify_password
    
    # Verify current password
    if not verify_password(password_update.current_password, str(current_company.hashed_password)):  # type: ignore
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    current_company.hashed_password = get_password_hash(password_update.new_password)  # type: ignore
    
    db.commit()
    
    return {"message": "Password updated successfully"}


# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/logos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Upload company logo"""
    print(f"DEBUG: Uploading logo for company {current_company.user.email}")  # type: ignore
    
    # Validate file extension
    file_ext = Path(file.filename or "").suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        # Read file content
        contents = await file.read()
        
        # Validate file size
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Update company logo_url in database
        logo_url = f"/uploads/logos/{unique_filename}"
        current_company.logo_url = logo_url  # type: ignore
        db.commit()
        
        print(f"DEBUG: Successfully uploaded logo: {logo_url}")
        
        return {
            "message": "Logo uploaded successfully",
            "logo_url": logo_url
        }
    
    except Exception as e:
        print(f"ERROR: Failed to upload logo: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload logo: {str(e)}")


@router.delete("/logo")
def delete_logo(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Delete company logo"""
    if not current_company.logo_url:  # type: ignore
        raise HTTPException(status_code=404, detail="No logo found")
    
    try:
        # Delete file from filesystem
        logo_filename = Path(str(current_company.logo_url)).name  # type: ignore
        file_path = UPLOAD_DIR / logo_filename
        
        if file_path.exists():
            file_path.unlink()
        
        
        # Remove logo_url from database
        current_company.logo_url = None  # type: ignore
        db.commit()
        
        return {"message": "Logo deleted successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete logo: {str(e)}")


@router.get("/notifications")
async def get_notification_preferences(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company)
):
    """Get notification preferences for the current company"""
    preferences = current_company.notification_preferences or {
        'newApplications': True,
        'deadlineReminders': True,
        'emailDigest': True,
        'applicationUpdates': True,
        'weeklyReports': False,
        'marketingEmails': False,
        'loginNotifications': True
    }
    return {"preferences": preferences}


@router.put("/notifications")
async def update_notification_preferences(
    preferences: dict,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company)
):
    """Update notification preferences for the current company"""
    try:
        # Update notification preferences
        current_company.notification_preferences = preferences  # type: ignore
        db.commit()
        
        return {
            "message": "Notification preferences updated successfully",
            "preferences": preferences
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update notification preferences: {str(e)}")

