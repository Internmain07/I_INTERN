"""
Application Model - Links Students to Internships
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SAEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base


class ApplicationStatus(SAEnum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)  # UUID as string
    status = Column(String, default=ApplicationStatus.PENDING)
    
    # Foreign Keys
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)  # References users.id (student)
    internship_id = Column(String, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False, index=True)  # UUID as string
    
    # Timestamps
    application_date = Column(DateTime(timezone=True), default=datetime.utcnow, server_default=func.now(), nullable=False)
    
    # Offer tracking fields
    offer_sent_date = Column(DateTime(timezone=True), nullable=True)  # When offer letter was sent
    offer_response_date = Column(DateTime(timezone=True), nullable=True)  # When candidate responded
    hired_date = Column(DateTime(timezone=True), nullable=True)  # When candidate was officially hired
    
    # Relationships
    student = relationship("User", back_populates="applications")  # Link to User (student)
    internship = relationship("Internship", back_populates="applications")