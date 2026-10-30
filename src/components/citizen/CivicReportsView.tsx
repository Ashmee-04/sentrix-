import React, { useState } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  Waves,
  Zap,
  Trees,
  Trash2,
  Footprints,
  Building,
  CheckCircle2,
  ExternalLink,
  Send,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { UserProfile, IncidentReport } from '../../types';
import { StorageService } from '../../services/storage';
import { getCurrentBengaluruLocation } from '../../services/device';
import { triageIncident } from '../../services/geminiService';

interface CivicReportsViewProps {
  user: UserProfile;
  onReportSubmitted: (report: IncidentReport) => void;
}

const CIVIC_CATEGORIES = [
  { id: 'pothole', label: 'Road Pothole / Crater', dept: 'BBMP', icon: Footprints },
  { id: 'traffic_signal', label: 'Broken Traffic Signal', dept: 'BTP', icon: Lightbulb },
  { id: 'waterlogging', label: 'Waterlogging & Flooding', dept: 'BBMP', icon: Waves },
  { id: 'exposed_wire', label: 'Exposed / Snapped Live Wire', dept: 'BESCOM', icon: Zap },
  { id: 'fallen_tree', label: 'Fallen Tree / Heavy Branch', dept: 'BBMP', icon: Trees },
  { id: 'garbage', label: 'Illegal Garbage Dump', dept: 'BBMP', icon: Trash2 },
  { id: 'drainage', label: 'Open Drain / Missing Manhole', dept: 'BWSSB', icon: AlertTriangle },
  { id: 'footpath', label: 'Encroached / Broken Footpath', dept: 'BBMP', icon: Building },
];

const BENGALURU_WARDS = [
  'Indiranagar (Ward 112)',
  'Koramangala (Ward 151)',
  'BTM Layout (Ward 176)',
  'HSR Layout (Ward 174)',
  'Whitefield / Kadugodi (Ward 84)',
  'Malleshwaram (Ward 65)',
  'Jayanagar (Ward 153)',
  'Shantalanagar / MG Road (Ward 111)',
  'Bellandur (Ward 150)',
  'Hebbal (Ward 21)',
];

