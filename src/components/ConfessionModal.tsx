import React, { useState, useEffect } from 'react';
import type { Case } from '../types/game';
import { sound } from '../audio/soundEffects';
import { Heart, FileText, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface ConfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  culpritId: string;
  onProceedToDebrief: () => void;
}

const CONFESSION_MONOLOGUES: Record<
  string,
  {
    title: string;
    confession: string;
    syndicateClue: string;
  }
> = {
  dr_finch: {
    title: 'The Tears of the Botanist',
    confession:
      'It was never about the fortune... Lord Sterling stood by the mantelpiece sneering, waving the repossession deed for my conservatory. Thirty-four years of cross-pollinating rare orchids—my entire life\'s work—to be paved over for his motor garage! When the chandeliers flickered out, I grabbed the heavy candlestick. God help me, I only wanted him to sign the extension! But when he fell... the silence was louder than thunder.',
    syndicateClue:
      'Sterling wasn\'t acting alone. An anonymous broker from "The Midnight Council" paid off his mortgages three weeks ago...',
  },
  soprano_bella: {
    title: 'The Final Aria of Bella Vivaldi',
    confession:
      'The Maestro promised me Tosca. Then yesterday I found the contract—he had signed an amateur chorine half my age behind my back! Thirty years of blood, sweat, and vocal nodules, discarded like a soiled handkerchief! The prop dagger was on the dressing table... I just switched the blades. Let the curtain fall forever!',
    syndicateClue:
      'In Maestro\'s lockbox was a telegram signed with an owl insignia: "Silence the soprano before opening night."',
  },
  conductor_klaus: {
    title: 'Blood on the Iron Tracks',
    confession:
      'That diamond dealer boarded at Vienna with a briefcase stuffed with stolen Austrian bonds—the very wealth his syndicate seized from my family in 1923! While my mother froze without heat, he sipped vintage Veuve Clicquot in First Class! The Orient Express gave him luxury; I gave him the sleep he deserved!',
    syndicateClue:
      'The passenger manifest had three crossed-out names, all marked with the Midnight Council cipher.',
  },
  roxie_neon: {
    title: 'Neon Boardwalk Requiem',
    confession:
      'He was going to burn the pier for the insurance money! Hundreds of honest families work those penny arcades and carousels! I begged him on my knees. When he laughed in my face and lit a fresh Havana cigar, I spiked his cocktail with the industrial cyanide from the photo darkroom. I saved the boardwalk!',
    syndicateClue:
      'The real estate syndicate that funded the arson syndicate operated under the alias "Council Sector 4".',
  },
  matron_cross: {
    title: 'The Sanatorium Ledger',
    confession:
      'The Doctor was falsifying the lobotomy reports! He was dosing wealthy heiresses with heavy chloral hydrate so their guardians could liquidate their trusts! I confronted him in the records room. When he threatened to commit me to the violent ward, my hand found the heavy brass paperweight... and then the laudanum quill!',
    syndicateClue:
      'Every patient committed had their assets transferred to an offshore shell firm linked to The Midnight Council.',
  },
  frankie_torrio: {
    title: 'The Gangland Code',
    confession:
      'Don\'t give me that choirboy stare, Detective! In this neighborhood, you pull the trigger or you end up face-down in the Gowanus Canal! Frankie Torrio don\'t take orders from two-bit bootleggers! He shorted my cut on the gin delivery, so he caught lead. That\'s the law of the asphalt jungle!',
    syndicateClue:
      'A receipt found in his lapel proves Torrio was answering to a higher boss known only as "The Architect".',
  },
  lorenzo_gondolier: {
    title: 'Venetian Vengeance',
    confession:
      'The Count thought Venice belonged to him! He seduced my sister, stole her ancestral family dowry, and cast her out into the winter rains to perish! For three years I rowed past his palazzo waiting for the Carnivale of Masks. When the fireworks burst over the lagoon, my silk cord tightened around his throat. Venice has washed her hands!',
    syndicateClue:
      'The Golden Mask worn by the Count carried a hidden crest: the octagonal seal of The Midnight Council.',
  },
  mate_hansen: {
    title: 'The Arctic Ghost Ship',
    confession:
      'The Captain ordered the coal hatches bolted while forty men were freezing in the steerage hold! He was hoarding the whale oil for himself so he could claim the salvage bonus! If I didn\'t drive the harpoon knife through his frozen heart, every soul aboard the SS Borealis would be ice today! I would do it again!',
    syndicateClue:
      'The captain\'s secret orders were to scuttle the SS Borealis deliberately on behalf of a London insurance ring.',
  },
  silas_grimwood: {
    title: 'The Horologist\'s Reckoning',
    confession:
      'Reginald stole the escapement patents that took me twenty years of candlelight and ruined eyesight to perfect! He filed them under his own illustrious name and cast me out like an obsolete spring! When he laughed and said the world only remembers the man who signs the clockface, the brass winding key came down before I could think! The automaton bore witness to justice!',
    syndicateClue:
      'Vance had pledged the automaton patents to an industrial syndicate known in shadow as "The Midnight Council".',
  },
  professor_hex: {
    title: 'The Cyanide Crucible',
    confession:
      'Sterling discovered the guild formula for synthetic Prussian cyanide and planned to sell it to the War Office for military munitions! He was going to turn our sacred alchemical arts into mass slaughter for empire! I slipped the bitter crystals into his evening distillation flask to save tens of thousands of innocent lives! My soul is forfeit, but humanity is spared!',
    syndicateClue:
      'The apothecary ledger showed regular gold bullion disbursements from an account marked "Council Syndicate Vault 9".',
  },
};

