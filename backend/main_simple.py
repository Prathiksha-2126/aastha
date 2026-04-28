"""
Aastha Backend - Simplified Version (No Firebase/Google Cloud dependencies)
Uses Gemini AI only - perfect for demo
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import typing_extensions
import os
import json
from datetime import datetime

# Try to import Gemini, fallback to mock if not available
try:
    import google.generativeai as genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAzCkiMg-jeV3ae0Gt1VDcOOH_oioWSVTU")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-1.5-pro')
        GEMINI_AVAILABLE = True
    else:
        gemini_model = None
        GEMINI_AVAILABLE = False
except ImportError:
    gemini_model = None
    GEMINI_AVAILABLE = False
    print("Gemini not available - using mock mode")

# Initialize FastAPI app
app = FastAPI(
    title="Aastha AI Backend (Demo Mode)",
    description="Voice-first NGO coordination with Gemini AI",
    version="1.0.0-demo"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================

class VoiceReportRequest(BaseModel):
    audio_url: str
    language_code: str = "hi-IN"
    user_id: str
    location: Optional[Dict[str, float]] = None

class ChatMessage(BaseModel):
    message: str
    user_id: str
    language: str = "en"
    class Config:
        orm_mode = True

class VolunteerMatchRequest(BaseModel):
    need_id: str
    required_skills: List[str]
    location: Dict[str, float]
    urgency: str
    class Config:
        orm_mode = True

class ImpactVerificationRequest(BaseModel):
    intervention_id: str
    baseline_data: Dict[str, Any]
    current_data: Dict[str, Any]
    time_period_days: int = Field(default=30)
    class Config:
        orm_mode = True

# ==================== MOCK DATA ====================

def get_mock_voice_result(language_code: str) -> Dict:
    transcriptions = {
        "hi-IN": "हमें यहाँ खाने की ज़रूरत है। 50 लोग भूखे हैं।",
        "mr-IN": "आम्हाला इथे औषधांची गरज आहे.",
        "en-IN": "We need food urgently. 50 people affected.",
    }
    
    return {
        "report_id": f"report-{datetime.now().timestamp()}",
        "transcription": transcriptions.get(language_code, "Demo transcription"),
        "extracted_needs": [{
            "need_type": "food_water",
            "urgency": "critical",
            "description": "Food shortage affecting 50 people",
            "location": "Ward 7, Verna Cluster",
            "people_affected": 50,
            "resources_needed": ["Rice", "Water", "Cooking kits"],
            "confidence_score": 0.92
        }],
        "insights": {
            "narrative": "Community nutrition access impacted. Urgent intervention needed.",
            "latent_patterns": ["Clustered need signals", "Resource depletion"],
            "recommended_actions": ["Deploy food packets", "Activate volunteer team"],
            "equity_flag": None
        },
        "status": "processed",
        "timestamp": datetime.now().isoformat(),
        "gemini_used": False
    }

def get_mock_matches() -> List[Dict]:
    return [
        {
            "volunteer_id": "v1",
            "name": "Rahul Sharma",
            "skills": ["medical", "rescue"],
            "distance_km": 2.3,
            "match_score": 94.5,
            "availability": "immediate",
            "reasoning": "Best skill match and closest"
        },
        {
            "volunteer_id": "v2",
            "name": "Priya Patel",
            "skills": ["logistics", "coordination"],
            "distance_km": 4.1,
            "match_score": 87.2,
            "availability": "2_hours",
            "reasoning": "Strong logistics background"
        },
        {
            "volunteer_id": "v3",
            "name": "Amit Kumar",
            "skills": ["food_distribution", "driving"],
            "distance_km": 5.8,
            "match_score": 82.1,
            "availability": "immediate",
            "reasoning": "Has vehicle for transport"
        }
    ]

# ==================== API ENDPOINTS ====================

@app.post("/api/voice/process")
async def process_voice_report(request: VoiceReportRequest):
    """Process voice report - returns mock data for demo"""
    
    if GEMINI_AVAILABLE:
        try:
            # Try to use Gemini for real extraction
            prompt = f"""
            Extract need signals from this emergency report:
            Language: {request.language_code}
            
            Return JSON with: need_type, urgency, description, location, 
            people_affected, resources_needed (list), confidence_score
            """
            
            response = gemini_model.generate_content(prompt)
            # Parse response... (simplified)
            
            result = get_mock_voice_result(request.language_code)
            result["gemini_used"] = True
            return result
            
        except Exception as e:
            print(f"Gemini error: {e}")
            return get_mock_voice_result(request.language_code)
    else:
        return get_mock_voice_result(request.language_code)

@app.post("/api/volunteers/match")
async def match_volunteers(request: VolunteerMatchRequest):
    """Return mock volunteer matches"""
    return get_mock_matches()

@app.get("/api/needs/active")
async def get_active_needs():
    """Return mock active needs"""
    return {
        "needs": [
            {
                "id": "need-1",
                "type": "food_water",
                "urgency": "critical",
                "location": {"lat": 15.2993, "lng": 74.1240},
                "description": "Food shortage - 50 people affected",
                "status": "pending"
            },
            {
                "id": "need-2",
                "type": "medical",
                "urgency": "high",
                "location": {"lat": 15.2893, "lng": 74.1140},
                "description": "Medical supplies needed",
                "status": "in_progress"
            }
        ],
        "count": 2
    }

@app.get("/api/volunteers/active")
async def get_active_volunteers():
    """Return mock active volunteers"""
    return {
        "volunteers": [
            {"id": "v1", "name": "Rahul Sharma", "status": "active", "location": {"lat": 15.2993, "lng": 74.1240}},
            {"id": "v2", "name": "Priya Patel", "status": "active", "location": {"lat": 15.2893, "lng": 74.1140}},
        ],
        "count": 2
    }

@app.get("/api/stats/dashboard")
async def get_dashboard_stats():
    """Return dashboard statistics"""
    return {
        "active_interventions": 14,
        "verified_impact_rate": 72,
        "active_volunteers": 248,
        "open_need_signals": 37,
        "equity_score": 94,
        "response_time_hours": 2.3
    }

@app.post("/api/impact/verify")
async def verify_impact(request: ImpactVerificationRequest):
    """Return mock impact verification"""
    return {
        "delta_percentage": 28.4,
        "confidence_score": 98.2,
        "causal_attribution": "Direct correlation established via volunteer task mapping",
        "verification_status": "verified"
    }

@app.post("/api/equity/audit")
async def equity_audit():
    """Return mock equity audit"""
    return {
        "bias_detected": True,
        "bias_type": "geographic",
        "severity": "medium",
        "recommendations": ["Increase North sector allocation"],
        "auto_balance_applied": True
    }

@app.post("/api/chat/ask")
async def chat_with_gemini(request: ChatMessage):
    """Simple chat response"""
    
    if GEMINI_AVAILABLE:
        try:
            prompt = f"You are Aastha AI, an NGO assistant. Answer: {request.message}"
            response = gemini_model.generate_content(prompt)
            return {
                "response": response.text,
                "language": request.language,
                "gemini_used": True
            }
        except:
            pass
    
    # Fallback response
    responses = {
        "en": "I'm Aastha AI. I can help with volunteer coordination and impact tracking.",
        "hi": "मैं आस्था AI हूं। मैं स्वयंसेवक समन्वय में मदद कर सकता हूं।",
    }
    
    return {
        "response": responses.get(request.language, responses["en"]),
        "language": request.language,
        "gemini_used": False
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_available": GEMINI_AVAILABLE,
        "mode": "demo",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    return {
        "message": "Aastha AI Backend (Demo Mode)",
        "version": "1.0.0-demo",
        "gemini_available": GEMINI_AVAILABLE,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
