import React, { useState } from 'react';
import type { Case, Suspect, Weapon, Location, Clue, FingerprintPattern } from '../types/game';
import {
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  Play,
  CheckCircle2,
  FileText,
  Users,
  Crosshair,
  Key,
  Link,
} from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CaseCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomCase: (customCase: Case) => void;
}

export const CaseCreatorModal: React.FC<CaseCreatorModalProps> = ({
  isOpen,
  onClose,
  onPlayCustomCase,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Case State Builder
  const [title, setTitle] = useState<string>('The Midnight Parlor Mystery');
  const [date, setDate] = useState<string>('November 14, 1894');
  const [difficulty, setDifficulty] = useState<'Standard' | 'Noir' | 'Hardboiled'>('Standard');
  const [incidentReport, setIncidentReport] = useState<string>(
    'During the heavy London thunderstorm, the lights flickered and a scream echoed from the private parlor. When the butler entered, Lord Sterling was found slumped over his mahogany desk.'
  );
  const [victimName, setVictimName] = useState<string>('Lord Reginald Sterling');
  const [victimRole, setVictimRole] = useState<string>('Railroad Tycoon');
  const [victimDesc, setVictimDesc] = useState<string>(
    'A ruthless financier who made many enemies across high society and the London docks.'
  );

  // Suspects list
  const [suspects, setSuspects] = useState<Suspect[]>([
    {
      id: 'suspect_1',
      name: 'Arthur Pendelton',
      alias: 'The Valet',
      role: 'Head Valet',
      bio: 'Served Lord Sterling for 15 years. Recently threatened with dismissal over missing silverware.',
      motive: 'Threatened with termination and poverty after 15 years of loyal service',
      avatarEmoji: '🎩',
      accentColor: '#C69214',
      quirk: 'Repeatedly polishes his spectacles when nervous',
      fingerprintPattern: 'Loop',
      dialogues: [
        {
          question: 'Where were you when the thunder struck?',
          answer: 'I was in the pantry decanting the port wine, as my master instructed!',
          tone: 'Nervous & Trembling',
        },
      ],
    },
    {
      id: 'suspect_2',
      name: 'Lady Vivienne Sterling',
      alias: 'The Dowager',
      role: 'Estranged Heiress',
      bio: 'Disinherited from the Sterling fortune in a secret will signed just last week.',
      motive: 'Stand to lose the family estate under the new amended will',
      avatarEmoji: '👒',
      accentColor: '#A855F7',
      quirk: 'Twirls her diamond necklace whenever confronted with financial questions',
      fingerprintPattern: 'Whorl',
      dialogues: [
        {
          question: 'Did you know about the new will?',
          answer: 'Reginald was always making theatrical threats. I had no idea he was serious!',
          tone: 'Haughty & Defiant',
        },
      ],
    },
    {
      id: 'suspect_3',
      name: 'Captain Sean O’Malley',
      alias: 'The Smuggler',
      role: 'Thames Dock Captain',
      bio: 'Owed thousands of pounds in cargo debts to Lord Sterling’s shipping firm.',
      motive: 'Faced debtor prison unless Lord Sterling was permanently silenced',
      avatarEmoji: '⚓',
      accentColor: '#3B82F6',
      quirk: 'Scratches his bearded chin and glares aggressively at the inspector',
      fingerprintPattern: 'Arch',
      dialogues: [
        {
          question: 'What brought you to the manor tonight?',
          answer: 'A simple business disagreement, mate. I left through the garden long before midnight!',
          tone: 'Aggressive & Evasive',
        },
      ],
    },
  ]);

  // Weapons list
  const [weapons, setWeapons] = useState<Weapon[]>([
    {
      id: 'weapon_1',
      name: 'Cyanide-Laced Port',
      category: 'Poison',
      description: 'A crystal snifter smelling distinctly of bitter almonds and aged vintage port.',
      icon: '🍷',
    },
    {
      id: 'weapon_2',
      name: 'Antique Dueling Pistol',
      category: 'Firearm',
      description: 'An engraved flintlock pistol taken from the display case above the fireplace.',
      icon: '🔫',
    },
    {
      id: 'weapon_3',
      name: 'Silver Letter Opener',
      category: 'Blade',
      description: 'A razor-sharp Damascus steel blade wiped clean with a monogrammed linen napkin.',
      icon: '🗡️',
    },
  ]);

  // Locations list
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 'loc_1',
      name: 'Private Library',
      description: 'Wall-to-wall oak bookshelves with a heavy mahogany desk and crackling hearth.',
      icon: '📚',
    },
    {
      id: 'loc_2',
      name: 'Wine Cellar',
      description: 'Damp cobblestone corridor lined with French vintage barrels and iron gates.',
      icon: '🍾',
    },
    {
      id: 'loc_3',
      name: 'Conservatory',
      description: 'Glass-domed garden filled with exotic orchids and muddy boot prints near the french doors.',
      icon: '🌿',
    },
  ]);

  // Solution
  const [culpritId, setCulpritId] = useState<string>('suspect_1');
  const [weaponId, setWeaponId] = useState<string>('weapon_1');
  const [locationId, setLocationId] = useState<string>('loc_1');
  const [solutionExplanation, setSolutionExplanation] = useState<string>(
    'Arthur Pendelton used his pantry access to slip cyanide into Lord Sterling’s nightcap before retreating to the library, knowing the blackout would mask his footsteps.'
  );

  // Clues
  const [clues, setClues] = useState<Clue[]>([
    {
      id: 'clue_1',
      text: 'The culprit was seen near the decanter ten minutes before the thunder clap.',
      type: 'witness',
      source: 'Scullery Maid Testimony',
    },
    {
      id: 'clue_2',
      text: 'Fingerprints with a Loop pattern were lifted from the poisoned glass.',
      type: 'forensics',
      source: 'Precinct Fingerprint Powder',
    },
    {
      id: 'clue_3',
      text: 'Lady Vivienne was seen in the conservatory by the garden groundskeeper.',
      type: 'alibi',
      source: 'Gardener Statement',
    },
  ]);

  if (!isOpen) return null;

  // Build the complete Case object
  const compileCase = (): Case => {
    return {
      id: `custom_case_${Date.now()}`,
      caseNumber: Math.floor(100 + Math.random() * 900),
      date,
      title,
      difficulty,
      incidentReport,
      victim: {
        name: victimName,
        role: victimRole,
        description: victimDesc,
      },
      suspects,
      weapons,
      locations,
      clues,
      solution: {
        culpritId,
        weaponId,
        locationId,
        explanation: solutionExplanation,
      },
    };
  };

  const handlePlayNow = () => {
    const built = compileCase();
    sound.playGavel();
    // Save to custom cases in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('sleuth_custom_cases_v1') || '[]');
      saved.unshift(built);
      localStorage.setItem('sleuth_custom_cases_v1', JSON.stringify(saved.slice(0, 10)));
    } catch {}

    onPlayCustomCase(built);
    onClose();
  };

  const handleExportJson = () => {
    const built = compileCase();
    const str = JSON.stringify(built, null, 2);
    navigator.clipboard.writeText(str).then(() => {
      sound.playStamp();
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2500);
    });
  };

  const handleShareUrl = () => {
    const built = compileCase();
    try {
      const jsonStr = JSON.stringify(built);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const shareUrl = `${window.location.origin}${window.location.pathname}#case=${encoded}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        sound.playStamp();
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
      });
    } catch (e) {
      console.error('Failed to create share URL:', e);
    }
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.title && parsed.suspects && parsed.solution) {
        setTitle(parsed.title);
        setDate(parsed.date || '1895');
        setDifficulty(parsed.difficulty || 'Standard');
        setIncidentReport(parsed.incidentReport || '');
        if (parsed.victim) {
          setVictimName(parsed.victim.name || '');
          setVictimRole(parsed.victim.role || '');
          setVictimDesc(parsed.victim.description || '');
        }
        if (Array.isArray(parsed.suspects)) setSuspects(parsed.suspects);
        if (Array.isArray(parsed.weapons)) setWeapons(parsed.weapons);
        if (Array.isArray(parsed.locations)) setLocations(parsed.locations);
        if (Array.isArray(parsed.clues)) setClues(parsed.clues);
        if (parsed.solution) {
          setCulpritId(parsed.solution.culpritId);
          setWeaponId(parsed.solution.weaponId);
          setLocationId(parsed.solution.locationId);
          setSolutionExplanation(parsed.solution.explanation || '');
        }
        setIsImporting(false);
        sound.playStamp();
        alert('Case imported successfully! You can now review, edit, or play it.');
      } else {
        alert('Invalid case format. Make sure JSON contains title, suspects, and solution.');
      }
    } catch {
      alert('Invalid JSON syntax. Please check the text format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#141210] border-2 border-[#C69214]/70 shadow-[0_0_50px_rgba(198,146,20,0.25)] overflow-hidden text-[#DDD5C7]">
        {/* Header */}
        <div className="border-b border-[#2C261F] p-4 sm:p-5 bg-gradient-to-r from-[#201A12] via-[#2A1D13] to-[#201A12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2D2111] border border-[#C69214]/60 flex items-center justify-center text-2xl shadow-inner text-amber-400">
              ✍️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#FAF7F2] flex items-center gap-2">
                <span>DETECTIVE CASE STUDIO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                  LEVEL CREATOR
                </span>
              </h2>
              <p className="text-xs text-[#A89F91] font-mono">
                Author custom Victorian & Noir murder mysteries • Export/Import JSON • Play instantly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImporting(!isImporting)}
              className="px-2.5 py-1.5 rounded-lg bg-[#221D17] hover:bg-[#2F271E] border border-[#3A3226] text-xs font-mono text-stone-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>

            <button
              onClick={() => {
                sound.playCassetteClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#221D17] hover:bg-[#2F261E] border border-[#3E3427] text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Import JSON Dropdown Panel */}
        {isImporting && (
          <div className="p-4 bg-[#1A1612] border-b border-[#30281E] animate-in slide-in-from-top-2 duration-150">
            <div className="text-xs font-mono font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Paste Custom Case JSON from a Friend</span>
            </div>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste complete case JSON here..."
              className="w-full bg-[#100E0D] border border-[#352D22] rounded-xl p-2.5 text-xs font-mono text-stone-200 focus:border-amber-500 outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsImporting(false)}
                className="px-3 py-1 rounded-lg text-xs font-mono text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs"
              >
                Load & Build Case
              </button>
            </div>
          </div>
        )}

        {/* Multi-Step Wizard Tabs */}
        <div className="flex border-b border-[#28221B] bg-[#171411] px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { step: 1, label: '1. Incident Narrative', icon: FileText },
            { step: 2, label: '2. Suspects & Alibis', icon: Users },
            { step: 3, label: '3. Weapons & Rooms', icon: Crosshair },
            { step: 4, label: '4. Secret Solution & Clues', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.step;
            return (
              <button
                key={tab.step}
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setActiveStep(tab.step as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-300 bg-[#221B13]'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STEP 1: INCIDENT NARRATIVE */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-mono font-bold text-amber-400 uppercase mb-1">
                    Mystery Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#181410] border border-[#322A20] rounded-xl px-3 py-2 text-sm font-serif font-bold text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-mono font-bold text-stone-400 uppercase mb-1">
                    Case Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#181410] border border-[#322A20] rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-mono font-bold text-stone-400 uppercase mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#181410] border border-[#322A20] rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Standard">Standard (3 Suspects)</option>
                    <option value="Noir">Noir (4 Suspects)</option>
                    <option value="Hardboiled">Hardboiled (5 Suspects)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-amber-400 uppercase mb-1">
                  Incident Briefing Report
                </label>
                <textarea
                  rows={3}
                  value={incidentReport}
                  onChange={(e) => setIncidentReport(e.target.value)}
                  className="w-full bg-[#181410] border border-[#322A20] rounded-xl p-3 text-xs font-mono text-stone-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="bg-[#1C1813] border border-[#32281D] rounded-xl p-3.5 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Victim Dossier
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase mb-0.5">
                      Victim Full Name
                    </label>
                    <input
                      type="text"
                      value={victimName}
                      onChange={(e) => setVictimName(e.target.value)}
                      className="w-full bg-[#120F0D] border border-[#2E2419] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase mb-0.5">
                      Occupation / High Society Role
                    </label>
                    <input
                      type="text"
                      value={victimRole}
                      onChange={(e) => setVictimRole(e.target.value)}
                      className="w-full bg-[#120F0D] border border-[#2E2419] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-stone-400 uppercase mb-0.5">
                    Background Context
                  </label>
                  <input
                    type="text"
                    value={victimDesc}
                    onChange={(e) => setVictimDesc(e.target.value)}
                    className="w-full bg-[#120F0D] border border-[#2E2419] rounded-lg px-2.5 py-1.5 text-xs text-stone-300 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SUSPECTS BUILDER */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Cast of Suspects ({suspects.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playTypewriter();
                    const newId = `suspect_${suspects.length + 1}`;
                    setSuspects([
                      ...suspects,
                      {
                        id: newId,
                        name: `Suspect #${suspects.length + 1}`,
                        alias: 'The Stranger',
                        role: 'House Guest',
                        bio: 'Arrived unannounced on the midnight carriage.',
                        motive: 'Secret debt owed to the victim.',
                        avatarEmoji: '🕵️',
                        accentColor: '#10B981',
                        quirk: 'Avoids eye contact and checks pocket watch.',
                        fingerprintPattern: 'Loop',
                      },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Suspect</span>
                </button>
              </div>

              <div className="space-y-3">
                {suspects.map((s, idx) => (
                  <div
                    key={s.id}
                    className="bg-[#1A1612] border border-[#30281E] rounded-xl p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#282017] pb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={s.avatarEmoji}
                          onChange={(e) => {
                            const updated = [...suspects];
                            updated[idx].avatarEmoji = e.target.value;
                            setSuspects(updated);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#120F0D] border border-[#382E20] text-center text-lg outline-none"
                        />
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => {
                            const updated = [...suspects];
                            updated[idx].name = e.target.value;
                            setSuspects(updated);
                          }}
                          className="bg-transparent font-serif font-bold text-amber-200 text-sm outline-none border-b border-stone-700 focus:border-amber-500"
                        />
                      </div>
                      {suspects.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playTypewriter();
                            setSuspects(suspects.filter((_, i) => i !== idx));
                          }}
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={s.role}
                          onChange={(e) => {
                            const updated = [...suspects];
                            updated[idx].role = e.target.value;
                            setSuspects(updated);
                          }}
                          className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-stone-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase">
                          Fingerprint Type
                        </label>
                        <select
                          value={s.fingerprintPattern || 'Loop'}
                          onChange={(e) => {
                            const updated = [...suspects];
                            updated[idx].fingerprintPattern = e.target.value as FingerprintPattern;
                            setSuspects(updated);
                          }}
                          className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-stone-200 outline-none"
                        >
                          <option value="Loop">Loop</option>
                          <option value="Whorl">Whorl</option>
                          <option value="Arch">Arch</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase">
                          Nervous Quirk / Tell
                        </label>
                        <input
                          type="text"
                          value={s.quirk}
                          onChange={(e) => {
                            const updated = [...suspects];
                            updated[idx].quirk = e.target.value;
                            setSuspects(updated);
                          }}
                          className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-stone-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-stone-400 uppercase mb-0.5">
                        Suspect Motive
                      </label>
                      <input
                        type="text"
                        value={s.motive}
                        onChange={(e) => {
                          const updated = [...suspects];
                          updated[idx].motive = e.target.value;
                          setSuspects(updated);
                        }}
                        className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-xs text-stone-300 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: WEAPONS & LOCATIONS */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in duration-150">
              {/* Weapons Column */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center justify-between">
                  <span>Murder Weapons ({weapons.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setWeapons([
                        ...weapons,
                        {
                          id: `weapon_${weapons.length + 1}`,
                          name: `Weapon #${weapons.length + 1}`,
                          category: 'Blunt',
                          description: 'Found discarded near the library curtains.',
                          icon: '🔨',
                        },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-200 hover:bg-stone-700"
                  >
                    + Add Weapon
                  </button>
                </div>

                {weapons.map((w, idx) => (
                  <div
                    key={w.id}
                    className="bg-[#1A1612] border border-[#2D261D] rounded-xl p-3 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={w.icon}
                        onChange={(e) => {
                          const updated = [...weapons];
                          updated[idx].icon = e.target.value;
                          setWeapons(updated);
                        }}
                        className="w-8 h-8 rounded bg-[#120F0D] border border-[#382E20] text-center text-base outline-none"
                      />
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => {
                          const updated = [...weapons];
                          updated[idx].name = e.target.value;
                          setWeapons(updated);
                        }}
                        className="flex-1 bg-transparent font-serif font-bold text-white text-xs outline-none border-b border-stone-700"
                      />
                      <select
                        value={w.category}
                        onChange={(e) => {
                          const updated = [...weapons];
                          updated[idx].category = e.target.value as any;
                          setWeapons(updated);
                        }}
                        className="bg-[#120F0D] border border-[#2B2319] rounded px-2 py-1 text-[10px] text-stone-300 outline-none"
                      >
                        <option value="Blade">Blade</option>
                        <option value="Poison">Poison</option>
                        <option value="Blunt">Blunt</option>
                        <option value="Firearm">Firearm</option>
                        <option value="Unusual">Unusual</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={w.description}
                      onChange={(e) => {
                        const updated = [...weapons];
                        updated[idx].description = e.target.value;
                        setWeapons(updated);
                      }}
                      className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-[11px] text-stone-300 outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Locations Column */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center justify-between">
                  <span>Crime Scene Rooms ({locations.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setLocations([
                        ...locations,
                        {
                          id: `loc_${locations.length + 1}`,
                          name: `Room #${locations.length + 1}`,
                          description: 'Heavy drapes and locked windows.',
                          icon: '🚪',
                        },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-200 hover:bg-stone-700"
                  >
                    + Add Room
                  </button>
                </div>

                {locations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    className="bg-[#1A1612] border border-[#2D261D] rounded-xl p-3 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={loc.icon}
                        onChange={(e) => {
                          const updated = [...locations];
                          updated[idx].icon = e.target.value;
                          setLocations(updated);
                        }}
                        className="w-8 h-8 rounded bg-[#120F0D] border border-[#382E20] text-center text-base outline-none"
                      />
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => {
                          const updated = [...locations];
                          updated[idx].name = e.target.value;
                          setLocations(updated);
                        }}
                        className="flex-1 bg-transparent font-serif font-bold text-white text-xs outline-none border-b border-stone-700"
                      />
                    </div>
                    <input
                      type="text"
                      value={loc.description}
                      onChange={(e) => {
                        const updated = [...locations];
                        updated[idx].description = e.target.value;
                        setLocations(updated);
                      }}
                      className="w-full bg-[#120F0D] border border-[#2B2319] rounded p-1.5 text-[11px] text-stone-300 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SECRET SOLUTION & CLUES */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#201910] border-2 border-amber-500/70 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>The Secret Solution (Who truly did it?)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                      Guilty Culprit
                    </label>
                    <select
                      value={culpritId}
                      onChange={(e) => setCulpritId(e.target.value)}
                      className="w-full bg-[#120F0D] border border-[#3A2E20] rounded-lg p-2 text-xs font-serif font-bold text-amber-300 outline-none"
                    >
                      {suspects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.avatarEmoji} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                      Murder Weapon
                    </label>
                    <select
                      value={weaponId}
                      onChange={(e) => setWeaponId(e.target.value)}
                      className="w-full bg-[#120F0D] border border-[#3A2E20] rounded-lg p-2 text-xs font-serif font-bold text-amber-300 outline-none"
                    >
                      {weapons.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.icon} {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                      Crime Scene
                    </label>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full bg-[#120F0D] border border-[#3A2E20] rounded-lg p-2 text-xs font-serif font-bold text-amber-300 outline-none"
                    >
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.icon} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
                    Confession Breakdown & Rationale
                  </label>
                  <textarea
                    rows={2}
                    value={solutionExplanation}
                    onChange={(e) => setSolutionExplanation(e.target.value)}
                    className="w-full bg-[#120F0D] border border-[#3A2E20] rounded-lg p-2 text-xs font-mono text-stone-200 outline-none"
                  />
                </div>
              </div>

              {/* Clues Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-300 uppercase">
                    Investigation Clues ({clues.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTypewriter();
                      setClues([
                        ...clues,
                        {
                          id: `clue_${clues.length + 1}`,
                          text: 'A monogrammed cufflink was found underneath the table leg.',
                          type: 'forensics',
                          source: 'Forensics Dusting',
                        },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-200 hover:bg-stone-700"
                  >
                    + Add Clue
                  </button>
                </div>

                {clues.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 bg-[#171411] border border-[#2B241D] rounded-xl p-2.5"
                  >
                    <span className="text-xs text-amber-500 font-mono font-bold">#{idx + 1}</span>
                    <input
                      type="text"
                      value={c.text}
                      onChange={(e) => {
                        const updated = [...clues];
                        updated[idx].text = e.target.value;
                        setClues(updated);
                      }}
                      className="flex-1 bg-transparent text-xs text-stone-200 font-mono outline-none"
                    />
                    <select
                      value={c.type}
                      onChange={(e) => {
                        const updated = [...clues];
                        updated[idx].type = e.target.value as any;
                        setClues(updated);
                      }}
                      className="bg-[#120F0D] border border-[#352B20] text-[10px] rounded px-1.5 py-1 text-stone-300 outline-none"
                    >
                      <option value="witness">Witness</option>
                      <option value="forensics">Forensics</option>
                      <option value="alibi">Alibi</option>
                      <option value="scene">Scene</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#2B241D] p-3 sm:p-4 bg-[#181411] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-[#221D17] hover:bg-[#2C251E] border border-[#3A3125] text-xs font-mono text-stone-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copiedStatus ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">JSON Copied!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Case JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              className="px-3 py-2 rounded-xl bg-[#292218] hover:bg-[#382E20] border border-amber-500/50 text-xs font-mono text-amber-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Copy 1-click playable web link to clipboard"
            >
              {copiedUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share Web Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setActiveStep((activeStep - 1) as any);
                }}
                className="px-3 py-2 rounded-xl text-xs font-mono text-stone-400 hover:text-white"
              >
                Back
              </button>
            )}

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  sound.playTypewriter();
                  setActiveStep((activeStep + 1) as any);
                }}
                className="px-4 py-2 rounded-xl bg-[#2C241B] hover:bg-[#3D3224] border border-amber-600/50 text-amber-300 font-mono font-bold text-xs"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlayNow}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-mono font-bold text-xs shadow-lg shadow-amber-900/40 flex items-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Custom Case Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
