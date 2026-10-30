import React from 'react';
import { CloudSun, ArrowLeft, RefreshCw, Train, Compass } from 'lucide-react';

interface QuickExitModalProps {
  isOpen: boolean;
  onReturn: () => void;
}

export const QuickExitModal: React.FC<QuickExitModalProps> = ({ isOpen, onReturn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F8] flex flex-col p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="max-w-2xl mx-auto w-full space-y-4">
        {/* Fake Weather Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-500" />
            <h1 className="text-lg font-semibold text-gray-800">Bengaluru City Weather & Transit</h1>
          </div>
          <span className="text-xs text-gray-500">Updated just now</span>
        </div>

        {/* Weather Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-4xl font-light text-gray-900">26°C</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Partly Cloudy • Humidity 62%</div>
            <div className="text-xs text-gray-400 mt-0.5">Wind: 14 km/h E • AQI: 58 (Satisfactory)</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <CloudSun className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        {/* Transit Timings Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Train className="w-4 h-4 text-purple-600" />
            Namma Metro Purple & Green Line Updates
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-700">Whitefield ➔ Challaghatta (Purple Line)</span>
              <span className="text-emerald-600 font-semibold">Every 4 mins (Normal)</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-gray-50">
              <span className="font-medium text-gray-700">Nagasandra ➔ Silk Institute (Green Line)</span>
              <span className="text-emerald-600 font-semibold">Every 6 mins (Normal)</span>
            </div>
          </div>
        </div>

        {/* Civic Notices */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Compass className="w-4 h-4 text-teal-600" />
            Bengaluru Ward Civic Updates
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            BBMP desilting works in progress across stormwater drains in Mahadevapura and East Zone. Commuters advised to follow traffic advisories.
          </p>
        </div>

        {/* Discreet Return Control at bottom */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={onReturn}
            className="cursor-pointer text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-gray-200/50 transition border border-transparent hover:border-gray-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Safety Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
