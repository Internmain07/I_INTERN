"""
Student Profile Model - Student-specific data ONLY
Linked to User via user_id (ONE-TO-ONE relationship)
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    __table_args__ = {'extend_existing': True}

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key to Users (ONE-TO-ONE)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
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
        return f"<StudentProfile(id={self.id}, user_id={self.user_id}, university={self.university})>"
