import type { WordDef } from '../../../words';

export interface SpellingInputProps {
  userInput: string[];
  isCorrect?: boolean | null;
  className?: string;
  wordDef: WordDef;
  disableTalkBack: boolean;
}

export interface SpellingInputBaseProps extends SpellingInputProps {
  showSyllableColors: boolean;
}

export interface SpellingInputWithHintsProps extends SpellingInputProps {
  currentEmptyIndex: number;
}

export type JumbledInputLetter = {
  letter: string;
  pos: number;
};