export const ConfessionModal: React.FC<ConfessionModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  culpritId,
  onProceedToDebrief,
}) => {
  const [stage, setStage] = useState<'ekg_spike' | 'breakdown' | 'confession' | 'syndicate_drop'>(
    'ekg_spike'
  );
  const [bpm, setBpm] = useState<number>(85);
  const [displayedText, setDisplayedText] = useState<string>('');

  const suspect = currentCase.suspects.find((s) => s.id === culpritId);
  const monologueData = CONFESSION_MONOLOGUES[culpritId] || {
    title: 'The Broken Confession',
    confession:
      'I cannot carry this guilt any longer! The walls are closing in and every shadow speaks your name, Detective! I did it... I alone am guilty!',
    syndicateClue:
      'A torn note in their pocket bears the unmistakable mark of The Midnight Council.',
  };

  // Heartbeat sound loop & progression
  useEffect(() => {
    if (!isOpen) {
      setStage('ekg_spike');
      setBpm(85);
      setDisplayedText('');
      return;
    }

    sound.playHeartbeat();

    // Stage 1: EKG heart rate spiking under pressure
    const spikeInterval = setInterval(() => {
      setBpm((prev) => {
        if (prev >= 155) {
          clearInterval(spikeInterval);
          return 160;
        }
        sound.playHeartbeat();
        return prev + 15;
      });
    }, 400);

    const timer1 = setTimeout(() => {
      sound.playDeskSlam();
      setStage('breakdown');
    }, 2000);

    const timer2 = setTimeout(() => {
      setStage('confession');
      sound.playTypewriter();
    }, 3800);

    const timer3 = setTimeout(() => {
      sound.playClueDiscovery();
      setStage('syndicate_drop');
    }, 9000);

    return () => {
      clearInterval(spikeInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, culpritId]);

  // Typewriter effect for confession text
  useEffect(() => {
    if (stage !== 'confession' && stage !== 'syndicate_drop') return;
    const fullText = monologueData.confession;
    let idx = 0;
    const typingTimer = setInterval(() => {
      if (idx < fullText.length) {
        setDisplayedText(fullText.slice(0, idx + 1));
        if (idx % 4 === 0) {
          sound.playTypewriter();
        }
        idx++;
      } else {
        clearInterval(typingTimer);
      }
    }, 30);

    return () => clearInterval(typingTimer);
  }, [stage, monologueData.confession]);

  if (!isOpen || !suspect) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />

      <div className="relative w-full max-w-2xl bg-[#141210] border-2 border-red-700/80 rounded-3xl shadow-2xl overflow-hidden text-stone-200">
        {/* Top Police Dispatch Bar */}
        <div className="bg-red-950/90 border-b border-red-800/80 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
            <span className="font-mono text-xs uppercase tracking-widest text-red-200 font-bold">
              SCOTLAND YARD INTERROGATION CHAMBER • VERDICT ATTAINED
            </span>
          </div>
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-red-900/60">
            <Heart
              className={`w-4 h-4 text-red-500 ${bpm > 120 ? 'animate-ping' : 'animate-pulse'}`}
            />
            <span className="font-mono text-xs font-bold text-red-400">EKG: {bpm} BPM</span>
          </div>
        </div>

        {/* The Spotlight Suspect Chamber */}
        <div className="p-6 sm:p-8 space-y-6 relative">
          {/* Spotlight Effect behind avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#2C2720]">
            <div className="relative">
              {/* Downlight conical beam */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

              <div className="w-24 h-24 rounded-2xl bg-[#1F1B16] border-2 border-red-600/80 flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden">
                {suspect.portraitUrl ? (
                  <img
                    src={suspect.portraitUrl}
                    alt={suspect.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  suspect.avatarEmoji
                )}
                {stage !== 'ekg_spike' && (
                  <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-md">
                    BROKEN
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-mono text-red-400 tracking-wider uppercase font-bold">
                CULPRIT CONFESSED
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#FAF6F0]">{suspect.name}</h3>
              <p className="text-xs text-stone-400 font-mono italic">
                &quot;{suspect.alias}&quot; • {suspect.role}
              </p>
              <div className="text-xs font-sans text-amber-500/90 pt-1">
                Murder Weapon: <span className="font-bold text-white">{currentCase.solution.weaponId.replace('_', ' ')}</span> | Scene: <span className="font-bold text-white">{currentCase.solution.locationId.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* EKG / Polygraph Pulse Wave Visual */}
          <div className="bg-black/60 rounded-xl p-3 border border-[#2B251E] flex items-center justify-between font-mono text-xs">
            <span className="text-stone-500 text-[10px]">POLYGRAPH TRACE:</span>
            <div className="flex-1 mx-4 h-4 flex items-center overflow-hidden">
              <div className="w-full h-[1px] bg-red-800 relative">
                <div
                  className="absolute top-[-8px] left-0 w-8 h-4 border-t-2 border-red-500 animate-pulse"
                  style={{ animationDuration: `${60 / bpm}s` }}
                />
              </div>
            </div>
            <span
              className={`font-bold ${
                bpm > 140
                  ? 'text-red-500 animate-pulse'
                  : bpm > 110
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {bpm > 140 ? 'CRITICAL COLLAPSE' : bpm > 110 ? 'ACUTE ANXIETY' : 'RESTING'}
            </span>
          </div>

          {/* The Confession Typewriter Text Box */}
          <div className="bg-[#1A1714] border border-[#383127] p-5 rounded-2xl relative shadow-inner min-h-[140px]">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-400 mb-2 border-b border-[#2C261F] pb-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>{monologueData.title}</span>
            </div>

            <p className="text-sm font-serif italic text-amber-100/90 leading-relaxed">
              &quot;{displayedText || '...'}
              {stage === 'confession' && <span className="animate-ping font-mono">|</span>}&quot;
            </p>
          </div>

          {/* TORN SYNDICATE CIPHER FRAGMENT UNLOCKED */}
          {stage === 'syndicate_drop' && (
            <div className="bg-gradient-to-r from-purple-950/60 to-amber-950/60 border-2 border-purple-500/60 p-4 rounded-2xl flex items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Torn Syndicate Fragment Recovered!</span>
                  </div>
                  <p className="text-[11px] text-stone-300 font-sans italic mt-0.5">
                    {monologueData.syndicateClue}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Proceed Action Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={() => {
                sound.playTypewriter();
                onClose();
                onProceedToDebrief();
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Seal Confession & Claim Case Trophy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
