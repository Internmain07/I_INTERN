# 🚀 QUICK START - Production Deployment

## ⚡ TL;DR - What You Need to Do NOW

### 1. Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output → Use as `SECRET_KEY` in Render

### 2. Set Up Gmail for Emails
1. Enable 2FA: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password (remove spaces)

### 3. Deploy to Render

#### Create PostgreSQL Database
```
Render Dashboard → New → PostgreSQL
Name: i-intern-db
Region: Singapore
Copy: Internal Database URL
```

#### Create Web Service
```
Render Dashboard → New → Web Service
Connect: Your GitHub repo
Environment: Python 3
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Add Environment Variables
```bash
# REQUIRED
SECRET_KEY=<from-step-1>
DATABASE_URL=<internal-database-url>
ENVIRONMENT=production
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-backend.onrender.com
ALLOWED_ORIGINS=https://your-domain.com

# EMAIL (required for new features)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=<app-password-from-step-2>
FROM_EMAIL=noreply@your-domain.com

# BUILD
CARGO_HOME=/opt/render/project/.cargo
CARGO_TARGET_DIR=/opt/render/project/.cargo-target
```

### 4. Deploy & Test
```bash
# Test API
curl https://your-backend.onrender.com/

# Expected: {"message": "Welcome to the i-Intern API"}
```

---

## ✅ What's Been Configured

- ✅ Email verification with OTP
- ✅ Password reset with OTP  
- ✅ Welcome emails after registration
- ✅ Secure environment variable configuration
- ✅ Google OAuth disabled (ready to enable when needed)
- ✅ Debug endpoints removed
- ✅ Production-ready CORS
- ✅ Dynamic URLs based on environment

---

## 📚 Full Documentation

- **Complete Guide:** `PRODUCTION_DEPLOYMENT_GUIDE.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Changes Made:** `PRODUCTION_CONFIG_CHANGES.md`
- **Environment Variables:** `.env.example`

---

## 🆘 Quick Help

**Problem:** Database won't connect  
**Fix:** Use Internal Database URL from Render, not External

**Problem:** Emails not sending  
**Fix:** Use Gmail App Password, not regular password

**Problem:** CORS errors  
**Fix:** Add exact frontend URL to ALLOWED_ORIGINS (check https vs http)

**Problem:** Service unavailable  
**Fix:** Check Render build logs, verify all environment variables set

---

## 🎯 Deploy Now!

Your code is ready. Just add environment variables and deploy! 🚀

**Estimated Time:** 15 minutes  
**Next Step:** Go to Render.com and follow Step 3 above
