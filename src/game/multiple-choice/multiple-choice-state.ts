import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordDef } from '../../words';
import { useResetHint } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { Avatar } from '../../components/organisms/avatar/avatar';
import { arrayShuffle } from '../../util/array-shuffle';

export type FourOptionState = {
  wordDef: WordDef | null;
  selectedUsage: string;
  options: string[];
  selectedOption: string | null;
  droppedOption: string | null;
  isCorrect: boolean | null;
  incorrectAttempts: number;
};

type NewWordPayload = ActionPayload<
  'NEW_WORD',
  { wordDef: WordDef; numberOfOptions: number }
>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;
type SetSelectedOptionPayload = ActionPayload<
  'SET_SELECTED_OPTION',
  { option: string | null }
>;
type SetDroppedOptionPayload = ActionPayload<
  'SET_DROPPED_OPTION',
  { option: string | null }
>;

export type FourOptionAction =
  | NewWordPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload
  | SetSelectedOptionPayload
  | SetDroppedOptionPayload;

const pickNRandom = <T>(arr: T[], n: number): T[] => {
  const shuffled = arrayShuffle(arr);
  return shuffled.slice(0, n);
};

const generate4Options = (wordDef: WordDef): string[] => {
  const correctWord = wordDef.word.toLowerCase();
  const { easy, medium, hard } = wordDef.option;

  const result = arrayShuffle([
    ...pickNRandom(easy, 1),
    ...pickNRandom(medium, 1),
    ...pickNRandom(hard, 1),
    correctWord,
  ]);
  return result;
};

const generate3Options = (wordDef: WordDef): string[] => {
  const correctWord = wordDef.word.toLowerCase();
  const { easy, hard } = wordDef.option;

  return arrayShuffle([
    ...pickNRandom(easy, 1),
    ...pickNRandom(hard, 1),
    correctWord,
  ]);
};

const generate2Options = (wordDef: WordDef): string[] => {
  const correctWord = wordDef.word.toLowerCase();
  const { hard } = wordDef.option;

  return arrayShuffle([...pickNRandom(hard, 1), correctWord]);
};

const generateNOptions = (wordDef: WordDef, n: number): string[] => {
  switch (n) {
    case 2:
      return generate2Options(wordDef);
    case 3:
      return generate3Options(wordDef);
    case 4:
      return generate4Options(wordDef);
    default:
      return generate4Options(wordDef);
  }
};

const generateOptions = (
  wordDef: WordDef,
  numberOfOptions: number
): string[] => {
  return generateNOptions(wordDef, numberOfOptions);
};

const getRandomUsage = (wordDef: WordDef): string => {
  const usages = wordDef.usage;
  return usages[Math.floor(Math.random() * usages.length)];
};

export const fourOptionReducer = (
  state: FourOptionState,
  action: FourOptionAction
): FourOptionState => {
  switch (action.type) {
    case 'NEW_WORD': {
      const { wordDef, numberOfOptions } = action.action;
      const options = generateOptions(wordDef, numberOfOptions);
      const selectedUsage = getRandomUsage(wordDef);

      return {
        wordDef,
        selectedUsage,
        options,
        selectedOption: null,
        droppedOption: null,
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
    case 'SET_SELECTED_OPTION':
      return {
        ...state,
        selectedOption: action.action.option,
      };
    case 'SET_DROPPED_OPTION':
      return {
        ...state,
        droppedOption: action.action.option,
      };
    default:
      return state;
  }
};

export const useMultiChoiceState = (numberOfOptions: number = 4) => {
  const [state, dispatch] = useReducer(fourOptionReducer, {
    wordDef: null,
    selectedUsage: '',
    options: [],
    selectedOption: null,
    droppedOption: null,
    isCorrect: null,
    incorrectAttempts: 0,
  });

  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);

  const resetHint = useResetHint();
  const { speak } = useSpellingSpeech();

  const setSelectedOption = useCallback((option: string | null) => {
    dispatch({
      type: 'SET_SELECTED_OPTION',
      action: { option },
    });
  }, []);

  const setDroppedOption = useCallback((option: string | null) => {
    dispatch({
      type: 'SET_DROPPED_OPTION',
      action: { option },
    });
  }, []);

  const setIsCorrect = useCallback((isCorrect: boolean | null) => {
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
      Avatar.changeCharacter('by_rating/1');
    }
  }, []);

  const setNewWord = useCallback(
    (wordDef: WordDef) => {
      const HINTS = 1; // [syllable]
      resetHint(HINTS);
      dispatch({
        type: 'NEW_WORD',
        action: { wordDef, numberOfOptions },
      });
      speak(wordDef.word);
    },
    [resetHint, speak, numberOfOptions]
  );

  return {
    state,
    setSelectedOption,
    setDroppedOption,
    setIsCorrect,
    setNewWord,
  };
};
