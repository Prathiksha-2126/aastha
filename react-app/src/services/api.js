/**
 * Aastha API Service Layer
 * Connects React frontend to FastAPI backend
 */

// Demo mode - no backend needed for video
const USE_MOCK_DATA = false;
const API_BASE_URL = 'http://localhost:8000';

// ==================== HELPER FUNCTIONS ====================

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== VOICE PROCESSING API ====================

export const VoiceAPI = {
  /**
   * Process voice report
   * @param {File} audioFile - Audio file to process
   * @param {string} languageCode - Language code (hi-IN, mr-IN, en-IN, etc.)
   * @param {Object} location - GPS coordinates {lat, lng}
   * @param {string} userId - User ID
   */
  async processVoiceReport(audioFile, languageCode = 'hi-IN', location = null, userId = 'demo-user') {
    // In production, upload to Cloud Storage first
    // For demo, simulate with mock data
    
    return fetchWithAuth('/api/voice/process', {
      method: 'POST',
      body: JSON.stringify({
        audio_url: `mock://${audioFile?.name || 'demo.ogg'}`,
        language_code: languageCode,
        user_id: userId,
        location: location
      })
    });
  },

  /**
   * Upload audio to cloud storage
   * @param {File} audioFile 
   */
  async uploadAudio(audioFile) {
    const formData = new FormData();
    formData.append('file', audioFile);
    
    // In production: upload to Google Cloud Storage
    // Return the GCS URL
    return {
      url: `gs://aastha-audio-uploads/${Date.now()}_${audioFile.name}`,
      success: true
    };
  },

  /**
   * Get transcription for audio
   */
  async getTranscription(audioUrl, languageCode) {
    return fetchWithAuth('/api/voice/transcribe', {
      method: 'POST',
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: languageCode
      })
    });
  }
};

// ==================== VOLUNTEER MATCHING API ====================

export const MatchingAPI = {
  /**
   * Find matching volunteers for a need
   * @param {Object} need - Need object with location and skills
   */
  async findMatches(need) {
    return fetchWithAuth('/api/volunteers/match', {
      method: 'POST',
      body: JSON.stringify({
        need_id: need.id || `need-${Date.now()}`,
        required_skills: need.requiredSkills || ['general'],
        location: need.location || { lat: 15.2993, lng: 74.1240 },
        urgency: need.urgency || 'medium',
        equity_priority: need.equityPriority || true
      })
    });
  },

  /**
   * Get all active volunteers
   */
  async getActiveVolunteers() {
    return fetchWithAuth('/api/volunteers/active');
  },

  /**
   * Accept volunteer match
   */
  async acceptMatch(matchId, volunteerId) {
    return fetchWithAuth('/api/matches/accept', {
      method: 'POST',
      body: JSON.stringify({
        match_id: matchId,
        volunteer_id: volunteerId,
        accepted_at: new Date().toISOString()
      })
    });
  }
};

// ==================== NEED SIGNALS API ====================

export const NeedsAPI = {
  /**
   * Get all active need signals
   */
  async getActiveNeeds() {
    return fetchWithAuth('/api/needs/active');
  },

  /**
   * Create new need signal
   */
  async createNeed(needData) {
    return fetchWithAuth('/api/needs/create', {
      method: 'POST',
      body: JSON.stringify(needData)
    });
  },

  /**
   * Update need status
   */
  async updateNeedStatus(needId, status) {
    return fetchWithAuth('/api/needs/update', {
      method: 'POST',
      body: JSON.stringify({
        need_id: needId,
        status: status
      })
    });
  }
};

// ==================== IMPACT VERIFICATION API ====================

