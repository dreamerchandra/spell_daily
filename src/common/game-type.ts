import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GameRef } from './game-ref';
import type { WordDef } from '../words';

export type GameMode =
  | 'fullWord'
  | 'syllable'
  | 'voiceTyping'
  | 'jumbled'
  | 'twoOption'
  | 'fourOption'
  | 'typing';
export type GameComponent = ForwardRefExoticComponent<
  {
    wordDef: WordDef;
    setDisableChecking: (disable: boolean) => void;
  } & RefAttributes<GameRef>
>;
