"""
Test password verification for all users in the database
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password, get_password_hash
import bcrypt

def test_all_users():
    db = SessionLocal()
    users = db.query(User).all()
    
    print(f"Total users in database: {len(users)}\n")
    
    for user in users:
        print(f"User: {user.email}")
        print(f"  Role: {user.role}")
        print(f"  Email Verified: {user.email_verified}")
        print(f"  Hash: {user.hashed_password[:20]}..." if user.hashed_password else "  Hash: None")
        print(f"  Hash starts with: {user.hashed_password[:7] if user.hashed_password else 'N/A'}")
        
        # Check if hash looks like bcrypt (should start with $2b$ or $2a$)
        if user.hashed_password:
            if user.hashed_password.startswith('$2b$') or user.hashed_password.startswith('$2a$'):
                print("  ✓ Hash format looks correct (bcrypt)")
            else:
                print("  ✗ Hash format looks WRONG (not bcrypt)")
        print()
    
    db.close()

def test_password_hashing():
    """Test if password hashing works correctly"""
    print("\n=== Testing Password Hashing ===")
    test_password = "TestPassword123"
    
    # Hash the password
    hashed = get_password_hash(test_password)
    print(f"Test password: {test_password}")
    print(f"Hashed password: {hashed}")
    print(f"Hash starts with: {hashed[:7]}")
    
    # Verify the password
    is_valid = verify_password(test_password, hashed)
    print(f"Verification result: {is_valid}")
    
    # Test with wrong password
    is_invalid = verify_password("WrongPassword", hashed)
    print(f"Wrong password verification: {is_invalid}")
    print()

def suggest_fix():
    """Check and suggest fixes for users"""
    print("\n=== Checking for Issues ===")
    db = SessionLocal()
    users = db.query(User).all()
    
    needs_rehash = []
    for user in users:
        if user.hashed_password:
            if not (user.hashed_password.startswith('$2b$') or user.hashed_password.startswith('$2a$')):
                needs_rehash.append(user.email)
    
    if needs_rehash:
        print("❌ The following users have incorrectly hashed passwords:")
        for email in needs_rehash:
            print(f"   - {email}")
        print("\nThese users need their passwords reset or re-hashed.")
    else:
        print("✅ All users have correctly formatted bcrypt password hashes")
        print("\nIf login still fails for some users, it means:")
        print("1. They are entering the wrong password")
        print("2. The password was set differently than expected")
        print("\nSuggestion: Use the forgot-password flow to reset passwords")
    
    db.close()

if __name__ == "__main__":
    test_all_users()
    test_password_hashing()
    suggest_fix()
