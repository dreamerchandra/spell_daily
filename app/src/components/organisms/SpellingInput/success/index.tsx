import { SequentialBounce } from './SequentialBounce';
import { RippleEffect } from './RippleEffect';
import { ConfettiBurst } from './ConfettiBurst';
import { Typewriter } from './Typewriter';
import { ColorFlow } from './ColorFlow';
import { FireAnimation } from './FireAnimation';
import { triggerSpellingSuccess } from '../../../../util/success-vibrations';
import { memo, useState, useEffect } from 'react';
import type { AnimationInputProps } from './type';

const ANIMATION_COMPONENTS = [
  Typewriter,
  SequentialBounce,
  RippleEffect,
  ConfettiBurst,
  ColorFlow,
  FireAnimation,
] as const;

const ANIMATION_NAMES = [
  'Typewriter',
  'Sequential Bounce',
  'Ripple Effect',
  'Confetti Burst',
  'Color Flow',
  'Fire Animation',
] as const;

const InternalSuccessAnimation = (props: AnimationInputProps) => {
  // Generate a truly random animation selection each time isCorrect becomes true
  const [AnimationComponent] = useState(() => {
    const animationIndex = Math.floor(
      Math.random() * ANIMATION_COMPONENTS.length
    );
    console.log(`🎉 Playing animation: ${ANIMATION_NAMES[animationIndex]}`);
    return ANIMATION_COMPONENTS[animationIndex];
  });

  // Trigger vibration on success
  useEffect(() => {
    if (props.isCorrect === true) {
      triggerSpellingSuccess();
    }
  }, [props.isCorrect]);

  return <AnimationComponent {...props} />;
};

export const SuccessAnimation = memo(InternalSuccessAnimation, () => true); // Never re-render

export {
  SequentialBounce,
  RippleEffect,
  ConfettiBurst,
  Typewriter,
  ColorFlow,
  FireAnimation,
};
