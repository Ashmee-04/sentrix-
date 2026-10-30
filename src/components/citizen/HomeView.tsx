import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Car,
  HeartPulse,
  Flame,
  UserX,
  Users,
  Waves,
  MapPin,
  Share2,
  Bus,
  AlertTriangle,
  BookOpen,
  Building2,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Lock,
  Volume2,
} from 'lucide-react';
import {
  UserProfile,
  EmergencyCategory,
  HazardAlert,
  IncidentReport,
} from '../../types';
import { StorageService } from '../../services/storage';
import { getCurrentBengaluruLocation } from '../../services/device';

interface HomeViewProps {
  user: UserProfile;
  onOpenSosModal: (category?: EmergencyCategory) => void;
  onNavigateTab: (tabId: string) => void;
  onOpenLockScreen: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onOpenSosModal,
  onNavigateTab,
  onOpenLockScreen,
}) => {
  const [hazards, setHazards] = useState<HazardAlert[]>([]);
  const [locationName, setLocationName] = useState('Indiranagar 100ft Rd, Bengaluru');
  const [locAccuracy, setLocAccuracy] = useState('12m');

  useEffect(() => {
    setHazards(StorageService.getHazards());
    getCurrentBengaluruLocation().then((loc) => {
      if (loc.address) setLocationName(loc.address);
      if (loc.accuracyMeters) setLocAccuracy(`${loc.accuracyMeters}m`);
    });
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* Live Location Telemetry Bar */}
      <div className="bg-[#FFFFFF] border border-[#E4EAE5] rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#DCE8DF] flex items-center justify-center text-[#2F5952]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#657780] uppercase tracking-wider">
              Live Location • Bengaluru
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1E282D] truncate max-w-xs sm:max-w-md">
              {locationName}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            GPS Active (±{locAccuracy})
          </span>
        </div>
      </div>

      {/* Prominent SOS Hero Card */}
      <div className="bg-gradient-to-br from-[#FFFFFF] via-[#FFFBFB] to-[#FDF4F3] border-2 border-[#F2D7D7] rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE8E6] text-[#A83227] text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Instant Emergency Response
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E282D] tracking-tight">
              Bengaluru Emergency SOS
            </h2>
            <p className="text-xs sm:text-sm text-[#657780] max-w-md leading-relaxed">
              Tap below to transmit GPS location and alert ERSS 112 with your {user.contacts.length} verified emergency contacts.
            </p>
          </div>

          {/* Big Circular SOS Trigger */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#D94336]/20 animate-ping" />
            <button
              onClick={() => onOpenSosModal()}
              className="cursor-pointer relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#D94336] hover:bg-[#C2362A] text-white flex flex-col items-center justify-center font-black shadow-lg hover:shadow-xl transition transform active:scale-95 group"
            >
              <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 mb-1 group-hover:scale-110 transition" />
              <span className="text-xl sm:text-2xl tracking-wider">SOS</span>
              <span className="text-[10px] font-medium tracking-tight text-white/90">
                HOLD OR TAP
              </span>
            </button>
          </div>
        </div>

        {/* 1-Tap Category Triggers */}
        <div className="mt-6 pt-5 border-t border-[#F2D7D7]">
          <div className="text-[11px] font-bold text-[#8A1F16] uppercase tracking-wider mb-2.5">
            Quick 1-Tap Emergency Trigger:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onOpenSosModal('road_accident')}
              className="cursor-pointer p-2.5 rounded-xl bg-white hover:bg-[#FDF1EF] border border-[#E8C7C4] text-left flex items-center gap-2 transition"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E282D]">Road Crash</div>
                <div className="text-[10px] text-neutral-500">Accident / Collision</div>
              </div>
            </button>

            <button
              onClick={() => onOpenSosModal('medical')}
              className="cursor-pointer p-2.5 rounded-xl bg-white hover:bg-[#FDF1EF] border border-[#E8C7C4] text-left flex items-center gap-2 transition"
            >
              <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E282D]">Medical 108</div>
                <div className="text-[10px] text-neutral-500">Unconscious / Trauma</div>
              </div>
            </button>

            <button
              onClick={() => onOpenSosModal('harassment')}
              className="cursor-pointer p-2.5 rounded-xl bg-white hover:bg-[#FDF1EF] border border-[#E8C7C4] text-left flex items-center gap-2 transition"
            >
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <UserX className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E282D]">Assault / Stalking</div>
                <div className="text-[10px] text-neutral-500">Pink Hoysala alert</div>
              </div>
            </button>

            <button
              onClick={() => onOpenSosModal('fire')}
              className="cursor-pointer p-2.5 rounded-xl bg-white hover:bg-[#FDF1EF] border border-[#E8C7C4] text-left flex items-center gap-2 transition"
            >
              <div className="p-1.5 rounded-lg bg-orange-100 text-orange-800">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E282D]">Fire Rescue</div>
                <div className="text-[10px] text-neutral-500">Smoke / Trapped</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider">
            Safety Services & Reporting
          </h3>
          <span className="text-xs text-[#657780]">Bengaluru Municipal Jurisdiction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Karnataka Women's Safety */}
          <div
            onClick={() => onNavigateTab('womens_safety')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF8FC] border border-[#DDD8E6] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#EAE6F2] text-[#554A6B] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE6F2] text-[#554A6B]">
                  Parihar 1091
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#554A6B] transition">
                Karnataka Women's Safety
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Pink Hoysala patrol fleet, Parihar counselling, Vanitha Sahayavani, and safe reporting channels.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#554A6B]">
              <span>Open verified resources</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Public Transport Safety */}
          <div
            onClick={() => onNavigateTab('transport_safety')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F2F7F4] border border-[#CCDCD0] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#DCE8DF] text-[#2F5952] flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE8DF] text-[#2F5952]">
                  BMTC & Metro
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#2F5952] transition">
                Public Transport Safety
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Report harassment, eve-teasing, unsafe bus stops, or stalking on BMTC buses, Namma Metro, and autos.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#2F5952]">
              <span>File transport report</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Live Location Sharing */}
          <div
            onClick={() => onNavigateTab('location_share')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F0F5FA] border border-[#CCDCE8] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#E5EEF5] text-[#2D5A7B] flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E5EEF5] text-[#2D5A7B]">
                  Consent-Based
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#2D5A7B] transition">
                Live Journey Share
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Share live route tracking with trusted family for 15m, 1h, or night commute with stop control.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#2D5A7B]">
              <span>Start journey share</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Civic Complaint Box */}
          <div
            onClick={() => onNavigateTab('civic_reports')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF8F2] border border-[#E8DEC9] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#F5EED9] text-[#7A6328] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5EED9] text-[#7A6328]">
                  BBMP & BESCOM
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#7A6328] transition">
                Civic Hazard Complaints
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Log road potholes, broken traffic signals, waterlogging, fallen trees, and exposed wires.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#7A6328]">
              <span>Report civic hazard</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Know Your Laws */}
          <div
            onClick={() => onNavigateTab('know_laws')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F7F9F7] border border-[#D5E0D7] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#375344] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8EFEA] text-[#375344]">
                  Zero FIR & BNS
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#375344] transition">
                Know Your Laws & Rights
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Plain-language legal rights: Zero FIR across police stations, Good Samaritan immunity, and Sakala guarantee.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#375344]">
              <span>Read legal guides</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Verified Karnataka Government Directory */}
          <div
            onClick={() => onNavigateTab('govt_directory')}
            className="cursor-pointer p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F2F7F6] border border-[#CCDCD9] shadow-xs hover:shadow transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#DCE8E5] text-[#2F5952] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE8E5] text-[#2F5952]">
                  Official 112 & KSP
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1E282D] group-hover:text-[#2F5952] transition">
                Government Services Directory
              </h4>
              <p className="text-xs text-[#657780] mt-1 leading-relaxed">
                Direct phone numbers and portals for Karnataka State Police, Cybercrime 1930, BBMP, and BESCOM.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#2F5952]">
              <span>Browse official contacts</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Local Hazards in Bengaluru */}
      <div className="bg-[#FFFFFF] border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1E282D]">Verified Local Hazard Alerts</h3>
              <p className="text-[11px] text-[#657780]">Bengaluru Traffic & Municipal Feeds</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('hazard_map')}
            className="cursor-pointer text-xs font-semibold text-[#2F5952] hover:underline"
          >
            View Live Safety Map
          </button>
        </div>

        <div className="space-y-2.5">
          {hazards.slice(0, 3).map((hazard) => (
            <div
              key={hazard.id}
              className="p-3 rounded-2xl bg-[#FBFDFB] border border-[#E6ECE7] flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E282D]">{hazard.title}</span>
                  {hazard.isVerified && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Verified by {hazard.verifiedBy}
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed">{hazard.description}</p>
                <div className="text-[10px] text-neutral-400">
                  Ward: {hazard.ward} • Valid until {new Date(hazard.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  hazard.severity === 'HIGH'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {hazard.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
