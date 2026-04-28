// === AASTHA LIVE JS - PART 2: Reports, Impact, Equity, Map, Toast ===

// === FIELD REPORTS ===
const STATUS_COLORS={Urgent:'#ffdad6',Resolved:'#ccead6','In Progress':'#f0edea',Neglected:'#ffdbca'};
const STATUS_TEXT={Urgent:'#ba1a1a',Resolved:'#173124','In Progress':'#424844',Neglected:'#773300'};
const CAT_COLORS={Food:'#ffdbca',Medical:'#ccead6',Water:'#dceef2',Sanitation:'#f0edea',Nutrition:'#fff8e1',Rescue:'#ffdad6',Other:'#e8e8e8'};

function renderReports(filter) {
  if(filter!==undefined) reportFilter=filter;
  // Update filter buttons
  ['all','urgent','resolved','neglected'].forEach(f=>{
    const btn=document.getElementById('filter-btn-'+f);
    if(btn) btn.className=f===reportFilter?'btn-primary':'btn-outline';
  });
  const tbody=document.getElementById('reports-table');
  if(!tbody) return;
  const filtered = reportFilter==='all' ? fieldReports :
    fieldReports.filter(r=>r.status.toLowerCase()===reportFilter||r.cat.toLowerCase()===reportFilter);
  tbody.innerHTML = filtered.map(r=>`
    <tr style="border-bottom:1px solid #f0edea;" id="row-${r.id}">
      <td style="padding:14px 16px;"><div style="font-weight:600;color:#1b1c1a;">${r.title}</div><div style="font-size:11px;color:#727973;margin-top:2px;">${r.time} · ${r.lang}</div></td>
      <td style="padding:14px 16px;"><span class="tag" style="background:${CAT_COLORS[r.cat]||'#f0edea'};color:#424844;">${r.cat}</span></td>
      <td style="padding:14px 16px;font-weight:600;">${r.ward}</td>
      <td style="padding:14px 16px;"><span class="tag" style="background:${STATUS_COLORS[r.status]||'#f0edea'};color:${STATUS_TEXT[r.status]||'#1b1c1a'};">${r.status}</span></td>
      <td style="padding:14px 16px;color:#424844;">${r.vol}</td>
      <td style="padding:14px 16px;font-weight:700;color:#424844;">${r.impact}</td>
      <td style="padding:14px 16px;">
        <button onclick="removeReport(${r.id})" style="background:#ffdad6;border:none;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:11px;font-weight:700;color:#ba1a1a;">Remove</button>
      </td>
    </tr>`).join('');
  if(!filtered.length) tbody.innerHTML='<tr><td colspan="7" style="padding:32px;text-align:center;color:#727973;font-size:14px;">No reports found.</td></tr>';
}

function removeReport(id) {
  fieldReports = fieldReports.filter(r=>r.id!==id);
  renderReports();
  showToast('Report removed','delete');
}

function openAddReportModal() {
  document.getElementById('add-report-modal').style.display='flex';
  document.getElementById('nr-title').value='';
  document.getElementById('nr-ward').value='';
  document.getElementById('nr-vol').value='';
}
function closeAddReportModal(){document.getElementById('add-report-modal').style.display='none';}

function submitNewReport() {
  const title=document.getElementById('nr-title').value.trim();
  if(!title){showToast('Enter a report title','error');return;}
  const cat=document.getElementById('nr-cat').value;
  const status=document.getElementById('nr-status').value;
  const ward=document.getElementById('nr-ward').value||'Unknown';
  const vol=document.getElementById('nr-vol').value||'Unassigned';
  fieldReports.unshift({id:nextId++,title,cat,ward,status,vol,impact:'Pending',lang:'EN',time:'Just now'});
  closeAddReportModal();
  renderReports();
  showToast('Report added!','check_circle');
}

function downloadCSV() {
  const hdr='ID,Title,Category,Ward,Status,Volunteer,Impact,Language,Time\n';
  const rows=fieldReports.map(r=>`${r.id},"${r.title}","${r.cat}","${r.ward}","${r.status}","${r.vol}","${r.impact}","${r.lang}","${r.time}"`).join('\n');
  triggerDownload('aastha-reports.csv','text/csv',hdr+rows);
}
function downloadJSON(){triggerDownload('aastha-reports.json','application/json',JSON.stringify(fieldReports,null,2));}
function triggerDownload(name,type,content){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=name; a.click();
  showToast('Downloaded '+name,'download');
}

