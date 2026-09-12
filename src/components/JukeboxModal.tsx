import React, { useState, useEffect } from 'react';
import {
  sound,
  TRACK_CATALOG,
  type AtmosphereMode,
  type SongTrack,
} from '../audio/soundEffects';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  ShieldCheck,
  Disc3,
  Globe,
} from 'lucide-react';

interface JukeboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JukeboxModal: React.FC<JukeboxModalProps> = ({ isOpen, onClose }) => {
  const [currentMode, setCurrentMode] = useState<AtmosphereMode>(sound.getAtmosphere());
  const [currentTrack, setCurrentTrack] = useState<SongTrack | null>(sound.getCurrentTrack());
  const [volume, setVolume] = useState<number>(sound.getAmbientVolume());
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'viral' | 'japanese' | 'english' | 'noir' | 'ambience'
  >('all');
  const [customUrlInput, setCustomUrlInput] = useState<string>(sound.getCustomStreamUrl());

  useEffect(() => {
    return sound.subscribe((state) => {
      setCurrentMode(state.atmosphere);
      setCurrentTrack(state.currentTrack);
      setVolume(state.ambientVolume);
      setIsMuted(state.isMuted);
    });
  }, []);

  if (!isOpen) return null;

  const isPlaying = currentMode !== 'off';

  const handlePlayTrack = (trackId: AtmosphereMode) => {
    sound.unlock();
    sound.playTypewriter();
    if (currentMode === trackId) {
      sound.setAtmosphere('off');
    } else {
      sound.setAtmosphere(trackId);
    }
  };

  const handleTogglePlayPause = () => {
    sound.unlock();
    sound.playTypewriter();
    if (isPlaying) {
      sound.setAtmosphere('off');
    } else {
      sound.setAtmosphere(currentTrack ? currentTrack.id : 'citypop');
    }
  };

  const handleNext = () => {
    sound.unlock();
    sound.playCassetteClick();
    sound.nextTrack();
  };

