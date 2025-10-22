export const VIBRATION_PATTERNS = {
  // Default success pattern: short burst, pause, double burst
  DEFAULT: [100, 50, 80, 50, 120],

  // Quick success for fast interactions
  QUICK: [80, 30, 60],

  // Strong success for major achievements
  STRONG: [150, 75, 100, 75, 150, 75, 100],

  // Gentle success for subtle feedback
  GENTLE: [60, 40, 40, 40, 80],
} as const;

export type VibrationPatternType = keyof typeof VIBRATION_PATTERNS;

export const triggerSuccessVibration = (
  pattern: VibrationPatternType = 'DEFAULT',
  force = false
): void => {
  // Check if device supports vibration
  if ('vibrate' in navigator) {
    try {
      const vibrationPattern = VIBRATION_PATTERNS[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  } else if (force) {
    console.warn('Device does not support vibration API');
  }
};

export const isVibrationSupported = (): boolean => {
  return 'vibrate' in navigator;
};

export const stopVibration = (): void => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn('Failed to stop vibration:', error);
    }
  }
};

/**
 * Convenience function specifically for spelling success
 * Uses the default success vibration pattern
 */
export const triggerSpellingSuccess = (): void => {
  triggerSuccessVibration('DEFAULT');
};
