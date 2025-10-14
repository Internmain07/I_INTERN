"""
Quick debug script to check what data exists for a user
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.models.profile import StudentProfile, WorkExperience, Project

def check_user_data(email: str):
    db = SessionLocal()
    
    try:
        # Find user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User not found: {email}")
            return
        
        print(f"\n{'='*60}")
        print(f"USER DATA FOR: {email}")
        print(f"{'='*60}")
        
        print(f"\n📧 Basic Info:")
        print(f"   ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Phone: {user.phone}")
        print(f"   Avatar: {user.avatar_url}")
        
        # Check student profile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == user.id
        ).first()
        
        print(f"\n🎓 Student Profile:")
        if student_profile:
            print(f"   ✅ Profile exists (ID: {student_profile.id})")
            print(f"   University: {student_profile.university}")
            print(f"   Major: {student_profile.major}")
            print(f"   Graduation: {student_profile.graduation_year}")
            print(f"   GPA Type: {student_profile.grading_type}")
            print(f"   GPA Score: {student_profile.grading_score}")
            print(f"   Skills: {student_profile.skills}")
            print(f"   Bio: {student_profile.bio}")
            print(f"   Location: {student_profile.location}")
            print(f"   LinkedIn: {student_profile.linkedin_url}")
            print(f"   GitHub: {student_profile.github_url}")
            print(f"   Portfolio: {student_profile.portfolio_url}")
        else:
            print(f"   ❌ No student profile found")
        
        # Check work experiences
        work_exps = db.query(WorkExperience).filter(
            WorkExperience.user_id == user.id
        ).all()
        
        print(f"\n💼 Work Experiences: {len(work_exps)} found")
        for i, exp in enumerate(work_exps, 1):
            print(f"   {i}. {exp.position} at {exp.company}")
            print(f"      From: {exp.start_date} To: {exp.end_date}")
            print(f"      Description: {exp.description[:50] if exp.description else 'None'}...")
        
        # Check projects
        projects = db.query(Project).filter(
            Project.user_id == user.id
        ).all()
        
        print(f"\n🚀 Projects: {len(projects)} found")
        for i, proj in enumerate(projects, 1):
            print(f"   {i}. {proj.title}")
            print(f"      Technologies: {proj.technologies}")
            print(f"      Description: {proj.description[:50] if proj.description else 'None'}...")
        
        print(f"\n{'='*60}\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    # Check your user
    check_user_data("deepakumars700@gmail.com")
