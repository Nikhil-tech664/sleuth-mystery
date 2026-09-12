import React from 'react';
import type { Case, UserStats } from '../types/game';
import { X, Trophy, ShieldCheck, Lock, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface EvidenceLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  stats: UserStats;
  currentCaseId: string;
  onSelectCase: (c: Case) => void;
}

export const EvidenceLockerModal: React.FC<EvidenceLockerModalProps> = ({
  isOpen,
  onClose,
  cases,
  stats,
  currentCaseId,
  onSelectCase,
}) => {
  if (!isOpen) return null;

  const solvedCaseIds = Object.keys(stats.history);
  const totalTrophies = cases.length;
  const unlockedTrophies = cases.filter((c) => solvedCaseIds.includes(c.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border-2 border-amber-500/70 bg-[#151311] p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C2722] pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#281F10] border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-inner text-amber-400">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-[#FAF6F0] tracking-wide">
                  Precinct Evidence Locker & Trophy Room
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono font-bold">
                  {unlockedTrophies}/{totalTrophies} UNLOCKED
                </span>
              </div>
              <p className="text-xs text-[#8C8478] font-sans mt-0.5">
                Every closed investigation archives a permanent golden forensic artifact into your personal hall of fame.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trophies Collection Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((c) => {
              const isSolved = solvedCaseIds.includes(c.id);
              const historyItem = stats.history[c.id];
              const isCurrent = c.id === currentCaseId;
              const trophy = c.trophy || {
                id: `trophy-${c.id}`,
                name: `The Artifact of Case #${c.caseNumber}`,
                icon: '🏆',
                description: 'Key forensic artifact recovered from the crime scene.',
                lore: 'Archived in precinct vault upon successful magistrate conviction.',
              };

              return (
                <div
                  key={c.id}
                  className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isSolved
                      ? 'border-amber-500/60 bg-gradient-to-br from-[#1E180E] via-[#16130F] to-[#12100E] shadow-[0_4px_20px_rgba(245,158,11,0.15)]'
                      : 'border-[#2C2722] bg-[#141211] opacity-70'
                  }`}
                >
                  {/* Top Row: Trophy Icon & Badge */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl border-2 shrink-0 shadow-inner ${
                        isSolved
                          ? 'bg-[#2E200C] border-amber-400 text-amber-200 ring-2 ring-amber-500/30'
                          : 'bg-[#1D1A17] border-[#38322B] text-stone-600 grayscale'
                      }`}
                    >
                      {isSolved ? trophy.icon : <Lock className="w-6 h-6 text-[#554D42]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#241E15] text-[#C69214] border border-[#C69214]/30 font-bold uppercase">
                          Case #{c.caseNumber} • {c.difficulty}
                        </span>
                        {isSolved ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 font-bold">
                            <ShieldCheck className="w-3 h-3" /> SOLVED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221F1C] text-[#8C8478] border border-[#332E28] font-bold">
                            UNSOLVED
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm md:text-base font-bold font-serif text-[#FAF6F0] truncate">
                        {isSolved ? trophy.name : `Classified Trophy #${c.caseNumber}`}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-mono font-medium truncate">
                        "{c.title}"
                      </p>
                    </div>
                  </div>

                  {/* Lore / Description */}
                  <div className="bg-[#0F0D0C] border border-[#2B251E] rounded-xl p-3 mb-3 text-xs leading-relaxed font-sans text-[#DDD5C7]">
                    {isSolved ? (
                      <div>
                        <p className="font-semibold text-amber-200 mb-1">{trophy.description}</p>
                        <p className="text-[11px] text-[#A89E92] italic">"{trophy.lore}"</p>
                      </div>
                    ) : (
                      <p className="text-[#8C8478] italic">
                        Evidence sealed under magistrate lock. Solve Case #{c.caseNumber} to unlock this relic and examine its forensic history.
                      </p>
                    )}
                  </div>

                  {/* Solve Statistics (if solved) & Action Button */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#26211C]">
                    {isSolved && historyItem ? (
                      <div className="flex items-center gap-3 text-[11px] font-mono text-[#AAA194]">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Clock className="w-3 h-3" />
                          {Math.floor(historyItem.timeSeconds / 60)}m {historyItem.timeSeconds % 60}s
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          {historyItem.strikes} Strikes
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-[#6E665C]">Awaiting Detective</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        sound.playTypewriter();
                        onSelectCase(c);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                        isCurrent
                          ? 'bg-[#2B2317] border border-[#C69214] text-amber-300'
                          : 'bg-[#C69214] hover:bg-amber-400 text-black shadow-md'
                      }`}
                    >
                      <span>{isCurrent ? 'Current Case' : 'Open Dossier'}</span>
                      {!isCurrent && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#2A2622] flex items-center justify-between text-xs font-mono text-[#8C8478] shrink-0">
          <span>Official Archive of Precinct 12</span>
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#221F1C] hover:bg-[#2E2924] text-[#DDD5C7] transition-colors"
          >
            Close Trophy Room
          </button>
        </div>
      </div>
    </div>
  );
};
