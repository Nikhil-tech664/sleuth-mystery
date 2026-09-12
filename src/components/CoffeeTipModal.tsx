import React, { useState } from 'react';
import { Coffee, X, ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CoffeeTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  bmcUsername?: string;
}

export const CoffeeTipModal: React.FC<CoffeeTipModalProps> = ({
  isOpen,
  onClose,
  bmcUsername = 'nikhil',
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const bmcUrl = `https://buymeacoffee.com/${bmcUsername}`;

  const TIERS = [
    { amount: 3, label: 'The Rookie Espresso', coffees: '☕', desc: 'A single shot of dark roast to fuel the night shift.' },
    { amount: 5, label: 'The Detective Double-Shot', coffees: '☕☕', desc: 'Our most popular tip! Keeps the crime lab running.', popular: true },
    { amount: 10, label: 'The Midnight Cold Brew', coffees: '☕☕☕', desc: 'Powers new cases, art portraits, and audio tracks.' },
    { amount: 25, label: 'Patron of Scotland Yard', coffees: '👑☕', desc: 'Legendary supporter badge & eternal precinct gratitude.' },
  ];

  const handleDonate = () => {
    sound.playVictory();
    window.open(bmcUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    sound.playTypewriter();
    navigator.clipboard.writeText(bmcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border-2 border-[#C69214] bg-[#171513] p-6 shadow-2xl text-[#FAF7F2]">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playTypewriter();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#221F1C] border border-[#38322B] text-[#AAA194] hover:text-[#FAF7F2] hover:bg-[#2F2922] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Steaming Header Badge */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-3xl shadow-[0_0_24px_rgba(245,158,11,0.4)] border border-amber-300">
              ☕
            </div>
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-red-400 animate-pulse">
              100% FREE
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#C69214] uppercase tracking-widest font-bold">
            PRECINCT REFRESHMENT FUND
          </div>
          <h2 className="text-xl font-bold font-serif text-[#FAF7F2] tracking-wide mt-0.5">
            Buy the Detective a Coffee
          </h2>
          <p className="text-xs text-[#A89E92] font-sans mt-1.5 leading-relaxed max-w-xs">
            SLEUTH is an indie passion project with <strong className="text-amber-300">zero ads</strong> and <strong className="text-amber-300">no paywalls</strong>. If you love cracking daily cases, help fuel development with a warm cup of coffee!
          </p>
        </div>

        {/* Tip Tiers Grid */}
        <div className="space-y-2 mb-5">
          {TIERS.map((tier) => (
            <button
              key={tier.amount}
              type="button"
              onClick={() => {
                sound.playTypewriter();
                setSelectedAmount(tier.amount);
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedAmount === tier.amount
                  ? 'bg-amber-950/70 border-amber-500 ring-1 ring-amber-400 shadow-md scale-[1.01]'
                  : 'bg-[#1E1B17] border-[#332E28] hover:border-[#4B443B] text-[#DDD5C7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{tier.coffees}</span>
                <div>
                  <div className="text-xs font-bold font-serif flex items-center gap-1.5">
                    <span>{tier.label}</span>
                    {tier.popular && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-stone-900 font-mono font-bold rounded">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8C8478] font-sans">{tier.desc}</div>
                </div>
              </div>
              <div className="text-sm font-mono font-bold text-amber-400 shrink-0 ml-2">
                ${tier.amount}
              </div>
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleDonate}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-mono font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 border border-amber-300 active:scale-98 transition-all"
        >
          <Coffee className="w-4 h-4 fill-current text-stone-950" />
          <span>Support on Buy Me a Coffee (${selectedAmount})</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Secondary Share / Direct URL */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#7D756B] pt-2 border-t border-[#25221E]">
          <span className="flex items-center gap-1 text-emerald-400/90">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Official Checkout</span>
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="hover:text-amber-400 text-[#C69214] underline flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <span>Copy Tip Link</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
