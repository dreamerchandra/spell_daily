import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordDef } from '../../words';
import {
  useHintState,
  useResetHint,
  useNextHint,
} from '../../context/hint-context/index';
import { showSyllable } from '../../components/organisms/SpellingInput/utils';
import { useSpellingSpeech } from '../../hooks';
import { Avatar } from '../../components/organisms/avatar/avatar';

export type FullWordState = {
  attempts: {
    userInput: string[];
    isCorrect: boolean | null;
  }[];
  incorrectAttempts: number;
  wordDef: WordDef | null;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
type SetUserInputPayload = ActionPayload<
  'SET_USER_INPUT',
  { userInput: string[] }
>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;

export type FullWordAction =
  | NewWordPayload
  | SetUserInputPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload;

export const makeArray = (word: string, wordLength: number): string[] => {
  const returnArr = new Array(wordLength).fill('');
  word.split('').forEach((l, i) => {
    returnArr[i] = l;
  });
  return returnArr;
};

export const fullWordReducer = (
  state: FullWordState,
  action: FullWordAction
): FullWordState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        wordDef: action.action.wordDef,
        attempts: [
          {
            userInput: new Array(action.action.wordDef.word.length).fill(''),
            isCorrect: null,
          },
        ],
        incorrectAttempts: 0,
      };
    case 'SET_USER_INPUT': {
      const lastAttempt = state.attempts[state.attempts.length - 1];
      return {
        ...state,
        attempts: [
          ...state.attempts.slice(0, -1),
          {
            ...lastAttempt,
            userInput: action.action.userInput,
          },
        ],
      };
    }
    case 'SET_IS_CORRECT': {
      const lastAttempt = state.attempts[state.attempts.length - 1];
      return {
        ...state,
        attempts: [
          ...state.attempts.slice(0, -1),
          {
            ...lastAttempt,
            isCorrect: action.action.isCorrect,
          },
        ],
      };
    }
    case 'SET_INCORRECT_ATTEMPTS':
      return {
        ...state,
        attempts: [
          ...state.attempts,
          {
            userInput: new Array(state.wordDef?.word.length ?? 0).fill(''),
            isCorrect: null,
          },
        ],
        incorrectAttempts: state.incorrectAttempts + 1,
      };
    default:
      return state;
  }
};

export const useFullWordState = () => {
  const [state, dispatch] = useReducer(fullWordReducer, {
    attempts: [
      {
        userInput: [],
        isCorrect: null,
      },
    ],
    incorrectAttempts: 0,
    wordDef: null,
  });
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  const resetHint = useResetHint();
  const hintState = useHintState();
  const nextHint = useNextHint();
  const { speak } = useSpellingSpeech();

  const setUserInput = useCallback((userInput: string[]) => {
    dispatch({
      type: 'SET_USER_INPUT',
      action: { userInput },
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

  const setNewWord = useCallback(
    (wordDef: WordDef) => {
      const HINTS = 2; // [syllable, color hint, ...fillSyllable]
      resetHint(wordDef.actualSyllable.length + HINTS);
      dispatch({
        type: 'NEW_WORD',
        action: { wordDef: wordDef },
      });
      speak(wordDef.word);
    },
    [resetHint, speak]
  );

  useEffect(() => {
    if (!ref.current.wordDef) return;
    if (showSyllable(hintState.currentHint)) {
      const firstWrongIndex = ref.current.attempts[
        ref.current.attempts.length - 1
      ].userInput.findIndex((l, i) => l !== ref.current.wordDef?.word[i]);
      const correctLetters = ref.current.wordDef?.word
        .split('')
        .splice(0, firstWrongIndex)
        .join('');
      setUserInput(makeArray(correctLetters, ref.current.wordDef?.word.length));
    }
  }, [hintState.currentHint, setUserInput]);

  return {
    state,
    setUserInput,
    setIsCorrect,
    setNewWord,
  };
};
