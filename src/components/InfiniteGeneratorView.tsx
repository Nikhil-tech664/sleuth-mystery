import React, { useState } from 'react';
import type { Case } from '../types/game';
import { generateProceduralCase } from '../utils/proceduralGenerator';
import { Dices, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface InfiniteGeneratorViewProps {
  onLoadGeneratedCase: (c: Case) => void;
  onReturnToDesk: () => void;
}

export const InfiniteGeneratorView: React.FC<InfiniteGeneratorViewProps> = ({
  onLoadGeneratedCase,
  onReturnToDesk,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('victorian');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Standard' | 'Noir' | 'Hardboiled'>('Noir');
  const [generatedCase, setGeneratedCase] = useState<Case | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    sound.playTypewriter();
    setIsGenerating(true);

    setTimeout(() => {
      sound.playLevelUp();
      const randomCaseNum = Math.floor(Math.random() * 900) + 100;
      const newCase = generateProceduralCase(randomCaseNum, selectedEra, selectedDifficulty);
      setGeneratedCase(newCase);
      setIsGenerating(false);
    }, 400);
  };

  const handlePlayGeneratedCase = () => {
    if (!generatedCase) return;
    sound.playStamp();
    onLoadGeneratedCase(generatedCase);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C2722] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTypewriter();
              onReturnToDesk();
            }}
            className="p-2 rounded-xl bg-[#221F1C] border border-[#3A352F] hover:bg-[#2F2A25] text-[#D8CFBF] hover:text-[#FAF7F2] transition-colors flex items-center gap-1 text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Desk</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-serif text-[#FAF6F0] tracking-wide">
                Infinite Mystery Generator Sandbox
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold border border-purple-500/40">
                PROCEDURAL AI SOLVER
              </span>
            </div>
            <p className="text-xs text-[#8C8478] font-sans mt-0.5">
              Algorithmically synthesizes mathematically guaranteed 1-to-1 solvable deduction mysteries on demand.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Configuration Controls */}
      <div className="rounded-2xl border-2 border-[#38322B] bg-[#141210] p-6 shadow-xl space-y-6">
        <div>
          <label className="text-xs font-mono text-[#AAA194] uppercase font-bold block mb-2">
            1. Select Historical or Speculative Mystery Era:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'victorian', label: 'Victorian London', desc: 'Gaslamp fog, airships & ciphers (1890)', icon: '🕰️' },
              { id: 'speakeasy', label: 'Chicago Speakeasy', desc: 'Jazz clubs, poker & bootlegging (1928)', icon: '🎷' },
              { id: 'cybernoir', label: 'Cyber-Noir Megacity', desc: 'Data smugglers & laser wire (2088)', icon: '🤖' },
            ].map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setSelectedEra(era.id);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedEra === era.id
                    ? 'border-amber-500 bg-[#241C10] shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'border-[#2C2722] bg-[#171513] hover:border-[#443D34]'
                }`}
              >
                <div className="text-2xl mb-1">{era.icon}</div>
                <div className="text-sm font-bold font-serif text-[#FAF6F0]">{era.label}</div>
                <div className="text-xs text-[#8C8478] font-sans mt-0.5">{era.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-[#AAA194] uppercase font-bold block mb-2">
            2. Select Difficulty Rating:
          </label>
          <div className="flex gap-2">
            {(['Standard', 'Noir', 'Hardboiled'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setSelectedDifficulty(diff);
                }}
                className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold uppercase transition-all ${
                  selectedDifficulty === diff
                    ? 'border-amber-500 bg-amber-500 text-black shadow-md'
                    : 'border-[#332E28] bg-[#1C1A17] text-[#AAA194] hover:text-[#FAF7F2]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Trigger */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:brightness-110 active:scale-[0.99] text-black font-mono font-bold text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Dices className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing Constraint Graph...' : 'Generate New Infinite Mystery'}</span>
        </button>
      </div>

      {/* Generated Case Preview Banner */}
      {generatedCase && (
        <div className="rounded-2xl border-2 border-emerald-500/60 bg-[#0E1712] p-6 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-bold uppercase">
                  Generated Case #{generatedCase.caseNumber} • {generatedCase.difficulty}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Solvable Guarantee
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-[#FAF6F0]">
                {generatedCase.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePlayGeneratedCase}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Investigate This Case Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#D8E6DC] leading-relaxed font-typewriter bg-[#070D0A] p-4 rounded-xl border border-emerald-900/40">
            "{generatedCase.incidentReport}"
          </p>

          {/* Suspects Lineup Preview */}
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold mb-2">
              Apprehended Suspects Lineup:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {generatedCase.suspects.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#08120B] border border-emerald-900/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0F2416] border border-emerald-600/40 flex items-center justify-center text-2xl shrink-0">
                    {s.avatarEmoji}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-serif text-[#FAF6F0] truncate">{s.name}</div>
                    <div className="text-[10px] font-mono text-emerald-400 truncate">{s.alias}</div>
                    <div className="text-[10px] text-[#8C9E91] truncate font-sans">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clues Preview */}
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold mb-2">
              Deductive Clues Synthesized:
            </div>
            <div className="space-y-1.5 bg-[#060D08] p-3.5 rounded-xl border border-emerald-900/40">
              {generatedCase.clues.map((c, i) => (
                <div key={c.id} className="text-xs text-[#C5D9CB] font-typewriter flex items-start gap-2">
                  <span className="text-emerald-500 font-mono font-bold">{i + 1}.</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
