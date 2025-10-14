#!/usr/bin/env python3
"""
Test sending a real OTP email to your email address
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

from app.utils.email import send_email_verification_otp
import random


def generate_test_otp():
    """Generate a random 6-digit OTP for testing"""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def main():
    if len(sys.argv) < 2:
        print("\n" + "=" * 70)
        print("📧 Send Test OTP Email")
        print("=" * 70)
        print("\nUsage: python test_send_real_otp.py <your_email@example.com>")
        print("\nExample:")
        print("  python test_send_real_otp.py your.email@gmail.com")
        print("\n" + "=" * 70 + "\n")
        sys.exit(1)
    
    email = sys.argv[1]
    
    if '@' not in email:
        print(f"\n❌ Invalid email address: {email}")
        sys.exit(1)
    
    print("\n" + "=" * 70)
    print("🚀 SENDING VERIFICATION OTP EMAIL")
    print("=" * 70)
    print(f"📧 Recipient: {email}")
    
    otp = generate_test_otp()
    print(f"🔢 OTP Code: {otp}")
    print("\n⏳ Sending email via Brevo...\n")
    
    success = send_email_verification_otp(email, otp)
    
    print("\n" + "=" * 70)
    if success:
        print("✅ EMAIL SENT SUCCESSFULLY!")
        print("=" * 70)
        print(f"\n📬 Check your inbox: {email}")
        print(f"🔢 Your OTP code is: {otp}")
        print("\n💡 Tips:")
        print("   • Check spam/junk folder if not in inbox")
        print("   • Email may take 1-2 minutes to arrive")
        print("   • Check Brevo dashboard for delivery status")
    else:
        print("❌ FAILED TO SEND EMAIL")
        print("=" * 70)
        print("\n⚠️  Check the error messages above for details")
    
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
