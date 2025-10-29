import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordDef } from '../../words';
import { useResetHint, useNextHint } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { Avatar } from '../../components/organisms/avatar/avatar';

type VoiceTypingState = {
  userInput: string[];
  recognizedText: string;
  isCorrect: boolean | null;
  incorrectAttempts: number;
  wordDef: WordDef | null;
  isListening: boolean;
  currentCharacterIndex: number;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordDef }>;
type SetUserInputPayload = ActionPayload<
  'SET_USER_INPUT',
  { userInput: string[] }
>;
type SetRecognizedTextPayload = ActionPayload<
  'SET_RECOGNIZED_TEXT',
  { recognizedText: string }
>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;
type SetIsListeningPayload = ActionPayload<
  'SET_IS_LISTENING',
  { isListening: boolean }
>;

type AddCharacterPayload = ActionPayload<
  'ADD_CHARACTER',
  { character: string }
>;
type TryAgainPayload = ActionPayload<'TRY_AGAIN'>;

export type VoiceTypingAction =
  | NewWordPayload
  | SetUserInputPayload
  | SetRecognizedTextPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload
  | SetIsListeningPayload
  | AddCharacterPayload
  | TryAgainPayload;

export const voiceTypingReducer = (
  state: VoiceTypingState,
  action: VoiceTypingAction
): VoiceTypingState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        wordDef: action.action.wordDef,
        userInput: new Array(action.action.wordDef.word.length).fill(''),
        recognizedText: '',
        isCorrect: null,
        incorrectAttempts: 0,
        isListening: false,
        currentCharacterIndex: 0,
      };
    case 'TRY_AGAIN':
      return {
        ...state,
        userInput: new Array(state.wordDef?.word.length || 0).fill(''),
        recognizedText: '',
        isCorrect: null,
        isListening: false,
        currentCharacterIndex: 0,
      };
    case 'SET_USER_INPUT':
      return {
        ...state,
        userInput: action.action.userInput,
      };
    case 'ADD_CHARACTER': {
      const nextIndex = state.userInput.findIndex(
        (char: string) => char === ''
      );
      if (nextIndex === -1) return state; // All positions filled
      const newInput = [...state.userInput];
      newInput[nextIndex] = action.action.character;
      return {
        ...state,
        userInput: newInput,
        currentCharacterIndex: nextIndex + 1,
      };
    }
    case 'SET_RECOGNIZED_TEXT':
      return {
        ...state,
        recognizedText: action.action.recognizedText,
      };
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
    case 'SET_IS_LISTENING':
      return {
        ...state,
        isListening: action.action.isListening,
      };
    default:
      return state;
  }
};

export const useVoiceTypingState = () => {
  const [state, dispatch] = useReducer(voiceTypingReducer, {
    userInput: [],
    recognizedText: '',
    isCorrect: null,
    incorrectAttempts: 0,
    wordDef: null,
    isListening: false,
    currentCharacterIndex: 0,
  });

  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);

  const resetHint = useResetHint();
  const nextHint = useNextHint();
  const { speak } = useSpellingSpeech();

  const setUserInput = useCallback((userInput: string[]) => {
    dispatch({
      type: 'SET_USER_INPUT',
      action: { userInput },
    });
  }, []);

  const addCharacter = useCallback((character: string) => {
    dispatch({
      type: 'ADD_CHARACTER',
      action: { character },
    });
  }, []);

  const setRecognizedText = useCallback((recognizedText: string) => {
    dispatch({
      type: 'SET_RECOGNIZED_TEXT',
      action: { recognizedText },
    });
  }, []);

  const setIsListening = useCallback((isListening: boolean) => {
    dispatch({
      type: 'SET_IS_LISTENING',
      action: { isListening },
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

  const tryAgain = useCallback(() => {
    dispatch({
      type: 'TRY_AGAIN',
    });
  }, []);

  return {
    state,
    setUserInput,
    addCharacter,
    setRecognizedText,
    setIsCorrect,
    setNewWord,
    setIsListening,
    tryAgain,
  };
};
