from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "intern"
    skills: Optional[str] = None

class User(BaseModel):
    id: int
    email: EmailStr
    role: str
    
    # Profile fields
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    
    # Social links
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    
    # Education
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    grading_type: Optional[str] = None
    grading_score: Optional[str] = None
    
    # Skills - should be a list
    skills: Optional[List[str]] = None
    
    # Avatar
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True