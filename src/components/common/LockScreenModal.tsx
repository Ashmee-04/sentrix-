import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Flashlight,
  Heart,
  PhoneCall,
  ShieldAlert,
  Info,
  Lock,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { sirenPlayer } from '../../services/device';
import { UserProfile } from '../../types';

interface LockScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onTriggerSos: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({
  isOpen,
  onClose,
  user,
  onTriggerSos,
}) => {
  const [sirenOn, setSirenOn] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState<'interface' | 'docs'>('interface');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      sirenPlayer.stop();
    };
  }, []);

  if (!isOpen) return null;

  const toggleSiren = () => {
    const isNowPlaying = sirenPlayer.toggle();
    setSirenOn(isNowPlaying);
  };

  const toggleFlashlight = () => {
    setFlashlightOn(!flashlightOn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E4EAE5] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#F7F8F4] border-b border-[#E4EAE5]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#DCE8DF] text-[#2F5952]">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#1E282D]">Lock-screen SOS Simulator</h3>
              <p className="text-[11px] text-[#657780]">Simulated Emergency Keylock Overlay</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#E8EFEA] p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('interface')}
                className={`cursor-pointer px-2.5 py-1 rounded-md font-medium text-[11px] transition ${
                  activeTab === 'interface'
                    ? 'bg-white text-[#2F5952] shadow-xs'
                    : 'text-[#657780]'
                }`}
              >
                Simulation
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`cursor-pointer px-2.5 py-1 rounded-md font-medium text-[11px] transition ${
                  activeTab === 'docs'
                    ? 'bg-white text-[#2F5952] shadow-xs'
                    : 'text-[#657780]'
                }`}
              >
                OS Architecture Docs
              </button>
            </div>

            <button
              onClick={() => {
                sirenPlayer.stop();
                setSirenOn(false);
                onClose();
              }}
              className="cursor-pointer p-1 rounded-full text-[#657780] hover:text-[#1E282D] hover:bg-[#E4EAE5] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Lockscreen Simulator */}
        {activeTab === 'interface' && (
          <div
            className={`p-6 transition-colors duration-200 relative ${
              flashlightOn ? 'bg-amber-100/90' : 'bg-gradient-to-b from-[#F2F6F3] to-[#E9EFEA]'
            }`}
          >
            {flashlightOn && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold shadow-xs">
                Screen Flashlight / Strobe Active
              </div>
            )}

            {/* Simulated Phone Shell */}
            <div className="max-w-xs mx-auto bg-white rounded-3xl p-5 shadow-lg border border-[#D5E0D7] text-center">
              <div className="text-3xl font-extrabold text-[#1E282D] tracking-tight mb-1">
                {currentTime}
              </div>
              <div className="text-xs text-[#657780] mb-4">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </div>

              {/* Medical ID Summary */}
              <div className="bg-[#FAF5F5] border border-[#F2D7D7] rounded-xl p-2.5 text-left mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#B91C1C] font-bold text-[11px] uppercase tracking-wider mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  Medical ID (Emergency)
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div>
                    <span className="text-neutral-500">Name:</span>{' '}
                    <span className="font-semibold text-neutral-800">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Blood:</span>{' '}
                    <span className="font-semibold text-neutral-800">{user.bloodGroup}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500">Allergies:</span>{' '}
                    <span className="font-semibold text-neutral-800">
                      {user.allergies || 'None reported'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Emergency SOS Button */}
              <button
                onClick={() => {
                  onClose();
                  onTriggerSos();
                }}
                className="cursor-pointer w-full py-4 px-4 rounded-2xl bg-[#D94336] hover:bg-[#C2362A] text-white font-black text-lg tracking-wider shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 mb-3"
              >
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                TRIGGER SOS NOW
              </button>

              {/* Rapid Utility Actions */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:112"
                  className="cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl bg-[#F7F8F4] hover:bg-[#EAEFEA] border border-[#E0E7E2] text-[#1E282D] transition"
                >
                  <PhoneCall className="w-4 h-4 text-[#D94336] mb-1" />
                  <span className="text-[10px] font-bold">Call 112</span>
                </a>

                <button
                  onClick={toggleSiren}
                  className={`cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                    sirenOn
                      ? 'bg-red-100 border-red-300 text-red-800 font-bold animate-pulse'
                      : 'bg-[#F7F8F4] hover:bg-[#EAEFEA] border-[#E0E7E2] text-[#1E282D]'
                  }`}
                >
                  {sirenOn ? (
                    <Volume2 className="w-4 h-4 text-red-600 mb-1" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-neutral-600 mb-1" />
                  )}
                  <span className="text-[10px] font-bold">
                    {sirenOn ? 'Stop Siren' : 'Loud Siren'}
                  </span>
                </button>

                <button
                  onClick={toggleFlashlight}
                  className={`cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                    flashlightOn
                      ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold'
                      : 'bg-[#F7F8F4] hover:bg-[#EAEFEA] border-[#E0E7E2] text-[#1E282D]'
                  }`}
                >
                  <Flashlight
                    className={`w-4 h-4 mb-1 ${
                      flashlightOn ? 'text-amber-600' : 'text-neutral-600'
                    }`}
                  />
                  <span className="text-[10px] font-bold">
                    {flashlightOn ? 'Light Off' : 'Flashlight'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Architecture Documentation */}
        {activeTab === 'docs' && (
          <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto text-xs text-[#34434A]">
            <div className="bg-[#EBF3ED] border border-[#CCDCD0] rounded-xl p-3 text-[#2F5952]">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Info className="w-4 h-4" />
                Technical & Security Mandate
              </div>
              <p className="leading-relaxed">
                Browser web applications are strictly sandboxed by mobile OS security policies. A web app
                cannot display over a native device lock-screen or intercept hardware button presses while the phone is locked.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1E282D] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2F5952]" />
                Native Android Implementation Blueprint
              </h4>
              <p className="text-neutral-600 leading-relaxed">
                To deploy real Lock-Screen Emergency SOS on citizen Android phones, the production stack requires:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
                <li>
                  <strong>Foreground Service with Notification:</strong> A sticky foreground service running with persistent priority to avoid OS battery killers.
                </li>
                <li>
                  <strong>Window Flag Overlays:</strong> Utilizing <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px]">FLAG_SHOW_WHEN_LOCKED</code> and <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px]">FLAG_TURN_SCREEN_ON</code> via Android Activity flags.
                </li>
                <li>
                  <strong>Hardware Button Triggers:</strong> Integrating with Android’s Emergency SOS framework (e.g. 5 rapid presses of power button) or an Accessibility Service / MediaButtonReceiver.
                </li>
                <li>
                  <strong>Zero Security Bypass:</strong> The overlay displays strictly emergency triage, medical info, and 112 dialing. It never accesses private chats, personal files, or unlocks the phone without biometric / PIN entry.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="px-5 py-3 bg-[#F7F8F4] border-t border-[#E4EAE5] flex items-center justify-between text-xs text-[#657780]">
          <span>Bengaluru City Police ERSS 112 Integrated</span>
          <button
            onClick={() => {
              sirenPlayer.stop();
              setSirenOn(false);
              onClose();
            }}
            className="cursor-pointer px-4 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold transition"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
