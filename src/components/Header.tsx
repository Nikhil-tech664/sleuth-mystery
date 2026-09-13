import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Archive,
  Printer,
  BarChart3,
  ShieldCheck,
  Flame,
  HelpCircle,
  Lightbulb,
  Mail,
  Swords,
  Trophy,
  Radio,
  Music,
  Wind,
  CloudRain,
  Sliders,
  Disc3,
  BookOpen,
  Edit3,
  Users,
  Flashlight,
  Coffee,
  Newspaper,
} from 'lucide-react';
import { sound, type AtmosphereMode, type SongTrack } from '../audio/soundEffects';
import { setMutedPreference } from '../utils/storage';
import type { DetectiveRank } from '../types/game';
import { CountdownTimer } from './CountdownTimer';
import { InstallPwaButton } from './InstallPwaButton';

interface HeaderProps {
  caseNumber: number;
  dateStr: string;
  streak: number;
  rank: DetectiveRank;
  onOpenVault: () => void;
  onOpenPrintable: () => void;
  onOpenStats: () => void;
  onOpenTutorial: () => void;
  onOpenHint: () => void;
  onOpenSubscriber: () => void;
  onOpenDuel: () => void;
  onOpenTrophyRoom: () => void;
  onOpenJukebox?: () => void;
  onOpenCampaign?: () => void;
  onOpenCaseCreator?: () => void;
  onOpenCoopRoom?: () => void;
  onOpen3DScene?: () => void;
  onOpenCoffee?: () => void;
  onOpenNewspaper?: () => void;
  onCompleteAll?: () => void;
  isSolved: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  caseNumber,
  dateStr,
  streak,
  rank,
  onOpenVault,
  onOpenPrintable,
  onOpenStats,
  onOpenTutorial,
  onOpenHint,
  onOpenSubscriber,
  onOpenDuel,
  onOpenTrophyRoom,
  onOpenJukebox,
  onOpenCampaign,
  onOpenCaseCreator,
  onOpenCoopRoom,
  onOpen3DScene,
  onOpenCoffee,
  onOpenNewspaper,
  onCompleteAll,
  isSolved,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [currentAtmosphere, setCurrentAtmosphere] = useState<AtmosphereMode>(sound.getAtmosphere());
  const [currentTrack, setCurrentTrack] = useState<SongTrack | null>(sound.getCurrentTrack());
  const [ambientVolume, setAmbientVolume] = useState<number>(sound.getAmbientVolume());
  const [isAtmosphereMenuOpen, setIsAtmosphereMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = sound.subscribe((state) => {
      setIsMuted(state.isMuted);
      setCurrentAtmosphere(state.atmosphere);
      setCurrentTrack(state.currentTrack);
      setAmbientVolume(state.ambientVolume);
    });
    return unsubscribe;
  }, []);

  const handleToggleSound = () => {
    sound.unlock();
    const nextState = !isMuted;
    setIsMuted(nextState);
    sound.setMuted(nextState);
    setMutedPreference(nextState);
    if (!nextState) {
      sound.playTestSound();
    }
  };

  const handleSelectAtmosphere = (mode: AtmosphereMode) => {
    sound.unlock();
    sound.playTypewriter();
    sound.setAtmosphere(mode);
    setIsAtmosphereMenuOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmbientVolume(val);
    sound.setAmbientVolume(val);
  };

  return (
    <>
      {/* Scotland Yard Telegraph Dispatch Ticker */}
      <div className="bg-[#120F0D] border-b border-[#282119] py-1 px-3 flex items-center justify-between text-[10px] font-mono text-amber-500/90 overflow-hidden select-none">
        <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="font-bold text-amber-400">⚡ SCOTLAND YARD TELEGRAPH:</span>
          <span>THE MIDNIGHT ARCHITECT SIGHTED NEAR WESTMINSTER</span>
          <span>•</span>
          <span>5-CHAPTER CAMPAIGN READY</span>
          <span>•</span>
          <span>CASE STUDIO & CO-OP ROOMS ONLINE</span>
          <span>•</span>
          <span>KEEP DEDUCTION COMBOS HIGH</span>
          <span>⚡</span>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0 pl-3">
          {onCompleteAll && (
            <button
              type="button"
              onClick={() => {
                sound.playVictory();
                onCompleteAll();
              }}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-bold font-mono transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
              title="Instantly 100% complete all cases and ranks"
            >
              <span>⚡ CLEAR ALL (100%)</span>
            </button>
          )}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[9px] text-emerald-400 font-bold">SECURE FREQUENCY</span>
        </div>
      </div>

      <header className="border-b border-[#2A2622] bg-[#171513]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Case Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2A241B] border border-[#C69214]/40 flex items-center justify-center text-xl shadow-inner">
            🕵️‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#FAF7F2] font-serif">
                SLEUTH
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-[#C69214]/20 text-[#E5B54F] border border-[#C69214]/40 font-mono font-semibold uppercase">
                Case #{caseNumber}
              </span>
              {isSolved && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-600/50 font-mono font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> CLOSED
                </span>
              )}
            </div>
            <p className="text-xs text-[#9B9489] font-mono">
              {dateStr} • {rank.title} {rank.badge}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Midnight Countdown Timer */}
          <div className="hidden sm:block">
            <CountdownTimer />
          </div>

          {/* Daily Streak */}
          <div
            onClick={() => {
              sound.playTypewriter();
              onOpenStats();
            }}
            title={`Current Streak: ${streak} days. Click to view detective stats.`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221F1C] border border-[#3A352F] text-amber-400 cursor-pointer hover:border-amber-500/50 transition-colors text-xs font-mono font-bold"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* How to Play Tutorial */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenTutorial();
            }}
            title="Rookie Gumshoe Manual: How to Play"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:border-[#C69214]/60 text-[#DDD5C7] text-xs font-mono transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C69214]" />
            <span className="hidden md:inline">How to Play</span>
          </button>

          {/* Inspector Hint Button */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenHint();
            }}
            title="Inspect Forensics / Get Inspector Hint"
            className="p-2 rounded-lg bg-[#221F1C] border border-amber-500/40 hover:bg-[#2C2824] text-amber-400 hover:text-amber-300 transition-colors shadow-inner"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Buy Me a Coffee / Tip Jar Button */}
          {onOpenCoffee && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenCoffee();
              }}
              title="Buy the Detective a Coffee (Precinct Tip Jar)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-mono text-xs font-bold border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition-all"
            >
              <Coffee className="w-3.5 h-3.5 fill-current text-stone-950" />
              <span className="hidden sm:inline">Tip Coffee</span>
            </button>
          )}

          {/* Sound FX Toggle & Test */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Audio is currently MUTED. Click to unmute!' : 'Mute Sound Effects'}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                isMuted
                  ? 'bg-red-950/80 border-red-500/80 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-[#221F1C] border-[#3A352F] hover:bg-[#2C2824] text-[#C4BCB0] hover:text-[#FAF7F2]'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-[10px] text-red-300 uppercase font-bold">Muted</span>
                </>
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              onClick={() => {
                sound.unlock();
                if (isMuted) {
                  setIsMuted(false);
                  sound.setMuted(false);
                  setMutedPreference(false);
                }
                sound.playTestSound();
              }}
              title="Click to test speaker sound effects"
              className="p-2 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:bg-amber-950/60 hover:border-amber-500/60 text-amber-300 hover:text-amber-100 transition-all text-xs font-mono font-bold flex items-center gap-1"
            >
              <span>🔔 Test</span>
            </button>
          </div>

          {/* Atmosphere Audio Selector & Jukebox Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAtmosphereMenuOpen(!isAtmosphereMenuOpen)}
              title={
                currentAtmosphere !== 'off'
                  ? `Now Playing: ${currentTrack?.title || currentAtmosphere.toUpperCase()}. Click to adjust volume or track.`
                  : 'Atmospheric Soundscapes, Japanese & English Songs'
              }
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-mono font-semibold ${
                currentAtmosphere !== 'off'
                  ? 'bg-amber-950/90 border-amber-500/80 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/40'
                  : 'bg-[#221F1C] border-[#3A352F] text-[#C4BCB0] hover:bg-[#2C2824]'
              }`}
            >
              {currentTrack?.flag ? (
                <span className="text-xs">{currentTrack.flag}</span>
              ) : currentAtmosphere === 'rain' ? (
                <CloudRain className="w-4 h-4 text-blue-400" />
              ) : currentAtmosphere === 'jazz' ? (
                <Music className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : currentAtmosphere === 'clock' ? (
                <Wind className="w-4 h-4 text-emerald-400" />
              ) : currentAtmosphere === 'radio' ? (
                <Radio className="w-4 h-4 text-purple-400" />
              ) : (
                <Music className="w-4 h-4 opacity-60" />
              )}

              <span className="hidden lg:inline text-[11px] font-bold truncate max-w-[110px]">
                {currentAtmosphere === 'off'
                  ? 'Music & Ambience'
                  : currentTrack
                  ? currentTrack.title
                  : currentAtmosphere.toUpperCase()}
              </span>

              {/* Animated Jumping Equalizer Bars when playing */}
              {currentAtmosphere !== 'off' && (
                <div className="flex items-end gap-0.5 h-3 ml-0.5" title="Music playing">
                  <span className="w-1 bg-amber-400 animate-pulse h-2 rounded-full" />
                  <span className="w-1 bg-amber-300 animate-pulse h-3 rounded-full" />
                  <span className="w-1 bg-amber-400 animate-pulse h-1.5 rounded-full" />
                </div>
              )}
            </button>

            {/* Atmosphere Menu Dropdown */}
            {isAtmosphereMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-[#161412] border-2 border-[#C69214]/70 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8C8478] px-1 py-0.5 uppercase tracking-wider font-bold border-b border-[#2B2621] mb-2">
                  <span>Precinct Audio & Music</span>
                  {currentAtmosphere !== 'off' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      PLAYING
                    </span>
                  )}
                </div>

                {/* Volume Slider */}
                <div className="px-2.5 py-2 mb-2 bg-[#201C18] rounded-xl border border-[#352F26]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#AAA193] mb-1.5">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Sliders className="w-3 h-3 text-[#C69214]" />
                      Music Volume
                    </span>
                    <span className="font-bold text-amber-300 font-mono">
                      {Math.round(ambientVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={handleVolumeChange}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#383228] rounded-lg"
                  />
                </div>

                {/* Open Full Jukebox Button */}
                {onOpenJukebox && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setIsAtmosphereMenuOpen(false);
                      onOpenJukebox();
                    }}
                    className="w-full mb-2.5 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Disc3 className="w-3.5 h-3.5 fill-black animate-spin" />
                    <span>Open Full Jukebox Modal</span>
                  </button>
                )}

                {/* SECTION 0: 🔥 Viral Edits & Phonk */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-orange-400 uppercase font-bold tracking-wider px-1 mb-1 flex items-center gap-1">
                    <span>🔥 Viral Edits & Phonk (Copyright-Free)</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'montagem_hikari' as AtmosphereMode, name: 'Montagem - Hikari', sub: 'Brazilian Phonk • Favela Beat' },
                      { id: 'drift_phonk' as AtmosphereMode, name: 'Metamorphosis Drift', sub: 'Sigma Cowbell Drift Phonk' },
                      { id: 'after_dark' as AtmosphereMode, name: 'After Dark Synthwave', sub: 'Slowed + Reverb Nightwave' },
                      { id: 'shinunoga' as AtmosphereMode, name: 'Shinunoga Viral Groove', sub: 'Japanese Neo-Soul Trap Edit' },
                    ].map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => handleSelectAtmosphere(song.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all ${
                          currentAtmosphere === song.id
                            ? 'bg-orange-950/60 border border-orange-500/70 text-orange-200 font-bold shadow-sm'
                            : 'text-[#DDD5C7] hover:bg-[#221F1C] border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="leading-tight">{song.name}</div>
                          <div className="text-[9px] text-[#8C8476] font-sans">{song.sub}</div>
                        </div>
                        {currentAtmosphere === song.id && (
                          <span className="text-[10px] text-orange-400 font-bold">▶</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION 1: 🇯🇵 Japanese Songs */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-rose-400 uppercase font-bold tracking-wider px-1 mb-1 flex items-center gap-1">
                    <span>🇯🇵 Japanese Songs (Copyright-Free)</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'citypop' as AtmosphereMode, name: 'Midnight in Shibuya', sub: '渋谷ミッドナイト • City Pop' },
                      { id: 'anime' as AtmosphereMode, name: 'Sakura Neon Garden', sub: '桜ネオン • Koto Lo-Fi' },
                      { id: 'akihabara' as AtmosphereMode, name: 'Akihabara Night Rain', sub: '秋葉原レイン • Cyber Synth' },
                    ].map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => handleSelectAtmosphere(song.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all ${
                          currentAtmosphere === song.id
                            ? 'bg-rose-950/60 border border-rose-500/70 text-rose-200 font-bold shadow-sm'
                            : 'text-[#DDD5C7] hover:bg-[#221F1C] border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="leading-tight">{song.name}</div>
                          <div className="text-[9px] text-[#8C8476] font-sans">{song.sub}</div>
                        </div>
                        {currentAtmosphere === song.id && (
                          <span className="text-[10px] text-rose-400 font-bold">▶</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION 2: 🇬🇧 🇺🇸 English Songs */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider px-1 mb-1 flex items-center gap-1">
                    <span>🇬🇧 English Songs (Copyright-Free)</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'english_pop' as AtmosphereMode, name: 'Velvet Midnight', sub: 'Modern Chill Pop / R&B' },
                      { id: 'synthwave' as AtmosphereMode, name: 'Neon City Highway', sub: 'Cyber-Noir Synthwave' },
                      { id: 'lofi_beats' as AtmosphereMode, name: 'London Rain & Coffee', sub: 'Detective Lo-Fi Beats' },
                    ].map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => handleSelectAtmosphere(song.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all ${
                          currentAtmosphere === song.id
                            ? 'bg-cyan-950/60 border border-cyan-500/70 text-cyan-200 font-bold shadow-sm'
                            : 'text-[#DDD5C7] hover:bg-[#221F1C] border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="leading-tight">{song.name}</div>
                          <div className="text-[9px] text-[#8C8476] font-sans">{song.sub}</div>
                        </div>
                        {currentAtmosphere === song.id && (
                          <span className="text-[10px] text-cyan-400 font-bold">▶</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SECTION 3: 🎷 Classic Noir & Soundscapes */}
                <div className="mb-2">
                  <div className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-wider px-1 mb-1">
                    🎷 Noir & Soundscapes
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'jazz' as AtmosphereMode, name: '1940s Noir Jazz Lounge', sub: 'Walking bass, drums & sax' },
                      { id: 'rain' as AtmosphereMode, name: 'Rain & Thunder', sub: 'Cobblestone downpour' },
                      { id: 'clock' as AtmosphereMode, name: 'Clocktower Chimes', sub: 'Westminster bells & wind' },
                      { id: 'radio' as AtmosphereMode, name: 'Precinct Radio & Morse', sub: 'Shortwave carrier hum' },
                    ].map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => handleSelectAtmosphere(song.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all ${
                          currentAtmosphere === song.id
                            ? 'bg-[#2D2314] border border-amber-500/70 text-amber-300 font-bold shadow-sm'
                            : 'text-[#DDD5C7] hover:bg-[#221F1C] border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="leading-tight">{song.name}</div>
                          <div className="text-[9px] text-[#8C8476] font-sans">{song.sub}</div>
                        </div>
                        {currentAtmosphere === song.id && (
                          <span className="text-[10px] text-amber-400 font-bold">▶</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#2B2621] my-2"></div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.unlock();
                      sound.playTestSound();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-mono bg-[#221F1C] hover:bg-[#2C2824] text-amber-300 border border-[#3A352F] transition-colors font-semibold"
                  >
                    <span>🔔 Test Chime</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAtmosphere('off')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-mono text-red-400 hover:bg-[#2A1616] border border-red-950 hover:border-red-800 transition-colors"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop / Off</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Jukebox Button in Header Bar */}
          {onOpenJukebox && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenJukebox();
              }}
              title="Open Precinct Jukebox (100% Copyright-Free Japanese & English Songs)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#2A1E12] to-[#20170E] hover:from-[#382818] hover:to-[#2B1F13] border border-amber-500/50 hover:border-amber-400 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            >
              <Disc3
                className={`w-3.5 h-3.5 text-amber-400 ${
                  currentAtmosphere !== 'off' ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
              <span className="hidden sm:inline">Jukebox</span>
            </button>
          )}

          {/* 5-Chapter Story Campaign */}
          {onOpenCampaign && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenCampaign();
              }}
              title="The London Blackout: 5-Chapter Story Campaign"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#271E10] hover:bg-[#382B14] border border-amber-500/60 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Campaign</span>
            </button>
          )}

          {/* Case Creator Studio */}
          {onOpenCaseCreator && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenCaseCreator();
              }}
              title="Detective Case Studio: Build & Share Cases"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#201810] hover:bg-[#2F2316] border border-amber-600/50 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Case Studio</span>
            </button>
          )}

          {/* Detective Co-Op Room */}
          {onOpenCoopRoom && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenCoopRoom();
              }}
              title="Detective Co-Op: Shared Room Code Investigation"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181D26] hover:bg-[#202836] border border-blue-500/50 text-blue-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Co-Op</span>
            </button>
          )}

          {/* 3D Crime Scene Flashlight Investigator */}
          {onOpen3DScene && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpen3DScene();
              }}
              title="Canvas 3D Flashlight & UV Crime Scene Investigator"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#22172C] hover:bg-[#322042] border border-purple-500/50 text-purple-300 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            >
              <Flashlight className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">3D Scene</span>
            </button>
          )}

          {/* Victorian Front-Page Newspaper */}
          {onOpenNewspaper && (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenNewspaper();
              }}
              title="Read & Download Victorian Daily Chronicle Newspaper (.PNG)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2D2418] hover:bg-[#3D3020] border border-amber-500/60 text-amber-200 text-xs font-serif font-bold transition-all shadow-sm active:scale-95"
            >
              <Newspaper className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">The Chronicle</span>
            </button>
          )}

          {/* Evidence Locker / Trophy Room */}
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              onOpenTrophyRoom();
            }}
            title="Precinct Evidence Locker: Solved Trophies"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271E10] border border-amber-500/50 hover:bg-[#382B14] hover:border-amber-400 text-amber-300 text-xs font-mono font-bold transition-all shadow-inner"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Evidence Locker</span>
          </button>

          {/* 1v1 Detective Duel */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenDuel();
            }}
            title="1v1 Detective Duel: Challenge a Friend"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B1715] border border-red-500/40 hover:bg-[#3D1D1A] hover:border-red-500 text-red-300 text-xs font-mono font-bold transition-colors"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span>1v1 Duel</span>
          </button>

          {/* Daily Morning Dispatch Subscriber */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenSubscriber();
            }}
            title="Subscribe to Daily Morning Dispatches"
            className="p-2 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:bg-[#2C2824] text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* Install PWA App Button */}
          <InstallPwaButton />

          {/* Printable Detective Kit */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenPrintable();
            }}
            title="Printable Detective File / Book Exporter"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:border-[#C69214]/50 hover:bg-[#2C2824] text-[#D8CFBF] text-xs font-mono transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#C69214]" />
            <span>Print Kit</span>
          </button>

          {/* Cold Case Vault (Pro/Monetization) */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenVault();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#854D0E] to-[#A16207] text-[#FAF7F2] text-xs font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Cold Vault</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenStats();
            }}
            className="p-2 rounded-lg bg-[#221F1C] border border-[#3A352F] hover:bg-[#2C2824] text-[#C4BCB0] hover:text-[#FAF7F2] transition-colors"
            title="Detective Career Stats"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
    </>
  );
};
