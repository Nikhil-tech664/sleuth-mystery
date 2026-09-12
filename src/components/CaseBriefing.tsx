import React, { useState, useEffect } from 'react';
import type { Case } from '../types/game';
import { FileText, Skull, AlertCircle, FastForward } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CaseBriefingProps {
  currentCase: Case;
  onMakeAccusation: () => void;
  isSolved: boolean;
}

export const CaseBriefing: React.FC<CaseBriefingProps> = ({
  currentCase,
  onMakeAccusation,
  isSolved,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  useEffect(() => {
    let index = 0;
    const fullText = currentCase.incidentReport;
    setDisplayedText('');
    setIsTypingComplete(false);

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        if (index % 5 === 0) {
          sound.playTypewriter();
        }
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [currentCase.id, currentCase.incidentReport]);

  const handleSkip = () => {
    sound.playTypewriter();
    setDisplayedText(currentCase.incidentReport);
    setIsTypingComplete(true);
  };

  return (
    <div className="relative rounded-xl border border-[#3A352F] bg-[#1C1A17] p-6 shadow-xl overflow-hidden">
      {/* Vintage watermark stamp */}
      <div className="absolute top-4 right-6 pointer-events-none opacity-20 md:opacity-30">
        <div
          className={`text-2xl md:text-3xl font-black font-stamp px-4 py-1.5 border-4 rounded ${
            isSolved ? 'stamp-solved text-emerald-500 border-emerald-500' : 'stamp-classified'
          }`}
        >
          {isSolved ? 'CASE CLOSED' : 'CONFIDENTIAL DOSSIER'}
        </div>
      </div>

      {/* Case Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C2824] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#C69214] font-mono uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>
              Incident File #{currentCase.caseNumber} • Classification: {currentCase.difficulty}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#F5EFEB] tracking-wide">
            {currentCase.title}
          </h2>
        </div>

        {/* Big Accusation Trigger */}
        <button
          type="button"
          onClick={onMakeAccusation}
          className={`px-5 py-2.5 rounded-lg font-bold text-sm font-mono tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
            isSolved
              ? 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/50'
              : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white border border-red-500/40 hover:scale-105 active:scale-95'
          }`}
        >
          <Skull className="w-4 h-4" />
          <span>{isSolved ? 'Review Verdict' : 'File Accusation'}</span>
        </button>
      </div>

      {/* Grid: Incident Synopsis & Victim Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Incident Narrative with Teletype Streaming */}
        <div className="md:col-span-2 bg-[#151312] border border-[#2B2723] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A89E92] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="font-bold text-red-400">URGENT TELETYPE WIRE</span>
              </h3>
              {!isTypingComplete && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[10px] font-mono text-[#C69214] hover:underline flex items-center gap-1"
                >
                  <FastForward className="w-3 h-3" /> Skip
                </button>
              )}
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[#DCD4C7] font-typewriter min-h-[4rem]">
              "{displayedText}"
              {!isTypingComplete && <span className="animate-pulse text-[#C69214] font-black">▌</span>}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#221F1B] text-[10px] font-mono text-[#736B60] flex items-center justify-between">
            <span>TRANSMITTED: PRECINCT HEADQUARTERS</span>
            <span>WIRE ID: #{currentCase.caseNumber}-A</span>
          </div>
        </div>

        {/* Victim Card */}
        <div className="bg-[#181614] border border-[#332E28] rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold mb-2 flex items-center justify-between">
              <span>Deceased Victim</span>
              <Skull className="w-3.5 h-3.5 text-red-400/80" />
            </div>
            
            <div className="flex items-start gap-3 mb-2.5">
              {currentCase.victim.portraitUrl && (
                <div className="relative w-14 h-14 rounded-lg bg-[#121110] border-2 border-amber-600/50 overflow-hidden shadow-inner shrink-0">
                  <img
                    src={currentCase.victim.portraitUrl}
                    alt={currentCase.victim.name}
                    className="w-full h-full object-cover object-top filter contrast-105"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-[#FAF6F0] font-serif leading-tight">
                  {currentCase.victim.name}
                </div>
                <div className="text-xs text-[#C69214] font-mono mt-0.5 leading-tight">
                  {currentCase.victim.role}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#AAA194] leading-normal font-sans">
              {currentCase.victim.description}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#292521] text-[11px] font-mono text-[#7D756B] flex items-center justify-between">
            <span>Status: Deceased on scene</span>
            <span className="text-red-400/80 font-bold">M.E. Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
