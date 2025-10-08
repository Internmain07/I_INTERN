# 🚀 I-INTERN Backend - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Completed Security Updates
- ✅ Google OAuth hardcoded credentials replaced with environment variables
- ✅ Debug endpoint `/debug/users` removed from production
- ✅ Environment variables properly configured in `render.yaml`
- ✅ Frontend URLs use environment variables
- ✅ `.env.example` file created for reference

---

## 🔧 Required Environment Variables

### 1. Core Application Settings (REQUIRED)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | ✅ Yes | `Rk8mP3...` | JWT token secret (generate with Python) |
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host/db` | PostgreSQL connection string |
| `ENVIRONMENT` | ✅ Yes | `production` | Set to "production" |

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. URL Configuration (REQUIRED)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `FRONTEND_URL` | ✅ Yes | `https://i-intern.com` | Your frontend domain |
| `BACKEND_URL` | ✅ Yes | `https://api.i-intern.com` | Your backend domain |
| `ALLOWED_ORIGINS` | ✅ Yes | `https://i-intern.com,https://www.i-intern.com` | CORS allowed origins |

### 3. Email/SMTP Configuration (REQUIRED for features)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SMTP_SERVER` | ⚠️ Email | `smtp.gmail.com` | SMTP server address |
| `SMTP_PORT` | ⚠️ Email | `587` | SMTP port (587=TLS, 465=SSL) |
| `SMTP_USERNAME` | ⚠️ Email | `your-email@gmail.com` | SMTP username/email |
| `SMTP_PASSWORD` | ⚠️ Email | `app-password-here` | SMTP password (use App Password for Gmail) |
| `FROM_EMAIL` | ⚠️ Email | `noreply@i-intern.com` | Sender email address |

**Note:** Email features (password reset, email verification, welcome emails) require SMTP configuration. Without it, emails won't be sent (but app won't crash).

### 4. Google OAuth (OPTIONAL - Currently Disabled)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | ❌ No | `123456.apps.googleusercontent.com` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ No | `secret123` | Google OAuth Client Secret |

---

## 📧 Setting Up Gmail SMTP (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### Step 2: Create App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other" as the device and name it "I-Intern Backend"
4. Click "Generate"
5. Copy the 16-character password (remove spaces)
6. Use this as your `SMTP_PASSWORD`

### Step 3: Configure Environment Variables
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # Remove spaces: abcdefghijklmnop
FROM_EMAIL=noreply@yourdomain.com
```

---

## 🌐 Render.com Deployment

### Step 1: Create Database (PostgreSQL)

1. Go to Render Dashboard → **New** → **PostgreSQL**
2. Configure:
   - Name: `i-intern-db`
   - Region: Same as your web service (e.g., Singapore)
   - Plan: Free (or paid for better performance)
3. Click **Create Database**
4. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Backend Service

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - Name: `i-intern-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Region: Singapore (or your preferred region)
   - Plan: Free

### Step 3: Set Environment Variables

In your Render web service, go to **Environment** tab and add:

```bash
# Core Settings
SECRET_KEY=<generate-with-python-secrets>
DATABASE_URL=<paste-internal-database-url>
ENVIRONMENT=production

# URLs (update with your actual domains)
FRONTEND_URL=https://i-intern.com
BACKEND_URL=https://i-intern-backend.onrender.com
ALLOWED_ORIGINS=https://i-intern.com,https://www.i-intern.com

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=<your-gmail-app-password>
FROM_EMAIL=noreply@i-intern.com

# Build settings (required for WeasyPrint/PDF generation)
CARGO_HOME=/opt/render/project/.cargo
CARGO_TARGET_DIR=/opt/render/project/.cargo-target
```

### Step 4: Deploy

1. Click **Save Changes**
2. Render will automatically deploy your service
3. Wait for the build to complete (5-10 minutes)
4. Check the logs for any errors

---

## 🔍 Post-Deployment Verification

