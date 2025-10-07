from sqlalchemy import Column, Integer, String, Enum as SAEnum, Date, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserRole(SAEnum):
    INTERN = "intern"
    COMPANY = "company"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.INTERN)
    
    # Basic profile fields
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Social links
    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    
    # Education
    university = Column(String, nullable=True)
    major = Column(String, nullable=True)
    graduation_year = Column(String, nullable=True)
    grading_type = Column(String, nullable=True)  # GPA or CGPA
    grading_score = Column(String, nullable=True)
    
    # Skills
    skills = Column(Text, nullable=True)  # Comma-separated skills
    
    # Profile picture
    avatar_url = Column(String, nullable=True)

    applications = relationship("Application", back_populates="intern")  # Changed from applicant
    work_experiences = relationship("WorkExperience", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")