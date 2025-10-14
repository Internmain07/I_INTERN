from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ApplicationCreate(BaseModel):
    internship_id: str  # UUID as string

# Intern profile details for company view
class InternProfile(BaseModel):
    id: int
    name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Education
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[str] = None
    grading_type: Optional[str] = None
    grading_score: Optional[str] = None
    
    # Social links
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    
    class Config:
        from_attributes = True

class WorkExperienceDetail(BaseModel):
    id: int
    company: str
    position: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

class ProjectDetail(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class Application(BaseModel):
    id: str  # UUID as string
    status: str
    intern_id: int  # Integer ID referencing users.id
    internship_id: str  # UUID as string
    company_id: str  # UUID as string
    application_date: datetime | None = None  # Timestamp of application
    offer_sent_date: datetime | None = None  # When offer letter was sent
    offer_response_date: datetime | None = None  # When candidate responded
    hired_date: datetime | None = None  # When candidate was officially hired

    class Config:
        from_attributes = True

# Enhanced application with full intern profile for company dashboard
class ApplicationWithInternDetails(Application):
    intern: InternProfile
    work_experiences: List[WorkExperienceDetail] = []
    projects: List[ProjectDetail] = []
    
    class Config:
        from_attributes = True