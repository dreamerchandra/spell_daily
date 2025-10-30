import { useHintState } from '../../../context/hint-context';
import { pubSub } from '../../../util/pub-sub';
import {
  SpellingInputDragDrop,
  type SpellingInputDragDropProps,
} from './SpellingInput-DragDrop';
import { SuccessAnimation } from './success';
import { showSyllable } from './utils';

const onAnimationEnd = () => {
  pubSub.publish('Animation:End');
};

export const JumbledInput = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  availableLetters,
  onUserInputChange,
}: SpellingInputDragDropProps) => {
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
        onAnimationEnd={onAnimationEnd}
        disableTalkBack={true}
      />
    );
  }
  return (
    <SpellingInputDragDrop
      userInput={userInput}
      isCorrect={isCorrect}
      className={className}
      wordDef={wordDef}
      showSyllableColors={showSyllable(hintState.currentHint)}
      availableLetters={availableLetters}
      onUserInputChange={onUserInputChange}
    />
  );
};
