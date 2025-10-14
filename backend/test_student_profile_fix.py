"""
Test script to verify student profile data is correctly stored and retrieved
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"  # Adjust if needed
STUDENT_EMAIL = "deepakumars700@gmail.com"
STUDENT_PASSWORD = "your_password_here"  # Update this

def test_student_profile_flow():
    """Test complete student profile workflow"""
    print("=" * 60)
    print("TESTING STUDENT PROFILE DATA STORAGE")
    print("=" * 60)
    
    # Step 1: Login as student
    print("\n1. Logging in as student...")
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Login successful")
    
    # Step 2: Get current profile
    print("\n2. Getting current profile...")
    profile_response = requests.get(f"{BASE_URL}/api/users/profile", headers=headers)
    if profile_response.status_code == 200:
        profile = profile_response.json()
        print(f"✅ Current profile retrieved")
        print(f"   Email: {profile.get('email')}")
        print(f"   Name: {profile.get('full_name')}")
        print(f"   University: {profile.get('university', 'Not set')}")
    
    # Step 3: Update education via education endpoint
    print("\n3. Updating education data...")
    education_data = {
        "university": "Test University",
        "major": "Computer Science",
        "graduation_year": "2026",
        "grading_type": "GPA",
        "grading_score": "3.8"
    }
    edu_response = requests.put(
        f"{BASE_URL}/api/profile/education",
        headers=headers,
        json=education_data
    )
    
    if edu_response.status_code == 200:
        print("✅ Education updated successfully")
        print(json.dumps(edu_response.json(), indent=2))
    else:
        print(f"❌ Education update failed: {edu_response.status_code}")
        print(edu_response.text)
    
    # Step 4: Update complete student profile
    print("\n4. Updating complete student profile...")
    profile_data = {
        "bio": "Passionate software engineer with focus on AI and web development",
        "location": "California, USA",
        "skills": ["Python", "JavaScript", "React", "Machine Learning", "SQL"],
        "linkedin_url": "https://linkedin.com/in/testprofile",
        "github_url": "https://github.com/testprofile",
        "portfolio_url": "https://testprofile.com",
        "university": "Test University",
        "major": "Computer Science",
        "graduation_year": "2026"
    }
    
    sp_response = requests.put(
        f"{BASE_URL}/api/profile/student-profile",
        headers=headers,
        json=profile_data
    )
    
    if sp_response.status_code == 200:
        print("✅ Student profile updated successfully")
        print(json.dumps(sp_response.json(), indent=2))
    else:
        print(f"❌ Student profile update failed: {sp_response.status_code}")
        print(sp_response.text)
    
    # Step 5: Verify student profile
    print("\n5. Retrieving student profile to verify...")
    verify_response = requests.get(
        f"{BASE_URL}/api/profile/student-profile",
        headers=headers
    )
    
    if verify_response.status_code == 200:
        verified_profile = verify_response.json()
        print("✅ Student profile retrieved successfully")
        print("\nStored data:")
        print(f"   University: {verified_profile.get('university')}")
        print(f"   Major: {verified_profile.get('major')}")
        print(f"   Graduation Year: {verified_profile.get('graduation_year')}")
        print(f"   Skills: {verified_profile.get('skills')}")
        print(f"   Bio: {verified_profile.get('bio')}")
        print(f"   Location: {verified_profile.get('location')}")
        print(f"   LinkedIn: {verified_profile.get('linkedin_url')}")
        print(f"   GitHub: {verified_profile.get('github_url')}")
    else:
        print(f"❌ Failed to retrieve student profile: {verify_response.status_code}")
        print(verify_response.text)
    
    # Step 6: Check if data is visible in applications
    print("\n6. Checking my applications to see if profile data is included...")
    apps_response = requests.get(
        f"{BASE_URL}/api/applications/my-applications",
        headers=headers
    )
    
    if apps_response.status_code == 200:
        applications = apps_response.json()
        print(f"✅ Applications retrieved: {len(applications)} applications")
        if applications:
            first_app = applications[0]
            if 'student_profile' in first_app:
                print("\n✅ Student profile data is included in applications!")
                print(f"   University: {first_app['student_profile'].get('university')}")
                print(f"   Major: {first_app['student_profile'].get('major')}")
                print(f"   Skills: {first_app['student_profile'].get('skills')}")
            else:
                print("⚠️  Student profile not found in application data")
    else:
        print(f"⚠️  Could not retrieve applications: {apps_response.status_code}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)

def test_database_direct():
    """Test by querying database directly"""
    print("\n" + "=" * 60)
    print("DATABASE VERIFICATION")
    print("=" * 60)
    
    try:
        from app.db.session import SessionLocal
        from app.models.user import User
        from app.models.student_profile_optimized import StudentProfile
        
        db = SessionLocal()
        
        # Find the user
        user = db.query(User).filter(User.email == STUDENT_EMAIL).first()
        if not user:
            print(f"❌ User not found: {STUDENT_EMAIL}")
            return
        
        print(f"\n✅ User found: {user.email} (ID: {user.id})")
        
        # Check student profile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == user.id
        ).first()
        
        if student_profile:
            print("\n✅ Student profile exists in database!")
            print(f"   Profile ID: {student_profile.id}")
            print(f"   User ID: {student_profile.user_id}")
            print(f"   University: {student_profile.university}")
            print(f"   Major: {student_profile.major}")
            print(f"   Graduation Year: {student_profile.graduation_year}")
            print(f"   Skills: {student_profile.skills}")
            print(f"   Bio: {student_profile.bio}")
            print(f"   Location: {student_profile.location}")
        else:
            print("\n❌ No student profile found in database!")
            print("   This means the profile hasn't been created yet.")
            print("   Run the API test first to create the profile.")
        
        db.close()
        
    except Exception as e:
        print(f"\n❌ Database test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "db":
        # Test database directly
        test_database_direct()
    else:
        # Test via API
        print("\nUsage:")
        print("  python test_student_profile_fix.py        # Test via API")
        print("  python test_student_profile_fix.py db     # Test database directly")
        print("\nMake sure to update STUDENT_PASSWORD in the script!")
        print()
        
        # Uncomment the line below and update the password in the script
        # test_student_profile_flow()
        
        print("⚠️  Please update the STUDENT_PASSWORD variable in this script first!")
        print("Then uncomment the test_student_profile_flow() call.")
