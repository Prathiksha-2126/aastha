"""
Cloud Function: Volunteer Matcher
Triggered when new need is detected
Automatically matches volunteers using Gemini AI
"""

import os
import json
import functions_framework
from google.cloud import firestore
from firebase_admin import initialize_app, firestore as admin_firestore
import google.generativeai as genai
from datetime import datetime

# Initialize
app = initialize_app()
db = admin_firestore.client()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in km between coordinates"""
    from math import radians, sin, cos, sqrt, atan2
    
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def get_nearby_volunteers(need_location, radius_km=10):
    """Get volunteers within radius"""
    volunteers_ref = db.collection('volunteers')
    volunteers = volunteers_ref.where('status', '==', 'active').stream()
    
    nearby = []
    for doc in volunteers:
        v = doc.to_dict()
        v['id'] = doc.id
        
        if 'location' in v:
            dist = calculate_distance(
                need_location['lat'], need_location['lng'],
                v['location']['lat'], v['location']['lng']
            )
            if dist <= radius_km:
                v['distance_km'] = round(dist, 1)
                nearby.append(v)
    
    return sorted(nearby, key=lambda x: x['distance_km'])

def match_with_gemini(need, volunteers):
    """Use Gemini to optimize matching"""
    
    if not volunteers:
        return []
    
    prompt = f"""
    Optimize volunteer matching for this emergency need:
    
    Need: {json.dumps(need)}
    Available Volunteers (sorted by distance): {json.dumps(volunteers[:10])}
    
    Score each volunteer 0-100 based on:
    1. Skill match to need type (40%)
    2. Distance/proximity (30%)
    3. Availability status (20%)
    4. Equity: Prioritize underrepresented areas if equity_priority flag is set (10%)
    
    Return TOP 3 matches in this JSON format:
    {{
        "matches": [
            {{
                "volunteer_id": "id",
                "name": "Name",
                "match_score": 85.5,
                "distance_km": 2.3,
                "skills_matched": ["skill1"],
                "estimated_arrival": "10 minutes",
                "reasoning": "Best match due to..."
            }}
        ]
    }}
    
    Return valid JSON only.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text
        
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0]
        else:
            json_str = text
            
        result = json.loads(json_str)
        return result.get("matches", [])
    except Exception as e:
        print(f"Gemini matching error: {e}")
        # Fallback scoring
        matches = []
        for v in volunteers[:3]:
            matches.append({
                "volunteer_id": v['id'],
                "name": v.get('name', 'Unknown'),
                "match_score": 70.0,
                "distance_km": v.get('distance_km', 0),
                "skills_matched": v.get('skills', []),
                "estimated_arrival": f"{int(v.get('distance_km', 0) * 5)} minutes",
                "reasoning": "Close proximity match"
            })
        return matches

def notify_volunteers(need_id, matches):
    """Send notifications to matched volunteers"""
    for match in matches:
        # Store match in Firestore
        match_ref = db.collection('matches').document()
        match_ref.set({
            'need_id': need_id,
            'volunteer_id': match['volunteer_id'],
            'match_score': match['match_score'],
            'status': 'pending',
            'created_at': firestore.SERVER_TIMESTAMP
        })
        
        # TODO: Send push notification via FCM
        print(f"Notified volunteer {match['name']} for need {need_id}")

@functions_framework.cloud_event
def on_need_created(cloud_event):
    """
    Triggered when new need is created in Firestore
    """
    event_data = json.loads(cloud_event.data)
    
    need_id = event_data['value']['name'].split('/')[-1]
    need_data = event_data['value']['fields']
    
    print(f"New need detected: {need_id}")
    
    # Extract need info
    need = {
        'id': need_id,
        'type': need_data.get('need_type', {}).get('stringValue', 'unknown'),
        'urgency': need_data.get('urgency', {}).get('stringValue', 'medium'),
        'location': {
            'lat': need_data['location']['geoPointValue']['latitude'],
            'lng': need_data['location']['geoPointValue']['longitude']
        } if 'location' in need_data else None,
        'description': need_data.get('description', {}).get('stringValue', ''),
        'equity_priority': need_data.get('equity_priority', {}).get('booleanValue', False)
    }
    
    if not need['location']:
        print("No location data, skipping match")
        return
    
    # Get nearby volunteers
    volunteers = get_nearby_volunteers(need['location'])
    print(f"Found {len(volunteers)} nearby volunteers")
    
    if not volunteers:
        print("No volunteers available")
        return
    
    # Match with Gemini AI
    matches = match_with_gemini(need, volunteers)
    print(f"Gemini selected {len(matches)} matches")
    
    # Notify volunteers
    notify_volunteers(need_id, matches)
    
    # Update need with matches
    need_ref = db.collection('voice_reports').document(need_id)
    need_ref.update({
        'matched_volunteers': [m['volunteer_id'] for m in matches],
        'match_status': 'volunteers_notified',
        'matched_at': firestore.SERVER_TIMESTAMP
    })
    
    return {"matched": len(matches), "need_id": need_id}
