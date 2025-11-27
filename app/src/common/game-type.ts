import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GameRef } from './game-ref';
import type { WordDef } from '../words';

export type SpellingGameType =
  | 'typingWithBox'
  | 'syllable'
  | 'voiceTyping'
  | 'jumbled'
  | 'twoOption'
  | 'fourOption'
  | 'typingWithoutBox';

export type UsageGameType = 'context' | 'correctSentence';

export type GameType = SpellingGameType | UsageGameType;
export type GameRefProps<T = WordDef> = {
  wordDef: T;
  setDisableChecking: (disable: boolean) => void;
} & RefAttributes<GameRef>;

export type GameComponent<T = WordDef> = ForwardRefExoticComponent<
  GameRefProps<T>
>;
