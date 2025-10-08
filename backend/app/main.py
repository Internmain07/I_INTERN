import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Get environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="I-Intern API",
    description="Backend API for I-Intern Platform",
    version="1.0.0",
    docs_url="/api/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/api/redoc" if ENVIRONMENT == "development" else None,
)

# ===========================
# CORS CONFIGURATION - MUST BE FIRST!
# ===========================
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "")

# Default origins for development
dev_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8081",
]

# Production origins - ALWAYS INCLUDE THESE
prod_origins = [
    "https://i-intern.com",
    "http://i-intern.com",
    "https://www.i-intern.com",
    "http://www.i-intern.com",
    "https://i-intern-2.onrender.com",
]

# Build origins list
if ENVIRONMENT == "production":
    # In production, start with prod origins
    origins = prod_origins.copy()
    # Add from environment variable
    if ALLOWED_ORIGINS_ENV:
        env_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]
        origins.extend(env_origins)
else:
    # In development, allow all
    origins = dev_origins + prod_origins
    if ALLOWED_ORIGINS_ENV:
        env_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]
        origins.extend(env_origins)

# Remove duplicates
origins = list(set(origins))

# Log CORS configuration
print("=" * 50)
print(f"🌍 Environment: {ENVIRONMENT}")
print(f"🔗 Allowed CORS origins:")
for origin in origins:
    print(f"   ✓ {origin}")
print("=" * 50)

# Add CORS middleware FIRST, before any routes or static files
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# ===========================
# STATIC FILES & UPLOADS
# ===========================
# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the i-Intern API"}