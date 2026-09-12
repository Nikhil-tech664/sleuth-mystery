// Pure Web Audio API Synthesizer & Music Station Engine for Sleuth Detective
// Zero external audio files needed; instant response, works 100% offline
// All compositions are 100% original, copyright-free / CC0, safe for streamers and YouTube

export type AtmosphereMode =
  | 'off'
  | 'montagem_hikari'
  | 'drift_phonk'
  | 'after_dark'
  | 'shinunoga'
  | 'jazz'
  | 'citypop'
  | 'anime'
  | 'akihabara'
  | 'english_pop'
  | 'synthwave'
  | 'lofi_beats'
  | 'rain'
  | 'clock'
  | 'radio'
  | 'custom';

export interface SongTrack {
  id: AtmosphereMode;
  title: string;
  subtitle?: string;
  artist: string;
  category: 'viral' | 'japanese' | 'english' | 'noir' | 'ambience';
  genre: string;
  copyrightNotice: string;
  bpm: number;
  key: string;
  flag: string;
}

export const TRACK_CATALOG: SongTrack[] = [
  // 🔥 Viral Edits & Phonk (Copyright-Free / Original Compositions)
  {
    id: 'montagem_hikari',
    title: 'Montagem - Hikari',
    subtitle: 'モンタージュ・ヒカリ (Brazilian Phonk)',
    artist: 'Favela Sound Collective (Royalty-Free)',
    category: 'viral',
    genre: 'Brazilian Phonk / Anime Edit Anthem',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 130,
    key: 'E Minor',
    flag: '🔥',
  },
  {
    id: 'drift_phonk',
    title: 'Metamorphosis Drift',
    subtitle: 'Sigma Cowbell Anthem',
    artist: 'Memphis Drift Syndicate (Royalty-Free)',
    category: 'viral',
    genre: 'Drift Phonk / Sigma Edit Anthem',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 138,
    key: 'F# Minor',
    flag: '🏎️',
  },
  {
    id: 'after_dark',
    title: 'After Dark Synthwave',
    subtitle: 'Slowed + Reverb Night Edit',
    artist: 'Neon Mirage (Royalty-Free)',
    category: 'viral',
    genre: 'Darkwave / Slowed Reverb Night Edit',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 90,
    key: 'A Minor',
    flag: '🌃',
  },
  {
    id: 'shinunoga',
    title: 'Shinunoga Viral Groove',
    subtitle: '死ぬのがいいわスタイル • Anime Edit',
    artist: 'Tokyo Vibe Lab (Royalty-Free)',
    category: 'viral',
    genre: 'Japanese Neo-Soul / Anime Edit Trap',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 84,
    key: 'Bb Minor',
    flag: '🌸',
  },

  // 🇯🇵 Japanese Songs (Copyright-Free / Original Compositions)
  {
    id: 'citypop',
    title: 'Midnight in Shibuya',
    subtitle: '渋谷ミッドナイト',
    artist: 'Tokyo Sound Syndicate (Royalty-Free)',
    category: 'japanese',
    genre: 'Japanese City Pop (Royal Road Groove)',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 112,
    key: 'F Major / D Minor',
    flag: '🇯🇵',
  },
  {
    id: 'anime',
    title: 'Sakura Neon Garden',
    subtitle: '桜ネオン・ガーデン',
    artist: 'Kyoto Lo-Fi Collective (Royalty-Free)',
    category: 'japanese',
    genre: 'Anime OST & Koto Chillhop',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 82,
    key: 'A Hirajōshi Pentatonic',
    flag: '🇯🇵',
  },
  {
    id: 'akihabara',
    title: 'Akihabara Night Rain',
    subtitle: '秋葉原レイン',
    artist: 'Electric Maiden (Royalty-Free)',
    category: 'japanese',
    genre: 'Modern Tokyo Cyber-Synth',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 124,
    key: 'E Major / C# Minor',
    flag: '🇯🇵',
  },

  // 🇬🇧 🇺🇸 Latest English Songs (Copyright-Free / Original Compositions)
  {
    id: 'english_pop',
    title: 'Velvet Midnight',
    subtitle: 'Late Night R&B',
    artist: 'The Midnight Bureau (Royalty-Free)',
    category: 'english',
    genre: 'Modern English Chill Pop / R&B',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 96,
    key: 'C Minor',
    flag: '🇬🇧',
  },
  {
    id: 'synthwave',
    title: 'Neon City Highway',
    subtitle: 'Outrun Highway',
    artist: 'Sunset Highway (Royalty-Free)',
    category: 'english',
    genre: 'Cyber-Noir Synthwave / Retropop',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 116,
    key: 'A Minor',
    flag: '🇺🇸',
  },
  {
    id: 'lofi_beats',
    title: 'London Rain & Coffee',
    subtitle: 'Baker Street Study',
    artist: 'Gumshoe Beats (Royalty-Free)',
    category: 'english',
    genre: 'Chillhop / Detective Lofi Beats',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 78,
    key: 'G Major',
    flag: '🇬🇧',
  },

  // 🎷 Classic Noir & Atmospheric Soundscapes
  {
    id: 'jazz',
    title: '1940s Noir Jazz Lounge',
    subtitle: 'Speakeasy Velvet',
    artist: 'The Blue Note Trio (Royalty-Free)',
    category: 'noir',
    genre: 'Vintage Detective Noir Jazz',
    copyrightNotice: '100% Royalty-Free • CC0 Safe for Streamers',
    bpm: 74,
    key: 'D Minor',
    flag: '🎷',
  },
  {
    id: 'rain',
    title: 'Rain & Thunder',
    subtitle: 'Cobblestone Downpour',
    artist: 'Natural Ambience',
    category: 'ambience',
    genre: 'Atmospheric Storm Soundscape',
    copyrightNotice: 'Public Domain • Natural Recording',
    bpm: 0,
    key: 'Storm',
    flag: '🌧️',
  },
  {
    id: 'clock',
    title: 'Clocktower Wind & Chimes',
    subtitle: 'Westminster Escapement',
    artist: 'Old London Bells',
    category: 'ambience',
    genre: 'Gothic Westminster Bells',
    copyrightNotice: 'Public Domain • Historic Bells',
    bpm: 60,
    key: 'E Major',
    flag: '🕰️',
  },
  {
    id: 'radio',
    title: 'Precinct Radio & Morse',
    subtitle: 'Shortwave Telegram',
    artist: 'Scotland Yard Telegraph',
    category: 'ambience',
    genre: '1940s Shortwave & Morse Code',
    copyrightNotice: 'Public Domain • Telecom Archive',
    bpm: 0,
    key: 'Morse',
    flag: '📻',
  },
];

export interface AudioSystemState {
  isMuted: boolean;
  atmosphere: AtmosphereMode;
  ambientVolume: number;
  currentTrack: SongTrack | null;
  customStreamUrl: string;
}

