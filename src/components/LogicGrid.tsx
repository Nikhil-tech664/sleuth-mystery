import React from 'react';
import type { Suspect, Weapon, Location, CellState } from '../types/game';
import {
  Grid,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Undo2,
  Redo2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { haptic } from '../utils/haptics';

interface LogicGridProps {
  suspects: Suspect[];
  weapons: Weapon[];
  locations: Location[];
  grid: Record<string, CellState>;
  onCellClick: (key: string) => void;
  onResetGrid: () => void;
  onAutoFillExclusions: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const LogicGrid: React.FC<LogicGridProps> = ({
  suspects,
  weapons,
  locations,
  grid,
  onCellClick,
  onResetGrid,
  onAutoFillExclusions,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const [comboStreak, setComboStreak] = React.useState<number>(0);
  const streakTimerRef = React.useRef<number | null>(null);

  const [isIntuitionActive, setIsIntuitionActive] = React.useState<boolean>(true);
  const [isHighContrast, setIsHighContrast] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('sleuth_high_contrast_v1') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleHighContrast = () => {
    sound.playTypewriter();
    haptic.tap();
    const next = !isHighContrast;
    setIsHighContrast(next);
    try {
      localStorage.setItem('sleuth_high_contrast_v1', String(next));
    } catch {}
  };

  const handleToggleIntuition = () => {
    sound.playTypewriter();
    haptic.tap();
    setIsIntuitionActive(!isIntuitionActive);
  };

  const getCellKey = (catA: string, idA: string, catB: string, idB: string) => {
    return `${catA}:${idA}-${catB}:${idB}`;
  };

  // Detective's Intuition: Contradiction Detection Engine
  const conflicts = React.useMemo(() => {
    if (!isIntuitionActive) return new Set<string>();
    const set = new Set<string>();

    const checkBlock = (
      catA: string,
      itemsA: { id: string }[],
      catB: string,
      itemsB: { id: string }[]
    ) => {
      itemsA.forEach((a) => {
        const matchedB = itemsB.filter(
          (b) =>
            grid[`${catA}:${a.id}-${catB}:${b.id}`] === 'yes' ||
            grid[`${catB}:${b.id}-${catA}:${a.id}`] === 'yes'
        );
        if (matchedB.length > 1) {
          matchedB.forEach((b) => {
            set.add(`${catA}:${a.id}-${catB}:${b.id}`);
            set.add(`${catB}:${b.id}-${catA}:${a.id}`);
          });
        }
      });

      itemsB.forEach((b) => {
        const matchedA = itemsA.filter(
          (a) =>
            grid[`${catA}:${a.id}-${catB}:${b.id}`] === 'yes' ||
            grid[`${catB}:${b.id}-${catA}:${a.id}`] === 'yes'
        );
        if (matchedA.length > 1) {
          matchedA.forEach((a) => {
            set.add(`${catA}:${a.id}-${catB}:${b.id}`);
            set.add(`${catB}:${b.id}-${catA}:${a.id}`);
          });
        }
      });
    };

    checkBlock('suspect', suspects, 'weapon', weapons);
    checkBlock('suspect', suspects, 'location', locations);
    checkBlock('location', locations, 'weapon', weapons);

    return set;
  }, [grid, suspects, weapons, locations, isIntuitionActive]);

  const renderCell = (catA: string, idA: string, catB: string, idB: string) => {
    const key = getCellKey(catA, idA, catB, idB);
    const value = grid[key] || null;
    const isConflict = conflicts.has(key);

    let content = null;
    let bgStyle = isHighContrast
      ? 'bg-black hover:bg-stone-900 text-transparent border-stone-600'
      : 'bg-[#1C1A18] hover:bg-[#2B2723] text-transparent';

    if (value === 'no') {
      content = '✕';
      bgStyle = isHighContrast
        ? 'bg-stone-950 border-2 border-dashed border-red-400 text-red-400 font-black'
        : 'bg-red-950/40 hover:bg-red-950/60 text-red-500 font-bold';
    } else if (value === 'yes') {
      content = isHighContrast ? '★' : '✓';
      bgStyle = isHighContrast
        ? 'bg-amber-400 text-black font-black border-2 border-white shadow-lg'
        : 'bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-400 font-black shadow-inner';
    }

    if (isConflict) {
      bgStyle =
        'bg-red-900/90 border-2 border-red-500 text-white font-black animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]';
      content = '⚠️';
    }

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          const nextStreak = comboStreak + 1;
          setComboStreak(nextStreak);
          if (streakTimerRef.current) window.clearTimeout(streakTimerRef.current);
          streakTimerRef.current = window.setTimeout(() => setComboStreak(0), 7000);

          if (value === null) {
            sound.playCross();
            haptic.tap();
            if (nextStreak >= 2) sound.playComboChime(nextStreak);
          } else if (value === 'no') {
            sound.playCheckmark();
            haptic.confirm();
            if (nextStreak >= 2) sound.playComboChime(nextStreak + 1);
          } else {
            sound.playTypewriter();
            haptic.tap();
          }
          onCellClick(key);
        }}
        className={`w-10 h-10 md:w-12 md:h-12 border border-[#332F2A] flex items-center justify-center text-sm md:text-base transition-all select-none cursor-pointer ${bgStyle}`}
        title={
          isConflict
            ? 'CONTRADICTION DETECTED! This cell conflicts with another confirmed mark.'
            : 'Tap to toggle: Empty → ✕ (Eliminated) → ✓ (Confirmed)'
        }
      >
        {content}
      </button>
    );
  };

  return (
    <div className="rounded-xl border border-[#3A352F] bg-[#171513] p-5 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2621] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#C69214]" />
            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#FAF6F0] font-mono">
              The Sleuth Logic Matrix
            </h3>
            {comboStreak >= 2 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-mono font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse flex items-center gap-1">
                <span>🔥</span>
                <span>COMBO x{comboStreak}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#8C8478] font-sans mt-0.5">
            Cross-reference Suspects, Weapons, and Locations. Tap cells to eliminate or confirm.
          </p>
        </div>

        {/* Legend & Tool actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Undo / Redo controls */}
          <div className="flex items-center gap-1 bg-[#11100E] border border-[#2B2723] rounded-lg p-1">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo last mark (Ctrl+Z)"
              className={`p-1.5 rounded transition-colors ${
                canUndo
                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                  : 'text-stone-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo move (Ctrl+Y)"
              className={`p-1.5 rounded transition-colors ${
                canRedo
                  ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                  : 'text-stone-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* High Contrast / Accessibility Mode */}
          <button
            type="button"
            onClick={handleToggleHighContrast}
            title={
              isHighContrast
                ? 'High Contrast Mode: Active. Click to return to Noir theme.'
                : 'Enable High-Contrast / Colorblind Friendly Mode'
            }
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-mono ${
              isHighContrast
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-[#221F1C] border-[#38332B] hover:bg-[#2C2824] text-[#8C8478]'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Detective Intuition Contradiction detector toggle */}
          <button
            type="button"
            onClick={handleToggleIntuition}
            title={
              isIntuitionActive
                ? "Detective's Intuition: ACTIVE (Flags contradictory marks). Click to turn off."
                : "Enable Detective's Intuition (Auto-detect contradictions)"
            }
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-mono ${
              isIntuitionActive
                ? conflicts.size > 0
                  ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
                  : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
                : 'bg-[#221F1C] border-[#38332B] hover:bg-[#2C2824] text-[#8C8478]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {conflicts.size > 0 && (
              <span className="text-[10px] font-bold px-1 rounded bg-red-600 text-white">
                {Math.ceil(conflicts.size / 2)}
              </span>
            )}
          </button>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[11px] font-mono bg-[#11100E] border border-[#2B2723] rounded-lg px-2.5 py-1 text-[#AAA194]">
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 border border-[#38332B] rounded flex items-center justify-center text-[10px] text-red-500 font-bold bg-red-950/40">
                ✕
              </span>
              No
            </span>
            <span className="text-[#4B443B]">|</span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 border border-[#38332B] rounded flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-950/60">
                {isHighContrast ? '★' : '✓'}
              </span>
              Yes
            </span>
          </div>

          {/* Auto-fill exclusions helper */}
          <button
            onClick={() => {
              sound.playTypewriter();
              haptic.confirm();
              onAutoFillExclusions();
            }}
            title="Auto-fill ✕ for row & column where ✓ is placed"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#24211D] border border-[#3A352F] hover:border-amber-500/50 hover:bg-[#2F2B26] text-amber-300 font-mono transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Fill ✕</span>
          </button>

          {/* Reset Grid */}
          <button
            onClick={() => {
              sound.playTypewriter();
              haptic.tap();
              onResetGrid();
            }}
            title="Clear all grid marks"
            className="p-1.5 rounded-lg bg-[#221F1C] border border-[#38332B] hover:bg-[#2C2824] text-[#8C8478] hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contradiction Alert Notification */}
      {conflicts.size > 0 && (
        <div className="mb-4 px-3 py-2 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>Detective’s Intuition Alert:</strong> Contradictory marks detected! Review
              the flashing red cells.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-800 text-white">
            {Math.ceil(conflicts.size / 2)} ISSUES
          </span>
        </div>
      )}

      {/* Logic Grid Table */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-max">
          {/* Table Header: Column Categories */}
          <div className="flex items-end">
            {/* Corner Placeholder */}
            <div className="w-32 md:w-44 shrink-0 p-2 text-right text-[11px] font-mono text-[#787166]">
              Suspects ↓
            </div>

            {/* Column Block 1: Weapons */}
            <div className="border-l-2 border-[#C69214]/60">
              <div className="bg-[#242019] text-[#C69214] text-[10px] font-mono uppercase font-bold text-center py-1 border-b border-[#3A352F]">
                Weapons
              </div>
              <div className="flex">
                {weapons.map((w) => (
                  <div
                    key={w.id}
                    className="w-10 h-24 md:w-12 md:h-28 border-r border-[#332F2A] flex flex-col justify-end p-1 text-center bg-[#151412]"
                    title={w.name}
                  >
                    <span className="text-base mb-1">{w.icon}</span>
                    <span className="text-[10px] md:text-xs font-mono text-[#DDD5C7] leading-tight break-words line-clamp-2">
                      {w.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Block 2: Locations */}
            <div className="border-l-2 border-[#C69214]/60">
              <div className="bg-[#242019] text-[#C69214] text-[10px] font-mono uppercase font-bold text-center py-1 border-b border-[#3A352F]">
                Locations
              </div>
              <div className="flex">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="w-10 h-24 md:w-12 md:h-28 border-r border-[#332F2A] flex flex-col justify-end p-1 text-center bg-[#151412]"
                    title={loc.name}
                  >
                    <span className="text-base mb-1">{loc.icon}</span>
                    <span className="text-[10px] md:text-xs font-mono text-[#DDD5C7] leading-tight break-words line-clamp-2">
                      {loc.name.split(' ').slice(-1)[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Rows: Suspects */}
          <div className="border-t-2 border-[#C69214]/60">
            {suspects.map((suspect) => (
              <div key={suspect.id} className="flex items-center">
                {/* Row Header: Suspect */}
                <div className="w-32 md:w-44 shrink-0 h-10 md:h-12 border-b border-[#2C2823] px-2 flex items-center justify-end gap-2 bg-[#171513]">
                  <div className="text-right truncate min-w-0">
                    <div className="text-xs md:text-sm font-bold text-[#F5EFEB] font-serif truncate">
                      {suspect.name.split(' ').slice(-1)[0]}
                    </div>
                    <div className="text-[10px] font-mono text-[#C69214] truncate">
                      {suspect.alias}
                    </div>
                  </div>
                  <span className="text-lg shrink-0">{suspect.avatarEmoji}</span>
                </div>

                {/* Cells: Suspect x Weapons */}
                <div className="flex border-l-2 border-[#C69214]/60">
                  {weapons.map((w) => (
                    <React.Fragment key={w.id}>
                      {renderCell('suspect', suspect.id, 'weapon', w.id)}
                    </React.Fragment>
                  ))}
                </div>

                {/* Cells: Suspect x Locations */}
                <div className="flex border-l-2 border-[#C69214]/60">
                  {locations.map((loc) => (
                    <React.Fragment key={loc.id}>
                      {renderCell('suspect', suspect.id, 'location', loc.id)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sub-grid Section: Locations vs Weapons */}
          <div className="flex items-start mt-1 pt-1 border-t-2 border-[#C69214]/60">
            {/* Row Headers for Locations */}
            <div className="w-32 md:w-44 shrink-0">
              <div className="bg-[#242019] text-[#C69214] text-[10px] font-mono uppercase font-bold text-right pr-2 py-1 border-b border-[#3A352F]">
                Locations ↓
              </div>
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="h-10 md:h-12 border-b border-[#2C2823] px-2 flex items-center justify-end gap-2 bg-[#171513]"
                >
                  <span className="text-xs font-mono text-[#DDD5C7] truncate text-right">
                    {loc.name.split(' ').slice(-1)[0]}
                  </span>
                  <span className="text-base shrink-0">{loc.icon}</span>
                </div>
              ))}
            </div>

            {/* Cells: Locations x Weapons */}
            <div className="border-l-2 border-[#C69214]/60">
              <div className="h-6 border-b border-[#3A352F] bg-[#171513]"></div>
              {locations.map((loc) => (
                <div key={loc.id} className="flex">
                  {weapons.map((w) => (
                    <React.Fragment key={w.id}>
                      {renderCell('location', loc.id, 'weapon', w.id)}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Helpful hint footer */}
      <div className="mt-3 pt-2 border-t border-[#292521] flex items-center justify-between text-[11px] font-mono text-[#787166]">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          Rule: Each suspect has exactly ONE weapon and was at ONE location.
        </span>
      </div>
    </div>
  );
};
