/**
 * SENTRIX — Smart Citizen Safety & Emergency Response Platform
 * Core TypeScript Data Models
 */

export type Role = 'citizen' | 'responder' | 'admin';

export type EmergencyCategory =
  | 'road_accident'
  | 'medical'
  | 'harassment'
  | 'fire'
  | 'personal_threat'
  | 'dangerous_crowd'
  | 'flood'
  | 'missing_vulnerable'
  | 'other';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE';

export type IncidentStatus =
  | 'received'
  | 'awaiting_review'
  | 'assigned'
  | 'in_progress'
  | 'action_taken'
  | 'resolved'
  | 'closed';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  address?: string;
  landmark?: string;
  ward?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notifyOnSos: boolean;
  isVerified?: boolean;
}

export interface AiTriageResult {
  category: string;
  severity: IncidentSeverity;
  confidence: number;
  isLifeThreatening: boolean;
  responsibleService: string;
  extractedFacts: string[];
  missingDetails: string[];
  rationale: string;
  recommendedNextSteps: string[];
  isDuplicateCandidate: boolean;
  aiModel?: string;
  note?: string;
}

export interface DispatchUnit {
  id: string;
  name: string;
  type: 'pink_hoysala' | 'traffic_police' | 'ambulance_108' | 'fire_rescue' | 'bbmp_team';
  status: 'available' | 'dispatched' | 'en_route' | 'on_scene';
  contactNumber: string;
  currentWard: string;
}

export interface IncidentReport {
  id: string; // e.g. SNX-BLR-2026-1042
  type: 'sos' | 'transport_safety' | 'civic_hazard' | 'complaint_box';
  category: EmergencyCategory | string;
  title: string;
  description: string;
  audioTranscript?: string;
  location: LocationCoordinates;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdAt: string;
  updatedAt: string;
  citizenName?: string;
  citizenPhone?: string;
  isAnonymous: boolean;
  assignedUnitId?: string;
  assignedUnitName?: string;
  triage?: AiTriageResult;
  actionNotes: {
    id: string;
    timestamp: string;
    author: string;
    role: string;
    note: string;
  }[];
  attachments?: {
    id: string;
    type: 'image' | 'audio';
    url: string;
    caption?: string;
  }[];
  // Specific fields for transport harassment
  transportDetails?: {
    transportType: 'bmtc_bus' | 'namma_metro' | 'auto' | 'cab' | 'bus_stop' | 'railway_station';
    routeOrVehicleNumber?: string;
    metroStation?: string;
  };
  // Specific fields for civic complaint
  civicDetails?: {
    hazardType: 'pothole' | 'traffic_signal' | 'waterlogging' | 'exposed_wire' | 'fallen_tree' | 'garbage' | 'drainage' | 'footpath';
    department: 'BBMP' | 'BESCOM' | 'BWSSB' | 'BTP';
    officialReferenceNumber?: string;
  };
}

export interface LocationShareSession {
  id: string;
  startTime: string;
  expiresAt: string;
  durationMinutes: number;
  recipientContactIds: string[];
  currentLocation: LocationCoordinates;
  isActive: boolean;
  lastPingTime: string;
}

export interface HazardAlert {
  id: string;
  title: string;
  description: string;
  category: 'waterlogging' | 'road_accident' | 'traffic_block' | 'weather' | 'electrical_hazard' | 'civic_work';
  severity: IncidentSeverity;
  ward: string;
  coordinates: [number, number]; // [lat, lng]
  isVerified: boolean;
  verifiedBy?: string;
  reportedAt: string;
  expiresAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'sos_update' | 'complaint_update' | 'hazard_alert' | 'safety_advisory' | 'system';
  severity?: IncidentSeverity;
  timestamp: string;
  isRead: boolean;
  deepLinkTarget?: string; // e.g. "report:SNX-BLR-2026-1042"
}

export interface LawArticle {
  id: string;
  title: string;
  shortSummary: string;
  category: 'women_safety' | 'road_safety' | 'civic_rights' | 'consumer_police';
  legalSections: string; // e.g. "Sections 74-78, Bharatiya Nyaya Sanhita (BNS) 2023"
  plainLanguageExplanation: string;
  citizenRights: string[];
  officialSource: string;
  lastReviewedDate: string;
}

export interface GovtDirectoryItem {
  id: string;
  name: string;
  category: 'emergency' | 'police' | 'women_child' | 'civic_utilities' | 'transport' | 'legal_aid';
  phone: string;
  tollFree?: string;
  address?: string;
  websiteUrl?: string;
  description: string;
  isEmergencyLine?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetId: string;
  details: string;
  ipMock?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  emergencyRole: Role;
  preferredLanguage: 'en' | 'kn' | 'hi' | 'ta' | 'te';
  homeWard: string;
  bloodGroup: string;
  allergies?: string;
  medicalNotes?: string;
  contacts: TrustedContact[];
  consentLocation: boolean;
  consentMicrophone: boolean;
}
