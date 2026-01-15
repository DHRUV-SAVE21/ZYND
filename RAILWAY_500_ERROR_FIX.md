# 🚨 RAILWAY 500 ERROR - FIX GUIDE

## Current Status
- ✅ **Backend Deployed**: Railway is running at https://sankatsaathi.up.railway.app
- ✅ **Health Check**: `/health` returns 200 OK
- ❌ **API Error**: `/api/crisis/active` returns 500 Internal Server Error

## Root Cause
The backend code is trying to connect to Supabase, but **environment variables are not set in Railway**.

---

## 🔧 IMMEDIATE FIX (5 minutes)

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app/dashboard
2. Click on your **ZYND backend service**
3. Click on **"Variables"** tab

### Step 2: Add Required Environment Variables

Click **"New Variable"** and add these ONE BY ONE:

#### **SUPABASE_URL** (Required)
```
https://your-project-id.supabase.co
```
*Get from: Supabase Dashboard → Settings → API → Project URL*

#### **SUPABASE_KEY** (Required - Anon Key)
```
your_anon_public_key_here
```
*Get from: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`*

#### **SUPABASE_SERVICE_KEY** (Required - Service Role Key)
```
your_service_role_secret_key_here
```
*Get from: Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`*

#### **GEMINI_API_KEY** (Required)
```
your_gemini_api_key_here
```
*Get from: https://aistudio.google.com/app/apikey*

#### **SECRET_KEY** (Required)
```
generate_a_random_secret_key_here
```
*Generate with: Open PowerShell and run:*
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

#### **CORS_ORIGINS** (Required for Frontend)
```
https://your-vercel-app.vercel.app,http://localhost:5173
```
*Replace `your-vercel-app.vercel.app` with your actual Vercel domain*

#### **ENVIRONMENT** (Optional)
```
production
```

---

### Step 3: Redeploy
After adding all variables:
1. Railway will **automatically redeploy**
2. Wait 2-3 minutes for deployment
3. Check logs: Railway Dashboard → Deployments → Latest → View Logs

---

## ✅ Verify Fix

After redeployment, test in browser console:
```javascript
fetch('https://sankatsaathi.up.railway.app/api/crisis/active')
  .then(r => r.json())
  .then(data => console.log('✅ SUCCESS:', data))
  .catch(err => console.error('❌ FAILED:', err));
```

Expected response:
```json
{
  "crises": [],
  "count": 0
}
```

---

## 📋 Next Step After This: Database Setup

Once Railway environment variables are set, you need to:

1. **Create Database Tables** in Supabase:
   - Go to Supabase SQL Editor
   - Run: `backend/supabase_schema.sql`
   - Run: `backend/add_profiles_table.sql`
   - Run: `backend/realistic_mock_data.sql`

2. **Update Vercel Environment Variable**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://sankatsaathi.up.railway.app`
   - Redeploy Vercel frontend

---

## 🎯 Summary

**What's Happening:**
- Railway backend is running but has no database credentials
- Code tries to connect to Supabase → crashes → 500 error

**The Fix:**
1. Add Supabase + Gemini credentials to Railway variables
2. Railway auto-redeploys
3. API will work ✅

**Time Required:** 5 minutes to add variables + 2 minutes Railway redeploy

---

## Quick Checklist

```
Railway Variables to Add:
□ SUPABASE_URL
□ SUPABASE_KEY  
□ SUPABASE_SERVICE_KEY
□ GEMINI_API_KEY
□ SECRET_KEY
□ CORS_ORIGINS
□ ENVIRONMENT (optional)

Then:
□ Wait for Railway auto-redeploy (2-3 min)
□ Test API endpoint
□ Setup database tables in Supabase
□ Update Vercel VITE_API_URL
```
