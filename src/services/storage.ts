import {
  IncidentReport,
  UserProfile,
  HazardAlert,
  NotificationItem,
  LawArticle,
  GovtDirectoryItem,
  AuditLogEntry,
  DispatchUnit,
  LocationShareSession,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'sentrix_user_profile',
  INCIDENTS: 'sentrix_incidents',
  HAZARDS: 'sentrix_hazards',
  NOTIFICATIONS: 'sentrix_notifications',
  LOCATION_SHARE: 'sentrix_location_share',
  AUDIT_LOGS: 'sentrix_audit_logs',
  DISPATCH_UNITS: 'sentrix_dispatch_units',
};

// Initial verified Laws Data (BNS, CrPC, Motor Vehicles Act, Sakala)
export const INITIAL_LAWS: LawArticle[] = [
  {
    id: 'law-zero-fir',
    title: 'Zero FIR Rights (Any Police Station)',
    shortSummary: 'File an FIR at any police station regardless of jurisdiction, especially for cognizable offences against women.',
    category: 'women_safety',
    legalSections: 'Section 173(1) of Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    plainLanguageExplanation:
      'If a crime occurs, you do not have to travel to the police station having territorial jurisdiction over the spot. Any police station is legally mandated to register a "Zero FIR", initiate immediate preliminary investigation, and subsequently transfer it to the jurisdictional station. Police officers cannot turn you away citing jurisdiction.',
    citizenRights: [
      'Police cannot refuse to register an FIR citing boundary/jurisdiction limits.',
      'Immediate medical examination and evidence preservation must be initiated.',
      'A free copy of the Zero FIR must be handed over to the informant immediately.',
    ],
    officialSource: 'Karnataka State Police & Supreme Court of India directives (Lalita Kumari vs Govt of UP)',
    lastReviewedDate: 'October 2026',
  },
  {
    id: 'law-bns-harassment',
    title: 'Protection from Stalking, Sexual Harassment & Voyeurism',
    shortSummary: 'Criminal penalties for stalking, physical or verbal harassment in public spaces and transit.',
    category: 'women_safety',
    legalSections: 'Sections 74, 75, 77, 78 of Bharatiya Nyaya Sanhita (BNS) 2023',
    plainLanguageExplanation:
      'Following a woman, attempting to foster personal contact despite clear indication of disinterest, monitoring online activities, or making unwelcome sexually colored remarks or gestures in buses, metro, or public streets constitutes a punishable cognizable offence with imprisonment up to 3 to 5 years.',
    citizenRights: [
      'Right to report anonymously or discreetly through Pink Hoysala and Parihar desks.',
      'Statements of women victims of harassment must be recorded by a woman police officer.',
      'Identity of the complainant is strictly protected under Section 73 BNS.',
    ],
    officialSource: 'Ministry of Law & Justice, Govt of India & Karnataka Police Women Wing',
    lastReviewedDate: 'October 2026',
  },
  {
    id: 'law-good-samaritan',
    title: 'Good Samaritan Protection for Road Accident Helpers',
    shortSummary: 'Total legal and financial immunity for citizens who assist road accident victims.',
    category: 'road_safety',
    legalSections: 'Section 134A of Motor Vehicles Act & Supreme Court Guidelines',
    plainLanguageExplanation:
      'Any citizen who rushes an accident victim to a hospital or dials 112 cannot be forced to disclose their name, address, or be detained at the police station. You cannot be treated as a witness without your explicit consent, and hospitals cannot demand upfront fees from the bystander before administering emergency first aid.',
    citizenRights: [
      'No civil or criminal liability for accidental death or injury while rendering assistance.',
      'Hospitals must immediately provide basic life support without waiting for police arrival or advance payment.',
      'Karnataka Mukhyamantri Santwana Harish Scheme provides immediate emergency medical treatment up to ₹25,000 in first 48 hours.',
    ],
    officialSource: 'Karnataka Transport Dept & Suvarna Arogya Suraksha Trust',
    lastReviewedDate: 'September 2026',
  },
  {
    id: 'law-sakala-civic',
    title: 'Karnataka Sakala Act (Guarantee of Public Services)',
    shortSummary: 'Legally mandated time bounds for municipal grievance redressal, pothole repair, and utility fixes.',
    category: 'civic_rights',
    legalSections: 'Karnataka Guarantee of Services to Citizens Act (Sakala) 2011',
    plainLanguageExplanation:
      'Under the Sakala Act, citizens have the legal right to receive designated civic and municipal services within predetermined timelines (e.g., street light fix within 48 hours, potable water contamination repair within 24 hours). If officers default without justifiable cause, statutory compensation can be awarded to the citizen.',
    citizenRights: [
      'Unique GSC (Guarantee of Service to Citizen) tracking number for every complaint.',
      'Automatic escalation to designated appellate authority if service is overdue.',
      'Right to compensation deducted from the defaulting officer’s salary.',
    ],
    officialSource: 'Govt of Karnataka Sakala Mission (sakala.kar.nic.in)',
    lastReviewedDate: 'October 2026',
  },
  {
    id: 'law-police-sunset',
    title: 'Arrest & Interrogation Protections for Women',
    shortSummary: 'No woman can be arrested between sunset and sunrise except under exceptional magistrate orders.',
    category: 'consumer_police',
    legalSections: 'Section 43(5) of Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    plainLanguageExplanation:
      'Save in exceptional circumstances and only with prior permission of a Judicial Magistrate, no woman can be arrested after sunset and before sunrise. Any questioning must be conducted in the presence of female police personnel and preferably at the woman’s residence.',
    citizenRights: [
      'Arrest must be executed by a female police officer.',
      'Medical examination of female accused must be done only by or under supervision of female medical practitioner.',
      'Family or legal counsel must be notified immediately upon detention.',
    ],
    officialSource: 'Bureau of Police Research and Development (BPR&D)',
    lastReviewedDate: 'August 2026',
  },
];

