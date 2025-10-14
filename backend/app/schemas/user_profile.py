from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import date

class UserProfileBase(BaseModel):
    model_config = ConfigDict(extra='ignore')  # Ignore extra fields
    
    # User fields
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Student Profile fields (for students only)
    location: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    grading_type: Optional[str] = None
    grading_score: Optional[str] = None
    skills: Optional[List[str]] = None

class UserProfileUpdate(UserProfileBase):
    model_config = ConfigDict(extra='ignore')  # Ignore extra fields that might come from frontend
    pass

class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: str
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Student Profile fields (will be populated from student_profile relationship in endpoint)
    location: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    grading_type: Optional[str] = None
    grading_score: Optional[str] = None
    skills: Optional[List[str]] = None
