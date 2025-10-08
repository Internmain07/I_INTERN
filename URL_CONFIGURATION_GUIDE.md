# 🎯 URL Configuration Visual Guide

## Current Production Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR I-INTERN APP                        │
└─────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  FRONTEND (User Interface)                                    │
│  https://i-intern-2.onrender.com                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  • User Registration/Login                               │ │
│  │  • Dashboard                                             │ │
│  │  • Profile Management                                    │ │
│  │  • Internship Applications                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            │                                   │
│                            │ API Calls with Cookies            │
│                            ▼                                   │
│  Configured in: frontend/.env.production                      │
│  VITE_API_URL=https://i-intern-api.onrender.com              │
└───────────────────────────────────────────────────────────────┘
                             │
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│  BACKEND API (Server)                                         │
│  https://i-intern-api.onrender.com                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  • Authentication (Login/Register/Logout)                │ │
│  │  • Email Verification                                    │ │
│  │  • Password Reset                                        │ │
│  │  • User/Company Management                               │ │
│  │  • Cookie Management                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            │                                   │
│                            │                                   │
│                            ▼                                   │
│  Configured in: backend/.env                                  │
│  FRONTEND_URL=https://i-intern-2.onrender.com                │
│  BACKEND_URL=https://i-intern-api.onrender.com               │
│  ALLOWED_ORIGINS=https://i-intern-2.onrender.com,...         │
└───────────────────────────────────────────────────────────────┘
                             │
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                        │
│  Neon PostgreSQL - Already Configured ✅                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  • User Data                                             │ │
│  │  • Company Data                                          │ │
│  │  • Internship Data                                       │ │
│  │  • Applications                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Files Map

### Backend Configuration

```
backend/
├── .env ✅ UPDATED
│   ├── ENVIRONMENT=production
│   ├── FRONTEND_URL=https://i-intern-2.onrender.com
│   ├── BACKEND_URL=https://i-intern-api.onrender.com
│   ├── ALLOWED_ORIGINS=https://i-intern-2.onrender.com,...
│   ├── COOKIE_SECURE=true
│   └── COOKIE_DOMAIN=.onrender.com
│
├── .env.example ✅ UPDATED
│   └── (Production defaults with examples)
│
├── render.yaml ✅ UPDATED
│   └── (Deployment configuration with environment variables)
│
└── app/
    ├── main.py ✅ UPDATED
    │   └── (CORS with production origins)
    │
    ├── core/
    │   ├── config.py ✅ UPDATED
    │   │   └── (Cookie settings)
    │   └── security.py ✅ (Already configured)
    │
    └── api/
        ├── deps.py ✅ UPDATED
        │   └── (Cookie + Bearer token support)
        └── v1/endpoints/
            └── auth.py ✅ UPDATED
                └── (Login/Logout with cookies)
```

### Frontend Configuration

```
frontend/
├── .env.production ✅ UPDATED
│   └── VITE_API_URL=https://i-intern-api.onrender.com
│
├── .env.development ✅ (Keep for local dev)
│   └── VITE_API_URL=http://localhost:8001
│
└── src/
    └── api.ts ✅ (Already has credentials: 'include')
```

---

## 🌐 URL Relationships

### How URLs Work Together:

1. **User visits:** `https://i-intern-2.onrender.com`
   
2. **Frontend makes API call to:** `https://i-intern-api.onrender.com/api/v1/auth/login`
   - With `credentials: 'include'` (sends cookies)
   
3. **Backend checks CORS:**
   - Is `https://i-intern-2.onrender.com` in `ALLOWED_ORIGINS`? ✅
   - Allow request and set cookie
   
4. **Cookie set with:**
   - Domain: `.onrender.com` (works for all *.onrender.com)
   - Secure: `true` (HTTPS only)
   - HttpOnly: `true` (No JavaScript access)
   - SameSite: `lax` (CSRF protection)
   
5. **Future requests automatically include cookie**

