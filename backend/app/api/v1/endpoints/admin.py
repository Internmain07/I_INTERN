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
        
        # Determine user status
        if user.is_suspended:
            user_status = "Suspended"
        else:
            user_status = "Active"
        
        user_data.append({
            "id": user.id,
            "name": user.name or "N/A",
            "email": user.email,
            "university": user.university or "N/A",
            "course": user.major or "N/A",
            "year": user.graduation_year or "N/A",
            "skills": user.skills.split(",") if user.skills else [],
            "status": user_status,
            "is_suspended": user.is_suspended,
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
        
        # Determine internship status
        if internship.is_suspended:
            internship_status = "suspended"
        else:
            internship_status = internship.status or "active"
        
        internship_data.append({
            "id": internship.id,
            "title": internship.title,
            "company": company.company_name if company else "Unknown",
            "location": internship.location or "Remote",
            "stipend": internship.stipend or 0,
            "applications": application_count,
            "status": internship_status,
            "is_suspended": internship.is_suspended,
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
    """Suspend a company - affects company table, user table, and all internships"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Suspend in company table
        company.is_active = False
        
        # Suspend in users table
        user = db.query(User).filter(User.email == company.email).first()
        if user:
            user.is_suspended = True
        
        # Suspend all internships
        suspended_internships = db.query(Internship).filter(
            Internship.company_id == company_id
        ).update({"is_suspended": True}, synchronize_session=False)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company suspended successfully",
            "company": company,
            "details": {
                "user_suspended": user is not None,
                "internships_suspended": suspended_internships
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error suspending company: {str(e)}"
        )


@router.patch("/companies/{company_id}/unsuspend")
async def unsuspend_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend a company - restores company table, user table, and all internships"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Unsuspend in company table
        company.is_active = True
        
        # Unsuspend in users table
        user = db.query(User).filter(User.email == company.email).first()
        if user:
            user.is_suspended = False
        
        # Unsuspend all internships
        unsuspended_internships = db.query(Internship).filter(
            Internship.company_id == company_id
        ).update({"is_suspended": False}, synchronize_session=False)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company unsuspended successfully",
            "company": company,
            "details": {
                "user_unsuspended": user is not None,
                "internships_unsuspended": unsuspended_internships
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error unsuspending company: {str(e)}"
        )


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a company and all associated data with full cascade"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Get all internships for this company
        internships = db.query(Internship).filter(Internship.company_id == company_id).all()
        internship_ids = [i.id for i in internships]
        
        # Delete all applications for these internships
        deleted_apps = db.query(Application).filter(
            Application.company_id == company_id
        ).delete(synchronize_session=False)
        
        # Also delete applications by internship_id
        if internship_ids:
            db.query(Application).filter(
                Application.internship_id.in_(internship_ids)
            ).delete(synchronize_session=False)
        
        # Delete all internships
        deleted_internships = db.query(Internship).filter(
            Internship.company_id == company_id
        ).delete(synchronize_session=False)
        
        # Delete the user account associated with this company
        user = db.query(User).filter(User.email == company.email).first()
        if user:
            db.delete(user)
        
        # Delete company record
        db.delete(company)
        db.commit()
        
        return {
            "message": "Company deleted successfully",
            "deleted_company_id": company_id,
            "details": {
                "internships_deleted": deleted_internships,
                "applications_deleted": deleted_apps,
                "user_account_deleted": user is not None
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting company: {str(e)}"
        )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a user and all associated data with full cascade"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin users")
    
    try:
        # If intern, delete all related data
        if user.role == "intern":
            # Delete all applications
            deleted_apps = db.query(Application).filter(Application.intern_id == user_id).delete(synchronize_session=False)
            
            # Delete work experiences (if exists)
            try:
                from app.models.work_experience import WorkExperience
                db.query(WorkExperience).filter(WorkExperience.user_id == user_id).delete(synchronize_session=False)
            except:
                pass
            
            # Delete projects (if exists)
            try:
                from app.models.project import Project
                db.query(Project).filter(Project.user_id == user_id).delete(synchronize_session=False)
            except:
                pass
        
        # If company account, handle company-related data
        elif user.role == "company":
            # Find the company record
            company = db.query(Company).filter(Company.email == user.email).first()
            if company:
                # Delete all internships and their applications
                internships = db.query(Internship).filter(Internship.company_id == company.id).all()
                for internship in internships:
                    db.query(Application).filter(Application.internship_id == internship.id).delete(synchronize_session=False)
                
                # Delete all internships
                db.query(Internship).filter(Internship.company_id == company.id).delete(synchronize_session=False)
                
                # Delete company record
                db.delete(company)
        
        # Finally delete the user from users table
        db.delete(user)
        db.commit()
        
        return {
            "message": "User deleted successfully",
            "deleted_user_id": user_id,
            "details": "All associated data has been removed from the database"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error deleting user: {str(e)}"
        )


@router.delete("/internships/{internship_id}")
async def delete_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete an internship and all associated applications with full cascade"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    try:
        # Delete all applications for this internship
        deleted_apps = db.query(Application).filter(
            Application.internship_id == internship_id
        ).delete(synchronize_session=False)
        
        # Store internship details for response
        internship_title = internship.title
        company_id = internship.company_id
        
        # Delete internship
        db.delete(internship)
        db.commit()
        
        return {
            "message": "Internship deleted successfully",
            "deleted_internship_id": internship_id,
            "internship_title": internship_title,
            "details": {
                "applications_deleted": deleted_apps
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting internship: {str(e)}"
        )


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


@router.patch("/users/{user_id}/suspend")
async def suspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend a user account - affects both users table and related data"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot suspend admin users")
    
    try:
        # Suspend in users table
        user.is_suspended = True
        
        # If company user, also suspend the company and all internships
        if user.role == "company":
            company = db.query(Company).filter(Company.email == user.email).first()
            if company:
                company.is_active = False
                # Suspend all company's internships
                db.query(Internship).filter(Internship.company_id == company.id).update(
                    {"is_suspended": True},
                    synchronize_session=False
                )
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User suspended successfully",
            "user_id": user.id,
            "is_suspended": user.is_suspended,
            "role": user.role
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error suspending user: {str(e)}"
        )


@router.patch("/users/{user_id}/unsuspend")
async def unsuspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend a user account - restores both users table and related data"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Unsuspend in users table
        user.is_suspended = False
        
        # If company user, also unsuspend the company and all internships
        if user.role == "company":
            company = db.query(Company).filter(Company.email == user.email).first()
            if company:
                company.is_active = True
                # Optionally unsuspend all company's internships
                db.query(Internship).filter(Internship.company_id == company.id).update(
                    {"is_suspended": False},
                    synchronize_session=False
                )
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User unsuspended successfully",
            "user_id": user.id,
            "is_suspended": user.is_suspended,
            "role": user.role
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error unsuspending user: {str(e)}"
        )


@router.patch("/internships/{internship_id}/suspend")
async def suspend_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_suspended = True
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship suspended successfully", "internship_id": internship.id, "is_suspended": internship.is_suspended}


@router.patch("/internships/{internship_id}/unsuspend")
async def unsuspend_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_suspended = False
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship unsuspended successfully", "internship_id": internship.id, "is_suspended": internship.is_suspended}


# Enhanced Admin Database Management Endpoints

@router.patch("/users/{user_id}/update")
async def update_user(
    user_id: int,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for user fields - Admin has full power"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(user, field) and field not in ['id', 'hashed_password']:
                setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User updated successfully",
            "user_id": user.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating user: {str(e)}"
        )


@router.patch("/companies/{company_id}/update")
async def update_company(
    company_id: str,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for company fields - Admin has full power"""
    
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(company, field) and field not in ['id', 'hashed_password']:
                setattr(company, field, value)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company updated successfully",
            "company_id": company.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating company: {str(e)}"
        )


@router.patch("/internships/{internship_id}/update")
async def update_internship(
    internship_id: str,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for internship fields - Admin has full power"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(internship, field) and field != 'id':
                setattr(internship, field, value)
        
        db.commit()
        db.refresh(internship)
        
        return {
            "message": "Internship updated successfully",
            "internship_id": internship.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating internship: {str(e)}"
        )


@router.post("/database/cleanup")
async def cleanup_orphaned_records(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Clean up orphaned records in the database"""
    
    try:
        cleanup_report = {
            "orphaned_applications": 0,
            "orphaned_internships": 0,
            "orphaned_companies": 0
        }
        
        # Find and delete applications with non-existent interns
        all_user_ids = [u.id for u in db.query(User.id).all()]
        orphaned_apps = db.query(Application).filter(
            ~Application.intern_id.in_(all_user_ids)
        ).delete(synchronize_session=False)
        cleanup_report["orphaned_applications"] = orphaned_apps
        
        # Find and delete internships with non-existent companies
        all_company_ids = [c.id for c in db.query(Company.id).all()]
        orphaned_internships = db.query(Internship).filter(
            ~Internship.company_id.in_(all_company_ids)
        ).delete(synchronize_session=False)
        cleanup_report["orphaned_internships"] = orphaned_internships
        
        # Find companies without corresponding user accounts
        all_company_emails = [c.email for c in db.query(Company.email).all()]
        all_user_emails = [u.email for u in db.query(User.email).filter(User.role == "company").all()]
        
        db.commit()
        
        return {
            "message": "Database cleanup completed successfully",
            "report": cleanup_report
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error during cleanup: {str(e)}"
        )


@router.get("/database/integrity-check")
async def check_database_integrity(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Check database integrity and report issues"""
    
    try:
        issues = []
        
        # Check for users without email verification
        unverified_users = db.query(User).filter(
            User.email_verified == "false"
        ).count()
        
        # Check for suspended users count
        suspended_users = db.query(User).filter(
            User.is_suspended == True
        ).count()
        
        # Check for companies without user accounts
        companies = db.query(Company).all()
        companies_without_users = 0
        for company in companies:
            user = db.query(User).filter(User.email == company.email).first()
            if not user:
                companies_without_users += 1
                issues.append({
                    "type": "missing_user_account",
                    "company_id": company.id,
                    "company_email": company.email
                })
        
        # Check for applications referencing deleted internships
        all_internship_ids = [i.id for i in db.query(Internship.id).all()]
        orphaned_applications = db.query(Application).filter(
            ~Application.internship_id.in_(all_internship_ids) if all_internship_ids else True
        ).count()
        
        report = {
            "total_users": db.query(User).count(),
            "total_companies": db.query(Company).count(),
            "total_internships": db.query(Internship).count(),
            "total_applications": db.query(Application).count(),
            "unverified_users": unverified_users,
            "suspended_users": suspended_users,
            "companies_without_users": companies_without_users,
            "orphaned_applications": orphaned_applications,
            "issues": issues,
            "health_status": "healthy" if len(issues) == 0 else "needs_attention"
        }
        
        return report
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error checking database integrity: {str(e)}"
        )


