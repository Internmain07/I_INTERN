from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.api import deps
from app.models.company import Company
from app.core.security import get_password_hash

router = APIRouter()


class CompanyProfileResponse(BaseModel):
    id: str
    email: str
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
    for field, value in update_data.items():
        setattr(current_company, field, value)
    
    db.commit()
    db.refresh(current_company)
    
    return current_company


@router.patch("/profile", response_model=CompanyProfileResponse)
def partial_update_company_profile(
    profile_update: CompanyProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Partially update company profile (only provided fields)"""
    
    # Update only provided fields
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_company, field, value)
    
    db.commit()
    db.refresh(current_company)
    
    return current_company


@router.put("/password")
def update_password(
    password_update: PasswordUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Update company password"""
    from app.core.security import verify_password
    
    # Verify current password
    if not verify_password(password_update.current_password, current_company.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    current_company.hashed_password = get_password_hash(password_update.new_password)
    
    db.commit()
    
    return {"message": "Password updated successfully"}
