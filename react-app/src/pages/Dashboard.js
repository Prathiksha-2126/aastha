import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, trend, isNegative, color }) => (
  <div className="bg-white rounded-xl p-5 border border-[#e4e2df] hover:shadow-md transition-shadow">
    <div className="text-xs font-bold uppercase tracking-wider text-outline mb-2">{title}</div>
    <div className={`font-serif text-3xl font-semibold ${color}`}>{value}</div>
    <div className={`text-xs font-bold mt-1 ${isNegative ? 'text-error' : 'text-primary'}`}>{trend}</div>
  </div>
);

const FeatureCard = ({ icon, title, description, cta, bg, border, iconColor, onClick }) => (
  <div 
    onClick={onClick}
    className={`rounded-2xl p-7 flex flex-col gap-3 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${bg} ${border ? `border ${border}` : ''}`}
  >
    <span className={`material-symbols-outlined fill-icon text-3xl ${iconColor}`}>{icon}</span>
    <div className="font-serif text-xl font-semibold">{title}</div>
    <div className={`text-sm ${bg.includes('primary') ? 'opacity-80' : 'text-[#424844]'} leading-relaxed`}>{description}</div>
    <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${cta.color}`}>{cta.text} →</div>
  </div>
);

const ActivityItem = ({ icon, iconBg, title, subtitle, tag, tagColor }) => (
  <div className="flex items-center gap-3 p-3 bg-[#f5f3f0] rounded-xl">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <span className={`material-symbols-outlined fill-icon text-lg ${iconBg.includes('white') ? 'text-white' : iconBg.includes('primary') ? 'text-primary' : 'text-secondary'}`}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-semibold text-on-surface truncate">{title}</div>
      <div className="text-xs text-outline truncate">{subtitle}</div>
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
  </div>
);

const VolunteerItem = ({ initials, bg, name, match }) => (
  <div className="flex items-center gap-2.5">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${bg}`}>{initials}</div>
    <div className="flex-1">
      <div className="text-sm font-semibold">{name}</div>
      <div className="h-1 bg-[#e4e2df] rounded-full overflow-hidden mt-1">
        <div className="h-full bg-primary-container rounded-full transition-all duration-500" style={{ width: `${match}%` }}></div>
      </div>
    </div>
    <div className="text-sm font-bold text-primary">{match}%</div>
  </div>
);