export const ImpactAPI = {
  /**
   * Verify impact of intervention
   * @param {string} interventionId 
   * @param {Object} baselineData 
   * @param {Object} currentData 
   */
  async verifyImpact(interventionId, baselineData, currentData) {
    return fetchWithAuth('/api/impact/verify', {
      method: 'POST',
      body: JSON.stringify({
        intervention_id: interventionId,
        baseline_data: baselineData,
        current_data: currentData,
        time_period_days: 30
      })
    });
  },

  /**
   * Get impact metrics for dashboard
   */
  async getDashboardStats() {
    return fetchWithAuth('/api/stats/dashboard');
  },

  /**
   * Get intervention details
   */
  async getIntervention(interventionId) {
    return fetchWithAuth(`/api/interventions/${interventionId}`);
  }
};

// ==================== EQUITY SHIELD API ====================

export const EquityAPI = {
  /**
   * Run equity audit
   * @param {string} region - Region to audit
   * @param {Object} demographics - Demographic data
   * @param {Object} allocation - Resource allocation data
   */
  async runAudit(region, demographics, allocation) {
    return fetchWithAuth('/api/equity/audit', {
      method: 'POST',
      body: JSON.stringify({
        region: region,
        demographic_data: demographics,
        resource_allocation: allocation
      })
    });
  },

  /**
   * Get equity score
   */
  async getEquityScore(region) {
    return fetchWithAuth(`/api/equity/score?region=${region}`);
  },

  /**
   * Apply auto-balance
   */
  async applyAutoBalance(region) {
    return fetchWithAuth('/api/equity/auto-balance', {
      method: 'POST',
      body: JSON.stringify({ region })
    });
  }
};

// ==================== CHATBOT API ====================

export const ChatAPI = {
  /**
   * Send message to AI assistant
   * @param {string} message 
   * @param {string} userId 
   * @param {string} language 
   * @param {Object} context 
   */
  async sendMessage(message, userId = 'demo-user', language = 'en', context = null) {
    return fetchWithAuth('/api/chat/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: message,
        user_id: userId,
        language: language,
        context: context
      })
    });
  },

  /**
   * Get chat history
   */
  async getChatHistory(userId) {
    return fetchWithAuth(`/api/chat/history?user_id=${userId}`);
  }
};

// ==================== REAL-TIME API (WebSocket/SSE) ====================

export class RealtimeAPI {
  constructor() {
    this.eventSource = null;
    this.listeners = {};
  }

