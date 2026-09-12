import React, { useState, useEffect, useRef } from 'react';
import type { Case, DeductionState, CellState } from '../types/game';
import { generateProceduralCase } from '../utils/proceduralGenerator';
import { sound } from '../audio/soundEffects';
import {
  Moon,
  Flame,
  Coffee,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Briefcase,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface NightShiftViewProps {
  onDeployToDesk: (generatedCase: Case) => void;
  onReturnToDesk: () => void;
}

export const NightShiftView: React.FC<NightShiftViewProps> = ({
  onDeployToDesk,
  onReturnToDesk,
}) => {
  const [shiftLevel, setShiftLevel] = useState<number>(1);
  const [coffeeRations, setCoffeeRations] = useState<number>(3);
  const [nightShiftCase, setNightShiftCase] = useState<Case>(() =>
    generateProceduralCase(101, 'Standard')
  );
  const [localDeduction, setLocalDeduction] = useState<DeductionState>(() => ({
    grid: {},
    notes: '',
    checkedClues: {},
    discoveredHotspots: {},
    hintsUsed: 0,
    xpEarned: 0,
    accusation: { suspectId: null, weaponId: null, locationId: null },
    strikes: 0,
    isSolved: false,
    startTime: Date.now(),
    solvedTime: null,
  }));

  // Ticking Blackout Clock
  const [secondsRemaining, setSecondsRemaining] = useState<number>(150);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  // Selected Accusation inside Night Shift
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [verdictMessage, setVerdictMessage] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  // Start countdown timer
  useEffect(() => {
    if (!isTimerActive || localDeduction.isSolved) return;

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playError();
          return 0;
        }
        if (prev === 30 || prev === 10) {
          sound.playHeartbeat();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, localDeduction.isSolved]);

  // Handle cell click on the mini grid
  const handleGridClick = (key: string) => {
    setLocalDeduction((prev) => {
      const current = prev.grid[key] || null;
      let next: CellState = null;
      if (current === null) next = 'no';
      else if (current === 'no') {
        next = 'yes';
        sound.playCheckmark();
      } else {
        next = null;
        sound.playCross();
      }
      return {
        ...prev,
        grid: { ...prev.grid, [key]: next },
      };
    });
  };

  // Drink Coffee to gain +45 seconds
  const handleDrinkCoffee = () => {
    if (coffeeRations <= 0) return;
    sound.playCassetteClick();
    setCoffeeRations((prev) => prev - 1);
    setSecondsRemaining((prev) => prev + 45);
  };

  // Submit Night Shift Accusation
  const handleAccuse = () => {
    if (!selectedSuspect || !selectedWeapon || !selectedLocation) {
      alert('Select a suspect, weapon, and location before presenting your warrant.');
      return;
    }

    const isCorrect =
      selectedSuspect === nightShiftCase.solution.culpritId &&
      selectedWeapon === nightShiftCase.solution.weaponId &&
      selectedLocation === nightShiftCase.solution.locationId;

    if (isCorrect) {
      sound.playVictory();
      setLocalDeduction((prev) => ({
        ...prev,
        isSolved: true,
        solvedTime: Date.now(),
        xpEarned: prev.xpEarned + 300,
      }));
      setVerdictMessage({
        correct: true,
        text: `SHIFT #${shiftLevel} CLEARED! The perpetrator broke down under cross-examination. +300 XP, +1 Coffee Ration!`,
      });
      setCoffeeRations((prev) => prev + 1);
    } else {
      sound.playError();
      setLocalDeduction((prev) => ({
        ...prev,
        strikes: prev.strikes + 1,
      }));
      setVerdictMessage({
        correct: false,
        text: 'False accusation! You lost 20 precious seconds on the blackout clock!',
      });
      setSecondsRemaining((prev) => Math.max(5, prev - 20));
    }
  };

  // Advance to next procedural night shift case
  const handleNextShift = () => {
    sound.playTypewriter();
    const nextLevel = shiftLevel + 1;
    const diff = nextLevel > 3 ? 'Hardboiled' : nextLevel > 1 ? 'Noir' : 'Standard';
    const nextCase = generateProceduralCase(100 + nextLevel, diff);

    setShiftLevel(nextLevel);
    setNightShiftCase(nextCase);
    setSecondsRemaining(150 - Math.min(60, nextLevel * 10));
    setIsTimerActive(true);
    setSelectedSuspect('');
    setSelectedWeapon('');
    setSelectedLocation('');
    setVerdictMessage(null);
    setLocalDeduction({
      grid: {},
      notes: '',
      checkedClues: {},
      discoveredHotspots: {},
      hintsUsed: 0,
      xpEarned: localDeduction.xpEarned,
      accusation: { suspectId: null, weaponId: null, locationId: null },
      strikes: 0,
      isSolved: false,
      startTime: Date.now(),
      solvedTime: null,
    });
  };

  const timerColor =
    secondsRemaining < 25
      ? 'text-red-500 animate-pulse'
      : secondsRemaining < 60
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181512] border border-[#352F27] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTypewriter();
              onReturnToDesk();
            }}
            className="p-2 bg-[#25211B] hover:bg-[#342D24] text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Desk</span>
          </button>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400 animate-pulse" />
              The Night Shift • Endless Roguelike Mode
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Procedural infinite cases generated on demand with ticking blackout modifiers. Clear
              as many shifts as your brain can handle.
            </p>
          </div>
        </div>

        {/* Roguelike Shift Badges */}
        <div className="flex items-center gap-2">
          {/* Shift Level Counter */}
          <div className="bg-[#241B2D] border border-indigo-700/60 px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-stone-300">Shift:</span>
            <span className="font-bold text-indigo-300 text-sm">#{shiftLevel}</span>
          </div>

          {/* Coffee Rations Consumable */}
          <button
            onClick={handleDrinkCoffee}
            disabled={coffeeRations <= 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              coffeeRations > 0
                ? 'bg-amber-950/60 hover:bg-amber-900 border-amber-600/70 text-amber-200 hover:scale-105 active:scale-95'
                : 'bg-stone-900 border-stone-800 text-stone-600 cursor-not-allowed'
            }`}
            title="Drink hot coffee to gain +45 seconds on the blackout timer"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Coffee: {coffeeRations}</span>
          </button>

          {/* Blackout Clock */}
          <div className="bg-black/60 border border-stone-800 px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${timerColor}`} />
            <span className={`font-bold ${timerColor}`}>
              {Math.floor(secondsRemaining / 60)}:
              {(secondsRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE PROCEDURAL CASE CARD */}
      <div className="bg-[#171412] border-2 border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2D2721] pb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-2">
              <span>{nightShiftCase.date}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {nightShiftCase.difficulty}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#FAF6F0] mt-1">
              {nightShiftCase.title}
            </h3>
            <p className="text-xs text-stone-300 font-serif italic mt-1 leading-relaxed max-w-2xl">
              {nightShiftCase.incidentReport}
            </p>
          </div>

          <button
            onClick={() => onDeployToDesk(nightShiftCase)}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
          >
            <Briefcase className="w-4 h-4" />
            <span>Deploy to Main Desk</span>
          </button>
        </div>

        {/* 3 LINEUP CARDS (SUSPECTS, WEAPONS, LOCATIONS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Suspects */}
          <div className="bg-[#1C1814] border border-[#383025] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              Suspects Lineup
            </h4>
            {nightShiftCase.suspects.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSuspect(s.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedSuspect === s.id
                    ? 'bg-red-950/80 border-red-500 text-red-100 shadow-md scale-102'
                    : 'bg-[#25201B] border-stone-800 hover:border-stone-600 text-stone-300'
                }`}
              >
                <div className="text-2xl">{s.avatarEmoji}</div>
                <div>
                  <div className="font-serif font-bold text-sm text-stone-200">{s.name}</div>
                  <div className="text-[10px] font-mono text-stone-400 italic">&quot;{s.alias}&quot;</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weapons */}
          <div className="bg-[#1C1814] border border-[#383025] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              Possible Weapons
            </h4>
            {nightShiftCase.weapons.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWeapon(w.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedWeapon === w.id
                    ? 'bg-red-950/80 border-red-500 text-red-100 shadow-md scale-102'
                    : 'bg-[#25201B] border-stone-800 hover:border-stone-600 text-stone-300'
                }`}
              >
                <div className="text-2xl">{w.icon}</div>
                <div>
                  <div className="font-serif font-bold text-sm text-stone-200">{w.name}</div>
                  <div className="text-[10px] font-mono text-amber-500 uppercase">{w.category}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Locations */}
          <div className="bg-[#1C1814] border border-[#383025] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-1">
              Crime Scenes
            </h4>
            {nightShiftCase.locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  selectedLocation === loc.id
                    ? 'bg-red-950/80 border-red-500 text-red-100 shadow-md scale-102'
                    : 'bg-[#25201B] border-stone-800 hover:border-stone-600 text-stone-300'
                }`}
              >
                <div className="text-2xl">{loc.icon}</div>
                <div>
                  <div className="font-serif font-bold text-sm text-stone-200">{loc.name}</div>
                  <div className="text-[10px] font-mono text-stone-400 truncate max-w-[150px]">
                    {loc.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOVERED CLUES DOSSIER */}
        <div className="bg-[#14110F] border border-[#322A20] rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Recovered Clues & Forensic Intercepts</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {nightShiftCase.clues.map((clue, idx) => (
              <div
                key={clue.id}
                className="bg-[#1D1914] border border-stone-800 p-2.5 rounded-xl flex items-start gap-2 text-xs font-serif italic text-stone-300"
              >
                <span className="font-mono text-[10px] bg-stone-800 text-amber-400 px-1.5 py-0.5 rounded font-bold not-italic">
                  #{idx + 1}
                </span>
                <span>&quot;{clue.text}&quot;</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK MINI DEDUCTION MATRIX */}
        <div className="bg-[#191512] border border-[#332B21] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Quick Logic Matrix (Click: Blank ➔ ✗ ➔ ✓)
            </h4>
            <span className="text-[11px] font-mono text-stone-400">
              Cross-reference Suspects vs Weapons
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400">
                  <th className="text-left p-2">Suspect</th>
                  {nightShiftCase.weapons.map((w) => (
                    <th key={w.id} className="p-2">
                      {w.icon} {w.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nightShiftCase.suspects.map((s) => (
                  <tr key={s.id} className="border-b border-stone-800/50">
                    <td className="text-left p-2 font-serif font-bold text-stone-300">{s.name}</td>
                    {nightShiftCase.weapons.map((w) => {
                      const key = `suspect:${s.id}-weapon:${w.id}`;
                      const state = localDeduction.grid[key] || null;
                      return (
                        <td key={w.id} className="p-1">
                          <button
                            onClick={() => handleGridClick(key)}
                            className={`w-8 h-8 rounded-lg font-bold border transition-all ${
                              state === 'yes'
                                ? 'bg-emerald-600 border-emerald-400 text-white'
                                : state === 'no'
                                ? 'bg-red-950 border-red-800 text-red-400'
                                : 'bg-[#221D18] border-stone-800 text-stone-600 hover:border-stone-600'
                            }`}
                          >
                            {state === 'yes' ? '✓' : state === 'no' ? '✗' : ''}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VERDICT AND ACCUSATION PANEL */}
        {verdictMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between gap-4 animate-fadeIn ${
              verdictMessage.correct
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {verdictMessage.correct ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{verdictMessage.text}</span>
            </div>

            {verdictMessage.correct && (
              <button
                onClick={handleNextShift}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0 transition-transform hover:scale-105"
              >
                Next Shift ➔
              </button>
            )}
          </div>
        )}

        {/* ACCUSE SUBMIT BAR */}
        {!localDeduction.isSolved && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs font-mono text-stone-400">
              Warrant Draft: Suspect [
              <span className="text-white font-bold">{selectedSuspect || 'NONE'}</span>] • Weapon [
              <span className="text-white font-bold">{selectedWeapon || 'NONE'}</span>] • Scene [
              <span className="text-white font-bold">{selectedLocation || 'NONE'}</span>]
            </div>

            <button
              onClick={handleAccuse}
              disabled={secondsRemaining <= 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 border border-red-500/40 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign Interrogation Warrant</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
