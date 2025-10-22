// Success animation sounds utility
export const SuccessAnimationType = {
  SEQUENTIAL_BOUNCE: 'sequential-bounce',
  RIPPLE_EFFECT: 'ripple-effect',
  CONFETTI_BURST: 'confetti-burst',
  TYPEWRITER: 'typewriter',
  COLOR_FLOW: 'color-flow',
} as const;

export type SuccessAnimationTypeValue =
  (typeof SuccessAnimationType)[keyof typeof SuccessAnimationType];

// Sound configurations for each animation type
const SOUND_CONFIGS = {
  [SuccessAnimationType.SEQUENTIAL_BOUNCE]: {
    path: '/sounds/success/bounce.wav',
    fallback: { frequency: 800, duration: 0.3, type: 'sine' as const },
  },
  [SuccessAnimationType.RIPPLE_EFFECT]: {
    path: '/sounds/success/ripple.wav',
    fallback: { frequency: 600, duration: 0.5, type: 'triangle' as const },
  },
  [SuccessAnimationType.CONFETTI_BURST]: {
    path: '/sounds/success/confetti.wav',
    fallback: { frequency: 1000, duration: 0.4, type: 'square' as const },
  },
  [SuccessAnimationType.TYPEWRITER]: {
    path: '/sounds/success/typewriter.wav',
    fallback: { frequency: 1200, duration: 0.2, type: 'sine' as const },
  },
  [SuccessAnimationType.COLOR_FLOW]: {
    path: '/sounds/success/magic.wav',
    fallback: { frequency: 900, duration: 0.6, type: 'triangle' as const },
  },
};

class SuccessSoundManager {
  private audioCache: Map<SuccessAnimationTypeValue, HTMLAudioElement> =
    new Map();
  private volume: number = 0.5; // Default volume (30%)
  private enabled: boolean = true;

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds() {
    Object.entries(SOUND_CONFIGS).forEach(([type, config]) => {
      const audio = new Audio(config.path);
      audio.preload = 'auto';
      audio.volume = this.volume;

      // Add error handler to fallback to generated tone
      audio.addEventListener('error', () => {
        console.warn(
          `Could not load sound file: ${config.path}, using generated tone`
        );
      });

      this.audioCache.set(type as SuccessAnimationTypeValue, audio);
    });
  }

  playSuccess(animationType: SuccessAnimationTypeValue) {
    if (!this.enabled) return;

    const audio = this.audioCache.get(animationType);
    if (audio) {
      // Reset audio to beginning in case it's already playing
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn('Could not play success sound:', error);
      });
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Create singleton instance
export const successSoundManager = new SuccessSoundManager();
