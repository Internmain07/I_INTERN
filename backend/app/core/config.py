from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    
    # Email settings (optional)
    SMTP_SERVER: Optional[str] = "smtp.gmail.com"
    SMTP_PORT: Optional[int] = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: Optional[str] = None
    
    # Frontend URL for password reset links
    FRONTEND_URL: Optional[str] = "http://localhost:8081"

    class Config:
        env_file = ".env"

settings = Settings()