### 1. Check API Health
```bash
curl https://your-backend-url.onrender.com/
# Expected: {"message": "Welcome to the i-Intern API"}
```

### 2. Check API Documentation
Visit: `https://your-backend-url.onrender.com/api/docs`
- Should show all API endpoints
- Only available if `ENVIRONMENT=development` (disable in production for security)

### 3. Test Email Functionality
Try the following features:
- ✅ User Registration (should send verification OTP)
- ✅ Email Verification (should send welcome email)
- ✅ Forgot Password (should send reset OTP)
- ✅ Password Reset (should update password)

### 4. Check CORS
Test from your frontend:
```javascript
fetch('https://your-backend-url.onrender.com/api/v1/auth/me', {
  headers: { 'Authorization': 'Bearer <token>' }
})
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Errors
**Solution:**
- Verify `DATABASE_URL` is correct (use Internal URL, not External)
- Check database is running in Render dashboard
- Ensure database and web service are in the same region

### Issue: CORS Errors
**Solution:**
- Add your frontend URL to `ALLOWED_ORIGINS`
- Ensure URL matches exactly (including https://)
- Check for trailing slashes

### Issue: Emails Not Sending
**Solution:**
- Verify SMTP credentials are correct
- Use Gmail App Password, not regular password
- Check `SMTP_USERNAME` and `FROM_EMAIL` are valid
- Check Render logs for email errors

### Issue: 503 Service Unavailable
**Solution:**
- Check Render build logs for errors
- Verify all required environment variables are set
- Ensure `requirements.txt` has all dependencies
- Check if service is sleeping (free tier)

### Issue: Database Tables Not Created
**Solution:**
Run migrations manually:
```bash
# Connect to your Render shell
python -c "from app.db.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
```

---

## 📊 Monitoring and Logs

### View Logs in Render
1. Go to your web service in Render dashboard
2. Click **Logs** tab
3. Monitor for errors or warnings

### Important Log Messages
- `✓ http://localhost:8081` - CORS origin configured ✅
- `Failed to send email:` - SMTP configuration issue ⚠️
- `Could not validate credentials` - Invalid JWT token ⚠️
- `Internship not found` - Database query issue ⚠️

---

## 🔐 Security Best Practices

### ✅ Implemented
- ✅ Debug endpoints removed/disabled
- ✅ Environment variables for sensitive data
- ✅ CORS properly configured
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ OTP expiration (10 minutes)

### 🔒 Additional Recommendations
- [ ] Enable HTTPS (Render provides this automatically)
- [ ] Use strong SECRET_KEY (at least 32 characters)
- [ ] Regularly rotate database passwords
- [ ] Monitor failed login attempts
- [ ] Set up database backups
- [ ] Use rate limiting for API endpoints
- [ ] Enable SQL injection protection (SQLAlchemy handles this)

---

## 📝 New Features Deployed

### 1. Email Verification with OTP
- **Endpoint:** `POST /api/v1/auth/register`
- **Flow:** Register → Receive OTP → Verify → Welcome Email
- **OTP Expiry:** 10 minutes

### 2. Password Reset with OTP
- **Endpoints:** 
  - `POST /api/v1/auth/forgot-password` - Request OTP
  - `POST /api/v1/auth/verify-otp` - Verify OTP
  - `POST /api/v1/auth/reset-password` - Reset password
- **OTP Expiry:** 10 minutes

### 3. Welcome Email
- Sent after successful email verification
- Customized based on user role (Student/Company)
- Professional HTML template

### 4. Enhanced User Model
- Added `email_verified`, `email_verification_otp`, `email_verification_otp_expires`
- Added `reset_otp`, `reset_otp_expires` for password reset

---

## 🆘 Support

If you encounter issues:
1. Check the logs in Render dashboard
2. Review this guide's troubleshooting section
3. Verify all environment variables are set correctly
4. Check the `.env.example` file for reference
5. Test email functionality with a personal email first

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)

---

**Last Updated:** October 8, 2025
**Status:** ✅ Ready for Production Deployment
