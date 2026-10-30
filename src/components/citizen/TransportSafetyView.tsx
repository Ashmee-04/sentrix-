import React, { useState } from 'react';
import {
  Bus,
  Train,
  Car,
  AlertCircle,
  ShieldCheck,
  Send,
  EyeOff,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Camera,
} from 'lucide-react';
import { UserProfile, IncidentReport } from '../../types';
import { StorageService } from '../../services/storage';
import { triageIncident } from '../../services/geminiService';
import { getCurrentBengaluruLocation } from '../../services/device';

interface TransportSafetyViewProps {
  user: UserProfile;
  onReportSubmitted: (report: IncidentReport) => void;
}

const HARASSMENT_TYPES = [
  { id: 'eve_teasing', label: 'Eve-teasing & Verbal Harassment' },
  { id: 'inappropriate_touch', label: 'Inappropriate Touching / Groping' },
  { id: 'stalking', label: 'Stalking / Following off Transit' },
  { id: 'intimidation_threat', label: 'Threats & Intimidation' },
  { id: 'unsafe_stop', label: 'Unlit / Unsafe Bus Stop or Station' },
  { id: 'overcrowding_misbehavior', label: 'Overcrowding & Lewd Gestures' },
  { id: 'refusal_overcharging', label: 'Auto/Cab Driver Misbehavior / Extortion' },
  { id: 'theft', label: 'Theft / Pickpocketing' },
];

const METRO_STATIONS = [
  'Majestic (Nadaprabhu Kempegowda)',
  'Indiranagar',
  'MG Road',
  'Trinity',
  'Baiyappanahalli',
  'Whitefield (Kadugodi)',
  'Krantivira Sangolli Rayanna (City Railway Station)',
  'Jayanagar',
  'Banashankari',
  'Yeshwanthpur',
  'Peenya Industry',
  'Silk Institute',
];

