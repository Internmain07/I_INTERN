# I-Intern Deployment Guide

## 🚀 Production Environment Setup

This guide will help you deploy both the frontend and backend of I-Intern to production.

---

## 📋 Prerequisites

- GitHub account
- Domain: `i-intern.com` (already configured)
- PostgreSQL database (Neon DB - already set up)
- Hosting accounts (choose one for backend):
  - **Render** (Recommended - Free tier available)
  - **Railway** (Good alternative)
  - **Heroku**
  - **DigitalOcean**
  - **AWS/Azure** (Advanced)

---

## 🔧 Backend Deployment (Choose One Platform)

### Option 1: Deploy to Render (Recommended)

Render offers a free tier and is very easy to use.

#### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Connect your GitHub repository**
   - Go to Dashboard → New → Web Service
   - Connect your GitHub account
   - Select the `I_INTERN` repository

3. **Configure the service:**
   ```
   Name: i-intern-backend
   Region: Singapore (closest to your Neon DB)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables:**
   Go to Environment tab and add:
   ```
   SECRET_KEY = a-very-strong-and-unique-secret-key-for-your-project
   DATABASE_URL = postgresql://neondb_owner:npg_pjSFt3Hqki1W@ep-dawn-pine-a1pod47e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ALLOWED_ORIGINS = https://i-intern.com,https://www.i-intern.com
   ENVIRONMENT = production
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment to complete (~3-5 minutes)
   - Note the URL: `https://i-intern-backend.onrender.com`

6. **Test the backend:**
   - Visit: `https://i-intern-backend.onrender.com/`
   - You should see: `{"message": "Welcome to the i-Intern API"}`
   - Test stats endpoint: `https://i-intern-backend.onrender.com/api/v1/landing/stats`

---

### Option 2: Deploy to Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `I_INTERN` repository

3. **Configure:**
   ```
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add environment variables** (same as Render)

5. **Generate domain** and note the URL

---

### Option 3: Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   # Windows PowerShell
   winget install Heroku.HerokuCLI
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   cd backend
   heroku create i-intern-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key"
   heroku config:set DATABASE_URL="your-database-url"
   heroku config:set ALLOWED_ORIGINS="https://i-intern.com,https://www.i-intern.com"
   heroku config:set ENVIRONMENT="production"
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## 🎨 Frontend Deployment

Your frontend is likely already deployed (since you have a live site). But here's how to update it:

### If using Vercel/Netlify:

1. **Update environment variable:**

   **For Render backend:**
   ```
   VITE_API_URL=https://i-intern-backend.onrender.com
   ```

   **For Railway backend:**
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```

   **For custom domain:**
   ```
   VITE_API_URL=https://api.i-intern.com
   ```

2. **Rebuild and deploy:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Push to trigger auto-deployment** (if using CI/CD)
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

## 🔗 Custom Domain Setup (Optional but Recommended)

### Setup API Subdomain

If you want `api.i-intern.com` instead of `i-intern-backend.onrender.com`:

1. **In Render/Railway:**
   - Go to Settings → Custom Domain
   - Add: `api.i-intern.com`

2. **In your domain registrar (GoDaddy/Namecheap/etc):**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: api
     Value: i-intern-backend.onrender.com (or your Railway URL)
     ```

3. **Update frontend .env.production:**
   ```
   VITE_API_URL=https://api.i-intern.com
   ```

4. **Update backend ALLOWED_ORIGINS** environment variable to include the new domain

---

## 🧪 Testing Your Deployment

### 1. Test Backend Endpoints:

```bash
# Health check
curl https://your-backend-url.onrender.com/

# Stats endpoint
curl https://your-backend-url.onrender.com/api/v1/landing/stats

# Should return:
# {"internships_posted": 0, "companies_registered": 0, "students_placed": 0}
```

### 2. Test Frontend:

1. Visit `https://i-intern.com`
2. Open Developer Console (F12)
3. Check for:
   - ✅ No CORS errors
   - ✅ No 404 errors for `/api/v1/landing/stats`
   - ✅ Stats displaying correctly

---

## 🐛 Troubleshooting

### Issue: 404 Not Found on /api/v1/landing/stats

**Solution:** Backend is not deployed or not running
- Check if backend URL is accessible
- Verify environment variables are set correctly
- Check backend logs in Render/Railway dashboard

### Issue: CORS Error

**Solution:** ALLOWED_ORIGINS not configured
- Add your frontend URL to `ALLOWED_ORIGINS` environment variable
- Format: `https://i-intern.com,https://www.i-intern.com`
- Redeploy backend after changing

### Issue: Database Connection Error

**Solution:** DATABASE_URL incorrect
- Verify the PostgreSQL connection string
- Ensure your Neon DB is active
- Check if IP is whitelisted (Neon allows all by default)

### Issue: Backend takes 30+ seconds to respond (Render Free Tier)

**Solution:** Free tier spins down after 15 minutes of inactivity
- First request wakes it up (cold start)
- Consider upgrading to paid tier for always-on
- Or implement a ping service to keep it alive

---

## 📦 Quick Deployment Checklist

- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Environment variables configured
- [ ] Backend URL noted (e.g., `https://i-intern-backend.onrender.com`)
- [ ] Backend health check successful
- [ ] Stats endpoint returns JSON
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend rebuilt with `npm run build`
- [ ] Frontend redeployed
- [ ] Tested landing page - no console errors
- [ ] Stats displaying correctly
- [ ] Login/Register works
- [ ] All features functional

---

## 🎯 Recommended Architecture

```
Frontend (i-intern.com)
    ↓
Backend API (api.i-intern.com or i-intern-backend.onrender.com)
    ↓
PostgreSQL Database (Neon DB)
```

---

## 📞 Need Help?

Common issues and solutions:

1. **"Not Found" error** → Backend not deployed
2. **CORS error** → Check ALLOWED_ORIGINS
3. **Slow response** → Cold start on free tier
4. **Database error** → Check DATABASE_URL
5. **Login not working** → Check SECRET_KEY is set

---

## 🔒 Security Checklist

- [ ] `.env` files added to `.gitignore`
- [ ] Strong SECRET_KEY in production
- [ ] DATABASE_URL not exposed in frontend
- [ ] CORS properly configured (not using `*`)
- [ ] HTTPS enabled for both frontend and backend
- [ ] API docs disabled in production (already configured)

---

## 🚀 Next Steps After Deployment

1. Monitor backend logs for errors
2. Set up uptime monitoring (e.g., UptimeRobot)
3. Configure backup for database
4. Set up CI/CD for automatic deployments
5. Add error tracking (e.g., Sentry)
6. Implement rate limiting for API
7. Add analytics

---

## 📝 Environment Variables Summary

### Backend (.env or hosting platform):
```bash
SECRET_KEY=<strong-random-key>
DATABASE_URL=<postgresql-connection-string>
ALLOWED_ORIGINS=https://i-intern.com,https://www.i-intern.com
ENVIRONMENT=production
```

### Frontend (.env.production):
```bash
VITE_API_URL=https://api.i-intern.com
```

---

Good luck with your deployment! 🎉
