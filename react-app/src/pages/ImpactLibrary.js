import React, { useState } from 'react';

const ResearchCard = ({ ward, period, intensity, insight, signals, resolved }) => (
  <div className="bg-white rounded-2xl p-6 border border-[#e4e2df] shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-serif text-lg font-medium text-primary">{ward}</h3>
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{period}</p>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-primary">{intensity}%</div>
        <div className="text-[8px] font-bold text-outline uppercase tracking-tighter">Signal Density</div>
      </div>
    </div>
    
    <div className="p-4 bg-[#fcfbf8] rounded-xl border border-[#f0edea] mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-sm text-primary">psychology</span>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Trend Synthesis</span>
      </div>
      <p className="text-xs text-outline italic leading-relaxed">
        "{insight}"
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-[#fcfbf8] p-3 rounded-xl border border-[#f0edea] text-center">
        <div className="text-sm font-bold text-primary">{signals}</div>
        <div className="text-[8px] text-outline uppercase tracking-widest">Total Signals</div>
      </div>
      <div className="bg-[#fcfbf8] p-3 rounded-xl border border-[#f0edea] text-center">
        <div className="text-sm font-bold text-[#4a6741]">{resolved}</div>
        <div className="text-[8px] text-outline uppercase tracking-widest">Resolved</div>
      </div>
    </div>

    <button className="w-full py-2.5 border border-primary text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-sm">folder_open</span>
      Access Full Dataset
    </button>
  </div>
);

const ImpactLibrary = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[#fcfbf8] p-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
               <span className="material-symbols-outlined text-sm">local_library</span>
             </div>
             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">The Impact Lab</span>
          </div>
          <h1 className="font-serif text-4xl font-medium text-primary mb-3">Geospatial History Archive</h1>
          <p className="text-sm text-outline leading-relaxed">
            A comprehensive research library for professional builders, urban planners, and humanitarian researchers. 
            Access immutable historical data, AI trend synthesis, and longitudinal community outcomes.
          </p>
        </div>
        
        <div className="w-80 relative">
          <input 
            type="text" 
            placeholder="Search ward or location..." 
            className="w-full bg-white border border-[#e4e2df] rounded-full py-3 px-12 text-sm focus:border-primary transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-3 text-outline text-lg">search</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Case Studies */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h2 className="text-xs font-bold text-outline uppercase tracking-[0.2em] flex items-center gap-3">
             <span className="w-8 h-[1px] bg-outline/30"></span>
             Longitudinal Case Studies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResearchCard 
              ward="Sector A-12 (Verna)" 
              period="Q1 2025 - Q2 2026" 
              intensity={84}
              signals={1240}
              resolved={1082}
              insight="Water scarcity patterns showed strong correlation with infrastructure degradation in the northeast quadrant. Intervention delta: +42% resiliency."
            />
            <ResearchCard 
              ward="Ward 7 (Panjim)" 
              period="Q4 2024 - Q1 2026" 
              intensity={62}
              signals={892}
              resolved={714}
              insight="Malnutrition clusters in informal settlements were resolved via targeted ASHA voice reports and direct food supply-chain optimization."
            />
            <ResearchCard 
              ward="Ward 5 (Margao)" 
              period="Q2 2025 - Q2 2026" 
              intensity={41}
              signals={456}
              resolved={440}
              insight="Medical supply gaps were corrected by shifting from reactive dispatch to AI-predicted need forecasting using the Gemini Sentinel engine."
            />
            <ResearchCard 
              ward="Ward 12 (South Node)" 
              period="Q3 2025 - Q2 2026" 
              intensity={28}
              signals={312}
              resolved={308}
              insight="Sustained growth state achieved. Community autonomy score improved by 15% following the decentralization of volunteer units."
            />
          </div>
        </div>

        {/* Right Column: Library Tools */}
        <div className="flex flex-col gap-8">
          
          {/* Research Protocols Card */}
          <div className="bg-[#f0edea]/50 rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
            <h3 className="font-serif text-xl font-medium text-primary mb-6">Library Protocols</h3>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary border border-[#e4e2df]">
                  <span className="material-symbols-outlined text-sm">history_edu</span>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Causal Inference</div>
                  <p className="text-[10px] text-outline leading-normal">Access methodology for how Aastha attributes community change to specific interventions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary border border-[#e4e2df]">
                  <span className="material-symbols-outlined text-sm">database</span>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Raw Ledger Export</div>
                  <p className="text-[10px] text-outline leading-normal">Full Firestore history logs available for academic or governmental audit in CSV/JSON format.</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-10 py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-primary-container transition-all">
              Request Academic Access
            </button>
          </div>

          {/* AI Narrative Generator */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
             <div className="flex items-center gap-2 mb-4">
               <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
               <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Gemini Researcher</span>
             </div>
             <h3 className="font-serif text-lg font-medium text-primary mb-3">Generate Sector Report</h3>
             <p className="text-[11px] text-outline leading-relaxed mb-6">
               Select a sector to generate a forensic AI narrative summarizing past events and predicted growth trajectories.
             </p>
             <select className="w-full bg-[#fcfbf8] border border-[#f0edea] rounded-xl p-3 text-xs mb-4">
               <option>Select Sector...</option>
               <option>Sector A-12</option>
               <option>South Margao Ward</option>
               <option>Panjim North Cluster</option>
             </select>
             <button className="w-full py-2.5 bg-[#f0edea] text-primary rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#e4e2df] transition-all">
               Generate Narrative
             </button>
          </div>

          {/* Verification Protocol */}
          <div className="bg-primary rounded-[2rem] p-8 text-white">
            <h3 className="font-serif text-xl font-medium mb-3">Verification Protocol</h3>
            <p className="text-[11px] opacity-70 leading-relaxed mb-6">
              All records in the Impact Library are verified via multi-modal ground truth (Photo + Audio + Follow-up) and are cryptographically hashed.
            </p>
            <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">verified</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Trust Engine Active</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImpactLibrary;
