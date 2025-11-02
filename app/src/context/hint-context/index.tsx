/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ActionDispatch,
  type FC,
  type ReactNode,
} from 'react';
import { hintReducer, type HintState, type HintAction } from './state';

type HintContextType = {
  state: HintState;
  dispatch: ActionDispatch<[action: HintAction]>;
};

const HintContext = createContext<HintContextType | undefined>(undefined);

export const HintContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(hintReducer, {
    currentHint: 0,
    maxHint: 0,
    testMode: false,
  });
  return (
    <HintContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </HintContext.Provider>
  );
};

const useHintContext = () => {
  const context = useContext(HintContext);
  if (!context) {
    throw new Error('useHintContext must be used within a HintContextProvider');
  }
  return context;
};

export const useNextHint = () => {
  const { dispatch } = useHintContext();
  return useCallback(() => {
    return dispatch({
      type: 'USE_HINT',
    });
  }, [dispatch]);
};

export const useResetHint = () => {
  const { dispatch } = useHintContext();
  return useCallback(
    (maxHint: number) => {
      return dispatch({
        type: 'NEW_WORD',
        action: {
          maxHint,
        },
      });
    },
    [dispatch]
  );
};

export const useHintState = () => {
  const context = useHintContext();
  return context.state;
};

export const useOnHintIncrease = (cb: (currentHint: number) => void) => {
  const { state } = useHintContext();
  const ref = useRef(cb);
  const prevHintRef = useRef(state.currentHint);

  useEffect(() => {
    ref.current = cb;
  }, [cb]);

  useEffect(() => {
    // Only call if hint actually increased (not reset or initial)
    if (state.currentHint > prevHintRef.current) {
      ref.current(state.currentHint);
    }
    prevHintRef.current = state.currentHint;
  }, [state.currentHint]);
};

export const useIsTestMode = () => {
  const { state } = useHintContext();
  return state.testMode;
};

export const useOnTestModeChange = (cb: (enabled: boolean) => void) => {
  const { state } = useHintContext();
  const ref = useRef(cb);
  const prevTestModeRef = useRef(state.testMode);

  useEffect(() => {
    ref.current = cb;
  }, [cb]);

  useEffect(() => {
    if (state.testMode !== prevTestModeRef.current) {
      ref.current(state.testMode);
    }
    prevTestModeRef.current = state.testMode;
  }, [state.testMode]);
};

export const useSetTestMode = () => {
  const { dispatch } = useHintContext();
  return useCallback(
    (enabled: boolean) => {
      return dispatch({
        type: 'TEST_MODE',
        action: {
          enabled,
        },
      });
    },
    [dispatch]
  );
};
