import React, { useState } from 'react';
import type { UserStats, Case } from '../types/game';
import { sound } from '../audio/soundEffects';
import { ShieldAlert, Lock, Unlock, Eye, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface SyndicateMetaViewProps {
  stats: UserStats;
  cases: Case[];
  onSelectCase: (caseItem: Case) => void;
  onReturnToDesk: () => void;
}

export interface SyndicateFragment {
  caseId: string;
  caseNumber: number;
  title: string;
  codename: string;
  symbol: string;
  secretLore: string;
  cipherWord: string;
}

const SYNDICATE_FRAGMENTS: SyndicateFragment[] = [
  {
    caseId: 'case-daily-today',
    caseNumber: 42,
    title: 'The Bitter Roast',
    codename: 'FRAGMENT ALPHA: THE REPOSSESSION DEED',
    symbol: '☕',
    secretLore:
      'A forged mortgage deed bearing the wax seal of The Midnight Council. Lord Sterling was systematically buying out botanical labs to synthesize a sedative compound.',
    cipherWord: 'ORCHIS',
  },
  {
    caseId: 'case-vault-41',
    caseNumber: 41,
    title: 'Curtain Call for the Tenor',
    codename: 'FRAGMENT BETA: THE OPERA TELEGRAM',
    symbol: '🎭',
    secretLore:
      'Maestro Vivaldi received £5,000 to replace the prima donna with a courier who could smuggle diplomatic microdots inside costume jewelry.',
    cipherWord: 'ARIA',
  },
  {
    caseId: 'case-vault-40',
    caseNumber: 40,
    title: 'Midnight Express',
    codename: 'FRAGMENT GAMMA: THE VIENNA BONDS',
    symbol: '🚂',
    secretLore:
      'The slain diamond dealer was laundering war bonds for Council front companies operating in Zurich and Geneva.',
    cipherWord: 'FERRUM',
  },
  {
    caseId: 'case-vault-39',
    caseNumber: 39,
    title: 'Death on Neon Boardwalk',
    codename: 'FRAGMENT DELTA: THE ARSON SLIP',
    symbol: '🎡',
    secretLore:
      'The Boardwalk pier was slated for deliberate destruction so Council developers could build a private submarine refueling dock.',
    cipherWord: 'FULGUR',
  },
  {
    caseId: 'case-vault-38',
    caseNumber: 38,
    title: 'The Poisoned Quill',
    codename: 'FRAGMENT EPSILON: THE SANATORIUM LEDGER',
    symbol: '💉',
    secretLore:
      'Blackwood Sanatorium held political dissidents who were declared insane to conceal their discoveries regarding Council finances.',
    cipherWord: 'NOX',
  },
  {
    caseId: 'case-vault-37',
    caseNumber: 37,
    title: 'Murder at Midnight Speakeasy',
    codename: 'FRAGMENT ZETA: THE GANG PAYOFF',
    symbol: '🎷',
    secretLore:
      'Frankie Torrio was funneling illicit bootleg revenues directly into high-ranking magistrate bribe funds.',
    cipherWord: 'SANGUIS',
  },
  {
    caseId: 'case-vault-36',
    caseNumber: 36,
    title: 'The Phantom of Golden Mask',
    codename: 'FRAGMENT ETA: THE VENETIAN CREST',
    symbol: '🎭',
    secretLore:
      'The golden mask worn by Count Morosini contained an encrypted frequency transmitter connected to Council listening posts.',
    cipherWord: 'AUREUS',
  },
  {
    caseId: 'case-vault-35',
    caseNumber: 35,
    title: 'Last Voyage of SS Borealis',
    codename: 'FRAGMENT THETA: THE ARCTIC CHARTER',
    symbol: '⚓',
    secretLore:
      'The steamship Borealis was deliberately led into the ice pack to conceal maritime cargo containing stolen archaeological relics.',
    cipherWord: 'GLACIES',
  },
];

export const SyndicateMetaView: React.FC<SyndicateMetaViewProps> = ({
  stats,
  cases,
  onSelectCase,
  onReturnToDesk,
}) => {
  const [selectedFragment, setSelectedFragment] = useState<SyndicateFragment | null>(null);

  const solvedCaseIds = new Set(Object.keys(stats.history));
  const unlockedCount = SYNDICATE_FRAGMENTS.filter((f) => solvedCaseIds.has(f.caseId)).length;
  const isGrandSyndicateUnmasked = unlockedCount >= 8;

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#181512] border border-[#352F27] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTypewriter();
              onReturnToDesk();
            }}
            className="p-2 bg-[#25211B] hover:bg-[#342D24] text-stone-300 hover:text-white rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Desk</span>
          </button>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-200 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400 animate-pulse" />
              The Midnight Council • Master Syndicate Dossier
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              None of these 8 murders were isolated accidents. Recover the torn fragments from each
              closed case to unmask the puppet master.
            </p>
          </div>
        </div>

        {/* Unlocked Counter Pill */}
        <div className="flex items-center gap-2 bg-[#241B2D] border border-purple-800/60 px-4 py-2 rounded-xl text-xs font-mono">
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span className="text-stone-300">Fragments Deciphered:</span>
          <span className="font-bold text-purple-300 text-sm">
            {unlockedCount} / {SYNDICATE_FRAGMENTS.length}
          </span>
        </div>
      </div>

      {/* GRAND ARCHITECT CIPHER BANNER */}
      <div className="bg-gradient-to-r from-[#171220] via-[#20152B] to-[#171220] border-2 border-purple-600/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Overarching Meta-Mystery</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF6F0] tracking-wide">
            {isGrandSyndicateUnmasked
              ? 'THE MIDNIGHT COUNCIL UNMASKED: LORD STERLING WAS THE ARCHITECT'
              : 'THE SHADOW OF THE MIDNIGHT COUNCIL'}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 font-serif leading-relaxed italic">
            {isGrandSyndicateUnmasked
              ? 'All eight murders formed a web of deceit to fake Lord Sterling\'s death and siphon forty million pounds to an offshore trust. With all 8 ciphers united, the arrest warrant for the grand finale has been authorized!'
              : 'Every crime scene yielded a fragment of a torn photographic negative. As you solve each micro mystery in Scotland Yard\'s archives, the truth behind London\'s secret shadow syndicate emerges.'}
          </p>

          {/* Cipher Progress Letters */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {SYNDICATE_FRAGMENTS.map((frag) => {
              const isUnlocked = solvedCaseIds.has(frag.caseId);
              return (
                <div
                  key={frag.caseId}
                  className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                    isUnlocked
                      ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-stone-900/80 border-stone-800 text-stone-600'
                  }`}
                  title={isUnlocked ? `${frag.codename}: ${frag.cipherWord}` : 'Classified Fragment'}
                >
                  <span className="text-[10px]">{frag.symbol}</span>
                  <span className="text-[9px]">{isUnlocked ? frag.cipherWord[0] : '?'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* THE 8 TORN DOSSIER FRAGMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SYNDICATE_FRAGMENTS.map((frag) => {
          const isUnlocked = solvedCaseIds.has(frag.caseId);
          const relatedCase = cases.find((c) => c.id === frag.caseId);

          return (
            <div
              key={frag.caseId}
              className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isUnlocked
                  ? 'bg-[#1D1726] border-purple-500/60 shadow-lg hover:border-purple-400 hover:shadow-purple-900/20'
                  : 'bg-[#151312] border-[#2C2721] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{frag.symbol}</span>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isUnlocked
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Unlock className="w-3 h-3 text-emerald-400" />
                        <span>UNLOCKED</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                  Case #{frag.caseNumber}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#FAF6F0] mb-2 leading-snug">
                  {frag.title}
                </h4>

                <p className="text-xs text-stone-300 font-serif leading-relaxed line-clamp-3">
                  {isUnlocked
                    ? frag.secretLore
                    : 'Classified syndicate memorandum. Clear this cold case to recover the torn photographic fragment and decrypt the cipher.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      sound.playCassetteClick();
                      setSelectedFragment(frag);
                    }}
                    className="w-full py-1.5 bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-700/60 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Cipher: {frag.cipherWord}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (relatedCase) {
                        sound.playTypewriter();
                        onSelectCase(relatedCase);
                        onReturnToDesk();
                      }
                    }}
                    className="w-full py-1.5 bg-[#25211B] hover:bg-amber-600 hover:text-black text-stone-300 border border-stone-700 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Investigate Case</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FRAGMENT INSPECTOR MODAL */}
      {selectedFragment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#181320] border-2 border-purple-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedFragment.symbol}</span>
                <div>
                  <h4 className="text-sm font-mono font-bold text-purple-300 uppercase tracking-wider">
                    {selectedFragment.codename}
                  </h4>
                  <span className="text-xs text-stone-400 font-serif">
                    Recovered from {selectedFragment.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFragment(null)}
                className="text-stone-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/50 p-4 rounded-2xl border border-purple-900/50 space-y-3 font-serif">
              <p className="text-sm text-stone-200 leading-relaxed italic">
                &quot;{selectedFragment.secretLore}&quot;
              </p>
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between font-mono text-xs">
                <span className="text-stone-400">Deciphered Key Word:</span>
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold tracking-widest">
                  {selectedFragment.cipherWord}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedFragment(null)}
              className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs font-bold rounded-xl"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
