import { AiTriageResult } from '../types';

export async function triageIncident(params: {
  category: string;
  description: string;
  location?: string;
  audioTranscript?: string;
}): Promise<AiTriageResult> {
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data as AiTriageResult;
  } catch (err) {
    console.warn('Backend AI triage call failed, applying client safety rules fallback:', err);
    return clientSafetyRulesFallback(params.category, params.description, params.location);
  }
}

function clientSafetyRulesFallback(category: string, description: string, location?: string): AiTriageResult {
  const text = (description + ' ' + category).toLowerCase();
  let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE' = 'MODERATE';
  let responsibleService = 'Bengaluru City Police Control Room (112)';
  let isLifeThreatening = false;
  const extractedFacts: string[] = [];
  const missingDetails: string[] = [];
  const recommendedNextSteps: string[] = [];

  if (location) extractedFacts.push(`Reported location: ${location}`);

  if (
    category === 'medical' ||
    category === 'fire' ||
    category === 'assault' ||
    text.includes('unconscious') ||
    text.includes('bleeding') ||
    text.includes('fire') ||
    text.includes('trapped')
  ) {
    severity = 'CRITICAL';
    isLifeThreatening = true;
    if (category === 'fire' || text.includes('fire')) {
      responsibleService = 'Karnataka Fire & Emergency Services (101/112)';
      recommendedNextSteps.push('Evacuate structure immediately, stay low below smoke.');
    } else if (category === 'medical' || text.includes('unconscious') || text.includes('bleeding')) {
      responsibleService = '108 Emergency Ambulance / ERSS 112';
      recommendedNextSteps.push('Do not move cervical spine if fall/collision is suspected.');
    } else {
      responsibleService = 'Bengaluru City Police & Pink Hoysala Patrol (112)';
      recommendedNextSteps.push('Move to populated, well-lit area or nearest shop/metro booth.');
    }
    recommendedNextSteps.push('Dial 112 directly if urgent physical intervention is required.');
  } else if (category === 'road_accident') {
    severity = 'HIGH';
    responsibleService = 'Bengaluru Traffic Police (BTP) & 112';
    recommendedNextSteps.push('Safeguard the scene with warning indicators if safe to do so.');
  } else if (category === 'civic' || text.includes('wire') || text.includes('pothole') || text.includes('waterlog')) {
    if (text.includes('wire') || text.includes('electric')) {
      severity = 'HIGH';
      responsibleService = 'BESCOM Emergency (1912)';
      recommendedNextSteps.push('Maintain 10m exclusion perimeter from fallen electrical infrastructure.');
    } else {
      severity = 'MODERATE';
      responsibleService = 'Bruhat Bengaluru Mahanagara Palike (BBMP Sahaya)';
      recommendedNextSteps.push('Photo evidence queued for BBMP ward field verification.');
    }
  }

  return {
    category,
    severity,
    confidence: 0.9,
    isLifeThreatening,
    responsibleService,
    extractedFacts: extractedFacts.length ? extractedFacts : ['Incident logged through citizen terminal'],
    missingDetails: ['Specific landmarks or nearby cross streets'],
    rationale: 'Deterministic safety rules evaluated keywords and categorized jurisdiction conservatively.',
    recommendedNextSteps: recommendedNextSteps.length ? recommendedNextSteps : ['Stay calm and keep telephone line open for emergency verification.'],
    isDuplicateCandidate: false,
    aiModel: 'Deterministic-Safety-Rules-Offline',
    note: 'Evaluated locally via deterministic emergency heuristics.',
  };
}
