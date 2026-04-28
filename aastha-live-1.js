// === AASTHA LIVE JS - PART 1 ===
const GEMINI_KEY = 'AIzaSyAzCkiMg-jeV3ae0Gt1VDcOOH_oioWSVTU';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
const LANG_CODES = {hi:'hi-IN',mr:'mr-IN',kok:'hi-IN',en:'en-IN'};

let currentScreen='dashboard', isRecording=false, recognition=null, selectedLang='hi';
let aiStageTimeout=[], currentTranscript='', liveMap=null, nextId=6, reportFilter='all';

let fieldReports = [
  {id:1,title:'खाद्यान्न संकट — 45 families',cat:'Food',ward:'Ward 7',status:'Urgent',vol:'Unassigned',impact:'HIGH → ?',lang:'Hindi',time:'2 min ago'},
  {id:2,title:'Medical Kit Delivery Confirmed',cat:'Medical',ward:'Ward 12',status:'Resolved',vol:'Rahul Sawant',impact:'HIGH → LOW ✓',lang:'EN',time:'18 min ago'},
  {id:3,title:'पाणी टंचाई — Industrial Zone',cat:'Water',ward:'Verna',status:'Neglected',vol:'36h unassigned',impact:'HIGH → HIGH',lang:'Marathi',time:'1h ago'},
  {id:4,title:'Sanitation Drive — Ward 3',cat:'Sanitation',ward:'Ward 3',status:'In Progress',vol:'Anita Naik',impact:'MED → LOW ↓',lang:'EN',time:'3h ago'},
  {id:5,title:'Nutrition Survey — Rural Cluster',cat:'Nutrition',ward:'Rural NE',status:'Neglected',vol:'Unassigned',impact:'HIGH → ?',lang:'EN',time:'Yesterday'}
];

// === NAVIGATION ===
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const screen=document.getElementById('screen-'+id);
  const nav=document.getElementById('nav-'+id);
  if(screen) screen.classList.add('active');
  if(nav) nav.classList.add('active');
  currentScreen=id;
  const titles={dashboard:'Dashboard',echo:'Echo Portal',compass:'Compass Map',impact:'Impact Hearth',equity:'Equity Shield',reports:'Field Reports'};
  document.getElementById('header-title').textContent=titles[id]||id;
  const sc=document.getElementById('screens-container');
  if(id==='compass'){sc.style.overflow='hidden';if(screen)screen.style.height='calc(100vh - 60px)';setTimeout(initMap,200);}
  else{sc.style.overflow='auto';if(screen)screen.style.height='';}
  if(id==='reports') renderReports();
  window.scrollTo(0,0);
}

// === GEMINI HELPER ===
async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.4,maxOutputTokens:1024}})
  });
  if(!res.ok) throw new Error('Gemini HTTP '+res.status);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

