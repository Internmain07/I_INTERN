"""
Test script for the forgot password functionality
This script tests the backend API endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1/auth"

def print_response(response):
    """Pretty print API response"""
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 50)

def test_forgot_password():
    """Test the forgot password endpoint"""
    print("\n🧪 Testing: POST /forgot-password")
    print("-" * 50)
    
    # Test with a valid email format
    test_email = input("Enter email to test (or press Enter for test@example.com): ").strip()
    if not test_email:
        test_email = "test@example.com"
    
    data = {"email": test_email}
    
    try:
        response = requests.post(f"{BASE_URL}/forgot-password", json=data)
        print_response(response)
        
        if response.status_code == 200:
            print("✅ Forgot password request successful!")
            print("📧 Check your backend console for the reset link (if email not configured)")
            return True
        else:
            print("❌ Forgot password request failed")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_verify_token():
    """Test the verify token endpoint"""
    print("\n🧪 Testing: POST /verify-reset-token")
    print("-" * 50)
    
    token = input("Enter reset token to verify: ").strip()
    if not token:
        print("⏭️ Skipping token verification (no token provided)")
        return False
    
    data = {"token": token}
    
    try:
        response = requests.post(f"{BASE_URL}/verify-reset-token", json=data)
        print_response(response)
        
        if response.status_code == 200:
            print("✅ Token is valid!")
            return True
        else:
            print("❌ Token verification failed")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_reset_password():
    """Test the reset password endpoint"""
    print("\n🧪 Testing: POST /reset-password")
    print("-" * 50)
    
    token = input("Enter reset token: ").strip()
    if not token:
        print("⏭️ Skipping password reset (no token provided)")
        return False
    
    new_password = input("Enter new password (min 8 chars, uppercase, lowercase, number): ").strip()
    if not new_password:
        new_password = "NewPassword123"
    
    data = {
        "token": token,
        "new_password": new_password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/reset-password", json=data)
        print_response(response)
        
        if response.status_code == 200:
            print("✅ Password reset successful!")
            return True
        else:
            print("❌ Password reset failed")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Main test runner"""
    print("=" * 50)
    print("🔐 I-Intern Forgot Password Feature Test")
    print("=" * 50)
    print("\n📋 Prerequisites:")
    print("  1. Backend running on http://localhost:8000")
    print("  2. Database has at least one user")
    print("=" * 50)
    
    # Check if backend is running
    try:
        response = requests.get("http://localhost:8000/docs")
        if response.status_code != 200:
            print("❌ Backend is not accessible at http://localhost:8000")
            print("   Please start the backend first:")
            print("   cd backend && python -m uvicorn app.main:app --reload")
            sys.exit(1)
    except Exception as e:
        print("❌ Cannot connect to backend at http://localhost:8000")
        print(f"   Error: {str(e)}")
        print("   Please start the backend first:")
        print("   cd backend && python -m uvicorn app.main:app --reload")
        sys.exit(1)
    
    print("\n✅ Backend is running!\n")
    
    # Test flow
    print("\n" + "=" * 50)
    print("Starting Test Flow")
    print("=" * 50)
    
    # Step 1: Request password reset
    if test_forgot_password():
        print("\n💡 TIP: Check your backend console for the reset link!")
        print("      Copy the token from the URL")
        
        # Step 2: Verify token (optional)
        proceed = input("\nDo you want to verify a token? (y/n): ").strip().lower()
        if proceed == 'y':
            test_verify_token()
        
        # Step 3: Reset password
        proceed = input("\nDo you want to reset password with a token? (y/n): ").strip().lower()
        if proceed == 'y':
            test_reset_password()
    
    print("\n" + "=" * 50)
    print("✅ Test completed!")
    print("=" * 50)
    print("\n📚 For more info, see FORGOT_PASSWORD_README.md")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Test interrupted by user")
        sys.exit(0)
