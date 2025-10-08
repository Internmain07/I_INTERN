# OTP-Based Password Reset System

## Overview
The password reset system has been upgraded to use **One-Time Password (OTP)** instead of email links for enhanced security and better user experience.

## Key Features
- ✅ **6-digit OTP** codes sent via email
- ✅ **10-minute expiration** for security
- ✅ **Email + OTP verification** required
- ✅ **Beautiful HTML email** templates
- ✅ **Secure OTP generation** using Python's random module

## API Endpoints

### 1. Request Password Reset (Send OTP)
**POST** `/api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists with that email, you will receive a password reset OTP."
}
```

**Email Sent:**
- Subject: "I-Intern - Password Reset OTP"
- Contains a 6-digit OTP code
- Valid for 10 minutes

---

### 2. Verify OTP (Optional - for two-step flows)
**POST** `/api/v1/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP is valid",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request` - "Invalid or expired OTP"
- `400 Bad Request` - "Invalid OTP"
- `400 Bad Request` - "OTP has expired. Please request a new one."

---

### 3. Reset Password with OTP
**POST** `/api/v1/auth/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "NewSecure123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

**Response:**
```json
{
  "message": "Password has been reset successfully. You can now log in with your new password.",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request` - "Invalid or expired OTP"
- `400 Bad Request` - "Invalid OTP"
- `400 Bad Request` - "OTP has expired. Please request a new one."
- `422 Unprocessable Entity` - Password validation errors

## Database Schema

### Users Table - New Columns
```sql
reset_otp VARCHAR          -- Stores the 6-digit OTP
reset_otp_expires TIMESTAMP -- OTP expiration timestamp
```

**Note:** Old columns (`reset_password_token` and `reset_password_token_expires`) are kept for backward compatibility but are no longer used.

## Security Features

1. **Time-Limited OTPs**: Automatically expire after 10 minutes
2. **Secure Generation**: Uses cryptographically secure random number generation
3. **No Email Enumeration**: Always returns success message regardless of whether email exists
4. **Automatic Cleanup**: Expired OTPs are cleared when verified
5. **Email + OTP Verification**: Requires both email and OTP to reset password

## Email Configuration

The system requires SMTP configuration in `.env`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
FROM_EMAIL=your-email@gmail.com
```

### Gmail App Password Setup
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use the app password (remove spaces) in `SMTP_PASSWORD`

## Testing the Flow

### Test Script
```python
import requests

BASE_URL = "http://localhost:8001/api/v1/auth"

# Step 1: Request OTP
response = requests.post(f"{BASE_URL}/forgot-password", json={
    "email": "test@example.com"
})
print(response.json())
# Check your email for the OTP

# Step 2: Verify OTP (optional)
response = requests.post(f"{BASE_URL}/verify-otp", json={
    "email": "test@example.com",
    "otp": "123456"  # Replace with actual OTP from email
})
print(response.json())

# Step 3: Reset Password
response = requests.post(f"{BASE_URL}/reset-password", json={
    "email": "test@example.com",
    "otp": "123456",  # Replace with actual OTP from email
    "new_password": "NewSecure123!"
})
print(response.json())
```

### Using cURL
```bash
# Request OTP
curl -X POST http://localhost:8001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:8001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Reset Password
curl -X POST http://localhost:8001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","new_password":"NewSecure123!"}'
```

## Frontend Integration

### Example React Flow

```typescript
// Step 1: Request OTP
const requestOTP = async (email: string) => {
  const response = await fetch('/api/v1/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};

// Step 2: Verify OTP and Reset Password
const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const response = await fetch('/api/v1/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, new_password: newPassword })
  });
  return response.json();
};

// UI Flow
// 1. Show email input form
// 2. After email submission, show OTP input form
// 3. After OTP + new password submission, redirect to login
```

## Migration

To add OTP fields to an existing database:

```bash
cd backend
python migrate_otp_fields.py
```

The migration script:
- Adds `reset_otp` column (VARCHAR)
- Adds `reset_otp_expires` column (TIMESTAMP)
- Checks for existing columns (idempotent)
- Works with PostgreSQL databases

## Differences from Link-Based Reset

| Feature | Link-Based | OTP-Based |
|---------|-----------|-----------|
| User Experience | Click link in email | Copy 6-digit code |
| Security | 1-hour token | 10-minute OTP |
| Mobile Friendly | Requires browser | Can type code |
| Verification | Token only | Email + OTP |
| URL Exposure | Token in URL | No sensitive URL |
| User Memory | None (click link) | 6 digits |

## Troubleshooting

### OTP Not Received
1. Check spam/junk folder
2. Verify SMTP configuration in `.env`
3. Check server logs for email sending errors
4. Verify email server allows SMTP connections

### OTP Expired
- OTPs expire after 10 minutes
- Request a new OTP by calling `/forgot-password` again

### Invalid OTP Error
- Ensure you're using the correct email
- Verify the OTP hasn't expired
- Check for typos in the 6-digit code

## Best Practices

1. **Frontend Validation**: Validate OTP format (6 digits) before submission
2. **User Feedback**: Show clear error messages for invalid/expired OTPs
3. **Rate Limiting**: Implement rate limiting on forgot-password endpoint
4. **Resend OTP**: Provide option to resend OTP after 1-2 minutes
5. **Auto-fill Support**: Use proper input types for OTP entry
6. **Countdown Timer**: Show OTP expiration countdown to users

## Production Checklist

- [ ] Configure production SMTP server
- [ ] Set up email domain authentication (SPF, DKIM)
- [ ] Implement rate limiting (e.g., max 3 requests per hour per email)
- [ ] Add logging for security events
- [ ] Monitor OTP usage patterns
- [ ] Set up email delivery monitoring
- [ ] Consider adding SMS OTP as backup
- [ ] Implement CAPTCHA on forgot-password form

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify database migration completed successfully
3. Test with a known email account
4. Review API response messages for hints

---

**Last Updated**: October 8, 2025  
**Version**: 1.0.0
