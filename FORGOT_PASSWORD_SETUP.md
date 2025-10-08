# Quick Setup Guide - Forgot Password Feature

## ⚡ Quick Start (5 minutes)

### Step 1: Update Database
Choose one option:

**Option A: Fresh Database (Easiest)**
```powershell
# Delete existing database
Remove-Item backend\test.db

# Restart your backend - it will create a new database with the new schema
```

**Option B: Migrate Existing Database**
```powershell
cd backend
python migrate_password_reset.py
```

### Step 2: Configure Email (Optional for Testing)

**For Development/Testing:**
No configuration needed! The system will print reset links to the console.

**For Production (Gmail):**

1. Create a Google App Password:
   - Go to https://myaccount.google.com/security
   - Enable 2-Factor Authentication
   - Go to "App passwords"
   - Generate a password for "Mail"

2. Add to `backend\.env`:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:8081
```

### Step 3: Test the Feature

1. **Start Backend:**
```powershell
cd backend
.\env\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

2. **Start Frontend:**
```powershell
cd frontend
npm run dev
```

3. **Test Flow:**
   - Go to http://localhost:8081/forgot-password
   - Enter your email
   - Check console for reset link (if email not configured)
   - Copy the token from the link
   - Go to http://localhost:8081/reset-password?token=YOUR_TOKEN
   - Enter new password
   - Login with new password

## 🎯 What's Included

### Backend Files Created/Modified:
- ✅ `app/models/user.py` - Added reset token fields
- ✅ `app/schemas/password_reset.py` - New password reset schemas
- ✅ `app/utils/email.py` - New email utility
- ✅ `app/api/v1/endpoints/auth.py` - Added 3 new endpoints
- ✅ `app/core/config.py` - Added email configuration
- ✅ `migrate_password_reset.py` - Database migration script
- ✅ `FORGOT_PASSWORD_README.md` - Complete documentation
- ✅ `.env.example` - Updated with email settings

### Frontend Files Created/Modified:
- ✅ `src/apps/landing/components/ForgotPasswordPage.tsx` - Updated with API calls
- ✅ `src/apps/landing/components/ResetPasswordPage.tsx` - New reset page
- ✅ `src/apps/landing/LandingPage.tsx` - Added reset password route

### API Endpoints:
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/verify-reset-token` - Verify token validity
- `POST /api/v1/auth/reset-password` - Reset password with token

## 🔧 Testing Without Email Configuration

1. Go to http://localhost:8081/forgot-password
2. Enter any email that exists in your database
3. Check your backend console/terminal
4. You'll see output like:
```
Email configuration not set. Email not sent.
Would send email to: user@example.com
Subject: I-Intern - Password Reset Request
Body: [Reset link with token]
```
5. Copy the reset link from the console
6. Open it in your browser
7. Enter new password and submit

## 🚀 Production Checklist

- [ ] Configure email service (Gmail/SendGrid/Mailgun)
- [ ] Set strong SECRET_KEY in .env
- [ ] Set correct FRONTEND_URL in .env
- [ ] Run database migration
- [ ] Test password reset flow
- [ ] Enable HTTPS
- [ ] Consider rate limiting
- [ ] Monitor email logs

## 📝 Common Issues

**Issue: Emails not sending**
- Solution: Check SMTP credentials in .env, or test without email (console mode)

**Issue: Token expired**
- Solution: Tokens expire after 1 hour, request a new reset

**Issue: Database error**
- Solution: Run migration script or delete test.db and restart

**Issue: Frontend can't connect to backend**
- Solution: Ensure backend is running on port 8000

## 🎨 Features

✅ Works for ALL user types (interns, companies, admins)
✅ Secure token-based reset (1-hour expiration)
✅ Beautiful, responsive UI with animations
✅ Email notifications with branded template
✅ Password strength validation
✅ Comprehensive error handling
✅ Development mode (no email needed)
✅ Production-ready email support

## 📧 Need Help?

1. Check backend console for error messages
2. Review `FORGOT_PASSWORD_README.md` for detailed docs
3. Verify email configuration in .env
4. Test API endpoints directly with cURL (see README)

---

**Ready to go!** 🎉 The forgot password feature is now fully functional.
