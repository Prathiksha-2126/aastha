import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/echo': 'Echo Portal',
  '/compass': 'Compass Map',
  '/impact': 'Impact Hearth',
  '/equity': 'Equity Shield',
  '/reports': 'Field Reports',
};

const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Aastha';

  return (
    <header className="h-16 bg-[#f7f3f0] border-b border-[#e4e2df] flex items-center justify-between px-7 flex-shrink-0 sticky top-0 z-50 shadow-sm shadow-primary/5">
      <div className="flex items-center gap-2">
        <span className="font-serif text-xl font-semibold text-primary">{title}</span>
        <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined fill-icon text-xs">verified</span>
          Live
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-[#e4e2df] rounded-full px-4 py-1.5 text-sm w-52 outline-none focus:border-primary transition-colors"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm text-outline pointer-events-none">search</span>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors relative">
          <span className="material-symbols-outlined text-lg text-[#424844]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center cursor-pointer">
          <span className="text-white text-sm font-bold">P</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
