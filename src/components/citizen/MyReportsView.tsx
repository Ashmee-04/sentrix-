import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Bus,
  Search,
  Filter,
  ArrowRight,
  User,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { IncidentReport, IncidentStatus } from '../../types';
import { StorageService } from '../../services/storage';

const STATUS_STEPS: { id: IncidentStatus; label: string }[] = [
  { id: 'received', label: 'Received' },
  { id: 'awaiting_review', label: 'Awaiting Review' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'action_taken', label: 'Action Taken' },
  { id: 'resolved', label: 'Resolved' },
];

export const MyReportsView: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'sos' | 'transport_safety' | 'civic_hazard'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIncidents(StorageService.getIncidents());
  }, []);

  const filtered = incidents.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchTerm) {
      const matchText = (item.id + ' ' + item.title + ' ' + item.location.address).toLowerCase();
      if (!matchText.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  const getStatusIndex = (st: IncidentStatus) => {
    const idx = STATUS_STEPS.findIndex((s) => s.id === st);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2F5952] uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          Real-Time Case Tracking
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E282D]">My Reports & Complaint Box</h2>
        <p className="text-xs sm:text-sm text-[#657780] mt-1">
          Monitor life-cycle timeline, responder notes, and dispatch resolution for all reports logged by your account.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1 rounded-2xl border border-[#E0E7E2]">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'sos', label: 'Emergency SOS' },
            { id: 'transport_safety', label: 'Transit Reports' },
            { id: 'civic_hazard', label: 'Civic Issues' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
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

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-60 text-xs pl-8 pr-3 py-2 rounded-xl border border-[#D5E0D7] bg-white focus:ring-2 focus:ring-[#2F5952]"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-8 text-center text-xs text-[#657780]">
            No reports matching your filter.
          </div>
        ) : (
          filtered.map((item) => {
            const currentIdx = getStatusIndex(item.status);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedIncident(item)}
                className="cursor-pointer bg-white hover:bg-[#FAFBF9] border border-[#E4EAE5] hover:border-[#CCDCD0] rounded-3xl p-5 transition shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg ${
                        item.type === 'sos'
                          ? 'bg-rose-100 text-rose-800'
                          : item.type === 'transport_safety'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.type === 'sos' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : item.type === 'transport_safety' ? (
                        <Bus className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#2F5952] mr-2">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-[#1E282D]">{item.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        item.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : item.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-[11px] text-[#657780]">
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Visual Timeline Bar */}
                <div className="pt-2 border-t border-[#F2F5F3]">
                  <div className="grid grid-cols-6 gap-1 text-[10px] text-center font-medium">
                    {STATUS_STEPS.map((step, idx) => {
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={step.id} className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isComplete ? 'bg-[#2F5952]' : 'bg-[#E4EAE5]'
                            } ${isCurrent ? 'ring-2 ring-[#2F5952]/30' : ''}`}
                          />
                          <span
                            className={`hidden sm:block truncate ${
                              isCurrent ? 'text-[#2F5952] font-bold' : isComplete ? 'text-[#34434A]' : 'text-neutral-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Unit Footer */}
                <div className="flex items-center justify-between text-[11px] text-[#657780] pt-1">
                  <span>
                    Assigned Unit: <strong className="text-[#1E282D]">{item.assignedUnitName || 'Central Control Queue'}</strong>
                  </span>
                  <div className="flex items-center text-[#2F5952] font-semibold">
                    <span>View Case Notes ({item.actionNotes.length})</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Drill-Down Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E4EAE5] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-[#F7F8F4] border-b border-[#E4EAE5] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#2F5952]">
                  {selectedIncident.id}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#1E282D]">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="cursor-pointer px-3 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Status and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#FAFBF9] border border-[#E4EAE5] rounded-2xl p-3 space-y-1">
                  <span className="text-neutral-500 font-medium">Status & Department</span>
                  <div className="font-bold text-[#1E282D] capitalize">
                    {selectedIncident.status.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-[#2F5952]">
                    Assigned: {selectedIncident.assignedUnitName || 'ERSS Dispatch Desk'}
                  </div>
                </div>

                <div className="bg-[#FAFBF9] border border-[#E4EAE5] rounded-2xl p-3 space-y-1">
                  <span className="text-neutral-500 font-medium">Location Telemetry</span>
                  <div className="font-bold text-[#1E282D] truncate">
                    {selectedIncident.location.address || selectedIncident.location.landmark}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Ward: {selectedIncident.location.ward || 'Bengaluru Central'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px]">
                  Incident Description
                </span>
                <p className="p-3 rounded-2xl bg-[#F7F8F4] border border-[#E4EAE5] text-neutral-700 leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              {/* AI Triage Card */}
              {selectedIncident.triage && (
                <div className="bg-[#F2F7F4] border border-[#CCDCD0] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#2F5952]">
                    <Sparkles className="w-4 h-4 text-[#6F9C95]" />
                    AI Incident Intelligence & Dispatch Triage
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    <strong>Jurisdiction:</strong> {selectedIncident.triage.responsibleService}
                  </p>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">
                    <strong>Rationale:</strong> {selectedIncident.triage.rationale}
                  </p>
                </div>
              )}

              {/* Responder Action Notes Timeline */}
              <div className="space-y-2">
                <span className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px]">
                  Official Action Logs ({selectedIncident.actionNotes.length})
                </span>
                <div className="space-y-2">
                  {selectedIncident.actionNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-2xl bg-white border border-[#E4EAE5] space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1E282D]">
                          {note.author} ({note.role})
                        </span>
                        <span className="text-neutral-400">
                          {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-xs leading-relaxed">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
