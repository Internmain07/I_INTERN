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
from sqlalchemy import func, or_
from app.utils.email import send_email
from app.core.config import settings

router = APIRouter()


def _normalize_skills(skills_field):
    """Return skills as a list. Accepts JSON array, comma-separated string, or None."""
    if not skills_field:
        return []
    # If already a list/tuple, return as list
    if isinstance(skills_field, (list, tuple)):
        return list(skills_field)
    # If it's a JSON-like string with brackets, try to eval safely by splitting
    if isinstance(skills_field, str):
        # If comma-separated
        if ',' in skills_field:
            return [s.strip() for s in skills_field.split(',') if s.strip()]
        # Single skill string
        return [skills_field.strip()]
    # Fallback
    return []


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
        ApplicationModel.student_id == current_user.id,  # Use integer ID directly
        ApplicationModel.internship_id == application_in.internship_id
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied to this internship")

    # Generate UUID for the application
    application_id = str(uuid.uuid4())
    
    db_application = ApplicationModel(
        id=application_id,
        student_id=current_user.id,  # Use integer ID directly, not string
        internship_id=application_in.internship_id,
        application_date=datetime.utcnow()  # Explicitly set application date
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    # Get the related internship and company
    internship = db.query(InternshipModel).filter(InternshipModel.id == db_application.internship_id).first()
    company_id = internship.employer_profile_id if internship else None
    from app.schemas.application import Application
    return Application(
        id=db_application.id,
        status=db_application.status,
        intern_id=db_application.student_id,
        internship_id=db_application.internship_id,
        company_id=company_id,
        application_date=db_application.application_date,
        offer_sent_date=db_application.offer_sent_date,
        offer_response_date=db_application.offer_response_date,
        hired_date=db_application.hired_date,
    )

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
    
    applications = db.query(ApplicationModel).filter(ApplicationModel.student_id == current_user.id).all()
    
    # Get student profile data once (to avoid repeated queries)
    student_profile = current_user.student_profile if hasattr(current_user, 'student_profile') else None
    
    # Get work experiences for the student
    work_experiences = []
    if hasattr(current_user, 'work_experiences'):
        for exp in current_user.work_experiences:
            work_experiences.append({
                "id": exp.id,
                "company": exp.company,
                "position": exp.position,
                "start_date": exp.start_date.isoformat() if exp.start_date else None,
                "end_date": exp.end_date.isoformat() if exp.end_date else None,
                "description": exp.description,
            })
    
    # Get projects for the student
    projects = []
    if hasattr(current_user, 'projects'):
        for proj in current_user.projects:
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
    
    applications_list = []
    for app in applications:
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        
        if internship:
            # Get company through employer_profile relationship
            employer_profile = internship.employer_profile if hasattr(internship, 'employer_profile') else None
            
            applications_list.append({
                "id": app.id,
                "application_id": app.id,
                "internship_id": internship.id,
                "title": internship.title,
                "position": internship.title,
                "company": employer_profile.company_name if employer_profile else "Unknown Company",
                "company_id": employer_profile.id if employer_profile else None,
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
                # Include student profile information
                "student_profile": {
                    "university": student_profile.university if student_profile else None,
                    "major": student_profile.major if student_profile else None,
                    "graduation_year": student_profile.graduation_year if student_profile else None,
                    "grading_type": student_profile.grading_type if student_profile else None,
                    "grading_score": student_profile.grading_score if student_profile else None,
                    "bio": student_profile.bio if student_profile else None,
                    "skills": _normalize_skills(student_profile.skills if student_profile and student_profile.skills else None),
                },
                "work_experiences": work_experiences,
                "projects": projects,
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
    
    # Query applications where status indicates an offer or accepted state.
    # Use case-insensitive matching and allow variations like 'offered', 'offer_accepted', 'offer accepted', etc.
    # Accept different variants of offer/accepted status
    applications = db.query(ApplicationModel).filter(
        ApplicationModel.student_id == current_user.id,
        or_(
            func.lower(ApplicationModel.status).like('%offer%'),
            func.lower(ApplicationModel.status).in_(['accepted', 'offer_accepted', 'offer accepted'])
        )
    ).all()
    
    offers_list = []
    for app in applications:
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        
        if internship:
            # Get company through employer_profile relationship
            employer_profile = internship.employer_profile if hasattr(internship, 'employer_profile') else None
            
            offers_list.append({
                "id": app.id,
                "application_id": app.id,
                "position": internship.title,
                "title": internship.title,
                "company": employer_profile.company_name if employer_profile else "Unknown Company",
                "company_id": employer_profile.id if employer_profile else None,
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
                # Add student basic info for offers so frontend can show context
                "student_id": app.student_id,
                "student_university": (app.student.student_profile.university if getattr(app.student, 'student_profile', None) else None),
                "student_skills": _normalize_skills(app.student.student_profile.skills if getattr(app.student, 'student_profile', None) else None),
            })
    
    return offers_list

@router.get("/{internship_id}/applicants")
def get_applicants_with_match_score(
    internship_id: str,  # Changed to string for UUID
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    db_internship = db.query(InternshipModel).filter(InternshipModel.id == internship_id).first()
    if not db_internship or db_internship.employer_profile_id != current_company.id:
        raise HTTPException(status_code=404, detail="Internship not found")

    applications = db.query(ApplicationModel).filter(ApplicationModel.internship_id == internship_id).all()
    
    applicants_with_scores = []
    for app in applications:
        student = app.student  # Get the student user
        
        # Get student skills from their profile and normalize to list/string
        student_skills_list = _normalize_skills(student.student_profile.skills if getattr(student, 'student_profile', None) else None)
        student_skills = ", ".join(student_skills_list) if student_skills_list else ""
        
        # Use the detailed match calculation
        match_details = calculate_detailed_match(
            user_skills=student_skills,
            required_skills=db_internship.required_skills or db_internship.skills,
            user_level=None,  # Can be added to user profile later
            internship_level=db_internship.level
        )
        
        applicants_with_scores.append({
            "application_id": app.id,
            "applicant_id": student.id,
            "name": student.full_name or student.email.split('@')[0],
            "email": student.email,
            "phone": student.phone if student.student_profile else None,
            "university": (student.student_profile.university if getattr(student, 'student_profile', None) else None),
            "major": (student.student_profile.major if getattr(student, 'student_profile', None) else None),
            "graduation_year": (student.student_profile.graduation_year if getattr(student, 'student_profile', None) else None),
            "skills": student_skills_list,
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
    company_internships = db.query(InternshipModel).filter(InternshipModel.employer_profile_id == current_company.id).all()
    internship_ids = [internship.id for internship in company_internships]
    
    # Get all applications for these internships
    applications = db.query(ApplicationModel).filter(ApplicationModel.internship_id.in_(internship_ids)).all()
    
    applicants_list = []
    for app in applications:
        student = app.student  # Get the student user
        internship = db.query(InternshipModel).filter(InternshipModel.id == app.internship_id).first()
        
        if student and internship:
            # Get student skills from their profile
            student_skills = ""
            if student.student_profile and student.student_profile.skills:
                if isinstance(student.student_profile.skills, list):
                    student_skills = ", ".join(student.student_profile.skills)
                else:
                    student_skills = str(student.student_profile.skills)
            
            # Calculate detailed match
            match_details = calculate_detailed_match(
                user_skills=student_skills,
                required_skills=internship.required_skills or internship.skills,
                user_level=None,  # Can be added to user profile later
                internship_level=internship.level
            )
            
            # Determine if contact details should be visible
            # Only show contact details if status is 'Offer Accepted', 'Hired', or 'accepted'
            can_view_contact = app.status.lower() in ['offer accepted', 'offer_accepted', 'accepted', 'hired']
            
            # Get student profile data
            student_profile = student.student_profile if getattr(student, 'student_profile', None) else None
            
            # Get work experiences and projects directly from database
            from app.models.profile import WorkExperience, Project as ProjectModel
            
            work_experiences_query = db.query(WorkExperience).filter(
                WorkExperience.user_id == student.id
            ).all()
            
            work_experiences = []
            for exp in work_experiences_query:
                work_experiences.append({
                    "id": exp.id,
                    "company": exp.company,
                    "position": exp.position,
                    "start_date": exp.start_date.isoformat() if exp.start_date else None,
                    "end_date": exp.end_date.isoformat() if exp.end_date else None,
                    "description": exp.description,
                })
            
            projects_query = db.query(ProjectModel).filter(
                ProjectModel.user_id == student.id
            ).all()
            
            projects = []
            for proj in projects_query:
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
            
            # Education information (from student profile)
            education = {
                "university": student_profile.university if student_profile else None,
                "major": student_profile.major if student_profile else None,
                "graduation_year": student_profile.graduation_year if student_profile else None,
                "grading_type": student_profile.grading_type if student_profile else None,
                "grading_score": student_profile.grading_score if student_profile else None,
            }
            
            applicants_list.append({
                "application_id": app.id,
                "applicant_id": student.id,
                "name": student.full_name or student.email.split('@')[0],
                "email": student.email if can_view_contact else None,  # Hide email until offer accepted
                "phone": student.phone if can_view_contact else None,  # Hide phone until offer accepted
                "university": student_profile.university if student_profile else None,
                "major": student_profile.major if student_profile else None,
                "graduation_year": student_profile.graduation_year if student_profile else None,
                "grading_type": student_profile.grading_type if student_profile else None,
                "grading_score": student_profile.grading_score if student_profile else None,
                "bio": student_profile.bio if student_profile else None,
                "linkedin": student_profile.linkedin_url if student_profile else None,
                "github": student_profile.github_url if student_profile else None,
                "portfolio": student_profile.portfolio_url if student_profile else None,
                "education": education,
                    "skills": _normalize_skills(student_profile.skills if student_profile and student_profile.skills else None),
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
    print(f"DEBUG: Updating application {application_id} status to: {status}")
    
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    print(f"DEBUG: Current application status: {application.status}")
    
    # Verify the company owns the internship
    internship = db.query(InternshipModel).filter(InternshipModel.id == application.internship_id).first()
    if not internship or internship.employer_profile_id != current_company.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")
    
    # Normalize incoming status to canonical lowercase forms
    normalized = status.strip().lower().replace(' ', '_')
    print(f"DEBUG: Normalized status: {normalized}")
    
    # Map variants to canonical statuses
    canonical_map = {
        'offered': 'offered',
        'offer_sent': 'offered',
        'under_review': 'reviewed',
        'offer_accepted': 'accepted',
        'accepted': 'accepted',
        'declined': 'declined',
        'rejected': 'rejected',
        'hired': 'hired',
        'pending': 'pending',
        'reviewed': 'reviewed',
    }
    application.status = canonical_map.get(normalized, status)
    print(f"DEBUG: New application status after mapping: {application.status}")

    # Track workflow timestamps
    if application.status == 'offered' and not application.offer_sent_date:
        application.offer_sent_date = datetime.utcnow()
        print(f"DEBUG: Set offer_sent_date to {application.offer_sent_date}")

    if application.status == 'accepted' and not application.offer_response_date:
        application.offer_response_date = datetime.utcnow()

    if application.status == 'hired' and not application.hired_date:
        application.hired_date = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(application)
        print(f"DEBUG: Successfully committed status update. Final status: {application.status}")
    except Exception as e:
        db.rollback()
        print(f"ERROR: Failed to commit status update: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update status: {str(e)}")

    # If the company just sent an offer, notify the student via email
    try:
        # Only notify when status is 'offered'
        if application.status and application.status.lower() == 'offered':
            student = application.student
            # internship is already fetched above
            employer_profile = internship.employer_profile if internship and hasattr(internship, 'employer_profile') else None
            company_name = employer_profile.company_name if employer_profile and hasattr(employer_profile, 'company_name') else getattr(current_company, 'name', 'I-Intern')

            if student and getattr(student, 'email', None):
                from app.core.config import settings
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:8081')
                offer_link = f"{frontend_url}/student/offers"  # frontend route where student sees offers

                subject = f"You have received an internship offer from {company_name}"
                body = f"Hello {getattr(student, 'full_name', None) or student.email},\n\nCongratulations! You have received an offer for the internship '{internship.title if internship else 'an internship'}' from {company_name}.\n\nVisit your offers page to view and respond to the offer: {offer_link}\n\nBest regards,\nI-Intern Team"

                html_body = f"<p>Hello {getattr(student, 'full_name', None) or student.email},</p>" \
                            f"<p>Congratulations! You have received an offer for the internship '<strong>{internship.title if internship else 'an internship'}</strong>' from <strong>{company_name}</strong>.</p>" \
                            f"<p><a href=\"{offer_link}\">Click here to view your offers and respond</a></p>" \
                            f"<p>Best regards,<br/>I-Intern Team</p>"

                sent = send_email(student.email, subject, body, html_body)
                print(f"Email offer sent to {student.email}: {sent}")
            else:
                print("No student email available to send offer notification")
    except Exception as e:
        print(f"Failed to send offer notification email: {e}")
    return application

@router.get("/applicant/{application_id}")
def get_applicant_details(
    application_id: str,
    db: Session = Depends(deps.get_db),
    current_company: Company = Depends(deps.get_current_active_company),
):
    """Get detailed information about a specific applicant"""
    print(f"DEBUG: Getting applicant details for application {application_id}")
    
    # Get the application
    application = db.query(ApplicationModel).filter(ApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify the company owns the internship
    internship = db.query(InternshipModel).filter(InternshipModel.id == application.internship_id).first()
    if not internship or internship.employer_profile_id != current_company.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this applicant")
    
    student = application.student  # Get the student user
    if not student:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Refresh to ensure relationships are loaded
    db.refresh(student)
    
    # Get student profile and skills
    student_profile = student.student_profile if hasattr(student, 'student_profile') else None
    student_skills = ""
    if student_profile and student_profile.skills:
        if isinstance(student_profile.skills, list):
            student_skills = ", ".join(student_profile.skills)
        else:
            student_skills = str(student_profile.skills)
    
    # Calculate detailed match
    match_details = calculate_detailed_match(
        user_skills=student_skills,
        required_skills=internship.required_skills or internship.skills,
        user_level=None,
        internship_level=internship.level
    )
    
    # Determine if contact details should be visible
    can_view_contact = application.status.lower() in ['offer accepted', 'offer_accepted', 'accepted', 'hired']
    
    # Get work experiences directly from the database
    from app.models.profile import WorkExperience, Project as ProjectModel
    
    work_experiences_query = db.query(WorkExperience).filter(
        WorkExperience.user_id == student.id
    ).all()
    
    work_experiences = []
    for exp in work_experiences_query:
        work_experiences.append({
            "id": exp.id,
            "company": exp.company,
            "position": exp.position,
            "start_date": exp.start_date.isoformat() if exp.start_date else None,
            "end_date": exp.end_date.isoformat() if exp.end_date else None,
            "description": exp.description,
        })
    
    # Get projects directly from the database
    projects_query = db.query(ProjectModel).filter(
        ProjectModel.user_id == student.id
    ).all()
    
    projects = []
    for proj in projects_query:
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
    
    # Education information (from student profile)
    education = {
        "university": student_profile.university if student_profile else None,
        "major": student_profile.major if student_profile else None,
        "graduation_year": student_profile.graduation_year if student_profile else None,
        "grading_type": student_profile.grading_type if student_profile else None,
        "grading_score": student_profile.grading_score if student_profile else None,
    }
    
    print(f"DEBUG: Found {len(work_experiences)} work experiences and {len(projects)} projects")
    print(f"DEBUG: Education data: {education}")
    
    return {
        "application_id": application.id,
        "applicant_id": student.id,
        "name": student.full_name or student.email.split('@')[0],
        "email": student.email if can_view_contact else "Contact details will be available after offer acceptance",
        "phone": student.phone if can_view_contact else None,
        "bio": student_profile.bio if student_profile else None,
        "linkedin": student_profile.linkedin_url if student_profile else None,
        "github": student_profile.github_url if student_profile else None,
        "portfolio": student_profile.portfolio_url if student_profile else None,
        "location": student_profile.location if student_profile else None,
        "date_of_birth": student_profile.date_of_birth.isoformat() if student_profile and student_profile.date_of_birth else None,
        "avatar_url": student.avatar_url if student else None,
        "education": education,
        "skills": student_profile.skills if student_profile and student_profile.skills else [],
        "work_experiences": work_experiences,
        "projects": projects,
        "match_percentage": match_details['match_percentage'],
        "match_score": f"{match_details['match_percentage']:.0f}%",
        "skill_match": match_details['skill_match_percentage'],
        "matching_skills": match_details['matching_skills'],
        "missing_skills": match_details['missing_skills'],
        "status": application.status,
        "applied_date": application.application_date.isoformat() if application.application_date else None,
        "internship_title": internship.title,
        "internship_id": internship.id,
        "can_view_contact_details": can_view_contact,
        "offer_sent_date": application.offer_sent_date.isoformat() if application.offer_sent_date else None,
        "offer_response_date": application.offer_response_date.isoformat() if application.offer_response_date else None,
        "hired_date": application.hired_date.isoformat() if application.hired_date else None,
    }

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
    if application.student_id != current_user.id:
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
    
    # Get company through employer_profile relationship
    employer_profile = internship.employer_profile if internship and hasattr(internship, 'employer_profile') else None
    
    return {
        "id": application.id,
        "application_id": application.id,
        "position": internship.title if internship else None,
        "title": internship.title if internship else None,
        "company": employer_profile.company_name if employer_profile else "Unknown Company",
        "company_id": employer_profile.id if employer_profile else None,
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
