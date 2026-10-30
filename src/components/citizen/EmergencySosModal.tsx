import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  AlertTriangle,
  PhoneCall,
  Mic,
  MicOff,
  MapPin,
  Users,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  Car,
  HeartPulse,
  Flame,
  UserX,
  Radio,
  Waves,
  Shield,
  Send,
  Loader2,
} from 'lucide-react';
import {
  EmergencyCategory,
  LocationCoordinates,
  IncidentReport,
  UserProfile,
  IncidentSeverity,
} from '../../types';
import { createSpeechListener, getCurrentBengaluruLocation } from '../../services/device';
import { triageIncident } from '../../services/geminiService';
import { StorageService } from '../../services/storage';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  initialCategory?: EmergencyCategory;
  onSosDispatched: (incident: IncidentReport) => void;
}

const CATEGORY_ITEMS: {
  id: EmergencyCategory;
  label: string;
  icon: any;
  color: string;
  defaultSeverity: IncidentSeverity;
}[] = [
  { id: 'road_accident', label: 'Road Accident', icon: Car, color: 'text-amber-700 bg-amber-50 border-amber-200', defaultSeverity: 'HIGH' },
  { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'text-rose-700 bg-rose-50 border-rose-200', defaultSeverity: 'CRITICAL' },
  { id: 'harassment', label: 'Harassment / Assault', icon: ShieldAlert, color: 'text-purple-700 bg-purple-50 border-purple-200', defaultSeverity: 'CRITICAL' },
  { id: 'fire', label: 'Fire & Rescue', icon: Flame, color: 'text-orange-700 bg-orange-50 border-orange-200', defaultSeverity: 'CRITICAL' },
  { id: 'personal_threat', label: 'Personal Threat', icon: UserX, color: 'text-red-700 bg-red-50 border-red-200', defaultSeverity: 'HIGH' },
  { id: 'dangerous_crowd', label: 'Dangerous Crowd', icon: Users, color: 'text-stone-700 bg-stone-50 border-stone-200', defaultSeverity: 'HIGH' },
  { id: 'flood', label: 'Flood / Waterlogging', icon: Waves, color: 'text-blue-700 bg-blue-50 border-blue-200', defaultSeverity: 'MODERATE' },
  { id: 'missing_vulnerable', label: 'Missing Person', icon: Radio, color: 'text-teal-700 bg-teal-50 border-teal-200', defaultSeverity: 'HIGH' },
  { id: 'other', label: 'Other Emergency', icon: Shield, color: 'text-gray-700 bg-gray-50 border-gray-200', defaultSeverity: 'MODERATE' },
];

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  user,
  initialCategory = 'road_accident',
  onSosDispatched,
}) => {
  const [step, setStep] = useState<'configure' | 'countdown' | 'dispatched'>('configure');
  const [category, setCategory] = useState<EmergencyCategory>(initialCategory);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    user.contacts.filter((c) => c.notifyOnSos).map((c) => c.id)
  );

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speechRecognizerRef = useRef<any>(null);

  // Countdown state
  const [countdown, setCountdown] = useState(5);
  const countdownTimerRef = useRef<any>(null);

  // Dispatched report state
  const [dispatchedIncident, setDispatchedIncident] = useState<IncidentReport | null>(null);
  const [isTriaging, setIsTriaging] = useState(false);

  // Fetch initial location when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('configure');
      setCountdown(5);
      setLocating(true);
      getCurrentBengaluruLocation()
        .then((loc) => {
          setLocation(loc);
          setLocating(false);
        })
        .catch(() => setLocating(false));
    } else {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    }
  }, [isOpen]);

  // Handle Speech Recognition toggle
  const toggleSpeech = () => {
    if (isListening) {
      if (speechRecognizerRef.current) speechRecognizerRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      const listener = createSpeechListener(
        (transcript) => {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (listening) => setIsListening(listening),
        (err) => setSpeechError(err),
        user.preferredLanguage
      );

      speechRecognizerRef.current = listener;
      listener.start();
    }
  };

  const startCountdown = () => {
    setStep('countdown');
    setCountdown(5);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleFinalDispatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setStep('configure');
    setCountdown(5);
  };

  const handleFinalDispatch = async () => {
    setStep('dispatched');
    setIsTriaging(true);

    const eventId = `SNX-BLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const categoryConfig = CATEGORY_ITEMS.find((c) => c.id === category);

    const defaultLoc: LocationCoordinates = location || {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracyMeters: 10,
      address: 'Indiranagar 100 Feet Rd, Bengaluru',
      landmark: 'Near Indiranagar Junction',
      ward: 'Indiranagar (Ward 112)',
    };

    // Create base incident
    const newIncident: IncidentReport = {
      id: eventId,
      type: 'sos',
      category,
      title: `${categoryConfig?.label || 'Emergency'} SOS Alert`,
      description: description || `Emergency SOS triggered by ${user.name} for ${categoryConfig?.label}`,
      audioTranscript: description,
      location: defaultLoc,
      status: 'received',
      severity: categoryConfig?.defaultSeverity || 'HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: user.name,
      citizenPhone: user.phone,
      isAnonymous: false,
      actionNotes: [
        {
          id: `note-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'SENTRIX Dispatch System',
          role: 'Automated Dispatcher',
          note: `Emergency SOS event logged. Alert signal sent to Bengaluru ERSS 112 gateway (Sandbox) and ${selectedContactIds.length} trusted contacts.`,
        },
      ],
    };

    // Run AI Triage in background
    try {
      const triageResult = await triageIncident({
        category: categoryConfig?.label || category,
        description: newIncident.description,
        location: `${defaultLoc.address}, ${defaultLoc.ward}`,
        audioTranscript: description,
      });

      newIncident.triage = triageResult;
      newIncident.severity = triageResult.severity;
      newIncident.status = 'awaiting_review';
      
      // Auto-assign mock unit for high/critical incidents to simulate real life
      if (triageResult.severity === 'CRITICAL' || triageResult.severity === 'HIGH') {
        newIncident.assignedUnitName = category === 'harassment' ? 'Pink Hoysala 14' : 'Hoysala Patrol 08';
        newIncident.status = 'assigned';
        newIncident.actionNotes.push({
          id: `note-auto-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Command Center AI & Dispatcher',
          role: 'Police Control Officer',
          note: `Immediate dispatch authorized. Assigned ${newIncident.assignedUnitName}. ETA 4-6 minutes.`,
        });
      }
    } catch (err) {
      console.warn('AI Triage error:', err);
    } finally {
      setIsTriaging(false);
    }

    // Save to storage
    StorageService.saveIncident(newIncident);
    StorageService.addAuditLog({
      actorName: user.name,
      actorRole: 'Citizen User',
      action: 'SOS_TRIGGERED',
      targetId: newIncident.id,
      details: `Citizen triggered SOS for ${newIncident.category} at ${defaultLoc.address}`,
      ipMock: 'Live Geolocation Terminal',
    });

    // Notify user in Notifications Inbox
    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      title: `Emergency SOS Transmitted (${newIncident.id})`,
      message: `Emergency signal registered. Dial 112 directly if safe. Assigned to ${newIncident.assignedUnitName || 'ERSS Queue'}.`,
      type: 'sos_update',
      severity: newIncident.severity,
      timestamp: new Date().toISOString(),
      isRead: false,
      deepLinkTarget: `report:${newIncident.id}`,
    });

    setDispatchedIncident(newIncident);
    onSosDispatched(newIncident);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-[#E4EAE5] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FFF2F0] border-b border-[#F7D8D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#D94336] text-white animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#8A1F16]">Bengaluru Emergency SOS</h3>
              <p className="text-[11px] text-[#A83227]">Direct connection to ERSS 112 & Trusted Contacts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full text-[#A83227] hover:bg-[#FCDFD9] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CONFIGURE */}
        {step === 'configure' && (
          <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
            {/* Category Selector Grid */}
            <div>
              <label className="block text-xs font-bold text-[#1E282D] mb-2 uppercase tracking-wider">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`cursor-pointer p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                        isSelected
                          ? 'border-[#D94336] bg-[#FDF1EF] ring-2 ring-[#D94336]/30'
                          : 'border-[#E4EAE5] bg-white hover:bg-[#F7F8F4]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D94336]' : 'text-neutral-600'}`} />
                      <span
                        className={`text-[11px] font-semibold leading-tight ${
                          isSelected ? 'text-[#8A1F16]' : 'text-[#34434A]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice and Text Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-1.5">
                  2. Voice Note or Incident Notes (Optional)
                </label>
                <button
                  onClick={toggleSpeech}
                  className={`cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-[#DCE8DF] text-[#2F5952] hover:bg-[#CDDFD1]'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Stop Mic' : 'Voice Input'}</span>
                </button>
              </div>

              {speechError && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded mb-1.5">
                  {speechError}
                </p>
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Speak or type what happened, landmarks, suspect appearance, or injuries..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-[#D5E0D7] focus:outline-none focus:ring-2 focus:ring-[#2F5952] bg-[#FAFBF9]"
              />
            </div>

            {/* GPS Location Banner */}
            <div className="bg-[#F1F6F3] border border-[#DCE8DF] rounded-xl p-3 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#2F5952] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="font-semibold text-[#1E282D]">Current Location Telemetry</div>
                {locating ? (
                  <p className="text-neutral-500">Acquiring high-accuracy GPS coordinates...</p>
                ) : location ? (
                  <div className="text-neutral-600 mt-0.5">
                    <span>{location.address}</span>
                    <span className="block text-[11px] text-[#2F5952] font-mono mt-0.5">
                      Lat: {location.latitude}, Lng: {location.longitude} (±{location.accuracyMeters}m accuracy)
                    </span>
                  </div>
                ) : (
                  <p className="text-neutral-500">Location service locked to Bengaluru Central.</p>
                )}
              </div>
            </div>

            {/* Trusted Contacts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#2F5952]" />
                  3. Emergency Contacts to Alert
                </label>
                <span className="text-[11px] text-neutral-500">
                  {selectedContactIds.length} of {user.contacts.length} selected
                </span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {user.contacts.map((contact) => {
                  const isChecked = selectedContactIds.includes(contact.id);
                  return (
                    <label
                      key={contact.id}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'border-[#CCDCD0] bg-[#F4F8F5]'
                          : 'border-neutral-200 bg-white opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContactIds([...selectedContactIds, contact.id]);
                            } else {
                              setSelectedContactIds(selectedContactIds.filter((id) => id !== contact.id));
                            }
                          }}
                          className="rounded text-[#2F5952] focus:ring-[#2F5952]"
                        />
                        <div>
                          <span className="font-semibold text-[#1E282D]">{contact.name}</span>
                          <span className="text-[10px] text-neutral-500 ml-1.5">({contact.relationship})</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-600">{contact.phone}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={startCountdown}
                className="cursor-pointer w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-[#D94336] hover:bg-[#C2362A] text-white font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                DISPATCH SOS ALERT NOW
              </button>

              <a
                href="tel:112"
                className="cursor-pointer w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-[#1E282D] hover:bg-[#34434A] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Direct 112 Call
              </a>
            </div>
          </div>
        )}

        {/* STEP 2: 5-SECOND ABORT COUNTDOWN */}
        {step === 'countdown' && (
          <div className="p-8 text-center space-y-6 bg-gradient-to-b from-[#FDF1EF] to-white">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#D94336]/30 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-[#D94336] text-white flex items-center justify-center text-4xl font-black shadow-lg">
                {countdown}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black text-[#8A1F16]">TRANSMITTING EMERGENCY ALERT</h4>
              <p className="text-xs text-[#5C231E] max-w-sm mx-auto mt-1">
                Broadcasting incident telemetry, GPS coordinates, and contact alerts in {countdown} seconds.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#F2D7D7] max-w-sm mx-auto text-xs text-left">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Incident Category:</span>
                <span className="font-semibold text-gray-800 capitalize">{category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Contacts to Alert:</span>
                <span className="font-semibold text-gray-800">{selectedContactIds.length} Verified Contacts</span>
              </div>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <button
                onClick={cancelCountdown}
                className="cursor-pointer w-full py-3.5 px-4 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-sm transition"
              >
                Cancel / False Alarm
              </button>
              <button
                onClick={handleFinalDispatch}
                className="cursor-pointer text-xs text-[#A83227] hover:underline font-semibold block mx-auto"
              >
                Skip timer & dispatch immediately
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DISPATCHED CONFIRMATION */}
        {step === 'dispatched' && dispatchedIncident && (
          <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
            <div className="bg-[#EBF5ED] border border-[#CCDCD0] rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2F5952] text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-[#1E282D]">
                EMERGENCY ALERT REGISTERED
              </h4>
              <p className="text-xs text-[#2F5952] font-mono mt-0.5">
                Incident ID: {dispatchedIncident.id}
              </p>
            </div>

            {/* AI Triage Card */}
            <div className="bg-white border border-[#E4EAE5] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E282D]">
                  <Sparkles className="w-4 h-4 text-[#6F9C95]" />
                  <span>Automated Incident Triage</span>
                </div>
                {isTriaging ? (
                  <span className="flex items-center gap-1 text-[11px] text-[#6F9C95]">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Evaluating severity...
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dispatchedIncident.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {dispatchedIncident.severity} PRIORITY
                  </span>
                )}
              </div>

              {dispatchedIncident.triage && (
                <div className="text-xs space-y-2 text-[#34434A]">
                  <div className="p-2 rounded-xl bg-[#F7F8F4] border border-[#E4EAE5]">
                    <span className="font-semibold text-neutral-800">Assigned Agency:</span>{' '}
                    <span className="text-[#2F5952] font-bold">
                      {dispatchedIncident.triage.responsibleService}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-neutral-700 text-[11px] uppercase tracking-wide block mb-1">
                      Immediate Citizen Safety Guidance:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-neutral-600 text-[11px]">
                      {dispatchedIncident.triage.recommendedNextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery status disclosure */}
            <div className="bg-[#FFFDF5] border border-[#EBE3C8] rounded-xl p-3 text-[11px] text-[#63552A] space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A17C18]" />
                Honest Transmission Status
              </div>
              <p>
                • <strong>ERSS 112 Gateway:</strong> Handled in development sandbox mode.
              </p>
              <p>
                • <strong>Trusted Contacts SMS:</strong> Simulation payload generated for{' '}
                {selectedContactIds.length} recipients.
              </p>
              <p className="text-[#8B3B26] font-medium pt-1">
                If life is in immediate jeopardy, please tap below to dial 112 on standard cellular voice network.
              </p>
            </div>

            {/* Call 112 and Done */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="tel:112"
                className="cursor-pointer flex-1 py-3 px-4 rounded-xl bg-[#D94336] hover:bg-[#C2362A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                CALL 112 NOW
              </a>

              <button
                onClick={onClose}
                className="cursor-pointer px-5 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs transition"
              >
                Track in My Reports
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
