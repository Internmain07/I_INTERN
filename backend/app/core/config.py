from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    
    # Brevo (Sendinblue) Email API
    BREVO_API_KEY: Optional[str] = None
    FROM_EMAIL: Optional[str] = "noreply@i-intern.com"
    
    # Email settings (SMTP fallback - optional)
    SMTP_SERVER: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: Optional[int] = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # Frontend and Backend URLs
    FRONTEND_URL: Optional[str] = "http://localhost:8081"
    BACKEND_URL: Optional[str] = "http://localhost:8000"
    
    # Allowed CORS Origins (comma-separated string)
    ALLOWED_ORIGINS: Optional[str] = None
    
    # Environment (development, staging, production)
    ENVIRONMENT: Optional[str] = "development"
    
    # Google OAuth (optional)
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # Cookie Configuration (for secure authentication)
    COOKIE_SAMESITE: Optional[str] = "lax"  # lax, strict, or none
    COOKIE_SECURE: Optional[bool] = True  # True for HTTPS (production), False for HTTP (dev)
    COOKIE_DOMAIN: Optional[str] = None  # .yourdomain.com for production, None for dev
    COOKIE_HTTPONLY: Optional[bool] = True  # Prevent JavaScript access (security)
    COOKIE_MAX_AGE: Optional[int] = 604800  # 7 days in seconds

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields in .env file

settings = Settings()