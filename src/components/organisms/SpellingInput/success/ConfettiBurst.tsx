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
import { successSoundManager, SuccessAnimationType } from './soundManager';

export const ConfettiBurst = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
}: SpellingInputBaseProps) => {
  const [animationStates, setAnimationStates] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean[]>([]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setAnimationStates(new Array(userInput.length).fill(false));
      setShowConfetti(new Array(userInput.length).fill(false));

      // Play success sound
      successSoundManager.playSuccess(SuccessAnimationType.CONFETTI_BURST);

      // Trigger confetti and jump animation for each letter
      userInput.forEach((_, index) => {
        setTimeout(() => {
          setAnimationStates(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });

          setShowConfetti(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });

          // Hide confetti after animation
          setTimeout(() => {
            setShowConfetti(prev => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }, 600);
        }, index * 80);
      });

      // // Reset animation states after completion but keep success state visible
      // setTimeout(
      //   () => {
      //     setAnimationStates(new Array(userInput.length).fill(false));
      //   },
      //   userInput.length * 80 + 800
      // );
    }
  }, [isCorrect, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isAnimating = animationStates.length > 0 && animationStates[index];
    const animationClass = isAnimating
      ? 'animate-bounce -translate-y-2 rotate-12'
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
        <div key={index} className="relative">
          <div className={getBoxStyles(index, letter)} tabIndex={index}>
            {letter || ''}
          </div>
          {/* Confetti particles */}
          {showConfetti.length > 0 && showConfetti[index] && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-1 -top-2 animate-ping text-xs">
                🎉
              </div>
              <div className="absolute -top-1 right-0 animate-bounce text-xs delay-75">
                ✨
              </div>
              <div className="absolute -left-2 bottom-0 animate-pulse text-xs delay-150">
                🌟
              </div>
              <div className="absolute -bottom-1 right-1 animate-ping text-xs delay-300">
                🎊
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
