from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.company import Company
from app.models.internship import Internship
from app.models.application import Application

router = APIRouter()


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure the current user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this resource"
        )
    return current_user


@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get statistics for admin dashboard"""
    
    # Get total counts
    total_users = db.query(User).filter(User.role == "intern").count()
    total_companies = db.query(Company).count()
    total_internships = db.query(Internship).count()
    total_applications = db.query(Application).count()
    
    # Get counts for last month (for trend calculation)
    last_month = datetime.utcnow() - timedelta(days=30)
    
    # Get active internships
    active_internships = db.query(Internship).filter(
        Internship.status == "active"
    ).count()
    
    # Get verified companies
    verified_companies = db.query(Company).filter(
        Company.is_verified == True
    ).count()
    
    # Calculate growth trends (simplified - you can enhance this)
    # For now, we'll use placeholder percentages
    user_growth = 12
    company_growth = 8
    internship_growth = 15
    application_growth = 23
    
    return {
        "total_users": total_users,
        "total_companies": total_companies,
        "total_internships": total_internships,
        "total_applications": total_applications,
        "active_internships": active_internships,
        "verified_companies": verified_companies,
        "trends": {
            "users": user_growth,
            "companies": company_growth,
            "internships": internship_growth,
            "applications": application_growth
        }
    }


@router.get("/activities")
async def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get recent platform activities"""
    
    activities = []
    
    # Get recent applications
    recent_applications = db.query(Application).order_by(
        desc(Application.application_date)
    ).limit(limit).all()
    
    for app in recent_applications:
        intern = db.query(User).filter(User.id == app.intern_id).first()
        internship = db.query(Internship).filter(Internship.id == app.internship_id).first()
        company = db.query(Company).filter(Company.id == app.company_id).first()
        
        if intern and internship and company:
            activities.append({
                "id": app.id,
                "activity": f"{intern.name or intern.email} applied to {internship.title}",
                "timestamp": app.application_date.isoformat() if app.application_date else datetime.utcnow().isoformat(),
                "type": "application",
                "user_name": intern.name or intern.email,
                "company_name": company.company_name or company.email,
                "internship_title": internship.title
            })
    
    return activities


