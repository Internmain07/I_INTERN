# 🚀 Forgot Password - Quick Reference Card

## 📍 URLs
- Request Reset: `http://localhost:8081/forgot-password`
- Reset Password: `http://localhost:8081/reset-password?token=xxx`
- Login: `http://localhost:8081/login`

## 🔌 API Endpoints
```
POST /api/v1/auth/forgot-password        # Request reset
POST /api/v1/auth/verify-reset-token     # Verify token
POST /api/v1/auth/reset-password         # Reset password
```

## 🏃 Quick Start (Development)

### 1️⃣ Update Database
```powershell
cd backend
Remove-Item test.db
```

### 2️⃣ Start Backend
```powershell
cd backend
.\env\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

### 3️⃣ Start Frontend
```powershell
cd frontend
npm run dev
```

### 4️⃣ Test Flow
1. Go to `/forgot-password`
2. Enter email
3. Check backend console for reset link
4. Copy token from URL
5. Go to `/reset-password?token=YOUR_TOKEN`
6. Enter new password
7. Login!

## 📧 Email Setup (Production Only)

Add to `backend/.env`:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:8081
```

## 🔑 Password Rules
- ✅ Minimum 8 characters
- ✅ 1+ uppercase letter
- ✅ 1+ lowercase letter
- ✅ 1+ number

## 🧪 Test Script
```powershell
cd backend
python test_forgot_password.py
```

## 📚 Documentation Files
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `FORGOT_PASSWORD_SETUP.md` - Setup guide
- `backend/FORGOT_PASSWORD_README.md` - Technical docs

## ✅ Checklist
- [ ] Database updated (delete test.db or run migration)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 8081
- [ ] Tested forgot password flow
- [ ] Email configured (optional for dev)

## 🎯 Works For
- ✅ Interns/Students
- ✅ Companies
- ✅ Admins

## 🆘 Troubleshooting
| Problem | Solution |
|---------|----------|
| Backend not starting | Check if port 8000 is free |
| Database error | Delete test.db and restart |
| Email not sending | Check SMTP config or use console mode |
| Token expired | Request new reset (1 hour expiry) |
| Frontend can't connect | Ensure backend is on port 8000 |

## 📞 Quick Commands

**Check backend running:**
```powershell
curl http://localhost:8000/docs
```

**Test forgot password API:**
```powershell
curl -X POST http://localhost:8000/api/v1/auth/forgot-password -H "Content-Type: application/json" -d '{\"email\": \"test@example.com\"}'
```

**View API docs:**
```
http://localhost:8000/docs
```

---
**Status:** ✅ FULLY FUNCTIONAL | **Last Updated:** Oct 2025
