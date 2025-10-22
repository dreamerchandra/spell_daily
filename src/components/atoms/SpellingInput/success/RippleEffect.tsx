import type { SpellingInputBaseProps } from '../types';
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

export const RippleEffect = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
}: SpellingInputBaseProps) => {
  const [animationStates, setAnimationStates] = useState<boolean[]>([]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setAnimationStates(new Array(userInput.length).fill(false));

      // Start ripple from center
      const centerIndex = Math.floor(userInput.length / 2);

      // Animate center first
      setTimeout(() => {
        setAnimationStates(prev => {
          const newState = [...prev];
          newState[centerIndex] = true;
          return newState;
        });
      }, 0);

      // Animate outward ripples
      const maxDistance = Math.max(
        centerIndex,
        userInput.length - 1 - centerIndex
      );

      for (let distance = 1; distance <= maxDistance; distance++) {
        setTimeout(() => {
          setAnimationStates(prev => {
            const newState = [...prev];
            // Animate left side
            if (centerIndex - distance >= 0) {
              newState[centerIndex - distance] = true;
            }
            // Animate right side
            if (centerIndex + distance < userInput.length) {
              newState[centerIndex + distance] = true;
            }
            return newState;
          });
        }, distance * 150);
      }

      // Reset animation states after completion but keep success state visible
      setTimeout(
        () => {
          setAnimationStates(new Array(userInput.length).fill(false));
        },
        maxDistance * 150 + 800
      );
    }
  }, [isCorrect, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isAnimating = animationStates.length > 0 && animationStates[index];
    const animationClass = isAnimating
      ? 'animate-pulse scale-105 shadow-lg shadow-green-500/50'
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
