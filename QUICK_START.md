# 🚀 QUICK START - Load Mock Data

## Step-by-Step Guide

### 1. Setup Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Wait for project to be ready
3. Go to **SQL Editor** in left sidebar

### 2. Run Schema (First Time Only)

Click **New Query** and paste:
```sql
-- Copy entire contents of: backend/supabase_schema.sql
-- Click RUN (or Ctrl+Enter)
```

Wait for "Success!" message.

### 3. Load Mock Data

Click **New Query** and paste:
```sql
-- Copy entire contents of: backend/realistic_mock_data.sql
-- Click RUN (or Ctrl+Enter)
```

You should see:
```
✓ 10 rows inserted into incidents
✓ 7 rows inserted into flood_predictions  
✓ 6 rows inserted into public_alerts
✓ 25 rows inserted into resources
```

### 4. Verify Data Loaded

Run this verification query:
```sql
-- Check what was loaded
SELECT 
    'incidents' as table_name, COUNT(*) as rows FROM incidents
UNION ALL
SELECT 'predictions', COUNT(*) FROM flood_predictions
UNION ALL
SELECT 'alerts', COUNT(*) FROM public_alerts
UNION ALL
SELECT 'resources', COUNT(*) FROM resources;
```

Expected output:
```
incidents    | 10
predictions  | 7
alerts       | 6
resources    | 25
```

### 5. Configure Environment

**Frontend** - Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
```

**Backend** - Create `backend/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Start Application

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 7. Test the System

Open browser to `http://localhost:5173` (or whatever Vite shows)

**Allow Location Permission** when browser asks!

#### Check Each Page:

**✅ Predictions Page:**
- You should see map with your location (blue circle)
- Red markers showing flood incidents
- Green markers showing responder teams
- Status: "Your location detected" (green)

**✅ Public Alerts Page:**
- Safety status card (should be green "SAFE ZONE")
- Your GPS coordinates displayed
- Live alerts feed (3 alerts)
- Evacuation map

**✅ Analytics Page:**
- Charts with realistic data
- Incident trends 2016-2025
- Regional severity breakdown

**✅ Resources Page:**
- Map showing resource deployments
- Asset availability (14/20 Trucks, 8/12 Rescue Squads)
- Auto-deploy button

## 🎯 What You'll See

### Map Markers Explained

#### Red Markers 🔴 (Flood Incidents)
- **Delhi - Yamuna**: Critical flood at 28.7041, 77.2025
- **Mumbai - Mithi River**: Critical at 19.0760, 72.8777
- **Guwahati**: High risk at 26.1445, 91.7362
- **Kerala - Periyar**: High risk at 9.9312, 76.2673

#### Green Markers 🟢 (Responder Units)
- **NDRF Team Alpha-1**: Delhi at 28.7100, 77.2080
- **NDRF Team Beta-3**: Mumbai at 19.0800, 72.8800
- **NDRF Boat Unit**: Delhi at 28.7050, 77.2100

#### Blue Circle 🔵
- Your actual GPS location
- 5km radius indicator

### Sample Data Locations

All incidents use real Indian cities:
- Delhi (28.7°N, 77.2°E)
- Mumbai (19.1°N, 72.9°E)
- Guwahati (26.1°N, 91.7°E)
- Kochi (9.9°N, 76.3°E)
- Patna (25.6°N, 85.1°E)

## 🐛 Troubleshooting

### Issue: Map not showing
**Solution**: Check browser console for errors. Ensure leaflet CSS is loading.

### Issue: "Your location not detected"
**Solution**: 
1. Check if you allowed location permission
2. Use HTTPS or localhost (required for geolocation)
3. Try different browser
4. Map will fallback to Delhi if denied

### Issue: No data showing
**Solution**:
1. Verify mock data loaded (run verification query above)
2. Check Supabase connection in browser Network tab
3. Ensure environment variables are set correctly

### Issue: Backend not connecting
**Solution**:
```bash
# Check if backend is running
curl http://localhost:8000/api/crisis/active

# Should return JSON with incidents
```

## 📊 Understanding the Mock Data

### Severity Levels
- **Critical (Red)**: Immediate evacuation required
- **High (Orange)**: Prepare to evacuate  
- **Medium (Yellow)**: Monitor situation
- **Low (Green)**: Early warning only

### Risk Probabilities
- **0.92 (92%)**: Very likely to flood
- **0.76 (76%)**: Likely to flood
- **0.58 (58%)**: Possible flooding
- **0.38 (38%)**: Low chance

### Resource Status
- **Available**: Ready to deploy
- **Deployed**: Currently at incident site
- **Maintenance**: Under repair
- **Offline**: Not operational

## 🎨 Expected UI Behavior

### On Page Load:
1. Browser asks for location permission
2. "Detecting location..." shows briefly
3. Map centers on your location
4. "Your location detected" appears (green)
5. Markers load on map

### If Location Denied:
1. "Using default location" shows (amber)
2. Map centers on Delhi (28.6139, 77.2090)
3. All other features work normally

### Click on Map Marker:
- Popup shows incident/responder details
- Includes title, description, severity
- For responders: shows unit type

## 📈 Data Refresh

### Current Setup (Static)
- Data loads once from database
- No auto-refresh yet

### Future Enhancement
- Real-time updates via Supabase Realtime
- WebSocket connections
- Auto-refresh every 30 seconds

## 🔐 Authentication Notes

### Current Status
- Auth system present but optional
- Can view all data without login
- Incident reporting requires auth

### Test User Creation
```sql
-- After creating user in Supabase Auth dashboard
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    'Test User', 
    'user'
FROM auth.users 
WHERE email = 'test@example.com';
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Schema SQL executed successfully
- [ ] Mock data SQL executed successfully
- [ ] Verification query shows correct counts
- [ ] Frontend .env configured
- [ ] Backend .env configured
- [ ] Frontend starts on localhost:5173
- [ ] Backend starts on localhost:8000
- [ ] Location permission granted
- [ ] Map shows your location
- [ ] Incidents visible on map
- [ ] Alerts page shows safety status
- [ ] Analytics charts display data

## 🎯 Next Actions

Once everything works:
1. **Explore the data**: Click around the map
2. **Check different pages**: Navigate between Predictions, Alerts, Analytics
3. **Test on mobile**: Responsive design works on phone
4. **Try different locations**: Deny permission to see fallback behavior

## 📞 Need Help?

Check these files for more info:
- `SETUP_AND_IMPROVEMENTS.md` - Full documentation
- `backend/realistic_mock_data.sql` - All test data
- `backend/supabase_schema.sql` - Database structure

---

**Estimated Setup Time**: 10-15 minutes
**Difficulty**: Beginner-friendly
**Last Updated**: January 15, 2026
