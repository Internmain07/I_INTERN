"""
Test script for OTP-based password reset
"""
import requests
import json

BASE_URL = "http://localhost:8001/api/v1/auth"

def test_forgot_password():
    """Test requesting a password reset OTP"""
    print("\n" + "="*50)
    print("TEST 1: Request Password Reset OTP")
    print("="*50)
    
    email = input("Enter email address: ")
    
    response = requests.post(
        f"{BASE_URL}/forgot-password",
        json={"email": email}
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ OTP sent! Check your email.")
        return email
    else:
        print("\n❌ Failed to send OTP")
        return None

def test_verify_otp(email):
    """Test verifying an OTP"""
    print("\n" + "="*50)
    print("TEST 2: Verify OTP (Optional)")
    print("="*50)
    
    otp = input("Enter the 6-digit OTP from your email: ")
    
    response = requests.post(
        f"{BASE_URL}/verify-otp",
        json={"email": email, "otp": otp}
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ OTP is valid!")
        return otp
    else:
        print("\n❌ Invalid or expired OTP")
        return None

def test_reset_password(email, otp):
    """Test resetting password with OTP"""
    print("\n" + "="*50)
    print("TEST 3: Reset Password with OTP")
    print("="*50)
    
    new_password = input("Enter new password (min 8 chars, 1 upper, 1 lower, 1 digit): ")
    
    response = requests.post(
        f"{BASE_URL}/reset-password",
        json={
            "email": email,
            "otp": otp,
            "new_password": new_password
        }
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ Password reset successfully!")
        return True
    else:
        print("\n❌ Failed to reset password")
        return False

def main():
    print("\n" + "="*50)
    print("OTP-BASED PASSWORD RESET TEST")
    print("="*50)
    print("\nMake sure your backend server is running on port 8001")
    print("and email configuration is set up in .env file\n")
    
    # Test 1: Request OTP
    email = test_forgot_password()
    
    if not email:
        return
    
    # Test 2: Verify OTP (optional)
    proceed = input("\nDo you want to verify OTP first? (y/n): ").lower()
    
    if proceed == 'y':
        otp = test_verify_otp(email)
        if not otp:
            otp = input("Enter OTP to continue with password reset: ")
    else:
        otp = input("Enter the 6-digit OTP from your email: ")
    
    # Test 3: Reset Password
    test_reset_password(email, otp)
    
    print("\n" + "="*50)
    print("TEST COMPLETE")
    print("="*50)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Error: {str(e)}")
