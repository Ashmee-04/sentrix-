import { LocationCoordinates } from '../types';

// Real Geolocation with fallback to Bengaluru coordinates
export async function getCurrentBengaluruLocation(): Promise<LocationCoordinates> {
  const defaultBengaluru: LocationCoordinates = {
    latitude: 12.9716,
    longitude: 77.5946,
    accuracyMeters: 14,
    address: 'Indiranagar 100 Feet Road, Bengaluru',
    landmark: 'Near 12th Main Junction',
    ward: 'Indiranagar (Ward 112)',
  };

  if (!navigator.geolocation) {
    return defaultBengaluru;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Number(pos.coords.latitude.toFixed(5)),
          longitude: Number(pos.coords.longitude.toFixed(5)),
          accuracyMeters: Math.round(pos.coords.accuracy),
          address: 'Bengaluru Urban District (GPS Locked)',
          landmark: 'Live GPS Coordinates Acquired',
          ward: 'Bengaluru East',
        });
      },
      (err) => {
        console.warn('Geolocation unavailable or denied, using Bengaluru fallback:', err.message);
        resolve(defaultBengaluru);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 10000,
      }
    );
  });
}

// Web Speech API Voice Recognition with SpeechRecognition interface
export interface SpeechRecognitionHook {
  start: () => void;
  stop: () => void;
  isListening: boolean;
  transcript: string;
  error?: string;
}

export function createSpeechListener(
  onTranscript: (text: string) => void,
  onStateChange: (listening: boolean) => void,
  onError: (errMsg: string) => void,
  lang: string = 'en-IN'
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      isSupported: false,
      start: () => onError('Speech recognition is not supported in this browser. Please type details manually.'),
      stop: () => {},
    };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      onStateChange(true);
    };

    recognition.onresult = (event: any) => {
      let accumulated = '';
      for (let i = 0; i < event.results.length; i++) {
        accumulated += event.results[i][0].transcript;
      }
      onTranscript(accumulated);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      onStateChange(false);
      onError(`Speech recognition notice: ${event.error}. You can type manually.`);
    };

    recognition.onend = () => {
      onStateChange(false);
    };

    return {
      isSupported: true,
      start: () => {
        try {
          recognition.start();
        } catch {
          // already started
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch {}
      },
    };
  } catch (err: any) {
    return {
      isSupported: false,
      start: () => onError(err.message),
      stop: () => {},
    };
  }
}

// Emergency Sound Siren using Web Audio API (Synthesizer, no external files)
class SirenAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      this.osc = this.audioCtx.createOscillator();
      this.gain = this.audioCtx.createGain();

      this.osc.type = 'sawtooth';
      this.gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.osc.connect(this.gain);
      this.gain.connect(this.audioCtx.destination);
      this.osc.start();
      this.isPlaying = true;

      let high = false;
      this.intervalId = setInterval(() => {
        if (!this.osc || !this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        this.osc.frequency.setValueAtTime(high ? 960 : 640, now);
        high = !high;
      }, 350);
    } catch (e) {
      console.warn('AudioContext not allowed or failed:', e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.intervalId) clearInterval(this.intervalId);
    try {
      this.osc?.stop();
      this.osc?.disconnect();
      this.gain?.disconnect();
      this.audioCtx?.close();
    } catch {}
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  getStatus() {
    return this.isPlaying;
  }
}

export const sirenPlayer = new SirenAudioPlayer();
