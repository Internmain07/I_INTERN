from fastapi import APIRouter
from app.api.v1.endpoints import auth, internships, applications, landing, users, profile, companies, admin, resume

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(internships.router, prefix="/internships", tags=["internships"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(landing.router, prefix="/landing", tags=["landing"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])