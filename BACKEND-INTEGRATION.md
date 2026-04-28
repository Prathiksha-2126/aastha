# Aastha - Backend Integration Guide
## GDG 2026 Solution Challenge

---

## API Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Firebase/AWS)                │
│                     Rate Limiting, Auth, CORS                      │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐   ┌────────▼─────────┐   ┌────────▼─────────┐
│   Echo Portal  │   │   Compass Map    │   │  Impact Hearth   │
│    (Voice)     │   │  (Geolocation)   │   │  (Analytics)     │
└───────┬────────┘   └────────┬─────────┘   └────────┬─────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Core Services     │
                    │  - Gemini AI        │
                    │  - Vertex AI        │
                    │  - Cloud STT        │
                    │  - Firestore        │
                    └─────────────────────┘
```

---

## API Endpoints

### 1. Echo Portal - Voice Processing

#### POST /api/v1/echo/process
Process voice report through Gemini AI

**Request:**
```json
{
  "audio_url": "gs://aastha-audio/reports/123.ogg",
  "language": "hi",
  "location": {
    "lat": 15.4909,
    "lng": 73.8278,
    "ward": "Ward 7"
  },
  "reporter": {
    "id": "asha_worker_123",
    "type": "ASHA",
    "phone": "+91-9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report_id": "rpt_abc123",
    "extracted": {
      "category": "Food Shortage",
      "urgency": "HIGH",
      "affected_count": 45,
      "needs": ["Ration Kits", "Nutrition Supplements"],
      "location": "Ward 7, Panjim",
      "confidence": 0.94
    },
    "latent_insights": {
      "malnutrition_risk": true,
      "seasonal_correlation": "monsoon_deficit",
      "prediction": "Risk HIGH next 2 weeks"
    },
    "translations": {
      "original": "वार्ड 7 में खाद्य संकट है...",
      "en": "Food shortage in Ward 7..."
    }
  },
  "processing_time_ms": 1200
}
```

---

### 2. Compass Map - Needs & Volunteers

#### GET /api/v1/needs/active
Get active need signals

**Response:**
```json
{
  "success": true,
  "data": {
    "needs": [
      {
        "id": "need_123",
        "type": "Food Shortage",
        "urgency": "HIGH",
        "location": { "lat": 15.4909, "lng": 73.8278 },
        "ward": "Ward 7",
        "status": "unassigned",
        "neglect_index": 0.87,
        "reported_at": "2024-01-15T10:30:00Z",
        "affected": 45
      }
    ],
    "stats": {
      "total_unassigned": 37,
      "high_urgency": 12,
      "neglected_zones": 3
    }
  }
}
```

#### GET /api/v1/volunteers/nearby
Get nearby available volunteers

**Query:** `?lat=15.4909&lng=73.8278&radius=5&need_type=Medical`

**Response:**
```json
{
  "success": true,
  "data": {
    "volunteers": [
      {
        "id": "vol_456",
        "name": "Rahul Sawant",
        "initials": "RS",
        "location": { "lat": 15.4950, "lng": 73.8300 },
        "distance_km": 1.2,
        "match_score": 0.94,
        "skills": ["Medical", "First Aid"],
        "languages": ["Hindi", "Konkani"],
        "vehicle": "2-Wheeler",
        "status": "available"
      }
    ]
  }
}
```

#### POST /api/v1/deployments
Deploy volunteer to need

**Request:**
```json
{
  "volunteer_id": "vol_456",
  "need_id": "need_123",
  "deployment_type": "urgent",
  "estimated_arrival": "2024-01-15T11:00:00Z"
}
```

---

### 3. Impact Hearth - Analytics

#### GET /api/v1/impact/summary
Get impact verification summary

**Response:**
```json
{
  "success": true,
  "data": {
    "verified_impact_rate": 0.72,
    "total_interventions": 1204,
    "verified_interventions": 868,
    "causal_deltas": {
      "water_security": -0.63,
      "nutrition": -0.36,
      "maternal_health": -0.44,
      "literacy_access": -0.28
    },
    "quarter_over_quarter": {
      "q1": 0.65,
      "q2": 0.68,
      "q3": 0.72
    }
  }
}
```

#### GET /api/v1/impact/outcome-loop
Get outcome feedback data

**Response:**
```json
{
  "success": true,
  "data": {
    "deployments": [
      {
        "deployment_id": "dep_789",
        "volunteer": "Rahul Sawant",
        "need_before": "HIGH",
        "need_after": "LOW",
        "reduction_delta": -0.75,
        "verified": true,
        "ground_truth_source": "follow_up_call"
      }
    ]
  }
}
```

---

### 4. Equity Shield - Bias Detection

#### GET /api/v1/equity/audit
Get equity audit data

**Response:**
```json
{
  "success": true,
  "data": {
    "geographic_bias": {
      "urban": { "assignments": 87, "percentage": 58 },
      "peri_urban": { "assignments": 42, "percentage": 28 },
      "rural": { "assignments": 21, "percentage": 14 },
      "disparity_ratio": 2.07,
      "alert": "rural_under_served"
    },
    "gender_bias": {
      "male": 0.68,
      "female": 0.28,
      "other": 0.04
    },
    "recommendations": [
      {
        "type": "auto_balance",
        "action": "redistribute_12_to_rural",
        "expected_improvement": 0.15
      }
    ]
  }
}
```

#### POST /api/v1/equity/auto-balance
Trigger auto-balancing

**Response:**
```json
{
  "success": true,
  "data": {
    "redistributed": 12,
    "to_zones": ["Rural NE", "Ward 12"],
    "new_disparity_ratio": 1.45,
    "improvement": "+29%"
  }
}
```

---

## Google Cloud Integration

### Gemini 1.5 Flash - Need Extraction

```javascript
const { VertexAI } = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({ project: 'aastha-gdg', location: 'us-central1' });
const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function extractNeedSignal(transcript, language) {
  const prompt = `
    Extract structured need signal from field report:
    Language: ${language}
    Transcript: ${transcript}
    
    Return JSON with:
    - category: one of [Food Shortage, Water Access, Medical Emergency, Sanitation, Shelter, Education]
    - urgency: LOW, MEDIUM, HIGH
    - affected_count: number of people/families
    - needs: array of specific items needed
    - location_mentioned: ward/area name
    - latent_insights: any patterns or predictions
  `;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

### Cloud Speech-to-Text

```javascript
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

async function transcribeAudio(audioBytes, languageCode) {
  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'OGG_OPUS',
      sampleRateHertz: 48000,
      languageCode: languageCode, // 'hi-IN', 'mr-IN', etc.
      enableAutomaticPunctuation: true,
      model: 'latest_long'
    }
  };
  
  const [response] = await client.recognize(request);
  return response.results.map(r => r.alternatives[0].transcript).join(' ');
}
```

---

## Database Schema (Firestore)

### Collections

```javascript
// /reports/{reportId}
{
  id: string,
  audioUrl: string,
  transcript: { hi: string, en: string },
  extracted: {
    category: string,
    urgency: 'LOW' | 'MEDIUM' | 'HIGH',
    affectedCount: number,
    needs: string[],
    location: string,
    geo: { lat: number, lng: number }
  },
  status: 'new' | 'processing' | 'assigned' | 'resolved',
  neglectIndex: number,
  createdAt: timestamp,
  assignedVolunteer: ref // /volunteers/{id}
}

// /volunteers/{volunteerId}
{
  id: string,
  name: string,
  phone: string,
  location: { lat: number, lng: number, ward: string },
  skills: string[],
  languages: string[],
  vehicle: string,
  availability: 'available' | 'busy' | 'offline',
  totalDeployments: number,
  verifiedImpacts: number
}

// /deployments/{deploymentId}
{
  id: string,
  volunteer: ref,
  need: ref,
  status: 'deploying' | 'in_progress' | 'completed' | 'verified',
  needBefore: string,
  needAfter: string,
  impactVerified: boolean,
  createdAt: timestamp,
  completedAt: timestamp
}
```

---

## Authentication

### Firebase Auth Integration

```javascript
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

// Phone-based auth for ASHA workers (simpler than passwords)
const auth = getAuth();

async function sendOTP(phoneNumber) {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
  return confirmation;
}

// Custom claims for roles
// - asha_worker: Can submit reports
// - ngo_admin: Can deploy volunteers
// - super_admin: Full access
```

---

## Deployment

### Firebase Hosting + Functions

```bash
# Deploy web app
firebase deploy --only hosting

# Deploy API functions
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Environment Variables

```bash
# .env
GOOGLE_CLOUD_PROJECT=aastha-gdg
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
FIREBASE_API_KEY=xxx
GEMINI_API_KEY=xxx
```

---

## Testing

### Sample cURL Commands

```bash
# Submit voice report
curl -X POST https://api.aastha.app/v1/echo/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "gs://bucket/report.ogg",
    "language": "hi",
    "location": {"ward": "Ward 7"}
  }'

# Get nearby volunteers
curl "https://api.aastha.app/v1/volunteers/nearby?lat=15.49&lng=73.83&radius=5" \
  -H "Authorization: Bearer $TOKEN"

# Deploy volunteer
curl -X POST https://api.aastha.app/v1/deployments \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"volunteer_id": "vol_456", "need_id": "need_123"}'
```

---

*Ready for GDG 2026 Solution Challenge Submission*
