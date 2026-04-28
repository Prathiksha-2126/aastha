import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { id: 'compass', label: 'Compass Map', icon: 'explore', path: '/compass' },
  { id: 'impact', label: 'Impact Hearth', icon: 'monitoring', path: '/impact' },
  { id: 'equity', label: 'Equity & Impact Lab', icon: 'policy', path: '/equity' },
  { id: 'register', label: 'Register Volunteer', icon: 'person_add', path: '/register' },
];

const bottomItems = [];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-white border-r border-[#e4e2df] p-4 overflow-y-auto sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-2 mb-6">
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined fill-icon text-white text-xl">eco</span>
        </div>
        <div>
          <div className="font-serif text-xl font-semibold text-primary leading-none">Aastha</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-outline">NGO Coordination</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#f0edea] text-primary font-semibold'
                  : 'text-[#424844] hover:bg-[#f5f3f0] hover:translate-x-0.5'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
        
        <div className="h-px bg-[#e4e2df] my-2"></div>
        
        {bottomItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#f0edea] text-primary font-semibold'
                  : 'text-[#424844] hover:bg-[#f5f3f0] hover:translate-x-0.5'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-t border-[#e4e2df] flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 text-[#424844] hover:bg-[#f5f3f0] rounded-lg text-sm font-semibold transition-all">
          <span className="material-symbols-outlined text-lg">settings</span>
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-[#424844] hover:bg-[#f5f3f0] rounded-lg text-sm font-semibold transition-all">
          <span className="material-symbols-outlined text-lg">help</span>
          Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
