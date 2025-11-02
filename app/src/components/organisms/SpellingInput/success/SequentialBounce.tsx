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

export const SequentialBounce = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
  onAnimationEnd,
}: AnimationInputProps) => {
  const [animationStates, setAnimationStates] = useState<boolean[]>([]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setAnimationStates(new Array(userInput.length).fill(false));

      // Play success sound
      successSoundManager.playSuccess(
        SuccessAnimationType.SEQUENTIAL_BOUNCE,
        1
      );

      let timerIds: number[] = [];

      // Trigger sequential bounce animation
      userInput.forEach((_, index) => {
        timerIds.push(
          setTimeout(() => {
            setAnimationStates(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 100)
        ); // 100ms delay between each letter
      });

      timerIds.push(
        setTimeout(
          () => {
            // Reset animation states after completion but keep success state visible
            // setAnimationStates(new Array(userInput.length).fill(false));
            onAnimationEnd();
          },
          slow(userInput.length * 100)
        )
      );

      return () => {
        timerIds.forEach(id => clearTimeout(id));
      };
    }
  }, [isCorrect, onAnimationEnd, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isAnimating = animationStates.length > 0 && animationStates[index];
    const animationClass = isAnimating ? 'animate-bounce scale-110' : '';

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
    <div className={`flex justify-center gap-2 ${className}`}>
      {userInput.map((letter, index) => (
        <div
          key={index}
          className={getBoxStyles(index, letter)}
          tabIndex={index}
        >
          {letter || ''}
        </div>
      ))}
    </div>
  );
};
