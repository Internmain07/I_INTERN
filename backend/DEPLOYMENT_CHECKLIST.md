# ✅ Pre-Deployment Checklist for I-INTERN Backend

## 🔒 Security (Critical)

- [x] ✅ Google OAuth hardcoded credentials removed
- [x] ✅ Debug endpoint `/debug/users` disabled
- [x] ✅ Environment variables used for all sensitive data
- [ ] ⚠️ Generate new `SECRET_KEY` for production
- [ ] ⚠️ Change all default passwords
- [ ] ⚠️ Review and set proper CORS origins

## 🗄️ Database

- [ ] ⚠️ PostgreSQL database created on Render
- [ ] ⚠️ `DATABASE_URL` environment variable set
- [ ] ⚠️ Database tables created (automatic on first run)
- [ ] ⚠️ Test database connection

## 📧 Email Configuration

- [ ] ⚠️ Gmail App Password generated (or other SMTP provider configured)
- [ ] ⚠️ `SMTP_USERNAME` set
- [ ] ⚠️ `SMTP_PASSWORD` set (use App Password, not regular password)
- [ ] ⚠️ `FROM_EMAIL` set
- [ ] ⚠️ Test email sending (register a test user)

## 🌐 URLs and CORS

- [ ] ⚠️ `FRONTEND_URL` set to production domain
- [ ] ⚠️ `BACKEND_URL` set to production domain
- [ ] ⚠️ `ALLOWED_ORIGINS` includes all frontend domains
- [ ] ⚠️ Update frontend API base URL to point to production backend

## 📦 Render.com Configuration

- [ ] ⚠️ Repository connected to Render
- [ ] ⚠️ Build command: `pip install -r requirements.txt`
- [ ] ⚠️ Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] ⚠️ Python version set to 3.12+ in `runtime.txt`
- [ ] ⚠️ All environment variables set in Render dashboard
- [ ] ⚠️ Branch set to `main` (or your deployment branch)

## ✅ Environment Variables (Copy to Render Dashboard)

### Required for Basic Functionality
```bash
SECRET_KEY=<generate-with-python>
DATABASE_URL=<from-render-postgres>
ENVIRONMENT=production
FRONTEND_URL=https://i-intern.com
BACKEND_URL=https://i-intern-backend.onrender.com
ALLOWED_ORIGINS=https://i-intern.com,https://www.i-intern.com
```

### Required for Email Features
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=<gmail-app-password>
FROM_EMAIL=noreply@i-intern.com
```

### Required for Build (WeasyPrint)
```bash
CARGO_HOME=/opt/render/project/.cargo
CARGO_TARGET_DIR=/opt/render/project/.cargo-target
```

## 🧪 Testing After Deployment

- [ ] ⚠️ API root endpoint responds: `GET /`
- [ ] ⚠️ Health check passes
- [ ] ⚠️ User registration works
- [ ] ⚠️ Email verification OTP received
- [ ] ⚠️ Welcome email received after verification
- [ ] ⚠️ Login works
- [ ] ⚠️ Password reset OTP received
- [ ] ⚠️ Password reset completes successfully
- [ ] ⚠️ CORS works from frontend
- [ ] ⚠️ File uploads work (avatars)
- [ ] ⚠️ All API endpoints accessible

## 🔧 Commands to Run

### Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Test API Endpoint
```bash
curl https://your-backend-url.onrender.com/
```

### Test with Authorization
```bash
curl -H "Authorization: Bearer <token>" https://your-backend-url.onrender.com/api/v1/auth/me
```

## 📊 Monitoring

- [ ] ⚠️ Check Render logs for errors
- [ ] ⚠️ Monitor email delivery
- [ ] ⚠️ Check database connections
- [ ] ⚠️ Monitor API response times
- [ ] ⚠️ Set up uptime monitoring (e.g., UptimeRobot)

## 🐛 Common Issues

### Database Connection Errors
- Use Internal Database URL (not External)
- Ensure same region for DB and web service

### CORS Errors
- Add exact frontend URL to ALLOWED_ORIGINS
- Check for trailing slashes
- Verify HTTPS vs HTTP

### Email Not Sending
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail
- Check SMTP settings

### 503 Service Unavailable
- Check build logs for errors
- Verify all dependencies in requirements.txt
- Service might be sleeping (free tier)

## 📝 New Features Checklist

- [x] ✅ Email verification with OTP implemented
- [x] ✅ Password reset with OTP implemented
- [x] ✅ Welcome email after verification
- [x] ✅ User model updated with new fields
- [x] ✅ Email templates (HTML) created
- [x] ✅ Environment variables configured
- [x] ✅ Production-ready configuration

## 🚀 Ready to Deploy?

Once all items above are checked:

1. Commit and push changes to GitHub
2. Trigger deployment on Render (automatic or manual)
3. Monitor build logs
4. Test all features
5. Update frontend to use production API URL

---

**Status:** ✅ Backend code is production-ready
**Action Required:** Configure environment variables in Render dashboard
**Estimated Deploy Time:** 5-10 minutes

---

## 📞 Need Help?

See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions.
