import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  EyeOff,
  Building,
  HeartHandshake,
  Compass,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';

interface WomensSafetyViewProps {
  onTriggerQuickExit: () => void;
  onOpenSosModal: (category?: any) => void;
}

const WOMEN_POLICE_STATIONS = [
  { name: 'Halasuru Gate Women Police Station', phone: '080-22942548', area: 'Central Bengaluru / Nrupathunga Rd' },
  { name: 'Basavanagudi Women Police Station', phone: '080-22942588', area: 'South Bengaluru / Basavanagudi' },
  { name: 'Shivajinagar Women Police Station', phone: '080-22942555', area: 'East Bengaluru / Russell Market' },
  { name: 'Bengaluru City Police Parihar Headquarters', phone: '080-22943225', area: 'Infantry Road Police Commissionerate' },
];

export const WomensSafetyView: React.FC<WomensSafetyViewProps> = ({
  onTriggerQuickExit,
  onOpenSosModal,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header with discreet exit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#554A6B] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            Verified Karnataka Resources
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
            Karnataka Women's Safety & Legal Assistance
          </h2>
          <p className="text-xs sm:text-sm text-[#657780] mt-1">
            Dedicated helplines, Pink Hoysala patrol units, and Parihar counseling desks operated by Bengaluru City Police.
          </p>
        </div>

        <button
          onClick={onTriggerQuickExit}
          className="cursor-pointer self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAE6F2] hover:bg-[#DDD8E6] text-[#554A6B] border border-[#DDD8E6] text-xs font-semibold transition"
          title="Switch immediately to neutral weather forecast screen"
        >
          <EyeOff className="w-4 h-4" />
          <span>Discreet Exit</span>
        </button>
      </div>

      {/* Emergency Calling Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 112 */}
        <div className="bg-white border-2 border-[#F2D7D7] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83227] bg-[#FCE8E6] px-2 py-0.5 rounded-full">
              24/7 Universal Emergency
            </span>
            <h3 className="text-lg font-black text-[#1E282D] mt-1">ERSS 112 Karnataka</h3>
            <p className="text-xs text-[#657780] leading-relaxed">
              GPS-tracked Police Hoysala dispatch with average response time under 7 minutes in urban Bengaluru.
            </p>
          </div>
          <a
            href="tel:112"
            className="cursor-pointer mt-4 py-3 rounded-2xl bg-[#D94336] hover:bg-[#C2362A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            DIAL 112 NOW
          </a>
        </div>

        {/* Parihar / 1091 */}
        <div className="bg-white border-2 border-[#DDD8E6] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#554A6B] bg-[#EAE6F2] px-2 py-0.5 rounded-full">
              Women Support Helpline
            </span>
            <h3 className="text-lg font-black text-[#1E282D] mt-1">Parihar (1091)</h3>
            <p className="text-xs text-[#657780] leading-relaxed">
              Vanitha Sahayavani Bengaluru City Police center providing rescue, shelter, and legal guidance.
            </p>
          </div>
          <a
            href="tel:1091"
            className="cursor-pointer mt-4 py-3 rounded-2xl bg-[#554A6B] hover:bg-[#463D58] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            DIAL 1091 HELPLINE
          </a>
        </div>

        {/* NCW / Cyber */}
        <div className="bg-white border-2 border-[#CCDCD0] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F5952] bg-[#DCE8DF] px-2 py-0.5 rounded-full">
              Cyber & Legal
            </span>
            <h3 className="text-lg font-black text-[#1E282D] mt-1">Cybercell 1930</h3>
            <p className="text-xs text-[#657780] leading-relaxed">
              Toll-free emergency reporting for cyber stalking, morphing, and non-consensual image dissemination.
            </p>
          </div>
          <a
            href="tel:1930"
            className="cursor-pointer mt-4 py-3 rounded-2xl bg-[#2F5952] hover:bg-[#1E3B36] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            DIAL 1930 CYBERCELL
          </a>
        </div>
      </div>

      {/* Pink Hoysala Patrol Information */}
      <div className="bg-[#FFFFFF] border border-[#CCDCD0] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EAE6F2] text-[#554A6B] flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E282D]">
              Bengaluru Pink Hoysala Dedicated Patrol Fleet
            </h3>
            <p className="text-xs text-[#657780]">
              Specialized women-officer staffed patrol vehicles deployed across high-transit zones
            </p>
          </div>
        </div>

        <p className="text-xs text-[#34434A] leading-relaxed">
          Bengaluru City Police operates 51+ Pink Hoysala vehicles stationed near garment factories, IT tech parks (Electronic City, Manyata, Whitefield), women's colleges (Mount Carmel, Jyoti Nivas), and Namma Metro stations. Staffed by trained women police personnel, Pink Hoysala units provide emergency escorts, crowd dispersion, and rapid on-scene intervention.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] space-y-1">
            <strong className="text-[#1E282D] block">Operational Dispatch Protocol:</strong>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              When an SOS or transit report with harassment/stalking is flagged, the nearest Pink Hoysala unit is automatically tasked via the central Police Command Center.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] space-y-1">
            <strong className="text-[#1E282D] block">Discreet Reporting Safeguards:</strong>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Under Section 73 BNS, victim identities are not disclosed to external entities or published in general records without explicit written consent.
            </p>
          </div>
        </div>
      </div>

      {/* Verified All-Women Police Stations */}
      <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#2F5952]" />
            <h3 className="text-sm font-bold text-[#1E282D]">
              Bengaluru City Women Police Stations (Vanitha Thana)
            </h3>
          </div>
          <span className="text-[11px] text-[#657780]">Jurisdictional Desks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {WOMEN_POLICE_STATIONS.map((st, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#FBFDFB] border border-[#E4EAE5] flex items-center justify-between gap-3"
            >
              <div>
                <span className="font-bold text-[#1E282D] block">{st.name}</span>
                <span className="text-[11px] text-neutral-500">{st.area}</span>
              </div>
              <a
                href={`tel:${st.phone}`}
                className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#E8EFEA] hover:bg-[#DCE8DF] text-[#2F5952] font-mono font-bold text-[11px] shrink-0 flex items-center gap-1 transition"
              >
                <PhoneCall className="w-3 h-3" />
                {st.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Truthfulness & Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EBE3C8] text-[11px] text-[#63552A] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#A17C18] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Contact Verification:</strong> All contact numbers and department designations above are sourced from Bengaluru City Police and the Government of Karnataka. SENTRIX does not guarantee patrol vehicle arrival times in private disputes and provides these channels for transparent citizen access.
        </p>
      </div>
    </div>
  );
};
