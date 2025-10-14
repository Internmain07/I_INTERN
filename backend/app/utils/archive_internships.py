"""
Utility script to archive expired internships
This should be run as a scheduled task (cron job) daily
"""
from datetime import date, datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.internship import Internship
from app.db.session import SessionLocal


def archive_expired_internships(db: Optional[Session] = None) -> dict:
    """
    Archive internships that have passed their deadline
    
    Args:
        db: Database session (optional, will create new one if not provided)
    
    Returns:
        dict: Summary of archived internships
    """
    # Create a new session if not provided
    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True
    
    try:
        today = date.today()
        
        # Find all active internships past their deadline
        expired_internships = db.query(Internship).filter(
            Internship.status == 'Active',
            Internship.deadline < today
        ).all()
        
        archived_count = 0
        archived_ids = []
        
        # Archive each expired internship
        for internship in expired_internships:
            internship.status = 'Archived'  # type: ignore
            internship.archived_at = datetime.now(timezone.utc)  # type: ignore
            archived_count += 1
            archived_ids.append(internship.id)
        
        # Commit the changes
        db.commit()
        
        return {
            "success": True,
            "archived_count": archived_count,
            "archived_ids": archived_ids,
            "message": f"Successfully archived {archived_count} expired internship(s)"
        }
    
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to archive expired internships"
        }
    
    finally:
        if close_session:
            db.close()


def get_internships_expiring_soon(days: int = 7, db: Optional[Session] = None) -> list:
    """
    Get internships expiring within the specified number of days
    Useful for sending reminder notifications to companies
    
    Args:
        days: Number of days to look ahead
        db: Database session (optional)
    
    Returns:
        list: List of internships expiring soon
    """
    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True
    
    try:
        from datetime import timedelta
        today = date.today()
        future_date = today + timedelta(days=days)
        
        expiring_internships = db.query(Internship).filter(
            Internship.status == 'Active',
            Internship.deadline >= today,
            Internship.deadline <= future_date
        ).all()
        
        return expiring_internships
    
    finally:
        if close_session:
            db.close()


if __name__ == "__main__":
    # For testing or running as a standalone script
    result = archive_expired_internships()
    print(result)
