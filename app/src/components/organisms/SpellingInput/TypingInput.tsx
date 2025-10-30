import { useHintState } from '../../../context/hint-context';
import type { SpellingInputProps } from './types';
import { SuccessAnimation } from './success';
import { showSyllable } from './utils';
import { pubSub } from '../../../util/pub-sub';
import { TypingInputBasic } from './TypingInpu-Basic';

const onAnimationEnd = () => {
  pubSub.publish('Animation:End');
};

export const TypingInput = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
  disableTalkBack,
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
        onAnimationEnd={onAnimationEnd}
        disableTalkBack={disableTalkBack}
      />
    );
  }

  return (
    <TypingInputBasic
      userInput={userInput}
      isCorrect={isCorrect}
      className={className}
      wordDef={wordDef}
      disableTalkBack={disableTalkBack}
    />
  );
};
