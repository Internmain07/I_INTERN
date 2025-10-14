from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import uuid
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import func, extract
from app.api import deps
from app.schemas.internship import Internship, InternshipCreate, InternshipUpdate, InternshipPartialUpdate
from app.models.internship import Internship as InternshipModel
from app.models.company import Company
from app.models.application import Application as ApplicationModel
from app.models.user import User
from app.utils.matching import calculate_skills_match, calculate_detailed_match

router = APIRouter()

@router.get("/company/dashboard-stats")
def get_company_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get dashboard statistics for the logged-in company"""
    
    try:
        # Get all internships for this company
        company_internships = db.query(InternshipModel).filter(
            InternshipModel.employer_profile_id == current_company.id
        ).all()
        
        # Calculate total internships
        total_internships = len(company_internships)
        
        # Calculate active internships (status = 'Active' or 'active')
        active_internships = len([i for i in company_internships if str(i.status).lower() == 'active'])
        
        # Get all applications for this company's internships
        internship_ids = [internship.id for internship in company_internships]
        all_applications = db.query(ApplicationModel).filter(
            ApplicationModel.internship_id.in_(internship_ids)
        ).all() if internship_ids else []
        
        # Calculate total applicants
        total_applicants = len(all_applications)
        
        # Calculate total hires (applications with status 'Hired' or 'Accepted')
        total_hires = len([
            app for app in all_applications 
            if app.status and app.status.lower() in ['hired', 'accepted', 'offer accepted', 'offer_accepted']
        ])
        
        # Calculate pending reviews
        pending_reviews = len([
            app for app in all_applications 
            if app.status and app.status.lower() in ['pending', 'under review']
        ])
        
        # Calculate time-based statistics
        now = datetime.now(timezone.utc)
        one_week_ago = now - timedelta(days=7)
        one_month_ago = now - timedelta(days=30)
        
        # Helper function to safely parse dates
        def parse_date_safely(date_value):
            """Safely parse date from various formats"""
            if date_value is None:
                return None
            try:
                # If it's already a datetime object
                if isinstance(date_value, datetime):
                    return date_value.replace(tzinfo=timezone.utc) if date_value.tzinfo is None else date_value
                # If it's a date object (not datetime)
                if isinstance(date_value, date):
                    return datetime.combine(date_value, datetime.min.time()).replace(tzinfo=timezone.utc)
                # If it's a string, try parsing
                if isinstance(date_value, str):
                    # Try ISO format first
                    try:
                        parsed = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
                        return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed
                    except:
                        # Try parsing as date only
                        try:
                            parsed_date = date.fromisoformat(date_value)
                            return datetime.combine(parsed_date, datetime.min.time()).replace(tzinfo=timezone.utc)
                        except:
                            pass
                return None
            except Exception as e:
                print(f"Error parsing date {date_value}: {e}")
                return None
        
        # New internships this week
        new_internships_week = 0
        for i in company_internships:
            posted_date = parse_date_safely(i.date_posted)
            if posted_date and posted_date >= one_week_ago:
                new_internships_week += 1
        
        # New applicants this month
        new_applicants_month = 0
        for app in all_applications:
            app_date = parse_date_safely(app.application_date)
            if app_date and app_date >= one_month_ago:
                new_applicants_month += 1
        
        # Previous month applicants for percentage calculation
        two_months_ago = now - timedelta(days=60)
        prev_month_applicants = 0
        for app in all_applications:
            app_date = parse_date_safely(app.application_date)
            if app_date and two_months_ago <= app_date < one_month_ago:
                prev_month_applicants += 1
        
        # Calculate applicants percentage change
        applicants_change = 0
        if prev_month_applicants > 0:
            applicants_change = ((new_applicants_month - prev_month_applicants) / prev_month_applicants) * 100
        elif new_applicants_month > 0:
            applicants_change = 100  # 100% increase if we had 0 before
        
        # New hires this month
        new_hires_month = 0
        for app in all_applications:
            if app.status and app.status.lower() in ['hired', 'accepted', 'offer accepted', 'offer_accepted']:
                app_date = parse_date_safely(app.application_date)
                if app_date and app_date >= one_month_ago:
                    new_hires_month += 1
        
        # Ending soon (within 2 weeks)
        two_weeks_later = now + timedelta(days=14)
        ending_soon = 0
        for i in company_internships:
            if str(i.status).lower() == 'active' and i.deadline is not None:
                deadline_date = parse_date_safely(i.deadline)
                if deadline_date and deadline_date <= two_weeks_later:
                    ending_soon += 1
        
        return {
            "total_internships": total_internships,
            "active_internships": active_internships,
            "total_applicants": total_applicants,
            "total_hires": total_hires,
            "pending_reviews": pending_reviews,
            "new_internships_week": new_internships_week,
            "new_applicants_month": new_applicants_month,
            "applicants_change_percent": round(applicants_change, 1),
            "new_hires_month": new_hires_month,
            "ending_soon": ending_soon
        }
    
    except Exception as e:
        # Log the full error for debugging
        import traceback
        error_trace = traceback.format_exc()
        print(f"ERROR in dashboard-stats endpoint: {str(e)}")
        print(f"Full traceback:\n{error_trace}")
        
        # Return a more informative error response
        raise HTTPException(
            status_code=500,
            detail=f"Error generating dashboard statistics: {str(e)}"
        )

@router.get("/company/analytics/monthly-applications")
def get_monthly_applications(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get monthly applications trend for the last 6 months"""
    
    # Get all internships for this company
    company_internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id
    ).all()
    
    internship_ids = [internship.id for internship in company_internships]
    
    if not internship_ids:
        return {"months": [], "data": []}
    
    # Get applications for the last 6 months
    six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
    
    applications = db.query(
        extract('month', ApplicationModel.application_date).label('month'),
        extract('year', ApplicationModel.application_date).label('year'),
        func.count(ApplicationModel.id).label('total'),
        func.sum(func.case((ApplicationModel.status.in_(['Hired', 'hired', 'Accepted', 'accepted']), 1), else_=0)).label('hired'),
        func.sum(func.case((ApplicationModel.status.in_(['Rejected', 'rejected']), 1), else_=0)).label('rejected')
    ).filter(
        ApplicationModel.internship_id.in_(internship_ids),
        ApplicationModel.application_date >= six_months_ago
    ).group_by('month', 'year').order_by('year', 'month').all()
    
    # Format the data
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    result = []
    for app in applications:
        month_name = month_names[int(app.month) - 1]
        result.append({
            "month": month_name,
            "total_applications": int(app.total) if app.total else 0,
            "hired": int(app.hired) if app.hired else 0,
            "rejected": int(app.rejected) if app.rejected else 0
        })
    
    return result

