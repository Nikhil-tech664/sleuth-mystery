import type { Case, DeductionState, UserStats } from '../types/game';

const STATS_KEY = 'sleuth_user_stats_v1';
const DEDUCTION_PREFIX = 'sleuth_case_state_';
const PRO_STATUS_KEY = 'sleuth_pro_unlocked_v1';
const MUTE_KEY = 'sleuth_audio_muted_v1';

export function getInitialDeductionState(caseId: string): DeductionState {
  const defaults: DeductionState = {
    grid: {},
    notes: '',
    checkedClues: {},
    discoveredHotspots: {},
    hintsUsed: 0,
    xpEarned: 0,
    accusation: {
      suspectId: null,
      weaponId: null,
      locationId: null,
    },
    strikes: 0,
    isSolved: false,
    startTime: Date.now(),
    solvedTime: null,
  };

  try {
    const saved = localStorage.getItem(DEDUCTION_PREFIX + caseId);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaults,
        ...parsed,
        grid: parsed.grid || {},
        checkedClues: parsed.checkedClues || {},
        discoveredHotspots: parsed.discoveredHotspots || {},
        hintsUsed: parsed.hintsUsed ?? 0,
        xpEarned: parsed.xpEarned ?? 0,
      };
    }
  } catch (e) {
    console.error('Failed to parse saved state:', e);
  }

  return defaults;
}

export function saveDeductionState(caseId: string, state: DeductionState) {
  try {
    localStorage.setItem(DEDUCTION_PREFIX + caseId, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function getUserStats(): UserStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse stats:', e);
  }

  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    rankIndex: 0,
    history: {},
  };
}

export function recordCaseVictory(
  caseId: string,
  caseNumber: number,
  title: string,
  timeSeconds: number,
  strikes: number
): UserStats {
  const current = getUserStats();

  if (current.history[caseId]) {
    // Already recorded victory for this case
    return current;
  }

  const newGamesWon = current.gamesWon + 1;
  const newGamesPlayed = current.gamesPlayed + 1;
  const newCurrentStreak = current.currentStreak + 1;
  const newMaxStreak = Math.max(current.maxStreak, newCurrentStreak);

  const updated: UserStats = {
    gamesPlayed: newGamesPlayed,
    gamesWon: newGamesWon,
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    rankIndex: Math.floor(newGamesWon / 2),
    history: {
      ...current.history,
      [caseId]: {
        caseNumber,
        title,
        timeSeconds,
        strikes,
        date: new Date().toISOString(),
      },
    },
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save updated stats:', e);
  }

  return updated;
}

export function getProStatus(): boolean {
  try {
    return localStorage.getItem(PRO_STATUS_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setProStatus(unlocked: boolean) {
  try {
    localStorage.setItem(PRO_STATUS_KEY, unlocked ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save pro status:', e);
  }
}

export function getMutedPreference(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMutedPreference(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save mute preference:', e);
  }
}

export function completeAllCases(cases: Case[]): UserStats {
  const now = Date.now();
  const history: Record<string, any> = {};

  cases.forEach((c, idx) => {
    const grid: Record<string, any> = {};

    c.suspects.forEach((s) => {
      c.weapons.forEach((w) => {
        const isMatch = s.id === c.solution.culpritId && w.id === c.solution.weaponId;
        grid[`suspect:${s.id}-weapon:${w.id}`] = isMatch ? 'yes' : 'no';
      });
      c.locations.forEach((l) => {
        const isMatch = s.id === c.solution.culpritId && l.id === c.solution.locationId;
        grid[`suspect:${s.id}-location:${l.id}`] = isMatch ? 'yes' : 'no';
      });
    });
    c.weapons.forEach((w) => {
      c.locations.forEach((l) => {
        const isMatch = w.id === c.solution.weaponId && l.id === c.solution.locationId;
        grid[`weapon:${w.id}-location:${l.id}`] = isMatch ? 'yes' : 'no';
      });
    });

    const checkedClues: Record<string, boolean> = {};
    (c.clues || []).forEach((clue) => {
      checkedClues[clue.id] = true;
    });

    const discoveredHotspots: Record<string, boolean> = {};
    (c.hotspots || []).forEach((h) => {
      discoveredHotspots[h.id] = true;
    });

    const completedState: DeductionState = {
      grid,
      notes: `★ OFFICIAL SCOTLAND YARD CASE CLOSURE REPORT ★\n\nStatus: CLOSED - PERPETRATOR SENTENCED\nCulprit Confessed: ${c.solution.culpritId}\nMurder Weapon Confiscated: ${c.solution.weaponId}\nCrime Scene Sealed: ${c.solution.locationId}\n\nEvidence verified by Chief Detective. All alibis cross-referenced and motive proven.`,
      checkedClues,
      discoveredHotspots,
      hintsUsed: 0,
      xpEarned: 500,
      accusation: {
        suspectId: c.solution.culpritId,
        weaponId: c.solution.weaponId,
        locationId: c.solution.locationId,
      },
      strikes: 0,
      isSolved: true,
      startTime: now - (300 + idx * 60) * 1000,
      solvedTime: now - (idx * 60) * 1000,
    };

    saveDeductionState(c.id, completedState);

    history[c.id] = {
      caseNumber: c.caseNumber,
      title: c.title,
      timeSeconds: 95 + idx * 12,
      strikes: 0,
      date: new Date(now - idx * 86400000).toISOString(),
    };
  });

  const totalWon = Math.max(cases.length, 50); // 50 to qualify for the ultimate 👑 Mastermind Sleuth rank

  const updatedStats: UserStats = {
    gamesPlayed: totalWon,
    gamesWon: totalWon,
    currentStreak: totalWon,
    maxStreak: totalWon,
    rankIndex: 6, // 👑 Mastermind Sleuth
    history,
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    localStorage.setItem('sleuth_campaign_unlocked_v1', '5');
    localStorage.setItem(
      'sleuth_campaign_completed_v1',
      JSON.stringify({ 1: true, 2: true, 3: true, 4: true, 5: true })
    );
    localStorage.setItem(PRO_STATUS_KEY, 'true');
    window.dispatchEvent(new CustomEvent('sleuth_data_updated'));
  } catch (e) {
    console.error('Failed to complete all cases in storage:', e);
  }

  return updatedStats;
}

export function resetAllProgress(cases: Case[]): UserStats {
  try {
    cases.forEach((c) => {
      localStorage.removeItem(DEDUCTION_PREFIX + c.id);
    });
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem('sleuth_campaign_unlocked_v1');
    localStorage.removeItem('sleuth_campaign_completed_v1');
    window.dispatchEvent(new CustomEvent('sleuth_data_updated'));
  } catch (e) {
    console.error('Failed to reset all progress:', e);
  }

  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    rankIndex: 0,
    history: {},
  };
}

