import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.core.config import settings

# Get environment (prefer central settings)
ENVIRONMENT = getattr(settings, "ENVIRONMENT", os.getenv("ENVIRONMENT", "development"))

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
# Get allowed origins from central settings or environment variable
ALLOWED_ORIGINS_ENV = getattr(settings, "ALLOWED_ORIGINS", os.getenv("ALLOWED_ORIGINS", "")) or ""

# Default origins for development - Allow common development ports
dev_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8001",
    "http://127.0.0.1:8001",
    "http://localhost:8002",
    "http://127.0.0.1:8002",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:8082",
    "http://127.0.0.1:8082",
]

# Production origins - ALWAYS INCLUDE THESE
prod_origins = [
    "https://i-intern.com",
    "http://i-intern.com",
    "https://www.i-intern.com",
    "http://www.i-intern.com",
    "https://i-intern-2.onrender.com",
    "https://i-intern.onrender.com",  # Backend URL for cookie domain
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
    # In development, allow all localhost and 127.0.0.1 origins
    origins = dev_origins + prod_origins
    if ALLOWED_ORIGINS_ENV:
        env_origins = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]
        origins.extend(env_origins)
    
    # For maximum development flexibility, also allow any localhost/127.0.0.1 port
    # This is a fallback that covers all common development scenarios
    additional_dev_origins = [
        "http://localhost",
        "http://127.0.0.1",
        # Allow common ports that might be used
        "http://localhost:3001",
        "http://localhost:4000",
        "http://localhost:5000",
        "http://localhost:5500",
        "http://localhost:8080",
    ]
    origins.extend(additional_dev_origins)

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
# IMPORTANT: CORS middleware must be added before any routes to ensure
# it processes requests even when they result in errors
# NOTE: Cannot use allow_origins=["*"] with allow_credentials=True
# Must explicitly list allowed origins when using credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Explicitly list allowed origins (required with credentials)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add exception handler for better error responses
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to ensure proper CORS headers are sent
    even when exceptions occur, preventing CORS errors in the browser.
    """
    import traceback
    error_trace = traceback.format_exc()
    print(f"🔴 Unhandled exception: {str(exc)}")
    print(f"Traceback:\n{error_trace}")
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal server error: {str(exc)}",
            "error": str(exc),
            "type": type(exc).__name__
        },
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

# ===========================
# STATIC FILES & UPLOADS
# ===========================
# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)
(UPLOAD_DIR / "logos").mkdir(exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the i-Intern API"}