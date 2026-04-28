import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MatchingAPI, MockData, ImpactAPI } from '../services/api';

// Custom Marker Icons for Light Theme
const createSignalIcon = (urgency) => {
  const color = urgency === 'HIGH' ? '#ba1a1a' : '#99460a';
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const VolunteerMarkerIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #2d4739; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <span class="material-symbols-outlined" style="color: white; font-size: 14px;">person</span>
        </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const VolunteerCard = ({ vol, onDeploy }) => (
  <div className="bg-white rounded-2xl p-5 border border-[#e4e2df] shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container/10">
          <img src={`https://i.pravatar.cc/150?u=${vol.id}`} alt={vol.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm font-bold text-primary">{vol.name}</div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px] text-primary">call</span>
            <div className="text-[10px] text-outline uppercase tracking-wider">{vol.phone || '+91 98XXX XXX01'}</div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-primary leading-none">{vol.match_score || 94}%</div>
        <div className="text-[8px] font-bold uppercase tracking-wider text-outline">Match</div>
      </div>
    </div>
    
    <div className="flex flex-wrap gap-2 mb-5">
      {vol.skills.slice(0, 3).map((skill, i) => (
        <span key={i} className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter ${
          i === 0 ? 'bg-primary-fixed text-primary' : 'bg-[#f5f3f0] text-[#424844]'
        }`}>
          {skill}
        </span>
      ))}
    </div>

    <button 
      onClick={() => onDeploy(vol)}
      className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm"
    >
      <span className="material-symbols-outlined text-sm">notifications_active</span>
      Deploy & Notify
    </button>
  </div>
);

const CompassMap = ({ showToast, reports = [] }) => {
  const [activeUnits, setActiveUnits] = useState(true);
  const [showNeglected, setShowNeglected] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState(null);
  
  const center = [15.2993, 74.1240];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volsData, statsData] = await Promise.all([
          MatchingAPI.getActiveVolunteers(),
          ImpactAPI.getDashboardStats()
        ]);
        setVolunteers(volsData.volunteers || MockData.mockVolunteers);
        setStats(statsData);
      } catch (error) {
        setVolunteers(MockData.mockVolunteers);
      }
    };
    fetchData();
  }, []);

  const handleDeploy = async (vol) => {
    try {
      showToast(`Notifying ${vol.name} via Google Cloud...`, 'cloud_sync');
      
      // Simulate real-time deployment sync
      setTimeout(() => {
        showToast(`Mission Briefing sent to ${vol.name}'s mobile app`, 'notifications_active');
        // Trigger a direct phone call for the coordinator
        window.location.href = `tel:${vol.phone || '+919999999999'}`;
      }, 1500);

      await MatchingAPI.acceptMatch('demo-match', vol.id);
    } catch (error) {
      showToast('Deployment sync failed', 'error');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#f5f3f0]">
      {/* Map Content */}
      <div className="flex-1 relative">
        {/* Light Theme Map Overlays */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4 w-64 pointer-events-none">
          {/* Map Layers Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-[#e4e2df] pointer-events-auto">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">Map Layers</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#424844]">Active Units</span>
                <button onClick={() => setActiveUnits(!activeUnits)} className={`w-9 h-5 rounded-full transition-colors relative ${activeUnits ? 'bg-primary' : 'bg-[#c2c8c2]'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${activeUnits ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#424844]">Show Neglected Zones</span>
                <button onClick={() => setShowNeglected(!showNeglected)} className={`w-9 h-5 rounded-full transition-colors relative ${showNeglected ? 'bg-secondary' : 'bg-[#c2c8c2]'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showNeglected ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* SDG Compliance Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-[#e4e2df] pointer-events-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">SDG 10 Compliance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-outline">
              Neglect Index monitored via real-time ASHA signal ingestion. Targeted rural focus: <span className="font-bold text-primary">0.34</span>.
            </p>
          </div>
        </div>

        {/* Map Container - Positron Light */}
        <div className="w-full h-full">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            
            {/* Neglected Zones Circles */}
            {showNeglected && (
              <>
                <Circle center={[15.305, 74.120]} radius={1000} pathOptions={{ color: '#99460a', fillColor: '#99460a', fillOpacity: 0.1, weight: 1 }} />
                <Circle center={[15.280, 74.130]} radius={700} pathOptions={{ color: '#99460a', fillColor: '#99460a', fillOpacity: 0.1, weight: 1 }} />
              </>
            )}

            {/* Need Markers */}
            {reports.map(report => (
              <Marker 
                key={report.id} 
                position={[center[0] + (Math.random()-0.5)*0.04, center[1] + (Math.random()-0.5)*0.04]} 
                icon={createSignalIcon(report.urgency)}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-bold text-primary">{report.category}</div>
                    <div className="text-[10px] text-outline mb-1">{report.location}</div>
                    <div className="text-[10px] font-bold text-error uppercase">Active Signal</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Volunteer Units */}
            {activeUnits && volunteers.slice(0, 5).map(vol => (
              <Marker 
                key={vol.id} 
                position={[vol.location.lat, vol.location.lng]} 
                icon={VolunteerMarkerIcon}
              >
                <Popup>
                  <div className="font-bold">{vol.name}</div>
                  <div className="text-xs">{vol.skills[0]} Unit</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Custom Map Controls */}
        <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-[#e4e2df] flex items-center justify-center text-primary hover:bg-[#f5f3f0]">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-[#e4e2df] flex items-center justify-center text-primary hover:bg-[#f5f3f0]">
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg border border-[#e4e2df] flex items-center justify-center text-primary hover:bg-[#f5f3f0]">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      {/* Volunteer Sidebar */}
      <aside className="w-[360px] bg-white border-l border-[#e4e2df] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#e4e2df]">
          <h2 className="font-serif text-xl font-semibold text-primary">Volunteer Matching</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline mt-1">Priority: Neglected Zones</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#fbf9f6]/50">
          {volunteers.slice(0, 4).map(vol => (
            <VolunteerCard key={vol.id} vol={vol} onDeploy={handleDeploy} />
          ))}
        </div>

        <div className="p-6 bg-white border-t border-[#e4e2df]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Ground Capacity</span>
            <span className="text-xs font-bold text-primary">{stats?.ground_capacity || '76%'}</span>
          </div>
          <div className="h-1.5 bg-[#f5f3f0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2d4739] rounded-full transition-all duration-1000" 
              style={{ width: `${stats?.ground_capacity || '76%'}` }} 
            />
          </div>
        </div>
      </aside>

      {/* Amber Map Filter Styles */}
      <style>{`
        .amber-map-container .leaflet-container {
          background: #111 !important;
        }
        .amber-map-container .leaflet-tile-pane {
          filter: sepia(100%) saturate(300%) brightness(80%) contrast(110%) hue-rotate(345deg);
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 4px;
        }
      `}</style>
    </div>
  );
};

export default CompassMap;
