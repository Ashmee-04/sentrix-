import React, { useState, useEffect } from 'react';
import {
  Share2,
  Clock,
  ShieldCheck,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  StopCircle,
} from 'lucide-react';
import { UserProfile, LocationShareSession, LocationCoordinates } from '../../types';
import { StorageService } from '../../services/storage';
import { getCurrentBengaluruLocation } from '../../services/device';

interface LocationShareViewProps {
  user: UserProfile;
}

export const LocationShareView: React.FC<LocationShareViewProps> = ({ user }) => {
  const [activeSession, setActiveSession] = useState<LocationShareSession | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // minutes
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    user.contacts.map((c) => c.id)
  );
  const [currentLoc, setCurrentLoc] = useState<LocationCoordinates | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const existing = StorageService.getLocationShareSession();
    if (existing && existing.isActive && new Date(existing.expiresAt) > new Date()) {
      setActiveSession(existing);
    }
    getCurrentBengaluruLocation().then((loc) => setCurrentLoc(loc));
  }, []);

  const handleStartSharing = () => {
    if (selectedContactIds.length === 0) {
      alert('Please select at least one trusted contact to share your live journey with.');
      return;
    }

    const defaultLoc = currentLoc || {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracyMeters: 10,
      address: 'Indiranagar 100 Feet Rd, Bengaluru',
      ward: 'Ward 112',
    };

    const session: LocationShareSession = {
      id: `share-${Date.now()}`,
      startTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + selectedDuration * 60 * 1000).toISOString(),
      durationMinutes: selectedDuration,
      recipientContactIds: selectedContactIds,
      currentLocation: defaultLoc,
      isActive: true,
      lastPingTime: new Date().toISOString(),
    };

    StorageService.saveLocationShareSession(session);
    setActiveSession(session);

    StorageService.addAuditLog({
      actorName: user.name,
      actorRole: 'Citizen User',
      action: 'LOCATION_SHARE_STARTED',
      targetId: session.id,
      details: `Live journey tracking shared with ${selectedContactIds.length} contacts for ${selectedDuration} mins.`,
      ipMock: 'Geolocation API',
    });

    StorageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Live Location Sharing Active',
      message: `Your live route is being broadcast to ${selectedContactIds.length} trusted contacts. Expires in ${selectedDuration} mins.`,
      type: 'safety_advisory',
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  };

  const handleStopSharing = () => {
    if (activeSession) {
      const updated: LocationShareSession = {
        ...activeSession,
        isActive: false,
      };
      StorageService.saveLocationShareSession(null);
      setActiveSession(null);

      StorageService.addAuditLog({
        actorName: user.name,
        actorRole: 'Citizen User',
        action: 'LOCATION_SHARE_STOPPED',
        targetId: activeSession.id,
        details: 'Citizen manually terminated live location broadcast session.',
      });
    }
  };

  const shareableUrl = `https://sentrix.karnataka.gov.in/track?session=${activeSession?.id || 'live-blr'}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A7B] uppercase tracking-wider mb-1">
          <Share2 className="w-4 h-4" />
          Consent-Based Safety Telemetry
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">
          Live Journey & Location Sharing
        </h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Share your real-time GPS location with trusted contacts during commutes, late-night transit, or unfamiliar routes. You can terminate sharing at any second.
        </p>
      </div>

      {/* Active Session Card */}
      {activeSession && activeSession.isActive ? (
        <div className="bg-[#EBF3F8] border-2 border-[#BCD4E6] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-sm text-[#1A415C]">LIVE SHARING ACTIVE</span>
            </div>
            <span className="text-xs font-mono text-[#2D5A7B] bg-white px-2 py-0.5 rounded-full border border-[#BCD4E6]">
              Session: {activeSession.id}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#CCDCE8] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Last Telemetry Ping:</span>
              <span className="font-semibold text-neutral-800">
                {new Date(activeSession.lastPingTime).toLocaleTimeString()} (GPS Locked)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Expires At:</span>
              <span className="font-semibold text-neutral-800">
                {new Date(activeSession.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Recipients Notified:</span>
              <span className="font-semibold text-[#2D5A7B]">
                {activeSession.recipientContactIds.length} Trusted Contacts
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-neutral-500 truncate mr-2">{shareableUrl}</span>
              <button
                onClick={handleCopyLink}
                className="cursor-pointer text-xs font-bold text-[#2D5A7B] hover:text-[#1A415C] flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={handleStopSharing}
            className="cursor-pointer w-full py-3.5 rounded-2xl bg-[#D94336] hover:bg-[#C2362A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            <StopCircle className="w-5 h-5" />
            STOP SHARING LOCATION NOW
          </button>
        </div>
      ) : (
        /* Configuration Card */
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1E282D] uppercase tracking-wider mb-2">
              1. Sharing Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '15 Minutes', mins: 15, sub: 'Short commute' },
                { label: '1 Hour', mins: 60, sub: 'Metro / Cab ride' },
                { label: '4 Hours', mins: 240, sub: 'Evening out' },
                { label: '8 Hours', mins: 480, sub: 'Night transit' },
              ].map((item) => (
                <button
                  key={item.mins}
                  onClick={() => setSelectedDuration(item.mins)}
                  className={`cursor-pointer p-3 rounded-2xl border text-left transition ${
                    selectedDuration === item.mins
                      ? 'border-[#2D5A7B] bg-[#F0F5FA] ring-2 ring-[#2D5A7B]/20'
                      : 'border-[#E4EAE5] bg-white hover:bg-[#F7F8F4]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#1E282D]">{item.label}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trusted Contacts Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2F5952]" />
                2. Select Recipients
              </label>
              <span className="text-[11px] text-neutral-500">
                {selectedContactIds.length} selected
              </span>
            </div>

            <div className="space-y-2">
              {user.contacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact.id);
                return (
                  <label
                    key={contact.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-[#CCDCE8] bg-[#F5F8FA]'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContactIds([...selectedContactIds, contact.id]);
                          } else {
                            setSelectedContactIds(selectedContactIds.filter((id) => id !== contact.id));
                          }
                        }}
                        className="rounded text-[#2D5A7B] focus:ring-[#2D5A7B]"
                      />
                      <div>
                        <div className="font-bold text-[#1E282D]">{contact.name}</div>
                        <div className="text-[11px] text-neutral-500">{contact.relationship}</div>
                      </div>
                    </div>
                    <span className="font-mono text-neutral-600 text-[11px]">{contact.phone}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="bg-[#F7F9F7] border border-[#DCE8DF] rounded-2xl p-3.5 text-xs text-[#2F5952] flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Zero Persistent Tracking Guarantee</div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Your location coordinates are encrypted and accessible exclusively by your selected contacts during the specified window. Location broadcast ceases immediately when duration elapses or upon tapping stop.
              </p>
            </div>
          </div>

          {/* Start Sharing Button */}
          <button
            onClick={handleStartSharing}
            className="cursor-pointer w-full py-4 rounded-2xl bg-[#2D5A7B] hover:bg-[#1E435E] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            START LIVE LOCATION BROADCAST
          </button>
        </div>
      )}
    </div>
  );
};
