import React from 'react';

const Toast = ({ message, icon = 'check_circle' }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-primary text-white px-5 py-3.5 rounded-xl text-sm font-semibold z-[999] shadow-lg shadow-primary/30 flex items-center gap-2.5 animate-[fadeIn_0.3s_ease]">
      <span className="material-symbols-outlined fill-icon text-lg text-[#b0cdbb]">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
