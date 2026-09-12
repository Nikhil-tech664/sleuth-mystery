import type { Case, DeductionState } from '../types/game';
import { getRankForCaseCount } from '../data/ranks';

export function generateShareEmojiGrid(currentCase: Case, state: DeductionState): string {
  const rows: string[] = [];
  const suspects = currentCase.suspects.slice(0, 3);
  const weapons = currentCase.weapons.slice(0, 3);

  suspects.forEach((s) => {
    let rowStr = '';
    weapons.forEach((w) => {
      const val = state.grid[`suspect:${s.id}-weapon:${w.id}`];
      if (val === 'yes') {
        rowStr += '🟩 ';
      } else if (val === 'no') {
        rowStr += '⬛ ';
      } else {
        rowStr += '⬜ ';
      }
    });
    rows.push(rowStr.trim());
  });

  if (state.strikes > 0) {
    rows.push('🟥 '.repeat(Math.min(state.strikes, 3)).trim());
  }

  return rows.join('\n');
}

export function generateShareText(
  currentCase: Case,
  state: DeductionState,
  totalWins: number
): string {
  const elapsedSeconds = state.solvedTime
    ? Math.floor((state.solvedTime - state.startTime) / 1000)
    : 120;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const cluesCheckedCount = Object.values(state.checkedClues).filter(Boolean).length;
  const rank = getRankForCaseCount(totalWins);

  const strikeIndicator =
    state.strikes === 0 ? '🏆 Clean Sweep (0 Strikes)' : `⚠️ Strikes: ${state.strikes}/3`;
  const emojiGrid = generateShareEmojiGrid(currentCase, state);

  return `🕵️‍♂️ SLEUTH: Micro Mystery #${currentCase.caseNumber}
📜 "${currentCase.title}"
⏱️ Solved in ${timeFormatted} • ${strikeIndicator}
🔍 Clues: ${cluesCheckedCount}/${currentCase.clues.length} • XP: +${state.xpEarned}
🎖️ Rank: ${rank.title} ${rank.badge}

${emojiGrid}

Can you deduce the murderer?
Play free: https://sleuth-mystery.web.app`;
}

export async function copyShareTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-https or older browser environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
