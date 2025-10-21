import {
  createContext,
  useCallback,
  useContext,
  useReducer,
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
