import React, { useRef } from 'react';
import type { Case, DeductionState, DetectiveRank } from '../types/game';
import { Check, Award, Shield } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface DetectiveBadgeCanvasProps {
  currentCase: Case;
  state: DeductionState;
  rank: DetectiveRank;
  totalWins: number;
}

export const DetectiveBadgeCanvas: React.FC<DetectiveBadgeCanvasProps> = ({
  currentCase,
  state,
  rank,
  totalWins,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = React.useState(false);

  const elapsedSeconds = state.solvedTime
    ? Math.floor((state.solvedTime - state.startTime) / 1000)
    : 114;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  const handleDownload = () => {
    sound.playStamp();
    // Simulate badge certificate download by taking text summary
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="bg-[#1C1916] border-2 border-[#C69214]/50 rounded-2xl p-5 shadow-2xl text-center relative overflow-hidden">
      {/* Background seal watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
        🦅
      </div>

      <div ref={cardRef} className="relative z-10">
        {/* Certificate Top Header */}
        <div className="flex items-center justify-between border-b border-[#3A332B] pb-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C69214] uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>PRECINCT SPECIAL INVESTIGATIONS DIVISION</span>
          </div>
          <span className="text-[10px] font-mono text-[#8C8478]">
            ID: #{currentCase.caseNumber}-2026
          </span>
        </div>

        {/* Certificate Title */}
        <div className="text-xl font-black font-serif text-[#FAF6F0] tracking-wide mb-1">
          OFFICIAL COMMENDATION OF SOLVE
        </div>
        <p className="text-xs text-[#A89E92] font-typewriter">
          This certifies the successful identification of the perpetrator in the homicide of
        </p>
        <div className="text-sm font-bold font-serif text-red-400 my-1">
          {currentCase.victim.name}
        </div>

        {/* Polaroid Style Middle Card */}
        <div className="bg-[#141210] border border-[#2F2922] rounded-xl p-4 my-3 flex items-center justify-around">
          <div className="text-center">
            <div className="text-3xl mb-1">{rank.badge}</div>
            <div className="text-xs font-bold font-serif text-[#FAF6F0]">{rank.title}</div>
            <div className="text-[10px] font-mono text-[#8C8478]">{totalWins} Cases Solved</div>
          </div>

          <div className="h-10 w-px bg-[#2F2922]"></div>

          <div className="text-center">
            <div className="text-xs font-mono text-[#8C8478] uppercase">INVESTIGATION TIME</div>
            <div className="text-xl font-bold font-mono text-amber-400">{timeFormatted}</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {state.strikes === 0 ? '★ FLAWLESS (0 STRIKES)' : `${state.strikes} STRIKES`}
            </div>
          </div>
        </div>

        {/* Official Rubber Stamp */}
        <div className="my-2">
          <span className="stamp-solved px-4 py-1 text-sm tracking-widest font-black">
            VERIFIED GUILTY • CASE CLOSED
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#2F2922] flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg bg-[#241E15] border border-[#C69214]/50 hover:bg-[#322A1E] text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Award className="w-3.5 h-3.5 text-amber-400" />}
          <span>{downloaded ? 'Commendation Saved!' : 'Save Detective Badge'}</span>
        </button>
      </div>
    </div>
  );
};
