# 🎯 ZYND Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ZYND PROJECT                            │
│                  (Single GitHub Repository)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐   ┌───────────────────┐
        │   FRONTEND/       │   │   BACKEND/        │
        │                   │   │                   │
        │  React + Vite     │   │  FastAPI + Python │
        │  Three.js         │   │  AI Agents        │
        │  Leaflet Maps     │   │  PostGIS          │
        └───────────────────┘   └───────────────────┘
                │                       │
                │                       │
                ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │     VERCEL        │   │     RAILWAY       │
        │                   │   │                   │
        │  🌐 Frontend Host │   │  🚀 Backend Host  │
        │  Auto-deploy      │   │  Auto-deploy      │
        │  Edge Network     │   │  Managed Infra    │
        └───────────────────┘   └───────────────────┘
                │                       │
                │                       │
                │         ┌─────────────┘
                │         │
                ▼         ▼
        ┌──────────────────────────┐
        │      SUPABASE            │
        │                          │
        │  📊 PostgreSQL + PostGIS │
        │  🔐 Authentication       │
        │  📁 File Storage         │
        │  ⚡ Real-time Updates    │
        └──────────────────────────┘
                │
                ▼
        ┌──────────────────────────┐
        │   EXTERNAL SERVICES      │
        │                          │
        │  🤖 Google Gemini API    │
        │  🗺️  OSRM Routing        │
        │  📡 P3AI Network (opt)   │
        └──────────────────────────┘
```

---

## 🔄 Data Flow

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     │ 1. Opens browser
     │
     ▼
┌──────────────────┐
│  VERCEL          │  Frontend (React)
│  your-app        │  - 3D Earth visualization
│  .vercel.app     │  - Interactive maps
└────┬─────────────┘  - Real-time updates
     │
     │ 2. Makes API calls
     │
     ▼
┌──────────────────┐
│  RAILWAY         │  Backend (FastAPI)
│  your-app        │  - AI prediction agents
│  .up.railway.app │  - Incident coordination
└────┬─────────────┘  - WebSocket connections
     │
     │ 3. Queries database
     │
     ▼
┌──────────────────┐
│  SUPABASE        │  Database
│  PostgreSQL      │  - Incidents table
│  + PostGIS       │  - Predictions table
└────┬─────────────┘  - Spatial queries
     │
     │ 4. Calls AI services
     │
     ▼
┌──────────────────┐
│  GEMINI API      │  AI Processing
│  Google AI       │  - Flood analysis
│  Studio          │  - Risk assessment
└──────────────────┘  - Recommendations
```

---

## 📋 Configuration Overview

### 🎨 VERCEL (Frontend)
```yaml
Platform: Vercel
Repository: your-github/ZYND
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist

Environment Variables:
  - VITE_API_URL → Railway backend URL
  - VITE_WS_URL → Railway WebSocket URL
  - VITE_SUPABASE_URL → Supabase project URL
  - VITE_SUPABASE_ANON_KEY → Supabase public key
```

### 🚀 RAILWAY (Backend)
```yaml
Platform: Railway
Repository: your-github/ZYND
Root Directory: backend
Runtime: Python 3.11
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Environment Variables:
  - SUPABASE_URL → Database URL
  - SUPABASE_KEY → Database key
  - SUPABASE_SERVICE_KEY → Service role key
  - GEMINI_API_KEY → AI key
  - CORS_ORIGINS → Vercel URL
  - SECRET_KEY → Random string
  - JWT_SECRET_KEY → Random string
```

### 📊 SUPABASE (Database)
```yaml
Platform: Supabase
Type: PostgreSQL 15 + PostGIS
Location: Auto (closest region)

Tables:
  - incidents (flood reports)
  - flood_predictions (AI forecasts)
  - public_alerts (emergency notifications)
  - resources (rescue units)

Features:
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Spatial indexing (GIST)
  - Auto backups
```

---

## 🌐 URL Structure

### Development (Local)
```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
Database:  your-project.supabase.co
```