// Initial verified Karnataka Government Directory
export const INITIAL_GOVT_DIRECTORY: GovtDirectoryItem[] = [
  {
    id: 'dir-erss-112',
    name: 'Karnataka Emergency Response Support System (ERSS)',
    category: 'emergency',
    phone: '112',
    tollFree: '112',
    websiteUrl: 'https://ksp.karnataka.gov.in',
    description: 'Unified single emergency helpline across Karnataka for Police, Fire, and Medical emergencies. Connected to GPS-tracked Hoysala patrol vehicles.',
    isEmergencyLine: true,
  },
  {
    id: 'dir-parihar',
    name: 'Bengaluru City Police Parihar & Vanitha Sahayavani',
    category: 'women_child',
    phone: '080-22943225',
    tollFree: '1091',
    address: 'Police Commissioner Office, Infantry Road, Bengaluru, 560001',
    websiteUrl: 'https://bengalurucitypolice.karnataka.gov.in',
    description: 'Specialized 24/7 women support center providing immediate police assistance, rescue, legal aid, and professional counselling.',
    isEmergencyLine: true,
  },
  {
    id: 'dir-pink-hoysala',
    name: 'Bengaluru Pink Hoysala Women Safety Patrol',
    category: 'police',
    phone: '112',
    tollFree: '1091',
    description: 'Dedicated fleet of 51+ Pink Hoysala vehicles stationed near colleges, IT corridors, garment factories, and metro stations staffed by women personnel.',
    isEmergencyLine: true,
  },
  {
    id: 'dir-cyber-1930',
    name: 'Karnataka Cyber Crime Emergency Cell',
    category: 'police',
    phone: '1930',
    websiteUrl: 'https://cybercrime.gov.in',
    description: 'Immediate response unit for online harassment, financial fraud, impersonation, and non-consensual image sharing.',
    isEmergencyLine: false,
  },
  {
    id: 'dir-ambulance-108',
    name: 'Arogya Kavacha (108 Ambulance Karnataka)',
    category: 'emergency',
    phone: '108',
    tollFree: '108',
    description: 'State emergency medical transport with Advanced Life Support (ALS) and Basic Life Support (BLS) units across Bengaluru.',
    isEmergencyLine: true,
  },
  {
    id: 'dir-bbmp-sahaya',
    name: 'BBMP Sahaya Civic Grievances (Bruhat Bengaluru)',
    category: 'civic_utilities',
    phone: '080-22660000',
    tollFree: '1533',
    websiteUrl: 'https://bbmp.gov.in',
    description: 'Official municipal redressal for road potholes, fallen trees, flooding, garbage dumping, and storm water drain blockage.',
    isEmergencyLine: false,
  },
  {
    id: 'dir-bescom',
    name: 'BESCOM Electricity Emergency Helpline',
    category: 'civic_utilities',
    phone: '1912',
    tollFree: '1912',
    websiteUrl: 'https://bescom.karnataka.gov.in',
    description: 'Immediate reporting for snapped/exposed electrical wires, transformer sparks, and power outages in Bengaluru metropolitan area.',
    isEmergencyLine: true,
  },
  {
    id: 'dir-kslsa-legal',
    name: 'Karnataka State Legal Services Authority (KSLSA)',
    category: 'legal_aid',
    phone: '080-22111714',
    tollFree: '15100',
    address: 'Nyaya Degula, 1st Floor, H. Siddaiah Road, Bengaluru, 560027',
    websiteUrl: 'https://kslsa.kar.nic.in',
    description: 'Free legal aid, counsel, and victim representation for women, children, accident victims, and indigent citizens under the Legal Services Authorities Act.',
    isEmergencyLine: false,
  },
  {
    id: 'dir-bmtc-helpline',
    name: 'BMTC Commuter Support & Women Safety Cell',
    category: 'transport',
    phone: '080-22483777',
    tollFree: '1800-425-1663',
    websiteUrl: 'https://mybmtc.karnataka.gov.in',
    description: 'Bengaluru bus service complaint desk for driver/conductor misbehavior, harassment inside buses, and schedule assistance.',
    isEmergencyLine: false,
  },
  {
    id: 'dir-bmrcl-metro',
    name: 'Namma Metro Security Control (BMRCL)',
    category: 'transport',
    phone: '080-25191091',
    tollFree: '1800-425-12345',
    websiteUrl: 'https://english.bmrc.co.in',
    description: 'Rapid assistance for security, lost items, and passenger safety across Purple and Green metro lines.',
    isEmergencyLine: false,
  },
];

