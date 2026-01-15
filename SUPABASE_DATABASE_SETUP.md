# 🗄️ SUPABASE DATABASE SETUP - FIX 500 ERROR

## The Problem
Railway backend is deployed with correct credentials, but returns **500 error** because the **database tables don't exist yet**.

---

## 🚀 QUICK FIX (3 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your project: **fkamjlnpqrcdhleijxwi**
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run SQL Scripts in Order

#### Script 1: Create Tables (REQUIRED)
1. Open file: `backend/supabase_schema.sql` in VS Code
2. **Copy ALL content** (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run** button
5. Wait for ✅ "Success. No rows returned"

#### Script 2: Add Profiles Table (REQUIRED)
1. Open file: `backend/add_profiles_table.sql`
2. Copy all content
3. Paste into new query in Supabase SQL Editor
4. Click **Run**
5. Wait for ✅ success

#### Script 3: Add Mock Data (OPTIONAL - for testing)
1. Open file: `backend/realistic_mock_data.sql`
2. Copy all content
3. Paste into new query in Supabase SQL Editor
4. Click **Run**
5. Wait for ✅ success

---

## ✅ Verify It Works

After running the SQL scripts, test the API:

### In Browser Console:
```javascript
fetch('https://sankatsaathi.up.railway.app/api/crisis/active')
  .then(r => r.json())
  .then(data => console.log('✅ SUCCESS:', data))
  .catch(err => console.error('❌ FAILED:', err));
```

### Expected Response:
```json
{
  "crises": [],
  "count": 0
}
```

Or if you ran mock data script:
```json
{
  "crises": [
    {
      "id": 1,
      "title": "Severe Flooding at Mithi River",
      "severity": "critical",
      ...
    }
  ],
  "count": 3
}
```

---

## 📋 What These Scripts Create

### supabase_schema.sql
- ✅ PostGIS extension (for maps)
- ✅ `incidents` table (crisis reports)
- ✅ `alerts` table (early warnings)
- ✅ `predictions` table (AI predictions)
- ✅ `evacuation_routes` table (safe routes)
- ✅ `resources` table (shelters, supplies)
- ✅ `relief_camps` table (emergency camps)
- ✅ Spatial indexes for fast geo queries

### add_profiles_table.sql
- ✅ `profiles` table (user info)
- ✅ Links to Supabase Auth

### realistic_mock_data.sql
- ✅ 3 sample flood incidents in Mumbai
- ✅ 2 active alerts
- ✅ 3 AI predictions
- ✅ 4 evacuation routes
- ✅ 5 relief camps

---

## 🎯 Summary

**Current State:**
- ✅ Railway backend deployed
- ✅ Environment variables set
- ❌ Database empty (no tables)

**After Running SQL Scripts:**
- ✅ All tables created
- ✅ API returns data
- ✅ Frontend loads successfully

**Time Required:** 3-5 minutes

---

## Checklist

```
□ Open Supabase Dashboard → SQL Editor
□ Run: backend/supabase_schema.sql
□ Run: backend/add_profiles_table.sql
□ Run: backend/realistic_mock_data.sql (optional)
□ Test API: https://sankatsaathi.up.railway.app/api/crisis/active
□ Refresh Vercel frontend
```

---

## After Database Setup

Your full stack will be live:
- ✅ **Frontend**: https://your-app.vercel.app
- ✅ **Backend**: https://sankatsaathi.up.railway.app
- ✅ **Database**: Supabase with all tables
- ✅ **AI**: Gemini API integrated

The 500 error will be gone! 🎉
