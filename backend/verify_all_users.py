"""
Script to verify ALL users in the database (for development/testing only).
⚠️ DO NOT use this in production!
"""
from app.db.session import SessionLocal
from app.models.user import User
from app.models.company import Company

def verify_all_users():
    """Mark all users' emails as verified"""
    db = SessionLocal()
    try:
        # Verify all users
        users = db.query(User).filter(User.email_verified == "false").all()
        
        if not users:
            print("✅ No unverified users found!")
        else:
            print(f"\n🔓 Verifying {len(users)} user(s)...\n")
            
            for user in users:
                user.email_verified = "true"
                user.email_verification_otp = None
                user.email_verification_otp_expires = None
                print(f"  ✅ Verified: {user.email} ({user.role})")
                
                # Also verify company record if it's a company user
                if user.role == "company":
                    company = db.query(Company).filter(Company.email == user.email).first()
                    if company:
                        company.is_verified = True
                        print(f"     └─ Company record also verified")
            
            db.commit()
            print(f"\n✅ Successfully verified all {len(users)} user(s)!")
            print("   All users can now login!\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔓 Verify ALL Users (Development Only)")
    print("="*60)
    
    confirm = input("\n⚠️  This will verify ALL unverified users. Continue? (yes/no): ")
    
    if confirm.lower() in ['yes', 'y']:
        verify_all_users()
    else:
        print("\n❌ Operation cancelled.\n")
