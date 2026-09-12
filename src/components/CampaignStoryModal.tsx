import React, { useState, useEffect } from 'react';
import type { Case } from '../types/game';
import {
  X,
  Lock,
  Play,
  Volume2,
  VolumeX,
  Award,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { speech } from '../audio/speechEngine';
import { INITIAL_CASES } from '../data/initialCases';

import confetti from 'canvas-confetti';

interface CampaignStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCampaignCase: (selectedCase: Case) => void;
}

interface CampaignChapter {
  chapter: number;
  title: string;
  subtitle: string;
  location: string;
  date: string;
  actNarrative: string;
  intelSnippet: string;
  unlockReward: string;
  caseId: string;
}

const CAMPAIGN_CHAPTERS: CampaignChapter[] = [
  {
    chapter: 1,
    title: 'The Fog Over Baker Street',
    subtitle: 'Act I: The 90-Second Blackout',
    location: 'Central London',
    date: 'October 12, 1894',
    actNarrative:
      'London descends into total darkness as the city generators are severed at 11:42 PM. Ninety seconds later, the gas lamps flicker back to life, revealing Lord Sterling dead at his desk. The assassin left no footprints, only a calling card bearing a wax seal of an hourglass.',
    intelSnippet: 'Hourglass Wax Cipher Fragment #1 recovered from the hearth.',
    unlockReward: 'Constable Street Patrol Seal',
    caseId: INITIAL_CASES[0]?.id || 'case-1',
  },
  {
    chapter: 2,
    title: 'Whispers in the Thames Docks',
    subtitle: 'Act II: The Smuggler’s Manifest',
    location: 'Wapping Wharves',
    date: 'October 19, 1894',
    actNarrative:
      'Following the shipment of cyanide, your investigation leads to the fog-shrouded wharves of the Thames. An undercover dock informant was strangled before he could hand over the shipping ledger. Someone in high society paid thousands to import untraceable poisons.',
    intelSnippet: 'Shipping Manifest stamped with "The Midnight Council" insignia.',
    unlockReward: 'Dockland Undercover Medal',
    caseId: INITIAL_CASES[1]?.id || 'case-2',
  },
  {
    chapter: 3,
    title: 'The Clocktower Sabotage',
    subtitle: 'Act III: The Jammed Escapement',
    location: 'Westminster Bell Tower',
    date: 'November 2, 1894',
    actNarrative:
      'The Great Clock of Westminster ceases to chime at midnight. Inside the belfry gears, the Chief Clockmaker lies lifeless. The sabotage was precision-timed to conceal the sound of breaking glass across the parliament district.',
    intelSnippet: 'Gold-plated escapement wheel engraved with coordinates.',
    unlockReward: 'Westminster Horology Ribbon',
    caseId: INITIAL_CASES[2]?.id || 'case-3',
  },
  {
    chapter: 4,
    title: 'Betrayal at Scotland Yard',
    subtitle: 'Act IV: The Precinct Mole',
    location: 'Whitehall Police Headquarters',
    date: 'November 18, 1894',
    actNarrative:
      'The evidence locker inside Scotland Yard has been ransacked. Key forensic logs were soaked in acid. The perpetrator knew the safe combination and the guard rotations. You realize with chilling certainty: the Council has an agent wearing a detective’s badge.',
    intelSnippet: 'Acid-scorched confession note signed by "Inspector Judas".',
    unlockReward: 'Counter-Intelligence Silver Star',
    caseId: INITIAL_CASES[0]?.id || 'case-1',
  },
  {
    chapter: 5,
    title: 'The Architect’s Masquerade',
    subtitle: 'Act V: Grand Finale',
    location: 'The Royal Opera House',
    date: 'December 31, 1894',
    actNarrative:
      'New Year’s Eve. Two hundred masked aristocrats waltz in the Grand Ballroom while the Midnight Council prepares to trigger the final blackout. You must infiltrate the masquerade, expose the Architect, and bring an end to the shadow conspiracy before the bells chime 1895.',
    intelSnippet: 'Mastermind signet ring with engraved Latin motto "Post Tenebras Lux".',
    unlockReward: 'Grand Order of the Blackout Master',
    caseId: INITIAL_CASES[1]?.id || 'case-2',
  },
];

