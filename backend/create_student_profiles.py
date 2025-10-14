"""
Migration script to ensure all students have a student_profile record
Run this after deploying the fix to create missing student_profile records
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.models.student_profile_optimized import StudentProfile

def create_missing_student_profiles():
    """Create student_profile records for students who don't have one"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("Creating Missing Student Profiles")
        print("=" * 60)
        
        # Get all students
        students = db.query(User).filter(User.role == 'student').all()
        print(f"\nFound {len(students)} students in database")
        
        created_count = 0
        existing_count = 0
        
        for student in students:
            # Check if student profile exists
            existing_profile = db.query(StudentProfile).filter(
                StudentProfile.user_id == student.id
            ).first()
            
            if existing_profile:
                existing_count += 1
                print(f"✓ Student {student.email} already has profile (ID: {existing_profile.id})")
            else:
                # Create new student profile
                new_profile = StudentProfile(user_id=student.id)
                db.add(new_profile)
                created_count += 1
                print(f"+ Created profile for student {student.email}")
        
        # Commit all changes
        db.commit()
        
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Total students: {len(students)}")
        print(f"Already had profiles: {existing_count}")
        print(f"Newly created profiles: {created_count}")
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during migration: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\nThis script will create student_profile records for all students")
    print("who don't already have one.\n")
    
    response = input("Continue? (yes/no): ")
    if response.lower() in ['yes', 'y']:
        create_missing_student_profiles()
    else:
        print("Migration cancelled.")
