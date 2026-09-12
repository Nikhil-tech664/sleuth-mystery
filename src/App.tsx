import { useState, useEffect, lazy, Suspense } from 'react';
import confetti from 'canvas-confetti';
import type { Case, CellState, DeductionState, UserStats, Suspect } from './types/game';
import { INITIAL_CASES } from './data/initialCases';
import { getRankForCaseCount } from './data/ranks';
import {
  getInitialDeductionState,
  saveDeductionState,
  getUserStats,
  recordCaseVictory,
  completeAllCases,
  resetAllProgress,
} from './utils/storage';
import { sound } from './audio/soundEffects';

import { Header } from './components/Header';
import { CaseBriefing } from './components/CaseBriefing';
import { CrimeSceneVisualizer } from './components/CrimeSceneVisualizer';
import { SuspectDossier } from './components/SuspectDossier';
import { EvidenceBoard } from './components/EvidenceBoard';
import { LogicGrid } from './components/LogicGrid';
import { AccusationModal } from './components/AccusationModal';
import { SolvedModal } from './components/SolvedModal';
import { VaultModal } from './components/VaultModal';
import { StatsModal } from './components/StatsModal';
import { TutorialModal } from './components/TutorialModal';
import { HintModal } from './components/HintModal';
import { InterrogationModal } from './components/InterrogationModal';
import { MobileDock } from './components/MobileDock';
import { DeskAtmosphereGadgets } from './components/DeskAtmosphereGadgets';
import { ConfessionModal } from './components/ConfessionModal';
import { JukeboxModal } from './components/JukeboxModal';

// Performance optimization: Lazy-load heavy views & secondary modals
const PrintableCaseModal = lazy(() =>
  import('./components/PrintableCaseModal').then((m) => ({ default: m.PrintableCaseModal }))
);
const ForensicsLabView = lazy(() =>
  import('./components/ForensicsLabView').then((m) => ({ default: m.ForensicsLabView }))
);
const CaseArchiveView = lazy(() =>
  import('./components/CaseArchiveView').then((m) => ({ default: m.CaseArchiveView }))
);
const HallOfFameView = lazy(() =>
  import('./components/HallOfFameView').then((m) => ({ default: m.HallOfFameView }))
);
const InfiniteGeneratorView = lazy(() =>
  import('./components/InfiniteGeneratorView').then((m) => ({ default: m.InfiniteGeneratorView }))
);
const ConspiracyBoardView = lazy(() =>
  import('./components/ConspiracyBoardView').then((m) => ({ default: m.ConspiracyBoardView }))
);
const SyndicateMetaView = lazy(() =>
  import('./components/SyndicateMetaView').then((m) => ({ default: m.SyndicateMetaView }))
);
const NightShiftView = lazy(() =>
  import('./components/NightShiftView').then((m) => ({ default: m.NightShiftView }))
);
const CampaignStoryModal = lazy(() =>
  import('./components/CampaignStoryModal').then((m) => ({ default: m.CampaignStoryModal }))
);
const CaseCreatorModal = lazy(() =>
  import('./components/CaseCreatorModal').then((m) => ({ default: m.CaseCreatorModal }))
);
const CoopRoomModal = lazy(() =>
  import('./components/CoopRoomModal').then((m) => ({ default: m.CoopRoomModal }))
);
const Interactive3DSceneModal = lazy(() =>
  import('./components/Interactive3DSceneModal').then((m) => ({
    default: m.Interactive3DSceneModal,
  }))
);
const DuelModal = lazy(() =>
  import('./components/DuelModal').then((m) => ({ default: m.DuelModal }))
);
const CoffeeTipModal = lazy(() =>
  import('./components/CoffeeTipModal').then((m) => ({ default: m.CoffeeTipModal }))
);
const DispatchSubscriberModal = lazy(() =>
  import('./components/DispatchSubscriberModal').then((m) => ({
    default: m.DispatchSubscriberModal,
  }))
);
const EvidenceLockerModal = lazy(() =>
  import('./components/EvidenceLockerModal').then((m) => ({ default: m.EvidenceLockerModal }))
);
import {
  Coffee,
  BookOpen,
  Briefcase,
  FolderSearch,
  FlaskConical,
  Trophy,
  Dices,
  Activity,
  ShieldAlert,
  Moon,
} from 'lucide-react';

