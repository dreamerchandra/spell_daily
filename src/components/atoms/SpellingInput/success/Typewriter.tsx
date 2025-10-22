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

export const Typewriter = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors,
}: SpellingInputBaseProps) => {
  const [typingStates, setTypingStates] = useState<boolean[]>([]);
  const [showCursor, setShowCursor] = useState<number>(-1);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  useEffect(() => {
    if (isCorrect === true) {
      setTypingStates(new Array(userInput.length).fill(false));
      setShowCursor(-1);

      // Play success sound
      successSoundManager.playSuccess(SuccessAnimationType.TYPEWRITER);

      userInput.forEach((_, index) => {
        setTimeout(() => {
          setShowCursor(index);

          setTimeout(() => {
            setTypingStates(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, 100);
        }, index * 120);
      });

      // Hide cursor after all letters are typed
      setTimeout(
        () => {
          setShowCursor(-1);
        },
        userInput.length * 120 + 200
      );

      setTimeout(
        () => {
          setTypingStates(new Array(userInput.length).fill(true));
        },
        userInput.length * 120 + 400
      );
    }
  }, [isCorrect, userInput]);

  const getBoxStyles = (index: number, letter: string) => {
    const isTyped = typingStates.length > 0 && typingStates[index];
    const showingCursor = showCursor === index;
    const animationClass = isTyped ? 'animate-pulse' : '';
    const cursorClass = showingCursor
      ? 'animate-ping ring-2 ring-blue-400'
      : '';

    if (showSyllableColors) {
      const phoneticGroup = phoneticGrouping[index];
      const phoneticColorClass = phoneticGroup;

      if (letter) {
        if (isCorrect === true) {
          return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${animationClass} ${cursorClass}`;
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
        return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES} ${animationClass} ${cursorClass}`;
      }
      if (isCorrect === false) {
        return `${BASE_BOX_CLASSES} ${ERROR_STYLES}`;
      }
      return `${BASE_BOX_CLASSES} ${PRIMARY_STYLES}`;
    }

    const isActive = index === findActiveIndex(userInput);
    return `${BASE_BOX_CLASSES} ${EMPTY_STYLES} ${isActive ? ACTIVE_RING : ''}`;
  };

  const getLetterDisplay = (letter: string, index: number) => {
    const isTyped = typingStates.length > 0 && typingStates[index];
    const showingCursor = showCursor === index;

    if (isCorrect === true) {
      if (showingCursor) {
        return '|';
      }
      if (isTyped) {
        return letter;
      }
      return '';
    }

    return letter || '';
  };

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {userInput.map((letter, index) => (
        <div
          key={index}
          className={getBoxStyles(index, letter)}
          tabIndex={index}
        >
          {getLetterDisplay(letter, index)}
        </div>
      ))}
    </div>
  );
};