// Seed incidents for demo realism
export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'SNX-BLR-2026-1042',
    type: 'sos',
    category: 'road_accident',
    title: 'Two-Wheeler Collision with Light Vehicle',
    description: 'Motorcycle skidded and hit a divider near Indiranagar 100ft road junction. Rider conscious but has leg injury. Traffic moving slowly.',
    audioTranscript: 'Rider is on the road shoulder. Need an ambulance and traffic support immediately near KFC signal.',
    location: {
      latitude: 12.9719,
      longitude: 77.6412,
      accuracyMeters: 8,
      address: '100 Feet Rd, HAL 2nd Stage, Indiranagar',
      landmark: 'Near KFC Junction',
      ward: 'Indiranagar (Ward 112)',
    },
    status: 'assigned',
    severity: 'HIGH',
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 98450 12345',
    isAnonymous: false,
    assignedUnitId: 'unit-th-08',
    assignedUnitName: 'Traffic Hoysala 08 (Indiranagar)',
    triage: {
      category: 'road_accident',
      severity: 'HIGH',
      confidence: 0.94,
      isLifeThreatening: false,
      responsibleService: 'Bengaluru Traffic Police & 108 Ambulance',
      extractedFacts: ['Rider conscious with lower limb injury', 'Accident site near KFC junction, Indiranagar 100ft road'],
      missingDetails: ['Vehicle registration numbers for formal case registration'],
      rationale: 'Traffic flow impacted and medical first-aid needed. Non-life-threatening trauma reported.',
      recommendedNextSteps: ['Do not move injured limb without splint', 'Traffic Hoysala en route for cordoning and 108 dispatch'],
      isDuplicateCandidate: false,
      aiModel: 'gemini-3.8-flash',
    },
    actionNotes: [
      {
        id: 'note-1',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        author: 'Dispatcher Suresh V.',
        role: 'Police Control Officer',
        note: 'Alert received and verified. Traffic Hoysala 08 dispatched from CMH Road.',
      },
      {
        id: 'note-2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        author: 'ASI Ramesh (Hoysala 08)',
        role: 'Field Responder',
        note: 'Arrived at scene. Patient provided water and road cleared. 108 ambulance arrived.',
      },
    ],
  },
  {
    id: 'SNX-BLR-2026-1039',
    type: 'transport_safety',
    category: 'harassment',
    title: 'Persistent Stalking at Metro Station Exit',
    description: 'Two individuals following commuter from Indiranagar Metro exit towards CMH road. Passersby alerted.',
    location: {
      latitude: 12.9784,
      longitude: 77.6408,
      address: 'Indiranagar Metro Station Gate B',
      landmark: 'CMH Road Junction',
      ward: 'Indiranagar (Ward 112)',
    },
    status: 'action_taken',
    severity: 'HIGH',
    createdAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    citizenName: 'Anonymous Commuter',
    isAnonymous: true,
    transportDetails: {
      transportType: 'namma_metro',
      metroStation: 'Indiranagar Metro Station',
    },
    assignedUnitId: 'unit-ph-14',
    assignedUnitName: 'Pink Hoysala 14 (East Division)',
    triage: {
      category: 'harassment',
      severity: 'HIGH',
      confidence: 0.91,
      isLifeThreatening: false,
      responsibleService: 'Bengaluru City Police Pink Hoysala',
      extractedFacts: ['Stalking in progress at metro station Gate B', 'Victim requested anonymous reporting'],
      missingDetails: ['Description of clothing or vehicle if suspects are mobile'],
      rationale: 'Active threat in transit corridor. Immediate patrol interception required.',
      recommendedNextSteps: ['Stay inside metro premises security booth until patrol arrives', 'Pink Hoysala unit dispatched'],
      isDuplicateCandidate: false,
      aiModel: 'gemini-3.8-flash',
    },
    actionNotes: [
      {
        id: 'note-3',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        author: 'WPC Bhavya (Pink Hoysala 14)',
        role: 'Field Responder',
        note: 'Patrol arrived at Metro Gate B. Suspects dispersed upon siren. Complainant safely escorted to destination.',
      },
    ],
  },
  {
    id: 'SNX-BLR-2026-1011',
    type: 'civic_hazard',
    category: 'flood',
    title: 'Severe Waterlogging & Floating Manhole Cover',
    description: 'Underpass flooded with approximately 2.5 feet of stagnant rainwater after heavy evening downpour. Heavy traffic stalled.',
    location: {
      latitude: 12.9172,
      longitude: 77.6228,
      address: 'Silk Board Flyover Underpass',
      landmark: 'Near Silk Board Junction',
      ward: 'BTM Layout (Ward 176)',
    },
    status: 'in_progress',
    severity: 'HIGH',
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    citizenName: 'Karthik Narayanan',
    citizenPhone: '+91 97310 98765',
    isAnonymous: false,
    civicDetails: {
      hazardType: 'waterlogging',
      department: 'BBMP',
      officialReferenceNumber: 'BBMP-2026-E-0941',
    },
    assignedUnitId: 'unit-bbmp-01',
    assignedUnitName: 'BBMP Quick Response Dewatering Team',
    triage: {
      category: 'flood',
      severity: 'HIGH',
      confidence: 0.96,
      isLifeThreatening: false,
      responsibleService: 'BBMP Stormwater Drainage & Traffic Police',
      extractedFacts: ['2.5 feet deep waterlogging at Silk Board underpass', 'High risk of vehicular stall and pedestrian injury'],
      missingDetails: ['Status of sub-surface drainage pump station'],
      rationale: 'Major arterial traffic disruption in south Bengaluru. Requires dewatering pumps.',
      recommendedNextSteps: ['Avoid underpass; take flyover ramp towards HSR Layout', 'Deploy portable high-capacity dewatering pump'],
      isDuplicateCandidate: true,
      aiModel: 'gemini-3.8-flash',
    },
    actionNotes: [
      {
        id: 'note-4',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        author: 'Eng. Anand Kumar (BBMP)',
        role: 'Civic Engineer',
        note: 'Dewatering pump unit installed. Water level decreasing. Barricades placed around dislodged manhole.',
      },
    ],
  },
];

