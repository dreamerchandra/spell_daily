import { createContext } from 'react';

export interface NavigationContextType {
  navigationStack: string[];
  canGoBack: boolean;
  goBack: () => void;
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);
