import type { DetectiveRank } from '../types/game';

export const DETECTIVE_RANKS: DetectiveRank[] = [
  {
    title: 'Rookie Gumshoe',
    casesRequired: 0,
    badge: '🔎',
    description: 'You still get coffee stains on evidence forms. Watch your step.',
  },
  {
    title: 'Beat Patrol',
    casesRequired: 1,
    badge: '👮',
    description: 'First solve under your belt. The precinct captain is taking note.',
  },
  {
    title: 'Junior Investigator',
    casesRequired: 3,
    badge: '📋',
    description: 'You know that witnesses lie, but logic grids never do.',
  },
  {
    title: 'Private Eye',
    casesRequired: 7,
    badge: '🧥',
    description: 'A fedora, a trench coat, and a sharp nose for contradictions.',
  },
  {
    title: 'Homicide Detective',
    casesRequired: 14,
    badge: '🎖️',
    description: 'No bloodstain or forged alibi slips past your magnifying glass.',
  },
  {
    title: 'Chief Inspector',
    casesRequired: 25,
    badge: '🦅',
    description: 'Scotland Yard calls you when the cases go cold and hopeless.',
  },
  {
    title: 'Mastermind Sleuth',
    casesRequired: 50,
    badge: '👑',
    description: 'Sherlock Holmes would ask you for a second opinion.',
  },
];

export function getRankForCaseCount(count: number): DetectiveRank {
  for (let i = DETECTIVE_RANKS.length - 1; i >= 0; i--) {
    if (count >= DETECTIVE_RANKS[i].casesRequired) {
      return DETECTIVE_RANKS[i];
    }
  }
  return DETECTIVE_RANKS[0];
}
