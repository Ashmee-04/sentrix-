import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SENTRIX',
    city: 'Bengaluru, Karnataka',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Deterministic rules-based triage fallback
function deterministicTriage(category: string, description: string, location?: string) {
  const text = (description + ' ' + category).toLowerCase();
  
  let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE' = 'MODERATE';
  let responsibleService = 'Bengaluru City Police Control Room (112)';
  let isLifeThreatening = false;
  const extractedFacts: string[] = [];
  const missingDetails: string[] = [];
  const recommendedNextSteps: string[] = [];

  if (location) extractedFacts.push(`Reported location: ${location}`);

  // Life threat checks
  if (
    text.includes('unconscious') ||
    text.includes('bleeding heavily') ||
    text.includes('trapped') ||
    text.includes('fire') ||
    text.includes('weapon') ||
    text.includes('knife') ||
    text.includes('assault') ||
    text.includes('cardiac') ||
    category === 'medical' ||
    category === 'fire' ||
    category === 'assault' ||
    category === 'road_accident'
  ) {
    if (category === 'fire' || text.includes('fire') || text.includes('trapped') || text.includes('gas leak')) {
      severity = 'CRITICAL';
      isLifeThreatening = true;
      responsibleService = 'Karnataka Fire & Emergency Services (101/112)';
      extractedFacts.push('Potential fire/structural entrapment hazard detected');
      recommendedNextSteps.push('Evacuate to open assembly point immediately away from smoke');
      recommendedNextSteps.push('Dial 112 directly if safe to speak');
    } else if (category === 'medical' || text.includes('bleeding') || text.includes('unconscious') || text.includes('heart') || text.includes('ambulance')) {
      severity = 'CRITICAL';
      isLifeThreatening = true;
      responsibleService = 'Emergency Medical Services (108 / 112)';
      extractedFacts.push('Immediate medical attention required');
      recommendedNextSteps.push('Check patient responsiveness without moving neck in case of trauma');
      recommendedNextSteps.push('Ensure airway is open and clear crowd');
    } else if (category === 'assault' || category === 'harassment' || text.includes('stalk') || text.includes('threat')) {
      severity = category === 'assault' ? 'CRITICAL' : 'HIGH';
      isLifeThreatening = category === 'assault';
      responsibleService = 'Bengaluru City Police / Pink Hoysala Patrol (112 / 1091)';
      extractedFacts.push('Interpersonal threat or harassment incident reported');
      recommendedNextSteps.push('Move towards a well-lit, populated public area or nearest metro station/shop');
      recommendedNextSteps.push('Activate live location sharing with trusted emergency contacts');
    } else {
      severity = 'HIGH';
      responsibleService = 'Bengaluru Traffic Police & ERSS 112';
      extractedFacts.push('Traffic or vehicular emergency incident reported');
      recommendedNextSteps.push('Move injured persons to safe road shoulder if danger of oncoming traffic');
    }
  } else if (category === 'civic' || text.includes('pothole') || text.includes('waterlogging') || text.includes('tree') || text.includes('wire')) {
    if (text.includes('exposed wire') || text.includes('live wire') || text.includes('electric')) {
      severity = 'HIGH';
      responsibleService = 'BESCOM Emergency Helpline (1912)';
      extractedFacts.push('Electrical infrastructure hazard');
      recommendedNextSteps.push('Maintain minimum 10-meter distance from fallen/exposed cables');
    } else {
      severity = 'MODERATE';
      responsibleService = 'Bruhat Bengaluru Mahanagara Palike (BBMP Sahaya)';
      extractedFacts.push('Civic infrastructure defect noted');
      recommendedNextSteps.push('Provide photo evidence and landmark description for field engineers');
    }
  }

  if (!description || description.trim().length < 25) {
    missingDetails.push('Specific landmark or nearby establishment');
    missingDetails.push('Number of people affected or involved');
  }

  return {
    category: category || 'general_emergency',
    severity,
    confidence: 0.88,
    isLifeThreatening,
    responsibleService,
    extractedFacts: extractedFacts.length > 0 ? extractedFacts : ['Incident reported via SENTRIX emergency client'],
    missingDetails: missingDetails.length > 0 ? missingDetails : ['On-scene photos or vehicle registration if applicable'],
    rationale: `Rules-based deterministic triage identified severity as ${severity} under ${responsibleService} jurisdiction based on keyword heuristics.`,
    recommendedNextSteps: recommendedNextSteps.length > 0 ? recommendedNextSteps : ['Remain calm and stay in a safe position until responders arrive', 'Keep phone line open for responder verification'],
    isDuplicateCandidate: false,
    aiModel: 'Deterministic-Safety-Rules-Engine-v2',
  };
}

// AI Incident Triage Route
app.post('/api/triage', async (req, res) => {
  const { category, description, location, audioTranscript } = req.body;
  const incidentText = [description, audioTranscript].filter(Boolean).join('. ');

  if (!incidentText && !category) {
    return res.status(400).json({ error: 'Missing incident details or category' });
  }

  // Check if GEMINI_API_KEY is configured
  if (!process.env.GEMINI_API_KEY) {
    const fallback = deterministicTriage(category, incidentText, location);
    return res.json({
      ...fallback,
      note: 'Processed via offline safety rules engine (GEMINI_API_KEY unconfigured).',
    });
  }

  try {
    const ai = new GoogleGenAI();
    const prompt = `You are SENTRIX Emergency AI, an incident intelligence and triage assistant for Bengaluru City Police, BBMP, and Emergency Response Services (112 Karnataka).
Analyze the incoming citizen incident report objectively, conservatively, and rapidly.

CRITICAL SAFETY PROTOCOLS:
1. Never delay emergency calling. Always conservatively flag potential life-threatening incidents.
2. Never diagnose medical conditions or infer legal guilt.
3. Suggest responsible Karnataka/Bengaluru municipal or police service (e.g., Bengaluru City Police 112, Pink Hoysala, 108 Ambulance, Karnataka Fire & Emergency Services 101, BBMP Sahaya, BESCOM 1912, BMTC Vigilance).

Incident Details:
- Category Selected by Citizen: ${category || 'Unknown'}
- Location: ${location || 'Bengaluru, Karnataka (Coordinates available)'}
- Text/Transcript Description: "${incidentText || 'No verbal description provided'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: {
              type: Type.STRING,
              enum: ['CRITICAL', 'HIGH', 'MODERATE', 'ROUTINE'],
            },
            confidence: { type: Type.NUMBER },
            isLifeThreatening: { type: Type.BOOLEAN },
            responsibleService: { type: Type.STRING },
            extractedFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingDetails: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rationale: { type: Type.STRING },
            recommendedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            isDuplicateCandidate: { type: Type.BOOLEAN },
          },
          required: [
            'category',
            'severity',
            'confidence',
            'isLifeThreatening',
            'responsibleService',
            'extractedFacts',
            'missingDetails',
            'rationale',
            'recommendedNextSteps',
            'isDuplicateCandidate',
          ],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({
        ...parsed,
        aiModel: 'gemini-3.8-flash',
      });
    }

    throw new Error('Empty AI response');
  } catch (err: any) {
    console.error('Gemini triage error, using deterministic fallback:', err.message);
    const fallback = deterministicTriage(category, incidentText, location);
    return res.json({
      ...fallback,
      note: 'Rules-based deterministic fallback used due to AI service timeout/error.',
    });
  }
});

// Serve frontend
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SENTRIX server running on port ${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
