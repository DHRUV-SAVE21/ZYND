# 🎯 ZYND Quick Reference Card

**Print this page or keep it handy during deployment!**

---

## 🔑 Required API Keys

### Supabase (Free)
📍 **Get from:** https://supabase.com/dashboard → Your Project → Settings → API

```
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_KEY: eyJhbGc... (anon/public key)
SUPABASE_SERVICE_KEY: eyJhbGc... (service_role key)
```

### Google Gemini (Free)
📍 **Get from:** https://aistudio.google.com/app/apikey

```
GEMINI_API_KEY: AIza...
```

### Secure Keys (Generate)
📍 **Run:** `python generate_keys.py`

```
SECRET_KEY: (random string)
JWT_SECRET_KEY: (random string)
```

---

## 🚀 Railway (Backend) Quick Deploy

### Configuration
```yaml
Platform: Railway
Repository: your-github/ZYND
Root Directory: backend  ← IMPORTANT!
Start Command: Auto-detected from Procfile
```

### Essential Environment Variables
```env
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_KEY=
GEMINI_API_KEY=
SECRET_KEY=
JWT_SECRET_KEY=
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=production
```

### Commands
```bash
# Railway CLI (optional)
npm i -g @railway/cli
railway login
railway link
railway logs
```

---

## ⚡ Vercel (Frontend) Quick Deploy

### Configuration
```yaml
Platform: Vercel
Repository: your-github/ZYND
Root Directory: frontend  ← IMPORTANT!
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Essential Environment Variables
```env
VITE_API_URL=https://your-railway-app.up.railway.app
VITE_WS_URL=wss://your-railway-app.up.railway.app
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Commands
```bash
# Vercel CLI (optional)
npm i -g vercel
vercel login
vercel
vercel logs
```

---

## 📊 Supabase (Database) Quick Setup

### SQL Scripts (Run in order)
```sql
1. supabase_schema.sql       -- Creates tables
2. add_profiles_table.sql    -- Adds user profiles
3. realistic_mock_data.sql   -- Loads Mumbai data
```

### Connection String
```
postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

### Dashboard Access
```
🌐 Dashboard: https://supabase.com/dashboard
📊 Table Editor: View/edit data
🔍 SQL Editor: Run queries
📝 Logs: Monitor API calls
```

---

## ✅ Deployment Checklist

### Before Deploying
- [ ] Git repository initialized
- [ ] All changes committed
- [ ] Pushed to GitHub
- [ ] API keys ready
- [ ] Run `validate_deployment.ps1`

### Railway Deployment
- [ ] Create Railway account
- [ ] Deploy from GitHub
- [ ] Set root directory: `backend`
- [ ] Add environment variables
- [ ] Get Railway URL
- [ ] Test `/health` endpoint

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Import GitHub repo
- [ ] Set root directory: `frontend`
- [ ] Set framework: `Vite`
- [ ] Add environment variables (with Railway URL)
- [ ] Deploy
- [ ] Test frontend loads

### Configuration
- [ ] Update Railway `CORS_ORIGINS` with Vercel URL
- [ ] Wait for Railway redeploy
- [ ] Run Supabase SQL scripts
- [ ] Test end-to-end connection

---

## 🧪 Testing Commands

### Backend Health Check
```bash
# Should return: {"status":"healthy","version":"2.0.0"}
curl https://your-railway-app.up.railway.app/health
```

### API Endpoints
```bash
# Get predictions
curl https://your-railway-app.up.railway.app/api/predictions/

# Get incidents
curl https://your-railway-app.up.railway.app/api/crisis/active

# API documentation
Open: https://your-railway-app.up.railway.app/docs
```

### Frontend Tests
```
✅ Landing page loads
✅ 3D Earth renders
✅ Maps display
✅ Prediction zones show
✅ Alerts load
✅ Login works
✅ No console errors
```

---

## 🐛 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| CORS error | Update Railway `CORS_ORIGINS` with Vercel URL |
| Build fails (Railway) | Check `requirements.txt` |
| Build fails (Vercel) | Verify root directory is `frontend` |
| Env vars not working (Vercel) | Must start with `VITE_` |
| Database connection fails | Verify Supabase keys |
| Maps don't load | Check browser console for errors |

---

## 📱 URLs After Deployment

### Your Deployment
```
Frontend:  https://__________.vercel.app
Backend:   https://__________.up.railway.app
API Docs:  https://__________.up.railway.app/docs
Database:  https://__________.supabase.co
```

### Platform Dashboards
```
Railway:   https://railway.app/dashboard
Vercel:    https://vercel.com/dashboard
Supabase:  https://supabase.com/dashboard
GitHub:    https://github.com/your-username/ZYND
```

---

## 🔄 Update Workflow

```bash
# 1. Make changes locally
# 2. Test locally
npm run dev          # Frontend
uvicorn app.main:app --reload  # Backend

# 3. Commit and push
git add .
git commit -m "Update feature"
git push origin main

# 4. Auto-deploys! (2-3 minutes)
# - Railway rebuilds backend
# - Vercel rebuilds frontend
```

---

## 💰 Cost Estimate (Monthly)

### Free Tier (Sufficient for MVP)
```
Railway:  $5 credit + 500 hours = $0
Vercel:   100GB bandwidth = $0
Supabase: 500MB DB + 1GB storage = $0
TOTAL: $0/month
```

### Low Traffic (1K users/month)
```
Railway:  ~$5/month (if exceeding free)
Vercel:   $0 (within free tier)
Supabase: $0 (within free tier)
TOTAL: $0-5/month
```

---

## 🆘 Emergency Commands

### View Logs
```bash
# Railway (in dashboard)
Deployments → View Logs

# Vercel (in dashboard)
Deployments → Function Logs

# Or use CLI
railway logs
vercel logs
```

### Rollback Deployment
```bash
# Both platforms support instant rollback
Railway: Deployments → Previous → Redeploy
Vercel: Deployments → Previous → Redeploy
```

### Clear Cache
```bash
# Vercel
Settings → General → Clear Cache

# Railway
Redeploy triggers fresh build
```

---

## 📚 Documentation Links

| Resource | URL |
|----------|-----|
| Railway Docs | https://docs.railway.app |
| Vercel Docs | https://vercel.com/docs |
| Supabase Docs | https://supabase.com/docs |
| Vite Docs | https://vitejs.dev |
| FastAPI Docs | https://fastapi.tiangolo.com |

---

## 🎓 Learning Resources

### Deployment Tutorials
- Railway Getting Started: https://docs.railway.app/getting-started
- Vercel Deployment: https://vercel.com/docs/deployments/overview
- Supabase Quickstart: https://supabase.com/docs/guides/getting-started

### ZYND Documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - Quick 15-minute deploy
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [README.md](./README.md) - Project overview

---

<div align="center">

**💾 Save this page for quick reference! 💾**

**Need detailed help? See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)**

</div>
