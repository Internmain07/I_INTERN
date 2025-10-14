from pydantic import BaseModel, validator
from datetime import date, datetime
from typing import Optional, Union, List

# Work Experience Schemas
class WorkExperienceBase(BaseModel):
    company: str
    position: str
    start_date: Optional[Union[date, str]] = None
    end_date: Optional[Union[date, str]] = None
    description: Optional[str] = None
    
    @validator('start_date', 'end_date', pre=True)
    def parse_date(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            try:
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                # Try other formats if needed
                try:
                    return datetime.fromisoformat(v).date()
                except:
                    return None
        return v

class WorkExperienceCreate(WorkExperienceBase):
    pass

class WorkExperienceUpdate(WorkExperienceBase):
    company: Optional[str] = None
    position: Optional[str] = None

class WorkExperience(WorkExperienceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: Optional[Union[str, List[str]]] = None  # Accept both string and list
    start_date: Optional[Union[date, str]] = None
    end_date: Optional[Union[date, str]] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    
    @validator('start_date', 'end_date', pre=True)
    def parse_date(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            try:
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                try:
                    return datetime.fromisoformat(v).date()
                except:
                    return None
        return v
    
    @validator('technologies', pre=True)
    def convert_technologies(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, list):
            # Convert list to comma-separated string
            return ','.join(str(item) for item in v if item)
        return v

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None

class Project(ProjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
