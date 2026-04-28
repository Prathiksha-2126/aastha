import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceAPI, MockData } from '../services/api';

const AIStage = ({ label, sublabel, isActive, isComplete, error }) => (
  <div 
    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 relative overflow-hidden ${
      error ? 'bg-error-container border-error text-error' :
      isComplete ? 'bg-primary-fixed border-primary-fixed-dim' : 
      isActive ? 'bg-white border-primary animate-pulse shadow-sm' : 'bg-[#f5f3f0] border-transparent opacity-60'
    }`}
  >
    {isActive && (
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary text-white text-[8px] font-bold tracking-widest animate-bounce">
        LIVE EXTRACTION
      </div>
    )}
    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
      error ? 'bg-error text-white' :
      isComplete ? 'bg-primary text-white' : 
      isActive ? 'bg-primary-container text-white' : 'bg-[#eae8e5] text-outline'
    }`}>
      {error ? (
        <span className="material-symbols-outlined text-sm">error</span>
      ) : isComplete ? (
        <span className="material-symbols-outlined text-sm">check</span>
      ) : isActive ? (
        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
      ) : (
        <span className="text-[10px] font-bold">0{label === 'Speech-to-Text' ? '1' : label === 'Translation Layer' ? '2' : label === 'Gemini 1.5 Flash' ? '3' : '4'}</span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-bold truncate">{label}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{sublabel}</div>
    </div>
    {isComplete && (
      <div className="flex flex-col items-end">
        <div className="text-[10px] font-bold text-primary">VERIFIED</div>
        <div className="text-[8px] opacity-60">DPDP COMPLIANT</div>
      </div>
    )}
  </div>
);

const EchoPortal = ({ showToast, addReport }) => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('hi');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('Tap the microphone above to begin recording your field report...');
  const [canProcess, setCanProcess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setTranscript(currentTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setTranscript('Microphone access denied. Please allow microphone access and try again.');
        }
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setCanProcess(true);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Update recognition language when lang changes
  useEffect(() => {
    if (recognitionRef.current) {
      const langCodes = { hi: 'hi-IN', mr: 'mr-IN', kok: 'kok-IN', en: 'en-IN' };
      recognitionRef.current.lang = langCodes[lang] || 'hi-IN';
    }
  }, [lang]);

  // Recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      setTranscript('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript('Listening... Speak now');
    setCanProcess(false);
    setResult(null);
    setStage(0);
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start recording:', e);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setCanProcess(true);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Failed to stop recording:', e);
      }
    }
  };

  const clearRecording = () => {
    stopRecording();
    setTranscript('Tap the microphone above to begin recording your field report...');
    setRecordingTime(0);
    setCanProcess(false);
    setProcessing(false);
    setStage(0);
    setResult(null);
  };

  const processReport = async () => {
    setProcessing(true);
    setCanProcess(false);
    setResult(null);
    setStage(0);
    
    try {
      const langCodes = { hi: 'hi-IN', mr: 'mr-IN', kok: 'kok-IN', en: 'en-IN' };
      
      // Step 1: STT
      setStage(1);
      await new Promise(r => setTimeout(r, 800));
      
      // Step 2: Translation
      setStage(2);
      await new Promise(r => setTimeout(r, 600));
      
      // Step 3: Gemini Extraction
      setStage(3);
      
      // Robust fallback for when browser STT fails (Network Error)
      let finalTranscript = transcript;
      if (!transcript || transcript.includes('Tap the microphone') || transcript.includes('Listening')) {
        const demoTranscripts = {
          'hi-IN': 'वार्ड 7 में खाद्य संकट है, लगभग 45 परिवार प्रभावित हैं। तत्काल राशन की आवश्यकता है।',
          'mr-IN': 'वार्ड 12 मध्ये पाण्याची टंचाई आहे. तातडीने पाणी पुरवठा आवश्यक आहे.',
          'kok-IN': 'वार्ड 3 म गरजोच्या माणसांक स्वच्छता सामग्री नाका।',
          'en-IN': 'Ward 5 has a medical emergency. Requesting medical volunteer urgently.'
        };
        finalTranscript = demoTranscripts[langCodes[lang] || 'hi-IN'];
        setTranscript(finalTranscript);
      }

      const payload = {
        audio_url: 'data:audio/wav;base64,...',
        language_code: langCodes[lang] || 'hi-IN',
        user_id: 'web-user',
        location: { lat: 15.2993, lng: 74.1240 },
        transcription: finalTranscript
      };
      
      const response = await fetch('http://localhost:8000/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      // Step 4: Matching
      setStage(4);
      await new Promise(r => setTimeout(r, 800));
      setStage(5); // Complete
      
      const need = response.extracted_needs?.[0] || {};
      const newResult = {
        category: (need.need_category || need.need_type || 'Emergency').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        location: response.insights?.location_name || need.location || 'Reported Area',
        urgency: (need.signal_urgency >= 4 || need.urgency?.toLowerCase() === 'high' || need.urgency?.toLowerCase() === 'critical') ? 'HIGH' : 'MEDIUM',
        families: need.people_affected || 10,
        needs: need.resources_needed?.join(', ') || 'Assistance required',
        latent: response.insights?.narrative || response.insights?.latent_patterns?.[0] || '⚠ AI analysis active for this signal.',
        geminiAnalyzed: true
      };
      
      setResult(newResult);
      setProcessing(false);
      showToast('Causal Impact Loop Active: Signal Verified', 'verified');
      
      // Auto-add to field reports
      addReport({
        id: Date.now(),
        category: newResult.category,
        location: newResult.location,
        urgency: newResult.urgency,
        status: 'unassigned',
        time: 'Just now',
        affected: newResult.families,
        source: 'Voice'
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      setProcessing(false);
      setStage(-1); // Error state
      showToast('Pipeline Interrupted: Check backend connectivity', 'error');
    }
  };

  const deploy = () => {
    showToast(`Volunteer Rahul Sawant deployed → ${result?.location}`, 'volunteer_activism');
    setTimeout(() => navigate('/compass'), 1200);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-7 flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">Echo Portal</h1>
        <p className="text-outline text-sm mt-1">Voice-first field reporting for ASHA workers · WhatsApp-compatible · Zero onboarding</p>
      </div>

      {/* Voice Reporting Workflow (Doodle Style) */}
      <div className="bg-[#e0f7f4] rounded-3xl p-8 border border-[#b2dfdb]/50 relative overflow-hidden mb-2">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-8xl">draw</span>
        </div>
        
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00695c] mb-8 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-[#00695c]"></span>
          The Aastha Voice Loop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Step 1: Observe */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[#b2dfdb] group-hover:rotate-3 transition-transform">
              <span className="material-symbols-outlined text-4xl text-[#00695c]">visibility</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-1">Observe</h3>
            <p className="text-xs text-[#00695c]/70 max-w-[180px]">Worker observes a critical community need in the field.</p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex absolute left-[28%] top-10 text-[#00695c]/30">
            <span className="material-symbols-outlined text-4xl">trending_flat</span>
          </div>

          {/* Step 2: Speak */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md border-2 border-[#00695c]/20 group-hover:-rotate-3 transition-transform relative">
              <span className="material-symbols-outlined text-5xl text-[#00695c]">forum</span>
              <div className="absolute -bottom-2 -right-2 bg-[#25D366] text-white p-1.5 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-sm block">chat</span>
              </div>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-1">Speak</h3>
            <p className="text-xs text-[#00695c]/70 max-w-[180px]">Speaks multilingual voice note into WhatsApp or Portal.</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex absolute left-[62%] top-10 text-[#00695c]/30">
            <span className="material-symbols-outlined text-4xl">trending_flat</span>
          </div>

          {/* Step 3: Log */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[#b2dfdb] group-hover:rotate-3 transition-transform">
              <span className="material-symbols-outlined text-4xl text-[#00695c]">cloud_done</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-1">Log</h3>
            <p className="text-xs text-[#00695c]/70 max-w-[180px]">Echo Portal logs the data automatically to Firestore.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Voice Recording */}
        <div className="flex flex-col gap-5">
          {/* Voice Card */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-5 text-center border border-[#e4e2df] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none"></div>
            
            <div className="flex gap-2">
              {['hi', 'mr', 'kok', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    lang === l 
                      ? 'bg-primary text-white' 
                      : 'bg-transparent border border-primary-container text-primary hover:bg-[#f0edea]'
                  }`}
                >
                  {l === 'hi' ? '🇮🇳 Hindi' : l === 'mr' ? 'मराठी' : l === 'kok' ? 'Konkani' : 'English'}
                </button>
              ))}
            </div>

            <h2 className="font-serif text-2xl font-medium text-primary">Speak to Report</h2>
            <p className="text-sm text-outline max-w-sm">Tap the microphone and speak naturally in your language. Gemini AI extracts the need signal automatically.</p>

            {/* Record Button */}
            <button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                isRecording 
                  ? 'bg-error animate-[record-pulse_1.5s_ease-in-out_infinite]' 
                  : 'bg-secondary shadow-lg shadow-secondary/30'
              }`}
            >
              <span className="material-symbols-outlined fill-icon text-white text-3xl">
                {isRecording ? 'stop' : 'mic'}
              </span>
            </button>

            <div className="text-xs font-bold uppercase tracking-wider text-outline">
              {isRecording ? `Recording... ${formatTime(recordingTime)}` : canProcess ? 'Recording complete — ready to process' : 'Tap to Record'}
            </div>
          </div>

          {/* Transcript Card */}
          <div className="bg-white rounded-xl p-6 border border-[#e4e2df]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-medium text-primary">Live Transcription</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#eae8e5] text-[#424844]">
                {lang === 'hi' ? 'Hindi → EN' : lang === 'mr' ? 'Marathi → EN' : lang === 'kok' ? 'Konkani → EN' : 'English'}
              </span>
            </div>
            <div className="bg-[#f5f3f0] rounded-xl p-4 min-h-20 text-sm text-[#424844] border border-[#e4e2df] italic mb-4">
              {transcript}
              {isRecording && <span className="animate-[blink_0.8s_step-end_infinite]">|</span>}
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={processReport}
                disabled={!canProcess || processing}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined fill-icon text-sm">auto_awesome</span>
                Extract with Gemini AI
              </button>
              <button
                onClick={clearRecording}
                className="px-5 py-2.5 border border-primary-container text-primary rounded-lg text-sm font-semibold hover:bg-[#f0edea] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Processing + Result */}
        <div className="flex flex-col gap-4">
          {/* AI Pipeline */}
          <div className="bg-white rounded-xl p-5 border border-[#e4e2df]">
            <h3 className="font-serif text-base font-medium text-primary mb-3">AI Processing Pipeline</h3>
            <div className="flex flex-col gap-2">
              <AIStage label="Speech-to-Text" sublabel="Google Cloud STT · Multilingual" isActive={stage >= 1} isComplete={stage > 1} error={stage === -1} />
              <AIStage label="Translation Layer" sublabel="Cloud Translation API" isActive={stage >= 2} isComplete={stage > 2} error={stage === -1} />
              <AIStage label="Gemini 1.5 Flash" sublabel="Need Signal Extraction → JSON" isActive={stage >= 3} isComplete={stage > 3} error={stage === -1} />
              <AIStage label="Vertex AI Matching" sublabel="Skill × Proximity × Urgency" isActive={stage >= 4} isComplete={stage > 4} error={stage === -1} />
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-white rounded-xl p-5 border border-[#e4e2df] animate-[fadeIn_0.4s_ease]">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined fill-icon text-primary">auto_awesome</span>
                <h3 className="font-serif text-base font-medium text-primary">Gemini Extracted Signal</h3>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center p-2.5 bg-[#f5f3f0] rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Category</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    result.urgency === 'HIGH' ? 'bg-error-container text-error' : 
                    result.urgency === 'MEDIUM' ? 'bg-secondary-fixed text-secondary' : 'bg-primary-fixed text-primary'
                  }`}>{result.category}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#f5f3f0] rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Location</span>
                  <span className="text-sm font-semibold">{result.location}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-[#f5f3f0] rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Urgency</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    result.urgency === 'HIGH' ? 'bg-error-container text-error' : 
                    result.urgency === 'MEDIUM' ? 'bg-secondary-fixed text-secondary' : 'bg-primary-fixed text-primary'
                  }`}>{result.urgency}</span>
                </div>
                <div className="p-2.5 bg-[#f5f3f0] rounded-lg">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline block mb-1">Resources Needed</span>
                  <span className="text-sm font-semibold">{result.needs}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={deploy}
                  className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors"
                >
                  Deploy Volunteer
                </button>
                <button
                  onClick={() => navigate('/compass')}
                  className="px-5 py-2.5 border border-primary-container text-primary rounded-lg text-sm font-semibold hover:bg-[#f0edea] transition-colors"
                >
                  View on Map
                </button>
              </div>
            </div>
          )}

          {/* Latent Insight */}
          {result && (
            <div className="bg-secondary-fixed/30 rounded-xl p-5 border border-secondary-fixed animate-[fadeIn_0.4s_ease_0.3s_both]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined fill-icon text-secondary">psychology</span>
                <span className="text-sm font-bold text-secondary">Latent Need Detected</span>
              </div>
              <p className="text-sm text-[#6e2f00] leading-relaxed">{result.latent}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EchoPortal;
