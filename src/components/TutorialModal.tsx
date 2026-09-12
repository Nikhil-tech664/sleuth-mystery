import React, { useState } from 'react';
import { X, Search, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [slide, setSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '1. Inspect the Crime Scene',
      icon: <Search className="w-8 h-8 text-[#C69214]" />,
      description:
        'A crime occurred tonight. Click glowing evidence markers on the floorplan and review witness statements to discover who was where and with what weapon.',
      visual: (
        <div className="bg-[#141210] p-4 rounded-xl border border-[#332E28] flex items-center justify-center gap-4 text-center">
          <div className="p-3 bg-[#241E15] rounded-lg border border-[#C69214]/50 text-2xl">☕</div>
          <ArrowRight className="w-4 h-4 text-[#8C8478]" />
          <div className="text-xs font-typewriter text-[#DDD5C7]">
            "Broken espresso cup reveals victim was poisoned or struck during tea service."
          </div>
        </div>
      ),
    },
    {
      title: '2. Cross-Examine on the Logic Matrix',
      icon: <Check className="w-8 h-8 text-emerald-400" />,
      description:
        'Tap any cell in the logic matrix. One tap places ✕ (impossible). Two taps places ✓ (confirmed match). Use the Auto-Fill ✕ button to eliminate conflicting suspects instantly!',
      visual: (
        <div className="bg-[#141210] p-3 rounded-xl border border-[#332E28] flex items-center justify-center gap-3 font-mono">
          <div className="w-9 h-9 rounded bg-[#1C1A18] border border-[#3A352F] flex items-center justify-center text-xs text-[#777]">
            Empty
          </div>
          <span className="text-xs text-[#888]">→</span>
          <div className="w-9 h-9 rounded bg-red-950/60 border border-red-500/50 flex items-center justify-center text-sm font-bold text-red-400">
            ✕
          </div>
          <span className="text-xs text-[#888]">→</span>
          <div className="w-9 h-9 rounded bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-sm font-bold text-emerald-400">
            ✓
          </div>
        </div>
      ),
    },
    {
      title: '3. Issue the Arrest Warrant',
      icon: <ShieldCheck className="w-8 h-8 text-red-500" />,
      description:
        'Once your deductions pinpoint the single culprit, murder weapon, and crime room, click "File Accusation" to slam down the magistrate stamp and claim your detective badge!',
      visual: (
        <div className="bg-[#141210] p-4 rounded-xl border border-[#332E28] flex items-center justify-center">
          <div className="stamp-classified text-sm px-4 py-1.5 border-2">
            WARRANT ISSUED
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    sound.playTypewriter();
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      sound.playStamp();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-[#C69214]/60 bg-[#171513] p-6 shadow-2xl text-center overflow-hidden">
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

        <div className="w-14 h-14 rounded-2xl bg-[#241E15] border border-[#C69214]/40 flex items-center justify-center mx-auto mb-4 shadow-inner">
          {slides[slide].icon}
        </div>

        <span className="text-[10px] font-mono text-[#C69214] font-bold tracking-widest uppercase">
          ROOKIE GUMSHOE MANUAL ({slide + 1}/3)
        </span>
        <h3 className="text-xl font-bold font-serif text-[#FAF6F0] mt-1 mb-2">
          {slides[slide].title}
        </h3>
        <p className="text-xs text-[#AAA194] leading-relaxed font-sans mb-4">
          {slides[slide].description}
        </p>

        {/* Visual demo box */}
        <div className="mb-6">{slides[slide].visual}</div>

        {/* Step dots & Next button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2C2722]">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === slide ? 'w-5 bg-[#C69214]' : 'bg-[#3A352F]'
                }`}
              ></span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>{slide === slides.length - 1 ? "I'm Ready to Solve" : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
