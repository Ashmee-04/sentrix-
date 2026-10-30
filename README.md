# SENTRIX — Smart Citizen Safety & Emergency Response Platform
**Bengaluru Metropolitan Area, Karnataka, India**

SENTRIX is an end-to-end civic-tech safety platform engineered for Bengaluru citizens and authorized emergency responders. It combines rapid multi-category SOS dispatch, server-side Gemini AI incident triage, verified Karnataka emergency directory and legal guides, public transit harassment reporting, and a full command-center responder dashboard.

---

## 1. Key Features & Workflows

### Citizen Portal
- **Emergency SOS & 1-Tap Triggers**: Rapid categories (Road Crash, 108 Medical, Harassment/Assault, Fire & Rescue, Personal Threat, Dangerous Crowd, Flood/Waterlogging, Missing Vulnerable Person).
- **Speech-to-Text & Hands-Free Audio**: Live Web Speech API transcription with real-time interim results and manual text fallback.
- **5-Second Abort Countdown**: Visual and tactile abort window to prevent accidental false alarms before dispatch transmission.
- **112 Direct Dial Action**: One-tap dialing to Karnataka Emergency Response Support System (ERSS 112).
- **Consent-Based Live Journey Sharing**: Time-limited (15m, 1h, 4h, 8h) encrypted GPS tracking shared strictly with selected trusted contacts, with immediate stop control.
- **Lock-screen SOS Simulator**: Interactive lock-screen overlay with Medical ID card (Blood group, allergies), loud synthesized audio siren, flashlight strobe, and technical architecture specifications for native Android deployment.
- **Discreet Women's Safety & Quick Exit**: Immediate decoy screen (neutral Bengaluru Weather & Namma Metro schedule) for personal privacy and physical safety.
- **Public Transport Harassment Reporting**: Specialized reporting for BMTC buses, Namma Metro Purple & Green lines, and auto-rickshaws with anonymous reporting option.
- **Civic Hazards & BBMP Complaint Box**: Potholes, broken signals, fallen trees, and exposed BESCOM wires with Karnataka Sakala Act reference tracking.
- **Know Your Laws**: Plain-language legal guides on Zero FIR (BNSS 173(1)), Stalking & Harassment (BNS 74-78), Good Samaritan immunity (MVA 134A), and Arrest rights for women.
- **Verified Karnataka Government Directory**: Verified contacts and portal links for 112, Parihar 1091, Pink Hoysala, 108 Ambulance, Cybercrime 1930, and BBMP Sahaya 1533.
- **Nearby Hazard Map**: Interactive Bengaluru cartographic safety radar with verified municipal hazard pins.

### AI Incident Intelligence & Triage
- **Secure Backend Route (`/api/triage`)**: Powered by `@google/genai` using model `gemini-3.8-flash`.
- **Structured JSON Schema**:
  - `category`, `severity` (`CRITICAL`, `HIGH`, `MODERATE`, `ROUTINE`), `confidence`
  - `isLifeThreatening`: Conservative escalation
  - `responsibleService`: e.g. Bengaluru City Police 112, 108 Ambulance, Pink Hoysala, BBMP, BESCOM
  - `extractedFacts` & `missingDetails`
  - `recommendedNextSteps`: Immediate citizen instructions and responder advice
- **Zero-Delay Offline Fallback**: Deterministic safety rules engine runs automatically if API keys are unconfigured or offline.
- **Ethical AI Guardrails**: AI never delays emergency 112 dialing, never diagnoses medical ailments, never infers legal guilt, and labels all insights as "Subject to Human Dispatcher Review".

### Responder & Admin Operations Dashboard
- **Incident Dispatch Queue**: Filterable by severity, status, ward, with rapid patrol assignment.
- **Operations Map**: Live visual tracking of incidents and patrolling units (Pink Hoysala 14, Traffic Hoysala 08, 108 ALS Ambulance).
- **Audit Logs**: Cryptographically tracked immutable log of all operator and citizen actions.
- **Analytics & SLA**: Ward distribution, emergency categories, and response times against the under-7-minute target.

---

## 2. Environment Variables & Setup

Create or update `.env` with:
```env
# Port configuration
PORT=3000

# Gemini API Key (Injected automatically by Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# App URL
APP_URL="http://localhost:3000"
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite)
npm run dev

# Run TypeScript compile validation
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

---

## 3. Production Limitations & Truthfulness

1. **Sandboxed SMS & Police Dispatch**: All SMS dispatches to emergency contacts and dispatch unit alerts are simulated in an honest sandbox. For actual life-threatening incidents, users must dial **112**.
2. **Lock-Screen OS Overlay**: In accordance with browser security sandboxing, web applications cannot display above native Android lock-screens without an Android native wrapper (`APK`) running a `ForegroundService` with `FLAG_SHOW_WHEN_LOCKED`.
3. **Medical & Legal Non-Advice**: AI triage notes and statutory law articles are civic guidance tools; they do not replace formal diagnosis by licensed medical practitioners or legal advice by advocates.