@router.get("/company/analytics/hiring-funnel")
def get_hiring_funnel(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get hiring funnel data showing application flow through stages"""
    
    # Get all internships for this company
    company_internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id
    ).all()
    
    internship_ids = [internship.id for internship in company_internships]
    
    if not internship_ids:
        return {
            "applied": 0,
            "screened": 0,
            "interviewed": 0,
            "offered": 0,
            "hired": 0
        }
    
    # Get all applications
    all_applications = db.query(ApplicationModel).filter(
        ApplicationModel.internship_id.in_(internship_ids)
    ).all()
    
    # Count applications by stage
    applied = len(all_applications)
    screened = len([app for app in all_applications if app.status.lower() in ['reviewed', 'under review', 'shortlisted', 'offered', 'accepted', 'hired']])
    interviewed = len([app for app in all_applications if app.status.lower() in ['shortlisted', 'offered', 'accepted', 'hired']])
    offered = len([app for app in all_applications if app.status.lower() in ['offered', 'accepted', 'hired']])
    hired = len([app for app in all_applications if app.status.lower() in ['accepted', 'hired']])
    
    return {
        "applied": applied,
        "screened": screened,
        "interviewed": interviewed,
        "offered": offered,
        "hired": hired
    }

@router.post("/", response_model=Internship)
def create_internship(
    internship_in: InternshipCreate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    # Generate UUID for the internship
    internship_id = str(uuid.uuid4())
    
    # Set date_posted to today if not provided
    internship_data = internship_in.dict()
    if not internship_data.get('date_posted'):
        internship_data['date_posted'] = date.today()
    
    # Create internship with generated ID and company_id from auth
    db_internship = InternshipModel(
        id=internship_id,
        employer_profile_id=current_company.id,
        **internship_data
    )
    
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

@router.get("/", response_model=List[Internship])
def read_internships(db: Session = Depends(deps.get_db)):
    """Get all visible internships (publicly accessible for interns)

    This endpoint will return internships that are not explicitly archived/closed/draft
    and are not suspended by admin. It will also respect the deadline (include
    those with no deadline or whose deadline hasn't passed).
    """
    # Exclude internships with statuses that should not be publicly visible
    excluded_statuses = ['archived', 'closed', 'draft']

    internships = db.query(InternshipModel).filter(
        # Exclude suspended postings
        InternshipModel.is_suspended != True,
        # Exclude explicit negative statuses (case-insensitive). This keeps
        # internships with NULL/empty/unknown status (e.g. transferred) visible.
        func.lower(func.coalesce(InternshipModel.status, '')).notin_(excluded_statuses),
        # Include internships with no deadline or deadline not passed
        func.coalesce(InternshipModel.deadline, date.today() + timedelta(days=365)) >= date.today()
    ).all()
    
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.employer_profile:
            internship.company_name = internship.employer_profile.company_name
            internship.company_logo = internship.employer_profile.logo_url
        internship.applicant_count = len(internship.applications)
    return internships

@router.get("/with-match", response_model=List[Dict[str, Any]])
def read_internships_with_match(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get all internships with match percentages for the current student"""
    # Mirror the public visibility rules used by `read_internships` so that
    # recommendations only include postings that should be visible to interns.
    excluded_statuses = ['archived', 'closed', 'draft']
    internships = db.query(InternshipModel).filter(
        InternshipModel.is_suspended != True,
        func.lower(func.coalesce(InternshipModel.status, '')).notin_(excluded_statuses),
        func.coalesce(InternshipModel.deadline, date.today() + timedelta(days=365)) >= date.today()
    ).all()
    
    # Get user skills from student profile
    user_skills = ""
    if current_user.student_profile and current_user.student_profile.skills:
        if isinstance(current_user.student_profile.skills, list):
            user_skills = ", ".join(current_user.student_profile.skills)
        else:
            user_skills = str(current_user.student_profile.skills)
    
    internships_with_match = []
    for internship in internships:
        # Calculate match percentage
        match_details = calculate_detailed_match(
            user_skills=user_skills,
            required_skills=str(internship.required_skills or internship.skills or ""),
            user_level="",  # Can be added to user profile later
            internship_level=str(internship.level or "")
        )
        
        internship_data = {
            "id": internship.id,
            "title": internship.title,
            "description": internship.description,
            "company_id": str(internship.employer_profile_id),
            "company_name": internship.employer_profile.company_name if internship.employer_profile else None,
            "company_logo": internship.employer_profile.logo_url if internship.employer_profile else None,
            "location": internship.location,
            "stipend": internship.stipend,
            "duration": internship.duration,
            "type": internship.type,
            "level": internship.level,
            "category": internship.category,
            "skills": internship.skills,
            "requirements": internship.requirements,
            "benefits": internship.benefits,
            "required_skills": internship.required_skills,
            "deadline": internship.deadline,
            "date_posted": internship.date_posted,
            "status": internship.status,
            "applicant_count": len(internship.applications),
            "match_percentage": match_details['match_percentage'],
            "match_score": f"{match_details['match_percentage']:.0f}%",
            "skill_match": match_details['skill_match_percentage'],
            "matching_skills": match_details['matching_skills'],
            "missing_skills": match_details['missing_skills'],
        }
        
        internships_with_match.append(internship_data)
    
    # Sort by match percentage descending
    internships_with_match.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    return internships_with_match

@router.get("/company/my-internships", response_model=List[Internship])
def read_company_internships(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get all internships posted by the current company"""
    internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id
    ).all()
    for internship in internships:
        if internship.employer_profile:
            internship.company_name = internship.employer_profile.company_name
            internship.company_logo = internship.employer_profile.logo_url
        internship.applicant_count = len(internship.applications)
    return internships

@router.get("/company/{internship_id}", response_model=Internship)
def read_company_internship(
    internship_id: str,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get a specific internship that belongs to the logged-in company"""
    internship = db.query(InternshipModel).filter(
        InternshipModel.id == internship_id,
        InternshipModel.employer_profile_id == current_company.id
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.employer_profile:
        internship.company_name = internship.employer_profile.company_name
        internship.company_logo = internship.employer_profile.logo_url
    internship.applicant_count = len(internship.applications)
    return internship

@router.get("/{internship_id}", response_model=Internship)
def read_internship(
    internship_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern)
):
    """
    Get detailed internship information by ID
    
    - **Requires**: Authentication (JWT token)
    - **Role**: Intern/Student
    - **Returns**: Full internship details including company info and applicant count
    """
    internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    # Add company_name and applicant_count
    if internship.employer_profile:
        internship.company_name = internship.employer_profile.company_name
        internship.company_logo = internship.employer_profile.logo_url
    internship.applicant_count = len(internship.applications)
    return internship

@router.get("/public/{internship_id}", response_model=Internship)
def read_public_internship(
    internship_id: str,
    db: Session = Depends(deps.get_db)
):
    """
    Get detailed internship information by ID (public access)
    
    - **No Authentication Required**: Can be accessed without login
    - **Use Case**: For sharing internship links publicly
    - **Returns**: Full internship details including company info (no match percentage)
    """
    internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Do not show if suspended or explicitly archived/closed/draft
    if internship.is_suspended:
        raise HTTPException(status_code=404, detail="Internship not available")
    if str(internship.status or '').lower() in ['archived', 'closed', 'draft']:
        raise HTTPException(status_code=404, detail="Internship not available")
    
    # Add company_name and applicant_count
    if internship.employer_profile:
        internship.company_name = internship.employer_profile.company_name
        internship.company_logo = internship.employer_profile.logo_url
    internship.applicant_count = len(internship.applications)
    return internship


@router.put("/{internship_id}", response_model=Internship)
def update_internship(
    internship_id: str,  # Changed to string for UUID
    internship_in: InternshipUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not db_internship or str(db_internship.employer_profile_id) != str(current_company.id):
        raise HTTPException(status_code=404, detail="Internship not found")

    for var, value in vars(internship_in).items():
        setattr(db_internship, var, value) if value else None

    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

@router.patch("/{internship_id}", response_model=Internship)
def partial_update_internship(
    internship_id: str,
    internship_in: InternshipPartialUpdate,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Partially update an internship (only provided fields)"""
    print(f"DEBUG: PATCH request for internship_id: {internship_id}")
    print(f"DEBUG: Current company ID: {current_company.id}")
    print(f"DEBUG: Update data: {internship_in.dict(exclude_unset=True)}")
    
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    
    if not db_internship:
        print(f"DEBUG: Internship not found in database!")
        raise HTTPException(status_code=404, detail="Internship not found")
    
    print(f"DEBUG: Found internship with employer_profile_id: {db_internship.employer_profile_id}")
    print(f"DEBUG: Comparing: '{db_internship.employer_profile_id}' == '{current_company.id}'")
    print(f"DEBUG: Types: {type(db_internship.employer_profile_id)} vs {type(current_company.id)}")
    if str(db_internship.employer_profile_id) != str(current_company.id):
        print(f"DEBUG: Ownership check failed!")
        raise HTTPException(status_code=404, detail="Internship not found")
    print(f"DEBUG: Ownership check passed, updating...")

    # Update only provided fields
    update_data = internship_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_internship, field, value)

    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    print(f"DEBUG: Update successful! New status: {db_internship.status}")
    return db_internship

@router.delete("/{internship_id}", response_model=Internship)
def delete_internship(
    internship_id: str,  # Changed to string for UUID
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not db_internship or str(db_internship.employer_profile_id) != str(current_company.id):
        raise HTTPException(status_code=404, detail="Internship not found")

    # Delete all applications associated with this internship first
    # This prevents foreign key constraint violations
    applications = db.query(ApplicationModel).filter(
        ApplicationModel.internship_id == internship_id
    ).all()
    
    for application in applications:
        db.delete(application)
    
    # Now delete the internship
    db.delete(db_internship)
    db.commit()
    return db_internship


# ========== NEW ARCHIVING & FILTERING ENDPOINTS ==========

@router.post("/archive-expired")
def archive_expired_internships(
    db: Session = Depends(deps.get_db)
):
    """
    Archive all internships that have passed their deadline
    This can be called manually or scheduled as a cron job
    """
    today = date.today()
    
    # Find all active internships past their deadline
    expired_internships = db.query(InternshipModel).filter(
        InternshipModel.status == 'Active',
        InternshipModel.deadline < today
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


@router.get("/company/archived", response_model=List[Internship])
def get_archived_internships(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get all archived internships for the current company"""
    internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id,
        InternshipModel.status == 'Archived'
    ).order_by(InternshipModel.archived_at.desc()).all()
    
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.company:
            internship.company_name = internship.company.company_name
            internship.company_logo = internship.company.logo_url
        internship.applicant_count = len(internship.applications)
    
    return internships


@router.get("/company/active", response_model=List[Internship])
def get_active_internships(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get all active internships for the current company"""
    internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id,
        InternshipModel.status == 'Active'
    ).order_by(InternshipModel.date_posted.desc()).all()
    
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.company:
            internship.company_name = internship.company.company_name
            internship.company_logo = internship.company.logo_url
        internship.applicant_count = len(internship.applications)
    
    return internships


@router.get("/company/drafts", response_model=List[Internship])
def get_draft_internships(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get all draft internships for the current company"""
    internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id,
        InternshipModel.status == 'Draft'
    ).order_by(InternshipModel.date_posted.desc()).all()
    
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.company:
            internship.company_name = internship.company.company_name
            internship.company_logo = internship.company.logo_url
        internship.applicant_count = len(internship.applications)
    
    return internships


@router.post("/{internship_id}/archive")
def manually_archive_internship(
    internship_id: str,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Manually archive an internship before its deadline"""
    db_internship = db.query(InternshipModel).filter(
        InternshipModel.id == internship_id
    ).first()
    
    if not db_internship or str(db_internship.employer_profile_id) != str(current_company.id):
        raise HTTPException(status_code=404, detail="Internship not found")
    
    db_internship.status = 'Archived'  # type: ignore
    db_internship.archived_at = datetime.now(timezone.utc)  # type: ignore
    
    db.commit()
    db.refresh(db_internship)
    
    return {
        "success": True,
        "message": "Internship archived successfully",
        "internship_id": internship_id
    }


@router.post("/{internship_id}/clone", response_model=Internship)
def clone_internship(
    internship_id: str,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Clone an existing internship (useful for relisting archived positions)"""
    db_internship = db.query(InternshipModel).filter(
        InternshipModel.id == internship_id
    ).first()
    
    if not db_internship or str(db_internship.employer_profile_id) != str(current_company.id):
        raise HTTPException(status_code=404, detail="Internship not found")

    # Create a new internship with same data
    new_id = str(uuid.uuid4())
    cloned_internship = InternshipModel(
        id=new_id,
        employer_profile_id=current_company.id,
        title=db_internship.title,
        description=db_internship.description,
        location=db_internship.location,
        stipend=db_internship.stipend,
        duration=db_internship.duration,
        type=db_internship.type,
        level=db_internship.level,
        category=db_internship.category,
        skills=db_internship.skills,
        requirements=db_internship.requirements,
        benefits=db_internship.benefits,
        required_skills=db_internship.required_skills,
        deadline=None,  # User must set new deadline
        date_posted=date.today(),
        status='Draft'  # Clone as draft
    )

    db.add(cloned_internship)
    db.commit()
    db.refresh(cloned_internship)

    return cloned_internship


@router.get("/expiring-soon")
def get_internships_expiring_soon(
    days: int = 7,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get internships for the current company expiring within specified days"""
    today = date.today()
    future_date = today + timedelta(days=days)
    
    expiring_internships = db.query(InternshipModel).filter(
        InternshipModel.employer_profile_id == current_company.id,
        InternshipModel.status == 'Active',
        InternshipModel.deadline >= today,
        InternshipModel.deadline <= future_date
    ).all()
    
    result = []
    for internship in expiring_internships:
        days_remaining = (internship.deadline - today).days
        result.append({
            "id": internship.id,
            "title": internship.title,
            "deadline": internship.deadline,
            "days_remaining": days_remaining,
            "applicant_count": len(internship.applications)
        })
    
    return {
        "expiring_count": len(result),
        "internships": result
    }
