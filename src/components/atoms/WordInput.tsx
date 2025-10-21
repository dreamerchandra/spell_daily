import { useHintState } from '../../context/hint-context';
import type { WordDef } from '../../words';

interface WordInputProps {
  userInput: string[];
  isCorrect?: boolean | null;
  className?: string;
  wordDef: WordDef;
}

export const WordInput = ({
  userInput,
  isCorrect = null,
  className = '',
  wordDef,
}: WordInputProps) => {
  const hintState = useHintState();
  const getBoxStyles = (index: number, letter: string) => {
    const baseClasses =
      'flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300';

    if (letter) {
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
