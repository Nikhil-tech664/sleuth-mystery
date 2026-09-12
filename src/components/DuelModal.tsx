import React, { useState } from 'react';
import type { Case } from '../types/game';
import { X, Swords, Copy, Check, Trophy } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface DuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  userBestTime?: number;
}

export const DuelModal: React.FC<DuelModalProps> = ({
  isOpen,
  onClose,
  currentCase,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [ghostRivalActive, setGhostRivalActive] = useState<boolean>(
    localStorage.getItem('sleuth_ghost_rival') === 'true'
  );

  if (!isOpen) return null;

  const duelUrl = `https://sleuth-daily.web.app/?duel=${currentCase.caseNumber}&case=${currentCase.id}`;

  const handleCopyLink = async () => {
    sound.playTypewriter();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `⚔️ I challenge you to a Detective Duel on Sleuth Case #${currentCase.caseNumber}!\nCan you catch the killer faster than me?\nPlay the duel: ${duelUrl}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleGhost = () => {
    sound.playStamp();
    const next = !ghostRivalActive;
    setGhostRivalActive(next);
    localStorage.setItem('sleuth_ghost_rival', next ? 'true' : 'false');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-red-600/60 bg-[#161412] p-6 shadow-2xl text-center overflow-hidden">
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

        <div className="w-14 h-14 rounded-2xl bg-[#2E1210] border border-red-500/50 flex items-center justify-center mx-auto mb-3 text-red-400 shadow-inner">
          <Swords className="w-7 h-7 animate-pulse" />
        </div>

        <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">
          HEAD-TO-HEAD SPEEDRUN SHOWDOWN
        </span>
        <h3 className="text-xl font-bold font-serif text-[#FAF6F0] mt-1 mb-2">
          1v1 Detective Duel
        </h3>
        <p className="text-xs text-[#AAA194] leading-relaxed font-sans mb-4">
          Challenge a rival detective or friend to a race against the clock on Case #{currentCase.caseNumber}.
          Whoever stamps the arrest warrant with the correct culprit in the lowest time wins the match!
        </p>

        {/* Duel Link Box */}
        <div className="bg-[#11100E] border border-[#332E28] rounded-xl p-3 mb-4 text-left">
          <label className="block text-[10px] font-mono text-[#C69214] font-bold uppercase mb-1">
            Shareable Duel Room Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={duelUrl}
              className="flex-1 bg-[#191715] border border-[#2B2722] rounded-lg px-3 py-1.5 text-xs font-mono text-[#DDD5C7] select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-[#C69214] hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Ghost Rival Speedrun Mode Switch */}
        <div className="bg-[#1E1916] border border-[#3A2E25] rounded-xl p-4 text-left flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏱️</div>
            <div>
              <div className="text-xs font-bold text-[#FAF6F0] font-sans">
                Ghost Rival Speedrun Mode
              </div>
              <div className="text-[10px] font-mono text-[#8C8478]">
                Race against the precinct's 2m 00s target ghost timer
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleGhost}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              ghostRivalActive
                ? 'bg-red-950 text-red-300 border border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                : 'bg-[#292218] text-[#D8CFBF] border border-[#3D3322]'
            }`}
          >
            {ghostRivalActive ? '⚔️ Ghost ACTIVE' : 'Activate Ghost'}
          </button>
        </div>

        {/* Stakes / XP bonus */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-amber-400">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Reward: +150 Bonus XP for victorious duels</span>
        </div>
      </div>
    </div>
  );
};
