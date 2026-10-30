import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Sparkles,
  MapPin,
  Clock,
  User,
  Phone,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { IncidentReport, DispatchUnit, IncidentStatus, IncidentSeverity } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminIncidentModalProps {
  incident: IncidentReport;
  units: DispatchUnit[];
  onClose: () => void;
  onUpdateIncident: (updated: IncidentReport) => void;
}

export const AdminIncidentModal: React.FC<AdminIncidentModalProps> = ({
  incident,
  units,
  onClose,
  onUpdateIncident,
}) => {
  const [currentIncident, setCurrentIncident] = useState<IncidentReport>(incident);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(incident.assignedUnitId || '');
  const [newNoteText, setNewNoteText] = useState('');
  const [maskVictimDetails, setMaskVictimDetails] = useState(incident.isAnonymous);
  const [status, setStatus] = useState<IncidentStatus>(incident.status);
  const [severity, setSeverity] = useState<IncidentSeverity>(incident.severity);

  const handleAssignUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;

    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Inspector Manjunath K.',
      role: 'Police Control Officer',
      note: `Unit reassigned to ${unit.name} (${unit.contactNumber}).`,
    };

    const updated: IncidentReport = {
      ...currentIncident,
      assignedUnitId: unit.id,
      assignedUnitName: unit.name,
      status: 'assigned',
      updatedAt: new Date().toISOString(),
      actionNotes: [...currentIncident.actionNotes, newNote],
    };

    setCurrentIncident(updated);
    setStatus('assigned');
    StorageService.saveIncident(updated);
    StorageService.addAuditLog({
      actorName: 'Inspector Manjunath K.',
      actorRole: 'Police Control Officer',
      action: 'UNIT_REASSIGNED',
      targetId: updated.id,
      details: `Reassigned incident to ${unit.name}`,
    });
    onUpdateIncident(updated);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Inspector Manjunath K.',
      role: 'Police Control Officer',
      note: newNoteText.trim(),
    };

    const updated: IncidentReport = {
      ...currentIncident,
      actionNotes: [...currentIncident.actionNotes, newNote],
      updatedAt: new Date().toISOString(),
    };

    setCurrentIncident(updated);
    setNewNoteText('');
    StorageService.saveIncident(updated);
    StorageService.addAuditLog({
      actorName: 'Inspector Manjunath K.',
      actorRole: 'Police Control Officer',
      action: 'ACTION_NOTE_ADDED',
      targetId: updated.id,
      details: `Added official dispatch log note: "${newNoteText.slice(0, 40)}..."`,
    });
    onUpdateIncident(updated);
  };

  const handleUpdateStatus = (newStatus: IncidentStatus) => {
    setStatus(newStatus);
    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: 'Inspector Manjunath K.',
      role: 'Police Control Officer',
      note: `Incident lifecycle status updated to ${newStatus.replace('_', ' ').toUpperCase()}.`,
    };

    const updated: IncidentReport = {
      ...currentIncident,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      actionNotes: [...currentIncident.actionNotes, newNote],
    };

    setCurrentIncident(updated);
    StorageService.saveIncident(updated);
    StorageService.addAuditLog({
      actorName: 'Inspector Manjunath K.',
      actorRole: 'Police Control Officer',
      action: 'STATUS_UPDATED',
      targetId: updated.id,
      details: `Changed incident status to ${newStatus}`,
    });
    onUpdateIncident(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-[#CCDCD0] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F2F7F4] border-b border-[#CCDCD0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#2F5952] text-white">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#2F5952]">
                  {currentIncident.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentIncident.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {currentIncident.severity}
                </span>
                <span className="text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full font-bold uppercase">
                  DEMO RECORD
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1E282D] mt-0.5">{currentIncident.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Top Control Bar: Status and Assigned Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFBF9] p-4 rounded-2xl border border-[#E4EAE5]">
            <div>
              <label className="block text-neutral-600 font-bold uppercase tracking-wider text-[10px] mb-1">
                Dispatch Lifecycle Status
              </label>
              <select
                value={status}
                onChange={(e) => handleUpdateStatus(e.target.value as any)}
                className="w-full text-xs p-2 rounded-xl border border-[#D5E0D7] bg-white font-semibold text-[#1E282D]"
              >
                <option value="received">Received (Unassigned)</option>
                <option value="awaiting_review">Awaiting Review</option>
                <option value="assigned">Assigned to Field Unit</option>
                <option value="in_progress">In Progress (Unit En Route)</option>
                <option value="action_taken">Action Taken (On Scene)</option>
                <option value="resolved">Resolved & Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 font-bold uppercase tracking-wider text-[10px] mb-1">
                Assign Responder Patrol Unit
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => handleAssignUnit(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#D5E0D7] bg-white font-semibold text-[#1E282D]"
              >
                <option value="">Select Available Patrol Unit...</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.currentWard} ({u.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Incident Intelligence Card */}
          {currentIncident.triage ? (
            <div className="bg-[#F2F7F4] border border-[#CCDCD0] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[#2F5952]">
                  <Sparkles className="w-4 h-4 text-[#6F9C95]" />
                  <span>AI Incident Intelligence (Confidence: {Math.round(currentIncident.triage.confidence * 100)}%)</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  Model: {currentIncident.triage.aiModel || 'Gemini 3.8 Flash'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
                <div className="bg-white p-2.5 rounded-xl border border-[#E0EAE2]">
                  <span className="font-bold text-[#1E282D] block mb-0.5">Recommended Jurisdiction:</span>
                  <span className="text-[#2F5952] font-semibold">{currentIncident.triage.responsibleService}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E0EAE2]">
                  <span className="font-bold text-[#1E282D] block mb-0.5">Life-Threatening Flag:</span>
                  <span className={`font-bold ${currentIncident.triage.isLifeThreatening ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {currentIncident.triage.isLifeThreatening ? 'YES — CONSERVATIVE ESCALATION' : 'NO IMMEDIATE LIFE THREAT'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#1E282D] block mb-1">Extracted Facts & Observed Details:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-neutral-600 text-[11px]">
                  {currentIncident.triage.extractedFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              {currentIncident.triage.missingDetails.length > 0 && (
                <div>
                  <span className="font-bold text-amber-900 block mb-1">Essential Missing Information:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-amber-800 text-[11px]">
                    {currentIncident.triage.missingDetails.map((det, idx) => (
                      <li key={idx}>{det}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-neutral-100 rounded-xl text-neutral-600">
              Deterministic incident logging active.
            </div>
          )}

          {/* Citizen & Telemetry Details with Privacy Blur Guard */}
          <div className="border border-[#E4EAE5] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px]">
                Citizen Contact & Privacy Controls
              </span>
              <button
                type="button"
                onClick={() => setMaskVictimDetails(!maskVictimDetails)}
                className="cursor-pointer text-[11px] font-semibold text-[#2F5952] hover:underline flex items-center gap-1"
              >
                {maskVictimDetails ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{maskVictimDetails ? 'Unmask Identity' : 'Mask Identity (Sec 73 BNS)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700">
              <div className="space-y-1">
                <span className="text-neutral-500 block">Complainant / Citizen:</span>
                <span className="font-bold text-[#1E282D]">
                  {maskVictimDetails ? '●●●●●●● (Identity Protected)' : currentIncident.citizenName || 'Anonymous Citizen'}
                </span>
                <span className="text-neutral-500 block text-[11px]">
                  Phone: {maskVictimDetails ? '+91 ●●●●● ●●●●●' : currentIncident.citizenPhone || 'Masked on filing'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block">Location Telemetry:</span>
                <span className="font-bold text-[#1E282D]">
                  {currentIncident.location.address || currentIncident.location.landmark}
                </span>
                <span className="text-[11px] font-mono text-[#2F5952] block">
                  {currentIncident.location.latitude}, {currentIncident.location.longitude} (Ward: {currentIncident.location.ward})
                </span>
              </div>
            </div>

            {currentIncident.audioTranscript && (
              <div className="mt-2 pt-2 border-t border-neutral-100">
                <span className="font-bold text-[#1E282D] text-[11px] block mb-0.5">
                  Voice Note Audio Transcript:
                </span>
                <p className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E4EAE5] text-neutral-700 italic">
                  "{currentIncident.audioTranscript}"
                </p>
              </div>
            )}
          </div>

          {/* Action Log History */}
          <div className="space-y-2">
            <span className="font-bold text-[#1E282D] uppercase tracking-wider text-[11px]">
              Official Action Log History ({currentIncident.actionNotes.length})
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentIncident.actionNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-2xl bg-[#FBFDFB] border border-[#E4EAE5] text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1E282D]">
                      {note.author} ({note.role})
                    </span>
                    <span className="text-neutral-400">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-neutral-700">{note.note}</p>
                </div>
              ))}
            </div>

            {/* Add official note */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Log dispatcher note, field unit update, or triage instruction..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] text-xs focus:ring-2 focus:ring-[#2F5952]"
              />
              <button
                type="submit"
                className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#2F5952] hover:bg-[#1E3B36] text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F7F8F4] border-t border-[#E4EAE5] flex items-center justify-between text-xs text-[#657780]">
          <span>Enforcing Server-Side Audit Logs</span>
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
