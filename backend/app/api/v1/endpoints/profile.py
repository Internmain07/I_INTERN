from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from pathlib import Path
import uuid
from app.api import deps
from app.schemas.profile import (
    WorkExperienceCreate,
    WorkExperienceUpdate,
    WorkExperience as WorkExperienceSchema,
    ProjectCreate,
    ProjectUpdate,
    Project as ProjectSchema
)
from app.models.profile import WorkExperience, Project
from app.models.user import User

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ==================== PROFILE PICTURE ENDPOINT ====================

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Upload profile picture/avatar"""
    print(f"DEBUG: Uploading avatar for user {current_user.email}")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Validate file size (max 5MB)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get position (file size)
    file.file.seek(0)  # Reset to beginning
    
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        raise HTTPException(status_code=400, detail="File size too large. Maximum size is 5MB")
    
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update user's avatar_url
        avatar_url = f"/uploads/avatars/{unique_filename}"
        current_user.avatar_url = avatar_url
        db.commit()
        db.refresh(current_user)
        
        print(f"DEBUG: Successfully uploaded avatar: {avatar_url}")
        
        return {
            "message": "Avatar uploaded successfully",
            "avatar_url": avatar_url
        }
    
    except Exception as e:
        print(f"ERROR: Failed to upload avatar: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

@router.delete("/delete-avatar")
async def delete_avatar(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Delete profile picture/avatar"""
    print(f"DEBUG: Deleting avatar for user {current_user.email}")
    
    try:
        # Check if user has an avatar
        if not current_user.avatar_url:
            raise HTTPException(status_code=404, detail="No avatar to delete")
        
        # Extract filename from avatar_url
        avatar_filename = os.path.basename(current_user.avatar_url)
        file_path = UPLOAD_DIR / avatar_filename
        
        # Delete file from filesystem if it exists
        if file_path.exists():
            os.remove(file_path)
            print(f"DEBUG: Deleted avatar file: {file_path}")
        else:
            print(f"WARNING: Avatar file not found: {file_path}")
        
        # Update user's avatar_url to None
        current_user.avatar_url = None
        db.commit()
        db.refresh(current_user)
        
        print(f"DEBUG: Successfully deleted avatar")
        
        return {
            "message": "Avatar deleted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete avatar: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete avatar: {str(e)}")

# ==================== WORK EXPERIENCE ENDPOINTS ====================

@router.get("/work-experiences", response_model=List[WorkExperienceSchema])
def get_my_work_experiences(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get all work experiences for current user"""
    return current_user.work_experiences

@router.post("/work-experiences", response_model=WorkExperienceSchema, status_code=201)
def create_work_experience(
    work_exp: WorkExperienceCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Create a new work experience entry"""
    print(f"DEBUG: Creating work experience for user {current_user.email}")
    print(f"DEBUG: Data: {work_exp.dict()}")
    
    try:
        # Create new work experience
        db_work_exp = WorkExperience(
            **work_exp.dict(),
            user_id=current_user.id
        )
        
        db.add(db_work_exp)
        db.flush()
        db.commit()
        db.refresh(db_work_exp)
        
        print(f"DEBUG: Successfully created work experience ID {db_work_exp.id}")
        
        # Verify it was saved
        verification = db.query(WorkExperience).filter(WorkExperience.id == db_work_exp.id).first()
        if verification:
            print(f"DEBUG: Verified - found work experience in database")
        else:
            print(f"WARNING: Work experience not found in database after commit!")
        
        return db_work_exp
    except Exception as e:
        print(f"ERROR: Failed to create work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create work experience: {str(e)}")

@router.put("/work-experiences/{exp_id}", response_model=WorkExperienceSchema)
def update_work_experience(
    exp_id: int,
    work_exp: WorkExperienceUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update an existing work experience"""
    print(f"DEBUG: Updating work experience {exp_id} for user {current_user.email}")
    
    try:
        # Get the work experience
        db_work_exp = db.query(WorkExperience).filter(
            WorkExperience.id == exp_id,
            WorkExperience.user_id == current_user.id
        ).first()
        
        if not db_work_exp:
            raise HTTPException(status_code=404, detail="Work experience not found")
        
        # Update fields
        update_data = work_exp.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_work_exp, field, value)
        
        db.flush()
        db.commit()
        db.refresh(db_work_exp)
        
        print(f"DEBUG: Successfully updated work experience {exp_id}")
        return db_work_exp
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update work experience: {str(e)}")

@router.delete("/work-experiences/{exp_id}", status_code=204)
def delete_work_experience(
    exp_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Delete a work experience"""
    print(f"DEBUG: Deleting work experience {exp_id} for user {current_user.email}")
    
    try:
        db_work_exp = db.query(WorkExperience).filter(
            WorkExperience.id == exp_id,
            WorkExperience.user_id == current_user.id
        ).first()
        
        if not db_work_exp:
            raise HTTPException(status_code=404, detail="Work experience not found")
        
        db.delete(db_work_exp)
        db.commit()
        
        print(f"DEBUG: Successfully deleted work experience {exp_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete work experience: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete work experience: {str(e)}")

# ==================== PROJECT ENDPOINTS ====================

@router.get("/projects", response_model=List[ProjectSchema])
def get_my_projects(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Get all projects for current user"""
    return current_user.projects

@router.post("/projects", response_model=ProjectSchema, status_code=201)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Create a new project"""
    print(f"DEBUG: Creating project for user {current_user.email}")
    print(f"DEBUG: Data: {project.dict()}")
    
    try:
        # Create new project (technologies already converted by validator)
        db_project = Project(
            **project.dict(),
            user_id=current_user.id
        )
        
        db.add(db_project)
        db.flush()
        db.commit()
        db.refresh(db_project)
        
        print(f"DEBUG: Successfully created project ID {db_project.id}")
        
        # Verify it was saved
        verification = db.query(Project).filter(Project.id == db_project.id).first()
        if verification:
            print(f"DEBUG: Verified - found project in database")
        else:
            print(f"WARNING: Project not found in database after commit!")
        
        return db_project
    except Exception as e:
        print(f"ERROR: Failed to create project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update an existing project"""
    print(f"DEBUG: Updating project {project_id} for user {current_user.email}")
    
    try:
        # Get the project
        db_project = db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        ).first()
        
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update fields (technologies already converted by validator)
        update_data = project.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        
        db.flush()
        db.commit()
        db.refresh(db_project)
        
        print(f"DEBUG: Successfully updated project {project_id}")
        return db_project
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to update project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Delete a project"""
    print(f"DEBUG: Deleting project {project_id} for user {current_user.email}")
    
    try:
        db_project = db.query(Project).filter(
            Project.id == project_id,
            Project.user_id == current_user.id
        ).first()
        
        if not db_project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        db.delete(db_project)
        db.commit()
        
        print(f"DEBUG: Successfully deleted project {project_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to delete project: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")