  /**
   * Subscribe to real-time need updates
   * @param {Function} callback 
   */
  subscribeToNeeds(callback) {
    // In production: use WebSocket or Server-Sent Events
    // For demo: polling fallback
    
    const poll = async () => {
      try {
        const data = await NeedsAPI.getActiveNeeds();
        callback(data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Poll every 10 seconds
    this.needsInterval = setInterval(poll, 10000);
    poll(); // Initial call

    return () => {
      clearInterval(this.needsInterval);
    };
  }

  /**
   * Subscribe to volunteer location updates
   */
  subscribeToVolunteers(callback) {
    const poll = async () => {
      try {
        const data = await MatchingAPI.getActiveVolunteers();
        callback(data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    this.volunteersInterval = setInterval(poll, 15000);
    poll();

    return () => {
      clearInterval(this.volunteersInterval);
    };
  }

  disconnect() {
    if (this.needsInterval) clearInterval(this.needsInterval);
    if (this.volunteersInterval) clearInterval(this.volunteersInterval);
  }
}

// ==================== MOCK DATA (Demo Mode) ====================

export const MockData = {
  // Static mock data for CompassMap
  mockNeeds: [
    { id: 'need-1', type: 'food_water', urgency: 'critical', location: { lat: 15.2993, lng: 74.1240 }, description: 'Food shortage - 50 people', status: 'pending' },
    { id: 'need-2', type: 'medical', urgency: 'high', location: { lat: 15.2893, lng: 74.1140 }, description: 'Medical supplies needed', status: 'in_progress' },
    { id: 'need-3', type: 'shelter', urgency: 'medium', location: { lat: 15.3093, lng: 74.1340 }, description: 'Temporary housing needed', status: 'pending' },
  ],
  mockVolunteers: [
    { id: 'v1', name: 'Rahul Sharma', status: 'active', location: { lat: 15.2993, lng: 74.1240 }, skills: ['medical', 'rescue'] },
    { id: 'v2', name: 'Priya Patel', status: 'active', location: { lat: 15.2893, lng: 74.1140 }, skills: ['logistics'] },
    { id: 'v3', name: 'Amit Kumar', status: 'active', location: { lat: 15.3093, lng: 74.1340 }, skills: ['food_distribution'] },
  ],

  /**
   * Generate mock voice processing result
   */
  getMockVoiceResult(language = 'hi-IN') {
    const transcriptions = {
      'hi-IN': 'हमें यहाँ खाने की ज़रूरत है। 50 लोग भूखे हैं। कृपया मदद करें।',
      'mr-IN': 'आम्हाला इथे औषधांची गरज आहे. रुग्णालयात जागा नाही.',
      'en-IN': 'We need food and water urgently. 50 people affected by flood.',
      'kn-IN': 'ನಮಗೆ ಆಹಾರ ಬೇಕು. ವಾಯುಭೂತರಾದ 30 ಕುಟುಂಬಗಳು.',
      'ta-IN': 'எங்களுக்கு மருத்துவ உதவி தேவை. மருந்துகள் இல்லை.'
    };

    return {
      report_id: `report-${Date.now()}`,
      transcription: transcriptions[language] || transcriptions['en-IN'],
      extracted_needs: [
        {
          need_type: 'food_water',
          urgency: 'critical',
          description: 'Food shortage affecting 50 people',
          location: 'Verna Cluster, Ward 4',
          people_affected: 50,
          resources_needed: ['Rice', 'Water', 'Cooking utensils'],
          confidence_score: 0.92
        }
      ],
      insights: {
        narrative: 'Community nutrition access impacted. Urgent intervention recommended.',
        latent_patterns: ['Clustered need signals in Verna area', 'Resource depletion pattern'],
        recommended_actions: ['Deploy food packets immediately', 'Activate volunteer team'],
        equity_flag: null
      },
      status: 'processed',
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Generate mock volunteer matches
   */
  getMockMatches() {
    return [
      {
        volunteer_id: 'v1',
        name: 'Rahul Sharma',
        skills: ['medical', 'rescue'],
        distance_km: 2.3,
        match_score: 94.5,
        availability: 'immediate',
        reasoning: 'Closest match with medical skills'
      },
      {
        volunteer_id: 'v2',
        name: 'Priya Patel',
        skills: ['logistics', 'coordination'],
        distance_km: 4.1,
        match_score: 87.2,
        availability: '2_hours',
        reasoning: 'Strong logistics background for food distribution'
      },
      {
        volunteer_id: 'v3',
        name: 'Amit Kumar',
        skills: ['food_distribution', 'driving'],
        distance_km: 5.8,
        match_score: 82.1,
        availability: 'immediate',
        reasoning: 'Has vehicle for transport'
      }
    ];
  },

  /**
   * Generate mock impact verification
   */
  getMockImpact() {
    return {
      delta_percentage: 28.4,
      confidence_score: 98.2,
      causal_attribution: 'Direct correlation established via volunteer task mapping and community labor hours logged',
      verification_status: 'verified'
    };
  },

  /**
   * Generate mock equity audit
   */
  getMockEquity() {
    return {
      bias_detected: true,
      bias_type: 'geographic',
      severity: 'medium',
      recommendations: [
        'Increase resource allocation to North sector',
        'Deploy additional volunteers to underserved areas'
      ],
      auto_balance_applied: true
    };
  }
};

// ==================== API HEALTH CHECK ====================

export const HealthAPI = {
  async check() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return {
        status: 'unavailable',
        error: error.message
      };
    }
  }
};

// Export default
export default {
  VoiceAPI,
  MatchingAPI,
  NeedsAPI,
  ImpactAPI,
  EquityAPI,
  ChatAPI,
  RealtimeAPI,
  MockData,
  HealthAPI
};
