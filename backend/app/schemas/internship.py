from pydantic import BaseModel
from typing import Optional
from datetime import date

class InternshipBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    skills: Optional[str] = None  # Comma-separated
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    required_skills: Optional[str] = None  # Legacy field
    deadline: Optional[date] = None
    date_posted: Optional[date] = None
    status: Optional[str] = None

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(InternshipBase):
    pass

class InternshipPartialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    skills: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    required_skills: Optional[str] = None
    deadline: Optional[date] = None
    date_posted: Optional[date] = None
    status: Optional[str] = None

class Internship(InternshipBase):
    id: str  # UUID as string
    employer_profile_id: int  # ForeignKey to EmployerProfile
    company_name: Optional[str] = None  # Company name for display
    company_logo: Optional[str] = None  # Company logo URL for display
    applicant_count: Optional[int] = 0  # Number of applications for this internship

    @property
    def company_id(self) -> str:
        # For backward compatibility, expose employer_profile_id as company_id
        return str(self.employer_profile_id)

    class Config:
        from_attributes = True