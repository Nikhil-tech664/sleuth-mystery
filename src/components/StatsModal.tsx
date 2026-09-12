import React from 'react';
import type { UserStats } from '../types/game';
import { X, Trophy, Flame, Target, Award } from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { getRankForCaseCount, DETECTIVE_RANKS } from '../data/ranks';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onCompleteAll?: () => void;
  onResetAll?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onCompleteAll,
  onResetAll,
}) => {
  if (!isOpen) return null;

  const currentRank = getRankForCaseCount(stats.gamesWon);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-2xl border border-[#3A352F] bg-[#171513] p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C69214]" />
            <h3 className="text-base font-bold font-serif text-[#FAF6F0]">
              Detective Service Record
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Rank Showcase */}
        <div className="bg-[#211D19] border border-[#C69214]/40 rounded-xl p-4 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#141210] border border-[#3A352F] flex items-center justify-center text-4xl shadow-inner shrink-0">
            {currentRank.badge}
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#C69214] font-bold uppercase tracking-wider">
              Accredited Rank
            </div>
            <div className="text-lg font-bold text-[#FAF7F2] font-serif">
              {currentRank.title}
            </div>
            <p className="text-xs text-[#AAA194] leading-tight font-sans mt-0.5">
              {currentRank.description}
            </p>
          </div>
        </div>

        {/* Core Stats 4-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-[#1C1A17] border border-[#2D2823] rounded-xl p-3 text-center">
            <div className="text-2xl font-black font-mono text-[#FAF7F2]">
              {stats.gamesPlayed}
            </div>
            <div className="text-[10px] font-mono text-[#8C8478] uppercase mt-0.5 flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-[#C69214]" /> Dispatches
            </div>
          </div>

          <div className="bg-[#1C1A17] border border-[#2D2823] rounded-xl p-3 text-center">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {winRate}%
            </div>
            <div className="text-[10px] font-mono text-[#8C8478] uppercase mt-0.5 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" /> Solved
            </div>
          </div>

          <div className="bg-[#1C1A17] border border-[#2D2823] rounded-xl p-3 text-center">
            <div className="text-2xl font-black font-mono text-amber-400">
              {stats.currentStreak}
            </div>
            <div className="text-[10px] font-mono text-[#8C8478] uppercase mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Streak
            </div>
          </div>

          <div className="bg-[#1C1A17] border border-[#2D2823] rounded-xl p-3 text-center">
            <div className="text-2xl font-black font-mono text-[#FAF7F2]">
              {stats.maxStreak}
            </div>
            <div className="text-[10px] font-mono text-[#8C8478] uppercase mt-0.5">
              Best Run
            </div>
          </div>
        </div>

        {/* Master Detective Overrides */}
        <div className="bg-[#1A1612] border border-[#3E3427] rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
          <div className="text-left">
            <div className="text-xs font-mono font-bold text-amber-400">⚡ Master Sleuth Protocol</div>
            <div className="text-[10px] text-stone-400">Instantly solve & achieve 100% completion across all cases and ranks</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onCompleteAll && (
              <button
                type="button"
                onClick={() => {
                  sound.playVictory();
                  onCompleteAll();
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black text-xs font-mono font-bold shadow-md transition-transform hover:scale-105"
              >
                ⚡ 100% Clear All
              </button>
            )}
            {onResetAll && (
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  onResetAll();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-mono hover:bg-stone-800 transition-colors"
                title="Reset progress to rookie"
              >
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        {/* Rank Progression Path */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#C69214] font-bold mb-2">
            Precinct Promotion Ladder
          </div>
          <div className="space-y-1.5">
            {DETECTIVE_RANKS.map((rank) => {
              const isAchieved = stats.gamesWon >= rank.casesRequired;
              return (
                <div
                  key={rank.title}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    isAchieved
                      ? 'bg-[#1F1C18] border-[#38332B] text-[#FAF7F2]'
                      : 'bg-[#141311] border-[#22201D] text-[#635C52]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{rank.badge}</span>
                    <div>
                      <span className="font-bold font-serif">{rank.title}</span>
                      <span className="text-[10px] font-mono text-[#8C8478] ml-2">
                        ({rank.casesRequired} solved)
                      </span>
                    </div>
                  </div>
                  {isAchieved && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      Unlocked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
