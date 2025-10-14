#!/usr/bin/env python3
"""
Test Brevo Email Integration
Sends a test OTP email to verify the Brevo API is working correctly.

Usage:
    python test_brevo_email.py <email_address>
"""

import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app.utils.email import send_email_verification_otp, send_password_reset_email
import random


def generate_test_otp():
    """Generate a random 6-digit OTP for testing"""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def test_verification_email(email: str):
    """Test sending verification OTP email"""
    print("\n" + "=" * 60)
    print("🧪 Testing Email Verification OTP via Brevo")
    print("=" * 60)
    print(f"📧 Sending to: {email}\n")
    
    test_otp = generate_test_otp()
    print(f"🔢 Test OTP: {test_otp}")
    print("⏳ Sending email...\n")
    
    success = send_email_verification_otp(email, test_otp)
    
    if success:
        print("\n" + "=" * 60)
        print("✅ SUCCESS! Verification email sent via Brevo")
        print("=" * 60)
        print(f"📧 Check your inbox at: {email}")
        print(f"🔢 Your test OTP: {test_otp}")
        print("\n💡 If you don't see the email:")
        print("   - Check your spam/junk folder")
        print("   - Verify the email address is correct")
        print("   - Check Brevo dashboard for delivery status")
        print("=" * 60 + "\n")
    else:
        print("\n" + "=" * 60)
        print("❌ FAILED to send email")
        print("=" * 60)
        print("Please check:")
        print("  1. Brevo API key is correct in .env file")
        print("  2. FROM_EMAIL is configured")
        print("  3. Internet connection is working")
        print("  4. Check console output for error details")
        print("=" * 60 + "\n")
    
    return success


def test_password_reset_email(email: str):
    """Test sending password reset OTP email"""
    print("\n" + "=" * 60)
    print("🧪 Testing Password Reset OTP via Brevo")
    print("=" * 60)
    print(f"📧 Sending to: {email}\n")
    
    test_otp = generate_test_otp()
    print(f"🔢 Test OTP: {test_otp}")
    print("⏳ Sending email...\n")
    
    success = send_password_reset_email(email, test_otp)
    
    if success:
        print("\n" + "=" * 60)
        print("✅ SUCCESS! Password reset email sent via Brevo")
        print("=" * 60)
        print(f"📧 Check your inbox at: {email}")
        print(f"🔢 Your test OTP: {test_otp}")
        print("\n💡 If you don't see the email:")
        print("   - Check your spam/junk folder")
        print("   - Verify the email address is correct")
        print("   - Check Brevo dashboard for delivery status")
        print("=" * 60 + "\n")
    else:
        print("\n" + "=" * 60)
        print("❌ FAILED to send email")
        print("=" * 60)
        print("Please check:")
        print("  1. Brevo API key is correct in .env file")
        print("  2. FROM_EMAIL is configured")
        print("  3. Internet connection is working")
        print("  4. Check console output for error details")
        print("=" * 60 + "\n")
    
    return success


def main():
    """Main function to run email tests"""
    
    if len(sys.argv) < 2:
        print("\n" + "=" * 60)
        print("🧪 Brevo Email Integration Test")
        print("=" * 60)
        print("\nUsage: python test_brevo_email.py <email_address>")
        print("\nExample:")
        print("  python test_brevo_email.py your.email@example.com")
        print("\n" + "=" * 60 + "\n")
        sys.exit(1)
    
    test_email = sys.argv[1]
    
    # Validate email format
    if '@' not in test_email:
        print(f"\n❌ Invalid email address: {test_email}")
        print("Please provide a valid email address.\n")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("🚀 Brevo Email Integration Test Suite")
    print("=" * 60)
    print(f"📧 Test Email: {test_email}")
    print("📡 Email Provider: Brevo (Sendinblue) API")
    print("=" * 60)
    
    # Test verification email
    verification_success = test_verification_email(test_email)
    
    # Wait a moment between tests
    import time
    time.sleep(2)
    
    # Test password reset email
    reset_success = test_password_reset_email(test_email)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Verification Email: {'✅ PASSED' if verification_success else '❌ FAILED'}")
    print(f"Password Reset Email: {'✅ PASSED' if reset_success else '❌ FAILED'}")
    print("=" * 60)
    
    if verification_success and reset_success:
        print("\n🎉 All tests passed! Brevo email integration is working correctly.")
        print("💡 You can now use this email configuration for user signups.\n")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Please check the configuration and try again.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
