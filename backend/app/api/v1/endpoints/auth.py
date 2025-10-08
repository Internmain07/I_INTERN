from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, User
from app.schemas.token import Token
from app.api import deps
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User as UserModel
import secrets
import urllib.parse
import os

router = APIRouter()

# OAuth state storage (in production, use Redis or database)
oauth_states = {}

# Get backend URL from environment variable
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

@router.get("/google/login")
def google_login():
    """Redirect to Google OAuth"""
    # Generate a random state for CSRF protection
    state = secrets.token_urlsafe(32)
    oauth_states[state] = True
    
    # Google OAuth configuration (you'll need to set these in your .env)
    client_id = "YOUR_GOOGLE_CLIENT_ID"  # Replace with actual client ID from Google Console
    redirect_uri = f"{BACKEND_URL}/api/v1/auth/google/callback"
    scope = "openid email profile"
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={urllib.parse.quote(redirect_uri)}&"
        f"response_type=code&"
        f"scope={urllib.parse.quote(scope)}&"
        f"state={state}"
    )
    
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, state: str, db: Session = Depends(deps.get_db)):
    """Handle Google OAuth callback"""
    # Verify state to prevent CSRF
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Remove used state
    del oauth_states[state]
    
    # In production, exchange code for access token and get user info
    # For now, we'll create a demo flow
    # You would normally:
    # 1. Exchange code for access token with Google
    # 2. Get user info from Google using the access token
    # 3. Create or find user in your database
    # 4. Generate your own JWT token
    
    # Demo: redirect to frontend with error message for now
    frontend_url = "http://localhost:8081/login?error=google_not_configured"
    return RedirectResponse(url=frontend_url)

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_in.password)
    db_user = UserModel(email=user_in.email, hashed_password=hashed_password, role=user_in.role, skills=user_in.skills)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(subject=user_in.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def get_current_user_profile(current_user: UserModel = Depends(deps.get_current_user)):
    """Get current user profile"""
    return current_user

@router.get("/debug/users")
def list_all_users(db: Session = Depends(deps.get_db)):
    """DEBUG: List all users (REMOVE IN PRODUCTION!)"""
    users = db.query(UserModel).all()
    return [{"id": u.id, "email": u.email, "role": u.role} for u in users]