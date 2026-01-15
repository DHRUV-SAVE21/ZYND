# 📋 Database Setup - Correct Order

## ⚠️ IMPORTANT: Run SQL Files in This Exact Order

### Step 1: Create Tables & Schema
**File**: `supabase_schema.sql`  
**What it does**: 
- Creates all tables (incidents, flood_predictions, public_alerts, resources)
- Sets up PostGIS extension for geospatial queries
- Adds triggers for auto-updating locations
- Creates indexes for performance
- Configures Row Level Security (RLS) policies
- ~~Does NOT insert any data anymore~~ (sample data commented out)

**Run in Supabase SQL Editor:**
```sql
-- Copy and paste entire supabase_schema.sql
-- Click RUN
```

---

### Step 2: Add User Profiles (OPTIONAL)
**File**: `add_profiles_table.sql`  
**What it does**:
- Creates `profiles` table linked to Supabase Auth
- Sets up automatic profile creation on user signup
- Adds RLS policies for profile access
- Required only if you want user authentication

**Run in Supabase SQL Editor:**
```sql
-- Copy and paste entire add_profiles_table.sql
-- Click RUN
```

**Skip this if**: You don't need user login/authentication features

---

### Step 3: Load Realistic Mock Data
**File**: `realistic_mock_data.sql`  
**What it does**:
- Safely removes any old sample data
- Inserts 10 realistic flood incidents
- Inserts 7 AI-generated predictions
- Inserts 6 public alerts with evacuation routes
- Inserts 25 emergency resource units
- All based on real Indian geography

**Run in Supabase SQL Editor:**
```sql
-- Copy and paste entire realistic_mock_data.sql
-- Click RUN
```

---

## 📊 Verification After Setup

Run this query to check everything loaded:

```sql
-- Verify data counts
SELECT 
    'incidents' as table_name, 
    COUNT(*) as total_rows,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical,
    COUNT(*) FILTER (WHERE severity = 'high') as high,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium,
    COUNT(*) FILTER (WHERE severity = 'low') as low
FROM incidents
UNION ALL
SELECT 
    'flood_predictions',
    COUNT(*),
    COUNT(*) FILTER (WHERE risk_level = 'critical'),
    COUNT(*) FILTER (WHERE risk_level = 'high'),
    COUNT(*) FILTER (WHERE risk_level = 'medium'),
    COUNT(*) FILTER (WHERE risk_level = 'low')
FROM flood_predictions
UNION ALL
SELECT 
    'public_alerts',
    COUNT(*),
    COUNT(*) FILTER (WHERE severity = 'critical'),
    COUNT(*) FILTER (WHERE severity = 'warning'),
    COUNT(*) FILTER (WHERE severity = 'safe'),
    NULL
FROM public_alerts
UNION ALL
SELECT
    'resources',
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'deployed'),
    COUNT(*) FILTER (WHERE status = 'available'),
    COUNT(*) FILTER (WHERE status = 'maintenance'),
    NULL
FROM resources;
```

**Expected Output:**
```
incidents          | 10 | 3 | 3 | 2 | 2
flood_predictions  | 7  | 2 | 2 | 2 | 1
public_alerts      | 6  | 2 | 2 | 2 | -
resources          | 25 | 11| 14| 0 | -
```

---

## 🔄 If You Need to Reset/Reload Data

### Option 1: Reload Just the Mock Data
```sql
-- Run realistic_mock_data.sql again
-- It will delete old data and insert fresh data
```

### Option 2: Complete Reset (Nuclear Option)
```sql
-- Drop all tables
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS public_alerts CASCADE;
DROP TABLE IF EXISTS flood_predictions CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then re-run all 3 files in order:
-- 1. supabase_schema.sql
-- 2. add_profiles_table.sql (if needed)
-- 3. realistic_mock_data.sql
```

### Option 3: Keep Schema, Clear Data Only
```sql
-- Clear all data but keep table structure
DELETE FROM resources;
DELETE FROM public_alerts;
DELETE FROM flood_predictions;
DELETE FROM incidents;
-- Do NOT delete from profiles (will break auth)

-- Then run realistic_mock_data.sql
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This:
```sql
-- Running realistic_mock_data.sql BEFORE supabase_schema.sql
-- Tables don't exist yet! Will get errors.
```

### ❌ Don't Do This:
```sql
-- Running supabase_schema.sql twice in a row
-- Will get "already exists" errors
```

### ❌ Don't Do This:
```sql
-- Trying to insert mock data without PostGIS extension
-- Geography columns need PostGIS!
```

### ✅ Do This Instead:
1. Run schema once
2. Run profiles once (optional)
3. Run mock data (can run multiple times)

---

## 📁 File Compatibility Matrix

| File | Depends On | Can Run Multiple Times? | Safe to Skip? |
|------|-----------|------------------------|---------------|
| `supabase_schema.sql` | Nothing | ❌ No (use IF NOT EXISTS) | ❌ Required |
| `add_profiles_table.sql` | supabase_schema.sql | ❌ No (use IF NOT EXISTS) | ✅ Yes (if no auth) |
| `realistic_mock_data.sql` | supabase_schema.sql | ✅ Yes (uses DELETE) | ⚠️ Not recommended |

---

## 🎯 Quick Setup Script

**Copy-paste this entire block into Supabase SQL Editor:**

```sql
-- COMPLETE SETUP (all 3 files at once)
-- Only use this if you want everything in one go

-- Step 1: Schema (paste supabase_schema.sql contents here)

-- Step 2: Profiles (paste add_profiles_table.sql contents here)

-- Step 3: Mock Data (paste realistic_mock_data.sql contents here)

-- Verify
SELECT 'Setup Complete!' as status;
SELECT COUNT(*) as incident_count FROM incidents;
SELECT COUNT(*) as prediction_count FROM flood_predictions;
SELECT COUNT(*) as alert_count FROM public_alerts;
SELECT COUNT(*) as resource_count FROM resources;
```

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
**Cause**: Trying to insert data before creating tables  
**Fix**: Run `supabase_schema.sql` first

### Error: "extension postgis does not exist"
**Cause**: PostGIS not enabled  
**Fix**: Run `CREATE EXTENSION IF NOT EXISTS postgis;` first (included in schema)

### Error: "duplicate key value violates unique constraint"
**Cause**: Running mock data twice without deleting old data  
**Fix**: Run DELETE queries first (included in mock data file now)

### Error: "function st_makepoint does not exist"
**Cause**: PostGIS not installed properly  
**Fix**: Check Supabase project settings, ensure PostGIS enabled

### No Data Showing in App
**Cause**: Mock data not loaded OR RLS policies blocking access  
**Fix**: 
1. Verify data with SELECT queries
2. Check if using service role key in backend
3. Check RLS policies allow public/anon access

---

## 📝 Summary

**Correct Order:**
1. ✅ `supabase_schema.sql` - Creates structure
2. ✅ `add_profiles_table.sql` - Adds user profiles (optional)
3. ✅ `realistic_mock_data.sql` - Loads test data

**Result:**
- 10 realistic flood incidents across India
- 7 AI predictions for next 48 hours
- 6 public alerts with routes
- 25 emergency response units

**Time to Complete:** ~5 minutes

---

Last Updated: January 15, 2026  
Version: 2.0 - Fixed Compatibility
