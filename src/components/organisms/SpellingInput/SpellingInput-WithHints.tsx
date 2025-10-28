import type { SpellingInputWithHintsProps } from './types';
import { getPhoneticColorByActualSyllable } from '../../../config/pallet-config';
import { useMemo, useState } from 'react';
import { SyllableAnalyzer } from './SyllableAnalyzer';
import {
  BASE_BOX_CLASSES,
  ACTIVE_RING,
  WHITE_TEXT,
  GRAY_TEXT,
  PLACEHOLDER_TEXT,
} from './styles';
import { useOnHintIncrease } from '../../../context/hint-context/index';

const useHintRequestedPlace = (userInput: string[]) => {
  const [hintRequiredPlace, setHintRequiredPlace] = useState(() =>
    userInput.findIndex(l => l === '')
  );

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
  const hintRequiredPlace = useHintRequestedPlace(userInput);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  const syllableAnalyzer = useMemo(
    () => new SyllableAnalyzer(wordDef),
    [wordDef]
  );

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
