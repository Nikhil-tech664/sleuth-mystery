import React, { useState } from 'react';
import type { Case } from '../types/game';
import { X, Lock, Check, Sparkles, Shield, ArrowRight, BookOpen } from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { getProStatus, setProStatus } from '../utils/storage';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: Case[];
  currentCaseId: string;
  onSelectCase: (caseItem: Case) => void;
  completedCaseIds: string[];
  onCompleteAll?: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  cases,
  currentCaseId,
  onSelectCase,
  completedCaseIds,
  onCompleteAll,
}) => {
  const [isPro, setIsPro] = useState<boolean>(getProStatus());
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [keyError, setKeyError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleProForTesting = () => {
    sound.playStamp();
    const nextState = !isPro;
    setIsPro(nextState);
    setProStatus(nextState);
  };

  const handleApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (licenseKey.trim().toUpperCase() === 'SHERLOCK' || licenseKey.trim().length >= 6) {
      sound.playStamp();
      setIsPro(true);
      setProStatus(true);
      setKeyError(null);
    } else {
      sound.playError();
      setKeyError('Invalid Badge Code. (Tip: Use code "SHERLOCK" to test!)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl border-2 border-[#854D0E]/60 bg-[#161412] p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A2013] border border-[#C69214]/50 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#FAF7F2]">
                Cold Case Archive & Vault
              </h3>
              <p className="text-[11px] font-mono text-[#8C8478]">
                Access the precinct's unsolved records & historical homicide mysteries
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pro Banner (Monetization Teaser) */}
        <div className="bg-gradient-to-r from-[#291F0E] via-[#21190D] to-[#1C160B] border border-[#C69214]/40 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspector Gold Pass</span>
            </div>
            <p className="text-xs text-[#DDD5C7] leading-relaxed font-sans max-w-md">
              Unlock 100+ archived cases, noir hard-mode mysteries, and ad-free offline play.
              Support independent game creation for just <span className="font-bold text-amber-300">$3.99/mo</span>.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            {isPro ? (
              <div className="px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 justify-center">
                <Shield className="w-4 h-4" />
                <span>GOLD BADGE ACTIVE</span>
              </div>
            ) : (
              <a
                href="https://lemonsqueezy.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black text-xs font-mono font-bold uppercase tracking-wider text-center shadow-md transition-all hover:scale-105"
              >
                Get Pro Pass ($3.99)
              </a>
            )}

            {/* Test Toggle Button & Solve All */}
            <div className="flex items-center gap-2 justify-center">
              <button
                type="button"
                onClick={handleToggleProForTesting}
                className="text-[10px] font-mono text-[#8C8478] hover:text-[#DDD5C7] underline text-center"
              >
                {isPro ? 'Deactivate Pro' : '⚡ Pro Unlock'}
              </button>
              {onCompleteAll && (
                <>
                  <span className="text-stone-600 text-xs">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playVictory();
                      setIsPro(true);
                      setProStatus(true);
                      onCompleteAll();
                    }}
                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 font-bold underline text-center"
                  >
                    ⚡ Solve All Cases
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enter Code form */}
        {!isPro && (
          <form onSubmit={handleApplyKey} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Have a detective code? (Try: SHERLOCK)"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="flex-1 bg-[#121110] border border-[#2D2823] rounded-lg px-3 py-1.5 text-xs font-mono text-[#FAF7F2] placeholder-[#555047] focus:outline-none focus:border-[#C69214]/60"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#26221D] border border-[#3A352F] hover:bg-[#322C25] text-xs font-mono text-[#DDD5C7] font-semibold transition-colors"
            >
              Redeem
            </button>
          </form>
        )}
        {keyError && <p className="text-[11px] font-mono text-red-400 -mt-2 mb-3">{keyError}</p>}

        {/* Case Archives List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {cases.map((c) => {
            const isCurrent = c.id === currentCaseId;
            const isCompleted = completedCaseIds.includes(c.id);
            const isLocked = c.isVaultCase && !isPro;

            return (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#292215] border-[#C69214] ring-1 ring-[#C69214]'
                    : isLocked
                    ? 'bg-[#151312] border-[#26221E] opacity-75'
                    : 'bg-[#1E1B18] border-[#332E28] hover:border-[#4B443B]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-mono font-bold ${
                      isCompleted
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50'
                        : isLocked
                        ? 'bg-[#1B1917] text-[#635C52] border border-[#2B2723]'
                        : 'bg-[#262118] text-[#C69214] border border-[#3D3320]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : `#${c.caseNumber}`}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-[#FAF7F2] font-serif truncate">
                        {c.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2B2723] text-[#A89E92] font-mono uppercase">
                        {c.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C8478] truncate font-sans">
                      Victim: {c.victim.name} • {c.date}
                    </p>
                  </div>
                </div>

                <div>
                  {isCurrent ? (
                    <span className="text-xs font-mono font-bold text-[#C69214] px-2.5 py-1 bg-[#1A160E] rounded border border-[#C69214]/40">
                      Active
                    </span>
                  ) : isLocked ? (
                    <button
                      onClick={() => {
                        sound.playError();
                        alert('This case is in the Cold Vault! Unlock with the Gold Pass or code "SHERLOCK" to investigate.');
                      }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#211E1C] border border-[#332E28] text-[#8C8478] hover:text-amber-300 font-mono transition-colors"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playTypewriter();
                        onSelectCase(c);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#2B2620] hover:bg-[#C69214] text-[#DDD5C7] hover:text-black font-mono font-bold transition-colors"
                    >
                      <span>Open File</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
