import React, { useState } from 'react';
import type { Case, UserStats } from '../types/game';
import { Search, ShieldCheck, ArrowRight, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CaseArchiveViewProps {
  cases: Case[];
  currentCaseId: string;
  stats: UserStats;
  onSelectCase: (c: Case) => void;
  onReturnToDesk: () => void;
}

export const CaseArchiveView: React.FC<CaseArchiveViewProps> = ({
  cases,
  currentCaseId,
  stats,
  onSelectCase,
  onReturnToDesk,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Standard' | 'Noir' | 'Hardboiled'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const solvedCaseIds = Object.keys(stats.history);

  const filteredCases = cases.filter((c) => {
    const matchesDiff = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incidentReport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.victim.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Return Action */}
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
                Precinct Cold Case Archives
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-500/40">
                {cases.length} DOSSIERS
              </span>
            </div>
            <p className="text-xs text-[#8C8478] font-sans mt-0.5">
              Browse historic precinct crime files across multiple eras. Select any dossier to investigate.
            </p>
          </div>
        </div>

        {/* Search Bar & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8478] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dossiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#181614] border border-[#353029] text-xs font-mono text-[#DDD5C7] focus:outline-none focus:border-amber-500 w-40 sm:w-48"
            />
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex gap-1 bg-[#181614] p-1 rounded-lg border border-[#353029]">
            {(['all', 'Standard', 'Noir', 'Hardboiled'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setDifficultyFilter(diff);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                  difficultyFilter === diff
                    ? 'bg-[#C69214] text-black shadow-md'
                    : 'text-[#8C8478] hover:text-[#DDD5C7]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c) => {
          const isSolved = solvedCaseIds.includes(c.id);
          const isCurrent = c.id === currentCaseId;
          const history = stats.history[c.id];

          return (
            <div
              key={c.id}
              className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                isCurrent
                  ? 'border-amber-500 bg-[#1A1610] shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                  : 'border-[#332E28] bg-[#141210] hover:border-[#52493E]'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#272118] text-amber-400 border border-amber-600/40 font-bold uppercase">
                    Case #{c.caseNumber} • {c.difficulty}
                  </span>
                  {isSolved ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3" /> CLOSED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221F1C] text-[#8C8478] border border-[#332E28] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold font-serif text-[#FAF6F0] mb-1 leading-snug">
                  {c.title}
                </h3>
                <p className="text-[11px] font-mono text-[#8C8478] mb-3">
                  Victim: {c.victim.name} ({c.victim.role})
                </p>

                {/* Incident Snippet */}
                <p className="text-xs text-[#AAA194] line-clamp-3 leading-relaxed font-sans mb-4">
                  "{c.incidentReport}"
                </p>

                {/* Suspect Avatars Preview */}
                <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-[#0D0C0B] border border-[#26221D]">
                  <span className="text-[10px] font-mono text-[#8C8478]">Suspects:</span>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {c.suspects.map((s) => (
                      <div
                        key={s.id}
                        title={`${s.name} (${s.alias})`}
                        className="w-7 h-7 rounded-full bg-[#1E1B17] border-2 border-[#332E28] flex items-center justify-center text-xs shadow-md"
                      >
                        {s.avatarEmoji}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#524A3F] ml-auto">
                    {c.hotspots?.length || 3} Hotspots
                  </span>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-3 border-t border-[#26221D] flex items-center justify-between gap-2">
                {isSolved && history ? (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#AAA194]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Clock className="w-3 h-3" />
                      {Math.floor(history.timeSeconds / 60)}m {history.timeSeconds % 60}s
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <AlertTriangle className="w-3 h-3" />
                      {history.strikes}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-[#6E665C]">Awaiting Conviction</span>
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
                  <span>{isCurrent ? 'Current Case' : 'Investigate'}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
