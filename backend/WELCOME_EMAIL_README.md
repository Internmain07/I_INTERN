# Welcome Email Feature

## Overview
This feature sends a personalized welcome email to users (students and companies) after they successfully verify their email during registration.

## Implementation Details

### 1. New Email Function
**File**: `app/utils/email.py`

Added `send_welcome_email(email: str, role: str, name: Optional[str] = None)` function that:
- Sends role-specific welcome emails
- Differentiates content for students (intern) vs companies
- Includes personalized greeting if name is provided
- Features beautiful HTML email templates with brand colors

### 2. Integration with Registration Flow
**File**: `app/api/v1/endpoints/auth.py`

Modified the `/verify-email` endpoint to:
- Send welcome email after successful email verification
- Handle errors gracefully (won't fail verification if email fails)
- Pass user role and name to the email function

## Email Content

### For Students (Intern Role)
The welcome email includes:
- 🎓 Student-focused greeting
- List of features:
  - Explore internship opportunities
  - Create professional profile
  - Apply to internships
  - Track applications
  - Connect with companies
- Call-to-action button to get started

### For Companies
The welcome email includes:
- 🏢 Company-focused greeting
- List of features:
  - Post unlimited internships
  - Search talented students
  - Manage applications
  - Build their team
- Call-to-action button to post first internship

## Email Design Features
- Professional gradient header with brand colors (#1F7368 to #63D7C7)
- Responsive design
- Role-specific emoji and content
- Clear call-to-action button
- Footer with contact information
- Both HTML and plain text versions

## How It Works

1. **User Registration**: User creates account with email, password, and role
2. **Email Verification**: User receives OTP to verify email
3. **Verification Success**: User enters correct OTP
4. **Welcome Email**: System automatically sends role-specific welcome email
5. **User Login**: User receives access token and can start using the platform

## Testing

To test the feature:

1. Register a new user (student or company)
2. Verify the email with OTP
3. Check email inbox for welcome message

### Test Student Registration
```bash
POST /api/v1/auth/register
{
  "email": "student@test.com",
  "password": "password123",
  "role": "intern",
  "skills": "Python, JavaScript"
}
```

### Test Company Registration
```bash
POST /api/v1/auth/register
{
  "email": "company@test.com",
  "password": "password123",
  "role": "company",
  "skills": ""
}
```

### Verify Email
```bash
POST /api/v1/auth/verify-email
{
  "email": "student@test.com",
  "otp": "123456"
}
```

After successful verification, the welcome email will be sent automatically.

## Configuration

Email settings are configured in `app/core/config.py`:
- `SMTP_SERVER`: SMTP server address
- `SMTP_PORT`: SMTP server port
- `SMTP_USERNAME`: Email account username
- `SMTP_PASSWORD`: Email account password
- `FROM_EMAIL`: Sender email address

In development mode (without email configuration), the email content will be printed to console.

## Error Handling

The implementation includes robust error handling:
- If welcome email fails, it logs the error but doesn't fail the verification
- Users can still access their account even if email delivery fails
- All errors are logged for debugging

## Future Enhancements

Possible improvements:
- Add user's name to welcome email (when profile is completed)
- Include quick start guide or tutorial links
- Track email open rates and engagement
- Send follow-up emails after X days
- Add unsubscribe functionality for marketing emails
