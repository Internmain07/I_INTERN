#!/usr/bin/env python3
"""
Test Forgot Password Feature
Tests the complete password reset flow with Brevo email
"""

import sys
import os
import requests

# Backend API URL
API_URL = "http://127.0.0.1:8002/api/v1/auth"


def test_forgot_password(email: str):
    """Test forgot password endpoint"""
    print("\n" + "=" * 60)
    print("🧪 Testing Forgot Password Feature")
    print("=" * 60)
    print(f"📧 Email: {email}")
    print("⏳ Requesting password reset...\n")
    
    try:
        response = requests.post(
            f"{API_URL}/forgot-password",
            json={"email": email}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("\n" + "=" * 60)
            print("✅ SUCCESS! Password reset OTP sent")
            print("=" * 60)
            print(f"📧 Check your inbox at: {email}")
            print(f"💬 Message: {data.get('message', 'OTP sent')}")
            print("\n💡 The OTP has been sent via Brevo to your email")
            print("   Check your inbox (or spam folder)")
            print("=" * 60 + "\n")
            return True
        else:
            print("\n" + "=" * 60)
            print("❌ FAILED")
            print("=" * 60)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            print("=" * 60 + "\n")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n" + "=" * 60)
        print("❌ CONNECTION FAILED")
        print("=" * 60)
        print("Cannot connect to backend server.")
        print("Please make sure the backend is running on http://127.0.0.1:8002")
        print("\nTo start the backend:")
        print("  cd backend")
        print("  uvicorn app.main:app --reload --port 8002")
        print("=" * 60 + "\n")
        return False
    except Exception as e:
        print(f"\n❌ Error: {str(e)}\n")
        return False


def main():
    """Main function"""
    
    if len(sys.argv) < 2:
        print("\n" + "=" * 60)
        print("🧪 Forgot Password Test")
        print("=" * 60)
        print("\nUsage: python test_forgot_password.py <email_address>")
        print("\nExample:")
        print("  python test_forgot_password.py your.email@example.com")
        print("\n" + "=" * 60 + "\n")
        sys.exit(1)
    
    test_email = sys.argv[1]
    
    # Validate email format
    if '@' not in test_email:
        print(f"\n❌ Invalid email address: {test_email}")
        print("Please provide a valid email address.\n")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🚀 Forgot Password Test Suite")
    print("=" * 60)
    print(f"📧 Test Email: {test_email}")
    print(f"🔗 API Endpoint: {API_URL}/forgot-password")
    print("📡 Email Provider: Brevo (no-reply@i-intern.com)")
    print("=" * 60)
    
    success = test_forgot_password(test_email)
    
    if success:
        print("\n🎉 Test completed successfully!")
        print("📧 Check your email for the password reset OTP")
        print("\n📋 Next steps:")
        print("   1. Check your email inbox (or spam)")
        print("   2. Copy the 6-digit OTP from the email")
        print("   3. Use the OTP to reset your password on the frontend")
        print()
        sys.exit(0)
    else:
        print("\n⚠️  Test failed. Please check the error messages above.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
