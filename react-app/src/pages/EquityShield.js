import React, { useState } from 'react';

const VolunteerContactCard = ({ name, role, phone, match, initials, bg }) => (
  <div className="bg-white rounded-2xl p-4 border border-[#e4e2df] shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bg}`}>
        {initials}
      </div>
      <div>
        <div className="text-xs font-bold text-primary">{name}</div>
        <div className="text-[9px] text-outline uppercase tracking-widest">{role}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <a href={`tel:${phone}`} className="w-8 h-8 rounded-full bg-[#fcfbf8] border border-[#e4e2df] flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-all">
        <span className="material-symbols-outlined text-xs">call</span>
      </a>
      <a href={`https://wa.me/${phone.replace('+', '')}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#fcfbf8] border border-[#e4e2df] flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all">
        <span className="material-symbols-outlined text-xs">chat</span>
      </a>
    </div>
  </div>
);

const ResearchCard = ({ ward, period, insight }) => (
  <div className="bg-[#fcfbf8] p-4 rounded-xl border border-[#f0edea] group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-xs font-bold text-primary">{ward}</h4>
      <span className="text-[8px] font-bold text-outline uppercase tracking-widest">{period}</span>
    </div>
    <p className="text-[10px] text-outline leading-relaxed italic mb-4">"{insight}"</p>
    <button className="w-full py-2 bg-white border border-[#e4e2df] text-[9px] font-bold uppercase tracking-widest text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-xs">explore</span>
      Explore Archive
    </button>
  </div>
);

const EquityShield = ({ showToast }) => {
  const [ruralAlloc, setRuralAlloc] = useState(14);
  const [isBalanced, setIsBalanced] = useState(false);

  const handleAutoBalance = () => {
    setIsBalanced(true);
    setRuralAlloc(34);
    showToast('Equity Balanced: Rural allocation optimized to 34%', 'verified');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] p-8">
      {/* Header */}
      <div className="mb-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">biometric_setup</span>
          </div>
          <h1 className="font-serif text-4xl font-medium text-primary">Equity & Impact Lab</h1>
        </div>
        <p className="text-sm text-outline leading-relaxed">
          The forensic heart of Aastha. Combining real-time **SDG 10 Bias Shielding** with our **Geospatial History Archive**. 
          Verify fairness, mobilize on-demand elite volunteers, and access longitudinal research data in one unified workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Equity & Bias (Top) + Case Studies (Bottom) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Bias Detection Section */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-serif text-xl font-medium text-primary">Geographic Fairness Scanner</h3>
                <p className="text-[9px] font-bold text-outline uppercase tracking-widest mt-1">Real-time resource parity monitoring</p>
              </div>
              <button 
                onClick={handleAutoBalance}
                disabled={isBalanced}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isBalanced ? 'bg-[#eaf3de] text-[#4a6741]' : 'bg-primary text-white hover:bg-primary-container'
                }`}
              >
                {isBalanced ? 'Bias Neutralized' : 'Execute Auto-Balance'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Urban Core', percent: 58, color: '#2d4739' },
                { label: 'Peri-Urban', percent: 28, color: '#727973' },
                { label: 'Rural Wards', percent: isBalanced ? 34 : 14, color: '#99460a', alert: !isBalanced },
              ].map(item => (
                <div key={item.label} className="bg-[#fcfbf8] rounded-2xl p-5 border border-[#f0edea]">
                   <div className="text-[9px] font-bold text-outline uppercase tracking-widest mb-2">{item.label}</div>
                   <div className="text-3xl font-medium mb-1" style={{ color: item.color }}>{item.percent}%</div>
                   <div className="h-1 bg-white rounded-full overflow-hidden">
                     <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                   </div>
                   {item.alert && (
                     <div className="mt-3 flex items-center gap-1 text-[8px] font-bold text-error uppercase animate-pulse">
                        <span className="material-symbols-outlined text-[10px]">warning</span> Under-Served
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>

          {/* Research Archive Section (Combined from Lab) */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-medium text-primary">Geospatial History Archive</h3>
              <div className="text-[9px] font-bold text-outline uppercase tracking-widest">Longitudinal Insights</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResearchCard 
                ward="Sector A-12 (Verna)" 
                period="2025-26" 
                insight="Water scarcity correlated with infrastructure degradation. Intervention delta: +42% resiliency."
              />
              <ResearchCard 
                ward="Ward 7 (Panjim)" 
                period="2024-25" 
                insight="Malnutrition clusters resolved via targeted ASHA voice reports and supply-chain optimization."
              />
              <ResearchCard 
                ward="Ward 5 (Margao)" 
                period="2025-26" 
                insight="Medical supply gaps corrected by shifting to AI-predicted need forecasting using Gemini engine."
              />
              <ResearchCard 
                ward="Ward 12 (South Node)" 
                period="2025-26" 
                insight="Sustained growth state achieved. Community autonomy score improved by 15% via decentralized units."
              />
            </div>
          </div>
        </div>

        {/* Right Column: On-Demand Volunteers + Audit Log */}
        <div className="flex flex-col gap-8">
          
          {/* On-Demand Network */}
          <div className="bg-[#f0edea]/50 rounded-[2rem] p-6 border border-[#e4e2df] shadow-sm">
            <h3 className="font-serif text-lg font-medium text-primary mb-1">On-Demand Network</h3>
            <p className="text-[9px] text-outline uppercase tracking-widest mb-6">High-Performance Responders</p>
            
            <div className="flex flex-col gap-3">
              <VolunteerContactCard name="Rahul Sawant" role="Logistics Lead" phone="+919999999999" initials="RS" bg="bg-primary text-white" />
              <VolunteerContactCard name="Priya Desai" role="Medical Unit" phone="+918888888888" initials="PD" bg="bg-primary-fixed text-primary" />
              <VolunteerContactCard name="Anita Naik" role="Crisis Comm" phone="+917777777777" initials="AN" bg="bg-secondary-fixed text-secondary" />
            </div>
          </div>

          {/* Forensic Audit Log (Combined) */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
            <h3 className="font-serif text-lg font-medium text-primary mb-6">Forensic Impact Log</h3>
            <div className="flex flex-col gap-4">
               {[
                 { issue: 'Water Scarcity', ward: 'Ward 12', time: '12h' },
                 { issue: 'Medical Gap', ward: 'Ward 5', time: '4h' },
                 { issue: 'Sanitation Alert', ward: 'Ward 3', time: '48h' },
               ].map((log, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 bg-[#fcfbf8] rounded-xl border border-[#f0edea]">
                   <span className="material-symbols-outlined text-primary text-sm">verified</span>
                   <div className="flex-1">
                      <div className="text-[10px] font-bold text-primary">{log.issue} Resolved</div>
                      <div className="text-[8px] text-outline">Sector {log.ward} · Resolved in {log.time}</div>
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 p-4 bg-primary rounded-2xl text-white text-center">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] mb-2 opacity-70">Research Access</div>
              <p className="text-[10px] leading-relaxed mb-4">Export raw historical datasets for academic audit.</p>
              <button className="w-full py-2 bg-white text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest">
                Export Ledger
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EquityShield;