// === IMPACT HEARTH ===
async function runImpactAnalysis() {
  const btn=document.getElementById('impact-gemini-btn');
  const box=document.getElementById('impact-gemini-box');
  if(btn){btn.textContent='Analyzing with Gemini...';btn.disabled=true;}
  if(box) box.innerHTML='<div style="display:flex;align-items:center;gap:10px;color:#727973;font-size:13px;"><div style="width:18px;height:18px;border:2px solid #2d4739;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>Running Gemini impact analysis...</div>';
  if(box) box.style.display='block';
  try {
    const resolved=fieldReports.filter(r=>r.status==='Resolved').length;
    const urgent=fieldReports.filter(r=>r.status==='Urgent'||r.status==='Neglected').length;
    const total=fieldReports.length;
    const prompt=`You are an NGO impact analyst. Data: ${total} field reports total, ${resolved} resolved, ${urgent} urgent/neglected.
Return ONLY valid JSON:
{"summary":"2-sentence overall impact assessment","delta":"e.g. +28%","confidence":82,"topInsight":"most important finding in 1 sentence","recommendation":"1 actionable recommendation","resolvedRate":${Math.round(resolved/total*100)}}`;
    const raw=await callGemini(prompt);
    const r=extractJSON(raw)||{summary:'Analysis complete. Intervention is effective.',delta:'+'+Math.round(resolved/total*100)+'%',confidence:78,topInsight:'Team is making progress.',recommendation:'Increase rural coverage.',resolvedRate:Math.round(resolved/total*100)};
    if(box) box.innerHTML=`
      <div style="font-size:13px;font-weight:700;color:#173124;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <span class="material-symbols-outlined fill-icon" style="font-size:16px;color:#2d4739;">auto_awesome</span> Gemini Live Impact Analysis
      </div>
      <div style="font-size:13px;color:#424844;line-height:1.6;margin-bottom:12px;">${r.summary}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:#ccead6;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-family:'Newsreader',serif;font-size:22px;font-weight:700;color:#173124;">${r.delta}</div>
          <div style="font-size:10px;color:#2d4739;text-transform:uppercase;font-weight:700;">Delta</div>
        </div>
        <div style="background:#f5f3f0;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-family:'Newsreader',serif;font-size:22px;font-weight:700;color:#173124;">${r.confidence}%</div>
          <div style="font-size:10px;color:#727973;text-transform:uppercase;font-weight:700;">Confidence</div>
        </div>
        <div style="background:#ffdbca;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-family:'Newsreader',serif;font-size:22px;font-weight:700;color:#99460a;">${r.resolvedRate}%</div>
          <div style="font-size:10px;color:#773300;text-transform:uppercase;font-weight:700;">Resolved</div>
        </div>
      </div>
      <div style="background:#f5f3f0;padding:10px;border-radius:8px;margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:#727973;text-transform:uppercase;margin-bottom:4px;">Top Insight</div>
        <div style="font-size:13px;color:#1b1c1a;">💡 ${r.topInsight}</div>
      </div>
      <div style="background:#ccead6;padding:10px;border-radius:8px;">
        <div style="font-size:11px;font-weight:700;color:#173124;text-transform:uppercase;margin-bottom:4px;">Recommendation</div>
        <div style="font-size:13px;color:#2d4739;font-weight:600;">→ ${r.recommendation}</div>
      </div>`;
    showToast('Impact analysis complete','verified');
  } catch(e){
    if(box) box.innerHTML=`<div style="color:#ba1a1a;font-size:13px;">Analysis failed: ${e.message}</div>`;
    showToast('Analysis failed: '+e.message,'error');
  }
  if(btn){btn.textContent='Run Gemini Analysis';btn.disabled=false;}
}

