"""
Internship Model - Linked to EmployerProfile
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class Internship(Base):
    __tablename__ = "internships"

    id = Column(String, primary_key=True, index=True)  # UUID as string
    title = Column(String, index=True)
    description = Column(Text)
    
    # Foreign Key to EmployerProfile (not companies table)
    employer_profile_id = Column(Integer, ForeignKey("employer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    
    is_suspended = Column(Boolean, default=False)  # Admin can suspend internships
    
    # Location and compensation
    location = Column(String, nullable=True)
    stipend = Column(Integer, nullable=True)
    
    # Duration and type
    duration = Column(String, nullable=True)
    type = Column(String, nullable=True)  # Remote, Hybrid, In-office
    level = Column(String, nullable=True)  # Beginner, Intermediate, Advanced
    category = Column(String, nullable=True)
    
    # Skills and requirements
    skills = Column(Text, nullable=True)  # Comma-separated skills
    requirements = Column(Text, nullable=True)  # Text requirements
    benefits = Column(Text, nullable=True)  # Text benefits
    required_skills = Column(String, nullable=True)  # Legacy field, keep for compatibility
    
    # Dates and status
    deadline = Column(Date, nullable=True)
    date_posted = Column(Date, nullable=True)
    status = Column(String, nullable=True)  # Active, Closed, Draft, Archived
    archived_at = Column(DateTime, nullable=True)  # Timestamp when archived
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employer_profile = relationship("EmployerProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")