# ZYND - Deployment Checklist

## 🚀 Quick Start Deployment

### Phase 1: Backend (Railway) - 15 minutes
- [ ] Create Railway account at railway.app
- [ ] Create new project from GitHub
- [ ] Set root directory to `backend`
- [ ] Copy variables from `.env.railway.template`
- [ ] Deploy and get Railway URL
- [ ] Test: `https://your-app.up.railway.app/health`

### Phase 2: Frontend (Vercel) - 10 minutes
- [ ] Create Vercel account at vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set framework preset to `Vite`
- [ ] Copy variables from `.env.vercel.template`
- [ ] Update `VITE_API_URL` with Railway URL
- [ ] Deploy and get Vercel URL

### Phase 3: Configuration - 5 minutes
- [ ] Update Railway `CORS_ORIGINS` with Vercel URL
- [ ] Redeploy Railway (triggers automatically)
- [ ] Test frontend: Should connect to backend

### Phase 4: Database Setup - 5 minutes
- [ ] Open Supabase SQL Editor
- [ ] Run `supabase_schema.sql`
- [ ] Run `add_profiles_table.sql`
- [ ] Run `realistic_mock_data.sql`
- [ ] Verify data in Supabase Table Editor

---

## 📋 Pre-Deployment Requirements

### Required Services
- [ ] GitHub account with ZYND repository
- [ ] Supabase account with project created
- [ ] Google AI Studio account (for Gemini API)
- [ ] Railway account
- [ ] Vercel account

### Required API Keys
- [ ] Supabase URL
- [ ] Supabase Anon Key
- [ ] Supabase Service Role Key
- [ ] Gemini API Key (free from Google AI Studio)

---

## 🔑 How to Get API Keys

### Supabase Keys
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

### Gemini API Key (FREE)
1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key (starts with `AIza...`)

### Generate Secret Keys
```bash
# Run this in terminal to generate secure random keys
python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32))"
python -c "import secrets; print('JWT_SECRET_KEY:', secrets.token_urlsafe(32))"
```

---

## 🌐 Railway Deployment Steps

### 1. Create Project
1. Go to https://railway.app/new
2. Click **Deploy from GitHub repo**
3. Authorize Railway to access your GitHub
4. Select **ZYND** repository

### 2. Configure Settings
**Important:** Set root directory!
1. Click **Settings** (gear icon)
2. Find **Root Directory**
3. Enter: `backend`
4. Scroll down and click **Save Changes**

### 3. Add Environment Variables
1. Click **Variables** tab
2. Click **New Variable**
3. Add each variable from `.env.railway.template`
4. Click **Add** for each

**Quick method:**
- Click **Raw Editor**
- Paste entire `.env.railway.template` contents
- Update placeholder values
- Click **Save**

### 4. Deploy
- Railway auto-deploys on save
- Wait 2-3 minutes for build
- Check **Deployments** tab for status

### 5. Get Your URL
- In **Settings** → **Domains**
- Copy the Railway domain (e.g., `zynd-production.up.railway.app`)
- Test it: `https://your-domain.up.railway.app/health`

---

## 🎨 Vercel Deployment Steps

### 1. Import Project
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select **ZYND** repository
4. Click **Import**

### 2. Configure Project
**Root Directory:** `frontend` ⚠️ IMPORTANT!

**Build Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Add Environment Variables
1. Scroll to **Environment Variables**
2. Add each variable from `.env.vercel.template`
3. Update `VITE_API_URL` with your Railway URL

**Example:**
```
VITE_API_URL = https://zynd-production.up.railway.app
VITE_WS_URL = wss://zynd-production.up.railway.app
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

### 4. Deploy
- Click **Deploy**
- Wait 1-2 minutes for build
- You'll get a URL like: `https://zynd.vercel.app`

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
1. Go back to Railway
2. Click **Variables**
3. Find `CORS_ORIGINS`
4. Update with your Vercel URL:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
5. Save (triggers auto-redeploy)

### Verify Connection
1. Open your Vercel URL
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Should see no CORS errors
5. Try logging in or viewing predictions

---

## ✅ Testing Your Deployment

### Backend Health Check
```bash
curl https://your-railway-app.up.railway.app/health

# Should return:
# {"status": "healthy", "version": "2.0.0", "environment": "production"}
```

### API Endpoints Test
```bash
# Get predictions
curl https://your-railway-app.up.railway.app/api/predictions/

# Get incidents
curl https://your-railway-app.up.railway.app/api/crisis/active

# Should return JSON data
```

### Frontend Test
1. Open: `https://your-vercel-app.vercel.app`
2. Check pages:
   - Landing page loads ✓
   - Prediction page shows map ✓
   - Public alerts load ✓
   - Login/signup works ✓
3. Browser console has no errors ✓

---

## 🐛 Common Issues & Fixes

### ❌ "Module not found" (Railway)
**Fix:** Ensure `requirements.txt` has all dependencies
```bash
# In backend folder locally:
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

### ❌ CORS Error (Frontend can't reach backend)
**Fix:** Update Railway CORS_ORIGINS
1. Railway → Variables
2. Update `CORS_ORIGINS` with exact Vercel URL
3. No trailing slash: `https://app.vercel.app` ✓
4. Wait 1 minute for redeploy

### ❌ "Vite environment variables not working"
**Fix:** Must have `VITE_` prefix
- ✓ Correct: `VITE_API_URL`
- ✗ Wrong: `API_URL`

Redeploy after fixing:
- Vercel → Deployments → ⋯ menu → Redeploy

### ❌ Database connection fails
**Fix:** Check Supabase credentials
1. Verify keys are correct in Railway
2. Check Supabase project isn't paused
3. Whitelist Railway IP (usually not needed)

### ❌ Build fails on Vercel
**Fix:** Clear cache and rebuild
1. Vercel → Settings → General
2. Click **Clear Cache**
3. Go to Deployments
4. Click ⋯ → Redeploy

---

## 📊 Monitor Your Deployment

### Railway Logs
```
Railway Dashboard → Deployments → Latest → View Logs
```
Watch for errors in real-time

### Vercel Logs
```
Vercel Dashboard → Deployments → Latest → View Function Logs
```

### Supabase Logs
```
Supabase Dashboard → Logs → API Logs
```
See database queries

---

## 💡 Pro Tips

### Automatic Deployments
- Every `git push` to `main` branch auto-deploys both
- Create `staging` branch for testing
- Vercel creates preview URLs for PRs

### Custom Domains
**Vercel (frontend):**
- Settings → Domains → Add Domain
- Point DNS CNAME to `cname.vercel-dns.com`

**Railway (backend):**
- Settings → Domains → Custom Domain
- Add CNAME record to your DNS

### Environment Secrets
- Never commit `.env` files to git
- Use `.env.example` with dummy values
- Store secrets in Railway/Vercel only

### Performance Optimization
**Frontend:**
- Vercel automatically optimizes images
- Enable Edge Network for faster loading

**Backend:**
- Railway scales automatically
- Monitor usage in Metrics tab

---

## 🎉 Success! What's Next?

- [ ] Share your URLs with team
- [ ] Set up custom domain (optional)
- [ ] Configure email notifications
- [ ] Add SMS alerts (Twilio)
- [ ] Enable monitoring (Sentry)
- [ ] Set up backups (Supabase)

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app`
- Docs: `https://your-app.up.railway.app/docs`

---

Need help? Check the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
