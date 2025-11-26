import { getPhoneticColorByActualSyllable } from '../../../../config/pallet-config';
import { useMemo, useEffect, useState } from 'react';
import {
  BASE_BOX_CLASSES,
  SUCCESS_STYLES,
  ERROR_STYLES,
  PRIMARY_STYLES,
  EMPTY_STYLES,
  ACTIVE_RING,
  WHITE_TEXT,
  GRAY_TEXT,
} from '../styles';
import { findActiveIndex } from '../utils';
import {
  successSoundManager,
  SuccessAnimationType,
} from '../../../../util/soundManager';
import { slow } from '../../../../config/animation-knobs';
import type { AnimationInputProps } from './type';

// Fire particle component
const FireParticle = ({
  delay,
  duration,
  startX,
  startY,
  color,
}: {
  delay: number;
  duration: number;
  startX: string;
  startY: string;
  color: string;
}) => (
  <div
    className={`absolute h-2 w-2 ${color} animate-pulse rounded-full opacity-0`}
    style={{
      left: startX,
      top: startY,
      animation: `fireParticle ${duration}ms ease-out ${delay}ms forwards`,
      transformOrigin: 'center',
    }}
  />
);

// Flame component that surrounds a letter box
const FlameRing = ({
  isActive,
  boxIndex,
  animationDelay,
}: {
  isActive: boolean;
  boxIndex: number;
  animationDelay: number;
}) => {
  if (!isActive) return null;

  const particles = [];
  const numParticles = 12; // Particles around the box
  const radius = 30; // Distance from box center

  for (let i = 0; i < numParticles; i++) {
    const angle = (i * 360) / numParticles;
    const startAngle = angle * (Math.PI / 180);

    const startX = Math.cos(startAngle) * radius;
    const startY = Math.sin(startAngle) * radius;

    // Flame colors - mix of orange, red, and yellow
    const colors = [
      'bg-orange-400',
      'bg-red-400',
      'bg-yellow-400',
      'bg-orange-500',
      'bg-red-500',
    ];
    const color = colors[i % colors.length];

    particles.push(
      <FireParticle
        key={`${boxIndex}-${i}`}
        delay={animationDelay + i * 50}
        duration={800}
        startX={`calc(50% + ${startX}px)`}
        startY={`calc(50% + ${startY}px)`}
        color={color}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {particles}
    </div>
  );
};

export const FireAnimation = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
  onAnimationEnd,
}: AnimationInputProps) => {
  const [animationStates, setAnimationStates] = useState<boolean[]>([]);
  const [flameStates, setFlameStates] = useState<boolean[]>([]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setAnimationStates(new Array(userInput.length).fill(false));
      setFlameStates(new Array(userInput.length).fill(false));

      // Play success sound for fire animation
      successSoundManager.playSuccess(SuccessAnimationType.FIRE_ANIMATION, 1);

      let timerIds: number[] = [];

      // Start fire animation from left to right with slight delays
      userInput.forEach((_, index) => {
        // Start flame effect
        timerIds.push(
          setTimeout(() => {
            setFlameStates(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 100)
        );

        // Start box glow effect slightly after flame starts
        timerIds.push(
          setTimeout(
            () => {
              setAnimationStates(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            },
            index * 100 + 50
          )
        );
      });

      // End animation
      timerIds.push(
        setTimeout(
          () => {
            onAnimationEnd();
          },
          slow(userInput.length * 100 + 1000) // Give enough time for all flames to show
        )
      );

      return () => {
        timerIds.forEach(id => clearTimeout(id));
      };
    }
  }, [isCorrect, onAnimationEnd, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isAnimating = animationStates.length > 0 && animationStates[index];
    const animationClass = isAnimating
      ? 'animate-pulse scale-105 shadow-lg shadow-orange-500/70 ring-2 ring-orange-400/50 bg-gradient-to-br from-orange-100 to-red-100'
      : '';

    if (showSyllableColors) {
      const phoneticGroup = phoneticGrouping[index];
      const phoneticColorClass = phoneticGroup;

      if (letter) {
        if (isCorrect === true) {
          return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${animationClass}`;
        }
        if (isCorrect === false) {
          return `${BASE_BOX_CLASSES} ${ERROR_STYLES}`;
        }
        return `${BASE_BOX_CLASSES} ${phoneticColorClass} ${WHITE_TEXT}`;
      }

      const isActive = index === findActiveIndex(userInput);
      return `${BASE_BOX_CLASSES} ${phoneticColorClass} ${GRAY_TEXT} ${
        isActive ? ACTIVE_RING : ''
      }`;
    }

    // Original styling for states 0 and 1 (no syllable colors)
    if (letter) {
      if (isCorrect === true) {
        return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${animationClass}`;
      }
      if (isCorrect === false) {
        return `${BASE_BOX_CLASSES} ${ERROR_STYLES}`;
      }
      return `${BASE_BOX_CLASSES} ${PRIMARY_STYLES}`;
    }

    const isActive = index === findActiveIndex(userInput);
    return `${BASE_BOX_CLASSES} ${EMPTY_STYLES} ${isActive ? ACTIVE_RING : ''}`;
  };

  return (
    <>
      {/* Add CSS keyframes for fire animation */}
      <style>{`
        @keyframes fireParticle {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(0px);
          }
          20% {
            opacity: 1;
            transform: scale(1) translateY(-5px);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateY(-20px);
          }
        }
      `}</style>

      <div
        className={`flex justify-center gap-2  px-2 max-w-[100vw]${className} relative`}
      >
        {userInput.map((letter, index) => (
          <div
            key={index}
            className={`${getBoxStyles(index, letter)} relative overflow-visible`}
            tabIndex={index}
          >
            {letter || ''}
            <FlameRing
              isActive={flameStates[index]}
              boxIndex={index}
              animationDelay={0}
            />
          </div>
        ))}
      </div>
    </>
  );
};
