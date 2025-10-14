"""
Employer Profile Model - Company-specific data ONLY
Linked to User via user_id (ONE-TO-ONE relationship)
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class EmployerProfile(Base):
    """Employer Profile - Company-specific data"""
    __tablename__ = "employer_profiles"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key to Users (ONE-TO-ONE)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Company Information (REQUIRED)
    company_name = Column(String, nullable=False)
    company_description = Column(Text, nullable=True)
    
    # Contact Details
    contact_person = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    
    # Company Details
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    
    # Location
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    
    # Status
    is_verified = Column(Boolean, default=False)
    
    # Notification Preferences (JSON)
    notification_preferences = Column(JSON, nullable=True, default=lambda: {
        'newApplications': True,
        'deadlineReminders': True,
        'emailDigest': True,
        'applicationUpdates': True,
        'weeklyReports': False,
        'marketingEmails': False,
        'loginNotifications': True
    })
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship back to User
    user = relationship("User", back_populates="employer_profile")
    
    # Relationship to Internships
    internships = relationship("Internship", back_populates="employer_profile", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<EmployerProfile(id={self.id}, user_id={self.user_id}, company={self.company_name})>"

# Backward compatibility alias
Company = EmployerProfile
