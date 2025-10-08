# Quick Setup Guide - I-Intern

## 🚀 Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows CMD
   venv\Scripts\activate.bat
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Copy environment file:**
   ```bash
   # Windows PowerShell
   Copy-Item .env.development .env
   
   # Linux/Mac
   cp .env.development .env
   ```

6. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Test backend:**
   - Open: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs
   - Stats endpoint: http://localhost:8000/api/v1/landing/stats

---

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Visit: http://localhost:5173

---

## 🔧 Environment Configuration

### Backend `.env` (already created):
```bash
SECRET_KEY=dev-secret-key-change-in-production
DATABASE_URL=sqlite:///./test.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

### Frontend `.env.development`:
```bash
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Create Test User:
```bash
cd backend
python create_test_user_simple.py
```

### Test Login:
- Email: test@example.com
- Password: password123
- Role: intern

---

## 📝 Common Commands

### Backend:
```bash
# Run server
uvicorn app.main:app --reload

# Run with specific host/port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend:
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### Backend Issues:

**Module not found:**
```bash
pip install -r requirements.txt
```

**Database locked:**
```bash
# Delete test.db and restart
rm test.db
```

**Port already in use:**
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues:

**Dependencies missing:**
```bash
npm install
```

**API connection failed:**
- Check if backend is running on port 8000
- Verify VITE_API_URL in .env.development

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📦 Project Structure

```
I_INTERN/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Config & security
│   │   ├── db/           # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── utils/        # Utilities
│   ├── .env              # Environment variables (not in git)
│   ├── requirements.txt  # Python dependencies
│   └── Procfile          # For deployment
├── frontend/
│   ├── src/
│   │   ├── apps/         # Feature modules
│   │   ├── services/     # API services
│   │   ├── shared/       # Shared components
│   │   └── api.ts        # API client config
│   ├── .env.development  # Dev environment
│   ├── .env.production   # Prod environment
│   └── package.json      # Node dependencies
└── DEPLOYMENT.md         # Deployment guide
```

---

## ✅ Quick Checklist

- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed
- [ ] Backend .env file created
- [ ] Backend running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 5173
- [ ] Can access landing page
- [ ] Stats are loading (or showing fallback)
- [ ] Can create account
- [ ] Can login

---

Happy coding! 🎉
