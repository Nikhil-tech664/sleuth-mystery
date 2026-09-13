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
      <div className="lg:col-span-2 rounded-xl manila-dossier p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
        {/* Subtle brass eyelet */}
        <div className="absolute top-3 right-4 w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#8C6207] shadow-inner pointer-events-none" />

        <div>
          <div className="flex items-center justify-between border-b border-[#3E352B] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#C69214]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF6F0] font-mono">
                Recovered Clues & Statements ({clues.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#A89E92]">
              Tap to verify & mark off clues
            </span>
          </div>

          {/* Clues Stack */}
          <div className="space-y-3">
            {clues.map((clue, idx) => {
              const isChecked = !!checkedClues[clue.id];
              return (
                <div
                  key={clue.id}
                  onClick={() => {
                    sound.playCheckmark();
                    onToggleClue(clue.id);
                  }}
                  className={`group p-3.5 rounded-lg border cursor-pointer transition-all duration-200 flex items-start gap-3 select-none relative ${
                    isChecked
                      ? 'bg-[#181613] border-[#2E2822] opacity-65'
                      : 'vintage-index-card hover:scale-[1.01] hover:border-[#C69214]/60'
                  }`}
                >
                  <div className="mt-0.5 text-[#C69214] shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8C8478] group-hover:text-[#C69214]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-[#C69214]">
                        INDEX #{idx + 1}
                      </span>
                      {clue.source && (
                        <span className="text-[10px] text-[#A89E92] font-mono font-semibold">
                          • {clue.source}
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase font-bold ml-auto ${getClueBadgeStyle(
                          clue.type
                        )}`}
                      >
                        {clue.type}
                      </span>
                      {isChecked && (
                        <span className="text-[9px] font-stamp text-red-400 uppercase tracking-widest px-1.5 py-0.2 border border-red-500/60 rounded transform rotate-2 bg-red-950/40">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs md:text-sm font-typewriter leading-relaxed transition-all ${
                        isChecked
                          ? 'line-through text-[#827A6E] italic decoration-red-600/70 decoration-2'
                          : 'text-[#E8E1D5]'
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

        <div className="mt-4 pt-3 border-t border-[#3E352B] flex items-center justify-between text-[11px] font-mono text-[#8C8478]">
          <span className="flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Cross-reference with your elimination grid below
          </span>
          <span className="font-bold text-[#C69214]">
            {Object.values(checkedClues).filter(Boolean).length}/{clues.length} Analyzed
          </span>
        </div>
      </div>

      {/* Gumshoe's Canary Yellow Legal Pad */}
      <div className="rounded-xl overflow-hidden shadow-2xl flex flex-col border border-[#78350F]/50">
        {/* Top Dark Leather Binding with Brass Staples */}
        <div className="legal-pad-header p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100 font-mono">
              Detective's Field Notes
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300/80 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
            AUTO-SAVED
          </span>
        </div>

        {/* Lined Legal Pad Writing Surface */}
        <div className="legal-pad flex-1 p-4 pl-12 flex flex-col min-h-[260px]">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Jot down suspect alibis, timeline discrepancies, or motives here..."
            rows={10}
            className="w-full flex-1 bg-transparent border-none p-0 text-xs md:text-sm font-typewriter text-[#2B2319] placeholder-[#8A8068] focus:outline-none resize-none leading-6"
          />
        </div>
      </div>
    </div>
  );
};
