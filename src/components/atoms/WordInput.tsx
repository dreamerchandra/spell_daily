import { getPhoneticColorByActualSyllable } from '../../config/pallet-config';
import { useHintState } from '../../context/hint-context';
import type { WordDef } from '../../words';
import { useEffect, useMemo, useState } from 'react';

interface WordInputProps {
  userInput: string[];
  isCorrect?: boolean | null;
  className?: string;
  wordDef: WordDef;
}

export const showPlaceHolder = (hint: number) => hint >= 3;
export const showSyllable = (hint: number) => hint >= 2;

export const WordInput = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
}: WordInputProps) => {
  const hintState = useHintState();
  const [hintRequiredPlace, setHintRequiredPlace] = useState(-1);

  useEffect(() => {
    if (showPlaceHolder(hintState.currentHint)) {
      const firstEmptyIndex = userInput.findIndex(l => l === '');
      setHintRequiredPlace(firstEmptyIndex);
    } else {
      setHintRequiredPlace(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintState.currentHint]);

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  // Check if a character at index is a placeholder (auto-filled hint)
  const isPlaceholder = (index: number, userLetter: string) => {
    return (
      showPlaceHolder(hintState.currentHint) &&
      !userLetter &&
      getDisplayValue(index, userLetter) !== ''
    );
  };

  // Get the display value for each input box (with auto-fill for state 3)
  const getDisplayValue = (index: number, userLetter: string) => {
    if (showPlaceHolder(hintState.currentHint) && !userLetter) {
      // Auto-fill the current syllable when state is 3
      const currentSyllableIndex = getCurrentSyllableIndex();
      if (currentSyllableIndex !== -1) {
        const syllableStartIndex = getSyllableStartIndex(currentSyllableIndex);
        const syllableEndIndex =
          syllableStartIndex +
          wordDef.actualSyllable[currentSyllableIndex].length -
          1;
        if (
          !(
            syllableStartIndex <= hintRequiredPlace &&
            hintRequiredPlace <= syllableEndIndex
          )
        ) {
          return userLetter;
        }

        if (syllableStartIndex <= index && index <= syllableEndIndex) {
          const syllableCharIndex = index - syllableStartIndex;
          return (
            wordDef.actualSyllable[currentSyllableIndex][
              syllableCharIndex
            ]?.toUpperCase() || ''
          );
        }
      }
    }
    return userLetter;
  };

  // Get the index of the current syllable being worked on
  const getCurrentSyllableIndex = () => {
    let charIndex = 0;
    for (
      let syllableIndex = 0;
      syllableIndex < wordDef.actualSyllable.length;
      syllableIndex++
    ) {
      const syllableLength = wordDef.actualSyllable[syllableIndex].length;
      const syllableComplete = userInput
        .slice(charIndex, charIndex + syllableLength)
        .every(char => char !== '');

      if (!syllableComplete) {
        return syllableIndex;
      }

      charIndex += syllableLength;
    }
    return -1; // All syllables complete
  };

  // Get the starting character index for a syllable
  const getSyllableStartIndex = (syllableIndex: number) => {
    let startIndex = 0;
    for (let i = 0; i < syllableIndex; i++) {
      startIndex += wordDef.actualSyllable[i].length;
    }
    return startIndex;
  };

  const getBoxStyles = (index: number, letter: string) => {
    const baseClasses =
      'flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300';

    const displayValue = getDisplayValue(index, letter);

    if (showSyllable(hintState.currentHint)) {
      const phoneticGroup = phoneticGrouping[index];
      const phoneticColorClass = phoneticGroup;
      const isPlaceholderChar = isPlaceholder(index, letter);

      if (displayValue) {
        if (isCorrect === true) {
          return `${baseClasses} border-game-success-500/60 bg-game-success-500/20 text-game-success-300`;
        }
        if (isCorrect === false) {
          return `${baseClasses} border-game-error-500/60 bg-game-error-500/20 text-game-error-300`;
        }
        // Use dimmed text color for placeholders
        const textColor = isPlaceholderChar ? 'text-gray-400/70' : 'text-white';
        return `${baseClasses} ${phoneticColorClass} ${textColor}`;
      }

      const isActive = index === userInput.findIndex(l => l === '');
      return `${baseClasses} ${phoneticColorClass} text-gray-300 ${
        isActive ? 'ring-2 ring-game-primary-400/50' : ''
      }`;
    }

    // Original styling for states 0 and 1
    if (displayValue) {
      if (isCorrect === true) {
        return `${baseClasses} border-game-success-500/60 bg-game-success-500/20 text-game-success-300`;
      }
      if (isCorrect === false) {
        return `${baseClasses} border-game-error-500/60 bg-game-error-500/20 text-game-error-300`;
      }
      return `${baseClasses} border-game-primary-500/60 bg-game-primary-500/20 text-game-primary-300`;
    }

    const isActive = index === userInput.findIndex(l => l === '');
    return `${baseClasses} border-gray-600/50 bg-gray-700/30 text-gray-400 ${
      isActive ? 'ring-2 ring-game-primary-400/50' : ''
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
