import React, { useState } from 'react';
import {
  Building2,
  PhoneCall,
  ExternalLink,
  Search,
  Shield,
  LifeBuoy,
  FileCheck,
  Zap,
  Info,
} from 'lucide-react';
import { INITIAL_GOVT_DIRECTORY } from '../../services/storage';
import { GovtDirectoryItem } from '../../types';

export const GovtDirectoryView: React.FC = () => {
  const [items] = useState<GovtDirectoryItem[]>(INITIAL_GOVT_DIRECTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchTerm) {
      const text = (item.name + ' ' + item.description + ' ' + item.phone).toLowerCase();
      if (!text.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          Karnataka State & Bengaluru Metropolitan Portals
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
          Government Services & Helplines Directory
        </h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Verified directory of emergency desks, police control rooms, municipal utilities, and free legal aid.
        </p>
      </div>

      {/* Official Distinction Banner */}
      <div className="bg-[#FAF8F2] border border-[#EBE3C8] rounded-2xl p-4 text-xs text-[#6F5B24] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#A17C18] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Portal Navigation vs In-App Filing:</strong> Clicking external links opens the official Karnataka State Government portal in an external secure tab. Phone numbers connect to your mobile phone’s standard cellular telephone dialer.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-2xl border border-[#E0E7E2]">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'emergency', label: 'Emergency (112/108)' },
            { id: 'women_child', label: 'Women & Child' },
            { id: 'police', label: 'Police & Cyber' },
            { id: 'civic_utilities', label: 'Civic & Power' },
            { id: 'legal_aid', label: 'Legal Aid' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#2F5952] shadow-xs'
                  : 'text-[#657780] hover:text-[#34434A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search BBMP, Police, 112..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-60 text-xs pl-8 pr-3 py-2 rounded-xl border border-[#D5E0D7] bg-white focus:ring-2 focus:ring-[#2F5952]"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#CCDCD0] transition space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5952]">
                  {item.category.replace('_', ' ')}
                </span>
                {item.isEmergencyLine && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    24/7 Priority
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-[#1E282D] leading-snug">{item.name}</h3>
              <p className="text-xs text-[#657780] leading-relaxed">{item.description}</p>
              {item.address && (
                <div className="text-[11px] text-neutral-500 pt-1">
                  <strong>HQ:</strong> {item.address}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F2F5F3] flex items-center justify-between gap-2">
              <a
                href={`tel:${item.phone}`}
                className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#2F5952] hover:bg-[#1E3B36] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {item.phone}</span>
              </a>

              {item.websiteUrl && (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer px-3 py-2 rounded-xl bg-[#F7F8F4] hover:bg-[#EAEFEA] border border-[#E0E7E2] text-[#2F5952] font-semibold text-xs flex items-center gap-1 transition"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#6F9C95]" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
