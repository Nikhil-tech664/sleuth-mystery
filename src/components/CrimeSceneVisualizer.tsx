import React, { useState } from 'react';
import type { CrimeSceneHotspot, Suspect } from '../types/game';
import { Search, X, CheckCircle, Lightbulb, Zap, Fingerprint, Sparkles, KeyRound, RotateCw } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CrimeSceneVisualizerProps {
  hotspots?: CrimeSceneHotspot[];
  discoveredHotspots?: Record<string, boolean>;
  onDiscoverHotspot: (hotspotId: string, associatedClueId?: string) => void;
  xp?: number;
  suspects?: Suspect[];
  onLogNote?: (note: string) => void;
}

type ForensicTool = 'inspect' | 'uv' | 'duster' | 'luminol' | 'cipher';

export const CrimeSceneVisualizer: React.FC<CrimeSceneVisualizerProps> = ({
  hotspots = [],
  discoveredHotspots = {},
  onDiscoverHotspot,
  xp = 0,
  suspects = [],
  onLogNote,
}) => {
  const [activeTool, setActiveTool] = useState<ForensicTool>('inspect');
  const [activeHotspot, setActiveHotspot] = useState<CrimeSceneHotspot | null>(null);
  const [justEarnedXP, setJustEarnedXP] = useState<number | null>(null);

  // Tool Specific States
  const [dustingHotspot, setDustingHotspot] = useState<CrimeSceneHotspot | null>(null);
  const [luminolSplatter, setLuminolSplatter] = useState<{ x: number; y: number; text: string; color: string } | null>(null);
  const [isCipherModalOpen, setIsCipherModalOpen] = useState<boolean>(false);
  const [cipherShift, setCipherShift] = useState<number>(0);
  const [cipherSuccess, setCipherSuccess] = useState<boolean>(false);

  // Check if current case has any cipher hotspots
  const cipherHotspot = hotspots.find((h) => h.cipherSnippet);

  const handleHotspotClick = (h: CrimeSceneHotspot, e: React.MouseEvent) => {
    // 1. Tool: Chemical Luminol Spray
    if (activeTool === 'luminol') {
      sound.playSprayer();
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
      const x = parentRect ? rect.left - parentRect.left + rect.width / 2 : 50;
      const y = parentRect ? rect.top - parentRect.top + rect.height / 2 : 50;

      if (h.chemicalReaction) {
        setLuminolSplatter({
          x,
          y,
          text: `[REACTION POSITIVE: ${h.chemicalReaction.label}]`,
          color: h.chemicalReaction.luminescenceColor || '#38BDF8',
        });
        if (onLogNote) {
          onLogNote(`[Chemical Lab Sweep]: ${h.name} tested POSITIVE for ${h.chemicalReaction.label}!`);
        }
      } else {
        setLuminolSplatter({
          x,
          y,
          text: '[NO ORGANIC OR TOXIN TRACE DETECTED]',
          color: '#94A3B8',
        });
      }
      setTimeout(() => setLuminolSplatter(null), 3500);
      return;
    }

    // 2. Tool: Fingerprint Dusting Kit
    if (activeTool === 'duster') {
      sound.playDustBrush();
      setDustingHotspot(h);
      return;
    }

    // 3. Tool: Inspect Loupe (Default)
    sound.playMagnifier();
    if (!discoveredHotspots?.[h.id]) {
      sound.playClueDiscovery();
      onDiscoverHotspot(h.id, h.associatedClueId);
      setJustEarnedXP(50);
      setTimeout(() => setJustEarnedXP(null), 1800);
    }
    setActiveHotspot(h);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'luminol') {
      sound.playSprayer();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLuminolSplatter({
        x,
        y,
        text: '[INERT RESIDUE - NO FLUORESCENCE]',
        color: '#64748B',
      });
      setTimeout(() => setLuminolSplatter(null), 2500);
    }
  };

  // Decode Cipher letters with current shift
  const decodeText = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        if (char >= 'a' && char <= 'z') {
          return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const discoveredCount = hotspots.filter((h) => discoveredHotspots?.[h.id]).length;

  return (
    <div className="relative rounded-2xl border-2 border-[#38322B] bg-[#141210] p-4 md:p-6 shadow-2xl overflow-hidden">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2C2722] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h3 className="text-base md:text-lg font-bold font-serif text-[#FAF6F0] tracking-wide flex items-center gap-2">
              <span>Crime Scene Forensics Lab</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2B2418] text-[#C69214] font-mono border border-[#C69214]/30 uppercase font-bold">
                Interactive Palette
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#8C8478] font-sans mt-0.5">
            Select forensic gadgets below to inspect evidence markers, dust latent fingerprints, or spray luminol.
          </p>
        </div>

        {/* Forensic Gadget Palette Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1B1916] p-1.5 rounded-xl border border-[#332E28] shadow-inner">
          {/* XP Gauge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241E15] border border-[#C69214]/40 text-[#E5B54F] font-mono text-xs font-bold mr-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{xp} XP</span>
            {justEarnedXP && (
              <span className="text-emerald-400 text-[10px] animate-bounce font-black ml-1">
                +{justEarnedXP}
              </span>
            )}
          </div>

          {/* 1. Inspect Loupe */}
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveTool('inspect');
            }}
            title="Forensic Loupe: Inspect physical evidence"
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              activeTool === 'inspect'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'bg-[#25221E] text-[#B8AEA2] hover:text-[#FAF6F0]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Loupe</span>
          </button>

          {/* 2. UV Blacklight */}
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveTool(activeTool === 'uv' ? 'inspect' : 'uv');
            }}
            title="UV Blacklight: Expose latent fluorescent stains"
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              activeTool === 'uv'
                ? 'bg-purple-800 border border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'bg-[#25221E] text-[#B8AEA2] hover:text-[#FAF6F0]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">UV Lamp</span>
          </button>

          {/* 3. Fingerprint Duster */}
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveTool(activeTool === 'duster' ? 'inspect' : 'duster');
            }}
            title="Fingerprint Duster: Lift latent ridge patterns"
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              activeTool === 'duster'
                ? 'bg-amber-700 border border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-[#25221E] text-[#B8AEA2] hover:text-[#FAF6F0]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Duster</span>
          </button>

          {/* 4. Chemical Luminol Spray */}
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveTool(activeTool === 'luminol' ? 'inspect' : 'luminol');
            }}
            title="Chemical Luminol Spray: Detect blood, poison, or cordite"
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              activeTool === 'luminol'
                ? 'bg-cyan-800 border border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-[#25221E] text-[#B8AEA2] hover:text-[#FAF6F0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Luminol</span>
          </button>

          {/* 5. Cipher Decoder Wheel (if applicable) */}
          {cipherHotspot && (
            <button
              type="button"
              onClick={() => {
                sound.playCipherTick();
                setIsCipherModalOpen(true);
              }}
              title="Cipher Disk: Decode encrypted crime scene telegram"
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 bg-yellow-950 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-900 transition-all animate-pulse"
            >
              <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Decryption Disk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Crime Scene Canvas Frame */}
      <div
        onClick={handleCanvasClick}
        className={`relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border-2 transition-all duration-300 select-none ${
          activeTool === 'uv'
            ? 'border-purple-600/70 bg-[#080314]'
            : activeTool === 'luminol'
            ? 'border-cyan-700/60 bg-[#0B1015] cursor-crosshair'
            : activeTool === 'duster'
            ? 'border-amber-700/60 bg-[#16120D] cursor-cell'
            : 'border-[#332E28] bg-gradient-to-b from-[#1C1A17] to-[#12110F]'
        }`}
      >
        {/* Architectural Blueprint / Room Art Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          {/* Floor gridlines */}
          <defs>
            <pattern id="crimeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3A332B" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crimeGrid)" />

          {/* Isometric room zones */}
          <g stroke="#645749" strokeWidth="1.5" fill="none" opacity="0.7">
            <path d="M 20 20 L 260 20 L 260 380 L 20 380 Z" strokeDasharray="4 2" />
            <text x="35" y="45" fill="#C69214" fontSize="13" fontFamily="monospace" fontWeight="bold">
              ZONE A: PRIMARY SANCTUM
            </text>

            <path d="M 280 20 L 530 20 L 530 380 L 280 380 Z" strokeDasharray="4 2" />
            <text x="295" y="45" fill="#C69214" fontSize="13" fontFamily="monospace" fontWeight="bold">
              ZONE B: TRANSIT GALLERY
            </text>

            <path d="M 550 20 L 780 20 L 780 380 L 550 380 Z" strokeDasharray="4 2" />
            <text x="565" y="45" fill="#C69214" fontSize="13" fontFamily="monospace" fontWeight="bold">
              ZONE C: VAULT WING
            </text>
          </g>

          {/* Chalk Silhouette of Victim */}
          <g transform="translate(130, 200) scale(0.65)" stroke="#DC2626" strokeWidth="2.5" fill="none" opacity="0.6">
            <ellipse cx="60" cy="20" rx="14" ry="14" />
            <path d="M 60 34 L 60 90 L 30 140 M 60 90 L 90 140 M 20 60 L 100 50" />
            <text x="0" y="165" fill="#DC2626" fontSize="16" fontFamily="monospace" fontWeight="bold">
              BODY RECOVERY POINT
            </text>
          </g>
        </svg>

        {/* Ambient UV Fluorescent Glow in UV Mode */}
        {activeTool === 'uv' && (
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-black pointer-events-none mix-blend-screen animate-pulse">
            <div className="absolute top-1/3 left-1/4 text-purple-400 font-mono text-xs font-bold tracking-widest uppercase opacity-85">
              [✦ UV TRACE: Latent Fingerprints Detected on Mahogany Railing]
            </div>
            <div className="absolute bottom-1/4 right-1/3 text-purple-400 font-mono text-xs font-bold tracking-widest uppercase opacity-85">
              [✦ UV TRACE: Organic Chemical Residue Discovered on Shards]
            </div>
          </div>
        )}

        {/* Luminol Spray Glow Reaction Overlay */}
        {luminolSplatter && (
          <div
            style={{ left: `${luminolSplatter.x}px`, top: `${luminolSplatter.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-in fade-in zoom-in-75 duration-200"
          >
            <div
              style={{
                background: `radial-gradient(circle, ${luminolSplatter.color} 0%, transparent 70%)`,
                boxShadow: `0 0 35px ${luminolSplatter.color}`,
              }}
              className="w-32 h-32 rounded-full opacity-60 animate-ping"
            />
            <div
              style={{ color: luminolSplatter.color }}
              className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-black tracking-wider bg-black/80 px-2 py-1 rounded border border-current shadow-2xl"
            >
              {luminolSplatter.text}
            </div>
          </div>
        )}

        {/* Interactive Hotspots Overlay */}
        {hotspots.map((h) => {
          const isDiscovered = !!discoveredHotspots?.[h.id];
          return (
            <button
              key={h.id}
              type="button"
              onClick={(e) => handleHotspotClick(h, e)}
              style={{
                left: `${h.xPercent}%`,
                top: `${h.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none"
              title={`Inspect: ${h.name}`}
            >
              {/* Pulsing Target Ring */}
              <span
                className={`absolute inset-0 rounded-full scale-150 animate-ping opacity-75 ${
                  isDiscovered ? 'bg-emerald-500/40' : 'bg-amber-400/50'
                }`}
              ></span>

              {/* Marker Icon Pin */}
              <div
                className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl border-2 transition-all transform group-hover:scale-125 shadow-lg ${
                  isDiscovered
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/40'
                    : 'bg-[#2A2010] border-amber-400 text-amber-300 ring-2 ring-amber-500/50 animate-bounce'
                }`}
              >
                {h.icon}
              </div>

              {/* Tooltip Label */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <span className="bg-[#171513] text-[#FAF6F0] border border-[#C69214] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                  {h.name} {isDiscovered ? '✓' : `(${activeTool.toUpperCase()})`}
                </span>
                <span className="w-1.5 h-1.5 bg-[#C69214] rotate-45 -mt-1"></span>
              </div>
            </button>
          );
        })}

        {/* Discovery Tracker Ribbon */}
        <div className="absolute bottom-2 left-3 bg-[#171513]/90 backdrop-blur-sm border border-[#3A352F] rounded-lg px-3 py-1 text-[11px] font-mono text-[#AAA194] flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-[#C69214]" />
          <span>
            Evidence Recovered: <strong className="text-[#FAF7F2]">{discoveredCount}/{hotspots.length}</strong>
          </span>
          <span className="text-[#554D42]">|</span>
          <span className="text-amber-400">Tool: {activeTool.toUpperCase()}</span>
        </div>
      </div>

      {/* Forensic Examination Modal (When Hotspot is Clicked with Loupe) */}
      {activeHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#C69214] bg-[#171513] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                setActiveHotspot(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#2C2722] pb-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#292215] border border-[#C69214]/50 flex items-center justify-center text-2xl shadow-inner">
                {activeHotspot.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Forensic Tag: {activeHotspot.evidenceTag}
                </span>
                <h4 className="text-lg font-bold font-serif text-[#FAF7F2]">
                  {activeHotspot.evidenceTitle}
                </h4>
              </div>
            </div>

            <div className="bg-[#121110] border border-[#2B2723] rounded-xl p-4 mb-4 font-typewriter text-xs md:text-sm text-[#DDD5C7] leading-relaxed">
              "{activeHotspot.forensicObservation}"
            </div>

            {/* If hotspot has a latent print */}
            {activeHotspot.fingerprintPattern && (
              <div className="mb-4 p-3 rounded-lg bg-[#221B10] border border-amber-600/40 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                  <span>Latent Pattern: {activeHotspot.fingerprintPattern} Ridge</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHotspot(null);
                    setDustingHotspot(activeHotspot);
                  }}
                  className="px-2.5 py-1 rounded bg-[#332512] text-amber-200 hover:bg-[#483318] text-[11px] font-bold border border-amber-500/30"
                >
                  Analyze Ridge →
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Cross-referenced in Police Clue File
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setActiveHotspot(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#C69214] hover:bg-amber-400 text-black font-bold uppercase tracking-wider transition-colors"
              >
                Log Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fingerprint Analysis Microscope Modal */}
      {dustingHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-2xl border-2 border-amber-500/70 bg-[#161412] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                setDustingHotspot(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-[#2C2722] pb-3 mb-4">
              <Fingerprint className="w-6 h-6 text-amber-400 animate-pulse" />
              <div>
                <h3 className="text-base font-bold font-serif text-[#FAF6F0] uppercase tracking-wider">
                  Forensic Biometric Ridge Scanner
                </h3>
                <p className="text-[11px] font-mono text-[#8C8478]">
                  Evidence Item: {dustingHotspot.evidenceTitle} ({dustingHotspot.evidenceTag})
                </p>
              </div>
            </div>

            {/* Recovered Latent Print Card */}
            <div className="bg-[#100E0D] border-2 border-amber-500/40 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-amber-950/40 border border-amber-500/60 flex items-center justify-center text-amber-400 relative overflow-hidden shrink-0">
                <Fingerprint className="w-16 h-16 animate-pulse opacity-90" />
                <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-amber-300">
                  LIFTED
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50 uppercase font-bold">
                  Latent Ridge Type: {dustingHotspot.fingerprintPattern || 'Loop'}
                </span>
                <p className="text-xs text-[#D8CFBF] mt-1.5 font-sans leading-relaxed">
                  Forensic powder reveals distinct dermal papillae friction ridges with{' '}
                  <strong className="text-amber-300">{dustingHotspot.fingerprintPattern || 'Loop'}</strong> curvature.
                  Compare against suspect biometric files below:
                </p>
              </div>
            </div>

            {/* Suspect Comparison Grid */}
            <div className="text-xs font-mono text-[#A89E92] mb-2 uppercase tracking-wider font-bold">
              Precinct Suspect Biometrics:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
              {suspects.map((s) => {
                const matches = s.fingerprintPattern === (dustingHotspot.fingerprintPattern || 'Loop');
                return (
                  <div
                    key={s.id}
                    className={`rounded-xl border p-3 flex flex-col items-center text-center transition-all ${
                      matches
                        ? 'border-emerald-500/70 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/30'
                        : 'border-[#2D2823] bg-[#1A1815] text-[#8C8478]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.avatarEmoji}</div>
                    <div className="text-xs font-bold font-serif text-[#FAF6F0] mb-0.5 truncate w-full">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-amber-400 mb-1">
                      Pattern: {s.fingerprintPattern || 'Whorl'}
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                        matches
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#221F1C] text-[#6E665C]'
                      }`}
                    >
                      {matches ? '✓ MATCH' : '✕ EXCLUDED'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playStamp();
                  if (onLogNote) {
                    onLogNote(
                      `[Fingerprint Lift on ${dustingHotspot.evidenceTitle}]: Matches ${
                        dustingHotspot.fingerprintPattern || 'Loop'
                      } ridge pattern!`
                    );
                  }
                  setDustingHotspot(null);
                }}
                className="w-full py-2.5 rounded-lg bg-[#C69214] hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Log Biometric Match into Notebook (+25 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brass Decryption Cipher Wheel Modal */}
      {isCipherModalOpen && cipherHotspot?.cipherSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-yellow-500/80 bg-[#16130F] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                setIsCipherModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-[#2C2722] pb-3 mb-4">
              <KeyRound className="w-6 h-6 text-yellow-400 animate-spin" />
              <div>
                <h3 className="text-base font-bold font-serif text-[#FAF6F0] uppercase tracking-wider">
                  Brass Caesar Decryption Disk
                </h3>
                <p className="text-[11px] font-mono text-yellow-500/80">
                  Rotate the outer brass wheel to align the Caesar cipher shift!
                </p>
              </div>
            </div>

            {/* Cipher Shift Controller */}
            <div className="bg-[#110F0D] border border-yellow-700/40 rounded-xl p-4 mb-4 text-center">
              <div className="text-[10px] font-mono uppercase text-[#A89E92] mb-1 font-bold">
                Current Wheel Offset: ROT-{cipherShift}
              </div>
              <div className="flex items-center justify-center gap-4 my-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playCipherTick();
                    setCipherShift((prev) => (prev - 1 + 26) % 26);
                  }}
                  className="w-10 h-10 rounded-full bg-[#271E10] border border-yellow-500/60 hover:bg-yellow-900/60 text-yellow-300 font-bold text-lg flex items-center justify-center transition-transform active:scale-95"
                >
                  -
                </button>
                <div className="w-24 h-24 rounded-full border-4 border-yellow-500/70 bg-[#1E170B] flex flex-col items-center justify-center shadow-inner relative">
                  <RotateCw className="w-6 h-6 text-yellow-400 mb-1" />
                  <span className="font-mono text-lg font-black text-yellow-200">
                    +{cipherShift}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playCipherTick();
                    setCipherShift((prev) => (prev + 1) % 26);
                  }}
                  className="w-10 h-10 rounded-full bg-[#271E10] border border-yellow-500/60 hover:bg-yellow-900/60 text-yellow-300 font-bold text-lg flex items-center justify-center transition-transform active:scale-95"
                >
                  +
                </button>
              </div>

              <div className="text-xs font-mono text-[#D8CFBF] bg-[#1A1612] p-3 rounded-lg border border-[#33291B] text-left">
                <div className="text-[10px] text-amber-500 font-bold uppercase mb-1">
                  Intercepted Encrypted Telegram:
                </div>
                <div className="tracking-widest font-mono text-red-300 mb-2">
                  "{cipherHotspot.cipherSnippet.encrypted}"
                </div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">
                  Decoded Output (Shift {cipherShift}):
                </div>
                <div className="tracking-widest font-mono text-emerald-300 font-bold text-sm">
                  "{decodeText(cipherHotspot.cipherSnippet.encrypted, cipherShift)}"
                </div>
              </div>
            </div>

            {/* Clue hint */}
            <p className="text-xs text-[#8C8478] font-sans italic mb-4">
              Tip: {cipherHotspot.cipherSnippet.hint}
            </p>

            {/* Check Decryption */}
            <button
              type="button"
              onClick={() => {
                const targetDecrypted = cipherHotspot.cipherSnippet!.decrypted;
                const currentDecoded = decodeText(cipherHotspot.cipherSnippet!.encrypted, cipherShift);
                if (currentDecoded.toUpperCase() === targetDecrypted.toUpperCase()) {
                  sound.playVictory();
                  setCipherSuccess(true);
                  if (onLogNote) {
                    onLogNote(`[Decoded Secret Telegram]: "${targetDecrypted}"`);
                  }
                  setTimeout(() => {
                    setIsCipherModalOpen(false);
                    setCipherSuccess(false);
                  }, 2000);
                } else {
                  sound.playError();
                }
              }}
              className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                cipherSuccess
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#C69214] hover:bg-amber-400 text-black'
              }`}
            >
              {cipherSuccess ? 'CIPHER CRACKED! (+100 XP)' : 'Verify Decryption Key'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