---

## 📝 URLs to Update Before Deployment

### ⚠️ Replace These Placeholder URLs:

| File | Variable | Current Value | Replace With |
|------|----------|---------------|--------------|
| `backend/.env` | `FRONTEND_URL` | `https://i-intern-2.onrender.com` | Your actual frontend URL |
| `backend/.env` | `BACKEND_URL` | `https://i-intern-api.onrender.com` | Your actual backend URL |
| `backend/.env` | `ALLOWED_ORIGINS` | `https://i-intern-2.onrender.com,...` | Your actual frontend URL(s) |
| `frontend/.env.production` | `VITE_API_URL` | `https://i-intern-api.onrender.com` | Your actual backend URL |

### 🔄 Deployment Flow:

1. **Deploy Backend First** → Get backend URL
2. **Update URLs** → Use real backend URL everywhere
3. **Deploy Frontend** → Get frontend URL
4. **Update CORS** → Add real frontend URL to backend
5. **Redeploy** → Both services with correct URLs

---

## ✅ Verification Checklist

After deployment, verify these URLs work:

### Backend Endpoints:
- ✅ `https://your-backend-url.onrender.com/` → Welcome message
- ✅ `https://your-backend-url.onrender.com/api/v1/auth/login` → Login endpoint
- ✅ `https://your-backend-url.onrender.com/api/v1/auth/register` → Register endpoint

### Frontend Pages:
- ✅ `https://your-frontend-url.onrender.com/` → Homepage
- ✅ `https://your-frontend-url.onrender.com/login` → Login page
- ✅ `https://your-frontend-url.onrender.com/register` → Register page

### Cross-Origin Requests:
- ✅ Frontend can call backend APIs
- ✅ No CORS errors in browser console
- ✅ Cookies set correctly after login

---

## 🎯 Domain Options

### Option 1: Both on Render (Current Setup) ✅
```
Frontend:  https://i-intern-2.onrender.com
Backend:   https://i-intern-api.onrender.com
Cookie:    COOKIE_DOMAIN=.onrender.com
```

### Option 2: Custom Domain
```
Frontend:  https://i-intern.com
Backend:   https://api.i-intern.com
Cookie:    COOKIE_DOMAIN=.i-intern.com
```

### Option 3: Frontend on Vercel, Backend on Render
```
Frontend:  https://i-intern.vercel.app
Backend:   https://i-intern-api.onrender.com
Cookie:    COOKIE_DOMAIN= (leave empty)
Note: Different domains require special CORS setup
```

---

## 🔒 Cookie Domain Explained

### `.onrender.com` (with dot)
- Works for: `api.onrender.com`, `app.onrender.com`, `anything.onrender.com`
- Use when: Frontend and backend are on different Render subdomains

### Empty (no domain)
- Works for: Same exact domain only
- Use when: Frontend and backend are on completely different domains

### `.yourdomain.com` (with dot)
- Works for: `api.yourdomain.com`, `www.yourdomain.com`, `app.yourdomain.com`
- Use when: You have a custom domain with subdomains

---

## 📊 Current Configuration Status

```
✅ Backend .env           → Production URLs set
✅ Backend .env.example   → Production defaults
✅ Backend config.py      → Cookie settings added
✅ Backend main.py        → Production CORS
✅ Backend auth.py        → Cookie authentication
✅ Backend deps.py        → Cookie support
✅ Backend render.yaml    → Deployment config
✅ Frontend .env.production → Backend URL set
✅ Frontend api.ts        → Cookie support

🎉 PRODUCTION READY!
```

---

## 🚀 Next Steps

1. **Get actual URLs** from Render after deployment
2. **Update configuration files** with real URLs
3. **Test thoroughly** using checklist in deployment guide
4. **Monitor logs** for any issues
5. **🎉 Launch!**

---

See `DEPLOYMENT_CHECKLIST_QUICK.md` for step-by-step deployment instructions!
