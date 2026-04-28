import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: 'dashboard' },
  { id: 'echo', label: 'Echo', icon: 'mic' },
  { id: 'compass', label: 'Map', icon: 'explore' },
  { id: 'impact', label: 'Impact', icon: 'monitoring' },
  { id: 'equity', label: 'Equity', icon: 'shield' },
];

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-[#e4e2df] shadow-[0_-4px_20px_rgba(23,49,36,0.08)] rounded-t-2xl flex justify-around py-2.5">
      {navItems.map(item => (
        <NavLink
          key={item.id}
          to={`/${item.id}`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer ${
              isActive ? 'text-primary' : 'text-[#424844]'
            }`
          }
        >
          <span className={`material-symbols-outlined text-xl ${item.id === 'dashboard' ? 'fill-icon' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