export const TransportSafetyView: React.FC<TransportSafetyViewProps> = ({
  user,
  onReportSubmitted,
}) => {
  const [transportType, setTransportType] = useState<
    'bmtc_bus' | 'namma_metro' | 'auto' | 'cab' | 'bus_stop' | 'railway_station'
  >('bmtc_bus');
  const [harassmentCategory, setHarassmentCategory] = useState('eve_teasing');
  const [routeOrVehicle, setRouteOrVehicle] = useState('');
  const [metroStation, setMetroStation] = useState(METRO_STATIONS[0]);
  const [locationName, setLocationName] = useState('Indiranagar / CMH Road corridor');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a brief description of the incident.');
      return;
    }

    setIsSubmitting(true);
    const loc = await getCurrentBengaluruLocation();
    const eventId = `SNX-TRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: IncidentReport = {
      id: eventId,
      type: 'transport_safety',
      category: harassmentCategory,
      title: `Transit Harassment Report (${transportType.replace('_', ' ').toUpperCase()})`,
      description,
      location: {
        ...loc,
        address: locationName || loc.address,
        ward: 'Bengaluru Transit Corridor',
      },
      status: 'awaiting_review',
      severity: 'HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: isAnonymous ? 'Discreet Commuter' : user.name,
      citizenPhone: isAnonymous ? undefined : user.phone,
      isAnonymous,
      transportDetails: {
        transportType,
        routeOrVehicleNumber: routeOrVehicle,
        metroStation: transportType === 'namma_metro' ? metroStation : undefined,
      },
      actionNotes: [
        {
          id: `note-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'SENTRIX Transit Safety Desk',
          role: 'Transit Coordinator',
          note: `Incident registered discreetly. Shared with BMTC/Metro security and Pink Hoysala patrol units.`,
        },
      ],
    };

    // AI Safety Triage
    try {
      const triage = await triageIncident({
        category: harassmentCategory,
        description: `Transit type: ${transportType}, route/vehicle: ${routeOrVehicle}. ${description}`,
        location: locationName,
      });
      newReport.triage = triage;
      newReport.severity = triage.severity;
      newReport.assignedUnitName = 'Pink Hoysala 14 (East Sector)';
      newReport.status = 'assigned';
    } catch {
      newReport.assignedUnitName = 'Pink Hoysala Patrol';
    }

    StorageService.saveIncident(newReport);
    StorageService.addAuditLog({
      actorName: isAnonymous ? 'Anonymous Commuter' : user.name,
      actorRole: 'Citizen Commuter',
      action: 'TRANSIT_REPORT_FILED',
      targetId: newReport.id,
      details: `Filed transport safety report for ${transportType} at ${locationName}`,
    });

    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      title: `Transit Report Registered (${newReport.id})`,
      message: `Your transport safety report has been logged and assigned to Pink Hoysala patrol desk.`,
      type: 'complaint_update',
      severity: 'HIGH',
      timestamp: new Date().toISOString(),
      isRead: false,
      deepLinkTarget: `report:${newReport.id}`,
    });

    setIsSubmitting(false);
    setSubmittedReport(newReport);
    onReportSubmitted(newReport);
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-[#CCDCD0] rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#EBF5ED] text-[#2F5952] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F5952] bg-[#DCE8DF] px-2.5 py-1 rounded-full">
            Report Transmitted Discreetly
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D] mt-2">
            Reference Tracking ID: {submittedReport.id}
          </h2>
          <p className="text-xs text-[#657780] mt-1 max-w-md mx-auto leading-relaxed">
            Your report has been forwarded to the Bengaluru City Police Pink Hoysala patrol and Transit Vigilance cell.
          </p>
        </div>

        {submittedReport.triage && (
          <div className="bg-[#FAFBF9] border border-[#E4EAE5] rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#2F5952]">
              <Sparkles className="w-4 h-4 text-[#6F9C95]" />
              AI Incident Guidance
            </div>
            <p className="text-neutral-700">
              <strong>Jurisdiction:</strong> {submittedReport.triage.responsibleService}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-neutral-600 text-[11px]">
              {submittedReport.triage.recommendedNextSteps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="tel:1091"
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#554A6B] hover:bg-[#463D58] text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Parihar 1091
          </a>
          <button
            onClick={() => setSubmittedReport(null)}
            className="cursor-pointer px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs transition"
          >
            File Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
          <Bus className="w-4 h-4" />
          BMTC • Namma Metro • Auto & Transit Safety
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
          Public Transport & Women's Safety Report
        </h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Report harassment, eve-teasing, unsafe bus stops, stalking, or rogue drivers. Reports are routed to Pink Hoysala and transit authorities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-7 space-y-5 shadow-xs">
        {/* Transit Mode Selection */}
        <div>
          <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-2">
            1. Mode of Transportation
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'bmtc_bus', label: 'BMTC Bus', icon: Bus },
              { id: 'namma_metro', label: 'Namma Metro', icon: Train },
              { id: 'auto', label: 'Auto-Rickshaw', icon: Car },
              { id: 'cab', label: 'Cab / Taxi (Ola/Uber)', icon: Car },
              { id: 'bus_stop', label: 'Bus Stop / Stand', icon: MapPin },
              { id: 'railway_station', label: 'Railway Station', icon: Train },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = transportType === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setTransportType(m.id as any)}
                  className={`cursor-pointer p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-[#2F5952] bg-[#F2F7F4] ring-2 ring-[#2F5952]/20'
                      : 'border-[#E4EAE5] bg-white hover:bg-[#F7F8F4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#2F5952]' : 'text-neutral-500'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#2F5952]' : 'text-[#34434A]'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic fields based on transit type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {transportType === 'namma_metro' ? (
            <div>
              <label className="block text-xs font-semibold text-[#1E282D] mb-1">
                Metro Station
              </label>
              <select
                value={metroStation}
                onChange={(e) => setMetroStation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              >
                {METRO_STATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#1E282D] mb-1">
                Bus Route / Vehicle Number (if known)
              </label>
              <input
                type="text"
                placeholder="e.g. BMTC Route 500-D, KA-04-AB-1234"
                value={routeOrVehicle}
                onChange={(e) => setRouteOrVehicle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E282D] mb-1">
              Location / Landmark / Cross Street
            </label>
            <input
              type="text"
              placeholder="e.g. Near Indiranagar 100ft road or CMH bus stop"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
            />
          </div>
        </div>

        {/* Nature of Incident */}
        <div>
          <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-2">
            2. Incident Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {HARASSMENT_TYPES.map((cat) => (
              <label
                key={cat.id}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition ${
                  harassmentCategory === cat.id
                    ? 'border-[#2F5952] bg-[#F2F7F4] font-semibold text-[#2F5952]'
                    : 'border-[#E4EAE5] bg-white text-[#34434A]'
                }`}
              >
                <input
                  type="radio"
                  name="harassmentCategory"
                  value={cat.id}
                  checked={harassmentCategory === cat.id}
                  onChange={() => setHarassmentCategory(cat.id)}
                  className="text-[#2F5952] focus:ring-[#2F5952]"
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-1">
            3. Detailed Description
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred, suspect appearance, clothing, time, behaviour, or words spoken..."
            className="w-full text-xs p-3 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] focus:ring-2 focus:ring-[#2F5952]"
          />
        </div>

        {/* Anonymous & Privacy Preference */}
        <div className="bg-[#F7F8F4] border border-[#E0E7E2] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-5 h-5 text-[#554A6B]" />
            <div>
              <div className="text-xs font-bold text-[#1E282D]">Discreet Anonymous Filing</div>
              <p className="text-[11px] text-[#657780]">
                Mask your identity and phone number from public records and patrol notes.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded text-[#2F5952] focus:ring-[#2F5952] cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full py-4 rounded-2xl bg-[#2F5952] hover:bg-[#1E3B36] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'TRANSMITTING REPORT...' : 'SUBMIT TRANSIT REPORT SECURELY'}
        </button>
      </form>
    </div>
  );
};
