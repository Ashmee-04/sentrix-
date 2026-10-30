import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Bell,
  EyeOff,
  Smartphone,
  Globe,
  SlidersHorizontal,
  User,
  Shield,
} from 'lucide-react';
import { SupportedLanguage, LANGUAGES } from '../../i18n/translations';
import { Role } from '../../types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenLockScreenModal: () => void;
  onTriggerQuickExit: () => void;
  onOpenProfile: () => void;
  onTriggerSos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  unreadCount,
  onOpenNotifications,
  onOpenLockScreenModal,
  onTriggerQuickExit,
  onOpenProfile,
  onTriggerSos,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E4EAE5] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2F5952] to-[#6F9C95] flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5 text-[#EBF4F1]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#1E282D]">SENTRIX</span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-[#DCE8DF] text-[#2F5952]">
                BLR • 112
              </span>
            </div>
            <p className="text-[11px] text-[#657780] hidden sm:block">
              Bengaluru Citizen Safety & Emergency Response
            </p>
          </div>
        </div>

        {/* Central Controls: Mode switcher */}
        <div className="flex items-center gap-1 bg-[#F1F5F2] p-1 rounded-xl border border-[#E0E7E2]">
          <button
            onClick={() => onRoleChange('citizen')}
            className={`cursor-pointer px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition ${
              currentRole === 'citizen'
                ? 'bg-white text-[#2F5952] shadow-xs'
                : 'text-[#657780] hover:text-[#34434A]'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => onRoleChange('responder')}
            className={`cursor-pointer px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              currentRole !== 'citizen'
                ? 'bg-[#2F5952] text-white shadow-xs'
                : 'text-[#657780] hover:text-[#34434A]'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">Responder Ops</span>
            <span className="sm:hidden">Ops</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct 112 Call Button */}
          <a
            href="tel:112"
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D94336] hover:bg-[#C2362A] text-white font-bold text-xs tracking-wide shadow-xs hover:shadow transition transform active:scale-95"
            title="Dial Karnataka Emergency 112 directly"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>112</span>
          </a>

          {/* Discreet Quick Exit (Women's Safety) */}
          <button
            onClick={onTriggerQuickExit}
            className="cursor-pointer hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F7F8F4] hover:bg-[#EAE6F2] text-[#554A6B] border border-[#DDD8E6] text-xs font-medium transition"
            title="Quick Exit: Switch screen immediately to a neutral weather screen for discretion"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#6D5D8A]" />
            <span>Discreet Exit</span>
          </button>

          {/* Lock-screen SOS simulation modal */}
          <button
            onClick={onOpenLockScreenModal}
            className="cursor-pointer hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F7F8F4] hover:bg-[#DCE8DF] text-[#34434A] border border-[#E4EAE5] text-xs font-medium transition"
            title="View Lock-screen Emergency Mode Simulation"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#2F5952]" />
            <span>Lock-screen SOS</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="cursor-pointer flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#F7F8F4] hover:bg-[#EAEFEA] text-[#34434A] border border-[#E4EAE5] text-xs font-medium transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#6F9C95]" />
              <span className="uppercase text-[11px] font-semibold">{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E4EAE5] rounded-xl shadow-md py-1 z-50">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onLanguageChange(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                      language === item.code
                        ? 'bg-[#EBF3ED] text-[#2F5952] font-semibold'
                        : 'text-[#34434A] hover:bg-[#F7F8F4]'
                    }`}
                  >
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-[#657780]">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Inbox Bell */}
          <button
            onClick={onOpenNotifications}
            className="cursor-pointer relative p-2 rounded-xl bg-[#F7F8F4] hover:bg-[#EAEFEA] text-[#34434A] border border-[#E4EAE5] transition"
            title="Notifications & Hazard Alerts"
          >
            <Bell className="w-4 h-4 text-[#34434A]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D94336] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile / Settings Button */}
          <button
            onClick={onOpenProfile}
            className="cursor-pointer p-2 rounded-xl bg-[#F7F8F4] hover:bg-[#EAEFEA] text-[#34434A] border border-[#E4EAE5] transition"
            title="Profile, Contacts & Legal Consent"
          >
            <User className="w-4 h-4 text-[#2F5952]" />
          </button>
        </div>
      </div>
    </header>
  );
};