export const CampaignStoryModal: React.FC<CampaignStoryModalProps> = ({
  isOpen,
  onClose,
  onSelectCampaignCase,
}) => {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [unlockedChapter, setUnlockedChapter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sleuth_campaign_unlocked_v1');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [completedChapters, setCompletedChapters] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sleuth_campaign_completed_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const savedCh = localStorage.getItem('sleuth_campaign_unlocked_v1');
        setUnlockedChapter(savedCh ? parseInt(savedCh, 10) : 1);
        const savedComp = localStorage.getItem('sleuth_campaign_completed_v1');
        setCompletedChapters(savedComp ? JSON.parse(savedComp) : {});
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('sleuth_data_updated', handleUpdate);
    return () => window.removeEventListener('sleuth_data_updated', handleUpdate);
  }, []);

  useEffect(() => {
    return speech.subscribe((speaking) => {
      setIsNarrating(speaking);
    });
  }, []);

  if (!isOpen) return null;

  const currentCh = CAMPAIGN_CHAPTERS[selectedChapterIdx];
  const isLocked = currentCh.chapter > unlockedChapter;
  const isCompleted = completedChapters[currentCh.chapter] === true;

  const handleLaunchChapter = () => {
    sound.playWaxSealBreak();
    speech.stop();
    // Locate corresponding case from catalogue or fallback
    const targetCase =
      INITIAL_CASES.find((c) => c.id === currentCh.caseId) || INITIAL_CASES[0];
    onSelectCampaignCase(targetCase);
    onClose();
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      speech.stop();
    } else {
      speech.speak(currentCh.actNarrative, 'dispatch');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#141210] border-2 border-[#C69214]/70 shadow-[0_0_50px_rgba(198,146,20,0.25)] overflow-hidden text-[#DDD5C7]">
        {/* Header */}
        <div className="border-b border-[#2C261F] p-4 sm:p-5 bg-gradient-to-r from-[#201A12] via-[#2A1D13] to-[#201A12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2D2111] border border-[#C69214]/60 flex items-center justify-center text-2xl shadow-inner text-amber-400">
              📖
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#FAF7F2] flex items-center gap-2">
                <span>THE LONDON BLACKOUT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  5-CHAPTER CAMPAIGN
                </span>
              </h2>
              <p className="text-xs text-[#A89F91] font-mono">
                A serial conspiracy saga tracking "The Midnight Architect" across Victorian London
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              speech.stop();
              sound.playCassetteClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#221D17] hover:bg-[#2F261E] border border-[#3E3427] text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Campaign Layout: Left (Chapter Timeline) / Right (Act Dossier & Cutscene) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Chapter Progression Roadmap (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Chapter Roadmap</span>
              <span className="text-[10px] text-stone-400">
                Unlocked: {unlockedChapter}/5
              </span>
            </div>

            {CAMPAIGN_CHAPTERS.map((ch, idx) => {
              const chLocked = ch.chapter > unlockedChapter;
              const chActive = selectedChapterIdx === idx;
              const chDone = completedChapters[ch.chapter] === true;

              return (
                <button
                  key={ch.chapter}
                  type="button"
                  disabled={chLocked}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedChapterIdx(idx);
                    speech.stop();
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                    chActive
                      ? 'bg-[#291F14] border-amber-500/90 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : chLocked
                      ? 'bg-[#12100E] border-[#221D17] opacity-50 cursor-not-allowed'
                      : 'bg-[#181410] hover:bg-[#201A13] border-[#2A2319]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-xs shrink-0 border ${
                        chDone
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : chActive
                          ? 'bg-amber-500 text-black border-amber-400'
                          : chLocked
                          ? 'bg-stone-900 text-stone-500 border-stone-800'
                          : 'bg-[#261E14] text-amber-300 border-[#3D3121]'
                      }`}
                    >
                      {chDone ? '✓' : chLocked ? <Lock className="w-3.5 h-3.5" /> : ch.chapter}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-serif font-bold text-[#FAF7F2] truncate group-hover:text-amber-200">
                        {ch.title}
                      </div>
                      <div className="text-[10px] text-[#8C8476] font-mono truncate">
                        {ch.location} • {ch.date}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      chActive ? 'text-amber-400 translate-x-0.5' : 'text-stone-600'
                    }`}
                  />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                sound.playVictory();
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                });
                const completed = { 1: true, 2: true, 3: true, 4: true, 5: true };
                localStorage.setItem('sleuth_campaign_unlocked_v1', '5');
                localStorage.setItem('sleuth_campaign_completed_v1', JSON.stringify(completed));
                setUnlockedChapter(5);
                setCompletedChapters(completed);
                window.dispatchEvent(new CustomEvent('sleuth_data_updated'));
              }}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900/80 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>⚡ Complete All 5 Chapters</span>
            </button>
          </div>

          {/* RIGHT: Chapter Cutscene & Intel Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-[#1A1612] border border-[#2F271E] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2C241B] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    {currentCh.subtitle}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight mt-0.5">
                    {currentCh.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNarration}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    isNarrating
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                      : 'bg-[#221D17] hover:bg-[#2C251D] border-[#382E20] text-stone-300'
                  }`}
                >
                  {isNarrating ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Narrate Cutscene</span>
                    </>
                  )}
                </button>
              </div>

              {/* Narrative Story Passage */}
              <div className="p-3.5 bg-[#12100E] border border-[#282117] rounded-xl font-typewriter text-xs text-[#E8DFD3] leading-relaxed relative">
                <div className="absolute top-2 right-2 text-stone-600 text-2xl font-serif select-none pointer-events-none">
                  “
                </div>
                {currentCh.actNarrative}
              </div>

              {/* Secret Intel Snippet */}
              <div className="p-3 bg-[#20180F] border border-amber-600/40 rounded-xl space-y-1">
                <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recovered Case Evidence</span>
                </div>
                <p className="text-xs font-mono text-stone-300">
                  {currentCh.intelSnippet}
                </p>
              </div>

              {/* Chapter Reward Badge */}
              <div className="flex items-center gap-2 p-2.5 bg-[#14110E] border border-[#2B2319] rounded-xl text-xs font-mono text-stone-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Completion Reward:</span>
                <span className="font-bold text-amber-300">{currentCh.unlockReward}</span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-3 border-t border-[#2B231A] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8C8476]">
                {isCompleted
                  ? '✓ Chapter Solved & Recorded'
                  : 'Ready to commence investigation'}
              </span>

              <button
                type="button"
                disabled={isLocked}
                onClick={handleLaunchChapter}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs shadow-lg shadow-amber-900/40 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Launch Chapter Investigation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
