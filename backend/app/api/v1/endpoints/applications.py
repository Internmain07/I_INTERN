from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.api import deps
from app.schemas.application import Application, ApplicationCreate
from app.models.application import Application as ApplicationModel
from app.models.internship import Internship as InternshipModel
from app.models.user import User
from app.models.company import Company
from app.utils.matching import calculate_skills_match, calculate_detailed_match

router = APIRouter()


@router.post("/", response_model=Application)
def apply_for_internship(
    application_in: ApplicationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == application_in.internship_id).first()
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Check if already applied
    existing_application = db.query(ApplicationModel).filter(
        ApplicationModel.intern_id == current_user.id,  # Use integer ID directly
        ApplicationModel.internship_id == application_in.internship_id
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied to this internship")

    # Generate UUID for the application
    application_id = str(uuid.uuid4())
    
    db_application = ApplicationModel(
        id=application_id,
        intern_id=current_user.id,  # Use integer ID directly, not string
        internship_id=application_in.internship_id,
        company_id=db_internship.company_id,  # Set company_id from the internship
        application_date=datetime.utcnow()  # Explicitly set application date
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@router.get("/my-applications")
def get_my_applications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get all applications for the current intern with full internship and company details, sorted by status priority"""
    # Define status priority for sorting (lower number = higher priority)
    status_priority = {
        'offered': 1,
        'accepted': 2,
        'pending': 3,
        'reviewed': 4,
        'rejected': 5,
        'declined': 6
    }
    
    applications = db.query(ApplicationModel).filter(ApplicationModel.intern_id == current_user.id).all()
    
    applications_list = []
    for app in applications:
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        company = db.query(Company).filter(Company.id == app.company_id).first()
        
        if internship and company:
            applications_list.append({
                "id": app.id,
                "application_id": app.id,
                "internship_id": internship.id,
                "title": internship.title,
                "position": internship.title,
                "company": company.company_name,
                "company_id": company.id,
                "location": internship.location,
                "stipend": internship.stipend,
                "salary": f"₹{internship.stipend:,}" if internship.stipend else None,
                "duration": internship.duration,
                "type": internship.type,
                "status": app.status.lower(),
                "application_date": app.application_date.isoformat() if app.application_date else None,
                "offer_sent_date": app.offer_sent_date.isoformat() if app.offer_sent_date else None,
                "offer_response_date": app.offer_response_date.isoformat() if app.offer_response_date else None,
                "deadline": internship.deadline.isoformat() if internship.deadline else None,
                "description": internship.description,
                "required_skills": internship.required_skills,
                "status_priority": status_priority.get(app.status.lower(), 999)  # Add priority for sorting
            })
    
    # Sort by status priority (Offered first, then Accepted, Pending, Rejected)
    applications_list.sort(key=lambda x: x['status_priority'])
    
    # Remove the status_priority field from response
    for app in applications_list:
        app.pop('status_priority', None)
    
    return applications_list

@router.get("/my-offers")
def get_my_offers(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get all offers (applications with status='Offered' or 'Accepted') for the current intern with internship and company details"""
    print(f"DEBUG: Current user ID: {current_user.id}, Email: {current_user.email}, Role: {current_user.role}")
    
    # Query applications with status 'Offered' or 'Accepted'
    applications = db.query(ApplicationModel).filter(
        ApplicationModel.intern_id == current_user.id,
        ApplicationModel.status.in_(['Offered', 'offered', 'Accepted', 'accepted'])
    ).all()
    
    offers_list = []
    for app in applications:
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        company = db.query(Company).filter(Company.id == app.company_id).first()
        
        if internship and company:
            offers_list.append({
                "id": app.id,
                "application_id": app.id,
                "position": internship.title,
                "title": internship.title,
                "company": company.company_name,
                "company_id": company.id,
                "salary": f"₹{internship.stipend:,}" if internship.stipend else None,
                "stipend": internship.stipend,
                "location": internship.location,
                "startDate": internship.date_posted.isoformat() if internship.date_posted else None,
                "status": app.status.lower(),
                "application_date": app.application_date.isoformat() if app.application_date else None,
                "offer_sent_date": app.offer_sent_date.isoformat() if app.offer_sent_date else None,
                "offer_response_date": app.offer_response_date.isoformat() if app.offer_response_date else None,
                "deadline": internship.deadline.isoformat() if internship.deadline else None,
                "internship_id": internship.id,
                "duration": internship.duration,
                "type": internship.type,
            })
    
    return offers_list

@router.get("/{internship_id}/applicants")
def get_applicants_with_match_score(
    internship_id: str,  # Changed to string for UUID
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not db_internship or db_internship.company_id != current_company.id:
        raise HTTPException(status_code=404, detail="Internship not found")

    applications = db.query(ApplicationModel).filter(ApplicationModel.internship_id == internship_id).all()
    
    applicants_with_scores = []
    for app in applications:
        intern = app.intern  # Changed from app.applicant
        
        # Use the detailed match calculation
        match_details = calculate_detailed_match(
            user_skills=intern.skills,
            required_skills=db_internship.required_skills or db_internship.skills,
            user_level=None,  # Can be added to user profile later
            internship_level=db_internship.level
        )
        
        applicants_with_scores.append({
            "application_id": app.id,
            "applicant_id": intern.id,
            "name": intern.name,
            "email": intern.email,
            "phone": intern.phone,
            "university": intern.university,
            "major": intern.major,
            "graduation_year": intern.graduation_year,
            "skills": intern.skills,
            "match_percentage": match_details['match_percentage'],
            "match_score": f"{match_details['match_percentage']:.0f}%",
            "skill_match": match_details['skill_match_percentage'],
            "matching_skills": match_details['matching_skills'],
            "missing_skills": match_details['missing_skills'],
            "status": app.status,
            "applied_date": app.application_date.isoformat() if app.application_date else None,
        })
    
    # Sort by match percentage descending
    applicants_with_scores.sort(key=lambda x: x['match_percentage'], reverse=True)
        
    return applicants_with_scores

@router.get("/company/all-applicants")
def get_all_company_applicants(
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get all applicants for all internships posted by the current company"""
    # Get all internships for this company
    company_internships = db.query(InternshipModel).filter(InternshipModel.company_id == current_company.id).all()
    internship_ids = [internship.id for internship in company_internships]
    
    # Get all applications for these internships
    applications = db.query(ApplicationModel).filter(ApplicationModel.internship_id.in_(internship_ids)).all()
    
    applicants_list = []
    for app in applications:
        intern = app.intern
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        
        if intern and internship:
            # Calculate detailed match
            match_details = calculate_detailed_match(
                user_skills=intern.skills,
                required_skills=internship.required_skills or internship.skills,
                user_level=None,  # Can be added to user profile later
                internship_level=internship.level
            )
            
            # Determine if contact details should be visible
            # Only show contact details if status is 'Offer Accepted', 'Hired', or 'accepted'
            can_view_contact = app.status.lower() in ['offer accepted', 'offer_accepted', 'accepted', 'hired']
            
            # Get work experiences and projects
            work_experiences = []
            for exp in intern.work_experiences:
                work_experiences.append({
                    "id": exp.id,
                    "company": exp.company,
                    "position": exp.position,
                    "start_date": exp.start_date.isoformat() if exp.start_date else None,
                    "end_date": exp.end_date.isoformat() if exp.end_date else None,
                    "description": exp.description,
                })
            
            projects = []
            for proj in intern.projects:
                projects.append({
                    "id": proj.id,
                    "title": proj.title,
                    "description": proj.description,
                    "technologies": proj.technologies.split(',') if proj.technologies else [],
                    "start_date": proj.start_date.isoformat() if proj.start_date else None,
                    "end_date": proj.end_date.isoformat() if proj.end_date else None,
                    "github_url": proj.github_url,
                    "live_demo_url": proj.live_demo_url,
                })
            
            applicants_list.append({
                "application_id": app.id,
                "applicant_id": intern.id,
                "name": intern.name or intern.email.split('@')[0],
                "email": intern.email if can_view_contact else None,  # Hide email until offer accepted
                "phone": intern.phone if can_view_contact else None,  # Hide phone until offer accepted
                "university": intern.university,
                "major": intern.major,
                "graduation_year": intern.graduation_year,
                "grading_type": intern.grading_type,
                "grading_score": intern.grading_score,
                "bio": intern.bio,
                "linkedin": intern.linkedin,
                "github": intern.github,
                "portfolio": intern.portfolio,
                "skills": intern.skills.split(',') if intern.skills else [],
                "work_experiences": work_experiences,
                "projects": projects,
                "match_percentage": match_details['match_percentage'],
                "match_score": f"{match_details['match_percentage']:.0f}%",
                "skill_match": match_details['skill_match_percentage'],
                "matching_skills": match_details['matching_skills'],
                "missing_skills": match_details['missing_skills'],
                "status": app.status,
                "applied_date": app.application_date.isoformat() if app.application_date else None,
                "internship_title": internship.title,
                "internship_id": internship.id,
                "can_view_contact_details": can_view_contact,  # Flag for frontend
                "offer_sent_date": app.offer_sent_date.isoformat() if app.offer_sent_date else None,
                "offer_response_date": app.offer_response_date.isoformat() if app.offer_response_date else None,
                "hired_date": app.hired_date.isoformat() if app.hired_date else None,
            })
    
    # Sort by match percentage descending
    applicants_list.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    return applicants_list

@router.patch("/{application_id}/status")
def update_application_status(
    application_id: str,  # Changed to string for UUID
    status: str,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Update application status (company only)"""
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify the company owns the internship
    internship = db.query(InternshipModel).filter(InternshipModel.id == application.internship_id).first()
    if not internship or internship.company_id != current_company.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")
    
    # Update status
    application.status = status
    
    # Track workflow timestamps
    if status.lower() in ['offered', 'accepted']:
        if not application.offer_sent_date:
            application.offer_sent_date = datetime.utcnow()
    
    if status.lower() in ['accepted', 'offer accepted', 'offer_accepted']:
        if not application.offer_response_date:
            application.offer_response_date = datetime.utcnow()
    
    if status.lower() == 'hired':
        if not application.hired_date:
            application.hired_date = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    return application

@router.patch("/{application_id}/respond")
def respond_to_offer(
    application_id: str,
    response: str,  # "accepted" or "declined"
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Allow student to accept or reject an offer"""
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify the application belongs to the current student
    if application.intern_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this offer")
    
    # Verify the application has an offer
    if application.status.lower() not in ['offered', 'accepted', 'declined']:
        raise HTTPException(status_code=400, detail="This application does not have an active offer")
    
    # Update status based on response
    if response.lower() == "accepted":
        application.status = "Accepted"
    elif response.lower() == "declined":
        application.status = "Declined"
    else:
        raise HTTPException(status_code=400, detail="Invalid response. Must be 'accepted' or 'declined'")
    
    # Set offer response date
    application.offer_response_date = datetime.utcnow()
    
    db.commit()
    db.refresh(application)
    
    # Return full offer details with internship information
    internship = db.query(InternshipModel).filter(InternshipModel.id == application.internship_id).first()
    company = db.query(Company).filter(Company.id == application.company_id).first()
    
    return {
        "id": application.id,
        "application_id": application.id,
        "position": internship.title if internship else None,
        "title": internship.title if internship else None,
        "company": company.company_name if company else None,
        "company_id": company.id if company else None,
        "salary": f"₹{internship.stipend:,}" if internship and internship.stipend else None,
        "stipend": internship.stipend if internship else None,
        "location": internship.location if internship else None,
        "status": application.status.lower(),
        "application_date": application.application_date.isoformat() if application.application_date else None,
        "offer_sent_date": application.offer_sent_date.isoformat() if application.offer_sent_date else None,
        "offer_response_date": application.offer_response_date.isoformat() if application.offer_response_date else None,
        "internship_id": internship.id if internship else None,
        "duration": internship.duration if internship else None,
        "type": internship.type if internship else None,
    }
