import React, { useState, useEffect } from 'react';
import type { Suspect } from '../types/game';
import {
  X,
  MessageSquare,
  ShieldAlert,
  Volume2,
  VolumeX,
  Activity,
  Zap,
  CheckCircle2,
  Square,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';
import { speech, type VoicePersonaType } from '../audio/speechEngine';

interface InterrogationModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspect: Suspect | null;
  onLogAlibi: (note: string) => void;
}

export const InterrogationModal: React.FC<InterrogationModalProps> = ({
  isOpen,
  onClose,
  suspect,
  onLogAlibi,
}) => {
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number | null>(null);
  const [hasLogged, setHasLogged] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSpeechMuted, setIsSpeechMuted] = useState<boolean>(speech.getMuted());
  const [heartRate, setHeartRate] = useState<number>(72);
  const [isLyingSpike, setIsLyingSpike] = useState<boolean>(false);
  const [isObjectionActive, setIsObjectionActive] = useState<boolean>(false);
  const [hasBrokenDown, setHasBrokenDown] = useState<boolean>(false);

  useEffect(() => {
    return speech.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  // Stop speech if modal closes
  useEffect(() => {
    if (!isOpen) {
      speech.stop();
      setSelectedQuestionIdx(null);
      setIsObjectionActive(false);
      setHasBrokenDown(false);
      setHeartRate(72);
      setIsLyingSpike(false);
    }
  }, [isOpen]);

  if (!isOpen || !suspect) return null;

  // Determine suspect voice persona based on personality
  const getPersona = (): VoicePersonaType => {
    const roleLower = suspect.role.toLowerCase();
    const aliasLower = suspect.alias.toLowerCase();
    if (aliasLower.includes('butler') || roleLower.includes('valet') || roleLower.includes('clerk')) {
      return 'nervous';
    }
    if (roleLower.includes('lord') || roleLower.includes('lady') || roleLower.includes('baron')) {
      return 'aristocrat';
    }
    if (roleLower.includes('dock') || roleLower.includes('boxer') || roleLower.includes('smuggler')) {
      return 'gravelly';
    }
    return 'witness';
  };

  // Fallback questions if not defined
  const questions = suspect.dialogues || [
    {
      question: 'Where were you during the 90-second blackout at 11:42 PM?',
      answer: `I told the constable three times already! I was nowhere near the victim. You have no right to question my integrity!`,
      tone: 'Defensive & Sweating',
    },
    {
      question: `What was your personal grievance with the deceased?`,
      answer: `${suspect.motive}. But that doesn't make me a killer! Everyone in this manor had reasons to despise him!`,
      tone: 'Agitated & Trembling',
    },
    {
      question: 'Did you notice any weapons or suspicious movements?',
      answer: `I heard footsteps hurrying towards the wing, but with the storm rattling the windowpanes, who could tell?`,
      tone: 'Evasive',
    },
  ];

  const handleSelectQuestion = (idx: number) => {
    sound.playTypewriter();
    setSelectedQuestionIdx(idx);
    setHasLogged(false);

    // Polygraph reaction
    const isDeceptive = idx === 1 || hasBrokenDown;
    setIsLyingSpike(isDeceptive);
    setHeartRate(isDeceptive ? 138 : 78);

    if (isDeceptive) {
      sound.playHeartbeat();
    }

    // Voice speak suspect response
    const currentQ = questions[idx];
    if (!isSpeechMuted) {
      speech.speak(currentQ.answer, getPersona());
    }
  };

  const handleToggleVoice = () => {
    const nextMute = !isSpeechMuted;
    setIsSpeechMuted(nextMute);
    speech.setMuted(nextMute);
    sound.playCassetteClick();
  };

  const handleAddNote = (ans: string) => {
    sound.playStamp();
    onLogAlibi(`[Interrogation with ${suspect.name}]: "${ans}"`);
    setHasLogged(true);
  };

  // Dramatic "OBJECTION!" breakthrough confrontation
  const handleTriggerObjection = () => {
    speech.stop();
    sound.playObjectionStinger();
    setIsObjectionActive(true);
    setHasBrokenDown(true);
    setHeartRate(175);
    setIsLyingSpike(true);

    setTimeout(() => {
      setIsObjectionActive(false);
      // Play nervous trembling confession line
      if (!isSpeechMuted) {
        speech.speak(
          `Alright! Stop staring at me with those cold eyes! I was there... but you don't understand the full picture! The council... they forced my hand!`,
          'nervous'
        );
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* OBJECTION Cinematic Flash Screen Shake */}
      {isObjectionActive && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none animate-in zoom-in-75 duration-200">
          <div className="w-full bg-red-600/95 py-6 sm:py-8 border-y-8 border-amber-400 shadow-[0_0_100px_rgba(239,68,68,0.9)] -rotate-3 text-center transform scale-105 animate-pulse">
            <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center gap-3">
              <span>⚡</span>
              <span>OBJECTION!</span>
              <span>⚡</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-widest font-bold text-amber-200 mt-1">
              CONTRADICTION EXPOSED • COMPOSURE SHATTERED
            </p>
          </div>
        </div>
      )}

      <div
        className={`relative w-full max-w-2xl rounded-2xl border-2 bg-[#161412] p-4 sm:p-6 shadow-2xl flex flex-col overflow-hidden max-h-[92vh] ${
          isObjectionActive
            ? 'border-red-500 ring-4 ring-red-500/50 scale-[1.01]'
            : 'border-[#C69214]/60'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D2721] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/70 border border-red-800/60 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#FAF6F0] uppercase tracking-wider flex items-center gap-2">
                <span>Precinct Interrogation Room 3</span>
                {hasBrokenDown && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/50 font-mono font-bold animate-pulse">
                    COMPOSURE BROKEN
                  </span>
                )}
              </h3>
              <p className="text-xs font-mono text-[#8C8478]">
                Cross-examining: {suspect.name} ("{suspect.alias}")
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mute / Unmute Toggle */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isSpeechMuted ? 'Voice acting is muted. Click to enable character speech!' : 'Voice acting enabled. Click to mute.'}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                isSpeechMuted
                  ? 'bg-[#221F1C] border-[#383228] text-stone-400'
                  : 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              }`}
            >
              {isSpeechMuted ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline text-[10px] font-bold">Voice ON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                speech.stop();
                sound.playTypewriter();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#221F1C] hover:bg-[#2F2922] border border-[#3A3328] text-[#8C8478] hover:text-[#FAF6F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suspect Mugshot & Real-Time Physiological Lie Detector Polygraph */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#1C1916] border border-[#332E28] rounded-xl p-3.5 mb-4">
          <div className="sm:col-span-4 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-[#121110] border-2 border-[#C69214]/60 flex items-center justify-center text-4xl shadow-inner shrink-0 relative overflow-hidden">
              {suspect.portraitUrl ? (
                <img
                  src={suspect.portraitUrl}
                  alt={suspect.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                suspect.avatarEmoji
              )}
              {hasBrokenDown && (
                <div className="absolute top-1 right-1 text-xs animate-bounce bg-black/60 rounded px-0.5">💦</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold font-serif text-[#FAF7F2] truncate">
                {suspect.name}
              </div>
              <div className="text-xs text-[#AAA194] truncate">
                {suspect.role}
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono italic truncate">
                Tell: "{suspect.quirk}"
              </div>
            </div>
          </div>

          {/* Polygraph Monitor */}
          <div className="sm:col-span-8 bg-[#100E0D] border border-[#2B241D] rounded-xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="flex items-center gap-1.5 text-stone-400 font-bold uppercase">
                <Activity className={`w-3.5 h-3.5 ${isLyingSpike ? 'text-red-500 animate-spin' : 'text-emerald-400'}`} />
                Polygraph Galvanic Stress Monitor
              </span>
              <span
                className={`px-1.5 py-0.2 rounded font-bold ${
                  isLyingSpike
                    ? 'bg-red-950 text-red-400 border border-red-600/50 animate-pulse'
                    : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {heartRate} BPM {isLyingSpike ? '• DECEPTION DETECTED' : '• BASELINE'}
              </span>
            </div>

            {/* Oscilloscope EKG Line Simulation */}
            <div className="h-10 w-full bg-black/60 rounded border border-[#26211C] overflow-hidden relative flex items-center">
              <svg className="w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none">
                <path
                  d={
                    isLyingSpike
                      ? 'M 0 20 L 30 20 L 40 5 L 50 35 L 60 10 L 70 30 L 90 20 L 140 20 L 150 0 L 160 38 L 170 5 L 180 35 L 200 20 L 250 20 L 260 2 L 270 38 L 300 20'
                      : 'M 0 20 L 60 20 L 70 12 L 80 28 L 90 20 L 160 20 L 170 14 L 180 26 L 190 20 L 260 20 L 270 13 L 280 27 L 300 20'
                  }
                  fill="none"
                  stroke={isLyingSpike ? '#EF4444' : '#10B981'}
                  strokeWidth="2"
                  className={isLyingSpike ? 'animate-pulse' : ''}
                />
              </svg>
              {isSpeaking && (
                <div className="absolute right-2 flex items-center gap-0.5">
                  <span className="w-1 bg-amber-400 animate-pulse h-3 rounded-full" />
                  <span className="w-1 bg-amber-300 animate-pulse h-5 rounded-full" />
                  <span className="w-1 bg-amber-400 animate-pulse h-2 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Selector */}
        <div className="mb-3">
          <div className="text-xs font-mono font-bold text-[#C69214] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Select Interrogation Angle</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Click question to cross-examine</span>
          </div>

          <div className="space-y-1.5">
            {questions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(idx)}
                className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono transition-all flex items-start gap-2 ${
                  selectedQuestionIdx === idx
                    ? 'bg-[#292215] border-[#C69214] text-amber-200 ring-1 ring-[#C69214]'
                    : 'bg-[#181614] border-[#2C2721] hover:border-[#3E3831] text-[#CCC4B8]'
                }`}
              >
                <span className="text-amber-500 font-bold shrink-0">Q{idx + 1}:</span>
                <span className="leading-snug flex-1">{q.question}</span>
                {selectedQuestionIdx === idx && (
                  <span className="text-[10px] text-emerald-400 font-bold shrink-0">ACTIVE</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Suspect's Dynamic Response */}
        {selectedQuestionIdx !== null && (
          <div className="bg-[#121110] border-2 border-amber-500/40 rounded-xl p-3.5 mb-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <span>Suspect Testimony</span>
                {isSpeaking && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono animate-pulse">
                    🔊 Speaking...
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-[#8C8478] italic">
                Reaction: {questions[selectedQuestionIdx].tone}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-typewriter text-[#FAF7F2] leading-relaxed mb-3">
              "{questions[selectedQuestionIdx].answer}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#25201A]">
              {/* Voice Replay Button */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    speech.stop();
                  } else {
                    speech.speak(questions[selectedQuestionIdx].answer, getPersona());
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#221D17] hover:bg-[#2F271E] border border-[#3B3224] text-xs font-mono text-stone-300 hover:text-white transition-colors"
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Replay Voice</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* OBJECTION Button */}
                <button
                  type="button"
                  onClick={handleTriggerObjection}
                  disabled={hasBrokenDown}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    hasBrokenDown
                      ? 'bg-red-950/60 text-red-400 border border-red-800/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/40 active:scale-95'
                  }`}
                  title="Confront suspect with contradictory evidence to shatter their alibi"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{hasBrokenDown ? '✓ Contradiction Broken' : 'Confront (OBJECTION!)'}</span>
                </button>

                {/* Log Note Button */}
                <button
                  type="button"
                  onClick={() => handleAddNote(questions[selectedQuestionIdx].answer)}
                  disabled={hasLogged}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    hasLogged
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'bg-[#2B2314] hover:bg-[#C69214] text-amber-300 hover:text-black border border-[#C69214]/50'
                  }`}
                >
                  {hasLogged ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Logged to Notes</span>
                    </>
                  ) : (
                    <span>📋 Log to Notes (+25 XP)</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-[#26211C] flex items-center justify-between text-[11px] font-mono text-[#787166]">
          <span>Witness statements are recorded directly into precinct archives.</span>
          <button
            type="button"
            onClick={() => {
              speech.stop();
              sound.playTypewriter();
              onClose();
            }}
            className="text-amber-400 hover:underline font-bold"
          >
            Conclude Interrogation
          </button>
        </div>
      </div>
    </div>
  );
};
