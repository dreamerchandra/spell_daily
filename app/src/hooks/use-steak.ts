import { useCallback, useReducer } from 'react';

export type StreakState = {
  counter: number;
  isStreakScheduled: boolean;
  isPlaying: boolean;
};

type StreakAction =
  | { type: 'INCREMENT' }
  | { type: 'INCREMENT_SCHEDULE_ANIMATION' }
  | { type: 'START_ANIMATION' }
  | { type: 'RESET' }
  | { type: 'STOP_ANIMATION' };

const streakReducer = (
  state: StreakState,
  action: StreakAction
): StreakState => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        counter: state.counter + 1,
        isStreakScheduled: false,
        isPlaying: false,
      };
    case 'INCREMENT_SCHEDULE_ANIMATION':
      return {
        counter: state.counter + 1,
        isStreakScheduled: true,
        isPlaying: false,
      };
    case 'START_ANIMATION':
      return {
        counter: state.counter,
        isPlaying: true,
        isStreakScheduled: false,
      };
    case 'RESET':
      return { counter: 0, isStreakScheduled: false, isPlaying: false };
    case 'STOP_ANIMATION':
      return {
        counter: state.counter,
        isPlaying: false,
        isStreakScheduled: false,
      };
    default:
      return state;
  }
};

export const celebrationStreaks = [3, 5, 10];

export const useSteak = () => {
  const [streak, dispatch] = useReducer(streakReducer, {
    counter: 0,
    isPlaying: false,
    isStreakScheduled: false,
  });

  const incrementStreak = useCallback(() => {
    if (celebrationStreaks.includes(streak.counter + 1)) {
      dispatch({ type: 'INCREMENT_SCHEDULE_ANIMATION' });
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

  const startAnimation = useCallback(() => {
    dispatch({ type: 'START_ANIMATION' });
  }, []);

  return {
    streak,
    incrementStreak,
    resetStreak,
    stopAnimation,
    startAnimation,
  };
};
