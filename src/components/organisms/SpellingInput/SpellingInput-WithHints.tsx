import type { SpellingInputWithHintsProps } from './types';
import { getPhoneticColorByActualSyllable } from '../../../config/pallet-config';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SyllableAnalyzer } from './SyllableAnalyzer';
import {
  BASE_BOX_CLASSES,
  ACTIVE_RING,
  WHITE_TEXT,
  GRAY_TEXT,
  PLACEHOLDER_TEXT,
} from './styles';
import { useOnHintIncrease } from '../../../context/hint-context/index';
import { useSyllabiSpeech } from '../../../hooks/useSpeech';

const useHintRequestedPlace = (
  userInput: string[],
  syllableAnalyzer: SyllableAnalyzer
) => {
  const [hintRequiredPlace, setHintRequiredPlace] = useState(() =>
    userInput.findIndex(l => l === '')
  );
  const { speak } = useSyllabiSpeech();
  const trackSpokenLetters = useRef(new Set<number>());

  useEffect(() => {
    const audioSyllable = syllableAnalyzer.getAudioSyllable(hintRequiredPlace);
    if (audioSyllable) {
      speak(audioSyllable);
    }
  }, [hintRequiredPlace, speak, syllableAnalyzer]);

  useEffect(() => {
    const firstEmptyIndex = userInput.findIndex(l => l === '');
    let currentTypedIndex: number;
    if (firstEmptyIndex !== -1) {
      currentTypedIndex = firstEmptyIndex - 1;
    } else {
      currentTypedIndex = userInput.length - 1;
    }
    if (trackSpokenLetters.current.has(currentTypedIndex)) {
      return;
    }
    trackSpokenLetters.current.add(currentTypedIndex);
    const timerId = setTimeout(() => {
      speak(userInput[currentTypedIndex]);
    }, 0);
    return () => clearTimeout(timerId);
  }, [speak, userInput]);

  useOnHintIncrease(() => {
    const firstEmptyIndex = userInput.findIndex(l => l === '');
    setHintRequiredPlace(firstEmptyIndex);
  });

  return hintRequiredPlace;
};

export const SpellingInputWithHints = ({
  userInput,
  className = '',
  wordDef,
  currentEmptyIndex,
}: SpellingInputWithHintsProps) => {
  const syllableAnalyzer = useMemo(
    () => new SyllableAnalyzer(wordDef),
    [wordDef]
  );
  const hintRequiredPlace = useHintRequestedPlace(userInput, syllableAnalyzer);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  // Get the display value for each input box with auto-fill for current syllable
  const getDisplayValue = (index: number, userLetter: string) => {
    if (!userLetter) {
      const currentSyllableIndex =
        syllableAnalyzer.getCurrentSyllableIndex(userInput);
      if (currentSyllableIndex === -1) {
        return userLetter;
      }

      const syllableStartIndex =
        syllableAnalyzer.getSyllableStartIndex(currentSyllableIndex);
      const syllableEndIndex =
        syllableAnalyzer.getSyllableEndIndex(currentSyllableIndex);

      const isRequestedSyllable =
        syllableStartIndex <= hintRequiredPlace &&
        hintRequiredPlace <= syllableEndIndex;

      if (!isRequestedSyllable) {
        return userLetter;
      }

      if (syllableAnalyzer.isCharInSyllable(index, currentSyllableIndex)) {
        const syllableCharIndex = index - syllableStartIndex;
        return (
          wordDef.actualSyllable[currentSyllableIndex][
            syllableCharIndex
          ]?.toUpperCase() || ''
        );
      }
    }
    return userLetter;
  };

  // Check if a character at index is a placeholder (auto-filled hint)
  const isPlaceholder = (index: number, userLetter: string) => {
    return !userLetter && getDisplayValue(index, userLetter) !== '';
  };

  const getBoxStyles = (index: number, letter: string) => {
    const displayValue = getDisplayValue(index, letter);
    const phoneticGroup = phoneticGrouping[index];
    const phoneticColorClass = phoneticGroup;
    const isPlaceholderChar = isPlaceholder(index, letter);

    if (displayValue) {
      // Use dimmed text color for placeholders
      const textColor = isPlaceholderChar ? PLACEHOLDER_TEXT : WHITE_TEXT;
      return `${BASE_BOX_CLASSES} ${phoneticColorClass} ${textColor}`;
    }

    const isActive = index === currentEmptyIndex;
    return `${BASE_BOX_CLASSES} ${phoneticColorClass} ${GRAY_TEXT} ${
      isActive ? ACTIVE_RING : ''
    }`;
  };

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {userInput.map((letter, index) => {
        const displayValue = getDisplayValue(index, letter);
        return (
          <div
            key={index}
            className={getBoxStyles(index, letter)}
            tabIndex={index}
          >
            {displayValue || ''}
          </div>
        );
      })}
    </div>
  );
};
