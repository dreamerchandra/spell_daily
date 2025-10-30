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
import { arrayShuffle } from '../../util/array-shuffle';
import type { JumbledInputLetter } from '../../components/organisms/SpellingInput/types';

type JumbledWordState = {
  userInput: JumbledInputLetter[];
  shuffledLetters: JumbledInputLetter[];
  availableLetters: JumbledInputLetter[];
  isCorrect: boolean | null;
  incorrectAttempts: number;
  wordDef: WordDef | null;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;
type UpdateInputAndAvailablePayload = ActionPayload<
  'UPDATE_INPUT_AND_AVAILABLE',
  { userInput: JumbledInputLetter[] }
>;

export type JumbledWordAction =
  | NewWordPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload
  | UpdateInputAndAvailablePayload;

export const makeArray = (word: string, wordLength: number): string[] => {
  const returnArr = new Array(wordLength).fill('');
  word.split('').forEach((l, i) => {
    returnArr[i] = l;
  });
  return returnArr;
};

export const jumbledWordReducer = (
  state: JumbledWordState,
  action: JumbledWordAction
): JumbledWordState => {
  switch (action.type) {
    case 'NEW_WORD': {
      const word = action.action.wordDef.word;
      const letters = word.split('');
      const shuffledLetters = arrayShuffle(
        letters.map((l, i) => ({ letter: l, pos: i }))
      );
      return {
        wordDef: action.action.wordDef,
        userInput: new Array(word.length)
          .fill({ letter: '', pos: 0 })
          .map((_, i) => ({ letter: '', pos: i })),
        shuffledLetters,
        availableLetters: [...shuffledLetters],
        isCorrect: null,
        incorrectAttempts: 0,
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

    case 'UPDATE_INPUT_AND_AVAILABLE': {
      const newUserInput = action.action.userInput;

      // Compute available letters based on what's left unused from the original word
      if (!state.wordDef) return state;

      const newAvailableLetters: JumbledInputLetter[] =
        state.shuffledLetters.filter(letterObj => {
          return !newUserInput.find(
            inputLetterObj =>
              inputLetterObj.letter === letterObj.letter &&
              inputLetterObj.pos === letterObj.pos
          );
        });

      return {
        ...state,
        userInput: newUserInput,
        availableLetters: newAvailableLetters,
      };
    }
    default:
      return state;
  }
};

export const useJumbledWordState = () => {
  const [state, dispatch] = useReducer(jumbledWordReducer, {
    userInput: [],
    shuffledLetters: [],
    availableLetters: [],
    isCorrect: null,
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

  const updateInputAndAvailable = useCallback(
    (userInput: JumbledInputLetter[]) => {
      dispatch({
        type: 'UPDATE_INPUT_AND_AVAILABLE',
        action: { userInput },
      });
    },
    []
  );

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
    if (
      showSyllable(hintState.currentHint) &&
      !ref.current.userInput.find(l => l.letter === '')
    ) {
      let newUserInput = [];
      for (let i = 0; i < ref.current.userInput.length; i++) {
        if (
          ref.current.userInput[i].letter ===
          ref.current.wordDef.actualSyllable[i]
        ) {
          newUserInput.push(ref.current.userInput[i]);
        } else {
          break;
        }
      }
      updateInputAndAvailable(newUserInput);
    }
  }, [hintState.currentHint, updateInputAndAvailable]);

  return {
    state,

    updateInputAndAvailable,
    setIsCorrect,
    setNewWord,
  };
};
