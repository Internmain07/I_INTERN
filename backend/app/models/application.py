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
    intern_id = Column(Integer, ForeignKey("users.id"))  # Changed to Integer to match users.id
    internship_id = Column(String, ForeignKey("internships.id"))  # UUID as string
    company_id = Column(String, ForeignKey("companies.id"))  # Company that posted the internship
    application_date = Column(DateTime(timezone=True), default=datetime.utcnow, server_default=func.now(), nullable=False)  # Timestamp of application
    
    # Offer tracking fields
    offer_sent_date = Column(DateTime(timezone=True), nullable=True)  # When offer letter was sent
    offer_response_date = Column(DateTime(timezone=True), nullable=True)  # When candidate responded
    hired_date = Column(DateTime(timezone=True), nullable=True)  # When candidate was officially hired

    intern = relationship("User", back_populates="applications")  # Changed from applicant
    internship = relationship("Internship", back_populates="applications")