// Initial Hazard Alerts
export const INITIAL_HAZARDS: HazardAlert[] = [
  {
    id: 'haz-01',
    title: 'Silk Board Underpass Stagnant Waterlogging',
    description: 'Underpass waterlogged up to 2 feet. Light motor vehicles advised to take elevated flyover ramp.',
    category: 'waterlogging',
    severity: 'HIGH',
    ward: 'BTM Layout',
    coordinates: [12.9172, 77.6228],
    isVerified: true,
    verifiedBy: 'Bengaluru Traffic Police South',
    reportedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'haz-02',
    title: 'Tree Fallen on CMH Road near Metro Pillar 84',
    description: 'BBMP forest wing clearing fallen branches. One lane open for vehicular movement.',
    category: 'civic_work',
    severity: 'MODERATE',
    ward: 'Indiranagar',
    coordinates: [12.9782, 77.6385],
    isVerified: true,
    verifiedBy: 'BBMP East Control Room',
    reportedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'haz-03',
    title: 'Snapped BESCOM Low-Tension Wire Reported',
    description: 'Electric wire hanging near residential lane. Power isolated. Repair team dispatched.',
    category: 'electrical_hazard',
    severity: 'HIGH',
    ward: 'Koramangala 4th Block',
    coordinates: [12.9345, 77.6265],
    isVerified: true,
    verifiedBy: 'BESCOM Sub-division 04',
    reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'haz-04',
    title: 'Traffic Signal Failure at Trinity Circle',
    description: 'Signals blinking amber. Traffic marshals manually directing flow during peak hours.',
    category: 'traffic_block',
    severity: 'MODERATE',
    ward: 'MG Road / Ashok Nagar',
    coordinates: [12.973, 77.6198],
    isVerified: false,
    reportedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
  },
];

