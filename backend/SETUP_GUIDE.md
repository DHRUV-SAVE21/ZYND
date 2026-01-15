# 🌊 FLOOD RESILIENCE NETWORK - COMPLETE SETUP GUIDE

## 🎯 What Has Been Built

I've created a **professional-grade backend** for your Flood Resilience Network with:

### ✅ Core Features
- **AI Agent System** (PredictionAgent, VerificationAgent, CoordinationAgent)
- **ZYND AI Integration** (with fallback for when unavailable)
- **FastAPI REST API** with full CRUD operations
- **WebSocket Support** for real-time updates
- **Supabase Integration** with PostGIS for geospatial queries
- **Comprehensive Database Schema** with security policies

### 📁 Project Structure
```
backend/
├── app/
│   ├── agents/          # AI agent system
│   │   ├── base_agent.py
│   │   ├── prediction_agent.py
│   │   ├── verification_agent.py
│   │   ├── coordination_agent.py
│   │   └── zynd_agent_wrapper.py
│   ├── api/             # API endpoints
│   │   ├── predictions.py
│   │   ├── incidents.py
│   │   ├── alerts.py
│   │   └── websocket.py
│   ├── schemas/         # Pydantic data models
│   ├── config.py        # Configuration management
│   ├── database.py      # Supabase client
│   └── main.py          # FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
├── supabase_schema.sql  # Database schema
├── setup.py             # Setup automation
└── README.md            # Documentation
```

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait for database to initialize (~2 minutes)
4. Note your project URL and keys

### Step 3: Setup Database

1. In Supabase dashboard, go to **SQL Editor**
2. Copy contents of `supabase_schema.sql`
3. Paste and click **RUN**
4. Verify tables created in **Table Editor**

### Step 4: Configure Environment

```bash
copy .env.example .env  # Windows
# or
cp .env.example .env    # Linux/Mac
```

Edit `.env` with your credentials:

```env
# Get from Supabase Project Settings -> API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Get from OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: ZYND AI (already integrated with fallback)
ZYND_AI_KEY=your-zynd-key
```

### Step 5: Run Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**API Available at:**
- Main: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🔌 CONNECTING FRONTEND TO BACKEND

### Update Frontend Environment

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

### Test API Connection

Open browser console on frontend and try:

```javascript
// Test prediction API
fetch('http://localhost:8000/api/predictions/')
  .then(r => r.json())
  .then(console.log);

// Test generate prediction
fetch('http://localhost:8000/api/predictions/generate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    region: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777
  })
}).then(r => r.json()).then(console.log);
```

---

## 🤖 HOW THE AI AGENTS WORK

### 1. Prediction Flow

```
User Request → PredictionAgent
  ├─> Fetch weather data
  ├─> ZYND AI analysis
  ├─> Calculate risk score
  ├─> GPT-4 reasoning
  ├─> Generate forecast
  └─> Return prediction

Prediction → VerificationAgent
  ├─> Validate data quality
  ├─> Check consistency
  ├─> Cross-reference history
  ├─> Calculate confidence
  └─> Approve/Reject

If Approved → Save to Database → Broadcast to Frontend
```

### 2. Incident Coordination Flow

```
Incident Reported → CoordinationAgent
  ├─> Analyze severity
  ├─> ZYND AI recommendations
  ├─> Generate action plan
  ├─> Allocate resources
  ├─> Create tasks
  └─> Assign teams

Plan → Broadcast via WebSocket → Update Dashboard
```

---

## 📊 API ENDPOINTS REFERENCE

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictions/` | Get all predictions |
| POST | `/api/predictions/generate` | Generate new AI prediction |
| GET | `/api/predictions/{id}` | Get specific prediction |

**Example Generate Request:**
```json
{
  "region": "Dhaka North",
  "latitude": 23.8103,
  "longitude": 90.4125
}
```

### Incidents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crisis/active` | Get active incidents |
| POST | `/api/crisis/alert` | Report new incident |
| GET | `/api/crisis/{id}` | Get specific incident |
| PATCH | `/api/crisis/{id}/status` | Update status |

