# 🚀 ZYND Deployment Guide

## Project Structure
```
ZYND/
├── frontend/     → Deploy to Vercel
└── backend/      → Deploy to Railway
```

---

## 📦 BACKEND DEPLOYMENT (Railway)

### Step 1: Prepare Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Install Railway CLI (optional):
   ```bash
   npm i -g @railway/cli
   ```

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your ZYND repository
4. Railway will auto-detect the backend

### Step 3: Configure Root Directory
**IMPORTANT:** Railway needs to know backend is in a subfolder
1. In Railway dashboard → **Settings**
2. Find **"Root Directory"** setting
3. Set to: `backend`
4. Click **Save**

### Step 4: Set Environment Variables
Go to **Variables** tab and add:

```env
# REQUIRED - Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_db_url

# REQUIRED - AI (Get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key

# Optional - ZYND AI Agent (if using)
ZYND_AI_SEED=your_secret_seed
ZYND_REGISTRY_URL=https://registry.p3ai.network
ZYND_MQTT_BROKER=mqtt://broker.p3ai.network:1883

# App Configuration
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://your-vercel-app.vercel.app

# Auth (generate secure random strings)
SECRET_KEY=generate_a_secure_random_string_here
JWT_SECRET_KEY=generate_another_secure_random_string
```

### Step 5: Deploy
1. Railway will **automatically deploy** on every push
2. Your backend URL will be: `https://your-app.up.railway.app`
3. Test endpoint: `https://your-app.up.railway.app/health`

### Step 6: Database Setup
After first deployment, run your SQL scripts:
1. Open Supabase SQL Editor
2. Run in order:
   - `supabase_schema.sql`
   - `add_profiles_table.sql`
   - `realistic_mock_data.sql`

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account

### Step 2: Import Project
1. Click **"New Project"**
2. Select your ZYND GitHub repository
3. Vercel will detect Vite automatically

### Step 3: Configure Build Settings
**IMPORTANT:** Frontend is in subfolder

#### Framework Preset: `Vite`

#### Root Directory: `frontend`

#### Build Command: `npm run build`

#### Output Directory: `dist`

#### Install Command: `npm install`

### Step 4: Set Environment Variables
In Vercel dashboard → **Settings** → **Environment Variables**:

```env
# Backend API (use your Railway URL)
VITE_API_URL=https://your-railway-app.up.railway.app
VITE_WS_URL=wss://your-railway-app.up.railway.app

# Supabase (for frontend auth)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Vercel builds and deploys automatically
3. Your URL: `https://your-app.vercel.app`

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### 1. Update Backend CORS
In Railway environment variables, update:
```env
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

### 2. Update Frontend API URL
If Railway URL changes, update Vercel env:
```env
VITE_API_URL=https://new-railway-url.up.railway.app
```

### 3. Custom Domains (Optional)

#### Vercel:
1. Go to **Settings** → **Domains**
2. Add custom domain: `zynd.yourdomain.com`
3. Follow DNS instructions

#### Railway:
1. Go to **Settings** → **Domains**
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record to DNS

---

## ✅ VERIFICATION CHECKLIST

### Backend Health Check
```bash
curl https://your-railway-app.up.railway.app/health
# Should return: {"status": "healthy", "version": "2.0.0"}
```

### Frontend Check
1. Open: `https://your-vercel-app.vercel.app`
2. Check browser console for errors
3. Test login/signup
4. Test incident reporting

### API Connection Test
1. Open frontend
2. Go to Prediction page
3. Should load flood zones (means API connected)

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Error: Module not found**
- Check `requirements.txt` includes all dependencies
- Railway logs: View in **Deployments** → **View Logs**

**Error: Port binding**
- Ensure start command uses `--port $PORT`
- Railway automatically assigns port

**Database connection fails**
- Verify Supabase credentials in Railway variables
- Check Supabase is not paused (free tier)

### Frontend Issues

**API calls fail (CORS error)**
- Update Railway CORS_ORIGINS with Vercel URL
- Ensure URL doesn't have trailing slash

**Build fails**
- Check Node version compatibility
- Clear cache: Vercel → **Settings** → **General** → **Clear Cache**

**Environment variables not working**
- Must start with `VITE_` prefix
- Redeploy after adding variables

---

## 📊 MONITORING

### Railway
- View logs: **Deployments** → **View Logs**
- Monitor usage: **Metrics** tab
- Free tier: 500 hours/month, $5 credit

### Vercel
- View analytics: **Analytics** tab
- Monitor performance: **Speed Insights**
- Free tier: 100 GB bandwidth/month

---

## 🔄 CONTINUOUS DEPLOYMENT

Both platforms auto-deploy on git push:

1. **Make changes** locally
2. **Commit** to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **Auto-deploy:**
   - Railway: Rebuilds backend
   - Vercel: Rebuilds frontend

### Branch Previews
- Vercel creates preview for every PR
- Railway can be configured for staging branches

---

## 💰 COST BREAKDOWN

### Free Tier Limits
| Platform | Bandwidth | Compute | Cost |
|----------|-----------|---------|------|
| **Railway** | Unlimited | 500 hrs/month + $5 credit | Free, then $0.000231/GB-s |
| **Vercel** | 100 GB/month | Unlimited builds | Free, then $20/month Pro |
| **Supabase** | 500 MB DB, 1 GB storage | Pauses after 7 days inactivity | Free, then $25/month Pro |

**Expected Cost for Low-Medium Traffic:** $0-10/month

---

## 🔒 SECURITY CHECKLIST

- [ ] All API keys in environment variables (never in code)
- [ ] CORS restricted to your frontend domain only
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] Railway/Vercel secrets encrypted
- [ ] Database backups enabled in Supabase
- [ ] Rate limiting configured (if high traffic)

---

## 📚 USEFUL COMMANDS

### Railway CLI
```bash
# Login
railway login

# Link project
railway link

# View logs
railway logs

# Set environment variable
railway variables set KEY=value
```

### Vercel CLI
```bash
# Login
vercel login

# Deploy
vercel

# View logs
vercel logs
```

---

## 🆘 SUPPORT RESOURCES

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

---

## 🎉 SUCCESS CRITERIA

Your deployment is complete when:
- ✅ Backend health endpoint responds
- ✅ Frontend loads without console errors
- ✅ Login/signup works (Supabase auth)
- ✅ Incident reporting creates database entries
- ✅ Prediction page shows flood zones
- ✅ No CORS errors in browser console
- ✅ WebSocket connections established (optional)

---

**Need help?** Check logs in Railway/Vercel dashboards first!
