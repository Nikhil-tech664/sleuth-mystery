import React, { useState } from 'react';
import { Lightbulb, X, ArrowRight, BookOpen } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface DetectiveQuickStartProps {
  onOpenTutorial?: () => void;
}

export const DetectiveQuickStart: React.FC<DetectiveQuickStartProps> = ({ onOpenTutorial }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sleuth_quickstart_dismissed_v1') === 'true';
    } catch {
      return false;
    }
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    sound.playCheckmark();
    setIsDismissed(true);
    try {
      localStorage.setItem('sleuth_quickstart_dismissed_v1', 'true');
    } catch {}
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#241E17] via-[#1D1813] to-[#241E17] border-2 border-amber-600/60 p-4 shadow-xl text-stone-200 animate-in fade-in slide-in-from-top-3">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-[#3E3427] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            Inspector's 30-Second Quick Start
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="text-[11px] font-mono text-stone-400 hover:text-white px-2 py-0.5 rounded hover:bg-stone-800 transition-colors flex items-center gap-1"
          title="Dismiss guide"
        >
          <span>Dismiss</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-2">
        {/* Step 1 */}
        <div className="bg-[#171411] border border-[#382F24] rounded-xl p-3 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            1
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-amber-100">
              Read the Incident & Clues
            </div>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5 leading-snug">
              Examine the crime report, suspect profiles, and recovered statements below.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#171411] border border-[#382F24] rounded-xl p-3 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            2
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-amber-100">
              Mark the Logic Matrix
            </div>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5 leading-snug">
              Tap a cell once for <span className="text-red-400 font-bold">✕ (Impossible)</span>, or twice for{' '}
              <span className="text-emerald-400 font-bold">✓ (Confirmed)</span>.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#171411] border border-[#382F24] rounded-xl p-3 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            3
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-amber-100">
              Accuse the Culprit!
            </div>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5 leading-snug">
              Once you confirm who held the weapon at the scene, click <strong>Accuse Culprit</strong> to convict!
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Dismiss / Full Tutorial Trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-[#3E3427] mt-2 text-[11px] font-mono">
        {onOpenTutorial ? (
          <button
            onClick={() => {
              sound.playTypewriter();
              onOpenTutorial();
            }}
            className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Need a detailed walkthrough? Open Tutorial</span>
          </button>
        ) : (
          <span className="text-stone-400">Zero intrusive ads • Pure logic deduction</span>
        )}

        <button
          onClick={handleDismiss}
          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5"
        >
          <span>I'm Ready to Deduce</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
