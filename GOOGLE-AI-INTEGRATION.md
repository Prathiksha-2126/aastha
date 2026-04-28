# Aastha Google AI Integration Guide

Complete integration layer with Google AI (Gemini, Speech-to-Text, Cloud Functions) for the GDG 2026 Solution Challenge.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Web App        │  React Native Mobile App                 │
│  (src/services/api.js)│  (api.js)                                │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI Server (backend/main.py)                               │
│  ├── Voice Processing API                                       │
│  ├── Volunteer Matching API                                       │
│  ├── Impact Verification API                                     │
│  ├── Equity Audit API                                           │
│  └── Chatbot API                                                │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CLOUD FUNCTIONS LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ├── voice_processor/     - Triggered by audio upload            │
│  ├── volunteer_matcher/   - Triggered by new need              │
│  └── impact_verifier/     - Scheduled verification               │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GOOGLE AI SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  ├── Gemini 1.5 Pro (Text generation, analysis)                 │
│  ├── Cloud Speech-to-Text (Voice transcription)                 │
│  ├── Cloud Translation (Multi-language support)                 │
│  └── Vertex AI (Matching optimization)                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

```bash
cd aastha/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env
# Edit .env with your API keys

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Integration

```bash
cd aastha/react-app

# Install dependencies
npm install

# Create environment
REACT_APP_API_URL=http://localhost:8000

# Run app
npm start
```

### 3. Mobile App

```bash
cd aastha/mobile-app

# Install dependencies
npm install

# Start with Expo
npx expo start
```

## 🔑 Required API Keys

| Service | Key/Config | How to Get |
|---------|-----------|------------|
| Gemini API | `GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| Firebase | Service Account | Firebase Console > Project Settings > Service Accounts |
| Google Cloud | Application Default | `gcloud auth application-default login` |

## 📡 API Endpoints

### Voice Processing
```http
POST /api/voice/process
Content-Type: application/json

{
  "audio_url": "gs://bucket/audio.ogg",
  "language_code": "hi-IN",
  "user_id": "user-123",
  "location": {"lat": 15.2993, "lng": 74.1240}
}

Response:
{
  "report_id": "report-xyz",
  "transcription": "हमें खाने की ज़रूरत है...",
  "extracted_needs": [...],
  "insights": {...}
}
```

### Volunteer Matching
```http
POST /api/volunteers/match
Content-Type: application/json

{
  "need_id": "need-123",
  "required_skills": ["medical", "rescue"],
  "location": {"lat": 15.2993, "lng": 74.1240},
  "urgency": "critical",
  "equity_priority": true
}

Response:
[
  {
    "volunteer_id": "v1",
    "name": "Rahul Sharma",
    "match_score": 94.5,
    "distance_km": 2.3
  }
]
```

### Impact Verification
```http
POST /api/impact/verify
Content-Type: application/json

{
  "intervention_id": "int-123",
  "baseline_data": {...},
  "current_data": {...},
  "time_period_days": 30
}

Response:
{
  "delta_percentage": 28.4,
  "confidence_score": 98.2,
  "verification_status": "verified"
}
```

### Equity Audit
```http
POST /api/equity/audit
Content-Type: application/json

{
  "region": "margao",
  "demographic_data": {...},
  "resource_allocation": {...}
}

Response:
{
  "bias_detected": true,
  "bias_type": "geographic",
  "severity": "medium",
  "auto_balance_applied": true
}
```

## ☁️ Cloud Functions Deployment

### Deploy Voice Processor
```bash
cd aastha/cloud-functions/voice_processor

gcloud functions deploy process_voice_trigger \
  --runtime python311 \
  --trigger-resource YOUR_AUDIO_BUCKET \
  --trigger-event google.storage.object.finalize \
  --entry-point process_voice_trigger \
  --set-env-vars GEMINI_API_KEY=your_key
```

### Deploy Volunteer Matcher
```bash
cd aastha/cloud-functions/volunteer_matcher

gcloud functions deploy on_need_created \
  --runtime python311 \
  --trigger-event providers/cloud.firestore/eventTypes/document.create \
  --trigger-resource projects/YOUR_PROJECT/databases/(default)/documents/voice_reports/{reportId} \
  --entry-point on_need_created
```

### Deploy Impact Verifier (Scheduled)
```bash
cd aastha/cloud-functions/impact_verifier

# Deploy function
gcloud functions deploy verify_all_impacts \
  --runtime python311 \
  --trigger-http \
  --entry-point verify_all_impacts

# Schedule it (runs daily at 9 AM)
gcloud scheduler jobs create http daily-impact-verification \
  --schedule "0 9 * * *" \
  --uri "https://REGION-PROJECT_ID.cloudfunctions.net/verify_all_impacts" \
  --http-method POST
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use service accounts** - Don't use personal credentials in production
3. **Enable CORS properly** - Restrict to your domain in production
4. **Validate inputs** - All endpoints use Pydantic models
5. **Rate limiting** - Add middleware for production
6. **Firebase rules** - Secure Firestore with proper rules

## 📊 Monitoring & Logs

### View Cloud Function Logs
```bash
gcloud functions logs read process_voice_trigger --limit=50
gcloud functions logs read on_need_created --limit=50
```

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
```
http://localhost:8000/docs  # Swagger UI
http://localhost:8000/redoc  # ReDoc
```

## 🧪 Testing

### Run Backend Tests
```bash
cd aastha/backend
pytest
```

### Test Voice Processing
```bash
curl -X POST http://localhost:8000/api/voice/process \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "mock://test.ogg",
    "language_code": "hi-IN",
    "user_id": "test-user"
  }'
```

### Test Matching
```bash
curl -X POST http://localhost:8000/api/volunteers/match \
  -H "Content-Type: application/json" \
  -d '{
    "need_id": "need-123",
    "required_skills": ["medical"],
    "location": {"lat": 15.2993, "lng": 74.1240},
    "urgency": "critical"
  }'
```

## 🌍 Production Deployment

### Deploy to Cloud Run
```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/aastha-backend

# Deploy to Cloud Run
gcloud run deploy aastha-backend \
  --image gcr.io/PROJECT_ID/aastha-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

### Environment Variables for Production
```env
GEMINI_API_KEY=your_production_key
GOOGLE_CLOUD_PROJECT=your_project_id
ALLOWED_ORIGINS=https://yourdomain.com
DEBUG=false
```

## 📱 Mobile App Connection

Update `mobile-app/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

## 🎨 Frontend Environment

Create `react-app/.env`:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_PROJECT_ID=your_project
```

## 🔄 Demo Mode (No Backend)

Both frontend and mobile app work in **demo mode** without backend:
- Mock data is automatically used
- Full UI experience
- Simulated AI processing

To enable: Just don't set `REACT_APP_API_URL`

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Cloud Speech-to-Text](https://cloud.google.com/speech-to-text/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Cloud Functions](https://cloud.google.com/functions/docs)

---

**Built for GDG 2026 Solution Challenge** 🚀