const Dashboard = ({ showToast, reports = [] }) => {
  const navigate = useNavigate();

  const recentReports = reports ? reports.slice(0, 3) : [];

  const getUrgencyTagColor = (urgency) => {
    switch (urgency) {
      case 'HIGH': return 'bg-secondary-fixed text-secondary';
      case 'MEDIUM': return 'bg-[#eae8e5] text-[#424844]';
      case 'LOW': return 'bg-primary-fixed text-primary';
      default: return 'bg-[#eae8e5] text-[#424844]';
    }
  };

  return (
    <div className="p-7 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary">Good morning, Prathiksha</h1>
          <p className="text-outline text-sm mt-1">
            {reports.filter(r => r.status === 'unassigned').length} new need signals detected in Verna cluster —{' '}
            <button onClick={() => navigate('/compass')} className="text-secondary font-bold hover:underline">
              View map →
            </button>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined fill-icon text-sm">verified</span>
          72% Verified Impact Rate
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Volunteers" value="248" trend="↑ 14 this week" color="text-primary" />
        <StatCard title="Open Need Signals" value={reports.filter(r => r.status !== 'resolved').length} trend="↑ 3 since yesterday" isNegative color="text-secondary" />
        <StatCard title="Interventions" value="1,204" trend="↑ 8.4% vs last month" color="text-primary" />
        <StatCard title="Impact Verified" value="72%" trend="↑ 5pts vs Q2" color="text-primary-container" />
      </div>

      {/* Features */}
      <div>
        <h2 className="font-serif text-xl font-medium text-primary mb-4">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon="mic"
            title="Echo Portal"
            description="Voice-first reporting in Hindi, Marathi & Konkani. Zero onboarding friction for ASHA workers."
            cta={{ text: 'Open', color: 'text-primary-fixed-dim' }}
            bg="bg-primary-container text-white"
            iconColor="text-primary-fixed-dim"
            onClick={() => navigate('/echo')}
          />
          <FeatureCard
            icon="explore"
            title="Compass Map"
            description="Real-time geospatial heatmap. See neglected zones and deploy volunteers instantly."
            cta={{ text: 'View map', color: 'text-primary-container' }}
            bg="bg-surface"
            border="border-[#e4e2df]"
            iconColor="text-primary-container"
            onClick={() => navigate('/compass')}
          />
          <FeatureCard
            icon="local_fire_department"
            title="Impact Hearth"
            description="Causal attribution dashboard. Prove that interventions actually reduced community need."
            cta={{ text: 'See impact', color: 'text-secondary' }}
            bg="bg-secondary-fixed"
            border="border-secondary-fixed-dim"
            iconColor="text-secondary"
            onClick={() => navigate('/impact')}
          />
          <FeatureCard
            icon="shield"
            title="Equity Shield"
            description="SDG 10 fairness engine. Detect geographic and gender bias in volunteer allocation."
            cta={{ text: 'Review audit', color: 'text-primary' }}
            bg="bg-primary-fixed"
            border="border-primary-fixed-dim"
            iconColor="text-primary"
            onClick={() => navigate('/equity')}
          />
        </div>
      </div>

      {/* Recent Activity & Top Volunteers */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl p-6 border border-[#e4e2df]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg font-medium text-primary">Recent Field Reports</h3>
            <button onClick={() => navigate('/reports')} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#eae8e5] text-[#424844] hover:bg-[#e4e2df] transition-colors">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentReports.map(report => (
              <ActivityItem
                key={report.id}
                icon={report.source === 'Voice' ? 'mic' : 'app_registration'}
                iconBg={report.source === 'Voice' ? 'bg-primary-container' : 'bg-primary-fixed'}
                title={`${report.category} — ${report.location}`}
                subtitle={`${report.time} · ${report.source} Report · ${report.affected} people affected`}
                tag={report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                tagColor={getUrgencyTagColor(report.urgency)}
              />
            ))}
            {recentReports.length === 0 && (
              <div className="text-center py-4 text-outline text-sm italic">No recent reports</div>
            )}
          </div>
        </div>

        {/* Top Volunteers & WhatsApp Link */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#e4e2df] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-medium text-primary">Top Volunteers</h3>
              <button 
                onClick={() => navigate('/register')}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary text-white rounded-md hover:bg-primary-container transition-colors"
              >
                + ADD
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <VolunteerItem initials="RS" bg="bg-[#e4e2df] text-primary" name="Rahul Sawant" match={94} />
              <VolunteerItem initials="PD" bg="bg-primary-fixed text-primary" name="Priya Desai" match={88} />
              <VolunteerItem initials="AN" bg="bg-secondary-fixed text-secondary" name="Anita Naik" match={81} />
            </div>
            <button 
              onClick={() => navigate('/compass')}
              className="mt-2 w-full py-2.5 border border-primary-container text-primary rounded-lg text-sm font-semibold hover:bg-[#f0edea] transition-colors"
            >
              View Compass Map
            </button>
          </div>

          {/* Direct WhatsApp Coordination */}
          <div className="bg-[#25D366]/10 rounded-xl p-5 border border-[#25D366]/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">chat</span>
              </div>
              <h3 className="text-sm font-bold text-[#075e54]">Field Coordination</h3>
            </div>
            <p className="text-[11px] text-[#075e54]/80 leading-relaxed mb-4">
              Directly link with ASHA workers and volunteers via the WhatsApp Business API.
            </p>
            <a 
              href="https://wa.me/919999999999?text=Aastha%20Intelligence%20Alert:%20New%20need%20signal%20detected%20in%20your%20sector."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#128c7e] transition-all"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              OPEN WHATSAPP GROUP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