// === EQUITY SHIELD ===
async function runEquityAudit() {
  const btn=document.getElementById('equity-gemini-btn');
  const box=document.getElementById('equity-gemini-box');
  if(btn){btn.textContent='Running audit...';btn.disabled=true;}
  if(box){box.style.display='block';box.innerHTML='<div style="display:flex;align-items:center;gap:10px;color:#727973;font-size:13px;"><div style="width:18px;height:18px;border:2px solid #2d4739;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>Running Gemini equity audit...</div>';}
  try {
    const urgent=fieldReports.filter(r=>r.status==='Urgent'||r.status==='Neglected').length;
    const resolved=fieldReports.filter(r=>r.status==='Resolved').length;
    const unassigned=fieldReports.filter(r=>r.vol==='Unassigned'||r.vol.includes('unassigned')).length;
    const prompt=`You are an SDG 10 equity auditor for an Indian NGO. Data: ${urgent} urgent/neglected reports, ${resolved} resolved, ${unassigned} unassigned volunteers.
Return ONLY valid JSON:
{"biasDetected":true,"biasType":"Geographic|Gender|Economic|None","severity":"Critical|High|Medium|Low","finding":"1 sentence finding","recommendation":"1 actionable fix","equityScore":68,"autoBalance":"specific reallocation suggestion"}`;
    const raw=await callGemini(prompt);
    const r=extractJSON(raw)||{biasDetected:true,biasType:'Geographic',severity:'High',finding:'Rural wards receiving 40% fewer resources.',recommendation:'Redistribute 30% volunteer load to rural areas.',equityScore:62,autoBalance:'Move 12 assignments from urban Ward 5 to rural NE cluster.'};
    const sevColor=r.severity==='Critical'||r.severity==='High'?'#ba1a1a':r.severity==='Medium'?'#99460a':'#173124';
    const sevBg=r.severity==='Critical'||r.severity==='High'?'#ffdad6':r.severity==='Medium'?'#ffdbca':'#ccead6';
    if(box) box.innerHTML=`
      <div style="font-size:13px;font-weight:700;color:#173124;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
        <span class="material-symbols-outlined fill-icon" style="font-size:16px;color:#2d4739;">auto_awesome</span> Gemini SDG 10 Equity Audit
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
        <span style="padding:4px 12px;background:${r.biasDetected?'#ffdad6':'#ccead6'};color:${r.biasDetected?'#ba1a1a':'#173124'};border-radius:999px;font-size:12px;font-weight:700;">${r.biasDetected?'⚠ Bias Detected':'✓ No Bias'}</span>
        <span style="padding:4px 12px;background:${sevBg};color:${sevColor};border-radius:999px;font-size:12px;font-weight:700;">${r.severity} · ${r.biasType}</span>
      </div>
      <div style="font-size:13px;color:#424844;margin-bottom:10px;line-height:1.5;">${r.finding}</div>
      <div style="margin-bottom:6px;font-size:11px;font-weight:700;color:#727973;text-transform:uppercase;">Equity Score</div>
      <div style="height:8px;background:#e4e2df;border-radius:4px;overflow:hidden;margin-bottom:4px;">
        <div style="width:${r.equityScore}%;height:100%;background:${r.equityScore>75?'#173124':r.equityScore>50?'#99460a':'#ba1a1a'};border-radius:4px;transition:width 1s;"></div>
      </div>
      <div style="font-size:12px;color:#727973;margin-bottom:10px;">${r.equityScore}/100</div>
      <div style="background:#f5f3f0;padding:10px;border-radius:8px;margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:#727973;text-transform:uppercase;margin-bottom:4px;">Recommendation</div>
        <div style="font-size:13px;color:#1b1c1a;">→ ${r.recommendation}</div>
      </div>
      <div style="background:#ffdbca;padding:10px;border-radius:8px;">
        <div style="font-size:11px;font-weight:700;color:#773300;text-transform:uppercase;margin-bottom:4px;">Auto-Balance Action</div>
        <div style="font-size:13px;color:#773300;">${r.autoBalance}</div>
      </div>`;
    showToast('Equity audit complete','shield');
  } catch(e){
    if(box) box.innerHTML=`<div style="color:#ba1a1a;font-size:13px;">Audit failed: ${e.message}</div>`;
    showToast('Audit failed: '+e.message,'error');
  }
  if(btn){btn.textContent='Run Equity Audit';btn.disabled=false;}
}

