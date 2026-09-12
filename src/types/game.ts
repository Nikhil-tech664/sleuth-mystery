export type CellState = null | 'no' | 'yes';

export interface InterrogationDialogue {
  question: string;
  answer: string;
  tone: string;
}

export type FingerprintPattern = 'Whorl' | 'Loop' | 'Arch';

export interface Suspect {
  id: string;
  name: string;
  alias: string;
  role: string;
  bio: string;
  motive: string;
  avatarEmoji: string;
  portraitUrl?: string;
  accentColor: string;
  quirk: string;
  fingerprintPattern?: FingerprintPattern;
  dialogues?: InterrogationDialogue[];
}

export interface Weapon {
  id: string;
  name: string;
  category: 'Blunt' | 'Blade' | 'Poison' | 'Firearm' | 'Unusual';
  description: string;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Clue {
  id: string;
  text: string;
  type: 'witness' | 'forensics' | 'alibi' | 'scene';
  source?: string;
}

export interface CrimeSceneHotspot {
  id: string;
  name: string;
  xPercent: number; // 0-100% position on crime scene canvas
  yPercent: number; // 0-100% position on crime scene canvas
  icon: string;
  evidenceTitle: string;
  forensicObservation: string;
  associatedClueId?: string;
  evidenceTag: string;
  fingerprintPattern?: FingerprintPattern;
  chemicalReaction?: {
    type: 'blood' | 'cyanide' | 'gunpowder';
    label: string;
    luminescenceColor: string;
  };
  cipherSnippet?: {
    encrypted: string;
    decrypted: string;
    shift: number;
    hint: string;
  };
}

export interface CaseSolution {
  culpritId: string;
  weaponId: string;
  locationId: string;
  explanation: string;
}

export interface CaseTrophy {
  id: string;
  name: string;
  icon: string;
  description: string;
  lore: string;
}

export interface Case {
  id: string;
  caseNumber: number;
  date: string;
  title: string;
  difficulty: 'Standard' | 'Noir' | 'Hardboiled';
  incidentReport: string;
  victim: {
    name: string;
    role: string;
    description: string;
    portraitUrl?: string;
  };
  suspects: Suspect[];
  weapons: Weapon[];
  locations: Location[];
  clues: Clue[];
  solution: CaseSolution;
  hotspots?: CrimeSceneHotspot[];
  trophy?: CaseTrophy;
  hint?: string;
  isVaultCase?: boolean;
  isDaily?: boolean;
}

export interface DeductionState {
  grid: Record<string, CellState>; // format: "categoryA:idA-categoryB:idB"
  notes: string;
  checkedClues: Record<string, boolean>;
  discoveredHotspots: Record<string, boolean>;
  hintsUsed: number;
  xpEarned: number;
  accusation: {
    suspectId: string | null;
    weaponId: string | null;
    locationId: string | null;
  };
  strikes: number;
  isSolved: boolean;
  startTime: number;
  solvedTime: number | null;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  rankIndex: number;
  history: Record<string, {
    caseNumber: number;
    title: string;
    timeSeconds: number;
    strikes: number;
    date: string;
  }>;
}

export interface DetectiveRank {
  title: string;
  casesRequired: number;
  badge: string;
  description: string;
}
