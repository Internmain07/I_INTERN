#!/usr/bin/env python3
"""
Test the forgot-password endpoint directly
"""

import sys
import requests
import json

BACKEND_URL = "http://localhost:8002"  # Change if your backend runs on a different port

def test_forgot_password(email: str):
    """Test the forgot-password endpoint"""
    
    print("\n" + "=" * 70)
    print("🧪 TESTING FORGOT PASSWORD ENDPOINT")
    print("=" * 70)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Email: {email}")
    print()
    
    try:
        # Test if backend is running
        print("1️⃣ Checking if backend is running...")
        try:
            health_response = requests.get(f"{BACKEND_URL}/", timeout=5)
            print(f"   ✅ Backend is running (Status: {health_response.status_code})")
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Backend is NOT running at {BACKEND_URL}")
            print(f"   Please start the backend server with:")
            print(f"   cd backend && python -m uvicorn app.main:app --reload --port 8002")
            return False
        
        print()
        print("2️⃣ Sending forgot-password request...")
        
        # Make the forgot-password request
        url = f"{BACKEND_URL}/api/v1/auth/forgot-password"
        payload = {"email": email}
        headers = {"Content-Type": "application/json"}
        
        print(f"   URL: {url}")
        print(f"   Payload: {payload}")
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("\n" + "=" * 70)
            print("✅ SUCCESS - Request completed successfully")
            print("=" * 70)
            print(f"Response message: {response.json().get('message', 'N/A')}")
            print()
            print("📬 Now check:")
            print(f"   1. Email inbox for: {email}")
            print(f"   2. Backend console logs for email sending status")
            print(f"   3. Spam/junk folder")
            print("=" * 70)
            return True
        else:
            print("\n" + "=" * 70)
            print(f"❌ FAILED - Status code: {response.status_code}")
            print("=" * 70)
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("\n❌ Request timed out - Backend might be slow or not responding")
        return False
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Request error: {str(e)}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    if len(sys.argv) < 2:
        print("\n" + "=" * 70)
        print("📧 Test Forgot Password Endpoint")
        print("=" * 70)
        print("\nUsage: python test_forgot_password_endpoint.py <email>")
        print("\nExample:")
        print("  python test_forgot_password_endpoint.py test@example.com")
        print("\n" + "=" * 70 + "\n")
        sys.exit(1)
    
    email = sys.argv[1]
    
    if '@' not in email:
        print(f"\n❌ Invalid email address: {email}")
        sys.exit(1)
    
    success = test_forgot_password(email)
    
    if not success:
        print("\n💡 Troubleshooting tips:")
        print("   1. Make sure backend server is running")
        print("   2. Check backend console for error logs")
        print("   3. Verify BREVO_API_KEY is set in .env")
        print("   4. Restart backend server after .env changes")
        print()
        sys.exit(1)
    
    sys.exit(0)


if __name__ == "__main__":
    main()
