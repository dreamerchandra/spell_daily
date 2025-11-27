import {
  createContext,
  useReducer,
  type ActionDispatch,
  type ReactNode,
} from 'react';
import {
  type AnalyticsAction,
  type AnalyticsData,
  createAnalyticsReducer,
} from './state';

const AnalyticsContext = createContext<
  [AnalyticsData, ActionDispatch<[action: AnalyticsAction]>] | null
>(null);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [value, dispatch] = useReducer(createAnalyticsReducer, []);
  return (
    <AnalyticsContext.Provider value={[value, dispatch]}>
      {children}
    </AnalyticsContext.Provider>
  );
};