export type AgencyView =
  | 'desk'
  | 'corkboard'
  | 'archive'
  | 'lab'
  | 'syndicate'
  | 'nightshift'
  | 'trophies'
  | 'generator';

export function App() {
  const [currentView, setCurrentView] = useState<AgencyView>('desk');
  const [isLampOn, setIsLampOn] = useState<boolean>(true);
  const [isConfessionOpen, setIsConfessionOpen] = useState<boolean>(false);
  const [confessedCulpritId, setConfessedCulpritId] = useState<string>('');
  const [currentCase, setCurrentCase] = useState<Case>(INITIAL_CASES[0]);
  const [deductionState, setDeductionState] = useState<DeductionState>(() =>
    getInitialDeductionState(INITIAL_CASES[0].id)
  );
  const [userStats, setUserStats] = useState<UserStats>(() => getUserStats());

  // Modal visibility states
  const [isAccusationOpen, setIsAccusationOpen] = useState<boolean>(false);
  const [isSolvedOpen, setIsSolvedOpen] = useState<boolean>(false);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isPrintableOpen, setIsPrintableOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isSubscriberOpen, setIsSubscriberOpen] = useState<boolean>(false);
  const [isDuelOpen, setIsDuelOpen] = useState<boolean>(false);
  const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState<boolean>(false);
  const [isJukeboxOpen, setIsJukeboxOpen] = useState<boolean>(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState<boolean>(false);
  const [isCaseCreatorOpen, setIsCaseCreatorOpen] = useState<boolean>(false);
  const [isCoopRoomOpen, setIsCoopRoomOpen] = useState<boolean>(false);
  const [is3DSceneOpen, setIs3DSceneOpen] = useState<boolean>(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState<boolean>(false);
  const [interrogatingSuspect, setInterrogatingSuspect] = useState<Suspect | null>(null);

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState<Record<string, CellState>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, CellState>[]>([]);

  // First-time visitor onboarding trigger
  useEffect(() => {
    const hasSeen = localStorage.getItem('sleuth_tutorial_seen_v1');
    if (!hasSeen) {
      setIsTutorialOpen(true);
      localStorage.setItem('sleuth_tutorial_seen_v1', 'true');
    }
  }, []);

  // Listen for shared custom cases in URL hash (#case=...)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('#case=')) {
        const encoded = hash.split('#case=')[1];
        if (encoded) {
          const jsonStr = decodeURIComponent(atob(encoded));
          const parsedCase: Case = JSON.parse(jsonStr);
          if (parsedCase && parsedCase.id && parsedCase.solution) {
            setCurrentCase(parsedCase);
            setDeductionState(getInitialDeductionState(parsedCase.id));
            sound.playVictory();
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse case from URL hash:', e);
    }
  }, []);

  // Sync state changes to storage
  useEffect(() => {
    saveDeductionState(currentCase.id, deductionState);
  }, [currentCase.id, deductionState]);

  // Sync when storage data updates
  useEffect(() => {
    const handleSync = () => {
      setUserStats(getUserStats());
      setDeductionState(getInitialDeductionState(currentCase.id));
    };
    window.addEventListener('sleuth_data_updated', handleSync);
    return () => window.removeEventListener('sleuth_data_updated', handleSync);
  }, [currentCase.id]);

  // Handle 100% clearing all cases
  const handleCompleteAll = () => {
    sound.playVictory();
    confetti({
      particleCount: 220,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#DC2626', '#16A34A', '#FAF6F0'],
    });
    const updated = completeAllCases(INITIAL_CASES);
    setUserStats(updated);
    setDeductionState(getInitialDeductionState(currentCase.id));
  };

  // Handle resetting progress
  const handleResetAll = () => {
    sound.playTypewriter();
    const updated = resetAllProgress(INITIAL_CASES);
    setUserStats(updated);
    setDeductionState(getInitialDeductionState(currentCase.id));
  };

  // Attach global debug/power commands
  useEffect(() => {
    (window as any).completeAllCases = handleCompleteAll;
    (window as any).resetAllProgress = handleResetAll;
  }, [currentCase.id, handleCompleteAll, handleResetAll]);

  // Handle switching cases from the Cold Vault
  const handleSelectCase = (selectedCase: Case) => {
    setCurrentCase(selectedCase);
    setUndoStack([]);
    setRedoStack([]);
    const loadedState = getInitialDeductionState(selectedCase.id);
    setDeductionState(loadedState);
  };

  // Crime scene hotspot discovery handler
  const handleDiscoverHotspot = (hotspotId: string, associatedClueId?: string) => {
    setDeductionState((prev) => {
      const updatedDiscovered = { ...prev.discoveredHotspots, [hotspotId]: true };
      const updatedClues = associatedClueId
        ? { ...prev.checkedClues, [associatedClueId]: true }
        : prev.checkedClues;
      const newXP = prev.xpEarned + 50;

      // Check for XP milestone level up sound
      if (newXP % 200 === 0) {
        sound.playLevelUp();
      }

      return {
        ...prev,
        discoveredHotspots: updatedDiscovered,
        checkedClues: updatedClues,
        xpEarned: newXP,
      };
    });
  };

  // Hint usage handler
  const handleUseHint = () => {
    setDeductionState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
  };

  // Push grid to undo stack
  const pushGridHistory = (prevGrid: Record<string, CellState>) => {
    setUndoStack((prev) => [...prev.slice(-30), { ...prevGrid }]);
    setRedoStack([]);
  };

  // Undo move
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    sound.playCassetteClick();
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, { ...deductionState.grid }]);
    setDeductionState((prev) => ({
      ...prev,
      grid: previous,
    }));
  };

  // Redo move
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    sound.playCassetteClick();
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, { ...deductionState.grid }]);
    setDeductionState((prev) => ({
      ...prev,
      grid: next,
    }));
  };

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, deductionState.grid, handleUndo, handleRedo]);

  // Logic Grid cell toggling
  const handleCellClick = (key: string) => {
    pushGridHistory(deductionState.grid);
    setDeductionState((prev) => {
      const current = prev.grid[key] || null;
      let next: CellState = null;
      let bonusXP = 0;
      if (current === null) {
        next = 'no';
      } else if (current === 'no') {
        next = 'yes';
        bonusXP = 25; // Dopamine reward for finding confirmed match
      } else {
        next = null;
      }

      return {
        ...prev,
        grid: {
          ...prev.grid,
          [key]: next,
        },
        xpEarned: prev.xpEarned + bonusXP,
      };
    });
  };

  // Smart Auto-fill exclusions helper
  const handleAutoFillExclusions = () => {
    pushGridHistory(deductionState.grid);
    setDeductionState((prev) => {
      const newGrid = { ...prev.grid };

      // For every cell marked 'yes', fill 'no' in the conflicting row/col within that block
      Object.entries(newGrid).forEach(([key, val]) => {
        if (val === 'yes') {
          const [partA, partB] = key.split('-');
          if (!partA || !partB) return;
          const [catA, idA] = partA.split(':');
          const [catB, idB] = partB.split(':');

          const itemsA =
            catA === 'suspect'
              ? currentCase.suspects
              : catA === 'weapon'
              ? currentCase.weapons
              : currentCase.locations;
          const itemsB =
            catB === 'suspect'
              ? currentCase.suspects
              : catB === 'weapon'
              ? currentCase.weapons
              : currentCase.locations;

          itemsA.forEach((a) => {
            itemsB.forEach((b) => {
              const testKey = `${catA}:${a.id}-${catB}:${b.id}`;
              if (testKey !== key) {
                if (a.id === idA || b.id === idB) {
                  if (newGrid[testKey] !== 'yes') {
                    newGrid[testKey] = 'no';
                  }
                }
              }
            });
          });
        }
      });

      return {
        ...prev,
        grid: newGrid,
      };
    });
  };

  // Reset Grid
  const handleResetGrid = () => {
    pushGridHistory(deductionState.grid);
    setDeductionState((prev) => ({
      ...prev,
      grid: {},
    }));
  };

  // Clue toggle
  const handleToggleClue = (clueId: string) => {
    setDeductionState((prev) => ({
      ...prev,
      checkedClues: {
        ...prev.checkedClues,
        [clueId]: !prev.checkedClues[clueId],
      },
    }));
  };

  // Scratchpad notes
  const handleNotesChange = (text: string) => {
    setDeductionState((prev) => ({
      ...prev,
      notes: text,
    }));
  };

  // Handle Accusation Submission
  const handleAccuse = (suspectId: string, weaponId: string, locationId: string) => {
    const isCorrect =
      suspectId === currentCase.solution.culpritId &&
      weaponId === currentCase.solution.weaponId &&
      locationId === currentCase.solution.locationId;

    if (isCorrect) {
      sound.playVictory();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#DC2626', '#16A34A', '#FAF6F0'],
      });

      const now = Date.now();
      const elapsedSeconds = Math.floor((now - deductionState.startTime) / 1000);

      const updatedStats = recordCaseVictory(
        currentCase.id,
        currentCase.caseNumber,
        currentCase.title,
        elapsedSeconds,
        deductionState.strikes
      );
      setUserStats(updatedStats);

      setDeductionState((prev) => ({
        ...prev,
        isSolved: true,
        solvedTime: now,
        xpEarned: prev.xpEarned + 200,
        accusation: { suspectId, weaponId, locationId },
      }));

      // Trigger high-voltage cinematic Confession Breakdown
      setConfessedCulpritId(suspectId);
      setIsAccusationOpen(false);
      setTimeout(() => {
        setIsConfessionOpen(true);
      }, 500);

      return {
        correct: true,
        message: 'CASE CLOSED! The culprit broke down and confessed under interrogation!',
      };
    } else {
      sound.playError();
      setDeductionState((prev) => ({
        ...prev,
        strikes: prev.strikes + 1,
      }));

      return {
        correct: false,
        message: 'False Accusation! The magistrate rejected your evidence warrant. (+1 Strike)',
      };
    }
  };

  // Log alibi from interrogation to notes
  const handleLogAlibi = (alibiText: string) => {
    setDeductionState((prev) => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n${alibiText}` : alibiText,
      xpEarned: prev.xpEarned + 25,
    }));
  };

  const currentRank = getRankForCaseCount(userStats.gamesWon);
  const completedCaseIds = Object.keys(userStats.history);

  return (
    <div className="min-h-screen bg-[#121110] text-[#E6E1DA] flex flex-col selection:bg-[#c29b38] selection:text-[#121110] pb-16 md:pb-0">
      {/* Top Navigation */}
      <Header
        caseNumber={currentCase.caseNumber}
        dateStr={currentCase.date}
        streak={userStats.currentStreak}
        rank={currentRank}
        onOpenVault={() => setCurrentView('archive')}
        onOpenPrintable={() => setIsPrintableOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenHint={() => setIsHintOpen(true)}
        onOpenSubscriber={() => setIsSubscriberOpen(true)}
        onOpenDuel={() => setIsDuelOpen(true)}
        onOpenTrophyRoom={() => setCurrentView('trophies')}
        onOpenJukebox={() => setIsJukeboxOpen(true)}
        onOpenCampaign={() => setIsCampaignOpen(true)}
        onOpenCaseCreator={() => setIsCaseCreatorOpen(true)}
        onOpenCoopRoom={() => setIsCoopRoomOpen(true)}
        onOpen3DScene={() => setIs3DSceneOpen(true)}
        onOpenCoffee={() => setIsCoffeeOpen(true)}
        onCompleteAll={handleCompleteAll}
        isSolved={deductionState.isSolved}
      />

      {/* Precinct Agency Views Tab Bar */}
      <nav className="border-b border-[#25211B] bg-[#141210]/95 backdrop-blur-md sticky top-[60px] z-30 px-4 py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto gap-1.5 sm:gap-2 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('desk');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'desk'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'bg-[#1C1A17] text-[#AAA194] hover:bg-[#28241F] hover:text-[#FAF7F2]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Desk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('corkboard');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'corkboard'
                ? 'bg-red-800 text-white shadow-md'
                : 'bg-[#1C1A17] text-[#AAA194] hover:bg-red-950/60 hover:text-red-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-red-400" />
            <span>Red Yarn Board</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('archive');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'archive'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'bg-[#1C1A17] text-[#AAA194] hover:bg-[#28241F] hover:text-[#FAF7F2]'
            }`}
          >
            <FolderSearch className="w-3.5 h-3.5" />
            <span>Case Archives ({INITIAL_CASES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('lab');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'lab'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'bg-[#1C1A17] text-[#AAA194] hover:bg-[#28241F] hover:text-[#FAF7F2]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Forensic Lab</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('syndicate');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'syndicate'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-[#1F1728] text-purple-300 border border-purple-800/40 hover:bg-purple-900/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>The Syndicate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('nightshift');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'nightshift'
                ? 'bg-indigo-700 text-white shadow-md'
                : 'bg-[#171A28] text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/60'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Night Shift (Endless)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('trophies');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'trophies'
                ? 'bg-[#C69214] text-black shadow-md'
                : 'bg-[#1C1A17] text-[#AAA194] hover:bg-[#28241F] hover:text-[#FAF7F2]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Hall of Fame</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              setCurrentView('generator');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              currentView === 'generator'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-[#221828] text-purple-300 border border-purple-800/40 hover:bg-purple-950'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Infinite Sandbox</span>
          </button>
        </div>
      </nav>

      {/* Main Agency View Container */}
      <main className="flex-1 w-full pb-8">
        {/* VIEW 1: ACTIVE INVESTIGATION DESK */}
        {currentView === 'desk' && (
          <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
            {/* Noir Desk Atmosphere Gadgets (Banker's Lamp, Rotary Phone, Pocket Watch) */}
            <DeskAtmosphereGadgets
              isLampOn={isLampOn}
              onToggleLamp={() => setIsLampOn((prev) => !prev)}
              caseNumber={currentCase.caseNumber}
              onOpenJukebox={() => setIsJukeboxOpen(true)}
            />

            {/* Quick Corkboard Red Yarn Jump Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-red-950/40 via-[#1C1713] to-amber-950/40 border border-red-900/40 p-3.5 rounded-2xl shadow-md">
              <div className="flex items-center gap-2.5 text-xs font-serif text-amber-200">
                <Activity className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                <span>Prefer tactile pushpins & red yarn cords? Open the physical conspiracy board.</span>
              </div>
              <button
                onClick={() => {
                  sound.playTypewriter();
                  setCurrentView('corkboard');
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-red-900/70 hover:bg-red-800 text-red-100 border border-red-600/80 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105 shadow"
              >
                Open Red Yarn Board ➔
              </button>
            </div>

            {/* Case Incident Briefing & Accuse Trigger */}
            <CaseBriefing
              currentCase={currentCase}
              onMakeAccusation={() => {
                sound.playTypewriter();
                setIsAccusationOpen(true);
              }}
              isSolved={deductionState.isSolved}
            />

            {/* Visual Crime Scene Map & Hotspots */}
            <div id="crime-scene-section">
              <CrimeSceneVisualizer
                hotspots={currentCase.hotspots}
                discoveredHotspots={deductionState.discoveredHotspots}
                onDiscoverHotspot={handleDiscoverHotspot}
                xp={deductionState.xpEarned}
                suspects={currentCase.suspects}
                onLogNote={handleLogAlibi}
              />
            </div>

            {/* Suspect Profiles, Weapons, Locations Lineup */}
            <div id="suspects-section">
              <SuspectDossier
                suspects={currentCase.suspects}
                weapons={currentCase.weapons}
                locations={currentCase.locations}
                onInterrogateSuspect={(s) => setInterrogatingSuspect(s)}
              />
            </div>

            {/* Recovered Clues & Gumshoe Scratchpad */}
            <div id="clues-section">
              <EvidenceBoard
                clues={currentCase.clues}
                checkedClues={deductionState.checkedClues}
                onToggleClue={handleToggleClue}
                notes={deductionState.notes}
                onNotesChange={handleNotesChange}
              />
            </div>

            {/* The Logic Grid Matrix */}
            <div id="logic-grid-section">
              <LogicGrid
                suspects={currentCase.suspects}
                weapons={currentCase.weapons}
                locations={currentCase.locations}
                grid={deductionState.grid}
                onCellClick={handleCellClick}
                onResetGrid={handleResetGrid}
                onAutoFillExclusions={handleAutoFillExclusions}
                canUndo={undoStack.length > 0}
                canRedo={redoStack.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </div>

            {/* Quick Accuse Action Bar */}
            <div className="rounded-xl border border-[#3A352F] bg-[#1A1815] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="text-center sm:text-left">
                <div className="text-sm font-bold font-serif text-[#FAF6F0]">
                  Ready to close the investigation?
                </div>
                <p className="text-xs text-[#8C8478] font-sans">
                  Compare your confirmed checks (✓) to the evidence before taking the stand.
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playTypewriter();
                  setIsAccusationOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 border border-red-500/40"
              >
                {deductionState.isSolved ? 'Review Verdict' : 'Accuse Culprit'}
              </button>
            </div>
          </div>
        )}

        {/* SECONDARY AGENCY VIEWS (Lazy-Loaded) */}
        <Suspense
          fallback={
            <div className="p-16 text-center text-xs font-mono text-amber-500 animate-pulse flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Loading Scotland Yard Records...</span>
            </div>
          }
        >
          {/* VIEW 1.5: RED YARN CONSPIRACY BOARD */}
          {currentView === 'corkboard' && (
            <ConspiracyBoardView
              currentCase={currentCase}
              deductionState={deductionState}
              onUpdateGridCell={handleCellClick}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}

          {/* VIEW 2: COLD CASE ARCHIVE GALLERY */}
          {currentView === 'archive' && (
            <CaseArchiveView
              cases={INITIAL_CASES}
              currentCaseId={currentCase.id}
              stats={userStats}
              onSelectCase={handleSelectCase}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}

          {/* VIEW 3: SCOTLAND YARD CRIME LAB */}
          {currentView === 'lab' && (
            <ForensicsLabView
              currentCase={currentCase}
              onReturnToDesk={() => setCurrentView('desk')}
              onLogNote={handleLogAlibi}
            />
          )}

          {/* VIEW 3.5: THE MIDNIGHT COUNCIL SYNDICATE */}
          {currentView === 'syndicate' && (
            <SyndicateMetaView
              stats={userStats}
              cases={INITIAL_CASES}
              onSelectCase={(c) => {
                handleSelectCase(c);
                setCurrentView('desk');
              }}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}

          {/* VIEW 3.8: NIGHT SHIFT ENDLESS ROGUELIKE */}
          {currentView === 'nightshift' && (
            <NightShiftView
              onDeployToDesk={(c) => {
                handleSelectCase(c);
                setCurrentView('desk');
              }}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}

          {/* VIEW 4: TROPHY SHOWCASE & HALL OF FAME */}
          {currentView === 'trophies' && (
            <HallOfFameView
              cases={INITIAL_CASES}
              stats={userStats}
              currentCaseId={currentCase.id}
              onSelectCase={handleSelectCase}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}

          {/* VIEW 5: INFINITE PROCEDURAL GENERATOR */}
          {currentView === 'generator' && (
            <InfiniteGeneratorView
              onLoadGeneratedCase={(c) => {
                handleSelectCase(c);
                setCurrentView('desk');
              }}
              onReturnToDesk={() => setCurrentView('desk')}
            />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#25221E] bg-[#141211] py-6 px-4 text-center text-xs text-[#787166] mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#D8CFBF]">SLEUTH</span>
            <span>• Daily Micro Mysteries for Curious Minds</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => {
                sound.playTypewriter();
                setIsVaultOpen(true);
              }}
              className="hover:text-[#C69214] flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Cold Vault
            </button>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" /> Buy Coffee
            </a>
            <span className="text-[#3A352F]">|</span>
            <span>New Case Daily at Midnight</span>
          </div>
        </div>
      </footer>

      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        currentCase={currentCase}
        onAccuse={handleAccuse}
        isAlreadySolved={deductionState.isSolved}
      />

      {/* Cinematic Suspect Confession Breakdown Chamber */}
      <ConfessionModal
        isOpen={isConfessionOpen}
        onClose={() => setIsConfessionOpen(false)}
        currentCase={currentCase}
        culpritId={confessedCulpritId}
        onProceedToDebrief={() => setIsSolvedOpen(true)}
      />

      <SolvedModal
        isOpen={isSolvedOpen}
        onClose={() => setIsSolvedOpen(false)}
        currentCase={currentCase}
        state={deductionState}
        totalWins={userStats.gamesWon}
        streak={userStats.currentStreak}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenCoffee={() => setIsCoffeeOpen(true)}
      />

      <VaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        cases={INITIAL_CASES}
        currentCaseId={currentCase.id}
        onSelectCase={handleSelectCase}
        completedCaseIds={completedCaseIds}
        onCompleteAll={handleCompleteAll}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={userStats}
        onCompleteAll={handleCompleteAll}
        onResetAll={handleResetAll}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        hintText={currentCase.hint}
        hintsUsed={deductionState.hintsUsed}
        onUseHint={handleUseHint}
      />

      {/* Suspect Interrogation Room Modal */}
      <InterrogationModal
        isOpen={interrogatingSuspect !== null}
        onClose={() => setInterrogatingSuspect(null)}
        suspect={interrogatingSuspect}
        onLogAlibi={handleLogAlibi}
      />

      {/* Precinct Jukebox Music Player Modal (100% Copyright-Free Japanese & English Songs) */}
      <JukeboxModal
        isOpen={isJukeboxOpen}
        onClose={() => setIsJukeboxOpen(false)}
      />

      {/* Performance Optimized: Lazy-Loaded Secondary Modals */}
      <Suspense fallback={null}>
        {isPrintableOpen && (
          <PrintableCaseModal
            isOpen={isPrintableOpen}
            onClose={() => setIsPrintableOpen(false)}
            currentCase={currentCase}
          />
        )}

        {isSubscriberOpen && (
          <DispatchSubscriberModal
            isOpen={isSubscriberOpen}
            onClose={() => setIsSubscriberOpen(false)}
          />
        )}

        {isDuelOpen && (
          <DuelModal
            isOpen={isDuelOpen}
            onClose={() => setIsDuelOpen(false)}
            currentCase={currentCase}
          />
        )}

        {isTrophyRoomOpen && (
          <EvidenceLockerModal
            isOpen={isTrophyRoomOpen}
            onClose={() => setIsTrophyRoomOpen(false)}
            cases={INITIAL_CASES}
            stats={userStats}
            currentCaseId={currentCase.id}
            onSelectCase={handleSelectCase}
          />
        )}

        {isCampaignOpen && (
          <CampaignStoryModal
            isOpen={isCampaignOpen}
            onClose={() => setIsCampaignOpen(false)}
            onSelectCampaignCase={handleSelectCase}
          />
        )}

        {isCaseCreatorOpen && (
          <CaseCreatorModal
            isOpen={isCaseCreatorOpen}
            onClose={() => setIsCaseCreatorOpen(false)}
            onPlayCustomCase={(newCase) => handleSelectCase(newCase)}
          />
        )}

        {isCoopRoomOpen && (
          <CoopRoomModal
            isOpen={isCoopRoomOpen}
            onClose={() => setIsCoopRoomOpen(false)}
            caseTitle={currentCase.title}
          />
        )}

        {is3DSceneOpen && (
          <Interactive3DSceneModal
            isOpen={is3DSceneOpen}
            onClose={() => setIs3DSceneOpen(false)}
            caseTitle={currentCase.title}
            onDiscoverClue={handleLogAlibi}
          />
        )}

        {isCoffeeOpen && (
          <CoffeeTipModal
            isOpen={isCoffeeOpen}
            onClose={() => setIsCoffeeOpen(false)}
            razorpayUrl="https://rzp.io/rzp/mDXzulzR"
          />
        )}
      </Suspense>

      {/* Mobile Sticky Quick Navigation Dock */}
      <MobileDock
        onAccuseClick={() => {
          sound.playTypewriter();
          setIsAccusationOpen(true);
        }}
        isSolved={deductionState.isSolved}
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
      />
    </div>
  );
}

export default App;