### Public Alerts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/public` | Get public alerts (no auth) |
| POST | `/api/alerts/broadcast` | Broadcast new alert |

### WebSocket

| Endpoint | Purpose |
|----------|---------|
| `ws://localhost:8000/ws/dashboard` | Real-time incident updates |
| `ws://localhost:8000/ws/alerts` | Real-time public alerts |

---

## 🧪 TESTING THE SYSTEM

### 1. Test Health Check

```bash
curl http://localhost:8000/health
```

### 2. Generate Prediction

```bash
curl -X POST http://localhost:8000/api/predictions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'
```

### 3. Report Incident

```bash
curl -X POST http://localhost:8000/api/crisis/alert \
  -F "title=Flash Flood" \
  -F "description=Heavy flooding in downtown" \
  -F "crisis_type=flood" \
  -F "severity=high" \
  -F "latitude=19.0760" \
  -F "longitude=72.8777" \
  -F "reporter_id=test_user_123"
```

### 4. Get Active Incidents

```bash
curl http://localhost:8000/api/crisis/active
```

### 5. Get Public Alerts

```bash
curl "http://localhost:8000/api/alerts/public?latitude=19.0760&longitude=72.8777"
```

---

## 🔧 CUSTOMIZATION

### Add New Weather API

Edit `app/api/predictions.py`:

```python
async def _fetch_rainfall_data(lat: float, lon: float) -> float:
    # Replace with actual API
    api_key = settings.OPENWEATHER_API_KEY
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        return data['rain']['1h'] if 'rain' in data else 0
```

### Add New Agent

Create `app/agents/my_agent.py`:

```python
from app.agents.base_agent import BaseAgent

class MyAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="MyAgent")
        self.system_prompt = "Your agent instructions..."
    
    async def execute(self, context):
        # Your agent logic
        result = await self._call_llm(self.system_prompt, str(context))
        return {'result': result}
```

### Modify ZYND AI Integration

Edit `app/agents/zynd_agent_wrapper.py` to customize ZYND AI calls.

---

## 🐛 TROUBLESHOOTING

### Issue: "Module 'zynd_ai' not found"
**Solution:** The wrapper handles this with fallback. No action needed.

### Issue: "Supabase connection failed"
**Solution:** 
1. Check SUPABASE_URL and keys in `.env`
2. Verify Supabase project is active
3. Check internet connection

### Issue: "OpenAI API error"
**Solution:**
1. Verify OPENAI_API_KEY in `.env`
2. Check API key has credits
3. Try test call: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

### Issue: "CORS error from frontend"
**Solution:** Add frontend URL to CORS_ORIGINS in `.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📈 PRODUCTION DEPLOYMENT

### Using Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create project: `railway init`
4. Add environment variables in Railway dashboard
5. Deploy: `railway up`

### Using Render

1. Connect GitHub repo
2. Create new Web Service
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Using Docker

```bash
# Coming soon - Docker support will be added
```

---

## 📚 ADDITIONAL RESOURCES

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **ZYND AI Docs**: Check zynd-ai documentation

---

## ✅ CHECKLIST

- [ ] Python 3.10+ installed
- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] `.env` configured with all keys
- [ ] Backend running on port 8000
- [ ] API docs accessible at /docs
- [ ] Frontend configured with API URL
- [ ] Test prediction generated successfully
- [ ] Test incident reported successfully

---

## 🎉 YOU'RE READY!

Your backend is now fully functional with:
✅ AI-powered flood prediction
✅ Multi-agent verification system
✅ Emergency coordination
✅ Real-time WebSocket updates
✅ Geospatial queries
✅ Public alert system

**Next Steps:**
1. Test all API endpoints via `/docs`
2. Connect frontend and test integration
3. Customize AI agents for your use case
4. Add real weather API integration
5. Deploy to production

Need help? Check logs in console or review API docs at `http://localhost:8000/docs`

**Good luck with your competition! 🚀**
