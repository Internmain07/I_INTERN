from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserProfileBase(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
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
    skills: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfile(UserProfileBase):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True
