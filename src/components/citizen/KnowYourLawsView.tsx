import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { INITIAL_LAWS } from '../../services/storage';
import { LawArticle } from '../../types';

export const KnowYourLawsView: React.FC = () => {
  const [laws] = useState<LawArticle[]>(INITIAL_LAWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(INITIAL_LAWS[0]?.id || null);

  const filtered = laws.filter((l) => {
    if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
    if (searchTerm) {
      const text = (l.title + ' ' + l.shortSummary + ' ' + l.legalSections + ' ' + l.plainLanguageExplanation).toLowerCase();
      if (!text.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#375344] uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          Verified Karnataka & National Statutory Codes
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
          Know Your Laws & Citizen Protections
        </h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Plain-language summaries of the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), Motor Vehicles Act, and Karnataka Sakala Act.
        </p>
      </div>

      {/* Mandatory Statutory Disclaimer */}
      <div className="bg-[#FAF9F5] border border-[#EBE3C8] rounded-2xl p-4 text-xs text-[#63552A] flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#A17C18] shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed text-[11px]">
          <strong className="block font-bold text-[#5C4D26]">Statutory Information Disclaimer</strong>
          The legal provisions below are for educational and civic awareness purposes only and do not constitute individualized legal counsel or court representation. For formal legal assistance, consult the Karnataka State Legal Services Authority (KSLSA) or a licensed advocate.
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-2xl border border-[#E0E7E2]">
          {[
            { id: 'all', label: 'All Legal Codes' },
            { id: 'women_safety', label: "Women's Rights" },
            { id: 'road_safety', label: 'Road & Good Samaritan' },
            { id: 'civic_rights', label: 'Sakala Civic Rights' },
            { id: 'consumer_police', label: 'Police & Arrest Rules' },
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
            placeholder="Search FIR, Section, BNS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-60 text-xs pl-8 pr-3 py-2 rounded-xl border border-[#D5E0D7] bg-white focus:ring-2 focus:ring-[#2F5952]"
          />
        </div>
      </div>

      {/* Laws List */}
      <div className="space-y-3.5">
        {filtered.map((law) => {
          const isExpanded = expandedId === law.id;
          return (
            <div
              key={law.id}
              className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 transition shadow-xs hover:border-[#CCDCD0]"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : law.id)}
                className="cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5952] border border-[#CCDCD0]">
                    {law.legalSections}
                  </div>
                  <h3 className="text-base font-bold text-[#1E282D] mt-1">{law.title}</h3>
                  <p className="text-xs text-[#657780] leading-relaxed">{law.shortSummary}</p>
                </div>

                <div className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 bg-neutral-50 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#F2F5F3] space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px] mb-1">
                      Plain-Language Explanation
                    </h4>
                    <p className="text-neutral-700 leading-relaxed bg-[#FAFBF9] p-3.5 rounded-2xl border border-[#E4EAE5]">
                      {law.plainLanguageExplanation}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px] mb-1.5">
                      Your Statutory Rights
                    </h4>
                    <ul className="space-y-1.5 pl-2">
                      {law.citizenRights.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-neutral-700 leading-relaxed">
                          <ShieldCheck className="w-4 h-4 text-[#2F5952] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#F2F5F3] text-[11px] text-[#657780]">
                    <span>
                      Official Citation Source: <strong className="text-[#1E282D]">{law.officialSource}</strong>
                    </span>
                    <span>Last Legal Review: {law.lastReviewedDate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
