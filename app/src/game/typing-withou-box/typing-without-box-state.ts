import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordDef } from '../../words';
import { useHintState, useResetHint } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { Avatar } from '../../components/organisms/avatar/avatar';

type TypingState = {
  userInput: string;
  isCorrect: boolean | null;
  incorrectAttempts: number;
  wordDef: WordDef | null;
  maxAttempts: number;
  revealAnswer: boolean;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
type SetUserInputPayload = ActionPayload<
  'SET_USER_INPUT',
  { userInput: string }
>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;

export type TypingAction =
  | NewWordPayload
  | SetUserInputPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload;

export const typingReducer = (
  state: TypingState,
  action: TypingAction
): TypingState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        wordDef: action.action.wordDef,
        userInput: '',
        isCorrect: null,
        incorrectAttempts: 0,
        maxAttempts: 1,
        revealAnswer: false,
      };
    case 'SET_USER_INPUT':
      return {
        ...state,
        userInput: action.action.userInput,
      };
    case 'SET_IS_CORRECT':
      return {
        ...state,
        isCorrect: action.action.isCorrect,
      };
    case 'SET_INCORRECT_ATTEMPTS': {
      const updateIncorrectAttempts = state.incorrectAttempts + 1;
      return {
        ...state,
        incorrectAttempts: updateIncorrectAttempts,
        revealAnswer: updateIncorrectAttempts >= state.maxAttempts,
      };
    }
    default:
      return state;
  }
};

export const useTypingState = () => {
  const [state, dispatch] = useReducer(typingReducer, {
    userInput: '',
    isCorrect: null,
    incorrectAttempts: 0,
    wordDef: null,
    maxAttempts: 1,
    revealAnswer: false,
  });
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  const resetHint = useResetHint();
  const hintState = useHintState();
  const { speak } = useSpellingSpeech();

  const setUserInput = useCallback((userInput: string) => {
    dispatch({
      type: 'SET_USER_INPUT',
      action: { userInput },
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
      Avatar.changeCharacter('by_rating/1');
    }
  }, []);

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
  }, [hintState.currentHint, setUserInput]);

  return {
    state,
    setUserInput,
    setIsCorrect,
    setNewWord,
  };
};
