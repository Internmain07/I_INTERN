# Forgot Password Feature - Implementation Guide

## Overview
This implementation provides a complete forgot password functionality for the I-Intern platform, supporting all user types (interns, companies, and admins).

## Features
✅ Secure token-based password reset
✅ Email notifications with reset links
✅ Token expiration (1 hour)
✅ Password strength validation
✅ Beautiful UI with error handling
✅ Works for all user roles

## Backend Implementation

### 1. Database Changes
**File:** `backend/app/models/user.py`

Added two new fields to the User model:
- `reset_password_token`: Stores the unique reset token
- `reset_password_token_expires`: Stores token expiration timestamp

### 2. API Endpoints
**File:** `backend/app/api/v1/endpoints/auth.py`

#### POST `/api/v1/auth/forgot-password`
Request a password reset link
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "If an account exists with that email, you will receive password reset instructions."
}
```

#### POST `/api/v1/auth/verify-reset-token`
Verify if a reset token is valid
```json
{
  "token": "reset-token-here"
}
```

Response:
```json
{
  "message": "Token is valid",
  "email": "user@example.com"
}
```

#### POST `/api/v1/auth/reset-password`
Reset password with token
```json
{
  "token": "reset-token-here",
  "new_password": "NewPassword123"
}
```

Response:
```json
{
  "message": "Password has been reset successfully. You can now log in with your new password.",
  "email": "user@example.com"
}
```

### 3. Email Service
**File:** `backend/app/utils/email.py`

Handles sending password reset emails with:
- Plain text and HTML versions
- Secure reset links
- Branded email template
- SMTP configuration support

### 4. Schemas
**File:** `backend/app/schemas/password_reset.py`

Pydantic models for:
- Password reset requests
- Password reset confirmation
- Token verification
- Password validation

## Frontend Implementation

### 1. Forgot Password Page
**File:** `frontend/src/apps/landing/components/ForgotPasswordPage.tsx`

Features:
- Email input form
- API integration
- Loading states
- Error handling
- Success confirmation

### 2. Reset Password Page
**File:** `frontend/src/apps/landing/components/ResetPasswordPage.tsx`

Features:
- Token verification on load
- Password and confirm password inputs
- Password strength validation
- Show/hide password toggle
- Success message with auto-redirect
- Invalid token handling

### 3. Routes
**File:** `frontend/src/apps/landing/LandingPage.tsx`

Added routes:
- `/forgot-password` - Request password reset
- `/reset-password?token=xxx` - Reset password with token

## Configuration

### Backend Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:8081
```

### Gmail Setup (if using Gmail)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
   - Use this as `SMTP_PASSWORD`

### Other Email Providers

**SendGrid:**
```bash
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```bash
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

## Database Migration

If you're using an existing database, you need to add the new columns:

```sql
ALTER TABLE users 
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_token_expires TIMESTAMP;
```

Or recreate your database to include the new fields.

## Testing

### Development Mode
In development, if email credentials are not configured, the system will:
- Print email details to console
- Return success responses
- Allow you to test the flow without actual emails

### Testing Steps

1. **Request Password Reset:**
   - Navigate to `/forgot-password`
   - Enter a valid email address
   - Check console for reset link (if email not configured)

2. **Reset Password:**
   - Copy the reset token from console or email
   - Navigate to `/reset-password?token=YOUR_TOKEN`
   - Enter new password (min 8 chars, uppercase, lowercase, number)
   - Confirm password
   - Submit

3. **Login with New Password:**
   - Navigate to `/login`
   - Login with new password

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Security Features

1. **Token Security:**
   - Cryptographically secure random tokens
   - 1-hour expiration
   - Single-use tokens (cleared after reset)

2. **Information Disclosure Prevention:**
   - Same response for existing/non-existing emails
   - Prevents email enumeration

3. **Token Validation:**
   - Verified before password reset
   - Expired tokens rejected
   - Invalid tokens rejected

## Error Handling

### Frontend
- Network errors
- Invalid tokens
- Expired tokens
- Password mismatch
- Weak passwords

### Backend
- Email sending failures (logged, doesn't fail request)
- Invalid tokens
- Expired tokens
- Database errors

## User Flow

```
1. User clicks "Forgot Password" on login page
2. User enters email address
3. System generates reset token and sends email
4. User clicks link in email
5. System verifies token
6. User enters new password
7. System validates and updates password
8. User redirected to login
9. User logs in with new password
```

## API Testing with cURL

### Request Password Reset
```bash
curl -X POST http://localhost:8000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Verify Token
```bash
curl -X POST http://localhost:8000/api/v1/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token": "your-reset-token"}'
```

### Reset Password
```bash
curl -X POST http://localhost:8000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token",
    "new_password": "NewPassword123"
  }'
```

## Troubleshooting

### Emails Not Sending

1. Check `.env` file has correct SMTP settings
2. Verify email credentials are correct
3. Check spam folder
4. Review backend console logs
5. For Gmail, ensure App Password is used (not regular password)

### Token Expired

- Tokens expire after 1 hour
- Request a new password reset

### Invalid Token

- Token may have been used already
- Token may not exist
- Request a new password reset

## Production Deployment

1. Set strong `SECRET_KEY` in `.env`
2. Configure production email service
3. Set correct `FRONTEND_URL` in `.env`
4. Enable HTTPS for security
5. Monitor email sending logs
6. Consider rate limiting for forgot password endpoint

## Future Enhancements

- Rate limiting to prevent abuse
- Email template customization
- SMS-based password reset option
- Account recovery questions
- Multi-factor authentication
- Password history (prevent reuse)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend console logs
3. Verify email configuration
4. Test API endpoints directly

---

**Last Updated:** October 2025
**Version:** 1.0.0
