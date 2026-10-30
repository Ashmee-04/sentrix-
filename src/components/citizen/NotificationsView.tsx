import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Info,
  ExternalLink,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { StorageService } from '../../services/storage';

interface NotificationsViewProps {
  onSelectReportTarget?: (reportId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onSelectReportTarget,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setNotifications(StorageService.getNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            Safety Communications Center
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">Notifications Inbox</h2>
          <p className="text-xs sm:text-sm text-[#657780] mt-1">
            Emergency status updates, verified hazard alerts, and government safety advisories.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="cursor-pointer self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-semibold text-[#2F5952] border border-[#CCDCD0] shadow-xs transition"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-2xl border border-[#E0E7E2]">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'sos_update', label: 'SOS Events' },
          { id: 'hazard_alert', label: 'Hazards' },
          { id: 'safety_advisory', label: 'Advisories' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === tab.id
                ? 'bg-white text-[#2F5952] shadow-xs'
                : 'text-[#657780] hover:text-[#34434A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Items */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-8 text-center text-xs text-[#657780]">
            No notifications matching this filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition shadow-xs flex items-start justify-between gap-3 ${
                item.isRead
                  ? 'bg-white border-[#E4EAE5] opacity-90'
                  : 'bg-[#F9FCFA] border-[#CCDCD0] ring-1 ring-[#2F5952]/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    item.type === 'sos_update'
                      ? 'bg-rose-100 text-rose-800'
                      : item.type === 'hazard_alert'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.type === 'sos_update' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : item.type === 'hazard_alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E282D]">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#D94336]" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-[#657780] leading-relaxed">{item.message}</p>
                  <div className="text-[10px] text-neutral-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {item.deepLinkTarget && onSelectReportTarget && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const reportId = item.deepLinkTarget?.replace('report:', '');
                    if (reportId) onSelectReportTarget(reportId);
                  }}
                  className="cursor-pointer text-xs font-semibold text-[#2F5952] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Track</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
