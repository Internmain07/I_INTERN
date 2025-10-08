"""
Script to create a test user for the I-Intern platform
"""
import sys
from pathlib import Path

# Add the backend directory to the path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@intern.com").first()
        
        if existing_user:
            print("✅ Test user already exists!")
            print(f"   Email: test@intern.com")
            print(f"   Password: Test@123")
            print(f"   Role: {existing_user.role}")
            return
        
        # Create test intern user with a simple password
        password = "Test@123"  # Simple password for testing
        hashed_pwd = get_password_hash(password)
        
        test_user = User(
            email="test@intern.com",
            hashed_password=hashed_pwd,
            role="intern",
            name="Test Student",
            phone="+91 9876543210",
            location="Bangalore, India",
            bio="I am a test student account for development purposes.",
            university="Test University",
            major="Computer Science",
            graduation_year="2025",
            grading_type="CGPA",
            grading_score="8.5",
            skills="Python, JavaScript, React, FastAPI",
            linkedin="https://linkedin.com/in/teststudent",
            github="https://github.com/teststudent"
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"\n📧 Email: test@intern.com")
        print(f"🔑 Password: Test@123")
        print(f"👤 Role: intern")
        print(f"📝 Name: Test Student")
        print(f"\nYou can now login with these credentials!")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
