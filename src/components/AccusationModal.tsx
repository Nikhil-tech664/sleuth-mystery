import React, { useState } from 'react';
import type { Case } from '../types/game';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Stamp } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  onAccuse: (suspectId: string, weaponId: string, locationId: string) => { correct: boolean; message: string };
  isAlreadySolved: boolean;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onAccuse,
  isAlreadySolved,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(
    isAlreadySolved ? currentCase.solution.culpritId : null
  );
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(
    isAlreadySolved ? currentCase.solution.weaponId : null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    isAlreadySolved ? currentCase.solution.locationId : null
  );
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect || !selectedWeapon || !selectedLocation) {
      sound.playError();
      setFeedback({
        type: 'error',
        text: 'Select the Suspect, Weapon, and Location to complete the warrant.',
      });
      return;
    }

    sound.playStamp();
    const result = onAccuse(selectedSuspect, selectedWeapon, selectedLocation);
    if (result.correct) {
      sound.playGavelSlam();
      setFeedback({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      sound.playError();
      setFeedback({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-[#C69214]/50 bg-[#171513] p-6 shadow-2xl overflow-hidden">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between border-b border-[#2C2824] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-[#FAF6F0]">
              Official Arrest Warrant
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playTypewriter();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-[#25221E] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Alert */}
        <p className="text-xs text-[#AAA194] font-typewriter mb-4">
          State your formal accusation for the magistrate. A false accusation wastes precinct resources and adds a strike to your record.
        </p>

        {feedback && (
          <div
            className={`p-3 rounded-lg text-xs font-mono mb-4 flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                : 'bg-red-950/80 text-red-300 border border-red-500/50 animate-shake'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Pick the Culprit */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C69214] mb-1.5">
              1. The Murderer
            </label>
            <div className="grid grid-cols-3 gap-2">
              {currentCase.suspects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedSuspect(s.id);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedSuspect === s.id
                      ? 'bg-[#2B2314] border-[#C69214] ring-1 ring-[#C69214] text-amber-200'
                      : 'bg-[#1F1C19] border-[#332E28] hover:border-[#4B443B] text-[#D8D0C2]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-[#141311] border border-[#3A332B] mb-1.5 flex items-center justify-center text-xl shrink-0">
                    {s.portraitUrl ? (
                      <img src={s.portraitUrl} alt={s.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      s.avatarEmoji
                    )}
                  </div>
                  <div className="text-xs font-bold font-serif truncate">{s.name.split(' ').slice(-1)[0]}</div>
                  <div className="text-[10px] text-[#8C8478] truncate">"{s.alias}"</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pick the Murder Weapon */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C69214] mb-1.5">
              2. The Murder Weapon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {currentCase.weapons.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedWeapon(w.id);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedWeapon === w.id
                      ? 'bg-[#2B2314] border-[#C69214] ring-1 ring-[#C69214] text-amber-200'
                      : 'bg-[#1F1C19] border-[#332E28] hover:border-[#4B443B] text-[#D8D0C2]'
                  }`}
                >
                  <div className="text-xl mb-1">{w.icon}</div>
                  <div className="text-xs font-bold font-serif truncate">{w.name}</div>
                  <div className="text-[10px] text-[#8C8478] truncate">{w.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Pick the Crime Scene */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#C69214] mb-1.5">
              3. The Crime Scene
            </label>
            <div className="grid grid-cols-3 gap-2">
              {currentCase.locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedLocation(loc.id);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedLocation === loc.id
                      ? 'bg-[#2B2314] border-[#C69214] ring-1 ring-[#C69214] text-amber-200'
                      : 'bg-[#1F1C19] border-[#332E28] hover:border-[#4B443B] text-[#D8D0C2]'
                  }`}
                >
                  <div className="text-xl mb-1">{loc.icon}</div>
                  <div className="text-xs font-bold font-serif truncate">{loc.name}</div>
                  <div className="text-[10px] text-[#8C8478] truncate">Location</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-700 text-white font-mono font-bold uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-2 border border-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Stamp className="w-5 h-5" />
              <span>STAMP & ISSUE ARREST WARRANT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
