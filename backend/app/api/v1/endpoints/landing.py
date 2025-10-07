from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.internship import Internship
from app.models.company import Company
from app.models.user import User

router = APIRouter()

@router.get("/stats")
def get_landing_page_stats(db: Session = Depends(get_db)):
    """
    Provides statistics for the landing page from the database.
    """
    # Count total internships posted
    internships_count = db.query(Internship).count()
    
    # Count total companies registered
    companies_count = db.query(Company).count()
    
    # Count total interns (users with role 'intern')
    interns_count = db.query(User).filter(User.role == "intern").count()
    
    return {
        "internships_posted": internships_count,
        "companies_registered": companies_count,
        "students_placed": interns_count
    }