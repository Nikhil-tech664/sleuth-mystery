import React from 'react';
import type { Case } from '../types/game';
import { X, Printer, Download } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface PrintableCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
}

export const PrintableCaseModal: React.FC<PrintableCaseModalProps> = ({
  isOpen,
  onClose,
  currentCase,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playTypewriter();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl border border-[#3A352F] bg-[#1C1A17] p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#C69214]" />
            <div>
              <h3 className="text-base font-bold font-serif text-[#FAF6F0]">
                Printable Detective Case File
              </h3>
              <p className="text-[11px] font-mono text-[#8C8478]">
                Export as PDF or print on physical paper for game night / book compilation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C69214] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => {
                sound.playTypewriter();
                onClose();
              }}
              className="p-1.5 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (Styled for physical paper / print preview) */}
        <div className="flex-1 overflow-y-auto bg-[#FDFBF7] text-[#1A1816] p-6 md:p-8 rounded-xl shadow-inner border border-[#DCD5C5] font-typewriter select-text print:p-0 print:border-none">
          {/* Top Classified Header */}
          <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase">
                PRECINCT HOMICIDE DIVISION • DOSSIER #{currentCase.caseNumber}
              </div>
              <h1 className="text-2xl font-bold font-serif mt-1 tracking-tight">
                {currentCase.title}
              </h1>
              <div className="text-xs text-stone-600 mt-0.5">
                Date Dispatched: {currentCase.date} | Classification: {currentCase.difficulty}
              </div>
            </div>
            <div className="border-2 border-red-700 text-red-700 font-bold px-3 py-1 text-xs uppercase tracking-wider font-mono">
              CONFIDENTIAL
            </div>
          </div>

          {/* Incident Report */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wider border-b border-stone-300 pb-0.5 mb-1 text-stone-700">
              I. INCIDENT BRIEFING
            </div>
            <p className="text-xs leading-relaxed">
              "{currentCase.incidentReport}"
            </p>
          </div>

          {/* Victim Profile */}
          <div className="mb-4 bg-stone-100 p-2.5 rounded border border-stone-300 text-xs">
            <span className="font-bold">VICTIM:</span> {currentCase.victim.name} ({currentCase.victim.role}) — {currentCase.victim.description}
          </div>

          {/* Suspects, Weapons, Locations Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
            {/* Suspects */}
            <div className="border border-stone-300 p-2 rounded">
              <div className="font-bold border-b border-stone-200 pb-1 mb-1.5 uppercase text-[10px] text-stone-600">
                Suspects Under Watch
              </div>
              <ul className="space-y-1">
                {currentCase.suspects.map((s) => (
                  <li key={s.id} className="leading-tight">
                    • <strong>{s.name}</strong> <span className="text-[10px] text-stone-500">("{s.alias}")</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weapons */}
            <div className="border border-stone-300 p-2 rounded">
              <div className="font-bold border-b border-stone-200 pb-1 mb-1.5 uppercase text-[10px] text-stone-600">
                Evidence / Weapons
              </div>
              <ul className="space-y-1">
                {currentCase.weapons.map((w) => (
                  <li key={w.id} className="leading-tight">
                    • <strong>{w.name}</strong> <span className="text-[10px] text-stone-500">({w.category})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="border border-stone-300 p-2 rounded">
              <div className="font-bold border-b border-stone-200 pb-1 mb-1.5 uppercase text-[10px] text-stone-600">
                Key Locations
              </div>
              <ul className="space-y-1">
                {currentCase.locations.map((loc) => (
                  <li key={loc.id} className="leading-tight">
                    • <strong>{loc.name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recovered Clues */}
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-wider border-b border-stone-300 pb-0.5 mb-2 text-stone-700">
              II. RECOVERED TESTIMONY & CLUES
            </div>
            <div className="space-y-1.5">
              {currentCase.clues.map((clue, idx) => (
                <div key={clue.id} className="text-xs flex items-start gap-2">
                  <span className="font-mono font-bold text-stone-500">[ ] Clue {idx + 1}:</span>
                  <span className="leading-snug">{clue.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Blank Logic Deduction Matrix for Pen & Paper */}
          <div className="mb-4 border border-stone-400 p-3 rounded">
            <div className="text-[10px] font-bold uppercase text-stone-600 mb-2 text-center">
              III. DEDUCTION MATRIX (Use pen to cross [X] and confirm [✓])
            </div>
            <div className="flex justify-center">
              <table className="border-collapse border border-stone-500 text-[10px] text-center">
                <thead>
                  <tr>
                    <th className="border border-stone-500 p-1 w-24 bg-stone-200">Suspect</th>
                    {currentCase.weapons.map((w) => (
                      <th key={w.id} className="border border-stone-500 p-1 w-16 bg-stone-100 truncate">
                        {w.name.split(' ')[0]}
                      </th>
                    ))}
                    {currentCase.locations.map((l) => (
                      <th key={l.id} className="border border-stone-500 p-1 w-16 bg-stone-100 truncate">
                        {l.name.split(' ').slice(-1)[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentCase.suspects.map((s) => (
                    <tr key={s.id}>
                      <td className="border border-stone-500 p-1 font-bold bg-stone-50 text-left">
                        {s.name.split(' ').slice(-1)[0]}
                      </td>
                      {currentCase.weapons.map((w) => (
                        <td key={w.id} className="border border-stone-500 h-8 w-16"></td>
                      ))}
                      {currentCase.locations.map((l) => (
                        <td key={l.id} className="border border-stone-500 h-8 w-16"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Magistrate Verdict Line */}
          <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center text-xs">
            <div>
              OFFICIAL VERDICT: ___________________ with ___________________ at ___________________
            </div>
            <div className="font-bold">INSPECTOR SIGNATURE: ________________</div>
          </div>
        </div>
      </div>
    </div>
  );
};
