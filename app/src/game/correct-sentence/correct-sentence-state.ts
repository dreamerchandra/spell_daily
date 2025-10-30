import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ActionPayload } from '../../common/payload-creeator';
import type { WordUsage } from '../../words';
import { useResetHint } from '../../context/hint-context/index';
import { Avatar } from '../../components/organisms/avatar/avatar';
import { useSetTimeout } from '../../hooks/use-setTimeout';
import { pubSub } from '../../util/pub-sub';

type CorrectSentenceState = {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  incorrectAttempts: number;
  wordDef: WordUsage | null;
  // Random selections for current round
  currentQuestion: {
    question: string;
    correctAnswer: string;
    options: string[]; // 4 options total (1 correct + 3 wrong)
  } | null;
};

type NewWordPayload = ActionPayload<'NEW_WORD', { wordDef: WordUsage }>;
type SelectAnswerPayload = ActionPayload<'SELECT_ANSWER', { answer: string }>;
type SetIsCorrectPayload = ActionPayload<
  'SET_IS_CORRECT',
  { isCorrect: boolean | null }
>;
type SetIncorrectAttemptsPayload = ActionPayload<'SET_INCORRECT_ATTEMPTS'>;

export type CorrectSentenceAction =
  | NewWordPayload
  | SelectAnswerPayload
  | SetIsCorrectPayload
  | SetIncorrectAttemptsPayload;

// Helper function to randomly select elements from arrays
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateQuestion = (wordDef: WordUsage) => {
  // Pick random sentence group
  const sentenceGroup = getRandomElement(wordDef.sentences);

  // Pick random question and correct answer
  const question = getRandomElement(sentenceGroup.question);
  const correctAnswer = getRandomElement(sentenceGroup.correct);

  // Pick 3 random wrong options (ensure they don't include the correct answer)
  const availableWrongOptions = sentenceGroup.options.filter(
    option => !sentenceGroup.correct.includes(option)
  );
  const wrongOptions = getRandomElements(availableWrongOptions, 3);

  // Combine correct and wrong options, then shuffle
  const allOptions = [correctAnswer, ...wrongOptions].sort(
    () => 0.5 - Math.random()
  );

  return {
    question,
    correctAnswer,
    options: allOptions,
  };
};

export const correctSentenceReducer = (
  state: CorrectSentenceState,
  action: CorrectSentenceAction
): CorrectSentenceState => {
  switch (action.type) {
    case 'NEW_WORD':
      return {
        wordDef: action.action.wordDef,
        selectedAnswer: null,
        isCorrect: null,
        incorrectAttempts: 0,
        currentQuestion: generateQuestion(action.action.wordDef),
      };
    case 'SELECT_ANSWER':
      return {
        ...state,
        selectedAnswer: action.action.answer,
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
    default:
      return state;
  }
};

export const useCorrectSentenceState = () => {
  const [state, dispatch] = useReducer(correctSentenceReducer, {
    selectedAnswer: null,
    isCorrect: null,
    incorrectAttempts: 0,
    wordDef: null,
    currentQuestion: null,
  });

  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);

  const resetHint = useResetHint();
  const timer = useSetTimeout();

  const selectAnswer = useCallback((answer: string) => {
    dispatch({
      type: 'SELECT_ANSWER',
      action: { answer },
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
        Avatar.changeCharacter('by_rating/1');
        timer(() => {
          dispatch({
            type: 'SET_IS_CORRECT',
            action: { isCorrect: null },
          });
        }, 2000);
      } else if (isCorrect === true) {
        timer(() => {
          pubSub.publish('Animation:End');
        }, 1000);
      }
    },
    [timer]
  );

  const setNewWord = useCallback(
    (wordDef: WordUsage) => {
      const HINTS = 0;
      resetHint(HINTS);
      dispatch({
        type: 'NEW_WORD',
        action: { wordDef: wordDef },
      });
    },
    [resetHint]
  );

  return {
    state,
    selectAnswer,
    setIsCorrect,
    setNewWord,
  };
};
