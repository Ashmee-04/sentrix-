import React from 'react';
import { AlertTriangle, RefreshCw, PhoneCall } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface DemoBannerProps {
  onDataReset?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onDataReset }) => {
  const handleReset = () => {
    if (window.confirm('Reset all demo incidents, alerts, and notifications to default sample data?')) {
      StorageService.resetDemoData();
      if (onDataReset) onDataReset();
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#FFF8E6] border-b border-[#F0E2BA] px-3 py-1.5 text-xs text-[#6F5B24] flex flex-wrap items-center justify-between gap-2 z-30">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-semibold text-[#8B6B18] uppercase tracking-wider text-[10px] bg-[#FCECB5] px-2 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3 text-[#B45309]" />
          Demo Mode Sandbox
        </span>
        <span className="text-[11px] text-[#5C4D26]">
          Simulated emergency dispatch & sandboxed SMS. For real Bengaluru emergencies, dial{' '}
          <a
            href="tel:112"
            className="font-bold underline text-[#9A3412] hover:text-[#C2410C] inline-flex items-center gap-0.5"
          >
            <PhoneCall className="w-3 h-3" />
            112 (ERSS Karnataka)
          </a>
          .
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={handleReset}
          className="cursor-pointer text-[11px] flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-[#FDF9EE] border border-[#E2D4A8] text-[#5C4D26] font-medium transition"
          title="Reset simulated incidents & notifications"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
