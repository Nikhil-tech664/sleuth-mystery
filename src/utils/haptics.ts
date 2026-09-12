// Mobile Vibration & Tactile Haptics Engine for Sleuth
// Safely invokes navigator.vibrate where supported

export const haptic = {
  // Light tap on cell marking / grid interaction
  tap: () => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  },

  // Double tap on confirmed match (yes / checkmark)
  confirm: () => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([20, 40, 20]);
      } catch {}
    }
  },

  // Heavy jarring pulse on magistrate strike or contradiction
  strike: () => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([60, 40, 90]);
      } catch {}
    }
  },

  // Dramatic sustained rumble for OBJECTION! and Confession breakdown
  dramatic: () => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([80, 40, 120, 50, 150]);
      } catch {}
    }
  },
};