### Production (Deployed)
```
Frontend:  https://zynd.vercel.app
           https://zynd-your-username.vercel.app
           
Backend:   https://zynd-production.up.railway.app
           https://your-app-name.up.railway.app
           
API Docs:  https://your-backend-url.up.railway.app/docs
           
Database:  https://your-project.supabase.co
           postgresql://postgres:pass@db.your-project.supabase.co:5432/postgres
```

---

## 🔐 Security Configuration

### CORS Setup
```python
# Railway Backend (app/config.py)
CORS_ORIGINS = [
    "https://zynd.vercel.app",           # Production
    "https://zynd-preview.vercel.app",   # Preview deployments
    "http://localhost:5173"               # Local development
]
```

### Environment Variables Security
```
✅ DO:
- Store in Railway/Vercel dashboard
- Use .env for local development
- Add .env.example with dummy values
- Keep .env in .gitignore

❌ DON'T:
- Commit .env files to git
- Share API keys publicly
- Hardcode secrets in code
- Use same keys for dev/prod
```

---

## 📊 Monitoring Setup

### Railway (Backend)
```
Dashboard → Metrics
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

Dashboard → Logs
- Real-time application logs
- System logs
- Database queries
```

### Vercel (Frontend)
```
Dashboard → Analytics
- Page views
- Visitor count
- Geographic distribution

Dashboard → Speed Insights
- Core Web Vitals
- Load times
- Performance score
```

### Supabase (Database)
```
Dashboard → Logs
- API requests
- Database queries
- Errors

Dashboard → Database
- Table sizes
- Query performance
- Connections
```

---

## 🚀 Deployment Triggers

### Automatic Deployments
```
git push origin main
    │
    ├─→ Vercel: Rebuilds frontend (1-2 min)
    └─→ Railway: Rebuilds backend (2-3 min)

git push origin staging
    │
    ├─→ Vercel: Creates preview URL
    └─→ Railway: Optional staging environment
```

### Manual Deployments
```
Vercel:
  Dashboard → Deployments → ⋯ → Redeploy

Railway:
  Dashboard → Deployments → Deploy

Rollback:
  Both platforms allow instant rollback to previous deployment
```

---

## 💰 Cost Estimates

### Free Tier (Sufficient for MVP/Demo)
```
Railway:  $5 credit/month + 500 hours
Vercel:   100GB bandwidth + unlimited builds
Supabase: 500MB DB + 1GB storage + 2GB bandwidth

Total: $0/month (within free limits)
```

### Low Traffic (1000 users/month)
```
Railway:  ~$5/month (if exceeding free tier)
Vercel:   $0 (within free tier)
Supabase: $0 (within free tier)

Total: $0-5/month
```

### Medium Traffic (10,000 users/month)
```
Railway:  ~$15-20/month
Vercel:   $0 (or $20 for Pro features)
Supabase: $25/month Pro (for better performance)

Total: $40-65/month
```

---

## 🔄 CI/CD Pipeline

```
Developer
    │
    ├─ Write code locally
    ├─ Test locally (localhost)
    └─ Commit to GitHub
          │
          ▼
    GitHub Repository
          │
          ├─→ Vercel: Automatic build & deploy
          │   ├─ Pull latest code
          │   ├─ npm install
          │   ├─ npm run build
          │   └─ Deploy to edge network
          │
          └─→ Railway: Automatic build & deploy
              ├─ Pull latest code
              ├─ pip install -r requirements.txt
              ├─ Start uvicorn server
              └─ Deploy to cloud
```

---

## 🎯 Success Metrics

### Deployment Successful When:
```
✅ Backend Health Check
   GET https://your-backend.up.railway.app/health
   Returns: {"status": "healthy"}

✅ Frontend Loads
   https://your-frontend.vercel.app
   No console errors

✅ API Connection Works
   Frontend successfully fetches data from backend
   No CORS errors

✅ Database Accessible
   API can query Supabase
   Tables have data

✅ Real-time Updates
   WebSocket connections established
   Live data updates visible
```

---

This architecture ensures:
- 🚀 **Fast deployments** (both under 3 minutes)
- 💰 **Cost-effective** (free tier sufficient for demos)
- 🔒 **Secure** (environment variables, HTTPS, CORS)
- 📈 **Scalable** (both platforms auto-scale)
- 🔄 **Automated** (deploy on every git push)
