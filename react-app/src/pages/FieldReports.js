import React, { useState } from 'react';

const FieldReports = ({ showToast, reports, addReport, removeReport, updateReportStatus }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    category: 'Food Shortage',
    location: '',
    urgency: 'MEDIUM',
    affected: 1,
    source: 'App'
  });

  const filteredReports = reports.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.location.toLowerCase().includes(search.toLowerCase()) && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAddReport = (e) => {
    e.preventDefault();
    const report = {
      ...newReport,
      id: Date.now(),
      status: 'unassigned',
      time: 'Just now'
    };
    addReport(report);
    setShowModal(false);
    showToast('New report added successfully', 'check_circle');
    setNewReport({
      category: 'Food Shortage',
      location: '',
      urgency: 'MEDIUM',
      affected: 1,
      source: 'App'
    });
  };

  const handleDownload = () => {
    const headers = ['ID', 'Category', 'Location', 'Urgency', 'Status', 'Time', 'Affected', 'Source'];
    const csvData = reports.map(r => [
      r.id, r.category, r.location, r.urgency, r.status, r.time, r.affected, r.source
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + csvData.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aastha_field_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Reports exported to CSV', 'download');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'HIGH': return 'bg-error-container text-error';
      case 'MEDIUM': return 'bg-secondary-fixed text-secondary';
      case 'LOW': return 'bg-primary-fixed text-primary';
      default: return 'bg-[#eae8e5] text-[#424844]';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-primary-fixed text-primary';
      case 'in_progress': return 'bg-secondary-fixed text-secondary';
      case 'assigned': return 'bg-[#eae8e5] text-[#424844]';
      case 'unassigned': return 'bg-error-container text-error';
      default: return 'bg-[#eae8e5] text-[#424844]';
    }
  };

  return (
    <div className="p-7 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-primary">Field Reports</h1>
          <p className="text-outline text-sm mt-1">All field reports · Filter by status · Export data</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="px-4 py-2 border border-primary-container text-primary text-sm font-semibold rounded-lg hover:bg-[#f0edea] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            type="text"
            placeholder="Search by location or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e4e2df] rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'unassigned', 'assigned', 'in_progress', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-[#e4e2df] text-[#424844] hover:bg-[#f5f3f0]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e4e2df] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f5f3f0]">
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">ID</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Category</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Location</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Urgency</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Status</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Time</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Affected</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Source</th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-wider text-outline">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t border-[#e4e2df] hover:bg-[#f5f3f0]/50 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs text-outline">#{report.id.toString().slice(-4)}</td>
                  <td className="py-4 px-4 font-semibold">{report.category}</td>
                  <td className="py-4 px-4">{report.location}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getUrgencyColor(report.urgency)}`}>
                      {report.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-outline">{report.time}</td>
                  <td className="py-4 px-4 font-semibold">{report.affected}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-outline">
                        {report.source === 'Voice' ? 'mic' : report.source === 'WhatsApp' ? 'chat' : 'app_registration'}
                      </span>
                      {report.source}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      {report.status === 'unassigned' ? (
                        <button 
                          onClick={() => {
                            updateReportStatus(report.id, 'assigned');
                            showToast(`Assigned volunteer to report #${report.id}`, 'person_add');
                          }}
                          className="p-1.5 hover:bg-primary-fixed rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg text-primary">person_add</span>
                        </button>
                      ) : (
                         <button 
                          onClick={() => showToast(`Viewing report #${report.id}`, 'visibility')}
                          className="p-1.5 hover:bg-[#f0edea] rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg text-outline">visibility</span>
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          removeReport(report.id);
                          showToast('Report deleted', 'delete');
                        }}
                        className="p-1.5 hover:bg-error-container rounded transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-error">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-outline">
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p>No reports match your filters</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-serif text-xl font-semibold text-primary mb-4">Create New Report</h2>
            <form onSubmit={handleAddReport} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-outline">Category</label>
                <select 
                  className="p-2.5 bg-[#f5f3f0] border border-[#e4e2df] rounded-lg text-sm outline-none"
                  value={newReport.category}
                  onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                >
                  <option>Food Shortage</option>
                  <option>Medical Emergency</option>
                  <option>Water Access</option>
                  <option>Sanitation</option>
                  <option>Shelter</option>
                  <option>Rescue</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-outline">Location</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Ward 7, Verna"
                  className="p-2.5 bg-[#f5f3f0] border border-[#e4e2df] rounded-lg text-sm outline-none"
                  value={newReport.location}
                  onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline">Urgency</label>
                  <select 
                    className="p-2.5 bg-[#f5f3f0] border border-[#e4e2df] rounded-lg text-sm outline-none"
                    value={newReport.urgency}
                    onChange={(e) => setNewReport({...newReport, urgency: e.target.value})}
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-outline">People Affected</label>
                  <input 
                    type="number"
                    min="1"
                    className="p-2.5 bg-[#f5f3f0] border border-[#e4e2df] rounded-lg text-sm outline-none"
                    value={newReport.affected}
                    onChange={(e) => setNewReport({...newReport, affected: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#e4e2df] rounded-lg text-sm font-semibold hover:bg-[#f5f3f0]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-container"
                >
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldReports;
