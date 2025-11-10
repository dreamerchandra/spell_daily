import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationContext } from './navigation-context';
import type { NavigationContextType } from './navigation-context';

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const [navigationStack, setNavigationStack] = useState<string[]>(() => {
    // Initialize from sessionStorage or empty array
    const saved = sessionStorage.getItem('navigationStack');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Current Path:', currentPath);

    setNavigationStack(prevStack => {
      const newStack = [...prevStack];

      // If we're going back (current path is already in stack), remove everything after it
      const currentIndex = newStack.indexOf(currentPath);
      if (currentIndex !== -1) {
        const updatedStack = newStack.slice(0, currentIndex + 1);
        sessionStorage.setItem('navigationStack', JSON.stringify(updatedStack));
        return updatedStack;
      }

      // If it's a new path, add it to the stack
      newStack.push(currentPath);
      sessionStorage.setItem('navigationStack', JSON.stringify(newStack));
      return newStack;
    });
  }, [location.pathname]);

  const goBack = () => {
    if (navigationStack.length > 1) {
      // Remove current path from stack
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      sessionStorage.setItem('navigationStack', JSON.stringify(newStack));

      // Use browser's back navigation
      window.history.back();
    }
  };

  const canGoBack = navigationStack.length > 1;

  const value: NavigationContextType = {
    navigationStack,
    canGoBack,
    goBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
