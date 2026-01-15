# Flood Resilience Network - Backend

Professional AI-powered flood prediction and emergency coordination system backend built with FastAPI, Supabase, and ZYND AI agents.

## 🚀 Features

- **AI-Powered Flood Prediction**: Multi-agent system using OpenAI GPT-4 and ZYND AI
- **Risk Verification**: Cross-validation to prevent false alarms
- **Emergency Coordination**: Automated response planning and resource allocation
- **Real-time Updates**: WebSocket support for live dashboard
- **Geospatial Queries**: PostGIS integration for location-based operations
- **Public Alerts**: SMS/Push notification system for community warnings

## 📦 Tech Stack

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL + PostGIS)
- **AI Agents**: OpenAI GPT-4, ZYND AI
- **ML**: Prophet, Scikit-learn
- **Real-time**: WebSockets
- **Auth**: Supabase Auth

## 🛠️ Setup Instructions

### 1. Prerequisites

- Python 3.10+
- Supabase account
- OpenAI API key
- ZYND AI key (optional)

### 2. Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Supabase (get from your Supabase project settings)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Optional: ZYND AI
ZYND_AI_KEY=your-zynd-key
```

### 4. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy contents of `supabase_schema.sql`
4. Execute the SQL to create tables, indexes, and policies

### 5. Run the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Predictions

- `GET /api/predictions/` - Get all predictions
- `GET /api/predictions/{id}` - Get specific prediction
- `POST /api/predictions/generate` - Generate new prediction using AI
- `GET /api/predictions/region/{name}` - Get predictions by region

### Incidents (Crisis Management)

- `GET /api/crisis/active` - Get active incidents
- `POST /api/crisis/alert` - Report new incident
- `GET /api/crisis/{id}` - Get specific incident
- `PATCH /api/crisis/{id}/status` - Update incident status

### Public Alerts

- `GET /api/alerts/public` - Get public alerts (no auth)
- `POST /api/alerts/broadcast` - Broadcast new alert
- `PATCH /api/alerts/{id}/deactivate` - Deactivate alert

### WebSocket

- `WS /ws/dashboard` - Real-time crisis dashboard updates
- `WS /ws/alerts` - Real-time public alert notifications

## 🤖 AI Agent System

The backend uses a multi-agent architecture:

### 1. Prediction Agent
- Analyzes weather data and conditions
- Calculates flood probability and severity
- Generates 24-hour water level forecasts
- Estimates affected population
- Uses ZYND AI for enhanced analysis

### 2. Verification Agent
- Cross-validates predictions
- Checks sensor consistency
- Compares with historical patterns
- Assesses data quality
- Prevents false positives

### 3. Coordination Agent
- Creates emergency response plans
- Allocates resources optimally
- Assigns tasks to agencies
- Establishes communication protocols
- Uses ZYND AI for action recommendations

## 📊 Database Schema

### Tables
- `incidents` - Crisis/incident records
- `flood_predictions` - AI-generated predictions
- `public_alerts` - Public warning messages
- `resources` - Emergency response units

### Features
- PostGIS for geospatial queries
- Automatic location triggers
- Row-level security policies
- Indexes for performance

## 🔧 Development

### Running Tests

```bash
pytest tests/
```

### Code Formatting

```bash
black app/
```

### Adding New Agent

1. Create file in `app/agents/`
2. Inherit from `BaseAgent`
3. Implement `execute()` method
4. Add to `app/agents/__init__.py`

## 🌐 Integration with Frontend

Update frontend environment:

```javascript
// frontend/.env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 📝 Example Usage

### Generate Flood Prediction

```bash
curl -X POST "http://localhost:8000/api/predictions/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Dhaka North",
    "latitude": 23.8103,
    "longitude": 90.4125
  }'
```

### Report Incident

```bash
curl -X POST "http://localhost:8000/api/crisis/alert" \
  -F "title=Flash Flood Warning" \
  -F "description=Rapid water rise in downtown" \
  -F "crisis_type=flood" \
  -F "severity=high" \
  -F "latitude=23.8103" \
  -F "longitude=90.4125" \
  -F "reporter_id=user_123"
```

## 🔐 Security

- All sensitive endpoints require authentication
- Service role key for admin operations
- Row-level security on all tables
- CORS configured for frontend origin
- Environment variables for secrets

## 📖 Documentation

- **OpenAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Agent Documentation**: See `app/agents/README.md`

## 🚀 Deployment

### Production Checklist

- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Use strong secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Use production database
- [ ] Enable rate limiting

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Write tests for new features
3. Update documentation
4. Use type hints

## 📄 License

MIT License

## 🆘 Support

For issues or questions:
- Check API docs at `/docs`
- Review logs in console
- Verify Supabase connection
- Check API keys are valid
