import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  SlidersHorizontal,
  Activity,
  FileText,
  Search,
  Filter,
  Shield,
  Phone,
  Layers,
  ArrowRight,
  TrendingUp,
  Building,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  IncidentReport,
  DispatchUnit,
  AuditLogEntry,
  HazardAlert,
  IncidentSeverity,
  IncidentStatus,
} from '../../types';
import { StorageService } from '../../services/storage';
import { AdminIncidentModal } from './AdminIncidentModal';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'incidents' | 'map' | 'assignments' | 'civic' | 'analytics' | 'audit'
  >('overview');
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [units, setUnits] = useState<DispatchUnit[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [hazards, setHazards] = useState<HazardAlert[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  // Filters for incident queue
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const reloadData = () => {
    setIncidents(StorageService.getIncidents());
    setUnits(StorageService.getDispatchUnits());
    setAuditLogs(StorageService.getAuditLogs());
    setHazards(StorageService.getHazards());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const activeCount = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'closed').length;
  const unitsDispatched = units.filter((u) => u.status !== 'available').length;

  const filteredIncidents = incidents.filter((i) => {
    if (severityFilter !== 'all' && i.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (searchQuery) {
      const text = (i.id + ' ' + i.title + ' ' + i.location.address + ' ' + i.description).toLowerCase();
      if (!text.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleUnitStatusChange = (unitId: string, newStatus: any) => {
    const updatedUnits = units.map((u) =>
      u.id === unitId ? { ...u, status: newStatus } : u
    );
    setUnits(updatedUnits);
    StorageService.saveDispatchUnits(updatedUnits);
    StorageService.addAuditLog({
      actorName: 'Inspector Manjunath K.',
      actorRole: 'Police Control Officer',
      action: 'UNIT_STATUS_UPDATE',
      targetId: unitId,
      details: `Updated unit status to ${newStatus}`,
    });
    setAuditLogs(StorageService.getAuditLogs());
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#2F5952] uppercase tracking-wider">
              Bengaluru City Police ERSS 112 & Municipal Command Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E282D] mt-0.5">
            Responder Operations & Emergency Dispatch
          </h1>
          <p className="text-xs text-[#657780]">
            Authorized Operator: Inspector Manjunath K. (Central Command • Shift A) • Clear DEMO Data Sandbox
          </p>
        </div>

        <button
          onClick={reloadData}
          className="cursor-pointer self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 border border-[#CCDCD0] text-xs font-semibold text-[#2F5952] shadow-2xs flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Real-Time Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-[#657780] uppercase tracking-wider">
            Active Incidents
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E282D] mt-1">
            {activeCount}
          </div>
          <div className="text-[11px] text-[#2F5952] mt-0.5 font-medium">In dispatch pipeline</div>
        </div>

        <div className="bg-[#FFF5F5] border border-[#F2D7D7] rounded-3xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-[#B91C1C] uppercase tracking-wider">
            Critical Life-Threats
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#B91C1C] mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] text-[#B91C1C] mt-0.5 font-medium">Immediate priority</div>
        </div>

        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-[#657780] uppercase tracking-wider">
            Avg Dispatch Time
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E282D] mt-1">
            5.2m
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Within 7m SLA limit</div>
        </div>

        <div className="bg-white border border-[#E4EAE5] rounded-3xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-[#657780] uppercase tracking-wider">
            Patrol Units Deployed
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2F5952] mt-1">
            {unitsDispatched} / {units.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5 font-medium">Pink Hoysala & Traffic</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F2] p-1.5 rounded-2xl border border-[#E0E7E2]">
        {[
          { id: 'overview', label: 'Command Overview' },
          { id: 'incidents', label: `Incident Queue (${incidents.length})` },
          { id: 'map', label: 'Operations Map' },
          { id: 'assignments', label: `Units & Fleet (${units.length})` },
          { id: 'civic', label: 'Civic Issues Queue' },
          { id: 'analytics', label: 'Analytics & SLA' },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-white text-[#2F5952] shadow-xs'
                : 'text-[#657780] hover:text-[#1E282D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: COMMAND OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Emergency Queue Priority */}
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1E282D]">Priority Emergency Queue</h3>
                  <p className="text-[11px] text-[#657780]">Sorted by severity and timestamp</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('incidents')}
                className="cursor-pointer text-xs font-semibold text-[#2F5952] hover:underline"
              >
                View Full Queue ({incidents.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {incidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="cursor-pointer p-3.5 rounded-2xl bg-[#FBFDFB] hover:bg-[#F2F7F4] border border-[#E4EAE5] hover:border-[#CCDCD0] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2F5952]">{inc.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="font-bold text-[#1E282D]">{inc.title}</span>
                    </div>
                    <p className="text-neutral-600 text-[11px] line-clamp-1">{inc.description}</p>
                    <div className="text-[10px] text-neutral-400">
                      Location: {inc.location.address || inc.location.ward} • Assigned:{' '}
                      <strong className="text-neutral-700">{inc.assignedUnitName || 'Unassigned'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {inc.status.replace('_', ' ')}
                    </span>
                    <button className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#2F5952] text-white font-bold text-xs">
                      Triage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Patrol Fleet Status */}
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2F5952]" />
                Field Responder Units Deployment
              </h3>
              <button
                onClick={() => setActiveTab('assignments')}
                className="cursor-pointer text-xs font-semibold text-[#2F5952] hover:underline"
              >
                Manage Fleet
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1E282D] truncate">{unit.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        unit.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : unit.status === 'on_scene'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {unit.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Sector: <strong className="text-neutral-700">{unit.currentWard}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-[11px]">
                    <span className="font-mono text-neutral-600">{unit.contactNumber}</span>
                    <select
                      value={unit.status}
                      onChange={(e) => handleUnitStatusChange(unit.id, e.target.value)}
                      className="text-[10px] p-1 rounded-lg border border-neutral-200 bg-white"
                    >
                      <option value="available">Available</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="en_route">En Route</option>
                      <option value="on_scene">On Scene</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCIDENT QUEUE */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {/* Queue Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-[#E4EAE5]">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] font-medium"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Priority</option>
                <option value="MODERATE">Moderate</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-[#D5E0D7] bg-[#FAFBF9] font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="received">Received</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search incident ID, keyword, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 text-xs pl-8 pr-3 py-2 rounded-xl border border-[#D5E0D7] bg-white"
              />
            </div>
          </div>

          {/* Incidents Table / Cards */}
          <div className="space-y-2.5">
            {filteredIncidents.length === 0 ? (
              <div className="bg-white border border-[#E4EAE5] rounded-3xl p-8 text-center text-xs text-[#657780]">
                No incidents match current filters.
              </div>
            ) : (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="cursor-pointer bg-white hover:bg-[#FAFBF9] border border-[#E4EAE5] hover:border-[#CCDCD0] rounded-3xl p-4 sm:p-5 transition shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2F5952]">{inc.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-[#1E282D]">
                        {inc.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5952]">
                        {inc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2F5F3] text-[11px] text-[#657780]">
                    <span>
                      Location: <strong className="text-neutral-800">{inc.location.address || inc.location.ward}</strong>
                    </span>
                    <span>
                      Assigned: <strong className="text-[#2F5952]">{inc.assignedUnitName || 'Pending Assignment'}</strong>
                    </span>
                    <button className="cursor-pointer font-bold text-[#2F5952] hover:underline">
                      Open Operations Drilldown ➔
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OPERATIONS MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#1E282D] mb-1">
              Geospatial Operations Center (Bengaluru Urban)
            </h3>
            <p className="text-xs text-[#657780] mb-4">
              Real-time map tracking of active emergencies and live patrol vehicles.
            </p>

            <div className="relative bg-[#EBF0EC] border border-[#CCDCD0] rounded-2xl h-[440px] overflow-hidden">
              <svg className="w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <ellipse cx="62" cy="46" rx="4" ry="2.5" fill="#D3E2E8" opacity="0.8" />
                <ellipse cx="78" cy="72" rx="7" ry="4" fill="#D3E2E8" opacity="0.8" />
                <path d="M 15 50 Q 50 48 85 52" fill="none" stroke="#DCE5DD" strokeWidth="2" strokeDasharray="2,1" />
                <path d="M 45 15 Q 52 50 68 85" fill="none" stroke="#DCE5DD" strokeWidth="2" strokeDasharray="2,1" />
                <text x="66" y="45" fontSize="2.5" fill="#84998B" fontWeight="bold">Indiranagar</text>
                <text x="58" y="65" fontSize="2.5" fill="#84998B" fontWeight="bold">Koramangala</text>
                <text x="62" y="78" fontSize="2.5" fill="#84998B" fontWeight="bold">Silk Board</text>
                <text x="82" y="42" fontSize="2.5" fill="#84998B" fontWeight="bold">Whitefield</text>
              </svg>

              {/* Incidents on map */}
              {incidents.map((inc, i) => {
                const x = 52 + (i % 4) * 8;
                const y = 42 + (i % 3) * 11;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  >
                    <div className="p-1.5 rounded-full bg-rose-500 text-white shadow-md animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap hidden group-hover:block z-30">
                      {inc.id}: {inc.title}
                    </div>
                  </div>
                );
              })}

              {/* Units on map */}
              {units.map((u, i) => {
                const x = 58 + i * 7;
                const y = 48 + i * 6;
                return (
                  <div
                    key={u.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-15"
                  >
                    <div className="p-1 rounded-full bg-[#2F5952] text-white shadow-xs">
                      <Shield className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNITS & ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1E282D]">
              Bengaluru Emergency Units Fleet Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-[#FAFBF9] border border-[#E4EAE5] rounded-2xl p-4 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1E282D]">{unit.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        unit.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {unit.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-neutral-600 text-[11px]">
                    <div>
                      Sector: <strong>{unit.currentWard}</strong>
                    </div>
                    <div>
                      Helpline: <strong>{unit.contactNumber}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                      Update Operational Status
                    </label>
                    <select
                      value={unit.status}
                      onChange={(e) => handleUnitStatusChange(unit.id, e.target.value)}
                      className="w-full text-xs p-1.5 rounded-xl border border-neutral-200 bg-white"
                    >
                      <option value="available">Available (Patrolling)</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="en_route">En Route to Scene</option>
                      <option value="on_scene">On Scene (Active)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CIVIC ISSUES QUEUE */}
      {activeTab === 'civic' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1E282D]">
                  BBMP & BESCOM Municipal Field Defects
                </h3>
                <p className="text-xs text-[#657780]">Potholes, waterlogging, wires, and road hazards</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {incidents
                .filter((i) => i.type === 'civic_hazard')
                .map((civ) => (
                  <div
                    key={civ.id}
                    onClick={() => setSelectedIncident(civ)}
                    className="cursor-pointer p-4 rounded-2xl bg-[#FAFBF9] hover:bg-[#F2F7F4] border border-[#E4EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#7A6328]">{civ.id}</span>
                        <span className="font-bold text-[#1E282D]">{civ.title}</span>
                      </div>
                      <p className="text-neutral-600 text-[11px] mt-1">{civ.description}</p>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        Dept: {civ.civicDetails?.department || 'BBMP'} • Ref:{' '}
                        {civ.civicDetails?.officialReferenceNumber}
                      </div>
                    </div>

                    <button className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#2F5952] text-white font-bold text-xs shrink-0">
                      Work Order ➔
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ANALYTICS & SLA */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider">
                Emergency Category Distribution
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Road Accidents (Traffic Hoysala)', pct: 42, count: 18, color: 'bg-amber-500' },
                  { label: 'Women Safety / Stalking (Pink Hoysala)', pct: 28, count: 12, color: 'bg-purple-500' },
                  { label: 'Civic Waterlogging / Potholes (BBMP)', pct: 18, count: 8, color: 'bg-teal-500' },
                  { label: 'Medical Emergencies (108 ALS)', pct: 12, count: 5, color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-neutral-700">{item.label}</span>
                      <span className="font-bold text-neutral-900">{item.count} cases ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#1E282D] uppercase tracking-wider">
                SLA Compliance Metrics (Under 7m Target)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-[#EBF5ED] border border-[#CCDCD0] flex justify-between">
                  <span className="font-semibold text-[#2F5952]">Overall SLA Compliance:</span>
                  <span className="font-bold text-[#2F5952]">94.2%</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex justify-between">
                  <span className="text-neutral-600">Fastest Zone Response:</span>
                  <span className="font-bold text-neutral-800">Indiranagar (3.8 mins)</span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex justify-between">
                  <span className="text-neutral-600">Peak Call Volume Window:</span>
                  <span className="font-bold text-neutral-800">18:00 - 21:30 IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E4EAE5] rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E282D]">Immutable Operations Audit Logs</h3>
              <p className="text-xs text-[#657780]">
                Cryptographically verifiable timestamped audit trail of all responder and citizen actions.
              </p>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E4EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1E282D]">{log.action}</span>
                      <span className="font-mono text-[10px] text-neutral-400">Target: {log.targetId}</span>
                    </div>
                    <p className="text-neutral-600 text-[11px]">{log.details}</p>
                    <div className="text-[10px] text-neutral-400">
                      Actor: {log.actorName} ({log.actorRole})
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-neutral-400 shrink-0">
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <AdminIncidentModal
          incident={selectedIncident}
          units={units}
          onClose={() => setSelectedIncident(null)}
          onUpdateIncident={(updated) => {
            setSelectedIncident(updated);
            reloadData();
          }}
        />
      )}
    </div>
  );
};
