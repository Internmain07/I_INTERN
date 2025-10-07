from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, index=True)  # Can be integer or UUID as string
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    company_website = Column(String, nullable=True)
    industry_type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    country = Column(String, nullable=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="company")

    # Relationships
    internships = relationship("Internship", back_populates="company")