type AudioListener = (state: AudioSystemState) => void;

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAtmosphere: AtmosphereMode = 'off';
  private ambientVolume: number = 0.85;
  private ambientNodes: AudioNode[] = [];
  private ambientTimers: number[] = [];
  private customAudio: HTMLAudioElement | null = null;
  private customStreamUrl: string = '';
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('sleuth_audio_muted_v1');
        this.isMuted = savedMute === 'true';
      } catch {
        this.isMuted = false;
      }

      try {
        const savedVol = localStorage.getItem('sleuth_ambient_vol_v1');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.ambientVolume = parsed;
          }
        }
      } catch {
        this.ambientVolume = 0.85;
      }

      try {
        const savedUrl = localStorage.getItem('sleuth_custom_stream_url_v1');
        if (savedUrl) this.customStreamUrl = savedUrl;
      } catch {}

      // Automatically unlock and resume AudioContext on ANY user gesture
      const unlockListener = () => {
        this.unlock();
      };
      window.addEventListener('pointerdown', unlockListener, { passive: true });
      window.addEventListener('click', unlockListener, { passive: true });
      window.addEventListener('keydown', unlockListener, { passive: true });
      window.addEventListener('touchstart', unlockListener, { passive: true });
    }
  }

  // Subscribe to audio state changes
  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioSystemState {
    const track = TRACK_CATALOG.find((t) => t.id === this.currentAtmosphere) || null;
    return {
      isMuted: this.isMuted,
      atmosphere: this.currentAtmosphere,
      ambientVolume: this.ambientVolume,
      currentTrack: track,
      customStreamUrl: this.customStreamUrl,
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(st);
      } catch {}
    });
  }

  // Force unlock AudioContext on user gesture
  public unlock(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext unlock warning:', e);
      return null;
    }
  }

  private getMasterNode(ctx: AudioContext): GainNode {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  private runWithContext(callback: (ctx: AudioContext, out: GainNode) => void) {
    if (this.isMuted) return;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (!this.ctx) return;

      const out = this.getMasterNode(this.ctx);

      if (this.ctx.state === 'suspended') {
        this.ctx
          .resume()
          .then(() => {
            if (this.ctx && !this.isMuted) {
              callback(this.ctx, out);
            }
          })
          .catch(() => {});
      } else {
        callback(this.ctx, out);
      }
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('sleuth_audio_muted_v1', muted ? 'true' : 'false');
    } catch {}

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1.0, this.ctx.currentTime);
    }
    if (muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }

    if (this.customAudio) {
      this.customAudio.muted = muted;
    }

    this.notify();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setAmbientVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.ambientVolume = clamped;
    try {
      localStorage.setItem('sleuth_ambient_vol_v1', clamped.toString());
    } catch {}

    if (this.ambientGain && this.ctx && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = clamped;
    }
    this.notify();
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public getTracks(): SongTrack[] {
    return TRACK_CATALOG;
  }

  public getCurrentTrack(): SongTrack | null {
    return TRACK_CATALOG.find((t) => t.id === this.currentAtmosphere) || null;
  }

  // Playlist Navigation (Next / Previous track)
  public nextTrack(): SongTrack {
    const currentIndex = TRACK_CATALOG.findIndex((t) => t.id === this.currentAtmosphere);
    const nextIndex = (currentIndex + 1) % TRACK_CATALOG.length;
    const next = TRACK_CATALOG[nextIndex];
    this.setAtmosphere(next.id);
    return next;
  }

  public prevTrack(): SongTrack {
    const currentIndex = TRACK_CATALOG.findIndex((t) => t.id === this.currentAtmosphere);
    const prevIndex = currentIndex <= 0 ? TRACK_CATALOG.length - 1 : currentIndex - 1;
    const prev = TRACK_CATALOG[prevIndex];
    this.setAtmosphere(prev.id);
    return prev;
  }

  // Fully tear down all ambient loops, custom streams, and timers
  public stopAtmosphere() {
    this.currentAtmosphere = 'off';

    // Clear interval timers
    this.ambientTimers.forEach((timer) => window.clearInterval(timer));
    this.ambientTimers = [];

    // Stop custom HTML audio
    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.src = '';
      } catch {}
      this.customAudio = null;
    }

    // Stop and disconnect all audio nodes
    const nodes = [...this.ambientNodes];
    this.ambientNodes = [];
    nodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {}
    });

    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {}
      this.ambientGain = null;
    }

    this.notify();
  }

  // Switch atmosphere / song track
  public setAtmosphere(mode: AtmosphereMode): AtmosphereMode {
    if (mode === 'off') {
      this.stopAtmosphere();
      return 'off';
    }

    // Auto un-mute if user starts playing music
    if (this.isMuted) {
      this.setMuted(false);
    }

    this.stopAtmosphere();
    this.currentAtmosphere = mode;
    this.notify();

    if (mode === 'custom') {
      this.startCustomStream();
      return mode;
    }

    this.runWithContext((ctx, out) => {
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, ctx.currentTime);
      this.ambientGain.connect(out);

      // Route to chosen song/soundscape generator
      switch (mode) {
        case 'montagem_hikari':
          this.startMontagemHikariTrack(ctx, this.ambientGain);
          break;
        case 'drift_phonk':
          this.startDriftPhonkTrack(ctx, this.ambientGain);
          break;
        case 'after_dark':
          this.startAfterDarkTrack(ctx, this.ambientGain);
          break;
        case 'shinunoga':
          this.startShinunogaTrack(ctx, this.ambientGain);
          break;
        case 'citypop':
          this.startCityPopTrack(ctx, this.ambientGain);
          break;
        case 'anime':
          this.startAnimeKotoTrack(ctx, this.ambientGain);
          break;
        case 'akihabara':
          this.startAkihabaraSynthTrack(ctx, this.ambientGain);
          break;
        case 'english_pop':
          this.startEnglishPopTrack(ctx, this.ambientGain);
          break;
        case 'synthwave':
          this.startSynthwaveTrack(ctx, this.ambientGain);
          break;
        case 'lofi_beats':
          this.startLofiBeatsTrack(ctx, this.ambientGain);
          break;
        case 'jazz':
          this.startNoirJazzAtmosphere(ctx, this.ambientGain);
          break;
        case 'rain':
          this.startRainAtmosphere(ctx, this.ambientGain);
          break;
        case 'clock':
          this.startClocktowerAtmosphere(ctx, this.ambientGain);
          break;
        case 'radio':
          this.startRadioAtmosphere(ctx, this.ambientGain);
          break;
      }
    });

    return mode;
  }

  public setCustomStreamUrl(url: string) {
    this.customStreamUrl = url;
    try {
      localStorage.setItem('sleuth_custom_stream_url_v1', url);
    } catch {}
    if (this.currentAtmosphere === 'custom') {
      this.setAtmosphere('custom');
    }
  }

  public getCustomStreamUrl(): string {
    return this.customStreamUrl;
  }

  private startCustomStream() {
    if (!this.customStreamUrl) return;
    try {
      this.customAudio = new Audio(this.customStreamUrl);
      this.customAudio.volume = this.ambientVolume;
      this.customAudio.muted = this.isMuted;
      this.customAudio.play().catch((err) => {
        console.warn('Custom stream autoplay error:', err);
      });
    } catch (e) {
      console.warn('Custom audio initialization error:', e);
    }
  }

  // =========================================================================
  // 1. 🇯🇵 JAPANESE SONG: "Midnight in Shibuya" (渋谷ミッドナイト)
  // Royal Road Chord Progression (Ōdō Shinkō) + Funky Slap Bass + DX7 Electric Piano + Disco Drums
  // =========================================================================
  private startCityPopTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 112; // 112 BPM City Pop groove
    const beatSec = 60 / tempo; // ~0.5357s per beat
    let step = 0;

    // Drum loop (4-on-the-floor disco funk)
    const playDiscoBeat = () => {
      if (this.currentAtmosphere !== 'citypop') return;
      const t = ctx.currentTime;
      const currentBeat = (step % 4) + 1;
      step++;

      // 1. Kick on every downbeat (four-on-the-floor)
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(125, t);
      kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      kickGain.gain.setValueAtTime(0.0001, t);
      kickGain.gain.linearRampToValueAtTime(0.7, t + 0.01);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      kickOsc.connect(kickGain);
      kickGain.connect(masterGain);
      kickOsc.start(t);
      kickOsc.stop(t + 0.16);

      // 2. Snare + Clap on beats 2 & 4
      if (currentBeat === 2 || currentBeat === 4) {
        const snareOsc = ctx.createOscillator();
        const snareGain = ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, t);
        snareGain.gain.setValueAtTime(0.55, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        snareOsc.connect(snareGain);
        snareGain.connect(masterGain);
        snareOsc.start(t);
        snareOsc.stop(t + 0.15);

        // Crisp white noise burst
        const bLen = Math.floor(ctx.sampleRate * 0.14);
        const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const bData = bBuf.getChannelData(0);
        for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
        const noise = ctx.createBufferSource();
        noise.buffer = bBuf;
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'highpass';
        nFilter.frequency.value = 1800;
        const nGain = ctx.createGain();
        nGain.gain.value = 0.4;
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(masterGain);
        noise.start(t);
      }

      // 3. Open Hi-Hat on upbeat
      const playHat = (schedTime: number, isOpen: boolean) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(6500, schedTime);
        filter.type = 'highpass';
        filter.frequency.value = 7500;
        gain.gain.setValueAtTime(0.0001, schedTime);
        gain.gain.linearRampToValueAtTime(isOpen ? 0.28 : 0.14, schedTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, schedTime + (isOpen ? 0.22 : 0.04));
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(schedTime);
        osc.stop(schedTime + (isOpen ? 0.24 : 0.05));
      };

      playHat(t, false);
      playHat(t + beatSec * 0.5, true); // Sizzling open upbeat hat
    };

    // Slap / Funk Bassline
    const bassRiff = [
      87.31, 87.31, 98.0, 98.0, 82.41, 82.41, 110.0, 130.81, // F2, F2, G2, G2, E2, E2, A2, C3
    ];
    let bIdx = 0;
    const playFunkyBass = () => {
      if (this.currentAtmosphere !== 'citypop') return;
      const t = ctx.currentTime;
      const f = bassRiff[bIdx % bassRiff.length];
      bIdx++;

      const osc = ctx.createOscillator();
      const slapHarm = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      slapHarm.type = 'square';
      slapHarm.frequency.setValueAtTime(f * 2, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.frequency.exponentialRampToValueAtTime(350, t + 0.18);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.65, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + beatSec * 0.75);

      osc.connect(filter);
      slapHarm.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      slapHarm.start(t);
      osc.stop(t + beatSec * 0.8);
      slapHarm.stop(t + beatSec * 0.8);
    };

    // Japanese Royal Road Progression (Fmaj7 -> G7 -> Em7 -> Am7)
    const royalRoadChords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [196.0, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
      [164.81, 196.0, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
      [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
    ];
    let chordIdx = 0;
    const playDX7Keys = () => {
      if (this.currentAtmosphere !== 'citypop') return;
      const t = ctx.currentTime;
      const chord = royalRoadChords[chordIdx % royalRoadChords.length];
      chordIdx++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const detuneOsc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.01);
        detuneOsc.type = 'triangle';
        detuneOsc.frequency.setValueAtTime(freq * 1.002, t + idx * 0.01);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, t);

        gain.gain.setValueAtTime(0.0001, t + idx * 0.01);
        gain.gain.linearRampToValueAtTime(0.35, t + idx * 0.01 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 1.8);

        osc.connect(filter);
        detuneOsc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t + idx * 0.01);
        detuneOsc.start(t + idx * 0.01);
        osc.stop(t + beatSec * 2.0);
        detuneOsc.stop(t + beatSec * 2.0);
      });
    };

    // Catchy Japanese City Pop Brass Hook
    const brassHooks = [
      [{ f: 440.0, d: 0.3 }, { f: 523.25, d: 0.3 }, { f: 587.33, d: 0.4 }, { f: 659.25, d: 0.8 }],
      [{ f: 587.33, d: 0.3 }, { f: 523.25, d: 0.3 }, { f: 440.0, d: 0.4 }, { f: 392.0, d: 0.9 }],
    ];
    let hookIdx = 0;
    const playBrassLead = () => {
      if (this.currentAtmosphere !== 'citypop') return;
      const t = ctx.currentTime;
      const phrase = brassHooks[hookIdx % brassHooks.length];
      hookIdx++;
      let offset = 0;

      phrase.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + offset);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, t + offset);

        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.36, t + offset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t + offset);
        osc.stop(t + offset + d + 0.02);
        offset += d + 0.06;
      });
    };

    playDiscoBeat();
    playFunkyBass();
    playDX7Keys();
    playBrassLead();

    const dTimer = window.setInterval(playDiscoBeat, beatSec * 1000);
    const bTimer = window.setInterval(playFunkyBass, beatSec * 1000);
    const cTimer = window.setInterval(playDX7Keys, beatSec * 2000);
    const hTimer = window.setInterval(playBrassLead, beatSec * 4000);
    this.ambientTimers.push(dTimer, bTimer, cTimer, hTimer);
  }

  // =========================================================================
  // 2. 🇯🇵 JAPANESE SONG: "Sakura Neon Garden" (桜ネオン)
  // Authentic Hirajōshi Scale Koto Plucks + Shakuhachi Flute + Lo-Fi Hip Hop
  // =========================================================================
  private startAnimeKotoTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 82; // 82 BPM Chillhop
    const beatSec = 60 / tempo; // ~0.7317s
    let beatStep = 0;

    // Hirajōshi Pentatonic Scale: A, B, C, E, F
    const kotoMelody = [
      440.0, 493.88, 523.25, 659.25, 698.46, 880.0, 698.46, 659.25,
      523.25, 493.88, 440.0, 392.0, 329.63, 440.0, 523.25, 440.0,
    ];
    let kotoIdx = 0;

    // Koto Pluck Synthesis (Sharp wooden attack + microtonal bend)
    const playKotoPluck = () => {
      if (this.currentAtmosphere !== 'anime') return;
      const t = ctx.currentTime;
      const freq = kotoMelody[kotoIdx % kotoMelody.length];
      kotoIdx++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      // Traditional Japanese string bend
      osc.frequency.linearRampToValueAtTime(freq * 1.015, t + 0.12);
      osc.frequency.linearRampToValueAtTime(freq, t + 0.35);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.55, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 1.4);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + beatSec * 1.5);
    };

    // Dusty Lo-Fi Boom-Bap Drums
    const playLofiDrum = () => {
      if (this.currentAtmosphere !== 'anime') return;
      const t = ctx.currentTime;
      const beat = (beatStep % 4) + 1;
      beatStep++;

      // Deep soft kick
      if (beat === 1 || beat === 3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.65, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.22);
      }

      // Rimshot snare on 2 & 4
      if (beat === 2 || beat === 4) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
        gain.gain.setValueAtTime(0.48, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.11);
      }
    };

    // Shakuhachi Flute Melody
    const flutePhrases = [
      [{ f: 659.25, d: 1.2 }, { f: 698.46, d: 0.9 }, { f: 880.0, d: 1.6 }],
      [{ f: 698.46, d: 0.8 }, { f: 659.25, d: 0.9 }, { f: 523.25, d: 2.0 }],
    ];
    let fIdx = 0;
    const playFlute = () => {
      if (this.currentAtmosphere !== 'anime') return;
      const t = ctx.currentTime;
      const phrase = flutePhrases[fIdx % flutePhrases.length];
      fIdx++;
      let offset = 0;

      phrase.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + offset);
        // Breath vibrato
        osc.frequency.linearRampToValueAtTime(f + 3.5, t + offset + d * 0.5);
        osc.frequency.linearRampToValueAtTime(f - 3.0, t + offset + d * 0.8);

        filter.type = 'lowpass';
        filter.frequency.value = 1800;

        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.35, t + offset + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t + offset);
        osc.stop(t + offset + d + 0.05);
        offset += d + 0.15;
      });
    };

    playKotoPluck();
    playLofiDrum();
    playFlute();

    const kTimer = window.setInterval(playKotoPluck, beatSec * 500); // 8th note koto
    const dTimer = window.setInterval(playLofiDrum, beatSec * 1000);
    const fTimer = window.setInterval(playFlute, beatSec * 4000);
    this.ambientTimers.push(kTimer, dTimer, fTimer);
  }

  // =========================================================================
  // 3. 🇯🇵 JAPANESE SONG: "Akihabara Night Rain" (秋葉原レイン)
  // Modern Tokyo Cyber-Synth Pop + Arpeggios + Driving Sidechain
  // =========================================================================
  private startAkihabaraSynthTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 124;
    const beatSec = 60 / tempo;
    let step = 0;

    const arpNotes = [329.63, 392.0, 493.88, 587.33, 659.25, 493.88, 392.0, 440.0];
    let aIdx = 0;

    const playArpStep = () => {
      if (this.currentAtmosphere !== 'akihabara') return;
      const t = ctx.currentTime;
      const f = arpNotes[aIdx % arpNotes.length];
      aIdx++;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + beatSec * 0.5);
    };

    const playElectroBeat = () => {
      if (this.currentAtmosphere !== 'akihabara') return;
      const t = ctx.currentTime;
      step++;

      // Punchy kick
      const kick = ctx.createOscillator();
      const kGain = ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(140, t);
      kick.frequency.exponentialRampToValueAtTime(50, t + 0.1);
      kGain.gain.setValueAtTime(0.65, t);
      kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      kick.connect(kGain);
      kGain.connect(masterGain);
      kick.start(t);
      kick.stop(t + 0.15);
    };

    playArpStep();
    playElectroBeat();

    const aTimer = window.setInterval(playArpStep, (beatSec * 1000) / 2); // 16th notes
    const bTimer = window.setInterval(playElectroBeat, beatSec * 1000);
    this.ambientTimers.push(aTimer, bTimer);
  }

  // =========================================================================
  // 4. 🇬🇧 ENGLISH SONG: "Velvet Midnight"
  // Modern Chart-Style Chill Pop / R&B + 808 Sub + Rhodes Keys + Melancholy Hook
  // =========================================================================
  private startEnglishPopTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 96; // 96 BPM Chill Pop
    const beatSec = 60 / tempo;
    let step = 0;

    // 808 Sub-Bass Drops
    const sub808Notes = [65.41, 51.91, 77.78, 58.27]; // C2, Ab1, Eb2, Bb1
    let subIdx = 0;

    const play808Sub = () => {
      if (this.currentAtmosphere !== 'english_pop') return;
      const t = ctx.currentTime;
      const f = sub808Notes[subIdx % sub808Notes.length];
      subIdx++;

      const sub = ctx.createOscillator();
      const harm = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      sub.type = 'sine';
      sub.frequency.setValueAtTime(f * 1.5, t);
      sub.frequency.exponentialRampToValueAtTime(f, t + 0.08);

      // Saturated harmonic for laptop speakers
      harm.type = 'sawtooth';
      harm.frequency.setValueAtTime(f, t);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.72, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + beatSec * 1.8);

      sub.connect(gain);
      harm.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      sub.start(t);
      harm.start(t);
      sub.stop(t + beatSec * 1.9);
      harm.stop(t + beatSec * 1.9);
    };

    // Trap / R&B Drums (Snappy rimshot + sliding hi-hats)
    const playPopDrums = () => {
      if (this.currentAtmosphere !== 'english_pop') return;
      const t = ctx.currentTime;
      const beat = (step % 4) + 1;
      step++;

      // Snappy rimshot on 2 & 4
      if (beat === 2 || beat === 4) {
        const rim = ctx.createOscillator();
        const rGain = ctx.createGain();
        rim.type = 'triangle';
        rim.frequency.setValueAtTime(780, t);
        rim.frequency.exponentialRampToValueAtTime(220, t + 0.05);
        rGain.gain.setValueAtTime(0.55, t);
        rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        rim.connect(rGain);
        rGain.connect(masterGain);
        rim.start(t);
        rim.stop(t + 0.07);
      }

      // Rolling Hi-Hat
      const hat = ctx.createOscillator();
      const hFilter = ctx.createBiquadFilter();
      const hGain = ctx.createGain();
      hat.type = 'square';
      hat.frequency.setValueAtTime(7000, t);
      hFilter.type = 'highpass';
      hFilter.frequency.value = 6000;
      hGain.gain.setValueAtTime(0.0001, t);
      hGain.gain.linearRampToValueAtTime(0.18, t + 0.004);
      hGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      hat.connect(hFilter);
      hFilter.connect(hGain);
      hGain.connect(masterGain);
      hat.start(t);
      hat.stop(t + 0.05);
    };

    // Modern Neo-Soul Rhodes Chords (Cm9 -> Abmaj7 -> Ebmaj9 -> Bb13)
    const popChords = [
      [130.81, 155.56, 196.0, 233.08, 293.66], // Cm9
      [103.83, 155.56, 196.0, 246.94],         // Abmaj7
      [155.56, 196.0, 233.08, 293.66],         // Ebmaj9
      [116.54, 174.61, 233.08, 293.66, 349.23],// Bb13
    ];
    let cIdx = 0;
    const playPopRhodes = () => {
      if (this.currentAtmosphere !== 'english_pop') return;
      const t = ctx.currentTime;
      const chord = popChords[cIdx % popChords.length];
      cIdx++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.015);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, t);

        gain.gain.setValueAtTime(0.0001, t + idx * 0.015);
        gain.gain.linearRampToValueAtTime(0.32, t + idx * 0.015 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 3.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t + idx * 0.015);
        osc.stop(t + beatSec * 3.8);
      });
    };

    // Melancholy Vocal-Synth Lead
    const vocalLead = [
      [{ f: 523.25, d: 1.1 }, { f: 466.16, d: 0.8 }, { f: 392.0, d: 1.6 }],
      [{ f: 349.23, d: 0.8 }, { f: 392.0, d: 0.9 }, { f: 523.25, d: 1.8 }],
    ];
    let vIdx = 0;
    const playVocalSynth = () => {
      if (this.currentAtmosphere !== 'english_pop') return;
      const t = ctx.currentTime;
      const phrase = vocalLead[vIdx % vocalLead.length];
      vIdx++;
      let offset = 0;

      phrase.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + offset);
        // Formant vocal vowel filter
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, t + offset);
        filter.Q.value = 2.4;

        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.42, t + offset + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t + offset);
        osc.stop(t + offset + d + 0.05);
        offset += d + 0.1;
      });
    };

    play808Sub();
    playPopDrums();
    playPopRhodes();
    playVocalSynth();

    const sTimer = window.setInterval(play808Sub, beatSec * 2000);
    const dTimer = window.setInterval(playPopDrums, beatSec * 1000);
    const cTimer = window.setInterval(playPopRhodes, beatSec * 4000);
    const vTimer = window.setInterval(playVocalSynth, beatSec * 8000);
    this.ambientTimers.push(sTimer, dTimer, cTimer, vTimer);
  }

  // =========================================================================
  // 5. 🇬🇧 ENGLISH SONG: "Neon City Highway"
  // Outrun Cyber-Synthwave + 16th Rolling Bass + Gated Reverb Drums + Brass Stabs
  // =========================================================================
  private startSynthwaveTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 116; // 116 BPM Synthwave
    const beatSec = 60 / tempo;
    let step = 0;

    // 16th-Note Rolling Synthwave Bassline
    const bassline = [110.0, 110.0, 110.0, 110.0, 87.31, 87.31, 98.0, 98.0]; // A2, A2, A2, A2, F2, F2, G2, G2
    let bIdx = 0;

    const playRollingBass = () => {
      if (this.currentAtmosphere !== 'synthwave') return;
      const t = ctx.currentTime;
      const f = bassline[bIdx % bassline.length];
      bIdx++;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(250, t + 0.12);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.65, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + beatSec * 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + beatSec * 0.48);
    };

    // Gated-Reverb Snare & Punchy Kick
    const play80sDrums = () => {
      if (this.currentAtmosphere !== 'synthwave') return;
      const t = ctx.currentTime;
      const beat = (step % 4) + 1;
      step++;

      // Heavy 80s kick on 1 & 3
      if (beat === 1 || beat === 3) {
        const kick = ctx.createOscillator();
        const kGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(135, t);
        kick.frequency.exponentialRampToValueAtTime(45, t + 0.14);
        kGain.gain.setValueAtTime(0.75, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        kick.connect(kGain);
        kGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.2);
      }

      // Gated Snare on 2 & 4
      if (beat === 2 || beat === 4) {
        const snare = ctx.createOscillator();
        const sGain = ctx.createGain();
        snare.type = 'triangle';
        snare.frequency.setValueAtTime(240, t);
        sGain.gain.setValueAtTime(0.65, t);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        snare.connect(sGain);
        sGain.connect(masterGain);
        snare.start(t);
        snare.stop(t + 0.2);
      }
    };

    // Polyphonic Brass Stabs (Am -> F -> C -> G)
    const brassStabs = [
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [130.81, 164.81, 196.0], // C
      [196.0, 246.94, 293.66], // G
    ];
    let bStabIdx = 0;
    const playAnalogStab = () => {
      if (this.currentAtmosphere !== 'synthwave') return;
      const t = ctx.currentTime;
      const chord = brassStabs[bStabIdx % brassStabs.length];
      bStabIdx++;

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 1.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + beatSec * 1.8);
      });
    };

    playRollingBass();
    play80sDrums();
    playAnalogStab();

    const bTimer = window.setInterval(playRollingBass, (beatSec * 1000) / 2); // 8th notes
    const dTimer = window.setInterval(play80sDrums, beatSec * 1000);
    const sTimer = window.setInterval(playAnalogStab, beatSec * 2000);
    this.ambientTimers.push(bTimer, dTimer, sTimer);
  }

  // =========================================================================
  // 6. 🇬🇧 ENGLISH SONG: "London Rain & Coffee" (Chillhop / Lo-Fi Beats)
  // =========================================================================
  private startLofiBeatsTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 78;
    const beatSec = 60 / tempo;
    let step = 0;

    const lofiChords = [
      [196.0, 246.94, 293.66, 370.0],  // Gmaj7
      [246.94, 293.66, 370.0, 440.0],  // Bm7
      [130.81, 164.81, 196.0, 246.94], // Cmaj7
      [146.83, 185.0, 220.0, 261.63],  // D7
    ];
    let cIdx = 0;

    const playLofiKeys = () => {
      if (this.currentAtmosphere !== 'lofi_beats') return;
      const t = ctx.currentTime;
      const chord = lofiChords[cIdx % lofiChords.length];
      cIdx++;

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.02);
        // Vinyl wow tape wobble
        osc.frequency.linearRampToValueAtTime(freq * 0.994, t + i * 0.02 + 0.4);
        osc.frequency.linearRampToValueAtTime(freq * 1.005, t + i * 0.02 + 0.8);

        gain.gain.setValueAtTime(0.0001, t + i * 0.02);
        gain.gain.linearRampToValueAtTime(0.32, t + i * 0.02 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 3.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t + i * 0.02);
        osc.stop(t + beatSec * 3.5);
      });
    };

    const playLofiDrums = () => {
      if (this.currentAtmosphere !== 'lofi_beats') return;
      const t = ctx.currentTime;
      const beat = (step % 4) + 1;
      step++;

      if (beat === 1 || beat === 3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
        gain.gain.setValueAtTime(0.65, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.2);
      }

      if (beat === 2 || beat === 4) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.13);
      }
    };

    playLofiKeys();
    playLofiDrums();

    const cTimer = window.setInterval(playLofiKeys, beatSec * 4000);
    const dTimer = window.setInterval(playLofiDrums, beatSec * 1000);
    this.ambientTimers.push(cTimer, dTimer);
  }

  // =========================================================================
  // 7. 🎷 1940s NOIR JAZZ LOUNGE: COMPLETE FULL JAZZ ARRANGEMENT
  // =========================================================================
  private startNoirJazzAtmosphere(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 74;
    const beatSec = 60 / tempo;
    const swingUpbeat = beatSec * 0.62;

    // 1. Vinyl surface crackle
    const crackleBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const crData = crackleBuffer.getChannelData(0);
    for (let i = 0; i < crData.length; i++) {
      crData[i] = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.35 : (Math.random() * 2 - 1) * 0.035;
    }
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.value = 1600;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.28;

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(masterGain);
    crackleSource.start(0);
    this.ambientNodes.push(crackleSource, crackleFilter, crackleGain);

    // 2. Jazz Drum Kit: Brushes & Ride
    let beatStep = 0;
    const playDrumBeat = () => {
      if (this.currentAtmosphere !== 'jazz') return;
      const t = ctx.currentTime;
      const currentBeat = (beatStep % 4) + 1;
      beatStep++;

      // Snare Brush Swish on 2 & 4
      const bLen = Math.floor(ctx.sampleRate * 0.18);
      const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const bData = bBuf.getChannelData(0);
      for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
      const brushBurst = ctx.createBufferSource();
      brushBurst.buffer = bBuf;

      const brushFilter = ctx.createBiquadFilter();
      brushFilter.type = 'bandpass';
      brushFilter.frequency.setValueAtTime(currentBeat === 2 || currentBeat === 4 ? 2600 : 3800, t);
      brushFilter.Q.value = 1.8;

      const brushGain = ctx.createGain();
      const bAmp = currentBeat === 2 || currentBeat === 4 ? 0.48 : 0.22;
      brushGain.gain.setValueAtTime(0.0001, t);
      brushGain.gain.linearRampToValueAtTime(bAmp, t + 0.02);
      brushGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);

      brushBurst.connect(brushFilter);
      brushFilter.connect(brushGain);
      brushGain.connect(masterGain);
      brushBurst.start(t);

      // Ride Cymbal Ping
      const playRideCymbal = (schedTime: number, vol: number) => {
        const cymOsc = ctx.createOscillator();
        const cymFilter = ctx.createBiquadFilter();
        const cymGain = ctx.createGain();
        cymOsc.type = 'triangle';
        cymOsc.frequency.setValueAtTime(5820, schedTime);
        cymFilter.type = 'highpass';
        cymFilter.frequency.setValueAtTime(4000, schedTime);
        cymGain.gain.setValueAtTime(0.0001, schedTime);
        cymGain.gain.linearRampToValueAtTime(vol, schedTime + 0.006);
        cymGain.gain.exponentialRampToValueAtTime(0.0001, schedTime + 0.28);
        cymOsc.connect(cymFilter);
        cymFilter.connect(cymGain);
        cymGain.connect(masterGain);
        cymOsc.start(schedTime);
        cymOsc.stop(schedTime + 0.3);
      };

      playRideCymbal(t, 0.22);
      if (currentBeat === 2 || currentBeat === 4) {
        playRideCymbal(t + swingUpbeat, 0.16);
      }
    };

    // 3. Walking Upright Double Bass
    const bassProgression = [73.42, 87.31, 98.0, 103.83, 110.0, 130.81, 146.83, 130.81, 98.0, 116.54, 130.81, 138.59, 146.83, 110.0, 87.31, 82.41];
    let bassIndex = 0;
    const playWalkingBass = () => {
      if (this.currentAtmosphere !== 'jazz') return;
      const t = ctx.currentTime;
      const f = bassProgression[bassIndex % bassProgression.length];
      bassIndex++;

      const subOsc = ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(f, t);

      const harmOsc = ctx.createOscillator();
      harmOsc.type = 'sawtooth';
      harmOsc.frequency.setValueAtTime(f, t);
      const harmFilter = ctx.createBiquadFilter();
      harmFilter.type = 'lowpass';
      harmFilter.frequency.setValueAtTime(650, t);

      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.0001, t);
      bassGain.gain.linearRampToValueAtTime(0.68, t + 0.025);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + beatSec * 0.88);

      subOsc.connect(bassGain);
      harmOsc.connect(harmFilter);
      harmFilter.connect(bassGain);
      bassGain.connect(masterGain);

      subOsc.start(t);
      harmOsc.start(t);
      subOsc.stop(t + beatSec * 0.9);
      harmOsc.stop(t + beatSec * 0.9);
    };

    // 4. Smoky Rhodes Chords
    const jazzChords = [
      [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
      [98.0, 174.61, 246.94, 329.63, 440.0],   // G13
      [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9
      [110.0, 196.0, 277.18, 349.23, 523.25],  // A7#9
    ];
    let chordIndex = 0;
    const playRhodesChords = () => {
      if (this.currentAtmosphere !== 'jazz') return;
      const t = ctx.currentTime;
      const chord = jazzChords[chordIndex % jazzChords.length];
      chordIndex++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.025);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, t);

        noteGain.gain.setValueAtTime(0.0001, t + idx * 0.025);
        noteGain.gain.linearRampToValueAtTime(0.32, t + idx * 0.025 + 0.06);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 3.6);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(t + idx * 0.025);
        osc.stop(t + beatSec * 3.8);
      });
    };

    // 5. Muted Saxophone Lead
    const melodyPhrases = [
      [{ f: 440.0, d: 1.1 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 0.7 }, { f: 440.0, d: 1.4 }],
      [{ f: 392.0, d: 0.7 }, { f: 415.3, d: 0.65 }, { f: 440.0, d: 0.9 }, { f: 523.25, d: 1.6 }],
    ];
    let mIdx = 0;
    const playMelodySolo = () => {
      if (this.currentAtmosphere !== 'jazz') return;
      const t = ctx.currentTime;
      const phrase = melodyPhrases[mIdx % melodyPhrases.length];
      mIdx++;
      let offset = 0;

      phrase.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const muteFilter = ctx.createBiquadFilter();
        const saxGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + offset);
        muteFilter.type = 'bandpass';
        muteFilter.frequency.setValueAtTime(1350, t + offset);
        muteFilter.Q.value = 1.9;

        saxGain.gain.setValueAtTime(0.0001, t + offset);
        saxGain.gain.linearRampToValueAtTime(0.38, t + offset + 0.12);
        saxGain.gain.exponentialRampToValueAtTime(0.0001, t + offset + d);

        osc.connect(muteFilter);
        muteFilter.connect(saxGain);
        saxGain.connect(masterGain);

        osc.start(t + offset);
        osc.stop(t + offset + d + 0.05);
        offset += d + 0.12;
      });
    };

    playDrumBeat();
    playWalkingBass();
    playRhodesChords();
    playMelodySolo();

    const dTimer = window.setInterval(playDrumBeat, beatSec * 1000);
    const bTimer = window.setInterval(playWalkingBass, beatSec * 1000);
    const cTimer = window.setInterval(playRhodesChords, beatSec * 4000);
    const mTimer = window.setInterval(playMelodySolo, beatSec * 8000);
    this.ambientTimers.push(dTimer, bTimer, cTimer, mTimer);
  }

  // =========================================================================
  // 8. RAIN & THUNDER
  // =========================================================================
  private startRainAtmosphere(ctx: AudioContext, masterGain: GainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.45;

    const highRain = ctx.createBufferSource();
    highRain.buffer = buffer;
    highRain.loop = true;
    const highFilter = ctx.createBiquadFilter();
    highFilter.type = 'bandpass';
    highFilter.frequency.value = 3400;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.55;
    highRain.connect(highFilter);
    highFilter.connect(highGain);
    highGain.connect(masterGain);
    highRain.start(0);

    const lowRain = ctx.createBufferSource();
    lowRain.buffer = buffer;
    lowRain.loop = true;
    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.value = 1200;
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.65;
    lowRain.connect(lowFilter);
    lowFilter.connect(lowGain);
    lowGain.connect(masterGain);
    lowRain.start(0);

    this.ambientNodes.push(highRain, highFilter, highGain, lowRain, lowFilter, lowGain);

    const triggerThunder = () => {
      if (this.currentAtmosphere !== 'rain') return;
      const t = ctx.currentTime;
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(120, t);
      subOsc.frequency.exponentialRampToValueAtTime(38, t + 2.6);
      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.85, t + 0.35);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(t);
      subOsc.stop(t + 2.9);
    };

    triggerThunder();
    const thunderTimer = window.setInterval(triggerThunder, 7500);
    this.ambientTimers.push(thunderTimer);
  }

  // =========================================================================
  // 9. CLOCKTOWER WIND & CHIMES
  // =========================================================================
  private startClocktowerAtmosphere(ctx: AudioContext, masterGain: GainNode) {
    const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const wData = windBuffer.getChannelData(0);
    for (let i = 0; i < wData.length; i++) wData[i] = (Math.random() * 2 - 1) * 0.45;
    const wind = ctx.createBufferSource();
    wind.buffer = windBuffer;
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 520;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.65;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    wind.start(0);
    this.ambientNodes.push(wind, windFilter, windGain);

    const chimeNotes = [659.25, 523.25, 587.33, 392.0];
    const playChimes = () => {
      if (this.currentAtmosphere !== 'clock') return;
      const t = ctx.currentTime;
      chimeNotes.forEach((freq, idx) => {
        const offset = idx * 0.85;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + offset);
        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.7, t + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 2.8);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t + offset);
        osc.stop(t + offset + 2.9);
      });
    };

    playChimes();
    const cTimer = window.setInterval(playChimes, 11000);
    this.ambientTimers.push(cTimer);
  }

  // =========================================================================
  // 10. PRECINCT RADIO & MORSE
  // =========================================================================
  private startRadioAtmosphere(ctx: AudioContext, masterGain: GainNode) {
    const radioBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const rData = radioBuffer.getChannelData(0);
    for (let i = 0; i < rData.length; i++) rData[i] = (Math.random() * 2 - 1) * 0.3;
    const radio = ctx.createBufferSource();
    radio.buffer = radioBuffer;
    radio.loop = true;
    const radioFilter = ctx.createBiquadFilter();
    radioFilter.type = 'bandpass';
    radioFilter.frequency.value = 1750;
    const radioGain = ctx.createGain();
    radioGain.gain.value = 0.5;
    radio.connect(radioFilter);
    radioFilter.connect(radioGain);
    radioGain.connect(masterGain);
    radio.start(0);
    this.ambientNodes.push(radio, radioFilter, radioGain);

    const playMorse = () => {
      if (this.currentAtmosphere !== 'radio') return;
      const t = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(840, t + i * 0.2);
        gain.gain.setValueAtTime(0.0001, t + i * 0.2);
        gain.gain.linearRampToValueAtTime(0.65, t + i * 0.2 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.2 + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t + i * 0.2);
        osc.stop(t + i * 0.2 + 0.11);
      }
    };

    playMorse();
    const mTimer = window.setInterval(playMorse, 2600);
    this.ambientTimers.push(mTimer);
  }

  // =========================================================================
  // CORE SOUND EFFECTS
  // =========================================================================
  public playTestSound() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.01;
      const notes = [
        { freq: 523.25, offset: 0 },
        { freq: 659.25, offset: 0.11 },
        { freq: 783.99, offset: 0.22 },
        { freq: 1046.5, offset: 0.33 },
      ];
      notes.forEach(({ freq, offset }) => {
        const osc = ctx.createOscillator();
        const harm = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + offset);
        harm.type = 'sine';
        harm.frequency.setValueAtTime(freq * 2, t + offset);
        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.8, t + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.5);
        osc.connect(gain);
        harm.connect(gain);
        gain.connect(out);
        osc.start(t + offset);
        harm.start(t + offset);
        osc.stop(t + offset + 0.52);
        harm.stop(t + offset + 0.52);
      });
    });
  }

  // =========================================================================
  // 11. 🔥 VIRAL EDIT 1: "Montagem - Hikari" (モンタージュ・ヒカリ)
  // Brazilian Phonk / Baile Funk Anime Edit Anthem (130 BPM)
  // Syncopated Favela Funk Rhythm + 808 Phonk Cowbells + Sliding Sub + Anime Vocal Chants
  // =========================================================================
  private startMontagemHikariTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 130;
    const beatSec = 60 / tempo; // ~0.4615s
    const stepSec = beatSec / 4; // ~0.1154s (16th-note step)
    let step = 0;

    // Cowbell synthesizer: Dual detuned square oscillators at inharmonic ~1.481 ratio
    // with resonant bandpass filter (Q: 5.4) & aggressive phonk attack
    const playPhonkCowbell = (f: number, schedTime: number, vol: number = 0.52) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(f, schedTime);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(f * 1.481, schedTime);

      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(f * 1.25, schedTime);
      bp.Q.value = 5.4;

      gain.gain.setValueAtTime(0.0001, schedTime);
      gain.gain.linearRampToValueAtTime(vol, schedTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, schedTime + 0.17);

      osc1.connect(bp);
      osc2.connect(bp);
      bp.connect(gain);
      gain.connect(masterGain);

      osc1.start(schedTime);
      osc2.start(schedTime);
      osc1.stop(schedTime + 0.18);
      osc2.stop(schedTime + 0.18);
    };

    // Japanese "Hikari" (光) Anime Vocal Chants Formant Synthesizer
    const playVocalFormant = (f1Freq: number, f2Freq: number, schedTime: number, dur: number) => {
      const osc = ctx.createOscillator();
      const f1 = ctx.createBiquadFilter();
      const f2 = ctx.createBiquadFilter();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      const mix = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, schedTime); // A3 pitch

      f1.type = 'bandpass';
      f1.frequency.value = f1Freq;
      f1.Q.value = 5.5;

      f2.type = 'bandpass';
      f2.frequency.value = f2Freq;
      f2.Q.value = 6.5;

      g1.gain.value = 0.45;
      g2.gain.value = 0.35;

      mix.gain.setValueAtTime(0.0001, schedTime);
      mix.gain.linearRampToValueAtTime(0.4, schedTime + 0.02);
      mix.gain.exponentialRampToValueAtTime(0.001, schedTime + dur);

      osc.connect(f1);
      osc.connect(f2);
      f1.connect(g1);
      f2.connect(g2);
      g1.connect(mix);
      g2.connect(mix);
      mix.connect(masterGain);

      osc.start(schedTime);
      osc.stop(schedTime + dur + 0.02);
    };

    // 4-Bar Montagem Melody Pattern in E Minor (16 steps per bar = 64 total steps)
    const melodyPattern: { [key: number]: number } = {
      // Bar 1
      0: 659.25, // E5
      2: 659.25,
      4: 783.99, // G5
      6: 659.25,
      8: 587.33, // D5
      10: 493.88, // B4
      12: 587.33,
      14: 659.25,
      // Bar 2
      16: 659.25,
      18: 783.99,
      20: 880.0, // A5
      22: 987.77, // B5
      24: 880.0,
      26: 783.99,
      28: 659.25,
      30: 587.33,
      // Bar 3
      32: 659.25,
      34: 659.25,
      36: 783.99,
      38: 659.25,
      40: 587.33,
      42: 493.88,
      44: 587.33,
      46: 659.25,
      // Bar 4 (High climax run)
      48: 987.77, // B5
      50: 880.0, // A5
      52: 783.99, // G5
      54: 659.25, // E5
      56: 587.33, // D5
      58: 659.25, // E5
      60: 783.99, // G5
      62: 659.25, // E5
    };

    // Main 16th-note step engine for Montagem - Hikari
    const playMontagemStep = () => {
      if (this.currentAtmosphere !== 'montagem_hikari') return;
      const t = ctx.currentTime;
      const step64 = step % 64;
      const stepInMeasure = step % 16;
      step++;

      // 1. Phonk Cowbell Melody
      if (melodyPattern[step64] !== undefined) {
        playPhonkCowbell(melodyPattern[step64], t, 0.55);
      }

      // 2. Baile Funk Tamborzão Drum Pattern (130 BPM syncopation)
      // Kicks on steps 0, 6, 8, 14
      if (stepInMeasure === 0 || stepInMeasure === 6 || stepInMeasure === 8 || stepInMeasure === 14) {
        const kick = ctx.createOscillator();
        const kGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(160, t);
        kick.frequency.exponentialRampToValueAtTime(46, t + 0.11);
        const kVol = stepInMeasure === 0 ? 0.8 : 0.62;
        kGain.gain.setValueAtTime(kVol, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        kick.connect(kGain);
        kGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.16);
      }

      // Baile Funk Rimshot/Snare Chop on steps 3 & 11 (characteristic Brazilian favela funk rhythm!)
      if (stepInMeasure === 3 || stepInMeasure === 11) {
        // Wooden rim tone
        const rim = ctx.createOscillator();
        const rimGain = ctx.createGain();
        rim.type = 'triangle';
        rim.frequency.setValueAtTime(640, t);
        rim.frequency.exponentialRampToValueAtTime(240, t + 0.05);
        rimGain.gain.setValueAtTime(0.65, t);
        rimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        rim.connect(rimGain);
        rimGain.connect(masterGain);
        rim.start(t);
        rim.stop(t + 0.08);

        // Crisp snap burst
        const bLen = Math.floor(ctx.sampleRate * 0.07);
        const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const bData = bBuf.getChannelData(0);
        for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
        const noise = ctx.createBufferSource();
        noise.buffer = bBuf;
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'highpass';
        nFilter.frequency.value = 2200;
        const nGain = ctx.createGain();
        nGain.gain.value = 0.42;
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(masterGain);
        noise.start(t);
      }

      // Rolling 16th Hi-Hats
      const hatOsc = ctx.createOscillator();
      const hatFilter = ctx.createBiquadFilter();
      const hatGain = ctx.createGain();
      hatOsc.type = 'square';
      hatOsc.frequency.setValueAtTime(8500, t);
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 7500;
      const hatVol = stepInMeasure % 4 === 2 ? 0.16 : 0.08;
      hatGain.gain.setValueAtTime(0.0001, t);
      hatGain.gain.linearRampToValueAtTime(hatVol, t + 0.002);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
      hatOsc.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(masterGain);
      hatOsc.start(t);
      hatOsc.stop(t + 0.04);

      // 3. Sliding 808 Sub-Bass Drops (every bar)
      if (stepInMeasure === 0) {
        const bass = ctx.createOscillator();
        const bGain = ctx.createGain();
        bass.type = 'sine';

        // Root note: E1 (41.2 Hz) for bars 1 & 3, D1 (36.7 Hz) for bars 2 & 4
        const barIndex = Math.floor(step64 / 16);
        const rootFreq = barIndex % 2 === 0 ? 41.2 : 36.71;
        bass.frequency.setValueAtTime(rootFreq * 2.2, t);
        bass.frequency.exponentialRampToValueAtTime(rootFreq, t + 0.07);

        // Slide up slightly at end of bar
        bass.frequency.setValueAtTime(rootFreq, t + 0.08);
        bass.frequency.linearRampToValueAtTime(rootFreq * 1.33, t + stepSec * 14);

        bGain.gain.setValueAtTime(0.0001, t);
        bGain.gain.linearRampToValueAtTime(0.72, t + 0.02);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + stepSec * 15);

        bass.connect(bGain);
        bGain.connect(masterGain);
        bass.start(t);
        bass.stop(t + stepSec * 15.5);
      }

      // 4. Japanese "Hikari" (光) Anime Vocal Chant Drop on Bar 1 & Bar 3!
      if (step64 === 0 || step64 === 32) {
        // "Hi" -> "Ka" -> "Ri!"
        playVocalFormant(320, 2300, t, 0.14); // Hi
        playVocalFormant(820, 1300, t + 0.16, 0.14); // Ka
        playVocalFormant(320, 2300, t + 0.32, 0.26); // Ri!
      }
    };

    playMontagemStep();
    const mTimer = window.setInterval(playMontagemStep, stepSec * 1000);
    this.ambientTimers.push(mTimer);
  }

  // =========================================================================
  // 12. 🔥 VIRAL EDIT 2: "Metamorphosis Drift"
  // Sigma Drift Phonk Cowbell Anthem (138 BPM)
  // Fast 138 BPM + Rolling Trap Triplets + Memphis Distorted 808 Cowbell in F# Minor
  // =========================================================================
  private startDriftPhonkTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 138;
    const beatSec = 60 / tempo; // ~0.4348s
    const stepSec = beatSec / 4; // ~0.1087s
    let step = 0;

    // Memphis 808 Cowbell
    const playDriftCowbell = (f: number, schedTime: number, vol: number = 0.58) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(f, schedTime);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(f * 1.482, schedTime);

      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(f * 1.3, schedTime);
      bp.Q.value = 5.8;

      gain.gain.setValueAtTime(0.0001, schedTime);
      gain.gain.linearRampToValueAtTime(vol, schedTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, schedTime + 0.15);

      osc1.connect(bp);
      osc2.connect(bp);
      bp.connect(gain);
      gain.connect(masterGain);

      osc1.start(schedTime);
      osc2.start(schedTime);
      osc1.stop(schedTime + 0.16);
      osc2.stop(schedTime + 0.16);
    };

    // Iconic Drift Phonk Melody in F# Minor (32 steps loop = 2 bars)
    const driftNotes: { [key: number]: number } = {
      // Bar 1
      0: 739.99, // F#5
      2: 739.99,
      4: 880.0, // A5
      6: 830.61, // G#5
      8: 739.99,
      10: 659.25, // E5
      12: 554.37, // C#5
      14: 659.25,
      // Bar 2
      16: 739.99,
      18: 880.0,
      20: 987.77, // B5
      22: 1108.73, // C#6
      24: 987.77,
      26: 880.0,
      28: 830.61,
      30: 739.99,
    };

    const playDriftStep = () => {
      if (this.currentAtmosphere !== 'drift_phonk') return;
      const t = ctx.currentTime;
      const step32 = step % 32;
      const stepInMeasure = step % 16;
      step++;

      // 1. Phonk Cowbell Lead
      if (driftNotes[step32] !== undefined) {
        playDriftCowbell(driftNotes[step32], t);
      }

      // 2. Heavy Distorted 808 Kick
      if (stepInMeasure === 0 || stepInMeasure === 6 || stepInMeasure === 8 || stepInMeasure === 12) {
        const kick = ctx.createOscillator();
        const kGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(175, t);
        kick.frequency.exponentialRampToValueAtTime(42, t + 0.1);
        kGain.gain.setValueAtTime(0.85, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        kick.connect(kGain);
        kGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.17);
      }

      // 3. Memphis Stereo Clap / Snare on beats 2 & 4 (steps 4 and 12)
      if (stepInMeasure === 4 || stepInMeasure === 12) {
        const clapOsc = ctx.createOscillator();
        const clapGain = ctx.createGain();
        clapOsc.type = 'triangle';
        clapOsc.frequency.setValueAtTime(320, t);
        clapGain.gain.setValueAtTime(0.65, t);
        clapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        clapOsc.connect(clapGain);
        clapGain.connect(masterGain);
        clapOsc.start(t);
        clapOsc.stop(t + 0.11);

        const bLen = Math.floor(ctx.sampleRate * 0.11);
        const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const bData = bBuf.getChannelData(0);
        for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
        const noise = ctx.createBufferSource();
        noise.buffer = bBuf;
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'highpass';
        nFilter.frequency.value = 1600;
        const nGain = ctx.createGain();
        nGain.gain.value = 0.45;
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(masterGain);
        noise.start(t);
      }

      // 4. Trap Rolling Hi-Hats (32nd rolls on step 14 & 15)
      const playHat = (sched: number, vol: number) => {
        const osc = ctx.createOscillator();
        const filt = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(9000, sched);
        filt.type = 'highpass';
        filt.frequency.value = 8000;
        g.gain.setValueAtTime(0.0001, sched);
        g.gain.linearRampToValueAtTime(vol, sched + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, sched + 0.035);
        osc.connect(filt);
        filt.connect(g);
        g.connect(masterGain);
        osc.start(sched);
        osc.stop(sched + 0.04);
      };

      playHat(t, 0.12);
      if (stepInMeasure === 14 || stepInMeasure === 15) {
        playHat(t + stepSec * 0.5, 0.1); // Triplet roll
      }

      // 5. 808 Sub-bass on F#1 (46.25 Hz)
      if (stepInMeasure === 0) {
        const sub = ctx.createOscillator();
        const sGain = ctx.createGain();
        sub.type = 'sine';
        const root = step32 < 16 ? 46.25 : 36.71; // F#1 then D1
        sub.frequency.setValueAtTime(root * 2, t);
        sub.frequency.exponentialRampToValueAtTime(root, t + 0.06);
        sGain.gain.setValueAtTime(0.0001, t);
        sGain.gain.linearRampToValueAtTime(0.75, t + 0.015);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + stepSec * 15);
        sub.connect(sGain);
        sGain.connect(masterGain);
        sub.start(t);
        sub.stop(t + stepSec * 15.5);
      }
    };

    playDriftStep();
    const dTimer = window.setInterval(playDriftStep, stepSec * 1000);
    this.ambientTimers.push(dTimer);
  }

  // =========================================================================
  // 13. 🔥 VIRAL EDIT 3: "After Dark Synthwave"
  // Slowed + Reverb Darkwave Night Edit (90 BPM)
  // Ethereal Slowed Pads + Pulsating 80s Darkwave Bass + Hypnotic Edit Melody + Gated Snare
  // =========================================================================
  private startAfterDarkTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 90;
    const beatSec = 60 / tempo; // ~0.6667s
    const step16 = beatSec / 4; // ~0.1667s
    let beat = 0;
    let step = 0;

    // Chords: Am -> F -> C -> G (Slowed & Reverb Warmth)
    const chordProgression = [
      [220.0, 261.63, 329.63], // Am: A3, C4, E4
      [174.61, 220.0, 261.63], // F: F3, A3, C4
      [130.81, 164.81, 196.0], // C: C3, E3, G3
      [196.0, 246.94, 293.66], // G: G3, B3, D4
    ];
    let chordIdx = 0;

    // 1. Slowed Warm Analog Pad Chords
    const playDarkPad = () => {
      if (this.currentAtmosphere !== 'after_dark') return;
      const t = ctx.currentTime;
      const notes = chordProgression[chordIdx % chordProgression.length];
      chordIdx++;

      notes.forEach((f) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(f, t);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(f * 1.004, t); // Gentle chorus detune

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, t);
        filter.frequency.linearRampToValueAtTime(1500, t + beatSec * 2);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.24, t + 0.28); // Slowed smooth attack
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 3.9);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + beatSec * 4);
        osc2.stop(t + beatSec * 4);
      });
    };

    // 2. Hypnotic Viral Melody (Slowed + Reverb delay simulation)
    const melodyNotes = [
      659.25, // E5
      587.33, // D5
      523.25, // C5
      493.88, // B4
      440.0, // A4
      523.25, // C5
      659.25, // E5
      587.33, // D5
    ];
    let melIdx = 0;

    const playLeadNote = () => {
      if (this.currentAtmosphere !== 'after_dark') return;
      const t = ctx.currentTime;
      const f = melodyNotes[melIdx % melodyNotes.length];
      melIdx++;

      const playEcho = (offset: number, vol: number) => {
        const osc = ctx.createOscillator();
        const filt = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + offset);
        filt.type = 'lowpass';
        filt.frequency.value = 1800;

        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(vol, t + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.55);

        osc.connect(filt);
        filt.connect(gain);
        gain.connect(masterGain);

        osc.start(t + offset);
        osc.stop(t + offset + 0.58);
      };

      playEcho(0, 0.38); // Dry note
      playEcho(beatSec * 0.5, 0.15); // Reverb repeat 1
      playEcho(beatSec * 1.0, 0.06); // Reverb repeat 2
    };

    // 3. Pulsating Darkwave Bassline (16th notes)
    const bassRoots = [55.0, 43.65, 32.7, 49.0]; // A1, F1, C1, G1
    const playDarkBass = () => {
      if (this.currentAtmosphere !== 'after_dark') return;
      const t = ctx.currentTime;
      const barIdx = Math.floor(step / 16) % 4;
      const root = bassRoots[barIdx];
      const isOctave = step % 4 === 2;
      step++;

      const osc = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isOctave ? root * 2 : root, t);

      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(650, t);
      filt.frequency.exponentialRampToValueAtTime(220, t + step16 * 0.9);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.42, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + step16 * 0.95);

      osc.connect(filt);
      filt.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + step16);
    };

    // 4. Gated Reverb Snare & 80s Drum Beat
    const playDarkBeat = () => {
      if (this.currentAtmosphere !== 'after_dark') return;
      const t = ctx.currentTime;
      const b4 = (beat % 4) + 1;
      beat++;

      // Kick on 1 and 3
      if (b4 === 1 || b4 === 3) {
        const kick = ctx.createOscillator();
        const kGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(130, t);
        kick.frequency.exponentialRampToValueAtTime(45, t + 0.14);
        kGain.gain.setValueAtTime(0.7, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        kick.connect(kGain);
        kGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.19);
      }

      // Massive 80s Gated Snare on 2 and 4
      if (b4 === 2 || b4 === 4) {
        const bLen = Math.floor(ctx.sampleRate * 0.28);
        const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const bData = bBuf.getChannelData(0);
        for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
        const noise = ctx.createBufferSource();
        noise.buffer = bBuf;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3200;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start(t);
      }
    };

    playDarkPad();
    playLeadNote();
    playDarkBass();
    playDarkBeat();

    const pTimer = window.setInterval(playDarkPad, beatSec * 4000);
    const lTimer = window.setInterval(playLeadNote, beatSec * 2000);
    const bTimer = window.setInterval(playDarkBass, step16 * 1000);
    const dTimer = window.setInterval(playDarkBeat, beatSec * 1000);
    this.ambientTimers.push(pTimer, lTimer, bTimer, dTimer);
  }

  // =========================================================================
  // 14. 🔥 VIRAL EDIT 4: "Shinunoga Viral Groove"
  // Japanese Neo-Soul / Anime Edit Trap (84 BPM)
  // Jazzy Rhodes Electric Piano + Shakuhachi Anime Flute Lead + Swung 808 Trap Drums
  // =========================================================================
  private startShinunogaTrack(ctx: AudioContext, masterGain: GainNode) {
    const tempo = 84;
    const beatSec = 60 / tempo; // ~0.7143s
    let beat = 0;

    // Emotional Japanese Neo-Soul Chords (Bbm7 -> Ebm7 -> Ab7 -> Dbmaj7)
    const neoSoulChords = [
      [116.54, 138.59, 174.61, 207.65], // Bbm7
      [155.56, 185.0, 233.08, 277.18], // Ebm7
      [103.83, 130.81, 155.56, 185.0], // Ab7
      [138.59, 174.61, 207.65, 261.63], // Dbmaj7
    ];
    let chordIdx = 0;

    // 1. Neo-Soul Rhodes Keys
    const playRhodesChord = () => {
      if (this.currentAtmosphere !== 'shinunoga') return;
      const t = ctx.currentTime;
      const chord = neoSoulChords[chordIdx % neoSoulChords.length];
      chordIdx++;

      chord.forEach((f) => {
        const osc = ctx.createOscillator();
        const harm = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);

        harm.type = 'sine';
        harm.frequency.setValueAtTime(f * 2, t);

        filter.type = 'lowpass';
        filter.frequency.value = 1400;

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 3.8);

        osc.connect(filter);
        harm.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        harm.start(t);
        osc.stop(t + beatSec * 3.9);
        harm.stop(t + beatSec * 3.9);
      });
    };

    // 2. Wistful Anime Shakuhachi / Flute Lead Melody
    const fluteMelody = [
      466.16, // Bb4
      554.37, // Db5
      698.46, // F5
      622.25, // Eb5
      554.37, // Db5
      523.25, // C5
      466.16, // Bb4
      415.3, // Ab4
    ];
    let melIdx = 0;

    const playFluteLead = () => {
      if (this.currentAtmosphere !== 'shinunoga') return;
      const t = ctx.currentTime;
      const f = fluteMelody[melIdx % fluteMelody.length];
      melIdx++;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      // Expressive vibrato bend
      osc.frequency.linearRampToValueAtTime(f + 4.0, t + 0.4);
      osc.frequency.linearRampToValueAtTime(f - 3.0, t + 0.8);

      filter.type = 'lowpass';
      filter.frequency.value = 2400;

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.38, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + beatSec * 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + beatSec * 1.9);
    };

    // 3. Swung Trap 808 Drums
    const playTrapBeat = () => {
      if (this.currentAtmosphere !== 'shinunoga') return;
      const t = ctx.currentTime;
      const b4 = (beat % 4) + 1;
      beat++;

      // 808 Kick on 1 and 2.5
      if (b4 === 1 || b4 === 3) {
        const kick = ctx.createOscillator();
        const kGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(140, t);
        kick.frequency.exponentialRampToValueAtTime(40, t + 0.16);
        kGain.gain.setValueAtTime(0.75, t);
        kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        kick.connect(kGain);
        kGain.connect(masterGain);
        kick.start(t);
        kick.stop(t + 0.3);
      }

      // Snappy Rim/Snare on 3
      if (b4 === 2 || b4 === 4) {
        const rim = ctx.createOscillator();
        const rGain = ctx.createGain();
        rim.type = 'triangle';
        rim.frequency.setValueAtTime(540, t);
        rim.frequency.exponentialRampToValueAtTime(180, t + 0.06);
        rGain.gain.setValueAtTime(0.55, t);
        rGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        rim.connect(rGain);
        rGain.connect(masterGain);
        rim.start(t);
        rim.stop(t + 0.09);
      }

      // Swung Hi-Hat
      const playHat = (sched: number, vol: number) => {
        const osc = ctx.createOscillator();
        const filt = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(7500, sched);
        filt.type = 'highpass';
        filt.frequency.value = 6500;
        g.gain.setValueAtTime(0.0001, sched);
        g.gain.linearRampToValueAtTime(vol, sched + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, sched + 0.04);
        osc.connect(filt);
        filt.connect(g);
        g.connect(masterGain);
        osc.start(sched);
        osc.stop(sched + 0.045);
      };

      playHat(t, 0.14);
      playHat(t + beatSec * 0.58, 0.09); // Swung upbeat
    };

    playRhodesChord();
    playFluteLead();
    playTrapBeat();

    const cTimer = window.setInterval(playRhodesChord, beatSec * 4000);
    const fTimer = window.setInterval(playFluteLead, beatSec * 2000);
    const tTimer = window.setInterval(playTrapBeat, beatSec * 1000);
    this.ambientTimers.push(cTimer, fTimer, tTimer);
  }

  public playTypewriter() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.07);
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      gain.gain.setValueAtTime(0.85, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  public playPin() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);
      gain.gain.setValueAtTime(0.85, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  public playYarnTwang() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.18);
      gain.gain.setValueAtTime(0.75, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.21);
    });
  }

  public playLampClick() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1500, t);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.04);
      gain.gain.setValueAtTime(0.75, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  public playRotaryDial() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      for (let i = 0; i < 5; i++) {
        const delay = i * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(820 + i * 50, t + delay);
        gain.gain.setValueAtTime(0.0001, t + delay);
        gain.gain.linearRampToValueAtTime(0.45, t + delay + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.032);
        osc.connect(gain);
        gain.connect(out);
        osc.start(t + delay);
        osc.stop(t + delay + 0.035);
      }
    });
  }

  public playHeartbeat() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.15);
      gain.gain.setValueAtTime(0.95, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.17);
    });
  }

  public playDeskSlam() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(85, t + 0.25);
      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.27);
    });
  }

  public playCheckmark() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1300, t);
      osc.frequency.exponentialRampToValueAtTime(2600, t + 0.09);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.095);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  public playCross() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, t);
      osc.frequency.exponentialRampToValueAtTime(230, t + 0.08);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  public playCassetteClick() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(130, t + 0.07);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  public playVictory() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const chords = [
        { freq: 261.63, delay: 0 },
        { freq: 329.63, delay: 0.08 },
        { freq: 392.0, delay: 0.16 },
        { freq: 466.16, delay: 0.24 },
        { freq: 523.25, delay: 0.36 },
      ];
      chords.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + delay);
        gain.gain.setValueAtTime(0.0001, t + delay);
        gain.gain.linearRampToValueAtTime(0.65, t + delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.85);
        osc.connect(gain);
        gain.connect(out);
        osc.start(t + delay);
        osc.stop(t + delay + 0.9);
      });
    });
  }

  public playCipherTick() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.03);
      gain.gain.setValueAtTime(0.75, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.04);
    });
  }

  public playClueDiscovery() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        gain.gain.setValueAtTime(0.0001, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.6, t + idx * 0.06 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(out);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.42);
      });
    });
  }

  public playLevelUp() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const arpeggio = [440, 554.37, 659.25, 880];
      arpeggio.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.09);
        gain.gain.setValueAtTime(0.0001, t + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.65, t + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(out);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.48);
      });
    });
  }

  public playSprayer() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(3200, t);
      osc.frequency.exponentialRampToValueAtTime(1800, t + 0.35);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.36);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.37);
    });
  }

  public playDustBrush() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.14);
      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  public playMagnifier() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(1100, t + 0.14);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  public playGavel() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
      gain.gain.setValueAtTime(0.95, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.17);
    });
  }

  public playStamp() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.18);
      gain.gain.setValueAtTime(0.95, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  public playError() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(170, t);
      osc.frequency.setValueAtTime(135, t + 0.1);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playBubbling() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      for (let i = 0; i < 6; i++) {
        const delay = i * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + Math.random() * 800, t + delay);
        osc.frequency.exponentialRampToValueAtTime(1600 + Math.random() * 400, t + delay + 0.05);
        gain.gain.setValueAtTime(0.0001, t + delay);
        gain.gain.linearRampToValueAtTime(0.5, t + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.055);
        osc.connect(gain);
        gain.connect(out);
        osc.start(t + delay);
        osc.stop(t + delay + 0.06);
      }
    });
  }

  public playTapeWobble() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(420, t + 0.3);
      osc.frequency.linearRampToValueAtTime(450, t + 0.6);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  // Dramatic "OBJECTION! / BREAKTHROUGH" orchestral stinger when catching a suspect in a lie
  public playObjectionStinger() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      // Dissonant brass-hit chord: A3, Eb4, Gb4, C5 (Diminished shock blast)
      const chord = [220.0, 311.13, 369.99, 523.25, 622.25];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, t);
        filter.frequency.exponentialRampToValueAtTime(800, t + 0.45);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(out);

        osc.start(t);
        osc.stop(t + 0.6);
      });

      // Heavy cinematic impact sub-thud
      const sub = ctx.createOscillator();
      const sGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, t);
      sub.frequency.exponentialRampToValueAtTime(35, t + 0.28);
      sGain.gain.setValueAtTime(0.85, t);
      sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      sub.connect(sGain);
      sGain.connect(out);
      sub.start(t);
      sub.stop(t + 0.36);
    });
  }

  // Dopamine Streak / Combo Chime (Ascends in pitch with each consecutive correct deduction)
  public playComboChime(streak: number = 1) {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      const pitchMultiplier = 1 + Math.min(streak, 10) * 0.08;
      const baseFreq = 587.33 * pitchMultiplier; // Starts around D5 and climbs

      // 3-note ascending celestial harp arpeggio
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      notes.forEach((freq, idx) => {
        const offset = idx * 0.045;
        const osc = ctx.createOscillator();
        const harm = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + offset);
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, t + offset);

        gain.gain.setValueAtTime(0.0001, t + offset);
        gain.gain.linearRampToValueAtTime(0.45, t + offset + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.45);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(out);

        osc.start(t + offset);
        harm.start(t + offset);
        osc.stop(t + offset + 0.48);
        harm.stop(t + offset + 0.48);
      });
    });
  }

  // Physical wax seal crunch/break sound when opening sealed classified case files
  public playWaxSealBreak() {
    this.runWithContext((ctx, out) => {
      const t = ctx.currentTime + 0.005;
      // High-frequency wax snap
      const snap = ctx.createOscillator();
      const sGain = ctx.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(1400, t);
      snap.frequency.exponentialRampToValueAtTime(250, t + 0.06);
      sGain.gain.setValueAtTime(0.7, t);
      sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      snap.connect(sGain);
      sGain.connect(out);
      snap.start(t);
      snap.stop(t + 0.09);

      // Cracking parchment tear burst
      const bLen = Math.floor(ctx.sampleRate * 0.12);
      const bBuf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const bData = bBuf.getChannelData(0);
      for (let i = 0; i < bLen; i++) bData[i] = (Math.random() * 2 - 1) * (1 - i / bLen);
      const noise = ctx.createBufferSource();
      noise.buffer = bBuf;
      const nFilter = ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.value = 1900;
      nFilter.Q.value = 2.0;
      const nGain = ctx.createGain();
      nGain.gain.value = 0.55;
      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(out);
      noise.start(t);
    });
  }

  public getAtmosphere(): AtmosphereMode {
    return this.currentAtmosphere;
  }

  public getIsAmbientPlaying(): boolean {
    return this.currentAtmosphere !== 'off';
  }
}

export const sound = new SoundEffects();
