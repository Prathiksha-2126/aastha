/*
Aastha Mobile API Service
Connects React Native app to FastAPI backend
*/

// For Expo development, use your computer's IP address
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE_URL = 'http://172.25.175.201:8000'; // ← UPDATED with your computer's IP

// Production: Use your deployed backend URL
// const API_BASE_URL = 'https://your-backend-url.com';

// API Helper
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Voice API
export const VoiceAPI = {
  async processReport(audioUri, languageCode = 'hi-IN', location = null) {
    return fetchAPI('/api/voice/process', {
      method: 'POST',
      body: JSON.stringify({
        audio_url: audioUri,
        language_code: languageCode,
        user_id: 'mobile-user',
        location: location,
      }),
    });
  },
};

// Volunteer Matching API
export const MatchingAPI = {
  async findMatches(need) {
    return fetchAPI('/api/volunteers/match', {
      method: 'POST',
      body: JSON.stringify({
        need_id: need.id,
        required_skills: need.skills || ['general'],
        location: need.location,
        urgency: need.urgency || 'medium',
        equity_priority: true,
      }),
    });
  },

  async getActiveVolunteers() {
    return fetchAPI('/api/volunteers/active');
  },
};

// Needs API
export const NeedsAPI = {
  async getActiveNeeds() {
    return fetchAPI('/api/needs/active');
  },
};

// Impact API
export const ImpactAPI = {
  async getDashboardStats() {
    return fetchAPI('/api/stats/dashboard');
  },

  async verifyImpact(interventionId) {
    return fetchAPI('/api/impact/verify', {
      method: 'POST',
      body: JSON.stringify({
        intervention_id: interventionId,
        baseline_data: {},
        current_data: {},
        time_period_days: 30,
      }),
    });
  },
};

// Equity API
export const EquityAPI = {
  async runAudit(region) {
    return fetchAPI('/api/equity/audit', {
      method: 'POST',
      body: JSON.stringify({
        region: region,
        demographic_data: {},
        resource_allocation: {},
      }),
    });
  },
};

// Chat API
export const ChatAPI = {
  async sendMessage(message, language = 'en') {
    return fetchAPI('/api/chat/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: message,
        user_id: 'mobile-user',
        language: language,
      }),
    });
  },
};

// Mock Data for Demo (when backend unavailable)
export const MockData = {
  getMockMatches() {
    return [
      {
        volunteer_id: 'v1',
        name: 'Rahul Sharma',
        skills: ['medical', 'rescue'],
        distance_km: 2.3,
        match_score: 94.5,
        availability: 'immediate',
      },
      {
        volunteer_id: 'v2',
        name: 'Priya Patel',
        skills: ['logistics'],
        distance_km: 4.1,
        match_score: 87.2,
        availability: '2_hours',
      },
    ];
  },

  getMockImpact() {
    return {
      delta_percentage: 28.4,
      confidence_score: 98.2,
      verification_status: 'verified',
    };
  },

  getMockNeeds() {
    return [
      {
        id: 'need-1',
        type: 'food_water',
        urgency: 'critical',
        location: { lat: 15.2993, lng: 74.1240 },
        description: 'Food shortage - 50 people',
      },
    ];
  },
};

export default { VoiceAPI, MatchingAPI, NeedsAPI, ImpactAPI, EquityAPI, ChatAPI, MockData };
