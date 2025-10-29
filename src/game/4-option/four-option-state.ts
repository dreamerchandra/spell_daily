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

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
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

const generateOptions = (wordDef: WordDef): string[] => {
  const correctWord = wordDef.word.toLowerCase();
  const { easy, medium, hard } = wordDef.option;

  // Pick one random option from each difficulty level
  const easyOption = easy[Math.floor(Math.random() * easy.length)];
  const mediumOption = medium[Math.floor(Math.random() * medium.length)];
  const hardOption = hard[Math.floor(Math.random() * hard.length)];

  // Create the options array with the correct word and the selected incorrect options
  const options = [correctWord, easyOption, mediumOption, hardOption];

  // Remove duplicates (in case any of the wrong options match the correct word)
  const uniqueOptions = Array.from(new Set(options));

  // If we have less than 4 unique options, add some fallback options
  while (uniqueOptions.length < 4) {
    const allIncorrect = [...easy, ...medium, ...hard].filter(
      opt => opt.toLowerCase() !== correctWord && !uniqueOptions.includes(opt)
    );
    if (allIncorrect.length > 0) {
      uniqueOptions.push(
        allIncorrect[Math.floor(Math.random() * allIncorrect.length)]
      );
    } else {
      // Fallback: create a slightly modified version
      uniqueOptions.push(correctWord + 'x');
    }
  }

  // Shuffle the options so the correct answer isn't always in the same position
  return arrayShuffle(uniqueOptions.slice(0, 4));
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
      const wordDef = action.action.wordDef;
      const options = generateOptions(wordDef);
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

export const useFourOptionState = () => {
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
        action: { wordDef },
      });
      speak(wordDef.word);
    },
    [resetHint, speak]
  );

  return {
    state,
    setSelectedOption,
    setDroppedOption,
    setIsCorrect,
    setNewWord,
  };
};
