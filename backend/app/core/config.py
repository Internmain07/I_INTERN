from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    
    # Email settings (optional but recommended for production)
    SMTP_SERVER: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: Optional[int] = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: Optional[str] = None
    
    # Frontend and Backend URLs
    FRONTEND_URL: Optional[str] = "http://localhost:8081"
    BACKEND_URL: Optional[str] = "http://localhost:8000"
    
    # Environment (development, staging, production)
    ENVIRONMENT: Optional[str] = "development"
    
    # Google OAuth (optional)
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()