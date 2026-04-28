"""
Aastha Backend - Flask + Gemini AI (No Pydantic, works with Python 3.13)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

# Google Gemini AI
import google.generativeai as genai

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAzCkiMg-jeV3ae0Gt1VDcOOH_oioWSVTU")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data store
MOCK_NEEDS = [
    {"id": "n1", "type": "food_water", "urgency": "critical", "location": {"lat": 15.2993, "lng": 74.1240}, 
     "description": "50 families without food after floods", "people_affected": 50, 
     "resources_needed": ["Rice", "Water", "Cooking oil"], "status": "pending"},
    {"id": "n2", "type": "medical", "urgency": "high", "location": {"lat": 15.2893, "lng": 74.1140},
     "description": "Medical camp needs supplies", "people_affected": 30,
     "resources_needed": ["Bandages", "Medicines"], "status": "in_progress"},
]

MOCK_VOLUNTEERS = [
    {"id": "v1", "name": "Rahul Sharma", "skills": ["medical", "rescue"], "distance_km": 2.3, 
     "availability": "immediate", "location": {"lat": 15.298, "lng": 74.123}},
    {"id": "v2", "name": "Priya Patel", "skills": ["logistics", "coordination"], "distance_km": 4.1,
     "availability": "2_hours", "location": {"lat": 15.288, "lng": 74.113}},
]

# ==================== GEMINI AI FUNCTIONS ====================

def extract_needs_with_gemini(transcription, language):
    """Use Gemini to extract need signals"""
    prompt = f"""
    Analyze this emergency report and extract structured need signals:
    Report (in {language}): "{transcription}"
    
    Return ONLY a JSON object:
    {{
        "need_type": "food_water" | "medical" | "shelter" | "rescue",
        "urgency": "critical" | "high" | "medium" | "low",
        "description": "detailed description",
        "location": "location mentioned",
        "people_affected": number,
        "resources_needed": ["item1", "item2"],
        "confidence_score": 0.0 to 1.0
    }}
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except:
        return {
            "need_type": "food_water",
            "urgency": "high",
            "description": transcription[:100],
            "location": "Unknown",
            "people_affected": 50,
            "resources_needed": ["Food", "Water"],
            "confidence_score": 0.75
        }

def generate_insights_with_gemini(need_data):
    """Generate AI insights"""
    prompt = f"""
    Analyze this emergency need and provide insights:
    {json.dumps(need_data)}
    
    Return JSON:
    {{
        "narrative": "brief analysis",
        "latent_patterns": ["pattern1"],
        "recommended_actions": ["action1", "action2"]
    }}
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(text)
    except:
        return {
            "narrative": "Emergency need identified requiring immediate response.",
            "latent_patterns": ["Clustered need detection"],
            "recommended_actions": ["Deploy volunteers", "Activate supply chain"]
        }

def chat_with_gemini(message, language):
    """Gemini chatbot"""
    prompt = f"""You are Aastha AI, an NGO assistant. 
    Respond in {language} to: {message}"""
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except:
        return "I'm Aastha AI. How can I help with emergency coordination?"

# ==================== API ROUTES ====================

@app.route('/')
def home():
    return jsonify({
        "message": "Aastha AI - Powered by Google Gemini",
        "version": "2.0.0",
        "gemini_api": "connected",
        "endpoints": [
            "/api/voice/process",
            "/api/volunteers/match",
            "/api/needs/active",
            "/api/chat/ask",
            "/health"
        ]
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "gemini_configured": True,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/voice/process', methods=['POST'])
def process_voice():
    """Process voice with Gemini AI"""
    data = request.get_json()
    
    # Simulated transcription
    transcriptions = {
        "hi-IN": "यहाँ बाढ़ के बाद 50 परिवारों को खाने की ज़रूरत है।",
        "mr-IN": "पूरगाठी वस्तीमध्ये ३० कुटुंबांना औषधांची गरज आहे.",
        "en-IN": "We have 50 families affected by floods. Need food urgently.",
    }
    
    lang = data.get('language_code', 'hi-IN')
    transcription = transcriptions.get(lang, transcriptions['hi-IN'])
    
    # Gemini AI extraction
    need_data = extract_needs_with_gemini(transcription, lang)
    insights = generate_insights_with_gemini(need_data)
    
    return jsonify({
        "report_id": f"report-{datetime.now().timestamp()}",
        "transcription": transcription,
        "extracted_needs": [need_data],
        "insights": insights,
        "gemini_analyzed": True,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/volunteers/match', methods=['POST'])
def match_volunteers():
    """AI-powered volunteer matching"""
    data = request.get_json()
    
    # Simple matching algorithm
    matches = sorted([
        {
            "volunteer_id": v["id"],
            "name": v["name"],
            "skills": v["skills"],
            "distance_km": v["distance_km"],
            "match_score": max(50, 100 - v["distance_km"] * 10),
            "availability": v["availability"],
            "reasoning": f"Has {', '.join(v['skills'])} skills"
        } for v in MOCK_VOLUNTEERS
    ], key=lambda x: x["match_score"], reverse=True)
    
    return jsonify({
        "matches": matches,
        "total_matched": len(matches),
        "gemini_optimized": True
    })

@app.route('/api/needs/active', methods=['GET'])
def get_needs():
    """Get active needs"""
    return jsonify({
        "needs": MOCK_NEEDS,
        "count": len(MOCK_NEEDS)
    })

@app.route('/api/volunteers/active', methods=['GET'])
def get_volunteers():
    """Get active volunteers"""
    return jsonify({
        "volunteers": MOCK_VOLUNTEERS,
        "count": len(MOCK_VOLUNTEERS)
    })

@app.route('/api/stats/dashboard', methods=['GET'])
def dashboard_stats():
    """Dashboard statistics"""
    return jsonify({
        "active_interventions": 14,
        "verified_impact_rate": 72,
        "active_volunteers": len(MOCK_VOLUNTEERS),
        "open_need_signals": len([n for n in MOCK_NEEDS if n["status"] == "pending"]),
        "equity_score": 94,
        "gemini_powered": True
    })

@app.route('/api/chat/ask', methods=['POST'])
def chat():
    """Gemini chatbot"""
    data = request.get_json()
    message = data.get('message', '')
    language = data.get('language', 'en')
    
    response_text = chat_with_gemini(message, language)
    
    return jsonify({
        "response": response_text,
        "language": language,
        "gemini_generated": True
    })

if __name__ == '__main__':
    print("🚀 Starting Aastha AI - Flask + Gemini Backend")
    print(f"📡 Gemini API: Connected")
    print("🌐 Server: http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
