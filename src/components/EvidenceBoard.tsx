import React from 'react';
import type { Clue } from '../types/game';
import { CheckSquare, Square, Search, Edit3, Fingerprint } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface EvidenceBoardProps {
  clues: Clue[];
  checkedClues: Record<string, boolean>;
  onToggleClue: (clueId: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  clues,
  checkedClues,
  onToggleClue,
  notes,
  onNotesChange,
}) => {
  const getClueBadgeStyle = (type: Clue['type']) => {
    switch (type) {
      case 'witness':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/40';
      case 'forensics':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
      case 'alibi':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 'scene':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Evidence & Clues List */}
      <div className="lg:col-span-2 rounded-xl border border-[#3A352F] bg-[#1C1A17] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#C69214]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF6F0] font-mono">
                Recovered Clues & Statements ({clues.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8C8478]">
              Tap to check off clues as you deduce
            </span>
          </div>

          {/* Clues Stack */}
          <div className="space-y-2.5">
            {clues.map((clue, idx) => {
              const isChecked = !!checkedClues[clue.id];
              return (
                <div
                  key={clue.id}
                  onClick={() => {
                    sound.playCheckmark();
                    onToggleClue(clue.id);
                  }}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all duration-150 flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-[#151412] border-[#2A2621] opacity-60'
                      : 'bg-[#221F1C] border-[#38332B] hover:border-[#C69214]/50 hover:bg-[#282420]'
                  }`}
                >
                  <div className="mt-0.5 text-[#C69214]">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8C8478] group-hover:text-[#C69214]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#A89E92]">
                        CLUE #{idx + 1}
                      </span>
                      {clue.source && (
                        <span className="text-[10px] text-[#C69214] font-mono font-semibold">
                          • {clue.source}
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase font-bold ml-auto ${getClueBadgeStyle(
                          clue.type
                        )}`}
                      >
                        {clue.type}
                      </span>
                    </div>
                    <p
                      className={`text-xs md:text-sm font-typewriter leading-snug transition-all ${
                        isChecked
                          ? 'line-through text-[#787166]'
                          : 'text-[#E0D8CB]'
                      }`}
                    >
                      {clue.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#292521] flex items-center justify-between text-[11px] font-mono text-[#8C8478]">
          <span className="flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Cross-reference with your deduction grid below
          </span>
          <span>
            {Object.values(checkedClues).filter(Boolean).length}/{clues.length} Checked
          </span>
        </div>
      </div>

      {/* Gumshoe's Scrap Notebook */}
      <div className="rounded-xl border border-[#3A352F] bg-[#171513] p-5 shadow-lg flex flex-col">
        <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#C69214]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF6F0] font-mono">
              Gumshoe Scratchpad
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#787166]">Auto-saved</span>
        </div>

        <p className="text-xs text-[#999083] mb-2 font-sans">
          Jot down hypotheses, timestamps, or elimination notes:
        </p>

        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g. Finch couldn't have been in the cellar, so..."
          rows={7}
          className="w-full flex-1 rounded-lg bg-[#11100E] border border-[#2B2723] p-3 text-xs md:text-sm font-typewriter text-[#DDD5C7] placeholder-[#555047] focus:outline-none focus:border-[#C69214]/60 resize-none"
        />
      </div>
    </div>
  );
};
