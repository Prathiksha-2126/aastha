# 🚀 Aastha Setup Guide - Ready to Run!

Your API keys are configured. Follow these steps to run the full system.

## ✅ Configuration Complete

- ✓ Gemini API Key: Configured
- ✓ Firebase Project: gdgprathiksha
- ✓ Google Cloud Project: gdgprathiksha

---

## 🖥️ Step 1: Start the Backend

```powershell
# Open PowerShell and navigate to backend
cd d:\Engineering\Others\Final_Yr_Project\gdg-soln-challenge\aastha\backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run at:** `http://localhost:8000`

**Test it:** Open browser → `http://localhost:8000/docs`

---

## 🌐 Step 2: Start Web Frontend

```powershell
# Open new PowerShell window
cd d:\Engineering\Others\Final_Yr_Project\gdg-soln-challenge\aastha\react-app

# Install dependencies (first time only)
npm install

# Start the app
npm start
```

**Web app will run at:** `http://localhost:3000`

---

## 📱 Step 3: Start Mobile App

### A. Find Your Computer's IP Address
```powershell
ipconfig
# Look for "IPv4 Address" under your WiFi/Ethernet adapter
# Example: 192.168.1.100
```

### B. Update Mobile API URL
Edit `aastha/mobile-app/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8000';
// Example: 'http://192.168.1.100:8000'
```

### C. Run Mobile App
```powershell
cd d:\Engineering\Others\Final_Yr_Project\gdg-soln-challenge\aastha\mobile-app

# Install dependencies
npm install

# Start Expo
npx expo start
```

### D. Run on Your Phone
1. Install **Expo Go** app from Play Store
2. Make sure phone and computer are on **same WiFi**
3. Scan QR code in terminal with Expo Go

---

## 🔧 Firebase Setup (Optional but Recommended)

### 1. Download Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `gdgprathiksha`
3. Settings (gear icon) → Project Settings
4. Service Accounts → Generate new private key
5. Save as: `aastha/backend/service-account-key.json`

### 2. Enable Firestore
1. Firebase Console → Firestore Database
2. Create database → Start in test mode
3. Choose region: `asia-south1`

### 3. Enable APIs in Google Cloud
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: `gdgprathiksha`
3. Enable these APIs:
   - Cloud Speech-to-Text API
   - Cloud Translation API
   - Cloud Firestore API
   - Cloud Functions API
   - Vertex AI API

---

## 🧪 Quick Tests

### Test Backend
```powershell
# Health check
curl http://localhost:8000/health

# Test voice processing
curl -X POST http://localhost:8000/api/voice/process `
  -H "Content-Type: application/json" `
  -d '{"audio_url": "test.ogg", "language_code": "hi-IN", "user_id": "test"}'

# Get dashboard stats
curl http://localhost:8000/api/stats/dashboard
```

### Test Frontend
1. Open `http://localhost:3000`
2. Go to "Echo Portal"
3. Click microphone → Record → Process
4. Should see Gemini extraction results

---

## ☁️ Deploy to Production (Optional)

### Deploy Backend to Cloud Run
```bash
cd aastha/backend

# Build and deploy
gcloud builds submit --tag gcr.io/gdgprathiksha/aastha-backend
gcloud run deploy aastha-backend \
  --image gcr.io/gdgprathiksha/aastha-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=AIzaSyAzCkiMg-jeV3ae0Gt1VDcOOH_oioWSVTU
```

### Deploy Web to Firebase Hosting
```bash
cd aastha/react-app
npm run build
firebase deploy --only hosting
```

---

## 🎯 Demo Tomorrow - Quick Checklist

### If Backend is Running:
- [ ] Open `http://localhost:3000` (web)
- [ ] Echo Portal → Record voice → AI extraction works
- [ ] Compass Map → Shows real-time needs
- [ ] Impact Hearth → Shows verification metrics

### If Backend is NOT Running (Demo Mode):
- [ ] App still works with mock data
- [ ] Full UI experience
- [ ] Simulated AI processing

### Mobile App:
- [ ] Scan QR with Expo Go
- [ ] All 4 screens work
- [ ] Can accept missions
- [ ] Impact tracking visible

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `pip install` fails | Run `python -m pip install --upgrade pip` first |
| `npm install` fails | Delete `node_modules` and retry |
| Backend won't start | Check port 8000 not in use: `netstat -ano \| findstr 8000` |
| Mobile can't connect | Use computer's IP, not localhost |
| Expo Go crashes | Update Expo Go app to latest |
| Firebase errors | Download service account key JSON |
| Gemini errors | Check API key is valid |

---

## 📚 Key URLs When Running

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Mobile | Scan QR with Expo Go |

---

**You're all set for GDG 2026!** 🚀

Questions? Check `GOOGLE-AI-INTEGRATION.md` for detailed docs.
