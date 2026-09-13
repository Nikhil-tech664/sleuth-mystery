import React, { useState } from 'react';
import type { Case, DeductionState } from '../types/game';
import { X, Share2, Check, Trophy, Clock, AlertCircle, Coffee, ArrowRight, Newspaper } from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { generateShareText, generateShareEmojiGrid, copyShareTextToClipboard } from '../utils/share';
import { getRankForCaseCount } from '../data/ranks';
import { DetectiveBadgeCanvas } from './DetectiveBadgeCanvas';
import { NewspaperModal } from './NewspaperModal';

interface SolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  state: DeductionState;
  totalWins: number;
  streak: number;
  onOpenVault: () => void;
  onOpenCoffee?: () => void;
}

export const SolvedModal: React.FC<SolvedModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  state,
  totalWins,
  streak,
  onOpenVault,
  onOpenCoffee,
}) => {
  const [copied, setCopied] = useState(false);
  const [isNewspaperOpen, setIsNewspaperOpen] = useState(false);

  if (!isOpen) return null;

  const elapsedSeconds = state.solvedTime
    ? Math.floor((state.solvedTime - state.startTime) / 1000)
    : 120;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  const rank = getRankForCaseCount(totalWins);

  const handleShare = async () => {
    sound.playTypewriter();
    const shareText = generateShareText(currentCase, state, totalWins);
    const success = await copyShareTextToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const culprit = currentCase.suspects.find((s) => s.id === currentCase.solution.culpritId);
  const weapon = currentCase.weapons.find((w) => w.id === currentCase.solution.weaponId);
  const location = currentCase.locations.find((l) => l.id === currentCase.solution.locationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-emerald-600/50 bg-[#161412] p-6 shadow-2xl text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTypewriter();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vintage Solved Stamp */}
        <div className="my-2">
          <div className="inline-block px-5 py-2 border-4 border-emerald-500 rounded-lg text-2xl font-black font-stamp text-emerald-400 tracking-widest stamp-solved shadow-lg">
            CASE CLOSED
          </div>
        </div>

        <h3 className="text-xl font-bold font-serif text-[#FAF7F2] mt-3">
          Magnificent Work, Inspector!
        </h3>
        <p className="text-xs text-[#A89E92] font-typewriter mt-1">
          The magistrate has accepted your evidence. The precinct salutes your sharp mind.
        </p>

        {/* Key Stats Pill Bar */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="bg-[#201D1A] border border-[#332E28] rounded-xl p-2.5">
            <div className="text-[10px] font-mono text-[#8C8478] flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-[#C69214]" /> TIME
            </div>
            <div className="text-base font-bold font-mono text-[#FAF7F2] mt-0.5">
              {timeFormatted}
            </div>
          </div>

          <div className="bg-[#201D1A] border border-[#332E28] rounded-xl p-2.5">
            <div className="text-[10px] font-mono text-[#8C8478] flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-400" /> STRIKES
            </div>
            <div className="text-base font-bold font-mono text-[#FAF7F2] mt-0.5">
              {state.strikes}
            </div>
          </div>

          <div className="bg-[#201D1A] border border-[#332E28] rounded-xl p-2.5">
            <div className="text-[10px] font-mono text-[#8C8478] flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> STREAK
            </div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              {streak} Days
            </div>
          </div>
        </div>

        {/* Detective Rank Badge */}
        <div className="bg-[#231F1B] border border-[#C69214]/40 rounded-xl p-3 mb-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{rank.badge}</div>
            <div>
              <div className="text-xs text-[#C69214] font-mono font-bold uppercase tracking-wider">
                Current Detective Rank
              </div>
              <div className="text-sm font-bold text-[#FAF7F2] font-serif">
                {rank.title}
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] font-mono text-[#8C8478]">
            {totalWins} Solved
          </div>
        </div>

        {/* The Verdict Revealed */}
        <div className="bg-[#1C1916] border border-[#2D2823] rounded-xl p-3 text-left mb-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#C69214] font-bold mb-1">
            Official Forensic Summary
          </div>
          <div className="text-xs text-[#FAF7F2] font-semibold mb-1">
            Culprit: <span className="text-red-400">{culprit?.name}</span> with the{' '}
            <span className="text-amber-300">{weapon?.name}</span> at{' '}
            <span className="text-blue-300">{location?.name}</span>.
          </div>
          <p className="text-xs text-[#AAA194] leading-relaxed font-sans">
            {currentCase.solution.explanation}
          </p>
        </div>

        {/* Detective Certificate Polaroid Card */}
        <div className="mb-4 text-left">
          <DetectiveBadgeCanvas
            currentCase={currentCase}
            state={state}
            rank={rank}
            totalWins={totalWins}
          />
        </div>

        {/* Live Wordle Emoji Grid Box */}
        <div className="bg-[#12100E] border border-[#2D2823] rounded-xl p-3 mb-4 text-center">
          <div className="text-[10px] font-mono text-[#8C8478] uppercase mb-1 flex items-center justify-center gap-1">
            <span>Deduction Footprint (Spoiler-Free)</span>
          </div>
          <div className="font-mono text-xs whitespace-pre leading-relaxed tracking-widest text-[#FAF7F2] select-all bg-[#0A0908] p-2 rounded-lg border border-[#221D17]">
            {generateShareEmojiGrid(currentCase, state)}
          </div>
        </div>

        {/* Share & Newspaper Buttons */}
        <div className="space-y-2.5">
          {/* Victorian Front-Page Newspaper Feature */}
          <button
            onClick={() => {
              sound.playTypewriter();
              setIsNewspaperOpen(true);
            }}
            className="w-full py-3 rounded-xl bg-[#2D261F] hover:bg-[#3D3328] border-2 border-amber-600/60 text-amber-200 font-serif font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>Read & Download Daily Chronicle Newspaper (.PNG)</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {copied ? <Check className="w-5 h-5 text-black" /> : <Share2 className="w-5 h-5 text-black" />}
            <span>{copied ? 'Copied Results to Clipboard!' : 'Share Spoiler-Free Score'}</span>
          </button>

          {/* Cold Case Vault Upsell / Next Case */}
          <button
            onClick={() => {
              sound.playTypewriter();
              onClose();
              onOpenVault();
            }}
            className="w-full py-2.5 rounded-xl bg-[#221F1C] border border-[#38332B] hover:border-[#C69214]/60 text-[#D8D0C2] hover:text-[#FAF7F2] font-mono text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Hungry for more? Open Cold Case Vault</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C69214]" />
          </button>
        </div>

        {/* Buy Me a Coffee / Tip Jar (Monetization link) */}
        <div className="mt-4 pt-3 border-t border-[#25221E] flex items-center justify-center gap-2 text-xs text-[#8C8478]">
          <Coffee className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
          <span>Enjoying the mystery?</span>
          {onOpenCoffee ? (
            <button
              type="button"
              onClick={() => {
                sound.playTypewriter();
                onOpenCoffee();
              }}
              className="text-[#C69214] underline hover:text-amber-400 font-semibold cursor-pointer"
            >
              Tip the precinct ☕ (UPI / Cards)
            </button>
          ) : (
            <a
              href="https://rzp.io/rzp/mDXzulzR"
              target="_blank"
              rel="noreferrer"
              className="text-[#C69214] underline hover:text-amber-400 font-semibold"
            >
              Tip the precinct ☕ (UPI / Cards)
            </a>
          )}
        </div>
      </div>

      {/* Victorian Front-Page Newspaper Modal */}
      <NewspaperModal
        isOpen={isNewspaperOpen}
        onClose={() => setIsNewspaperOpen(false)}
        currentCase={currentCase}
        state={state}
        rank={rank.title}
        totalWins={totalWins}
      />
    </div>
  );
};
