import React, { useState } from 'react';
import { Coffee, X, ExternalLink, ShieldCheck, Check, Zap } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CoffeeTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  razorpayUrl?: string;
}

export const CoffeeTipModal: React.FC<CoffeeTipModalProps> = ({
  isOpen,
  onClose,
  razorpayUrl = 'https://rzp.io/rzp/mDXzulzR',
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const TIERS = [
    { id: 0, amount: '₹49 (~$1)', label: 'The Rookie Espresso', coffees: '☕', desc: 'A warm shot of dark roast to fuel the night shift.' },
    { id: 1, amount: '₹99 (~$2)', label: 'The Detective Double-Shot', coffees: '☕☕', desc: 'Our most popular tip! Keeps the precinct running.', popular: true },
    { id: 2, amount: '₹249 (~$5)', label: 'The Midnight Cold Brew', coffees: '☕☕☕', desc: 'Powers new cases, oil portraits, and audio tracks.' },
    { id: 3, amount: '₹499 (~$10)', label: 'Patron of Scotland Yard', coffees: '👑☕', desc: 'Legendary detective badge & eternal precinct gratitude.' },
  ];

  const handleDonate = () => {
    sound.playVictory();
    window.open(razorpayUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    sound.playTypewriter();
    navigator.clipboard.writeText(razorpayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
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
            <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-emerald-400 animate-pulse">
              100% FREE
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#C69214] uppercase tracking-widest font-bold">
            PRECINCT REFRESHMENT FUND
          </div>
          <h2 className="text-xl font-bold font-serif text-[#FAF7F2] tracking-wide mt-0.5">
            Support the Detective & Fuel the Shift
          </h2>
          <p className="text-xs text-[#A89E92] font-sans mt-1.5 leading-relaxed max-w-xs">
            SLEUTH is an indie passion project with <strong className="text-amber-300">zero ads</strong> and <strong className="text-amber-300">no paywalls</strong>. If you enjoy cracking daily cases, support development with a quick coffee tip!
          </p>

          {/* Payment Badges (UPI, Cards, NetBanking) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-[10px] font-mono text-stone-300">
            <span className="px-2 py-0.5 rounded-full bg-[#241F1A] border border-amber-500/30 flex items-center gap-1 text-amber-300">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>UPI (GPay / PhonePe / Paytm)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#241F1A] border border-amber-500/30 text-stone-300">
              Debit & Credit Cards
            </span>
          </div>
        </div>

        {/* Tip Tiers Grid */}
        <div className="space-y-2 mb-5">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                sound.playTypewriter();
                setSelectedTier(tier.id);
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedTier === tier.id
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
              <div className="text-xs font-mono font-bold text-amber-400 shrink-0 ml-2">
                {tier.amount}
              </div>
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleDonate}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-mono font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 border border-amber-300 active:scale-98 transition-all cursor-pointer"
        >
          <Coffee className="w-4 h-4 fill-current text-stone-950" />
          <span>Tip via Razorpay (UPI / Cards)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Secondary Trust Badges & Direct Link */}
        <div className="mt-3.5 flex items-center justify-between text-[11px] font-mono text-[#7D756B] pt-2.5 border-t border-[#25221E]">
          <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Razorpay 256-bit Encrypted</span>
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