@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get audit logs for admin actions"""
    
    # For now, return sample data
    # In production, you would have an AuditLog model
    audit_logs = []
    
    # Get recent company verifications
    recent_companies = db.query(Company).filter(
        Company.is_verified == True
    ).order_by(desc(Company.id)).limit(limit // 2).all()
    
    for company in recent_companies:
        audit_logs.append({
            "id": f"audit_{company.id}_verified",
            "admin_user": "Admin",
            "action": "COMPANY_VERIFIED",
            "targetName": company.company_name or company.email,
            "targetType": "Company",
            "timestamp": datetime.utcnow().isoformat(),
            "details": f"Verified company: {company.company_name or company.email}"
        })
    
    # Get recent internship approvals
    recent_internships = db.query(Internship).filter(
        Internship.status == "active"
    ).order_by(desc(Internship.id)).limit(limit // 2).all()
    
    for internship in recent_internships:
        audit_logs.append({
            "id": f"audit_{internship.id}_approved",
            "admin_user": "Admin",
            "action": "INTERNSHIP_APPROVED",
            "targetName": internship.title,
            "targetType": "Internship",
            "timestamp": datetime.utcnow().isoformat(),
            "details": f"Approved internship: {internship.title}"
        })
    
    return audit_logs[:limit]


@router.get("/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all intern users with filtering"""
    
    query = db.query(User).filter(User.role == "intern")
    
    if search:
        query = query.filter(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.university.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    users = query.offset(skip).limit(limit).all()
    
    # Get application counts for each user
    user_data = []
    for user in users:
        application_count = db.query(Application).filter(
            Application.intern_id == user.id
        ).count()
        
        user_data.append({
            "id": user.id,
            "name": user.name or "N/A",
            "email": user.email,
            "university": user.university or "N/A",
            "course": user.major or "N/A",
            "year": user.graduation_year or "N/A",
            "skills": user.skills.split(",") if user.skills else [],
            "status": "Active",
            "dateJoined": datetime.utcnow().isoformat(),  # You can add a created_at field to User model
            "gpa": user.grading_score or "N/A",
            "profileCompletion": 85,  # Calculate based on filled fields
            "applications": application_count,
            "avatar": user.avatar_url or ""
        })
    
    return {
        "total": total,
        "users": user_data
    }


@router.get("/companies")
async def get_all_companies(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all companies with filtering"""
    
    query = db.query(Company)
    
    if search:
        query = query.filter(
            or_(
                Company.company_name.ilike(f"%{search}%"),
                Company.email.ilike(f"%{search}%"),
                Company.industry_type.ilike(f"%{search}%")
            )
        )
    
    if status_filter and status_filter != "all":
        if status_filter == "verified":
            query = query.filter(Company.is_verified == True)
        elif status_filter == "pending":
            query = query.filter(Company.is_verified == False)
        elif status_filter == "suspended":
            query = query.filter(Company.is_active == False)
    
    total = query.count()
    companies = query.offset(skip).limit(limit).all()
    
    # Get internship counts for each company
    company_data = []
    for company in companies:
        active_postings = db.query(Internship).filter(
            and_(
                Internship.company_id == company.id,
                Internship.status == "active"
            )
        ).count()
        
        # Determine status
        if not company.is_active:
            status = "suspended"
        elif company.is_verified:
            status = "verified"
        else:
            status = "pending"
        
        company_data.append({
            "id": company.id,
            "name": company.company_name or "N/A",
            "email": company.email,
            "industry": company.industry_type or "N/A",
            "size": "50-100",  # Add this field to Company model if needed
            "location": f"{company.city or ''}, {company.state or ''}".strip(", "),
            "website": company.company_website or "",
            "status": status,
            "dateJoined": datetime.utcnow().isoformat(),
            "activePostings": active_postings,
            "contactPerson": company.contact_person or "N/A",
            "phone": company.contact_number or "N/A"
        })
    
    return {
        "total": total,
        "companies": company_data
    }


@router.get("/internships")
async def get_all_internships(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status_filter: str = None,
    type_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all internships with filtering"""
    
    query = db.query(Internship)
    
    if search:
        query = query.filter(
            or_(
                Internship.title.ilike(f"%{search}%"),
                Internship.location.ilike(f"%{search}%"),
                Internship.category.ilike(f"%{search}%")
            )
        )
    
    if status_filter and status_filter != "all":
        query = query.filter(Internship.status == status_filter)
    
    if type_filter and type_filter != "all":
        query = query.filter(Internship.type == type_filter)
    
    total = query.count()
    internships = query.offset(skip).limit(limit).all()
    
    # Get company names and application counts
    internship_data = []
    for internship in internships:
        company = db.query(Company).filter(Company.id == internship.company_id).first()
        
        application_count = db.query(Application).filter(
            Application.internship_id == internship.id
        ).count()
        
        internship_data.append({
            "id": internship.id,
            "title": internship.title,
            "company": company.company_name if company else "Unknown",
            "location": internship.location or "Remote",
            "stipend": internship.stipend or 0,
            "applications": application_count,
            "status": internship.status or "active",
            "datePosted": internship.date_posted.isoformat() if internship.date_posted else datetime.utcnow().isoformat(),
            "deadline": internship.deadline.isoformat() if internship.deadline else None,
            "category": internship.category or "Technology",
            "type": internship.type or "Remote",
            "duration": internship.duration or "3 months",
            "salary": f"₹{internship.stipend:,}" if internship.stipend else "Unpaid",
            "featured": False  # Add this field to Internship model if needed
        })
    
    return {
        "total": total,
        "internships": internship_data
    }


@router.get("/analytics/user-growth")
async def get_user_growth(
    days: int = 30,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get user growth data for charts"""
    
    # Generate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # For now, return sample data
    # In production, you'd query actual user creation dates
    growth_data = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        growth_data.append({
            "date": date.isoformat(),
            "employers": i % 5,  # Sample data
            "interns": i % 10    # Sample data
        })
    
    return growth_data


@router.get("/analytics/weekly-activity")
async def get_weekly_activity(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get weekly activity data for charts"""
    
    # Generate last 7 days
    activity_data = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=6-i)
        
        # Count internships posted on this day
        postings = db.query(Internship).filter(
            func.date(Internship.date_posted) == date.date()
        ).count()
        
        # Count applications on this day
        applications = db.query(Application).filter(
            func.date(Application.application_date) == date.date()
        ).count()
        
        activity_data.append({
            "date": date.isoformat(),
            "postings": postings,
            "applications": applications
        })
    
    return activity_data


@router.patch("/companies/{company_id}/verify")
async def verify_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Verify a company"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.is_verified = True
    db.commit()
    db.refresh(company)
    
    return {"message": "Company verified successfully", "company": company}


@router.patch("/companies/{company_id}/suspend")
async def suspend_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend a company"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.is_active = False
    db.commit()
    db.refresh(company)
    
    return {"message": "Company suspended successfully", "company": company}


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a company and all associated data"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Delete associated internships and applications
    db.query(Internship).filter(Internship.company_id == company_id).delete()
    db.query(Application).filter(Application.company_id == company_id).delete()
    
    # Delete company
    db.delete(company)
    db.commit()
    
    return {"message": "Company deleted successfully"}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a user and all associated data"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin users")
    
    # Delete associated applications
    db.query(Application).filter(Application.intern_id == user_id).delete()
    
    # Delete user
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}


@router.delete("/internships/{internship_id}")
async def delete_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete an internship and all associated applications"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Delete associated applications
    db.query(Application).filter(Application.internship_id == internship_id).delete()
    
    # Delete internship
    db.delete(internship)
    db.commit()
    
    return {"message": "Internship deleted successfully"}


@router.patch("/internships/{internship_id}/approve")
async def approve_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Approve an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.status = "active"
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship approved successfully", "internship": internship}
