from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid
from datetime import date, datetime, timedelta
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
    
    # Get all internships for this company
    company_internships = db.query(InternshipModel).filter(
        InternshipModel.company_id == current_company.id
    ).all()
    
    # Calculate total internships
    total_internships = len(company_internships)
    
    # Calculate active internships (status = 'Active')
    active_internships = len([i for i in company_internships if i.status == 'Active'])
    
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
        if app.status.lower() in ['hired', 'accepted', 'offer accepted', 'offer_accepted']
    ])
    
    # Calculate pending reviews
    pending_reviews = len([
        app for app in all_applications 
        if app.status.lower() in ['pending', 'under review']
    ])
    
    return {
        "total_internships": total_internships,
        "active_internships": active_internships,
        "total_applicants": total_applicants,
        "total_hires": total_hires,
        "pending_reviews": pending_reviews
    }

@router.get("/company/analytics/monthly-applications")
def get_monthly_applications(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get monthly applications trend for the last 6 months"""
    
    # Get all internships for this company
    company_internships = db.query(InternshipModel).filter(
        InternshipModel.company_id == current_company.id
    ).all()
    
    internship_ids = [internship.id for internship in company_internships]
    
    if not internship_ids:
        return {"months": [], "data": []}
    
    # Get applications for the last 6 months
    six_months_ago = datetime.now() - timedelta(days=180)
    
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
        InternshipModel.company_id == current_company.id
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
        company_id=str(current_company.id),
        **internship_data
    )
    
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

@router.get("/", response_model=List[Internship])
def read_internships(db: Session = Depends(deps.get_db)):
    internships = db.query(InternshipModel).all()
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.company:
            internship.company_name = internship.company.company_name
        # Count applications for this internship
        internship.applicant_count = len(internship.applications)
    return internships

@router.get("/with-match", response_model=List[Dict[str, Any]])
def read_internships_with_match(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get all internships with match percentages for the current student"""
    internships = db.query(InternshipModel).filter(InternshipModel.status == 'Active').all()
    
    internships_with_match = []
    for internship in internships:
        # Calculate match percentage
        match_details = calculate_detailed_match(
            user_skills=current_user.skills,
            required_skills=internship.required_skills or internship.skills,
            user_level=None,  # Can be added to user profile later
            internship_level=internship.level
        )
        
        internship_data = {
            "id": internship.id,
            "title": internship.title,
            "description": internship.description,
            "company_id": internship.company_id,
            "company_name": internship.company.company_name if internship.company else None,
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
        InternshipModel.company_id == current_company.id
    ).all()
    # Add company_name and applicant_count to each internship
    for internship in internships:
        if internship.company:
            internship.company_name = internship.company.company_name
        # Count applications for this internship
        internship.applicant_count = len(internship.applications)
    return internships

@router.get("/{internship_id}", response_model=Internship)
def read_internship(internship_id: str, db: Session = Depends(deps.get_db)):
    """Get a single internship by ID"""
    internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    # Add company_name and applicant_count
    if internship.company:
        internship.company_name = internship.company.company_name
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
    if not db_internship or db_internship.company_id != current_company.id:
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
    
    print(f"DEBUG: Found internship with company_id: {db_internship.company_id}")
    print(f"DEBUG: Comparing: '{db_internship.company_id}' == '{current_company.id}'")
    print(f"DEBUG: Types: {type(db_internship.company_id)} vs {type(current_company.id)}")
    
    if db_internship.company_id != current_company.id:
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
    if not db_internship or db_internship.company_id != current_company.id:
        raise HTTPException(status_code=404, detail="Internship not found")

    db.delete(db_internship)
    db.commit()
    return db_internship