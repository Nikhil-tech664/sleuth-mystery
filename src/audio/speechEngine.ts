// Browser-native Web Speech API Engine for Sleuth Detective
// Provides character voice synthesis for suspect interrogations, Scotland Yard dispatch, and witness testimonies
// 100% offline, zero external API keys, zero network lag

export interface SpeechPersona {
  pitch: number;
  rate: number;
  volume: number;
  lang?: string;
  name?: string;
}

export type VoicePersonaType = 'dispatch' | 'nervous' | 'aristocrat' | 'gravelly' | 'witness' | 'villain';

class SpeechEngine {
  private isMuted: boolean = false;
  private isSpeakingNow: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sleuth_speech_muted_v1');
        this.isMuted = saved === 'true';
      } catch {
        this.isMuted = false;
      }

      if ('speechSynthesis' in window) {
        this.loadVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.voices = window.speechSynthesis.getVoices();
      } catch {}
    }
  }

  public subscribe(listener: (speaking: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingNow);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setSpeaking(speaking: boolean) {
    this.isSpeakingNow = speaking;
    this.listeners.forEach((fn) => {
      try {
        fn(speaking);
      } catch {}
    });
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('sleuth_speech_muted_v1', muted ? 'true' : 'false');
    } catch {}
    if (muted) {
      this.stop();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingNow;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.setSpeaking(false);
    }
  }

  public speak(
    text: string,
    personaType: VoicePersonaType = 'witness',
    onEndCallback?: () => void
  ) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;

      // Select English or British voice if available for Victorian/Noir aesthetic
      const englishVoices = this.voices.filter((v) => v.lang.startsWith('en'));
      const gbVoice = englishVoices.find((v) => v.lang.includes('GB') || v.lang.includes('UK'));

      if (gbVoice) {
        utterance.voice = gbVoice;
      } else if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }

      // Configure distinct voice personas
      switch (personaType) {
        case 'dispatch':
          // Low, commanding, authoritative Scotland Yard radio dispatcher
          utterance.pitch = 0.88;
          utterance.rate = 0.96;
          break;
        case 'nervous':
          // High-pitch, agitated, fast tempo
          utterance.pitch = 1.28;
          utterance.rate = 1.15;
          break;
        case 'aristocrat':
          // Polished, elevated, deliberate
          utterance.pitch = 1.05;
          utterance.rate = 0.92;
          break;
        case 'gravelly':
          // Deep, rough, criminal underworld
          utterance.pitch = 0.76;
          utterance.rate = 0.94;
          break;
        case 'villain':
          // Slow, chilling, calculated mastermind
          utterance.pitch = 0.72;
          utterance.rate = 0.85;
          break;
        case 'witness':
        default:
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
          break;
      }

      utterance.onstart = () => {
        this.setSpeaking(true);
      };

      utterance.onend = () => {
        this.setSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        this.setSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.setSpeaking(false);
      if (onEndCallback) onEndCallback();
    }
  }
}

export const speech = new SpeechEngine();
