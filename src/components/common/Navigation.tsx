import React from 'react';
import {
  Home,
  Map,
  PlusCircle,
  FileText,
  Bell,
  User,
  ShieldAlert,
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../../i18n/translations';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  language: SupportedLanguage;
  unreadCount: number;
  onTriggerSos: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  language,
  unreadCount,
  onTriggerSos,
}) => {
  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;

  const NAV_ITEMS = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'hazard_map', label: t('navMap'), icon: Map },
    { id: 'my_reports', label: t('navMyReports'), icon: FileText },
    { id: 'notifications', label: t('navNotifications'), icon: Bell, badge: unreadCount },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <>
      {/* Desktop Horizontal Navigation Bar */}
      <nav className="hidden md:block bg-white border-b border-[#E4EAE5] py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#EBF3ED] text-[#2F5952]'
                      : 'text-[#657780] hover:text-[#1E282D] hover:bg-[#F7F8F4]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#D94336] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Prominent SOS Trigger in Desktop Nav */}
          <button
            onClick={onTriggerSos}
            className="cursor-pointer px-4 py-2 rounded-xl bg-[#D94336] hover:bg-[#C2362A] text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm hover:shadow transition transform active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4EAE5] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {/* First two items */}
          {NAV_ITEMS.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`cursor-pointer flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition ${
                  isActive ? 'text-[#2F5952]' : 'text-[#657780]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#2F5952]' : 'text-[#657780]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Central Elevated SOS Button */}
          <button
            onClick={onTriggerSos}
            className="cursor-pointer -mt-5 w-13 h-13 rounded-full bg-[#D94336] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white transform active:scale-95 transition"
          >
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-wider">SOS</span>
          </button>

          {/* Remaining items */}
          {NAV_ITEMS.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`cursor-pointer flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold relative transition ${
                  isActive ? 'text-[#2F5952]' : 'text-[#657780]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#2F5952]' : 'text-[#657780]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-[#D94336] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
