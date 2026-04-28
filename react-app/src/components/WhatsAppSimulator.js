import React, { useState, useEffect } from 'react';

const WhatsAppSimulator = ({ onProcess }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'received', content: 'audio', duration: '0:12', time: '10:42 AM', sender: 'ASHA Priya (Ward 7)' },
    { id: 2, type: 'system', content: 'Aastha Bot: Analyzing voice signal...', time: '10:43 AM' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateIncoming = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newMessage = { 
        id: Date.now(), 
        type: 'received', 
        content: 'audio', 
        duration: '0:08', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'Volunteer Rahul (Ward 12)'
      };
      setMessages(prev => [...prev, newMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleProcess = (msg) => {
    onProcess("वार्ड 12 मध्ये पाण्याची टंचाई आहे. तातडीने पाणी पुरवठा आवश्यक आहे.");
  };

  return (
    <div className="bg-[#e5ddd5] rounded-3xl overflow-hidden border border-[#d1d7db] shadow-xl flex flex-col h-[400px] w-full max-w-[320px] mx-auto relative">
      {/* Header */}
      <div className="bg-[#075e54] p-3 flex items-center gap-3 text-white">
        <span className="material-symbols-outlined">arrow_back</span>
        <div className="w-8 h-8 rounded-full bg-[#128c7e] flex items-center justify-center font-bold text-xs">A</div>
        <div className="flex-1">
          <div className="text-xs font-bold">Aastha Node - Goa</div>
          <div className="text-[10px] opacity-70">online</div>
        </div>
        <span className="material-symbols-outlined text-sm">videocam</span>
        <span className="material-symbols-outlined text-sm">call</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map(msg => (
          <div key={msg.id} className={`max-w-[85%] rounded-lg p-2 text-xs relative ${
            msg.type === 'received' ? 'bg-white self-start shadow-sm' : 'bg-[#dcf8c6] self-center text-center italic text-[10px]'
          }`}>
            {msg.content === 'audio' ? (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold text-[#075e54] mb-1">{msg.sender}</div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">play_circle</span>
                  <div className="h-1 flex-1 bg-[#d1d7db] rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3"></div>
                  </div>
                  <span className="text-[10px] text-outline">{msg.duration}</span>
                </div>
                <button 
                  onClick={() => handleProcess(msg)}
                  className="mt-2 py-1 bg-primary text-white rounded text-[10px] font-bold uppercase"
                >
                  Process to Portal
                </button>
              </div>
            ) : (
              msg.content
            )}
            <div className="text-[8px] text-outline text-right mt-1">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-outline">mood</span>
        <span className="material-symbols-outlined text-outline">attach_file</span>
        <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-outline">Message</div>
        <button onClick={simulateIncoming} className="bg-[#128c7e] text-white w-8 h-8 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">{isProcessing ? 'sync' : 'mic'}</span>
        </button>
      </div>

      {/* Processing Overlay Label (Dummy "Active" indicator) */}
      <div className="absolute top-12 right-2 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
        GEMINI 1.5 ACTIVE
      </div>
    </div>
  );
};

export default WhatsAppSimulator;
