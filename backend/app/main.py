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

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS Middleware
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []

# Default origins for development
dev_origins = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite development server
    "http://127.0.0.1:5173",
    "http://localhost:8080",  # Alternative port
    "http://127.0.0.1:8080",
    "http://localhost:8081",  # Alternative port
    "http://127.0.0.1:8081",
    "http://localhost:8082",  # Alternative port
    "http://127.0.0.1:8082",
]

# Production origins
prod_origins = [
    "https://i-intern.com",   # Production frontend URL
    "http://i-intern.com",    # In case HTTP is used
    "https://www.i-intern.com",  # With www subdomain
    "http://www.i-intern.com",   # With www subdomain HTTP
]

# Determine which origins to use
if ENVIRONMENT == "production":
    origins = prod_origins.copy()
    # Add any additional origins from environment variable
    if ALLOWED_ORIGINS:
        origins.extend([origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()])
else:
    # Development: allow both dev and prod origins
    origins = dev_origins + prod_origins
    if ALLOWED_ORIGINS:
        origins.extend([origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()])

# Remove duplicates
origins = list(set(origins))

print(f"🌍 Environment: {ENVIRONMENT}")
print(f"🔗 Allowed CORS origins: {origins}")

# IMPORTANT: Cannot use allow_origins=["*"] with allow_credentials=True
# Must specify exact origins when using credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the specific origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Also expose all headers
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the i-Intern API"}