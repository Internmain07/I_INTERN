#!/usr/bin/env python3
"""
Quick diagnostic to test Brevo email configuration
"""

import sys
import os
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

# Load .env manually first
from dotenv import load_dotenv
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

print("\n" + "=" * 70)
print("🔍 CHECKING BREVO EMAIL CONFIGURATION")
print("=" * 70)

# Check environment variables directly
brevo_key = os.getenv('BREVO_API_KEY')
from_email = os.getenv('FROM_EMAIL')

print(f"\n1. Environment Variables (from .env file):")
print(f"   ✓ BREVO_API_KEY exists: {bool(brevo_key)}")
if brevo_key:
    print(f"   ✓ BREVO_API_KEY length: {len(brevo_key)} characters")
    print(f"   ✓ BREVO_API_KEY starts with: {brevo_key[:15]}...")
print(f"   ✓ FROM_EMAIL: {from_email}")

# Now check app settings
try:
    from app.core.config import settings
    print(f"\n2. App Settings (loaded by FastAPI):")
    print(f"   ✓ settings.BREVO_API_KEY exists: {bool(settings.BREVO_API_KEY)}")
    if settings.BREVO_API_KEY:
        print(f"   ✓ settings.BREVO_API_KEY length: {len(settings.BREVO_API_KEY)}")
    print(f"   ✓ settings.FROM_EMAIL: {settings.FROM_EMAIL}")
    
    # Test Brevo API connectivity
    print(f"\n3. Testing Brevo API Connection:")
    import requests
    
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY or brevo_key,
    }
    
    # Test API with account endpoint
    response = requests.get("https://api.brevo.com/v3/account", headers=headers)
    
    if response.status_code == 200:
        account_data = response.json()
        print(f"   ✅ Brevo API connection: SUCCESS")
        print(f"   ✓ Account email: {account_data.get('email', 'N/A')}")
        print(f"   ✓ Company name: {account_data.get('companyName', 'N/A')}")
        
        # Check email plan
        plan = account_data.get('plan', [{}])[0]
        credits = plan.get('credits', 0)
        print(f"   ✓ Email credits: {credits}")
    else:
        print(f"   ❌ Brevo API connection: FAILED")
        print(f"   ✗ Status code: {response.status_code}")
        print(f"   ✗ Response: {response.text}")
        
except Exception as e:
    print(f"   ❌ Error loading app settings: {str(e)}")

# Test email sending
print(f"\n4. Testing Email Send Function:")
try:
    from app.utils.email import send_email_verification_otp
    
    test_email = "test@example.com"
    test_otp = "123456"
    
    print(f"   ℹ️  This will attempt to send to: {test_email}")
    print(f"   ℹ️  Running send_email_verification_otp function...")
    
    # This won't actually send since it's a test email
    # But will show us debug output
    result = send_email_verification_otp(test_email, test_otp)
    
    print(f"   Result: {'✅ Function executed' if result else '❌ Function failed'}")
    
except Exception as e:
    print(f"   ❌ Error testing email function: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("📋 RECOMMENDATIONS:")
print("=" * 70)

if not brevo_key:
    print("❌ BREVO_API_KEY is not set in .env file")
    print("   → Add BREVO_API_KEY to your .env file")
elif not from_email:
    print("⚠️  FROM_EMAIL is not set in .env file")
    print("   → Add FROM_EMAIL to your .env file")
else:
    print("✅ Configuration looks good!")
    print("   If emails are not being received:")
    print("   1. Check your Brevo dashboard for delivery logs")
    print("   2. Check spam/junk folder")
    print("   3. Verify the recipient email is valid")
    print("   4. Check Brevo email credits/quota")

print("=" * 70 + "\n")
