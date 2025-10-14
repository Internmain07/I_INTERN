"""
Optimized User Model - Clean authentication & common fields only
No role-specific fields, no duplication
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication (REQUIRED)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Role & Status
    role = Column(String, nullable=False)  # 'student', 'employer', 'admin'
    is_active = Column(Boolean, default=True)
    is_suspended = Column(Boolean, default=False)
    
    # Common fields for ALL users
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Email Verification
    email_verified = Column(Boolean, default=False)
    email_verification_otp = Column(String, nullable=True)
    email_verification_otp_expires = Column(DateTime, nullable=True)
    
    # Password Reset (OTP-based)
    reset_otp = Column(String, nullable=True)
    reset_otp_expires = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships (ONE user can have ONE of each profile type)
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Relationships (ONE user can have MANY of these)
    work_experiences = relationship("WorkExperience", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
