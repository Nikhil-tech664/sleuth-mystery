import type { Case, Suspect, Weapon, Location, Clue, CrimeSceneHotspot, FingerprintPattern } from '../types/game';

interface EraTheme {
  name: string;
  suspects: { name: string; alias: string; role: string; bio: string; motive: string; avatar: string; color: string; quirk: string; fingerprint: FingerprintPattern }[];
  weapons: { name: string; category: 'Blunt' | 'Blade' | 'Poison' | 'Firearm' | 'Unusual'; description: string; icon: string }[];
  locations: { name: string; description: string; icon: string }[];
  incidentPrefixes: string[];
}

const ERA_THEMES: Record<string, EraTheme> = {
  victorian: {
    name: 'Victorian London (1890)',
    suspects: [
      { name: 'Lord Sebastian Crane', alias: 'The Aviation Pioneer', role: 'Airship Magnate', bio: 'Incurred immense debt building rigid dirigibles.', motive: 'Victorian patent feud and stolen blueprints.', avatar: '🧐', color: '#4ADE80', quirk: 'Taps his golden monocle rhythmically.', fingerprint: 'Loop' },
      { name: 'Mademoiselle Colette', alias: 'The Silk Acrobat', role: 'Jewel Thief', bio: 'Wanted by Scotland Yard for grand jewel heists.', motive: 'Blackmailed over stolen Romanov pearls.', avatar: '🦹‍♀️', color: '#EC4899', quirk: 'Wears kidskin gloves indoors.', fingerprint: 'Arch' },
      { name: 'Professor Thaddeus Gray', alias: 'The Antiquarian', role: 'Oxford Historian', bio: 'Expelled from the Royal Society for grave-robbing.', motive: 'Reclaiming an ancient Coptic manuscript.', avatar: '📜', color: '#F59E0B', quirk: 'Smells faintly of old library glue.', fingerprint: 'Whorl' },
      { name: 'Baroness Ilona Varga', alias: 'The Alchemist', role: 'Toxicologist', bio: 'Secretly formulated banned industrial poisons.', motive: 'Silencing a competitor who held her laboratory notes.', avatar: '🧪', color: '#A855F7', quirk: 'Her fingertips are stained with cobalt dye.', fingerprint: 'Loop' },
    ],
    weapons: [
      { name: 'Silver Serpent Cane', category: 'Blunt', description: 'Weighted lead cane with a coiled brass serpent pommel.', icon: '🦯' },
      { name: 'Monogrammed Stiletto', category: 'Blade', description: 'Needle-thin steel dagger forged in Toledo.', icon: '🗡️' },
      { name: 'Belladonna Perfume Flask', category: 'Poison', description: 'Crystal perfume atomizer containing deadly nightshade extract.', icon: '🧪' },
      { name: 'Engraved Flintlock Pistol', category: 'Firearm', description: 'Bespoke duelling pistol with hand-cast silver ball.', icon: '🔫' },
    ],
    locations: [
      { name: 'The Whispering Gallery', description: 'Curved stone dome where acoustics carry the faintest whisper.', icon: '🏛️' },
      { name: 'The Orchid Conservatory', description: 'Humid glasshouse filled with carnivorous jungle flora.', icon: '🌿' },
      { name: 'The Clocktower Balcony', description: 'Exposed belfry overlooking foggy London rooftops.', icon: '🕰️' },
      { name: 'The Old Alchemist Crypt', description: 'Subterranean medieval vault lit by sputtering tallow candles.', icon: '🕯️' },
    ],
    incidentPrefixes: [
      'As Big Ben struck midnight through the peasoup fog, industrialist Sir Reginald Vance was discovered motionless.',
      'During the annual Royal Society exhibition, renowned collector Archibald Graves collapsed suddenly.',
    ],
  },
  speakeasy: {
    name: 'Chicago Speakeasy (1928)',
    suspects: [
      { name: 'Johnny "Two-Times" Valenti', alias: 'The Underboss', role: 'Casino Boss', bio: 'Demoted by syndicate leaders for skimming gate tabs.', motive: 'Taking over the South Side territory.', avatar: '🤵', color: '#3B82F6', quirk: 'Flips a 1921 silver dollar across his knuckles.', fingerprint: 'Loop' },
      { name: 'Roxy "Velvet" Malone', alias: 'The Torch Singer', role: 'Jazz Diva', bio: 'Trapped in a predatory recording contract.', motive: 'Winning back the deed to her jazz master tracks.', avatar: '🎤', color: '#F43F5E', quirk: 'Hums sultry blues melodies between answers.', fingerprint: 'Whorl' },
      { name: 'Mickey "The Wrench" Burke', alias: 'The Bootlegger', role: 'Truck Fleet Driver', bio: 'Owed thousands in poker markers to syndicate bookies.', motive: 'Ending debts before enforcers arrived.', avatar: '🧢', color: '#10B981', quirk: 'Spits toothpicks into a brass cuspidor.', fingerprint: 'Arch' },
    ],
    weapons: [
      { name: 'Snubnose .38 Detective', category: 'Firearm', description: 'Compact five-shot revolver with mother-of-pearl grips.', icon: '🔫' },
      { name: 'Weighted Brass Saxophone', category: 'Blunt', description: 'Solid metal tenor saxophone with dented horn rim.', icon: '🎷' },
      { name: 'Methyl Bathtub Gin', category: 'Poison', description: 'Unlabeled stone jug of lethal industrial wood alcohol.', icon: '🍶' },
      { name: 'Barber Straight Razor', category: 'Blade', description: 'Honed German steel razor with carved ebony scales.', icon: '🪒' },
    ],
    locations: [
      { name: 'The VIP Poker Vault', description: 'Smoke-choked cellar behind a fake bookcase lined with bourbon barrels.', icon: '♠️' },
      { name: 'The Velvet Stage Bandstand', description: 'Elevated parquet stage framed by heavy crimson satin curtains.', icon: '🎺' },
      { name: 'The Bootleg Truck Loading Bay', description: 'Wet cobblestone alley filled with exhaust fumes and wooden crates.', icon: '🚚' },
    ],
    incidentPrefixes: [
      'While the jazz band roared through "Tin Roof Blues", syndicate kingpin Dominic Moretti was found slumped over his cards.',
      'Behind the secret iron door of Club 21, bootleg magnate Big Sal was silenced during the midnight Charleston.',
    ],
  },
  cybernoir: {
    name: 'Cyber-Noir Megacity (2088)',
    suspects: [
      { name: 'Cipher-09', alias: 'The Glitch Courier', role: 'Data Smuggler', bio: 'Carries encrypted military neural implants in their cortex.', motive: 'Selling proprietary quantum keys on the darknet.', avatar: '🤖', color: '#06B6D4', quirk: 'Optical neon ocular lens pulses violet when lying.', fingerprint: 'Whorl' },
      { name: 'Dr. Vesper Vance', alias: 'The Gene Splicer', role: 'Biotech Executive', bio: 'Faced imminent corporate audit for black-market cyberware.', motive: 'Preventing executive recall and neural wipedown.', avatar: '🧬', color: '#A855F7', quirk: 'Taps chrome finger servos against glass.', fingerprint: 'Loop' },
      { name: 'Zero "The Razor" Chen', alias: 'The Neon Mercenary', role: 'Syndicate Ronin', bio: 'Hired to extract a corporate defector; target broke protocol.', motive: 'Completing a multi-million credit bounty contract.', avatar: '🗡️', color: '#E11D48', quirk: 'Chews synth-nicotine gum constantly.', fingerprint: 'Arch' },
    ],
    weapons: [
      { name: 'Monofilament Laser Wire', category: 'Blade', description: 'Micro-thin plasma strand capable of slicing titanium alloy.', icon: '⚡' },
      { name: 'Neurotoxin Neural Dart', category: 'Poison', description: 'Cryogenic micro-capsule inducing instant synaptic paralysis.', icon: '🧪' },
      { name: 'Titanium Kinetic Knuckles', category: 'Blunt', description: 'Pneumatic combat knuckles with hydraulic impact studs.', icon: '🥊' },
      { name: 'Thermal Pulse Pistol', category: 'Firearm', description: 'High-voltage plasma gun with customized heatsink shroud.', icon: '🔫' },
    ],
    locations: [
      { name: 'The Neon Penthouse Garden', description: 'Hydroponic sakura garden high above toxic cloud layers.', icon: '🌸' },
      { name: 'The Quantum Server Core', description: 'Sub-zero liquid nitrogen chamber humming with petabytes.', icon: '💾' },
      { name: 'The Sky-Trolley Terminal', description: 'Rain-soaked magnetic monorail dock overlooking holographic billboards.', icon: '🚊' },
    ],
    incidentPrefixes: [
      'High in the stratospheric penthouse of OmniCorp Tower, CEO Hideo Tanaka suffered catastrophic neural flatline.',
      'Under the blinding neon glare of Sector 4, cybernetic syndicate broker Renzo was eliminated mid-transaction.',
    ],
  },
};

