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

type JumbledWordState = {
  userInput: string[];
  shuffledLetters: string[];
  availableLetters: string[];
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
type AddLetterPayload = ActionPayload<'ADD_LETTER', { letter: string }>;
type RemoveLetterPayload = ActionPayload<'REMOVE_LETTER'>;
type UpdateInputAndAvailablePayload = ActionPayload<
  'UPDATE_INPUT_AND_AVAILABLE',
  { userInput: string[] }
>;

export type JumbledWordAction =
  | NewWordPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload
  | AddLetterPayload
  | RemoveLetterPayload
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
      const shuffledLetters = arrayShuffle(letters);
      return {
        wordDef: action.action.wordDef,
        userInput: new Array(word.length).fill(''),
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
    case 'ADD_LETTER': {
      const letter = action.action.letter;
      const letterIndex = state.availableLetters.indexOf(letter);
      if (letterIndex === -1) return state; // Letter not available

      const firstEmptyIndex = state.userInput.indexOf('');
      if (firstEmptyIndex === -1) return state; // No empty slots

      const newUserInput = [...state.userInput];
      newUserInput[firstEmptyIndex] = letter;

      const newAvailableLetters = [...state.availableLetters];
      newAvailableLetters.splice(letterIndex, 1);

      return {
        ...state,
        userInput: newUserInput,
        availableLetters: newAvailableLetters,
      };
    }
    case 'REMOVE_LETTER': {
      const lastFilledIndex = state.userInput
        .map((letter, index) => (letter !== '' ? index : -1))
        .filter(index => index !== -1)
        .pop();

      if (lastFilledIndex === undefined) return state; // No letters to remove

      const letterToRemove = state.userInput[lastFilledIndex];
      const newUserInput = [...state.userInput];
      newUserInput[lastFilledIndex] = '';

      const newAvailableLetters = [...state.availableLetters, letterToRemove];

      return {
        ...state,
        userInput: newUserInput,
        availableLetters: newAvailableLetters,
      };
    }
    case 'UPDATE_INPUT_AND_AVAILABLE': {
      const newUserInput = action.action.userInput;

      // Compute available letters based on what's left unused from the original word
      if (!state.wordDef) return state;

      const originalLetters = state.wordDef.word.split('');
      const usedLetters = newUserInput.filter(letter => letter !== '');

      // Create available letters by removing used letters from original letters
      const newAvailableLetters = [...originalLetters];
      usedLetters.forEach(usedLetter => {
        const index = newAvailableLetters.findIndex(
          letter => letter.toLowerCase() === usedLetter.toLowerCase()
        );
        if (index !== -1) {
          newAvailableLetters.splice(index, 1);
        }
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

  const addLetter = useCallback((letter: string) => {
    dispatch({
      type: 'ADD_LETTER',
      action: { letter },
    });
  }, []);

  const removeLetter = useCallback(() => {
    dispatch({
      type: 'REMOVE_LETTER',
    });
  }, []);

  const updateInputAndAvailable = useCallback((userInput: string[]) => {
    dispatch({
      type: 'UPDATE_INPUT_AND_AVAILABLE',
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
          Avatar.show({
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
      !ref.current.userInput.includes('')
    ) {
      const firstWrongIndex = ref.current.userInput.findIndex(
        (l, i) => l !== ref.current.wordDef?.word[i]
      );
      const correctLetters = ref.current.wordDef?.word
        .split('')
        .map((l, i) => (i <= firstWrongIndex ? l : ''));
      updateInputAndAvailable(correctLetters);
    }
  }, [hintState.currentHint, updateInputAndAvailable]);

  return {
    state,
    addLetter,
    removeLetter,
    updateInputAndAvailable,
    setIsCorrect,
    setNewWord,
  };
};
