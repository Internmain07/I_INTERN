import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS Middleware
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []

origins = [
    "http://localhost:8080",  # Vite frontend URL
    "http://127.0.0.1:8080",
    "http://localhost:8081",  # Alternative port
    "http://127.0.0.1:8081",
    "http://localhost:8082",  # Alternative port
    "http://127.0.0.1:8082",
    "http://localhost:5173",  # Fallback
    "http://127.0.0.1:5173",
    "https://i-intern.com",   # Production frontend URL
    "http://i-intern.com",    # In case HTTP is used
]

# Add environment-specified origins
origins.extend(ALLOWED_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the i-Intern API"}