export const CivicReportsView: React.FC<CivicReportsViewProps> = ({
  user,
  onReportSubmitted,
}) => {
  const [hazardType, setHazardType] = useState('pothole');
  const [ward, setWard] = useState(BENGALURU_WARDS[0]);
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  const activeCategoryConfig = CIVIC_CATEGORIES.find((c) => c.id === hazardType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe the civic issue.');
      return;
    }

    setIsSubmitting(true);
    const loc = await getCurrentBengaluruLocation();
    const eventId = `SNX-CIV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: IncidentReport = {
      id: eventId,
      type: 'civic_hazard',
      category: hazardType,
      title: `${activeCategoryConfig?.label || 'Civic Issue'} (${ward})`,
      description,
      location: {
        ...loc,
        landmark: landmark || 'Bengaluru Roadway',
        ward,
      },
      status: 'awaiting_review',
      severity: hazardType === 'exposed_wire' || hazardType === 'drainage' ? 'HIGH' : 'MODERATE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: user.name,
      citizenPhone: user.phone,
      isAnonymous: false,
      civicDetails: {
        hazardType: hazardType as any,
        department: (activeCategoryConfig?.dept as any) || 'BBMP',
        officialReferenceNumber: `${activeCategoryConfig?.dept}-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      },
      actionNotes: [
        {
          id: `note-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'SENTRIX Civic Dispatch',
          role: 'Municipal Coordinator',
          note: `Complaint registered and routed to ${activeCategoryConfig?.dept} jurisdictional ward engineer.`,
        },
      ],
    };

    // AI Triage
    try {
      const triage = await triageIncident({
        category: 'civic',
        description: `Civic issue: ${activeCategoryConfig?.label}, department: ${activeCategoryConfig?.dept}. ${description}`,
        location: `${landmark}, ${ward}`,
      });
      newReport.triage = triage;
      newReport.severity = triage.severity;
    } catch {}

    StorageService.saveIncident(newReport);
    StorageService.addAuditLog({
      actorName: user.name,
      actorRole: 'Citizen Resident',
      action: 'CIVIC_COMPLAINT_FILED',
      targetId: newReport.id,
      details: `Filed civic report for ${hazardType} in ${ward}`,
    });

    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      title: `Civic Complaint Logged (${newReport.id})`,
      message: `Registered with ${newReport.civicDetails?.department} queue for field assessment.`,
      type: 'complaint_update',
      severity: newReport.severity,
      timestamp: new Date().toISOString(),
      isRead: false,
      deepLinkTarget: `report:${newReport.id}`,
    });

    setIsSubmitting(false);
    setSubmittedReport(newReport);
    onReportSubmitted(newReport);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#7A6328] uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" />
          BBMP • BESCOM • BWSSB • Bengaluru Traffic Police
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
          Civic Hazard & Infrastructure Complaint Box
        </h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Report road craters, fallen trees, live electrical wires, and waterlogging. Track ward-level progress under the Karnataka Sakala framework.
        </p>
      </div>

      {/* Official Channel vs In-App distinction card */}
      <div className="bg-[#FAF8F2] border border-[#EBE3C8] rounded-2xl p-4 text-xs text-[#6F5B24] flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#5C4D26]">
            <span>Official Government Integration Clarification</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Filing below creates a validated tracking case inside SENTRIX and routes to civic field teams. To file directly into BBMP’s proprietary database, use official portals below:
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <a
              href="https://bbmp.gov.in"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer font-bold underline text-[#7A6328] hover:text-[#5C4D26] inline-flex items-center gap-1"
            >
              BBMP Sahaya Portal <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://bescom.karnataka.gov.in"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer font-bold underline text-[#7A6328] hover:text-[#5C4D26] inline-flex items-center gap-1"
            >
              BESCOM 1912 Helpline <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {submittedReport ? (
        <div className="bg-white border border-[#D5E0D7] rounded-3xl p-6 sm:p-8 space-y-4 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#EBF5ED] text-[#2F5952] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1E282D]">
            Civic Complaint Logged Successfully
          </h3>
          <p className="text-xs text-[#2F5952] font-mono">
            Reference Tracking ID: {submittedReport.id}
          </p>
          <div className="bg-[#FAFBF9] border border-[#E4EAE5] rounded-2xl p-4 text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">Department:</span>
              <span className="font-bold text-gray-800">{submittedReport.civicDetails?.department}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-gray-500">Jurisdiction Ward:</span>
              <span className="font-semibold text-gray-800">{submittedReport.location.ward}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Official Sakala Queue Ref:</span>
              <span className="font-mono text-gray-800">{submittedReport.civicDetails?.officialReferenceNumber}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setSubmittedReport(null)}
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#2F5952] text-white font-bold text-xs"
            >
              Log Another Civic Hazard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-7 space-y-5 shadow-xs">
          {/* Categories Grid */}
          <div>
            <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-2">
              1. Type of Civic Hazard
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CIVIC_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = hazardType === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setHazardType(cat.id)}
                    className={`cursor-pointer p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-[#7A6328] bg-[#FAF8F2] ring-2 ring-[#7A6328]/20'
                        : 'border-[#E4EAE5] bg-white hover:bg-[#F7F8F4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#7A6328]' : 'text-neutral-500'}`} />
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {cat.dept}
                      </span>
                    </div>
                    <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#7A6328]' : 'text-[#34434A]'}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ward & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E282D] mb-1">
                Bruhat Bengaluru Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              >
                {BENGALURU_WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E282D] mb-1">
                Specific Landmark / Cross Road
              </label>
              <input
                type="text"
                required
                placeholder="e.g. In front of metro pillar 104 or opposite bank"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-1">
              2. Description of Danger / Defect
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe depth of crater, water stagnation level, wire proximity to footpath, or pedestrian risk..."
              className="w-full text-xs p-3 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full py-4 rounded-2xl bg-[#7A6328] hover:bg-[#635020] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'TRANSMITTING COMPLAINT...' : 'SUBMIT CIVIC COMPLAINT'}
          </button>
        </form>
      )}
    </div>
  );
};
