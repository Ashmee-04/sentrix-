import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface FloatingSosButtonProps {
  onTriggerSos: () => void;
}

export const FloatingSosButton: React.FC<FloatingSosButtonProps> = ({ onTriggerSos }) => {
  return (
    <div className="fixed bottom-20 right-4 z-30 md:bottom-8 md:right-8">
      <button
        onClick={onTriggerSos}
        className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-full bg-[#D94336] hover:bg-[#C2362A] text-white font-black text-xs tracking-wider uppercase shadow-xl hover:shadow-2xl transition transform active:scale-95 border-2 border-white animate-urgent-pulse group"
        title="Immediate Emergency SOS"
      >
        <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition" />
        <span className="hidden sm:inline">RAPID SOS</span>
      </button>
    </div>
  );
};
