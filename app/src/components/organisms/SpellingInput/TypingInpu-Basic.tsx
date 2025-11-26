import {
  BASE_BOX_CLASSES,
  SUCCESS_STYLES,
  ERROR_STYLES,
  PRIMARY_STYLES,
  EMPTY_STYLES,
  ACTIVE_RING,
} from './styles';
import type { SpellingInputProps } from './types';
import { findActiveIndex } from './utils';

export const TypingInputBasic = ({
  userInput,
  isCorrect = null,
  className = '',
}: SpellingInputProps) => {
  const getBoxStyles = (index: number, letter: string) => {
    // Original styling for states 0 and 1 (no syllable colors)
    if (letter) {
      if (isCorrect === true) {
        return `${BASE_BOX_CLASSES} ${SUCCESS_STYLES}`;
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
      className={`flex justify-center gap-2  px-2 max-w-[100vw]${className} m-auto min-h-12 w-80 border-b-2 border-dashed border-gray-500 pb-1`}
    >
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