// Initial Dispatch Units
export const INITIAL_UNITS: DispatchUnit[] = [
  {
    id: 'unit-ph-14',
    name: 'Pink Hoysala 14 (Women Safety Patrol)',
    type: 'pink_hoysala',
    status: 'available',
    contactNumber: '+91 94808 01091',
    currentWard: 'Indiranagar / Halasuru',
  },
  {
    id: 'unit-ph-22',
    name: 'Pink Hoysala 22 (South East Zone)',
    type: 'pink_hoysala',
    status: 'available',
    contactNumber: '+91 94808 01092',
    currentWard: 'Koramangala / HSR',
  },
  {
    id: 'unit-th-08',
    name: 'Traffic Hoysala 08 (East Traffic)',
    type: 'traffic_police',
    status: 'on_scene',
    contactNumber: '+91 94808 02108',
    currentWard: 'Indiranagar 100ft Rd',
  },
  {
    id: 'unit-amb-12',
    name: '108 ALS Ambulance (Chinmaya Mission Hospital base)',
    type: 'ambulance_108',
    status: 'available',
    contactNumber: '108',
    currentWard: 'Indiranagar',
  },
  {
    id: 'unit-bbmp-01',
    name: 'BBMP Rapid Civic Response East',
    type: 'bbmp_team',
    status: 'en_route',
    contactNumber: '+91 80 2266 0000',
    currentWard: 'BTM Layout / Silk Board',
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Responder Unit Dispatched (SNX-BLR-2026-1042)',
    message: 'Traffic Hoysala 08 has been dispatched to 100 Feet Rd, Indiranagar. ETA 4 mins.',
    type: 'sos_update',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    deepLinkTarget: 'report:SNX-BLR-2026-1042',
  },
  {
    id: 'notif-2',
    title: 'Severe Weather / Waterlogging Advisory',
    message: 'IMD Alert: Heavy rain forecast across Bengaluru East and South. Avoid Silk Board underpass.',
    type: 'hazard_alert',
    severity: 'HIGH',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Pink Hoysala Safe Corridor Verification',
    message: 'Namma Metro Indiranagar to CMH Road night escort corridor patrolled by Pink Hoysala.',
    type: 'safety_advisory',
    severity: 'ROUTINE',
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-blr-001',
  name: 'Priya Sharma',
  phone: '+91 98450 12345',
  email: 'priya.sharma@example.com',
  emergencyRole: 'citizen',
  preferredLanguage: 'en',
  homeWard: 'Indiranagar (Ward 112)',
  bloodGroup: 'B+',
  allergies: 'Penicillin',
  medicalNotes: 'Asthma inhaler in bag',
  consentLocation: true,
  consentMicrophone: true,
  contacts: [
    {
      id: 'c-1',
      name: 'Rohan Sharma',
      phone: '+91 98450 99887',
      relationship: 'Brother',
      notifyOnSos: true,
      isVerified: true,
    },
    {
      id: 'c-2',
      name: 'Ananya Deshmukh',
      phone: '+91 98860 11223',
      relationship: 'Colleague & Roommate',
      notifyOnSos: true,
      isVerified: true,
    },
    {
      id: 'c-3',
      name: 'Dr. K. S. Sharma',
      phone: '+91 98440 33445',
      relationship: 'Father / Emergency Contact',
      notifyOnSos: true,
      isVerified: true,
    },
  ],
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-01',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    actorName: 'Inspector Manjunath K.',
    actorRole: 'Police Control Officer',
    action: 'DISPATCH_ASSIGNMENT',
    targetId: 'SNX-BLR-2026-1042',
    details: 'Assigned Traffic Hoysala 08 to road accident near Indiranagar 100ft road.',
    ipMock: '10.142.22.4 (Police Intranet VPN)',
  },
  {
    id: 'audit-02',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    actorName: 'Inspector Manjunath K.',
    actorRole: 'Police Control Officer',
    action: 'UNIT_DISPATCH',
    targetId: 'SNX-BLR-2026-1039',
    details: 'Dispatched Pink Hoysala 14 for Metro Gate B stalker report.',
    ipMock: '10.142.22.4',
  },
  {
    id: 'audit-03',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    actorName: 'Rashmi Rao',
    actorRole: 'BBMP Municipal Engineer',
    action: 'CIVIC_VERIFICATION',
    targetId: 'SNX-BLR-2026-1011',
    details: 'Verified Silk Board waterlogging and issued work order to dewatering squad.',
    ipMock: '192.168.1.55 (BBMP Sahaya Desk)',
  },
];