  const handlePrev = () => {
    sound.unlock();
    sound.playCassetteClick();
    sound.prevTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setAmbientVolume(val);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      sound.setCustomStreamUrl(customUrlInput.trim());
      sound.setAtmosphere('custom');
    }
  };

  const filteredTracks = TRACK_CATALOG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#141210] border-2 border-[#C69214]/60 shadow-[0_0_50px_rgba(198,146,20,0.25)] overflow-hidden text-[#DDD5C7]">
        {/* Vintage Jukebox Neon Header */}
        <div className="relative border-b border-[#2C261F] p-4 sm:p-5 bg-gradient-to-r from-[#201A12] via-[#2A1D13] to-[#201A12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2D2111] border border-[#C69214]/60 flex items-center justify-center text-2xl shadow-inner relative overflow-hidden">
              <Disc3
                className={`w-7 h-7 text-amber-400 ${
                  isPlaying ? 'animate-spin' : 'opacity-60'
                }`}
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#FAF7F2] flex items-center gap-2">
                  <span>PRECINCT JUKEBOX</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    100% COPYRIGHT-FREE
                  </span>
                </h2>
              </div>
              <p className="text-xs text-[#A89F91] font-mono">
                Montagem & Phonk Edits • Japanese Hits • English Pop • 100% Streamer Safe
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playCassetteClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#221D17] hover:bg-[#2F261E] border border-[#3E3427] text-stone-400 hover:text-white transition-colors"
            title="Close Jukebox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-Column layout (Left: Active Track & Turntable / Right: Song Catalog) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: TURNTABLE & ACTIVE PLAYER (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#1A1612] border border-[#2F271E] rounded-2xl p-4 sm:p-5 shadow-xl">
            {/* Vintage Turntable Visualizer */}
            <div className="flex flex-col items-center justify-center p-3 relative">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#0D0B0A] border-8 border-[#221B14] shadow-2xl flex items-center justify-center">
                {/* Vinyl Grooves */}
                <div
                  className={`absolute inset-2 rounded-full border border-stone-800/80 ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                >
                  <div className="absolute inset-4 rounded-full border border-stone-800/60" />
                  <div className="absolute inset-8 rounded-full border border-stone-800/40" />
                  <div className="absolute inset-12 rounded-full border border-stone-800/30" />
                </div>

                {/* Center Record Label */}
                <div
                  className={`w-20 h-20 rounded-full border-2 border-amber-500/60 p-2 flex flex-col items-center justify-center text-center shadow-inner relative z-10 transition-colors ${
                    currentTrack?.category === 'japanese'
                      ? 'bg-red-950/80 text-rose-200'
                      : currentTrack?.category === 'english'
                      ? 'bg-blue-950/80 text-cyan-200'
                      : 'bg-amber-950/80 text-amber-200'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider">
                    {currentTrack ? currentTrack.flag : '📻'}
                  </span>
                  <span className="text-[10px] font-serif font-bold leading-tight truncate max-w-[70px]">
                    {currentTrack ? currentTrack.title.split(' ')[0] : 'Sleuth'}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-stone-600 mt-1" />
                </div>
              </div>

              {/* Animated Live Equalizer Spectrum Bars */}
              <div className="flex items-end justify-center gap-1.5 h-6 mt-4 w-full">
                {[12, 20, 15, 24, 18, 22, 14, 26, 17, 21, 16, 25, 19, 23, 15, 20].map(
                  (maxH, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlaying
                          ? currentTrack?.category === 'japanese'
                            ? 'bg-rose-400'
                            : currentTrack?.category === 'english'
                            ? 'bg-cyan-400'
                            : 'bg-amber-400'
                          : 'bg-stone-800 h-1'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(4, (idx * 3) % maxH + 6)}px` : '4px',
                        animation: isPlaying
                          ? `pulse ${0.4 + (idx % 5) * 0.15}s infinite alternate`
                          : 'none',
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Now Playing Metadata Card */}
            <div className="bg-[#120F0D] border border-[#2B231A] rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mb-1">
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>NOW SPINNING</span>
                  </>
                ) : (
                  <span className="text-stone-500">JUKEBOX PAUSED</span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-serif font-bold text-amber-200 leading-tight">
                {currentTrack ? currentTrack.title : 'Select a Song'}
              </h3>
              {currentTrack?.subtitle && (
                <div className="text-xs font-serif text-[#C4BCB0] mt-0.5">
                  {currentTrack.subtitle}
                </div>
              )}
              <div className="text-[11px] text-[#8C8476] font-mono mt-1">
                {currentTrack ? currentTrack.artist : '100% Original Compositions'}
              </div>

              {currentTrack && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-semibold">
                    {currentTrack.genre}
                  </span>
                  {currentTrack.bpm > 0 && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                      {currentTrack.bpm} BPM
                    </span>
                  )}
                  {currentTrack.key !== 'Storm' && currentTrack.key !== 'Morse' && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
                      Key: {currentTrack.key}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Transport Player Controls */}
            <div className="space-y-3">
              {/* Play / Skip Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-[#221D17] hover:bg-[#2C251E] border border-[#3A3023] text-stone-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                  title="Previous Song"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black shadow-lg shadow-amber-900/40 transition-all hover:scale-105 active:scale-95 font-bold"
                  title={isPlaying ? 'Pause Jukebox' : 'Play Jukebox'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-black" />
                  ) : (
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-[#221D17] hover:bg-[#2C251E] border border-[#3A3023] text-stone-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                  title="Next Song"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="px-3 py-2 bg-[#120F0D] rounded-xl border border-[#2B231A]">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Jukebox Volume
                  </span>
                  <span className="font-bold text-amber-400 font-mono">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sound.setMuted(!isMuted)}
                    className="text-stone-400 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#2E281F] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: SONG CATALOG & STREAM INPUT (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#1A1612] p-1.5 rounded-xl border border-[#2F271E]">
              {[
                { id: 'all', label: `All Music (${TRACK_CATALOG.length})` },
                { id: 'viral', label: '🔥 Viral Edits & Phonk (4)' },
                { id: 'japanese', label: '🇯🇵 Japanese Hits (3)' },
                { id: 'english', label: '🇬🇧 English Hits (3)' },
                { id: 'noir', label: '🎷 Noir Classics (1)' },
                { id: 'ambience', label: '🌧️ Soundscapes (3)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedCategory(tab.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-amber-600 text-black shadow-md'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-[#252019]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Song Cards List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1 custom-scrollbar">
              {filteredTracks.map((track) => {
                const isCurrent = currentMode === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track.id)}
                    className={`cursor-pointer group flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#291F14] border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#181410] hover:bg-[#221D16] border-[#2C251C] hover:border-amber-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Play Button Icon */}
                      <button
                        type="button"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-black border-amber-400 scale-105'
                            : 'bg-[#241E17] text-amber-300 border-[#382E22] group-hover:border-amber-500/60'
                        }`}
                      >
                        {isCurrent ? (
                          <Pause className="w-4 h-4 fill-black" />
                        ) : (
                          <Play className="w-4 h-4 fill-amber-300 ml-0.5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-serif font-bold text-[#FAF7F2] group-hover:text-amber-200 transition-colors">
                            {track.title}
                          </span>
                          {track.subtitle && (
                            <span className="text-xs text-amber-400 font-serif font-semibold">
                              {track.subtitle}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-[#8C8476] font-sans">
                          <span>{track.genre}</span>
                          <span>•</span>
                          <span className="font-mono">{track.artist}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        100% CC0 FREE
                      </span>

                      {isCurrent && (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-1 bg-amber-400 animate-pulse h-2 rounded-full" />
                          <span className="w-1 bg-amber-300 animate-pulse h-3 rounded-full" />
                          <span className="w-1 bg-amber-400 animate-pulse h-1.5 rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Audio / Stream URL Section */}
            <div className="mt-auto bg-[#171410] border border-[#2B231A] rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-300 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Stream / Radio URL (MP3 / Icecast)</span>
              </div>
              <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste direct audio URL (e.g. https://.../lofi.mp3)"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-[#100D0B] border border-[#2E251B] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs rounded-lg transition-colors"
                >
                  Stream Now
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="border-t border-[#262018] px-5 py-3 bg-[#0F0D0B] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#8C8476]">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero DMCA Copyright Claims • Safe for Twitch, YouTube & TikTok Gameplay</span>
          </div>

          <button
            onClick={() => {
              sound.playCassetteClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#201A13] hover:bg-[#2C241B] text-amber-300 font-mono font-bold text-xs rounded-lg border border-[#3C3224] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
