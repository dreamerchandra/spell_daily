import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GameRef } from './game-ref';
import type { WordDef } from '../words';

export type SpellingGameMode =
  | 'fullWord'
  | 'syllable'
  | 'voiceTyping'
  | 'jumbled'
  | 'twoOption'
  | 'fourOption'
  | 'typing';

export type UsageGameMode = 'context' | 'correctSentence';

export type GameMode = SpellingGameMode | UsageGameMode;
export type GameRefProps<T = WordDef> = {
  wordDef: T;
  setDisableChecking: (disable: boolean) => void;
} & RefAttributes<GameRef>;

export type GameComponent<T = WordDef> = ForwardRefExoticComponent<
  GameRefProps<T>
>;
