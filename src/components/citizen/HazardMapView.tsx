import React, { useState, useEffect } from 'react';
import {
  Map,
  AlertTriangle,
  Shield,
  Layers,
  CheckCircle2,
  Bell,
  Clock,
  Compass,
  Car,
  Filter,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { HazardAlert, DispatchUnit } from '../../types';

export const HazardMapView: React.FC = () => {
  const [hazards, setHazards] = useState<HazardAlert[]>([]);
  const [units, setUnits] = useState<DispatchUnit[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<HazardAlert | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [optInAlerts, setOptInAlerts] = useState(true);

  useEffect(() => {
    setHazards(StorageService.getHazards());
    setUnits(StorageService.getDispatchUnits());
  }, []);

  const filteredHazards = hazards.filter((h) => {
    if (activeCategory !== 'all' && h.category !== activeCategory) return false;
    if (showVerifiedOnly && !h.isVerified) return false;
    return true;
  });

  // Coordinates projection helper for Bengaluru bounds
  // Center roughly: 12.9716, 77.5946
  // Lat range: 12.88 to 13.06 (height)
  // Lng range: 77.50 to 77.72 (width)
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 12.89;
    const maxLat = 13.05;
    const minLng = 77.52;
    const maxLng = 77.70;

    const x = Math.max(5, Math.min(95, ((lng - minLng) / (maxLng - minLng)) * 100));
    // inverted Y because SVG top is 0
    const y = Math.max(5, Math.min(95, 100 - ((lat - minLat) / (maxLat - minLat)) * 100));

    return { x, y };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
            <Map className="w-4 h-4" />
            Live Geospatial Safety Radar
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
            Nearby Hazard Map & Active Alerts
          </h2>
          <p className="text-xs sm:text-sm text-[#657780] mt-1">
            Real-time feed of traffic blocks, severe waterlogging, infrastructure risks, and patrolling Pink Hoysala units in Bengaluru.
          </p>
        </div>

        {/* Opt-in Alerts toggle */}
        <div className="bg-white border border-[#E4EAE5] px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <Bell className="w-4 h-4 text-[#2F5952]" />
          <span className="text-xs font-semibold text-[#1E282D]">Ward Hazard Notifications</span>
          <input
            type="checkbox"
            checked={optInAlerts}
            onChange={(e) => setOptInAlerts(e.target.checked)}
            className="w-4 h-4 rounded text-[#2F5952] focus:ring-[#2F5952] cursor-pointer ml-1"
          />
        </div>
      </div>

      {/* Map Control Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-2xl border border-[#E0E7E2]">
          {[
            { id: 'all', label: 'All Hazards' },
            { id: 'waterlogging', label: 'Waterlogging' },
            { id: 'electrical_hazard', label: 'Exposed Wires' },
            { id: 'civic_work', label: 'Road Work / Trees' },
            { id: 'traffic_block', label: 'Traffic Blocks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-white text-[#2F5952] shadow-xs'
                  : 'text-[#657780] hover:text-[#34434A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-[#34434A] cursor-pointer">
          <input
            type="checkbox"
            checked={showVerifiedOnly}
            onChange={(e) => setShowVerifiedOnly(e.target.checked)}
            className="rounded text-[#2F5952] focus:ring-[#2F5952]"
          />
          <span>Show Verified Alerts Only</span>
        </label>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative bg-[#EBF0EC] border border-[#CCDCD0] rounded-3xl overflow-hidden shadow-xs h-[420px] sm:h-[480px]">
        {/* Map Grid and Aesthetic Cartographic Background */}
        <svg className="w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Subtle water bodies: Ulsoor Lake, Sankey Tank, Bellandur Lake */}
          <ellipse cx="62" cy="46" rx="4" ry="2.5" fill="#D3E2E8" opacity="0.8" />
          <text x="62" y="47" fontSize="2" fill="#658896" textAnchor="middle" fontStyle="italic">
            Ulsoor Lake
          </text>

          <ellipse cx="78" cy="72" rx="7" ry="4" fill="#D3E2E8" opacity="0.8" />
          <text x="78" y="73" fontSize="2" fill="#658896" textAnchor="middle" fontStyle="italic">
            Bellandur Lake
          </text>

          {/* Major arterial roads (Outer Ring Road, Old Airport Rd, Hosur Rd) */}
          <path
            d="M 15 50 Q 50 48 85 52"
            fill="none"
            stroke="#DCE5DD"
            strokeWidth="1.8"
            strokeDasharray="2,1"
          />
          <path
            d="M 45 15 Q 52 50 68 85"
            fill="none"
            stroke="#DCE5DD"
            strokeWidth="1.8"
            strokeDasharray="2,1"
          />
          <path
            d="M 25 75 Q 60 70 85 45"
            fill="none"
            stroke="#DCE5DD"
            strokeWidth="1.8"
            strokeDasharray="2,1"
          />

          {/* Area labels */}
          <text x="48" y="48" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Majestic / Central BLR
          </text>
          <text x="66" y="45" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Indiranagar
          </text>
          <text x="58" y="65" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Koramangala
          </text>
          <text x="82" y="42" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Whitefield
          </text>
          <text x="62" y="78" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Silk Board
          </text>
          <text x="42" y="32" fontSize="2.5" fill="#84998B" fontWeight="bold">
            Malleshwaram
          </text>
        </svg>

        {/* Dynamic Hazard Pins */}
        {filteredHazards.map((haz) => {
          const { x, y } = projectCoords(haz.coordinates[0], haz.coordinates[1]);
          const isSelected = selectedHazard?.id === haz.id;
          return (
            <div
              key={haz.id}
              onClick={() => setSelectedHazard(haz)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {haz.severity === 'HIGH' && (
                <div className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping -m-1" />
              )}
              <div
                className={`p-1.5 rounded-full shadow-md transition transform group-hover:scale-125 ${
                  isSelected
                    ? 'ring-4 ring-rose-400 bg-rose-600 text-white'
                    : haz.severity === 'HIGH'
                    ? 'bg-rose-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>

              {/* Pin tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-neutral-900/90 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30 font-medium">
                {haz.title}
              </div>
            </div>
          );
        })}

        {/* Patrolling Units Pins (Pink Hoysala) */}
        {units.map((unit, i) => {
          // Spread across Indiranagar, Koramangala, etc.
          const x = 55 + i * 8;
          const y = 45 + i * 7;
          return (
            <div
              key={unit.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-15"
              title={`${unit.name} (${unit.status})`}
            >
              <div className="p-1 rounded-full bg-[#554A6B] text-white shadow-xs flex items-center justify-center opacity-85">
                <Shield className="w-2.5 h-2.5" />
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#CCDCD0] p-2.5 rounded-2xl shadow-xs text-[10px] space-y-1 z-30">
          <div className="font-bold text-[#1E282D] uppercase tracking-wide">Map Legend</div>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>High Hazard (Pothole / Flooding / Wire)</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate Civic Disruption</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-[#554A6B]" />
            <span>Pink Hoysala Patrol Vehicle</span>
          </div>
        </div>
      </div>

      {/* Selected Hazard Drill-down Card */}
      {selectedHazard && (
        <div className="bg-white border-2 border-[#CCDCD0] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {selectedHazard.category.replace('_', ' ')}
                </span>
                {selectedHazard.isVerified ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified by {selectedHazard.verifiedBy}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    Awaiting Official Field Verification
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[#1E282D] mt-1.5">{selectedHazard.title}</h3>
              <p className="text-xs text-[#657780] leading-relaxed mt-0.5">
                {selectedHazard.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedHazard(null)}
              className="cursor-pointer text-xs font-semibold text-neutral-500 hover:text-neutral-800"
            >
              Dismiss
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#657780] pt-2 border-t border-[#F2F5F3]">
            <span>
              Ward: <strong className="text-[#1E282D]">{selectedHazard.ward}</strong>
            </span>
            <span>
              Reported:{' '}
              <strong className="text-[#1E282D]">
                {new Date(selectedHazard.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </span>
            <span>
              Advisory Expiry:{' '}
              <strong className="text-[#1E282D]">
                {new Date(selectedHazard.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
