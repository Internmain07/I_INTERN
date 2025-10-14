# I-Intern Backend API

FastAPI backend for the I-Intern platform.

## 🚀 Quick Start

### Local Development

1. **Setup:**
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   pip install -r requirements.txt
   cp .env.development .env
   ```

2. **Run:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Test:**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/api/docs
   - Stats: http://localhost:8000/api/v1/landing/stats

### Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the root directory for detailed deployment instructions.

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependencies (DB session, etc.)
│   │   └── v1/
│   │       ├── api.py           # API router aggregator
│   │       └── endpoints/       # All endpoint modules
│   │           ├── auth.py      # Authentication
│   │           ├── landing.py   # Landing page stats
│   │           ├── internships.py
│   │           ├── applications.py
│   │           ├── users.py
│   │           ├── profile.py
│   │           ├── companies.py
│   │           ├── admin.py
│   │           └── resume.py
│   ├── core/
│   │   ├── config.py            # Configuration
│   │   └── security.py          # Password hashing, JWT
│   ├── db/
│   │   ├── base.py              # SQLAlchemy base
│   │   └── session.py           # Database session
│   ├── models/                  # SQLAlchemy models
│   │   ├── user.py
│   │   ├── internship.py
│   │   ├── application.py
│   │   ├── company.py
│   │   └── profile.py
│   ├── schemas/                 # Pydantic schemas
│   │   ├── user.py
│   │   ├── token.py
│   │   ├── internship.py
│   │   └── ...
│   ├── utils/
│   │   └── matching.py          # Matching algorithms
│   └── main.py                  # FastAPI app entry point
├── uploads/
│   └── avatars/                 # User uploaded images
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment variables
├── .env.development             # Development environment
├── .env.production              # Production environment
├── requirements.txt             # Python dependencies
├── Procfile                     # For Heroku/Render deployment
├── runtime.txt                  # Python version for deployment
├── render.yaml                  # Render.com configuration
└── vercel.json                  # Vercel configuration
```

## 🔧 Environment Variables

Create a `.env` file with:

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_ORIGINS=https://i-intern.com,https://www.i-intern.com
ENVIRONMENT=production
```

## 🛣️ API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `GET /me` - Get current user

### Landing Page (`/api/v1/landing`)
- `GET /stats` - Get platform statistics

### Internships (`/api/v1/internships`)
- `GET /` - List all internships
- `POST /` - Create internship (company only)
- `GET /{id}` - Get internship details
- `PUT /{id}` - Update internship
- `DELETE /{id}` - Delete internship

### Applications (`/api/v1/applications`)
- `POST /` - Apply to internship
- `GET /` - Get user's applications
- `PUT /{id}` - Update application status

### Users (`/api/v1/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile

### Profile (`/api/v1/profile`)
- `GET /` - Get user profile
- `PUT /` - Update profile
- `POST /avatar` - Upload avatar

### Companies (`/api/v1/companies`)
- `GET /` - List companies
- `GET /{id}` - Get company details
- `PUT /{id}` - Update company profile

### Admin (`/api/v1/admin`)
- `GET /dashboard` - Admin dashboard stats
- `GET /users` - List all users
- Various admin operations

### Resume (`/api/v1/resume`)
- `POST /generate` - Generate resume PDF

## 🗄️ Database Models

- **User** - User accounts (intern, company, admin)
- **Profile** - User profile details
- **Internship** - Internship postings
- **Application** - Internship applications
- **Company** - Company information

## 🔒 Security

- Passwords hashed with Argon2
- JWT tokens for authentication
- CORS configured for specific origins
- SQL injection protection via SQLAlchemy
- Input validation with Pydantic

## 📊 Database

Using PostgreSQL (Neon DB) with SQLAlchemy ORM.

### Migrations

Currently using `Base.metadata.create_all()` for development.

For production, consider using Alembic:
```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🧪 Testing

### Manual Testing

```bash
# Health check
curl http://localhost:8000/

# Get stats
curl http://localhost:8000/api/v1/landing/stats

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"intern"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

### Create Test Data

```bash
python create_test_user_simple.py
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

### Database Connection Error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Errors
- Check ALLOWED_ORIGINS in .env
- Ensure frontend URL is included
- Restart server after changes

## 📦 Dependencies

Key packages:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **python-jose** - JWT tokens
- **passlib** - Password hashing
- **psycopg2-binary** - PostgreSQL driver

## 🚀 Deployment

### Render (Recommended)

1. Create new Web Service
2. Connect GitHub repo
3. Set root directory: `backend`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables

### Railway

1. New project from GitHub
2. Set root directory: `backend`
3. Add environment variables
4. Deploy

### Heroku

```bash
cd backend
heroku create i-intern-backend
heroku config:set SECRET_KEY="..."
heroku config:set DATABASE_URL="..."
git subtree push --prefix backend heroku main
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 📝 Notes

- API docs disabled in production for security
- Uploads stored in local filesystem (consider S3 for production)
- Database creates all tables on startup
- CORS configured for specific origins only
- JWT tokens expire after 30 days (configurable in security.py)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## 📞 Support

For deployment issues, see [DEPLOYMENT.md](../DEPLOYMENT.md)
For setup issues, see [SETUP.md](../SETUP.md)

---

Built with ❤️ using FastAPI
