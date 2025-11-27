import { useCallback, useReducer } from 'react';

type StreakState = {
  counter: number;
  isPlaying: boolean;
};

type StreakAction =
  | { type: 'INCREMENT' }
  | { type: 'INCREMENT_START_ANIMATION' }
  | { type: 'RESET' }
  | { type: 'STOP_ANIMATION' };

const streakReducer = (state: StreakState, action: StreakAction) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'INCREMENT_START_ANIMATION':
      return { ...state, counter: state.counter + 1, isPlaying: true };
    case 'RESET':
      return { counter: 0, isPlaying: false };
    case 'STOP_ANIMATION':
      return { ...state, isPlaying: false };
    default:
      return state;
  }
};

const celebrationStreaks = [3, 5, 10];
export const useSteak = () => {
  const [streak, dispatch] = useReducer(streakReducer, {
    counter: 0,
    isPlaying: false,
  });

  const incrementStreak = useCallback(() => {
    if (celebrationStreaks.includes(streak.counter + 1)) {
      dispatch({ type: 'INCREMENT_START_ANIMATION' });
    } else {
      dispatch({ type: 'INCREMENT' });
    }
  }, [streak.counter]);

  const resetStreak = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const stopAnimation = useCallback(() => {
    dispatch({ type: 'STOP_ANIMATION' });
  }, []);

  return {
    streak,
    incrementStreak,
    resetStreak,
    stopAnimation,
  };
};
