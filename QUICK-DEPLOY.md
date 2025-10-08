# 🚀 I-Intern Deployment Quick Reference

## ⚡ The Problem You're Facing

**Error:** `Error fetching stats: SyntaxError: Unexpected token 'N', "Not Found"`

**Root Cause:** Your backend API is NOT deployed. Frontend is live at `https://i-intern.com` but trying to fetch data from a non-existent backend.

---

## ✅ The Solution (Step-by-Step)

### Step 1: Deploy Backend to Render (5 minutes)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select `I_INTERN` repository
4. Configure:
   ```
   Name: i-intern-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   SECRET_KEY = a-very-strong-and-unique-secret-key-for-your-project
   DATABASE_URL = postgresql://neondb_owner:npg_pjSFt3Hqki1W@ep-dawn-pine-a1pod47e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ALLOWED_ORIGINS = https://i-intern.com,https://www.i-intern.com
   ENVIRONMENT = production
   ```

6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment
8. **COPY YOUR BACKEND URL:** `https://i-intern-backend.onrender.com`

---

### Step 2: Update Frontend Configuration

1. Open: `frontend\.env.production`
2. Change:
   ```bash
   # OLD (causes 404):
   VITE_API_URL=https://i-intern.com
   
   # NEW (your Render backend):
   VITE_API_URL=https://i-intern-backend.onrender.com
   ```

---

### Step 3: Rebuild and Redeploy Frontend

```powershell
cd frontend
npm run build
```

Then push to GitHub (if you have auto-deploy) or manually upload the `dist` folder to your hosting.

---

### Step 4: Test Everything

1. **Test Backend Directly:**
   - Visit: `https://i-intern-backend.onrender.com/`
   - Should see: `{"message": "Welcome to the i-Intern API"}`
   
   - Visit: `https://i-intern-backend.onrender.com/api/v1/landing/stats`
   - Should see: `{"internships_posted": 0, "companies_registered": 0, "students_placed": 0}`

2. **Test Frontend:**
   - Visit: `https://i-intern.com`
   - Open Console (F12)
   - Should see NO errors
   - Stats should display: "250+", "20+", "100+"

---

## 📋 Deployment Checklist

- [ ] Signed up for Render.com
- [ ] Created Web Service connected to GitHub
- [ ] Configured build and start commands
- [ ] Added all 4 environment variables
- [ ] Deployment successful (green checkmark)
- [ ] Backend URL accessible and returns JSON
- [ ] Updated `frontend/.env.production` with backend URL
- [ ] Rebuilt frontend with `npm run build`
- [ ] Redeployed frontend
- [ ] Tested frontend - no 404 errors
- [ ] Stats loading correctly

---

## 🎯 Your URLs After Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://i-intern.com | Your live website |
| Backend | https://i-intern-backend.onrender.com | API server |
| Database | Neon DB (already configured) | PostgreSQL |
| Backend Health | https://i-intern-backend.onrender.com/ | Test if backend is up |
| Backend Stats | https://i-intern-backend.onrender.com/api/v1/landing/stats | Test stats endpoint |

---

## 🐛 Troubleshooting

### "Build failed" on Render
- Check if `requirements.txt` exists in backend folder
- Verify Python version compatibility

### "Service Unavailable"
- Wait a few minutes - free tier has cold starts
- Check Render logs for errors

### Still getting 404 after deployment
- Clear browser cache
- Check `.env.production` file was updated
- Verify frontend was rebuilt after changing .env
- Check backend URL is correct (no trailing slash)

### CORS Error
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check for typos in domain names
- Restart Render service after changing environment variables

---

## ⏱️ Expected Timeline

1. Backend deployment: ~5 minutes
2. Frontend rebuild: ~2 minutes
3. Frontend redeployment: ~3 minutes
4. DNS propagation (if using custom domain): up to 24 hours

**Total: About 10-15 minutes** (excluding DNS)

---

## 💰 Cost

- **Render Free Tier:** $0/month
  - 750 hours/month
  - Spins down after 15 min inactivity
  - Cold start: ~30 seconds
  - Good for: Testing, MVP, low-traffic sites

- **Render Starter:** $7/month
  - Always on
  - No cold starts
  - Better for: Production use

---

## 📱 Alternative Platforms

If Render doesn't work for you:

1. **Railway:** https://railway.app (Similar to Render)
2. **Fly.io:** https://fly.io (Good free tier)
3. **Heroku:** https://heroku.com (No free tier anymore)
4. **DigitalOcean App Platform:** $5/month
5. **AWS/Azure/GCP:** More complex, but powerful

---

## 🔗 Important Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Complete deployment guide |
| `SETUP.md` | Local development setup |
| `backend/README.md` | Backend documentation |
| `backend/Procfile` | Deployment configuration |
| `backend/runtime.txt` | Python version |
| `backend/render.yaml` | Render configuration |
| `backend/.env.example` | Environment template |
| `backend/.gitignore` | Protect sensitive files |

---

## 🎓 What You Learned

1. **Problem:** Frontend and backend need separate deployments
2. **Solution:** Deploy backend to Render, update frontend config
3. **Key Concept:** API URL must point to deployed backend
4. **Important:** Environment variables must be set on hosting platform
5. **Security:** Never commit `.env` files to Git

---

## 🚀 Next Steps After Deployment

1. ✅ Deploy backend
2. ✅ Update frontend config
3. ✅ Test everything
4. 📊 Monitor backend logs
5. 🔔 Set up uptime monitoring (UptimeRobot)
6. 📈 Add analytics
7. 🔒 Implement rate limiting
8. 🎨 Add more features!

---

## 📞 Need More Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. Check `SETUP.md` for local development help
3. Check Render documentation: https://render.com/docs
4. Check FastAPI docs: https://fastapi.tiangolo.com

---

**Remember:** The free tier spins down after 15 minutes of inactivity. The first request will take 30 seconds to wake it up. This is normal!

Good luck! 🎉
