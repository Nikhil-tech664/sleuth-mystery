import React, { useState } from 'react';
import type { Case } from '../types/game';
import { 
  FlaskConical, 
  Search, 
  Radio, 
  Activity, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  CheckCircle
} from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface ForensicsLabViewProps {
  currentCase: Case;
  onReturnToDesk: () => void;
  onLogNote: (note: string) => void;
}

type LabStation = 'microscope' | 'chemistry' | 'ballistics' | 'wiretap';

export const ForensicsLabView: React.FC<ForensicsLabViewProps> = ({
  currentCase,
  onReturnToDesk,
  onLogNote,
}) => {
  const [activeStation, setActiveStation] = useState<LabStation>('microscope');

  // Station 1: Microscope State
  const [magnification, setMagnification] = useState<number>(40);
  const [selectedSuspectIdx, setSelectedSuspectIdx] = useState<number>(0);

  // Station 2: Chemistry State
  const [testedTubes, setTestedTubes] = useState<Record<number, { color: string; result: string }>>({});

  // Station 3: Ballistics State
  const [lightboxMode, setLightboxMode] = useState<'xray' | 'rifling'>('xray');
  const [striationAligned, setStriationAligned] = useState<boolean>(false);

  // Station 4: Cassette Wiretap State
  const [isPlayingTape, setIsPlayingTape] = useState<boolean>(false);
  const [tapeCounter, setTapeCounter] = useState<number>(142);

  const selectedSuspect = currentCase.suspects[selectedSuspectIdx] || currentCase.suspects[0];

  // Chemistry pipette test
  const handleTestTube = (tubeIdx: number, reagent: 'luminol' | 'cyanide' | 'nitrate') => {
    sound.playBubbling();

    let color = '#38BDF8';
    let result = 'POSITIVE: Iron / Hemoglobin Detected';
    if (reagent === 'cyanide') {
      color = '#C084FC';
      result = 'POSITIVE: Bitter Almond / Cyanide Toxin Detected';
    } else if (reagent === 'nitrate') {
      color = '#FACC15';
      result = 'POSITIVE: Nitrate / Smokeless Cordite Residue';
    }

    setTestedTubes((prev) => ({
      ...prev,
      [tubeIdx]: { color, result },
    }));

    onLogNote(`[Lab Test Tube #${tubeIdx + 1}]: Tested with ${reagent.toUpperCase()} reagent -> ${result}`);
  };

  // Tape playback toggle
  const handleToggleTape = () => {
    sound.playCassetteClick();
    if (!isPlayingTape) {
      sound.playTapeWobble();
      setIsPlayingTape(true);
      setTapeCounter((c) => c + 15);
    } else {
      setIsPlayingTape(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Return Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2822] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              onReturnToDesk();
            }}
            className="p-2 rounded-xl bg-[#221F1C] border border-[#3A352F] hover:bg-[#2F2A25] text-[#D8CFBF] hover:text-[#FAF7F2] transition-colors flex items-center gap-1 text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Desk</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-serif text-[#FAF6F0] tracking-wide">
                Scotland Yard Forensic Crime Lab
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-500/40">
                STATION ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#8C8478] font-sans">
              Advanced scientific evidence analysis for Case #{currentCase.caseNumber}: "{currentCase.title}"
            </p>
          </div>
        </div>

        {/* Station Navigation Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#171513] p-1.5 rounded-xl border border-[#332E28]">
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveStation('microscope');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeStation === 'microscope'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'text-[#AAA194] hover:bg-[#24201C] hover:text-[#FAF7F2]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Microscope</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveStation('chemistry');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeStation === 'chemistry'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'text-[#AAA194] hover:bg-[#24201C] hover:text-[#FAF7F2]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Chemistry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveStation('ballistics');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeStation === 'ballistics'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'text-[#AAA194] hover:bg-[#24201C] hover:text-[#FAF7F2]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Ballistics / X-Ray</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setActiveStation('wiretap');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeStation === 'wiretap'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'text-[#AAA194] hover:bg-[#24201C] hover:text-[#FAF7F2]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Wiretap Cassette</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          STATION 1: MICROSCOPE RIDGE SCANNER
         ========================================================= */}
      {activeStation === 'microscope' && (
        <div className="rounded-2xl border-2 border-[#38322B] bg-[#141210] p-6 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#2C2722] pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#FAF6F0] flex items-center gap-2">
                <span>Dual-Lens Optical Comparator</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#271E10] text-amber-400 font-mono border border-amber-600/40">
                  MAGNIFICATION {magnification}X
                </span>
              </h3>
              <p className="text-xs text-[#8C8478] font-sans mt-0.5">
                Adjust magnification and compare crime scene latent ridges against precinct suspect biometric cards.
              </p>
            </div>

            {/* Suspect Selector Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#AAA194]">Subject:</span>
              <div className="flex gap-1 bg-[#1E1B17] p-1 rounded-xl border border-[#332E28]">
                {currentCase.suspects.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setSelectedSuspectIdx(idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedSuspectIdx === idx
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-[#AAA194] hover:text-[#FAF7F2]'
                    }`}
                  >
                    {s.avatarEmoji} {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CRT Lens Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Lens: Crime Scene Lifted Print */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-[#06120B] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute top-3 left-3 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-emerald-400 border border-emerald-600/40 uppercase font-bold">
                LENS A: CRIME SCENE LATENT LIFT
              </div>
              <div
                style={{ transform: `scale(${0.8 + magnification / 80})` }}
                className="w-44 h-44 rounded-full border-4 border-emerald-400/60 bg-[#021A0C] flex flex-col items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-transform duration-200 relative my-4"
              >
                <div className="text-6xl select-none animate-pulse">🖐️</div>
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/80 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 w-full h-[1px] bg-emerald-500/40 pointer-events-none" />
                <div className="absolute left-1/2 h-full w-[1px] bg-emerald-500/40 pointer-events-none" />
              </div>
              <div className="text-xs font-mono text-emerald-300 font-bold tracking-wider">
                Pattern: {currentCase.hotspots?.[0]?.fingerprintPattern || 'Loop'} Ridge Formation
              </div>
            </div>

            {/* Right Lens: Selected Suspect Biometric File */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-[#120F08] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute top-3 left-3 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-amber-400 border border-amber-600/40 uppercase font-bold">
                LENS B: SUSPECT {selectedSuspect.name.toUpperCase()}
              </div>
              <div
                style={{ transform: `scale(${0.8 + magnification / 80})` }}
                className="w-44 h-44 rounded-full border-4 border-amber-400/60 bg-[#1E1606] flex flex-col items-center justify-center text-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-transform duration-200 relative my-4 overflow-hidden"
              >
                {selectedSuspect.portraitUrl ? (
                  <img
                    src={selectedSuspect.portraitUrl}
                    alt={selectedSuspect.name}
                    className="w-full h-full object-cover object-top filter contrast-125 sepia-[0.25]"
                  />
                ) : (
                  <div className="text-6xl select-none">{selectedSuspect.avatarEmoji}</div>
                )}
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/80 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 w-full h-[1px] bg-amber-500/40 pointer-events-none" />
                <div className="absolute left-1/2 h-full w-[1px] bg-amber-500/40 pointer-events-none" />
              </div>
              <div className="text-xs font-mono text-amber-300 font-bold tracking-wider">
                Pattern: {selectedSuspect.fingerprintPattern || 'Whorl'} Ridge Formation
              </div>
            </div>
          </div>

          {/* Controls: Zoom Slider & Log Note */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#2A2520]">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-[#AAA194]">Zoom:</span>
              <input
                type="range"
                min="20"
                max="80"
                value={magnification}
                onChange={(e) => setMagnification(Number(e.target.value))}
                className="w-48 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 font-bold">{magnification}X</span>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playStamp();
                onLogNote(
                  `[Microscope Comparison]: Compared crime scene latent print against ${selectedSuspect.name} (${selectedSuspect.fingerprintPattern} ridge pattern).`
                );
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#C69214] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Record Observation in Notebook</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STATION 2: CHEMICAL REAGENT SPECTROMETRY
         ========================================================= */}
      {activeStation === 'chemistry' && (
        <div className="rounded-2xl border-2 border-[#38322B] bg-[#141210] p-6 shadow-2xl space-y-6">
          <div className="border-b border-[#2C2722] pb-4">
            <h3 className="text-lg font-bold font-serif text-[#FAF6F0] flex items-center gap-2">
              <span>Chemical Reagent Spectrometry Table</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/40">
                REAGENT DROPPERS
              </span>
            </h3>
            <p className="text-xs text-[#8C8478] font-sans mt-0.5">
              Pipette chemical indicator solutions into suspect evidence vials to observe catalytic color luminescence.
            </p>
          </div>

          {/* Pipette Reagents Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-900/60 border border-cyan-400 text-cyan-200 flex items-center justify-center text-xl">
                🧪
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-cyan-300">Luminol + Peroxide</div>
                <div className="text-[11px] text-[#8C8478]">Tests for Iron / Hemoglobin (Blue)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-purple-400 text-purple-200 flex items-center justify-center text-xl">
                🧪
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-purple-300">Prussian Iron Salt</div>
                <div className="text-[11px] text-[#8C8478]">Tests for Cyanide Toxin (Purple)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-yellow-500/40 bg-yellow-950/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-900/60 border border-yellow-400 text-yellow-200 flex items-center justify-center text-xl">
                🧪
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-yellow-300">Silver Nitrate Acid</div>
                <div className="text-[11px] text-[#8C8478]">Tests for Gunpowder / Cordite (Yellow)</div>
              </div>
            </div>
          </div>

          {/* Test Tubes Rack */}
          <div className="bg-[#0C0B0A] border-2 border-[#2F2922] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
            {[0, 1, 2].map((idx) => {
              const testInfo = testedTubes[idx];
              const weaponRef = currentCase.weapons[idx] || currentCase.weapons[0];
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-mono text-[#AAA194] uppercase font-bold">
                    Vial #{idx + 1}: {weaponRef.name}
                  </span>

                  {/* Test Tube Graphic */}
                  <div className="relative w-14 h-48 rounded-b-full border-4 border-stone-400/40 bg-[#171513] overflow-hidden flex flex-col justify-end p-1 shadow-inner">
                    {testInfo ? (
                      <div
                        style={{
                          backgroundColor: testInfo.color,
                          boxShadow: `0 0 25px ${testInfo.color}`,
                        }}
                        className="w-full h-32 rounded-b-full opacity-80 animate-pulse transition-all duration-500 flex items-center justify-center text-xs font-black text-black"
                      >
                        REACTIVE
                      </div>
                    ) : (
                      <div className="w-full h-16 rounded-b-full bg-stone-800/40" />
                    )}
                  </div>

                  {/* Dropper Triggers */}
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestTube(idx, 'luminol')}
                      className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-[10px] font-mono font-bold"
                    >
                      +Luminol
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestTube(idx, 'cyanide')}
                      className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700/60 text-[10px] font-mono font-bold"
                    >
                      +Cyanide
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestTube(idx, 'nitrate')}
                      className="px-2 py-1 rounded bg-yellow-950 hover:bg-yellow-900 text-yellow-300 border border-yellow-700/60 text-[10px] font-mono font-bold"
                    >
                      +Nitrate
                    </button>
                  </div>

                  {testInfo && (
                    <div className="text-[11px] font-mono text-emerald-400 max-w-[180px] leading-tight font-bold">
                      {testInfo.result}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          STATION 3: BALLISTICS & AUTOPSY LIGHTBOX
         ========================================================= */}
      {activeStation === 'ballistics' && (
        <div className="rounded-2xl border-2 border-[#38322B] bg-[#141210] p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C2722] pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#FAF6F0] flex items-center gap-2">
                <span>Pathology & Ballistics Lightbox</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/40">
                  ILLUMINATED X-RAY
                </span>
              </h3>
              <p className="text-xs text-[#8C8478] font-sans mt-0.5">
                Examine skeletal trauma radiography and microscopic firearm barrel rifling grooves.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setLightboxMode('xray');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  lightboxMode === 'xray'
                    ? 'bg-[#C69214] text-black shadow-md'
                    : 'bg-[#221F1C] text-[#AAA194] hover:text-[#FAF7F2]'
                }`}
              >
                Cranial X-Ray
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setLightboxMode('rifling');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  lightboxMode === 'rifling'
                    ? 'bg-[#C69214] text-black shadow-md'
                    : 'bg-[#221F1C] text-[#AAA194] hover:text-[#FAF7F2]'
                }`}
              >
                Bullet Striations
              </button>
            </div>
          </div>

          {/* Lightbox Frame */}
          <div className="rounded-2xl border-4 border-stone-800 bg-[#070A0F] p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] shadow-[0_0_50px_rgba(2,132,199,0.15)]">
            {lightboxMode === 'xray' ? (
              <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-36 h-36 rounded-full border-2 border-cyan-400/40 bg-cyan-950/30 flex items-center justify-center text-6xl shadow-[0_0_35px_rgba(6,182,212,0.3)]">
                  💀
                </div>
                <div className="bg-black/80 px-4 py-2 rounded-xl border border-cyan-500/40 font-mono text-xs text-cyan-200 max-w-md">
                  <span className="text-cyan-400 font-bold block mb-1">
                    AUTOPSY SCAN REPORT: {currentCase.victim.name.toUpperCase()}
                  </span>
                  "Radiograph reveals focal trauma consistent with {currentCase.weapons[0]?.category} impact. Cause of death confirmed in police coroner file."
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 font-mono text-xs text-[#DDD5C7]">
                    <span className="text-amber-400 font-bold block mb-1">EVIDENCE BULLET #1</span>
                    6 Grooves • Right Hand Twist
                  </div>
                  <div className="text-2xl text-[#C69214]">↔</div>
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 font-mono text-xs text-[#DDD5C7]">
                    <span className="text-emerald-400 font-bold block mb-1">TEST FIRE CARTRIDGE</span>
                    6 Grooves • Right Hand Twist
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playVictory();
                    setStriationAligned(true);
                  }}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                    striationAligned
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#C69214] hover:bg-amber-400 text-black'
                  }`}
                >
                  {striationAligned ? 'STRIATIONS 100% ALIGNED (MATCH)' : 'Align Striation Comparator'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          STATION 4: AUDIO WIRETAP CASSETTE DECK
         ========================================================= */}
      {activeStation === 'wiretap' && (
        <div className="rounded-2xl border-2 border-[#38322B] bg-[#141210] p-6 shadow-2xl space-y-6">
          <div className="border-b border-[#2C2722] pb-4">
            <h3 className="text-lg font-bold font-serif text-[#FAF6F0] flex items-center gap-2">
              <span>Nagra Magnetophon Wiretap Deck</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono border border-amber-500/40">
                ANALOG MAGNETIC TAPE
              </span>
            </h3>
            <p className="text-xs text-[#8C8478] font-sans mt-0.5">
              Listen to intercepted precinct radio dispatches and surveillance wiretaps recovered from the suspect perimeter.
            </p>
          </div>

          {/* Physical Cassette Machine Visual */}
          <div className="rounded-2xl border-4 border-[#332A1D] bg-[#19150F] p-6 flex flex-col items-center shadow-2xl">
            {/* Reel Spools */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div
                className={`w-28 h-28 rounded-full border-4 border-amber-600/60 bg-[#120E08] flex items-center justify-center text-amber-400 shadow-inner ${
                  isPlayingTape ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-black flex items-center justify-center text-xs font-mono font-bold">
                  REEL A
                </div>
              </div>

              {/* Tape Window Counter */}
              <div className="bg-black border-2 border-[#4A3D29] px-4 py-2 rounded-lg font-mono text-xl font-bold text-amber-400 tracking-widest shadow-inner">
                {String(tapeCounter).padStart(4, '0')}
              </div>

              <div
                className={`w-28 h-28 rounded-full border-4 border-amber-600/60 bg-[#120E08] flex items-center justify-center text-amber-400 shadow-inner ${
                  isPlayingTape ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-black flex items-center justify-center text-xs font-mono font-bold">
                  REEL B
                </div>
              </div>
            </div>

            {/* VU Meter Bars */}
            <div className="flex items-center gap-1.5 w-full max-w-xs mb-6">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`h-6 flex-1 rounded-sm transition-all duration-75 ${
                    isPlayingTape && i < ((i * 7 + 3) % 13) + 2
                      ? i > 12
                        ? 'bg-red-500'
                        : i > 8
                        ? 'bg-yellow-400'
                        : 'bg-emerald-400'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>

            {/* Transport Control Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playCassetteClick();
                  setTapeCounter(0);
                }}
                className="p-3 rounded-xl bg-[#292217] border border-[#443723] hover:bg-[#382E1E] text-[#D8CFBF] transition-colors"
                title="Rewind Tape"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleToggleTape}
                className={`px-6 py-3 rounded-xl font-mono text-sm font-bold flex items-center gap-2 transition-all ${
                  isPlayingTape
                    ? 'bg-red-700 text-white shadow-lg animate-pulse'
                    : 'bg-[#C69214] hover:bg-amber-400 text-black shadow-md'
                }`}
              >
                {isPlayingTape ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlayingTape ? 'STOP TAPE' : 'PLAY WIRETAP'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Log */}
          <div className="bg-[#100E0C] border border-[#2E2822] rounded-xl p-4 font-mono text-xs text-[#DDD5C7] leading-relaxed space-y-2">
            <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Surveillance Audio Wiretap Log — 23:42:09 GMT</span>
            </div>
            <p className="text-stone-300">
              <strong className="text-amber-300">[DISPATCH 12]:</strong> "All units on sector duty: perimeter lights cut off at the manor. Suspects sighted near the east wing."
            </p>
            <p className="text-stone-300">
              <strong className="text-cyan-300">[DETECTIVE CALL]:</strong> "Investigating officer confirms victim down. No pulse. Collect all fingerprints and lock the library doors immediately."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
