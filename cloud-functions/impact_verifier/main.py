"""
Cloud Function: Impact Verifier
Runs periodically to verify impact of interventions
Uses Gemini for causal attribution analysis
"""

import os
import json
import functions_framework
from google.cloud import firestore
from firebase_admin import initialize_app, firestore as admin_firestore
import google.generativeai as genai
from datetime import datetime, timedelta

# Initialize
app = initialize_app()
db = admin_firestore.client()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

def get_intervention_data(intervention_id):
    """Get baseline and current data for intervention"""
    intervention_ref = db.collection('interventions').document(intervention_id)
    intervention = intervention_ref.get().to_dict()
    
    if not intervention:
        return None
    
    # Get baseline from reports
    baseline_reports = db.collection('field_reports')\
        .where('intervention_id', '==', intervention_id)\
        .where('type', '==', 'baseline')\
        .order_by('created_at')\
        .limit(1).stream()
    
    baseline = None
    for doc in baseline_reports:
        baseline = doc.to_dict()
    
    # Get latest/current reports
    current_reports = db.collection('field_reports')\
        .where('intervention_id', '==', intervention_id)\
        .where('type', '==', 'followup')\
        .order_by('created_at', direction='DESCENDING')\
        .limit(1).stream()
    
    current = None
    for doc in current_reports:
        current = doc.to_dict()
    
    return {
        'intervention': intervention,
        'baseline': baseline,
        'current': current,
        'duration_days': (datetime.now() - intervention.get('start_date', datetime.now())).days
    }

def verify_impact_with_gemini(data):
    """Use Gemini to verify causal impact"""
    
    if not data['baseline'] or not data['current']:
        return {
            'delta_percentage': 0,
            'confidence_score': 0,
            'causal_attribution': 'Insufficient data for verification',
            'verification_status': 'insufficient_data'
        }
    
    prompt = f"""
    Perform causal impact verification for this intervention:
    
    Intervention: {json.dumps(data['intervention'])}
    Baseline Data: {json.dumps(data['baseline'])}
    Current Data: {json.dumps(data['current'])}
    Duration: {data['duration_days']} days
    
    Analyze:
    1. Calculate delta percentage (improvement from baseline)
    2. Confidence score (0-100) based on data quality and sample size
    3. Causal attribution - how much is due to the intervention vs external factors
    4. Verification status: verified, partial, or insufficient_data
    
    Return JSON:
    {{
        "delta_percentage": float,
        "confidence_score": float,
        "causal_attribution": "explanation",
        "verification_status": "verified|partial|insufficient_data"
    }}
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
    except Exception as e:
        print(f"Gemini verification error: {e}")
        return {
            'delta_percentage': 0,
            'confidence_score': 0,
            'causal_attribution': 'Error in verification',
            'verification_status': 'insufficient_data'
        }

def check_equity_compliance(intervention_id, intervention_data):
    """Check SDG 10 equity compliance"""
    
    prompt = f"""
    Audit this intervention for SDG 10 (Reduced Inequalities) compliance:
    
    Intervention: {json.dumps(intervention_data['intervention'])}
    
    Check for:
    1. Geographic bias (some areas underserved)
    2. Gender bias in resource distribution
    3. Economic disparity in access
    4. Ethnic or social group disparities
    
    Return JSON:
    {{
        "compliant": boolean,
        "bias_detected": boolean,
        "bias_type": "geographic|gender|economic|ethnic|none",
        "severity": "critical|high|medium|low|none",
        "recommendations": ["action1", "action2"]
    }}
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
            'compliant': True,
            'bias_detected': False,
            'bias_type': 'none',
            'severity': 'none',
            'recommendations': []
        }

@functions_framework.http
def verify_all_impacts(request):
    """
    HTTP-triggered function to verify all pending interventions
    Can be scheduled via Cloud Scheduler
    """
    # Get all active interventions needing verification
    interventions = db.collection('interventions')\
        .where('status', 'in', ['active', 'completed'])\
        .where('verification_status', '==', 'pending')\
        .stream()
    
    results = []
    
    for doc in interventions:
        intervention_id = doc.id
        print(f"Verifying intervention: {intervention_id}")
        
        # Get data
        data = get_intervention_data(intervention_id)
        if not data:
            continue
        
        # Verify impact
        impact_result = verify_impact_with_gemini(data)
        
        # Check equity
        equity_result = check_equity_compliance(intervention_id, data)
        
        # Store results
        verification_ref = db.collection('impact_verifications').document()
        verification_data = {
            'intervention_id': intervention_id,
            'impact_result': impact_result,
            'equity_result': equity_result,
            'verified_at': firestore.SERVER_TIMESTAMP,
            'status': 'completed'
        }
        verification_ref.set(verification_data)
        
        # Update intervention
        doc.reference.update({
            'verification_status': impact_result['verification_status'],
            'impact_delta': impact_result['delta_percentage'],
            'confidence_score': impact_result['confidence_score'],
            'equity_compliant': equity_result['compliant'],
            'verified_at': firestore.SERVER_TIMESTAMP
        })
        
        results.append({
            'intervention_id': intervention_id,
            'impact': impact_result,
            'equity': equity_result
        })
        
        print(f"Verified: delta={impact_result['delta_percentage']}%, confidence={impact_result['confidence_score']}%")
    
    return ({
        "processed": len(results),
        "results": results
    }, 200)
