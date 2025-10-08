"""
Simple script to create test user using bcrypt directly
"""
import sys
from pathlib import Path
import bcrypt

# Add the backend directory to the path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.db.session import SessionLocal
from app.models.user import User
from app.db.base import Base
from sqlalchemy import create_engine

# Create engine
DATABASE_URL = "sqlite:////home/rahul/I_INTERN/backend/test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def create_test_user():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@intern.com").first()
        
        if existing_user:
            print("✅ Test user already exists!")
            print(f"   Email: test@intern.com")
            print(f"   Password: Test123")
            print(f"   Role: {existing_user.role}")
            return
        
        # Create password hash using bcrypt directly
        password = "Test123".encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password, salt).decode('utf-8')
        
        # Create test intern user
        test_user = User(
            email="test@intern.com",
            hashed_password=hashed_password,
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
        print(f"🔑 Password: Test123")
        print(f"👤 Role: intern")
        print(f"📝 Name: Test Student")
        print(f"\nYou can now login with these credentials!")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
