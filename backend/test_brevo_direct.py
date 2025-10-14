"""
Direct test of Brevo API to verify email sending works
"""
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_brevo_api():
    """Test Brevo API directly"""
    
    brevo_api_key = os.getenv('BREVO_API_KEY')
    from_email = os.getenv('FROM_EMAIL', 'no-reply@i-intern.com')
    
    print("="*60)
    print("🔍 BREVO API TEST")
    print("="*60)
    print(f"API Key exists: {bool(brevo_api_key)}")
    print(f"API Key length: {len(brevo_api_key) if brevo_api_key else 0}")
    print(f"From Email: {from_email}")
    print(f"First 20 chars of API key: {brevo_api_key[:20] if brevo_api_key else 'None'}...")
    print("="*60)
    
    if not brevo_api_key:
        print("❌ ERROR: BREVO_API_KEY not found in environment!")
        return False
    
    # Test email address
    test_email = input("Enter test email address (or press Enter for sihhackathon04@gmail.com): ").strip()
    if not test_email:
        test_email = "sihhackathon04@gmail.com"
    
    print(f"\n📧 Sending test email to: {test_email}")
    
    # Brevo API endpoint
    url = "https://api.brevo.com/v3/smtp/email"
    
    # Headers
    headers = {
        "accept": "application/json",
        "api-key": brevo_api_key,
        "content-type": "application/json"
    }
    
    # Email payload
    payload = {
        "sender": {
            "name": "I-Intern Platform",
            "email": from_email
        },
        "to": [
            {
                "email": test_email
            }
        ],
        "subject": "Test Email from I-Intern - Brevo API Test",
        "htmlContent": """
        <html>
        <body>
            <h1>🎉 Brevo API Test Successful!</h1>
            <p>This is a test email from I-Intern platform.</p>
            <p>If you received this, your Brevo integration is working correctly!</p>
            <hr>
            <p><strong>Test OTP:</strong> 123456</p>
        </body>
        </html>
        """
    }
    
    try:
        print("\n📤 Sending request to Brevo API...")
        print(f"URL: {url}")
        print(f"Headers: api-key={brevo_api_key[:20]}...")
        
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"\n📥 Response Status Code: {response.status_code}")
        print(f"📥 Response Headers: {dict(response.headers)}")
        print(f"📥 Response Body: {response.text}")
        
        if response.status_code in [200, 201]:
            print("\n✅ SUCCESS! Email sent via Brevo API")
            return True
        else:
            print(f"\n❌ FAILED! Status code: {response.status_code}")
            print(f"Error details: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ EXCEPTION occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_brevo_api()
    print("\n" + "="*60)
    if success:
        print("✅ TEST PASSED - Brevo API is working correctly!")
    else:
        print("❌ TEST FAILED - Check the errors above")
    print("="*60)
