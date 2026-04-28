"""
Cloud Function: Voice Processor
Triggered when audio file uploaded to Cloud Storage
Processes voice to text and extracts needs using Gemini
"""

import os
import json
import base64
from google.cloud import storage, firestore, speech
import google.generativeai as genai
from google.api_core.client_options import ClientOptions
from firebase_admin import initialize_app, firestore as admin_firestore
from datetime import datetime
import functions_framework

# Initialize Firebase
app = initialize_app()
db = admin_firestore.client()

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

def process_voice_audio(bucket_name: str, file_name: str) -> dict:
    """Process uploaded audio file"""
    
    # 1. Download audio from storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    
    # Create temp file
    temp_path = f"/tmp/{os.path.basename(file_name)}"
    blob.download_to_filename(temp_path)
    
    # 2. Transcribe using Google Speech-to-Text
    client = speech.SpeechClient()
    
    with open(temp_path, "rb") as audio_file:
        content = audio_file.read()
    
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.OGG_OPUS,
        sample_rate_hertz=16000,
        language_code="hi-IN",  # Auto-detect with alternative languages
        alternative_language_codes=["mr-IN", "en-IN", "kn-IN", "ta-IN"],
        enable_automatic_punctuation=True,
        model="latest_long"
    )
    
    response = client.recognize(config=config, audio=audio)
    
    # Extract transcription
    transcription = ""
    for result in response.results:
        transcription += result.alternatives[0].transcript + " "
    
    detected_language = response.results[0].language_code if response.results else "hi-IN"
    
    # 3. Extract needs using Gemini
    needs = extract_needs_with_gemini(transcription, detected_language)
    
    # 4. Generate insights
    insights = generate_insights(needs)
    
    # 5. Store results
    report_data = {
        "audio_path": f"gs://{bucket_name}/{file_name}",
        "transcription": transcription,
        "detected_language": detected_language,
        "extracted_needs": needs,
        "insights": insights,
        "status": "processed",
        "processed_at": datetime.now().isoformat(),
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    # Save to Firestore
    doc_ref = db.collection('voice_reports').document()
    doc_ref.set(report_data)
    
    # Cleanup
    os.remove(temp_path)
    
    return {
        "report_id": doc_ref.id,
        "transcription": transcription,
        "needs_count": len(needs)
    }

def extract_needs_with_gemini(transcription: str, language: str) -> list:
    """Use Gemini to extract structured needs"""
    
    prompt = f"""
    Analyze this emergency voice report and extract structured need signals.
    
    Transcription: {transcription}
    Language: {language}
    
    Extract needs in this JSON format:
    {{
        "needs": [
            {{
                "need_type": "food_water|medical|shelter|rescue|supplies|other",
                "urgency": "critical|high|medium|low",
                "description": "clear description",
                "location": "inferred location",
                "people_affected": number,
                "resources_needed": ["item1", "item2"],
                "confidence_score": 0.0-1.0
            }}
        ]
    }}
    
    Return valid JSON only.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        text = response.text
        
        # Extract JSON
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0]
        else:
            json_str = text
            
        result = json.loads(json_str)
        return result.get("needs", [])
    except Exception as e:
        print(f"Gemini extraction error: {e}")
        return [{
            "need_type": "unknown",
            "urgency": "medium",
            "description": transcription[:100],
            "confidence_score": 0.5
        }]

def generate_insights(needs: list) -> dict:
    """Generate AI insights from needs"""
    
    prompt = f"""
    Analyze these needs and generate insights:
    {json.dumps(needs)}
    
    Provide:
    - narrative: 2-3 sentence summary
    - latent_patterns: list of hidden patterns
    - recommended_actions: list of interventions
    - equity_flag: any bias detected?
    
    Return JSON.
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
            
        return json.loads(json_str)
    except:
        return {
            "narrative": "Needs processed",
            "latent_patterns": [],
            "recommended_actions": ["Review and assign"],
            "equity_flag": None
        }

@functions_framework.cloud_event
def process_voice_trigger(cloud_event):
    """
    Cloud Function triggered by Cloud Storage event
    """
    event_data = json.loads(cloud_event.data)
    
    bucket_name = event_data["bucket"]
    file_name = event_data["name"]
    
    # Only process audio files
    if not file_name.endswith(('.ogg', '.wav', '.mp3', '.m4a')):
        print(f"Skipping non-audio file: {file_name}")
        return
    
    print(f"Processing audio: gs://{bucket_name}/{file_name}")
    
    result = process_voice_audio(bucket_name, file_name)
    
    print(f"Processed successfully: {result['report_id']}")
    
    return result
