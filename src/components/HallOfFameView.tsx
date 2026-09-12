import React from 'react';
import type { Case, UserStats } from '../types/game';
import { Trophy, ShieldCheck, Lock, Clock, AlertTriangle, ArrowLeft, ArrowRight, Award, Zap, Flame, BarChart3 } from 'lucide-react';
import { getRankForCaseCount } from '../data/ranks';
import { sound } from '../audio/soundEffects';

interface HallOfFameViewProps {
  cases: Case[];
  stats: UserStats;
  currentCaseId: string;
  onSelectCase: (c: Case) => void;
  onReturnToDesk: () => void;
}

export const HallOfFameView: React.FC<HallOfFameViewProps> = ({
  cases,
  stats,
  currentCaseId,
  onSelectCase,
  onReturnToDesk,
}) => {
  const solvedCaseIds = Object.keys(stats.history);
  const totalCases = cases.length;
  const unlockedCount = cases.filter((c) => solvedCaseIds.includes(c.id)).length;
  const currentRank = getRankForCaseCount(stats.gamesWon);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C2722] pb-4">
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
                Detective Hall of Fame & Evidence Locker
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-500/40">
                {unlockedCount}/{totalCases} TROPHIES
              </span>
            </div>
            <p className="text-xs text-[#8C8478] font-sans mt-0.5">
              Permanent repository of golden forensic artifacts and career honors awarded by Scotland Yard.
            </p>
          </div>
        </div>
      </div>

      {/* Career Overview Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-[#171410] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8C8478] mb-1">
            <span className="text-xs font-mono font-bold uppercase">Detective Rank</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg md:text-xl font-serif font-bold text-amber-300">
            {currentRank.title} {currentRank.badge}
          </div>
          <div className="text-[11px] font-mono text-[#8C8478] mt-1">{stats.gamesWon} closed cases</div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-[#101712] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8C8478] mb-1">
            <span className="text-xs font-mono font-bold uppercase">Clearance Rate</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg md:text-xl font-serif font-bold text-emerald-400">{winRate}%</div>
          <div className="text-[11px] font-mono text-[#8C8478] mt-1">{stats.gamesWon} wins / {stats.gamesPlayed} trials</div>
        </div>

        <div className="p-4 rounded-2xl border border-orange-500/30 bg-[#181109] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8C8478] mb-1">
            <span className="text-xs font-mono font-bold uppercase">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-lg md:text-xl font-serif font-bold text-orange-400">{stats.currentStreak} Days</div>
          <div className="text-[11px] font-mono text-[#8C8478] mt-1">Best Record: {stats.maxStreak} days</div>
        </div>

        <div className="p-4 rounded-2xl border border-yellow-500/30 bg-[#19160D] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8C8478] mb-1">
            <span className="text-xs font-mono font-bold uppercase">Total Honor</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-lg md:text-xl font-serif font-bold text-yellow-300">
            {stats.gamesWon * 250 + unlockedCount * 50} XP
          </div>
          <div className="text-[11px] font-mono text-[#8C8478] mt-1">Scotland Yard Merit</div>
        </div>
      </div>

      {/* Velvet Trophy Pedestals Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold font-serif text-[#FAF6F0] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>The Case Evidence Relics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => {
            const isSolved = solvedCaseIds.includes(c.id);
            const history = stats.history[c.id];
            const isCurrent = c.id === currentCaseId;
            const trophy = c.trophy || {
              id: `trophy-${c.id}`,
              name: `Forensic Relic #${c.caseNumber}`,
              icon: '🏆',
              description: 'Classified artifact from precinct vault.',
              lore: 'Archived following court conviction.',
            };

            return (
              <div
                key={c.id}
                className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isSolved
                    ? 'border-amber-500/60 bg-gradient-to-br from-[#1E170C] via-[#16120B] to-[#100D09] shadow-[0_4px_25px_rgba(245,158,11,0.18)]'
                    : 'border-[#2C2722] bg-[#12100F] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    {/* Trophy Pedestal Emblem */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-2 shrink-0 shadow-inner ${
                        isSolved
                          ? 'bg-[#2E200C] border-amber-400 text-amber-200 ring-4 ring-amber-500/20'
                          : 'bg-[#1A1815] border-[#38322B] text-stone-600 grayscale'
                      }`}
                    >
                      {isSolved ? trophy.icon : <Lock className="w-6 h-6 text-[#554D42]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#241E15] text-[#C69214] border border-[#C69214]/30 font-bold uppercase">
                          Case #{c.caseNumber} • {c.difficulty}
                        </span>
                        {isSolved ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 font-bold">
                            <ShieldCheck className="w-3 h-3" /> ARCHIVED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221F1C] text-[#8C8478] border border-[#332E28] font-bold">
                            UNSOLVED
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold font-serif text-[#FAF6F0] truncate">
                        {isSolved ? trophy.name : `Classified Trophy #${c.caseNumber}`}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-mono font-medium truncate">
                        "{c.title}"
                      </p>
                    </div>
                  </div>

                  {/* Lore Description */}
                  <div className="bg-[#0D0B0A] border border-[#2B241C] rounded-xl p-3.5 mb-3 text-xs leading-relaxed font-sans text-[#DDD5C7]">
                    {isSolved ? (
                      <div>
                        <p className="font-semibold text-amber-200 mb-1">{trophy.description}</p>
                        <p className="text-[11px] text-[#A89E92] italic">"{trophy.lore}"</p>
                      </div>
                    ) : (
                      <p className="text-[#8C8478] italic">
                        Relic locked under magistrate seal. Solve Case #{c.caseNumber} to uncover this artifact and archive it into your bureau hall of fame.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="pt-3 border-t border-[#26201A] flex items-center justify-between gap-2">
                  {isSolved && history ? (
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#AAA194]">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.floor(history.timeSeconds / 60)}m {history.timeSeconds % 60}s
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {history.strikes} Strikes
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-[#6E665C]">Awaiting Conviction</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      onSelectCase(c);
                      onReturnToDesk();
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-[#2E2413] border border-amber-500 text-amber-300'
                        : 'bg-[#C69214] hover:bg-amber-400 text-black shadow-md'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Case' : 'Open Dossier'}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
