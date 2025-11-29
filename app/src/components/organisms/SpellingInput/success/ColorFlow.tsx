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

export const ColorFlow = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
  onAnimationEnd,
}: AnimationInputProps) => {
  const [flowStates, setFlowStates] = useState<boolean[]>([]);
  const [glowStates, setGlowStates] = useState<boolean[]>([]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setFlowStates(new Array(userInput.length).fill(false));
      setGlowStates(new Array(userInput.length).fill(false));

      // Play success sound
      const stop = successSoundManager.playSuccess(
        SuccessAnimationType.COLOR_FLOW,
        1
      );

      let timerIds: number[] = [];

      // Color flow animation - waves of color changes
      userInput.forEach((_, index) => {
        timerIds.push(
          setTimeout(() => {
            setFlowStates(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });

            // Add glow effect
            setTimeout(() => {
              setGlowStates(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 100);

            // Remove glow effect
            setTimeout(() => {
              setGlowStates(prev => {
                const newState = [...prev];
                newState[index] = false;
                return newState;
              });
            }, 500);
          }, index * 120)
        );
      });

      timerIds.push(
        setTimeout(
          () => {
            // Reset animation states after completion but keep success state visible
            // setFlowStates(new Array(userInput.length).fill(false));
            // setGlowStates(new Array(userInput.length).fill(false));
            onAnimationEnd();
          },
          slow(userInput.length * 120)
        )
      );
      return () => {
        timerIds.forEach(id => clearTimeout(id));
        stop();
      };
    }
  }, [isCorrect, onAnimationEnd, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isFlowing = flowStates.length > 0 && flowStates[index];
    const isGlowing = glowStates.length > 0 && glowStates[index];
    const flowClass = isFlowing ? 'transition-all duration-500 ease-out' : '';
    const glowClass = isGlowing
      ? 'shadow-xl shadow-emerald-400/50 ring-2 ring-emerald-400/30 scale-110'
      : '';

    if (showSyllableColors) {
      const phoneticGroup = phoneticGrouping[index];
      const phoneticColorClass = phoneticGroup;

      if (letter) {
        if (isCorrect === true) {
          return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${flowClass} ${glowClass}`;
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
        return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${flowClass} ${glowClass}`;
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
    <div
      className={`flex justify-center gap-2  px-2 max-w-[100vw]${className}`}
    >
      {userInput.map((letter, index) => (
        <div
          key={index}
          className={getBoxStyles(index, letter)}
          tabIndex={index}
          style={{
            transform:
              glowStates.length > 0 && glowStates[index]
                ? 'translateY(-2px)'
                : 'translateY(0)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {letter || ''}
        </div>
      ))}
    </div>
  );
};