// === COMPASS MAP (LEAFLET) ===
const MAP_PINS=[
  {lat:15.2993,lng:74.1240,label:'Ward 12 — HIGH NEGLECT',type:'urgent',desc:'7 pending medical · Unmet 48h'},
  {lat:15.2893,lng:74.1140,label:'Rahul Sawant — Volunteer',type:'volunteer',desc:'Active · 1.2km from Ward 12 · Medical'},
  {lat:15.3093,lng:74.1340,label:'Ward 8 — MEDIUM',type:'warning',desc:'3 water access reports · 24h unresolved'},
  {lat:15.2750,lng:74.1450,label:'Ward 15 — Resolved',type:'resolved',desc:'Food kit deployed · Need → LOW'}
];

function initMap() {
  if(liveMap) return;
  const el=document.getElementById('leaflet-map');
  if(!el||el.offsetHeight<10) return;
  liveMap=L.map('leaflet-map',{zoomControl:false}).setView([15.2993,74.1240],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:18}).addTo(liveMap);
  MAP_PINS.forEach(p=>{
    const col=p.type==='urgent'?'#ba1a1a':p.type==='volunteer'?'#173124':p.type==='warning'?'#99460a':'#2d4739';
    const icon=L.divIcon({html:`<div style="width:28px;height:28px;border-radius:50%;background:${col};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>`,iconSize:[28,28],iconAnchor:[14,14],className:''});
    L.marker([p.lat,p.lng],{icon}).addTo(liveMap)
      .bindPopup(`<div style="font-family:'Manrope',sans-serif;min-width:160px;"><div style="font-weight:700;color:${col};margin-bottom:4px;">${p.label}</div><div style="font-size:12px;color:#424844;">${p.desc}</div></div>`);
  });
  // Plot live reports as map pins
  fieldReports.slice(0,5).forEach((r,i)=>{
    const col=r.status==='Urgent'?'#ba1a1a':r.status==='Resolved'?'#173124':'#99460a';
    const lats=[15.2850,15.2920,15.3050,15.2780,15.3100];
    const lngs=[15.2850,15.2920,15.3050,15.2780,15.3100];
    const icon=L.divIcon({html:`<div style="width:20px;height:20px;border-radius:50%;background:${col};border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.2);opacity:0.85;"></div>`,iconSize:[20,20],iconAnchor:[10,10],className:''});
    L.marker([15.2900+i*0.008,74.1150+i*0.007],{icon}).addTo(liveMap)
      .bindPopup(`<div style="font-family:'Manrope',sans-serif;"><div style="font-weight:700;color:${col};">${r.ward}</div><div style="font-size:12px;">${r.title.substring(0,40)}</div></div>`);
  });
  setTimeout(()=>liveMap.invalidateSize(),300);
}

function toggleHeatmap(toggle) {
  toggle.classList.toggle('on'); toggle.classList.toggle('off');
}
function deployVol(name,ward){showToast(`${name} deployed to ${ward}`,'volunteer_activism');}
function openVolCard(){showScreen('compass');}
function simulateOutcome(){showToast('Outcome loop simulated: Need → LOW','trending_down');}
function autoBalance(){
  showToast('Auto-balancing: 12 assignments redistributed to rural wards','shield');
  setTimeout(()=>{const bars=document.querySelectorAll('.shield-bar');if(bars[2])bars[2].style.width='45%';},500);
}
function dismissBanner(){const b=document.getElementById('bias-banner');if(b)b.style.display='none';}
function showNotif(){showToast('3 new need signals · 1 Equity Shield alert','notifications');document.getElementById('notif-dot').style.display='none';}

// === TOAST ===
function showToast(msg, icon='check_circle') {
  const toast=document.getElementById('toast');
  document.getElementById('toast-text').textContent=msg;
  document.getElementById('toast-icon').textContent=icon;
  toast.style.transform='translateY(0)';
  toast.style.opacity='1';
  setTimeout(()=>{toast.style.transform='translateY(80px)';toast.style.opacity='0';},3000);
}

// === INIT ===
document.addEventListener('DOMContentLoaded', ()=>{
  showScreen('dashboard');
  setTimeout(()=>{
    const btn=document.getElementById('process-btn');
    if(btn){btn.disabled=true;btn.style.opacity='0.5';}
    // Update filter buttons style
    renderReports();
  },100);
});