function extractJSON(text) {
  try {
    const m = text.match(/```json([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    return JSON.parse(m ? m[1].trim() : text.trim());
  } catch { return null; }
}

// === ECHO / RECORDING ===
function setLang(lang) {
  selectedLang = lang;
  ['hi','mr','kok','en'].forEach(l => {
    const btn = document.getElementById('lang-'+l);
    if(btn){btn.className=l===lang?'btn-primary':'btn-outline';btn.style.padding='6px 14px';btn.style.fontSize='12px';}
  });
  const tagMap={hi:'Hindi → EN',mr:'Marathi → EN',kok:'Konkani → EN',en:'English'};
  document.getElementById('transcript-lang-tag').textContent=tagMap[lang];
  if(recognition){recognition.stop();recognition=null;}
}

function toggleRecording(){if(!isRecording)startRecording();else stopRecording();}

function startRecording() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRec){
    showToast('Speech API not supported — use Chrome','error');
    return;
  }
  recognition = new SpeechRec();
  recognition.lang = LANG_CODES[selectedLang]||'hi-IN';
  recognition.continuous = true;
  recognition.interimResults = true;
  isRecording = true; currentTranscript = '';
  document.getElementById('record-btn').classList.add('recording');
  document.getElementById('record-icon').textContent='stop';
  document.getElementById('waveform-container').classList.remove('waveform-stopped');
  document.getElementById('record-status').textContent='🎙 Listening — speak in your language...';
  document.getElementById('transcript-box').textContent='';
  document.getElementById('transcript-box').classList.add('cursor-blink');
  document.getElementById('result-card').style.display='none';
  document.getElementById('latent-card').style.display='none';
  recognition.onresult = e => {
    let interim='', final='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal) final += e.results[i][0].transcript+' ';
      else interim += e.results[i][0].transcript;
    }
    if(final) currentTranscript += final;
    document.getElementById('transcript-box').textContent = (currentTranscript+interim)||'Listening...';
  };
  recognition.onerror = err => {
    if(err.error==='no-speech') return;
    showToast('Mic error: '+err.error,'error'); stopRecording();
  };
  recognition.onend = () => { if(isRecording) recognition.start(); };
  recognition.start();
}

function stopRecording() {
  isRecording = false;
  if(recognition){recognition.onend=null;recognition.stop();recognition=null;}
  document.getElementById('record-btn').classList.remove('recording');
  document.getElementById('record-icon').textContent='mic';
  document.getElementById('waveform-container').classList.add('waveform-stopped');
  document.getElementById('record-status').textContent='Recording complete — ready to process';
  document.getElementById('transcript-box').classList.remove('cursor-blink');
  const btn=document.getElementById('process-btn');
  if(currentTranscript.trim()){btn.disabled=false;btn.style.opacity='1';}
}

function clearRecording() {
  stopRecording(); currentTranscript='';
  document.getElementById('transcript-box').textContent='Tap the microphone above to begin recording your field report...';
  document.getElementById('record-status').textContent='Tap to Record';
  document.getElementById('result-card').style.display='none';
  document.getElementById('latent-card').style.display='none';
  document.getElementById('process-btn').disabled=true;
  document.getElementById('process-btn').style.opacity='0.5';
  resetAIStages();
}

function resetAIStages() {
  aiStageTimeout.forEach(t=>clearTimeout(t)); aiStageTimeout=[];
  [1,2,3,4].forEach(i=>{
    const s=document.getElementById('stage-'+i), ic=document.getElementById('stage-'+i+'-icon');
    if(s){s.classList.remove('visible');s.style.background='#f5f3f0';}
    if(ic){ic.textContent='radio_button_unchecked';ic.style.color='#727973';}
    if(s&&s.querySelector('.dot')) s.querySelector('.dot').style.background='#727973';
  });
}

async function processReport() {
  const transcript = currentTranscript.trim();
  if(!transcript){showToast('Please record audio first','error');return;}
  document.getElementById('process-btn').disabled=true;
  document.getElementById('result-card').style.display='none';
  document.getElementById('latent-card').style.display='none';
  resetAIStages();
  const delays=[300,900,1600,2400];
  delays.forEach((d,i)=>{
    const t=setTimeout(()=>{
      const s=document.getElementById('stage-'+(i+1)), ic=document.getElementById('stage-'+(i+1)+'-icon');
      if(s){s.classList.add('visible');s.style.background='#ccead6';}
      if(ic){ic.textContent='check_circle';ic.style.color='#173124';}
      if(s&&s.querySelector('.dot')) s.querySelector('.dot').style.background=['#2d4739','#2d4739','#173124','#173124'][i];
    }, d);
    aiStageTimeout.push(t);
  });

  try {
    let result;
    try {
      // 1. Try Local Backend (Smarter extraction + Secure)
      const backendRes = await fetch('http://localhost:8000/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_url: 'data:audio/wav;base64,UklGR...', // Dummy
          language_code: LANG_CODES[selectedLang] || 'hi-IN',
          user_id: 'web-user',
          transcription: transcript
        })
      });
      
      if (backendRes.ok) {
        const data = await backendRes.json();
        const need = data.extracted_needs[0];
        result = {
          category: need.need_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          location: need.location || 'Field Location',
          urgency: need.urgency.toUpperCase(),
          families: need.people_affected || 0,
          needs: need.resources_needed.join(', '),
          latent: data.insights.latent_patterns[0],
          confidence: need.confidence_score
        };
        console.log('Backend AI Result:', result);
      } else {
        throw new Error('Backend failed');
      }
    } catch (backendErr) {
      console.warn('Backend unavailable, falling back to direct Gemini:', backendErr);
      // 2. Fallback to Direct Gemini (Mock/Basic)
      const prompt = `Analyze this voice report and extract need signals.
      Transcript: "${transcript}"
      Return valid JSON: {"category":"Food Shortage|Water Access|Medical Emergency|Sanitation|Rescue|Other","location":"location","urgency":"HIGH|MEDIUM|LOW","families":0,"needs":"resources","latent":"insight","confidence":0.8}`;
      const raw = await callGemini(prompt);
      result = extractJSON(raw) || {category:'General Need',location:'Field Location',urgency:'HIGH',families:0,needs:'Assistance needed',latent:'⚠ Manual review recommended.',confidence:0.7};
    }
    
    setTimeout(()=>showExtractedResult(result, transcript), 2800);
  } catch(e) {
    showToast('AI Error: '+e.message,'error');
    document.getElementById('process-btn').disabled=false;
    resetAIStages();
  }
}

function showExtractedResult(result, transcript) {
  const uc = (result.urgency||'HIGH').toUpperCase();
  const isCrit = uc==='CRITICAL'||uc==='HIGH';
  const urgencyColor = isCrit?'#ba1a1a':uc==='MEDIUM'?'#99460a':'#173124';
  const urgencyBg = isCrit?'#ffdad6':uc==='MEDIUM'?'#ffdbca':'#ccead6';
  document.getElementById('result-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;">Category</span>
      <span class="tag" style="background:${urgencyBg};color:${urgencyColor};">${result.category}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;">Location</span>
      <span style="font-size:14px;font-weight:700;color:#1b1c1a;">${result.location}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;">Urgency</span>
      <span style="padding:3px 10px;border-radius:999px;background:${urgencyBg};color:${urgencyColor};font-size:12px;font-weight:700;">${uc}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;">Affected</span>
      <span style="font-size:14px;font-weight:700;color:#1b1c1a;">${result.families||'Unknown'} families/individuals</span>
    </div>
    <div style="padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;margin-bottom:4px;">Resources Needed</div>
      <div style="font-size:14px;font-weight:600;color:#1b1c1a;">${result.needs}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f5f3f0;border-radius:8px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#727973;">AI Confidence</span>
      <span style="font-size:14px;font-weight:700;color:#2d4739;">${Math.round((result.confidence||0.8)*100)}%</span>
    </div>`;
  document.getElementById('result-card').style.display='block';
  document.getElementById('result-card').classList.add('fade-in');
  setTimeout(()=>{
    document.getElementById('latent-text').textContent=result.latent;
    document.getElementById('latent-card').style.display='block';
    document.getElementById('latent-card').classList.add('fade-in');
  },400);
  // Add report to field reports list
  fieldReports.unshift({id:nextId++,title:transcript.substring(0,60)+(transcript.length>60?'...':''),cat:result.category,ward:result.location,status:isCrit?'Urgent':'In Progress',vol:'Unassigned',impact:uc+' → ?',lang:selectedLang.toUpperCase(),time:'Just now'});
  showToast('Gemini AI extracted need signal!','auto_awesome');
  document.getElementById('notif-dot').style.display='none';
}

function deployFromEcho(){showToast('Deploying volunteer to '+extractedResults_loc,'volunteer_activism');setTimeout(()=>showScreen('compass'),1200);}
let extractedResults_loc='Field Location';
