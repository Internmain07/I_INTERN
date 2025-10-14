"""
Profile Models:
- StudentProfile: Student-specific data
- WorkExperience: Work history
- Project: Student projects
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class StudentProfile(Base):
    """Student Profile - Student-specific data ONLY"""
    __tablename__ = "student_profiles"
    __table_args__ = {'extend_existing': True}

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key to Users (ONE-TO-ONE)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Personal Information
    date_of_birth = Column(Date, nullable=True)
    location = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Education
    university = Column(String, nullable=True)
    major = Column(String, nullable=True)
    graduation_year = Column(String, nullable=True)
    grading_type = Column(String, nullable=True)  # 'GPA' or 'CGPA'
    grading_score = Column(String, nullable=True)
    
    # Professional Links
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    
    # Skills & Career
    skills = Column(JSON, nullable=True)  # Store as JSON array: ["Python", "React", ...]
    career_goals = Column(Text, nullable=True)
    internship_preferences = Column(JSON, nullable=True)  # Store preferences as JSON
    
    # Resume
    resume_url = Column(String, nullable=True)
    
    # Additional Info
    certifications = Column(JSON, nullable=True)  # Store as JSON array
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship back to User
    user = relationship("User", back_populates="student_profile")
    
    def __repr__(self):
        return f"<StudentProfile(id={self.id}, user_id={self.user_id})>"


class WorkExperience(Base):
    """Work Experience - Linked to User"""
    __tablename__ = "work_experiences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="work_experiences")


class Project(Base):
    """Project - Linked to User"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(String, nullable=True)  # Comma-separated
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    github_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="projects")