// Helper to load or initialize from localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const StorageService = {
  getUserProfile(): UserProfile {
    return getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
  },

  saveUserProfile(profile: UserProfile): void {
    setStored(STORAGE_KEYS.USER_PROFILE, profile);
  },

  getIncidents(): IncidentReport[] {
    return getStored<IncidentReport[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
  },

  saveIncident(incident: IncidentReport): void {
    const current = this.getIncidents();
    const existingIndex = current.findIndex((i) => i.id === incident.id);
    let updated: IncidentReport[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...incident, updatedAt: new Date().toISOString() };
    } else {
      updated = [incident, ...current];
    }
    setStored(STORAGE_KEYS.INCIDENTS, updated);
  },

  getIncidentById(id: string): IncidentReport | undefined {
    return this.getIncidents().find((i) => i.id === id);
  },

  getHazards(): HazardAlert[] {
    return getStored<HazardAlert[]>(STORAGE_KEYS.HAZARDS, INITIAL_HAZARDS);
  },

  saveHazard(hazard: HazardAlert): void {
    const current = this.getHazards();
    const index = current.findIndex((h) => h.id === hazard.id);
    let updated: HazardAlert[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = hazard;
    } else {
      updated = [hazard, ...current];
    }
    setStored(STORAGE_KEYS.HAZARDS, updated);
  },

  getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  saveNotifications(notifs: NotificationItem[]): void {
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  addNotification(notif: NotificationItem): void {
    const current = this.getNotifications();
    this.saveNotifications([notif, ...current]);
  },

  markNotificationAsRead(id: string): void {
    const current = this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveNotifications(updated);
  },

  markAllNotificationsAsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(updated);
  },

  getDispatchUnits(): DispatchUnit[] {
    return getStored<DispatchUnit[]>(STORAGE_KEYS.DISPATCH_UNITS, INITIAL_UNITS);
  },

  saveDispatchUnits(units: DispatchUnit[]): void {
    setStored(STORAGE_KEYS.DISPATCH_UNITS, units);
  },

  getAuditLogs(): AuditLogEntry[] {
    return getStored<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    const current = this.getAuditLogs();
    setStored(STORAGE_KEYS.AUDIT_LOGS, [fullEntry, ...current]);
  },

  getLocationShareSession(): LocationShareSession | null {
    return getStored<LocationShareSession | null>(STORAGE_KEYS.LOCATION_SHARE, null);
  },

  saveLocationShareSession(session: LocationShareSession | null): void {
    setStored(STORAGE_KEYS.LOCATION_SHARE, session);
  },

  resetDemoData(): void {
    localStorage.clear();
    setStored(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
    setStored(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    setStored(STORAGE_KEYS.HAZARDS, INITIAL_HAZARDS);
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStored(STORAGE_KEYS.DISPATCH_UNITS, INITIAL_UNITS);
    setStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
};
