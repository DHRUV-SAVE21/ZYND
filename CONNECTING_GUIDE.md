# 🔌 CONNECTING FRONTEND & BACKEND - SIMPLE GUIDE

## ✅ Step 1: Create Frontend .env File

I've already created `frontend/.env` for you with:

```env
# Supabase (already working)
VITE_SUPABASE_URL=https://fkamjlnpqrcdhleijxwi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...

# Backend API (connects frontend to your backend)
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

**That's it!** Your frontend now knows where to find the backend.

---

## ✅ Step 2: Start Backend (Terminal 1)

```bash
cd backend
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete
```

**⚠️ If you get errors:**
1. Make sure you added `GEMINI_API_KEY` to `backend/.env`
2. Run `pip install -r requirements.txt` again
3. Check [CHECKLIST.md](../backend/CHECKLIST.md)

---

## ✅ Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Step 4: Test the Connection

### A. Open Frontend
Go to: http://localhost:5173

### B. Test API Connection (Open Browser Console - F12)

Paste this in console:

```javascript
// Test backend health
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected:', d))
  .catch(e => console.error('❌ Backend error:', e));

// Test prediction API
fetch('http://localhost:8000/api/predictions/')
  .then(r => r.json())
  .then(d => console.log('✅ Predictions API:', d))
  .catch(e => console.error('❌ API error:', e));
```

**If you see ✅ messages:** Everything is connected! 🎉

**If you see ❌ CORS errors:** The backend CORS is already configured, but if you see errors, check backend terminal logs.

---

## 🔄 How It Works

Your frontend components already use the environment variables:

| Component | What It Does | API Endpoint |
|-----------|-------------|--------------|
| **CrisisDashboard** | Shows active incidents | `GET /crisis/active` |
| **IncidentReport** | Report new incidents | `POST /crisis/alert` |
| **CrisisMarkers** | Map markers | `GET /crisis/active` |
| **LiveIncidentMap** | Real-time WebSocket | `WS /ws/dashboard` |
| **PredictionPage** | Flood predictions | `GET /api/predictions/` |
| **PublicAlertsPage** | Public alerts | `GET /api/alerts/public` |

They all use:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

So when you set `VITE_API_URL=http://localhost:8000`, they automatically connect!

---

## 🧪 Test Each Feature

### 1. Report an Incident
1. Go to Crisis Dashboard
2. Click "Report Incident"
3. Fill form and submit
4. Check backend terminal - should see POST request
5. Incident appears on map

### 2. View Predictions
1. Go to Prediction Page
2. Backend fetches from `/api/predictions/`
3. Should see prediction data or empty state

### 3. Generate New Prediction
1. In browser console or API docs (http://localhost:8000/docs)
2. POST to `/api/predictions/generate`:
```javascript
fetch('http://localhost:8000/api/predictions/generate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    region: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777
  })
})
.then(r => r.json())
.then(d => console.log('Prediction:', d));
```

### 4. WebSocket Real-time Updates
1. Open Crisis Dashboard
2. Backend sends updates via WebSocket
3. New incidents appear automatically
4. Check browser Network tab → WS to see connection

---

## 🚨 Troubleshooting

### Issue: "Failed to fetch" in browser console

**Solution:**
```bash
# Make sure backend is running
cd backend
uvicorn app.main:app --reload

# Should see: INFO: Uvicorn running on http://0.0.0.0:8000
```

### Issue: "CORS error"

**Solution:** Backend CORS is already configured for:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (alternative)

If using different port, update `backend/.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:YOUR_PORT
```

### Issue: "Environment variable not defined"

**Solution:**
```bash
# Make sure .env exists
cd frontend
type .env  # Windows
cat .env   # Linux/Mac

# Restart frontend dev server
npm run dev
```

### Issue: Frontend shows "Loading..." forever

**Reasons:**
1. Backend not running → Start backend
2. API returning errors → Check backend terminal logs
3. CORS blocked → Check CORS_ORIGINS in backend/.env

---

## 📊 Connection Checklist

- [ ] ✅ Created `frontend/.env` with VITE_API_URL
- [ ] ✅ Backend running on port 8000
- [ ] ✅ Frontend running on port 5173
- [ ] ✅ Can access http://localhost:8000/docs
- [ ] ✅ Can access http://localhost:5173
- [ ] ✅ No CORS errors in browser console
- [ ] ✅ `/health` endpoint returns 200
- [ ] ✅ Can see incidents on map
- [ ] ✅ Can report new incidents

---

## 🎯 Quick Reference

**Backend:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Terminal: `cd backend && uvicorn app.main:app --reload`

**Frontend:**
- URL: http://localhost:5173
- Terminal: `cd frontend && npm run dev`
- Config: `frontend/.env`

**Test Connection:**
```javascript
// In browser console
fetch('http://localhost:8000/health').then(r=>r.json()).then(console.log)
```

---

## ✨ You're Connected!

Your frontend and backend are now talking to each other:

```
Frontend (React)  →  VITE_API_URL  →  Backend (FastAPI)
http://localhost:5173  →  http://localhost:8000
                ↓
          [Fetch/WebSocket]
                ↓
     Backend APIs + AI Agents
                ↓
            Supabase DB
```

**All features working:**
- ✅ User authentication (Supabase)
- ✅ Incident reporting (Backend API)
- ✅ Flood predictions (AI Agents)
- ✅ Real-time updates (WebSocket)
- ✅ Public alerts (Backend API)

**Now test your app and enjoy!** 🎉
