"""
Optimized Models - Clean Architecture
- User: Authentication & common fields
- StudentProfile: Student-specific data
- EmployerProfile: Company-specific data
- Internship: Job postings
- Application: Student applications
- WorkExperience: Work history
- Project: Student projects
"""
from app.models.user import User
from app.models.company import EmployerProfile
from app.models.profile import StudentProfile, WorkExperience, Project
from app.models.internship import Internship
from app.models.application import Application

__all__ = [
    "User",
    "StudentProfile", 
    "EmployerProfile",
    "Internship", 
    "Application", 
    "WorkExperience", 
    "Project"
]
