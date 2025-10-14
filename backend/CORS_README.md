This document explains how CORS is configured for the i-intern backend and what environment variables to set when deploying.

Overview
- The FastAPI app configures CORS in `app/main.py` using origins collected from environment variables or the Pydantic `settings` object (`app.core.config.settings`).

Environment variables
- ENVIRONMENT: `development` or `production`. When `production`, the app starts with a safe set of production origins.
- ALLOWED_ORIGINS: comma-separated list of allowed origins (e.g. `https://i-intern-2.onrender.com,https://i-intern.com`). When present it is appended to the defaults.
- FRONTEND_URL: used by email templates and some redirects; not used directly by the CORS middleware but should be set so links in emails point to the correct frontend.

Deployment notes
- Render: in `render.yaml` `ALLOWED_ORIGINS` and `FRONTEND_URL` are already present in the example. This project is configured to use Render-hosted subdomains in production by default. `COOKIE_DOMAIN` is set to `.onrender.com` so cookies will be available across Render subdomains (e.g. `i-intern-2.onrender.com` and `i-intern.onrender.com`). Ensure `ENVIRONMENT` is set to `production` on the Render dashboard, and set `COOKIE_SECURE` to `true`.
- Vercel: in `vercel.json` set `ALLOWED_ORIGINS` to your frontend origin(s) and configure environment variables in the Vercel dashboard.

Testing CORS locally
1. Start the backend (uvicorn app.main:app --reload --port 8000)
2. Start the frontend (Vite/React) on its dev port (e.g., 5173).
3. In the browser open the frontend and try API requests that use credentials (cookies). If CORS blocks the request, check the backend logs — the allowed origins printed at startup.

Troubleshooting
- If you're using credentials (cookies), you MUST explicitly list allowed origins. `allow_origins=["*"]` will not work with `allow_credentials=True`.
- For cookie-based auth across subdomains, set `COOKIE_DOMAIN` to `.yourdomain.com` and ensure `COOKIE_SECURE=true` in production.

Summary
- The app already has robust CORS handling in `app/main.py`. For deployment, set `ENVIRONMENT=production` and configure `ALLOWED_ORIGINS` or `FRONTEND_URL` appropriately in your host's environment variables.