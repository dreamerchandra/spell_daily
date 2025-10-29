import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordDef } from '../../words';
import { useNextHint, useResetHint } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { Avatar } from '../../components/organisms/avatar/avatar';

type SyllableState = {
  selectedSyllables: string[];
  isCorrect: boolean | null;
  incorrectAttempts: number;
  wordDef: WordDef | null;
  currentSyllableIndex: number;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
type SelectSyllablePayload = ActionPayload<
  'SELECT_SYLLABLE',
  { syllable: string; index: number }
>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;
type RemoveSyllablePayload = ActionPayload<
  'REMOVE_SYLLABLE',
  { index: number }
>;

export type SyllableAction =
  | NewWordPayload
  | SelectSyllablePayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload
  | RemoveSyllablePayload;

export const syllableReducer = (
  state: SyllableState,
  action: SyllableAction
): SyllableState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        wordDef: action.action.wordDef,
        selectedSyllables: new Array(
          action.action.wordDef.actualSyllable.length
        ).fill(''),
        isCorrect: null,
        incorrectAttempts: 0,
        currentSyllableIndex: 0,
      };
    case 'SELECT_SYLLABLE': {
      const newSelectedSyllables = [...state.selectedSyllables];
      newSelectedSyllables[action.action.index] = action.action.syllable;

      // Find next empty syllable index
      const nextIndex = newSelectedSyllables.findIndex(s => s === '');

      return {
        ...state,
        selectedSyllables: newSelectedSyllables,
        currentSyllableIndex:
          nextIndex === -1 ? state.currentSyllableIndex : nextIndex,
      };
    }
    case 'SET_IS_CORRECT':
      return {
        ...state,
        isCorrect: action.action.isCorrect,
      };
    case 'SET_INCORRECT_ATTEMPTS':
      return {
        ...state,
        incorrectAttempts: state.incorrectAttempts + 1,
      };
    case 'REMOVE_SYLLABLE': {
      const newSelectedSyllables = [...state.selectedSyllables];
      newSelectedSyllables[action.action.index] = '';

      // Find next empty syllable index (could be the one we just cleared)
      const nextIndex = newSelectedSyllables.findIndex(s => s === '');

      return {
        ...state,
        selectedSyllables: newSelectedSyllables,
        currentSyllableIndex: nextIndex === -1 ? 0 : nextIndex,
      };
    }
    default:
      return state;
  }
};

export const useSyllableState = () => {
  const [state, dispatch] = useReducer(syllableReducer, {
    selectedSyllables: [],
    isCorrect: null,
    incorrectAttempts: 0,
    wordDef: null,
    currentSyllableIndex: 0,
  });

  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);

  const resetHint = useResetHint();
  const nextHint = useNextHint();
  const { speak } = useSpellingSpeech();

  const selectSyllable = useCallback((syllable: string, index: number) => {
    dispatch({
      type: 'SELECT_SYLLABLE',
      action: { syllable, index },
    });
  }, []);

  const setIsCorrect = useCallback(
    (isCorrect: boolean | null) => {
      dispatch({
        type: 'SET_IS_CORRECT',
        action: { isCorrect },
      });
      if (isCorrect === false) {
        dispatch({
          type: 'SET_INCORRECT_ATTEMPTS',
        });
        const incorrectAttempts = ref.current.incorrectAttempts + 1;
        if (incorrectAttempts === 0) return;
        const isEvenAttempt = incorrectAttempts % 2 === 0;
        if (isEvenAttempt) {
          Avatar.hint({
            text: 'Want some hint?',
            yesText: 'Yes, please!',
            noText: 'No, I got this!',
            onYes: () => {
              nextHint();
            },
          });
        } else {
          Avatar.changeCharacter('by_rating/1');
        }
      }
    },
    [nextHint]
  );

  const removeSyllable = useCallback((index: number) => {
    dispatch({
      type: 'REMOVE_SYLLABLE',
      action: { index },
    });
  }, []);

  const setNewWord = useCallback(
    (wordDef: WordDef) => {
      const HINTS = 2; // [definition, audio hint]
      resetHint(wordDef.actualSyllable.length + HINTS);
      dispatch({
        type: 'NEW_WORD',
        action: { wordDef: wordDef },
      });
      speak(wordDef.word);
    },
    [resetHint, speak]
  );

  return {
    state,
    selectSyllable,
    setIsCorrect,
    removeSyllable,
    setNewWord,
  };
};
