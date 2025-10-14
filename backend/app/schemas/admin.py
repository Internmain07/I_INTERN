from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


class UserStatsResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    university: str
    course: str
    year: str
    skills: List[str]
    status: str
    dateJoined: str
    gpa: str
    profileCompletion: int
    applications: int
    avatar: str


class CompanyStatsResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    industry: str
    size: str
    location: str
    website: str
    status: str
    dateJoined: str
    activePostings: int
    contactPerson: str
    phone: str


class InternshipStatsResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    stipend: int
    applications: int
    status: str
    datePosted: str
    deadline: Optional[str]
    category: str
    type: str
    duration: str
    salary: str
    featured: bool


class DashboardStatsResponse(BaseModel):
    total_users: int
    total_companies: int
    total_internships: int
    total_applications: int
    active_internships: int
    verified_companies: int
    trends: Dict[str, int]


class ActivityResponse(BaseModel):
    id: str
    activity: str
    timestamp: str
    type: str
    user_name: str
    company_name: str
    internship_title: str


class AuditLogResponse(BaseModel):
    id: str
    admin_user: str
    action: str
    targetName: str
    targetType: str
    timestamp: str
    details: str


class UserGrowthDataPoint(BaseModel):
    date: str
    employers: int
    interns: int


class WeeklyActivityDataPoint(BaseModel):
    date: str
    postings: int
    applications: int
