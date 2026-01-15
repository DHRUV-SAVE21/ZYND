# 🚀 Quick Deployment Instructions

## BOTH PLATFORMS - SAME REPO ✅

Your ZYND repository contains both frontend and backend. Here's how to deploy:

---

## 📦 STEP 1: RAILWAY (Backend) - 5 minutes

### Go to Railway
👉 https://railway.app/new

### Setup
1. Click **"Deploy from GitHub repo"**
2. Select your **ZYND** repository
3. **IMPORTANT:** In Settings → Set **Root Directory** to `backend`
4. Go to **Variables** tab

### Copy These Variables
Open `backend/.env.railway.template` and copy all variables to Railway.

**Update these values:**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
GEMINI_API_KEY=your_gemini_key
```

### Deploy & Get URL
- Railway auto-deploys
- Copy your URL: `https://your-app.up.railway.app`
- Test: Open `https://your-app.up.railway.app/health`

---

## 🎨 STEP 2: VERCEL (Frontend) - 5 minutes

### Go to Vercel
👉 https://vercel.com/new

### Setup
1. Click **"Import Git Repository"**
2. Select your **ZYND** repository
3. **IMPORTANT:** Set **Root Directory** to `frontend`
4. Framework Preset: **Vite**

### Add Environment Variables
```env
VITE_API_URL=https://sankatsaathi.up.railway.app/health
VITE_WS_URL=wss://sankatsaathi.up.railway.app/health
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Replace `your-railway-app.up.railway.app` with your actual Railway URL!**

### Deploy
- Click **Deploy**
- Wait 2 minutes
- Copy your URL: `https://your-app.vercel.app`

---

## 🔧 STEP 3: CONNECT THEM - 2 minutes

### Update Railway CORS
1. Go back to **Railway** → Variables
2. Find `CORS_ORIGINS`
3. Update with your Vercel URL:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
4. Save (auto-redeploys)

---

## ✅ STEP 4: TEST - 1 minute

### Backend Test
```bash
curl https://your-railway-app.up.railway.app/health
# Should return: {"status":"healthy"}
```

### Frontend Test
1. Open your Vercel URL
2. Press F12 (DevTools)
3. Go to Console
4. Should see no CORS errors
5. Try the Prediction page

---

## 🎉 DONE!

**Your URLs:**
- 🎨 Frontend: `https://your-app.vercel.app`
- 📦 Backend: `https://your-app.up.railway.app`
- 📚 API Docs: `https://your-app.up.railway.app/docs`

---

## 🆘 PROBLEMS?

### CORS Error?
Update Railway `CORS_ORIGINS` with exact Vercel URL (no trailing slash)

### Frontend not connecting?
Check `VITE_API_URL` in Vercel matches Railway URL

### Build fails?
- **Railway:** Check `requirements.txt` has all dependencies
- **Vercel:** Ensure Root Directory is `frontend`

---

## 📚 Full Guides

- Detailed: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**Need API keys?**
- Supabase: https://supabase.com/dashboard → Settings → API
- Gemini: https://aistudio.google.com/app/apikey (FREE)
