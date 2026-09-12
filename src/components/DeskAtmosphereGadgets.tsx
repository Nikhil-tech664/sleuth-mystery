import React, { useState, useEffect } from 'react';
import { sound, type AtmosphereMode, type SongTrack } from '../audio/soundEffects';
import { Phone, Flame, Sparkles, Clock, Volume2, X, Disc3, SkipForward } from 'lucide-react';

interface DeskAtmosphereGadgetsProps {
  isLampOn: boolean;
  onToggleLamp: () => void;
  caseNumber: number;
  onOpenJukebox?: () => void;
}

export const DeskAtmosphereGadgets: React.FC<DeskAtmosphereGadgetsProps> = ({
  isLampOn,
  onToggleLamp,
  caseNumber,
  onOpenJukebox,
}) => {
  // Atmosphere state subscription
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>(sound.getAtmosphere());
  const [currentTrack, setCurrentTrack] = useState<SongTrack | null>(sound.getCurrentTrack());

  useEffect(() => {
    return sound.subscribe((st) => {
      setAtmosphere(st.atmosphere);
      setCurrentTrack(st.currentTrack);
    });
  }, []);

  // Telephone state
  const [dialedNumber, setDialedNumber] = useState<string>('');
  const [isDialing, setIsDialing] = useState<boolean>(false);
  const [phoneMessage, setPhoneMessage] = useState<{
    caller: string;
    text: string;
    badge: string;
  } | null>(null);

  // Pocket watch state
  const [isWatchOpen, setIsWatchOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update watch clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Rotary Dialing
  const handleDialDigit = (digit: string) => {
    if (isDialing || dialedNumber.length >= 4) return;
    setIsDialing(true);
    sound.playRotaryDial();

    setTimeout(() => {
      setIsDialing(false);
      const newNum = dialedNumber + digit;
      setDialedNumber(newNum);

      // Check hotline matches
      if (newNum === '1' || newNum === '911') {
        setPhoneMessage({
          caller: 'Scotland Yard Dispatch (Insp. Vance)',
          text: `"Headquarters here. Sleuth, check the fingerprint whorls on the glassware before you sign that warrant. We won't tolerate another mistrial."`,
          badge: 'POLICE SECURE LINE',
        });
      } else if (newNum === '2' || newNum === '411') {
        setPhoneMessage({
          caller: 'The Informant (Black Fedora)',
          text: `"Listen close, Detective... I saw someone wiping fingerprints down in the corridors right before the power cut out. Trust your logic grid, not their tears."`,
          badge: 'ANONYMOUS TAP',
        });
      } else if (newNum === '3') {
        sound.setAtmosphere('rain');
        setPhoneMessage({
          caller: 'Precinct Weather Monitor',
          text: `"Heavy storm front moving through London over the cobblestones. Visibility reduced to 20 yards. Rain drumming against precinct windowpanes."`,
          badge: 'WEATHER REPORT',
        });
      } else if (newNum === '4' || newNum === '007') {
        setPhoneMessage({
          caller: "Dr. Campbell's Morgue Post-Mortem",
          text: `"Coroner Campbell here. Trauma was instantaneous. The perpetrator acted with cold calculated deliberation. Keep your revolver close."`,
          badge: 'CORONER DESK',
        });
      } else if (newNum.length >= 3 && !phoneMessage) {
        setPhoneMessage({
          caller: 'Static Operator Line',
          text: `"Operator... The exchange you are calling has been disconnected by order of The Midnight Council. *Hiss of cold static*"`,
          badge: 'DISCONNECTED',
        });
      }
    }, 450);
  };

  const handleResetPhone = () => {
    sound.playCassetteClick();
    setDialedNumber('');
    setPhoneMessage(null);
  };

  // Pocket watch time formatting
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const hourDeg = (hours + minutes / 60) * 30;
  const minDeg = (minutes + seconds / 60) * 6;
  const secDeg = seconds * 6;

  return (
    <>
      {/* Ambient warm lighting overlay across page if lamp is active */}
      {isLampOn && (
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700 ease-in-out"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 12%, rgba(245, 158, 11, 0.12) 0%, rgba(180, 83, 9, 0.05) 50%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
      )}

      {/* Desk Gadgets Toolbar Container */}
      <div className="w-full bg-[#171513] border border-[#302B24] rounded-2xl p-3.5 shadow-xl relative overflow-hidden">
        {/* Subtle desk wood-grain background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/10 via-transparent to-amber-950/10 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          {/* GADGET 1: VINTAGE BRASS BANKER'S DESK LAMP */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* Lamp shade visual */}
              <div
                onClick={() => {
                  sound.unlock();
                  sound.playLampClick();
                  onToggleLamp();
                }}
                className={`cursor-pointer transition-all duration-300 p-2.5 rounded-xl border flex items-center gap-2 select-none shadow-md ${
                  isLampOn
                    ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 shadow-emerald-900/30'
                    : 'bg-[#221F1B] border-[#3D372F] text-[#8E867A] hover:border-amber-700/50'
                }`}
                title="Click to pull brass chain and toggle warm incandescent desk lighting"
              >
                {/* Banker lamp icon representation */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-6 h-3 rounded-t-full transition-colors ${
                      isLampOn
                        ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                        : 'bg-emerald-950 border border-emerald-800'
                    }`}
                  />
                  <div className="absolute -bottom-1 w-1 h-2 bg-amber-600 rounded-sm" />
                </div>

                <div className="text-left">
                  <div className="text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Flame
                      className={`w-3.5 h-3.5 ${
                        isLampOn ? 'text-amber-400 animate-pulse' : 'text-[#6A6357]'
                      }`}
                    />
                    <span>Banker&apos;s Lamp</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isLampOn
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {isLampOn ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8C8476] font-sans">
                    {isLampOn ? 'Incandescent glow active' : 'Click to pull beaded chain'}
                  </div>
                </div>

                {/* Animated hanging brass beaded pull-chain */}
                <div className="flex flex-col items-center ml-1 group-hover:translate-y-1 transition-transform">
                  <div className="w-[1.5px] h-3 bg-amber-500/70" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* GADGET 2: 1940S BAKELITE ROTARY TELEPHONE */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#201D19] border border-[#3A342B] rounded-xl px-2.5 py-1.5">
              <Phone
                className={`w-3.5 h-3.5 ${
                  phoneMessage ? 'text-amber-400 animate-bounce' : 'text-stone-400'
                }`}
              />
              <span className="text-[11px] font-mono font-bold text-stone-300 hidden sm:inline">
                Rotary Line:
              </span>

              {/* Dial Pad Buttons (1-4 quick dial) */}
              <div className="flex items-center gap-1">
                {['1', '2', '3', '4'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDialDigit(digit)}
                    disabled={isDialing}
                    className={`w-6 h-6 rounded-full text-[11px] font-mono font-bold border transition-all ${
                      isDialing
                        ? 'opacity-50 cursor-not-allowed bg-stone-900 border-stone-800 text-stone-600'
                        : 'bg-[#2A2621] hover:bg-amber-600 hover:text-black border-stone-700 text-stone-300 hover:scale-110 active:scale-90 shadow-sm'
                    }`}
                    title={`Dial line ${digit}`}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              {/* Number display badge */}
              <div className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded border border-stone-800 text-amber-400 font-bold min-w-[32px] text-center">
                {dialedNumber || '---'}
              </div>

              {dialedNumber && (
                <button
                  onClick={handleResetPhone}
                  className="text-stone-400 hover:text-red-400 p-0.5 rounded"
                  title="Hang up phone receiver"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* GADGET 3: HUNTER-CASE POCKET WATCH */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playCipherTick();
                setIsWatchOpen(!isWatchOpen);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#201D19] hover:bg-[#2C2722] border border-[#3A342B] hover:border-amber-600/40 rounded-xl transition-all group"
              title={`Lord Sterling's pocket watch recovered from Case #${caseNumber}`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
              <div className="text-left">
                <div className="text-[11px] font-mono font-bold text-stone-300">
                  {currentTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
                <div className="text-[9px] font-mono text-amber-500/80">
                  {isWatchOpen ? 'Case Opened' : `Case #${caseNumber} Fob`}
                </div>
              </div>
            </button>
          </div>

          {/* GADGET 4: 1940s VINTAGE GRAMOPHONE & JUKEBOX */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.unlock();
                if (atmosphere !== 'off') {
                  sound.setAtmosphere('off');
                } else {
                  sound.setAtmosphere('citypop');
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                atmosphere !== 'off'
                  ? 'bg-amber-950/90 border border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                  : 'bg-[#201D19] hover:bg-[#2C2722] border border-[#3A342B] hover:border-amber-600/50 text-[#C4BCB0]'
              }`}
              title={
                atmosphere !== 'off'
                  ? `Playing: ${currentTrack?.title || atmosphere}. Click to stop music.`
                  : 'Click to spin vinyl on the precinct Gramophone: Japanese City Pop'
              }
            >
              <Disc3
                className={`w-3.5 h-3.5 ${
                  atmosphere !== 'off' ? 'text-amber-400 animate-spin' : 'text-stone-400'
                }`}
                style={{ animationDuration: '4s' }}
              />
              <div className="text-left">
                <div className="text-[11px] leading-tight flex items-center gap-1.5">
                  <span>Gramophone</span>
                  <span
                    className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                      atmosphere !== 'off'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {atmosphere !== 'off' ? 'PLAYING' : 'OFF'}
                  </span>
                </div>
                <div className="text-[9px] text-[#8C8476] font-sans truncate max-w-[110px]">
                  {atmosphere !== 'off'
                    ? currentTrack
                      ? `${currentTrack.flag} ${currentTrack.title}`
                      : atmosphere
                    : 'Spin 78-RPM record'}
                </div>
              </div>
            </button>

            {/* Skip Track Button on Desk */}
            {atmosphere !== 'off' && (
              <button
                type="button"
                onClick={() => {
                  sound.unlock();
                  sound.playCassetteClick();
                  sound.nextTrack();
                }}
                className="p-2 rounded-xl bg-[#201D19] hover:bg-[#2C2722] border border-[#3A342B] text-stone-300 hover:text-white transition-colors"
                title="Skip to next song (Japanese / English / Noir)"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Quick Jukebox Launcher from Desk */}
            {onOpenJukebox && (
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  onOpenJukebox();
                }}
                className="p-2 rounded-xl bg-[#201D19] hover:bg-[#2C2722] border border-[#3A342B] text-amber-400 hover:text-amber-300 transition-colors"
                title="Open Precinct Jukebox Modal"
              >
                <span className="text-xs">📻</span>
              </button>
            )}
          </div>

          {/* GADGET 5: AUDIO SOUND TEST BELL */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.unlock();
                sound.playTestSound();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#201D19] hover:bg-[#2C2722] border border-[#3A342B] hover:border-amber-500/60 text-amber-300 hover:text-amber-100 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Click to test your speaker audio with a crisp 4-tone chime"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Test Audio 🔔</span>
            </button>
          </div>
        </div>

        {/* EXPANDED POCKET WATCH MODAL / DRAWER */}
        {isWatchOpen && (
          <div className="mt-3 pt-3 border-t border-[#302B24] flex items-center justify-between bg-black/40 p-3 rounded-xl">
            <div className="flex items-center gap-4">
              {/* Antique Clock Face Canvas Visual */}
              <div className="relative w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-600 shadow-inner flex items-center justify-center">
                {/* Watch crown */}
                <div className="absolute -top-2 w-3 h-2 bg-amber-700 rounded-t" />
                {/* Watch dial markings */}
                <div className="text-[7px] font-serif font-bold text-stone-800 absolute top-1">
                  XII
                </div>
                <div className="text-[7px] font-serif font-bold text-stone-800 absolute bottom-1">
                  VI
                </div>
                <div className="text-[7px] font-serif font-bold text-stone-800 absolute right-1">
                  III
                </div>
                <div className="text-[7px] font-serif font-bold text-stone-800 absolute left-1">
                  IX
                </div>

                {/* Hour Hand */}
                <div
                  className="absolute w-0.5 h-4 bg-stone-900 origin-bottom bottom-8 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
                />
                {/* Minute Hand */}
                <div
                  className="absolute w-0.5 h-6 bg-stone-700 origin-bottom bottom-8 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ transform: `translateX(-50%) rotate(${minDeg}deg)` }}
                />
                {/* Sweeping Second Hand */}
                <div
                  className="absolute w-[1px] h-6 bg-red-600 origin-bottom bottom-8 left-1/2 -translate-x-1/2"
                  style={{ transform: `translateX(-50%) rotate(${secDeg}deg)` }}
                />
                {/* Center Brass Jewel */}
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 border border-stone-900 z-10" />
              </div>

              <div>
                <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Lord Sterling&apos;s Escapement Chronometer
                </div>
                <div className="text-[11px] text-stone-400 font-sans max-w-sm">
                  18-karat gold hunter-cased pocket watch recovered from the gala crime scene. Its
                  ticking escapement wheel has not lost a single second since the victim fell.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsWatchOpen(false)}
              className="px-2.5 py-1 text-xs font-mono text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg"
            >
              Snap Shut
            </button>
          </div>
        )}

        {/* INCOMING DISPATCH / TELEPHONE RECEIVER POPUP */}
        {phoneMessage && (
          <div className="mt-3 pt-3 border-t border-[#302B24] bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-amber-200">
                    {phoneMessage.caller}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {phoneMessage.badge}
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 font-serif italic mt-1 leading-relaxed">
                  {phoneMessage.text}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetPhone}
              className="text-stone-400 hover:text-amber-300 text-xs font-mono px-2 py-1 bg-stone-900 rounded border border-stone-700 hover:border-amber-600/50"
            >
              Hang Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};
