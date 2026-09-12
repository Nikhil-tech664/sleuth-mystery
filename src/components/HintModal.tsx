import React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintText?: string;
  hintsUsed: number;
  onUseHint: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintText,
  hintsUsed,
  onUseHint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-amber-500/60 bg-[#161412] p-6 shadow-2xl text-center overflow-hidden">
        <button
          type="button"
          onClick={() => {
            sound.playTypewriter();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#292215] border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
          <Lightbulb className="w-6 h-6 animate-pulse" />
        </div>

        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
          SCOTLAND YARD FORENSIC DISPATCH
        </span>
        <h3 className="text-lg font-bold font-serif text-[#FAF7F2] mt-1 mb-2">
          Stuck on a Deduction Contradiction?
        </h3>

        <div className="bg-[#11100E] border border-[#2B2723] rounded-xl p-4 my-4 font-typewriter text-xs md:text-sm text-[#DDD5C7] leading-relaxed text-left">
          {hintText ? (
            <div>
              <span className="text-amber-400 font-bold block mb-1">
                💡 Inspector's Lead:
              </span>
              "{hintText}"
            </div>
          ) : (
            <div>
              "Look closely at the autopsy report and weapon categories. Once you confirm the murder weapon type (blunt vs poison vs blade), eliminate every other weapon category for the cause of death!"
            </div>
          )}
        </div>

        <p className="text-[11px] font-sans text-[#8C8478] mb-4">
          Hints used this investigation: <span className="text-amber-300 font-mono font-bold">{hintsUsed}</span>
        </p>

        <button
          type="button"
          onClick={() => {
            sound.playTypewriter();
            onUseHint();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
        >
          Return to Investigation Board
        </button>
      </div>
    </div>
  );
};
