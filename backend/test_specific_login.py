"""
Test login for specific users to diagnose the issue
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password
import getpass

def test_user_login(email: str, password: str):
    """Test if a user can login with given credentials"""
    db = SessionLocal()
    
    print(f"\n=== Testing Login for {email} ===")
    
    # Find user
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print(f"❌ User not found: {email}")
        db.close()
        return False
    
    print(f"✓ User found")
    print(f"  Role: {user.role}")
    print(f"  Email Verified: {user.email_verified}")
    print(f"  Hash: {user.hashed_password[:30]}..." if user.hashed_password else "  No hash")
    
    # Check email verification
    if user.email_verified == "false":
        print(f"❌ Email not verified")
        db.close()
        return False
    
    print(f"✓ Email is verified")
    
    # Check if suspended
    if hasattr(user, 'is_suspended') and user.is_suspended:
        print(f"❌ Account is suspended")
        db.close()
        return False
    
    print(f"✓ Account is not suspended")
    
    # Test password
    print(f"\nTesting password...")
    print(f"  Password length: {len(password)}")
    
    is_valid = verify_password(password, str(user.hashed_password))
    
    if is_valid:
        print(f"✅ Password is CORRECT! Login should work.")
        db.close()
        return True
    else:
        print(f"❌ Password is INCORRECT!")
        print(f"\nThis means:")
        print(f"  1. The password you entered doesn't match the stored hash")
        print(f"  2. The password was set to something different")
        print(f"  3. User needs to use 'Forgot Password' to reset it")
        db.close()
        return False

def list_all_users():
    """List all users in database"""
    db = SessionLocal()
    users = db.query(User).all()
    
    print("\n=== All Users in Database ===")
    for user in users:
        print(f"Email: {user.email}")
        print(f"  Role: {user.role}")
        print(f"  Email Verified: {user.email_verified}")
        print(f"  Is Suspended: {getattr(user, 'is_suspended', False)}")
        print()
    
    db.close()

if __name__ == "__main__":
    list_all_users()
    
    print("\n" + "="*60)
    print("PASSWORD TESTING")
    print("="*60)
    
    # Test the working user
    print("\n1. Testing the user that WORKS (sihhackathon04@gmail.com)")
    test_password = input("Enter password for sihhackathon04@gmail.com: ")
    test_user_login("sihhackathon04@gmail.com", test_password)
    
    # Test another user
    print("\n2. Testing another user")
    test_email = input("Enter email to test: ")
    test_password = input(f"Enter password for {test_email}: ")
    test_user_login(test_email, test_password)