export function generateProceduralCase(caseNumber: number, eraKey: string = 'victorian', difficulty: 'Standard' | 'Noir' | 'Hardboiled' = 'Noir'): Case {
  const theme = ERA_THEMES[eraKey] || ERA_THEMES.victorian;

  // 1. Pick 3 random suspects, 3 weapons, 3 locations
  const shuffledSuspects = [...theme.suspects].sort(() => 0.5 - Math.random()).slice(0, 3);
  const shuffledWeapons = [...theme.weapons].sort(() => 0.5 - Math.random()).slice(0, 3);
  const shuffledLocations = [...theme.locations].sort(() => 0.5 - Math.random()).slice(0, 3);

  const suspectIds = ['s_1', 's_2', 's_3'];
  const weaponIds = ['w_1', 'w_2', 'w_3'];
  const locationIds = ['loc_1', 'loc_2', 'loc_3'];

  // 2. Formulate 1-to-1 Bijection Mapping
  // s_1 <-> w_1 <-> loc_1
  // s_2 <-> w_2 <-> loc_2
  // s_3 <-> w_3 <-> loc_3
  const culpritIndex = Math.floor(Math.random() * 3);
  const culpritId = suspectIds[culpritIndex];
  const murderWeaponId = weaponIds[culpritIndex];
  const crimeSceneId = locationIds[culpritIndex];

  // Suspects object
  const suspects: Suspect[] = shuffledSuspects.map((s, idx) => ({
    id: suspectIds[idx],
    name: s.name,
    alias: s.alias,
    role: s.role,
    bio: s.bio,
    motive: s.motive,
    avatarEmoji: s.avatar,
    accentColor: s.color,
    quirk: s.quirk,
    fingerprintPattern: s.fingerprint,
    dialogues: [
      {
        question: `Where were you when the murder occurred?`,
        answer: `I was nowhere near the crime scene! I was minding my own affairs. You have no jurisdiction to detain me!`,
        tone: 'Agitated & Guarded',
      },
      {
        question: `What was your grievance with the deceased?`,
        answer: `${s.motive}. But that doesn't make me a killer! Look at the other suspects!`,
        tone: 'Defensive',
      },
      {
        question: `Did you handle any lethal implements tonight?`,
        answer: `Never touched a weapon! I abhor unnecessary violence!`,
        tone: 'Nervous Voice Pitch',
      },
    ],
  }));

  // Weapons object
  const weapons: Weapon[] = shuffledWeapons.map((w, idx) => ({
    id: weaponIds[idx],
    name: w.name,
    category: w.category,
    description: w.description,
    icon: w.icon,
  }));

  // Locations object
  const locations: Location[] = shuffledLocations.map((l, idx) => ({
    id: locationIds[idx],
    name: l.name,
    description: l.description,
    icon: l.icon,
  }));

  // 3. Mathematical Single-Solution Clues
  // Clue 1: loc_1 has weapon w_1
  // Clue 2: suspect s_2 was in loc_2
  // Clue 3: suspect s_3 was in loc_3
  // Clue 4: loc_2 has weapon w_2
  // Clue 5: Coroner autopsy proves murder weapon is murderWeaponId
  const clues: Clue[] = [
    {
      id: 'clue_p_1',
      type: 'scene',
      source: 'Forensic Scene Sweep',
      text: `The person in ${locations[0].name} was definitely holding the ${weapons[0].name}.`,
    },
    {
      id: 'clue_p_2',
      type: 'witness',
      source: 'Security Guard Statement',
      text: `${suspects[1].name} was seen stationed inside ${locations[1].name} throughout the incident.`,
    },
    {
      id: 'clue_p_3',
      type: 'alibi',
      source: 'Witness Testimony',
      text: `${suspects[2].name} remained trapped inside ${locations[2].name}.`,
    },
    {
      id: 'clue_p_4',
      type: 'forensics',
      source: 'Evidence Log',
      text: `The ${weapons[1].name} was recovered from ${locations[1].name}.`,
    },
    {
      id: 'clue_p_5',
      type: 'forensics',
      source: "Coroner's Autopsy Report",
      text: `Medical examination confirms the victim perished from wounds matching the ${weapons[culpritIndex].name}!`,
    },
  ];

  // Hotspots
  const hotspots: CrimeSceneHotspot[] = [
    {
      id: `spot_p_1`,
      name: `${locations[0].name} Table`,
      xPercent: 25,
      yPercent: 55,
      icon: weapons[0].icon,
      evidenceTitle: weapons[0].name,
      forensicObservation: `Recovered evidence matching ${weapons[0].name} in ${locations[0].name}.`,
      evidenceTag: 'EVID-P01',
      fingerprintPattern: suspects[0].fingerprintPattern,
      associatedClueId: 'clue_p_1',
      chemicalReaction: weapons[0].category === 'Blade' ? { type: 'blood', label: 'Blood Residue', luminescenceColor: '#38BDF8' } : undefined,
    },
    {
      id: `spot_p_2`,
      name: `${locations[1].name} Floor`,
      xPercent: 55,
      yPercent: 70,
      icon: weapons[1].icon,
      evidenceTitle: weapons[1].name,
      forensicObservation: `Discovered discarded ${weapons[1].name} on the floor.`,
      evidenceTag: 'EVID-P02',
      fingerprintPattern: suspects[1].fingerprintPattern,
      associatedClueId: 'clue_p_4',
    },
    {
      id: `spot_p_3`,
      name: `${locations[2].name} Alcove`,
      xPercent: 80,
      yPercent: 40,
      icon: weapons[2].icon,
      evidenceTitle: weapons[2].name,
      forensicObservation: `Forensic markings link ${weapons[2].name} to this perimeter.`,
      evidenceTag: 'EVID-P03',
      fingerprintPattern: suspects[2].fingerprintPattern,
      associatedClueId: 'clue_p_5',
      chemicalReaction: weapons[2].category === 'Poison' ? { type: 'cyanide', label: 'Toxin Traces', luminescenceColor: '#C084FC' } : undefined,
    },
  ];

  const prefix = theme.incidentPrefixes[Math.floor(Math.random() * theme.incidentPrefixes.length)];
  const victimName = `Lord Marcus Sterling III`;

  return {
    id: `case-procedural-${caseNumber}-${Date.now()}`,
    caseNumber,
    date: `Procedural Case #${caseNumber}`,
    title: `Mystery of ${locations[crimeSceneId === 'loc_1' ? 0 : crimeSceneId === 'loc_2' ? 1 : 2].name}`,
    difficulty,
    incidentReport: `${prefix} Three key suspects were apprehended on the perimeter, each with strong motives and conflicting alibis.`,
    victim: {
      name: victimName,
      role: 'High-Society Patron',
      description: 'Known for carrying private ledgers and cutting enemies out of valuable trusts.',
    },
    suspects,
    weapons,
    locations,
    clues,
    solution: {
      culpritId,
      weaponId: murderWeaponId,
      locationId: crimeSceneId,
      explanation: `By deduction: ${suspects[1].name} was in ${locations[1].name} with ${weapons[1].name}. ${suspects[2].name} was in ${locations[2].name} with ${weapons[2].name}. Therefore ${suspects[0].name} was in ${locations[0].name} with ${weapons[0].name}. Autopsy proved ${weapons[culpritIndex].name} caused death, closing the case against ${suspects[culpritIndex].name}!`,
    },
    hotspots,
    trophy: {
      id: `trophy-p-${caseNumber}`,
      name: `The Relic of ${locations[culpritIndex].name}`,
      icon: weapons[culpritIndex].icon,
      description: `Recovered forensic item from Case #${caseNumber}.`,
      lore: `Archived into precinct records upon successful conviction of ${suspects[culpritIndex].name}.`,
    },
    hint: `Check the coroner's autopsy report for the murder weapon. Then follow the location clues to see who held it.`,
  };
}
