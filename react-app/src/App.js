import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import EchoPortal from './pages/EchoPortal';
import CompassMap from './pages/CompassMap';
import ImpactHearth from './pages/ImpactHearth';
import EquityShield from './pages/EquityShield';
import ImpactLibrary from './pages/ImpactLibrary';
import FieldReports from './pages/FieldReports';
import VolunteerRegistration from './pages/VolunteerRegistration';
import Toast from './components/Toast';
import DemoIntelligenceOverlay from './components/DemoIntelligenceOverlay';

function App() {
  const [toast, setToast] = useState({ show: false, message: '', icon: '' });
  const [reports, setReports] = useState([
    { id: 1, category: 'Food Shortage', location: 'Ward 7, Panjim', urgency: 'HIGH', status: 'unassigned', time: '2 min ago', affected: 45, source: 'Voice' },
    { id: 2, category: 'Medical Emergency', location: 'Ward 5, Margao', urgency: 'HIGH', status: 'assigned', time: '15 min ago', affected: 8, source: 'Voice' },
    { id: 3, category: 'Water Access', location: 'Ward 12, Verna', urgency: 'MEDIUM', status: 'in_progress', time: '1 hour ago', affected: 30, source: 'App' },
    { id: 4, category: 'Sanitation', location: 'Ward 3, Mapusa', urgency: 'MEDIUM', status: 'resolved', time: '3 hours ago', affected: 20, source: 'Voice' },
    { id: 5, category: 'Shelter', location: 'Ward 8, Vasco', urgency: 'LOW', status: 'assigned', time: '5 hours ago', affected: 12, source: 'WhatsApp' },
  ]);

  const showToast = (message, icon = 'check_circle') => {
    setToast({ show: true, message, icon });
    setTimeout(() => setToast({ show: false, message: '', icon: '' }), 3000);
  };

  const addReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const removeReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const updateReportStatus = (id, status) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="flex flex-row min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard showToast={showToast} reports={reports} />} />
            <Route path="/compass" element={<CompassMap showToast={showToast} reports={reports} />} />
            <Route path="/impact" element={<ImpactHearth showToast={showToast} />} />
            <Route path="/equity" element={<EquityShield showToast={showToast} />} />
            <Route path="/register" element={<VolunteerRegistration showToast={showToast} />} />
          </Routes>
        </div>
      </div>
      {toast.show && <Toast message={toast.message} icon={toast.icon} />}
      <DemoIntelligenceOverlay />
    </div>
  );
}

export default App;
