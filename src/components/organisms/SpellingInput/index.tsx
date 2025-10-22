import { useHintState } from '../../../context/hint-context';
import type { SpellingInputProps } from './types';
import { SpellingInputBasic } from './SpellingInput-Basic';
import { SpellingInputWithHints } from './SpellingInput-WithHints';
import { SuccessAnimation } from './success';
import { showPlaceholder, showSyllable, findActiveIndex } from './utils';

export const SpellingInput = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
}: SpellingInputProps) => {
  const hintState = useHintState();

  // Use animated version when word is correct
  if (isCorrect === true) {
    return (
      <SuccessAnimation
        userInput={userInput}
        isCorrect={isCorrect}
        className={className}
        wordDef={wordDef}
        showSyllableColors={showSyllable(hintState.currentHint)}
      />
    );
  }

  if (showPlaceholder(hintState.currentHint)) {
    const currentEmptyIndex = findActiveIndex(userInput);
    return (
      <SpellingInputWithHints
        userInput={userInput}
        isCorrect={isCorrect}
        className={className}
        wordDef={wordDef}
        currentEmptyIndex={currentEmptyIndex}
      />
    );
  }

  // For hint levels 0-2, use the basic component with optional syllable colors
  return (
    <SpellingInputBasic
      userInput={userInput}
      isCorrect={isCorrect}
      className={className}
      wordDef={wordDef}
      showSyllableColors={showSyllable(hintState.currentHint)}
    />
  );
};
