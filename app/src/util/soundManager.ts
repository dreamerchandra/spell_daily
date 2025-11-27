// Success animation sounds utility
export const SuccessAnimationType = {
  SEQUENTIAL_BOUNCE: 'sequential-bounce',
  RIPPLE_EFFECT: 'ripple-effect',
  CONFETTI_BURST: 'confetti-burst',
  TYPEWRITER: 'typewriter',
  GENERIC: 'generic',
  COLOR_FLOW: 'color-flow',
  FIRE_ANIMATION: 'fire-animation',
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
  [SuccessAnimationType.GENERIC]: {
    path: '/sounds/success/generic.wav',
    fallback: { frequency: 1200, duration: 0.2, type: 'sine' as const },
  },
  [SuccessAnimationType.COLOR_FLOW]: {
    path: '/sounds/success/magic.wav',
    fallback: { frequency: 900, duration: 0.6, type: 'triangle' as const },
  },
  [SuccessAnimationType.FIRE_ANIMATION]: {
    path: '/sounds/success/magic.wav',
    fallback: { frequency: 750, duration: 0.8, type: 'sawtooth' as const },
  },
};

class SuccessSoundManager {
  private audioCache = new Map();
  private loaded = new Map();

  constructor() {
    this.preloadAll(); // but now controlled
  }

  private createAudio(src: string) {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.preload = 'none';
    return audio;
  }

  private async loadAudio(type: SuccessAnimationTypeValue) {
    const audio = this.audioCache.get(type);

    if (this.loaded.get(type)) return; // no double loading

    this.loaded.set(type, true);

    return new Promise<void>(resolve => {
      const onLoad = () => {
        audio.removeEventListener('canplaythrough', onLoad);
        resolve();
      };
      const onError = () => resolve();

      audio.preload = 'auto'; // start download now
      audio.addEventListener('canplaythrough', onLoad);
      audio.addEventListener('error', onError);
      audio.load();
    });
  }

  private preloadAll() {
    for (const type of Object.keys(
      SOUND_CONFIGS
    ) as SuccessAnimationTypeValue[]) {
      const config = SOUND_CONFIGS[type];
      const audio = this.createAudio(config.path);
      this.audioCache.set(type, audio);
      this.loadAudio(type); // but now controlled preload
    }
  }

  playSuccess(type: SuccessAnimationTypeValue, volume?: number) {
    const audio = this.audioCache.get(type);
    if (!audio) return;

    if (!this.loaded.get(type)) {
      // On-demand fallback
      this.loadAudio(type).then(() => audio.play());
      return;
    }

    audio.currentTime = 0;
    if (volume != null) audio.volume = volume;
    audio.play().catch((e: unknown) => console.warn(e));
  }
}

// Create singleton instance
export const successSoundManager = new SuccessSoundManager();
