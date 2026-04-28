import React from 'react';

const ImpactHearth = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf8] p-8 text-[#1a1c18]">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl font-medium text-primary mb-3">Impact Analytics Dashboard</h1>
        <p className="text-sm text-outline leading-relaxed">
          Verifying humanitarian outcomes through causal inference and on-chain transparency. 
          A granular view of how Aastha interventions change the trajectory of vulnerable communities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Causal Impact Delta */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-xl font-medium text-primary">Causal Impact Delta</h3>
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1">Community Need Intensity vs. Intervention Milestones</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#eaf3de] text-[#4a6741] text-[9px] font-bold rounded-full border border-[#4a6741]/20 tracking-widest uppercase">Verified</span>
                <span className="material-symbols-outlined text-outline text-lg">more_vert</span>
              </div>
            </div>

            {/* Chart Simulation (SVG Spline) */}
            <div className="h-[280px] w-full relative mb-10">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 280">
                {/* Grid Lines */}
                <line x1="0" y1="280" x2="800" y2="280" stroke="#f0edea" strokeWidth="1" />
                
                {/* Counterfactual Path (Dashed) */}
                <path 
                  d="M0 200 Q 200 180, 400 220 T 800 160" 
                  fill="none" 
                  stroke="#727973" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                
                {/* Intervention Path (Solid Green) */}
                <path 
                  d="M0 200 Q 200 180, 400 240 T 800 120" 
                  fill="none" 
                  stroke="#173124" 
                  strokeWidth="3" 
                />

                {/* Legend */}
                <foreignObject x="0" y="240" width="800" height="40">
                  <div className="flex items-center gap-8 mt-10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#173124]"></div>
                      <span className="text-[9px] font-bold uppercase text-primary tracking-widest">Aastha Intervention Path</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-[#727973] border-dashed"></div>
                      <span className="text-[9px] font-bold uppercase text-outline tracking-widest">Counterfactual Path</span>
                    </div>
                  </div>
                </foreignObject>
              </svg>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#f0edea]">
              <div>
                <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total Population</div>
                <div className="font-serif text-2xl font-medium text-primary">142,000</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Intervention Spend</div>
                <div className="font-serif text-2xl font-medium text-primary">$2.1M</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Cost Per Outcome</div>
                <div className="font-serif text-2xl font-medium text-primary">$14.80</div>
              </div>
            </div>
          </div>

          {/* Outcome Proof Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">verified</span>
              <h3 className="font-serif text-xl font-medium">Outcome Proof: Sector A-12</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-[#e4e2df] shadow-sm">
                <div className="h-48 bg-stone-200 relative overflow-hidden flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1547517023-7ca0c162f816?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Systemic Scarcity" />
                   <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur-md text-white text-[8px] font-bold rounded-md tracking-widest uppercase">Baseline State</div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-lg font-medium mb-2">Systemic Water Scarcity</h4>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Daily retrieval time averaged 4.2 hours per household. Baseline nutrient intake was 15% below regional health standards.
                  </p>
                  <div className="flex items-center gap-2 text-error">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Critical Insecurity Zone</span>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-[#e4e2df] shadow-sm">
                <div className="h-48 bg-stone-200 relative overflow-hidden flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Clean Resource Hub" />
                   <div className="absolute top-4 left-4 px-2 py-1 bg-[#eaf3de] text-[#4a6741] text-[8px] font-bold rounded-md tracking-widest uppercase">Verified Outcome</div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-lg font-medium mb-2">Clean Resource Hub</h4>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Access time reduced to 12 minutes. Automated AI summary: Community resilience improved by 40% through infrastructure autonomy.
                  </p>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Sustained Growth State</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SDG Hub & Audit Log */}
        <div className="flex flex-col gap-8">
          
          {/* SDG Alignment Hub */}
          <div className="bg-[#f0edea]/50 rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
            <h3 className="font-serif text-xl font-medium text-primary mb-6">SDG Alignment Hub</h3>
            <div className="flex flex-col gap-6">
              {[
                { id: 3, title: 'Good Health & Well-being', progress: 82, color: '#2d4739' },
                { id: 10, title: 'Reduced Inequalities', progress: 64, color: '#ba1a1a' },
                { id: 17, title: 'Partnerships for the Goals', progress: 51, color: '#173124' },
              ].map(sdg => (
                <div key={sdg.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: sdg.color }}>
                    {sdg.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{sdg.title}</span>
                      <span className="text-[10px] font-bold">{sdg.progress}%</span>
                    </div>
                    <div className="h-1 bg-white rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${sdg.progress}%`, backgroundColor: sdg.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white p-5 rounded-2xl border border-[#e4e2df]">
               <div className="text-[8px] font-bold text-outline uppercase tracking-[0.2em] mb-2">Portfolio Resilience</div>
               <p className="text-[11px] italic text-primary leading-relaxed">
                 "Projected 5-year sustainability rating based on current stakeholder commitment levels."
               </p>
               <div className="mt-4 flex justify-end">
                 <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
                   <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e2df] shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-serif text-xl font-medium text-primary">Audit Log</h3>
               <div className="flex items-center gap-1 text-[#4a6741] text-[9px] font-bold uppercase tracking-widest">
                 <span className="material-symbols-outlined text-sm">upload</span>
                 Export Ledger
               </div>
             </div>
             
             <div className="flex flex-col gap-4">
               {[
                 { title: 'Block #482,109 Confirmed', desc: 'Resource disbursement: Medical Supplies (Lot #4)', hash: '0x3f2...7c28', status: 'success' },
                 { title: 'Field Audit: Q3 Verification', desc: 'Auditor: Global Humanitarian Unit', status: 'verified' },
                 { title: 'Payment: Education Grant', desc: 'Released to Central District Schools', hash: '0x1a4...bb57', status: 'neutral' },
                 { title: 'Smart Contract: Auto-Trigger', desc: 'Milestone 8 Reach: Multi-Agency Response', hash: '0x082...2cc7', status: 'success' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 items-start p-3 bg-[#fcfbf8] rounded-2xl border border-[#f0edea]">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                     log.status === 'success' ? 'bg-[#eaf3de] text-[#4a6741]' : 
                     log.status === 'verified' ? 'bg-primary-fixed text-primary' : 'bg-white text-outline'
                   }`}>
                     <span className="material-symbols-outlined text-sm">{
                       log.status === 'success' ? 'check_circle' : 
                       log.status === 'verified' ? 'verified' : 'receipt_long'
                     }</span>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-primary">{log.title}</span>
                        {log.hash && <span className="text-[8px] text-outline font-mono">{log.hash}</span>}
                     </div>
                     <p className="text-[9px] text-outline mt-0.5">{log.desc}</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-6 p-4 bg-[#f0edea]/30 rounded-2xl border border-dashed border-outline/20">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-outline text-sm">info</span>
                  <p className="text-[9px] text-outline leading-normal">
                    Transparency Protocol: All entries are hashed and immutable. For deep audit access, contact the Compliance Portal.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactHearth;
