import type { SpellingInputBaseProps } from '../types';
import { SequentialBounce } from './SequentialBounce';
import { RippleEffect } from './RippleEffect';
import { ConfettiBurst } from './ConfettiBurst';
import { Typewriter } from './Typewriter';
import { ColorFlow } from './ColorFlow';
import { useMemo } from 'react';

const ANIMATION_COMPONENTS = [
  SequentialBounce,
  RippleEffect,
  ConfettiBurst,
  Typewriter,
  ColorFlow,
] as const;

const ANIMATION_NAMES = [
  'Sequential Bounce',
  'Ripple Effect',
  'Confetti Burst',
  'Typewriter',
  'Color Flow',
] as const;

export const SuccessAnimation = (props: SpellingInputBaseProps) => {
  // Generate a truly random animation selection each time isCorrect becomes true
  const animationIndex = useMemo(() => {
    if (props.isCorrect === true) {
      return Math.floor(Math.random() * ANIMATION_COMPONENTS.length);
    }
    return 0;
  }, [props.isCorrect]);

  const AnimationComponent = ANIMATION_COMPONENTS[animationIndex];

  // Optional: Log which animation is being used (for debugging)
  if (props.isCorrect === true) {
    console.log(`🎉 Playing animation: ${ANIMATION_NAMES[animationIndex]}`);
  }

  return <AnimationComponent {...props} />;
};

// Export individual animations for direct use if needed
export { SequentialBounce, RippleEffect, ConfettiBurst, Typewriter, ColorFlow };
