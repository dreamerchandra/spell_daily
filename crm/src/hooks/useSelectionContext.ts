import { useContext } from 'react';
import { SelectableCardContext } from '../contexts/SelectableCardContext';
import type { SelectableCardContextType } from '../contexts/SelectableCardContext';

// Custom hook to use the selection context
export const useSelectionContext = (): SelectableCardContextType => {
  const context = useContext(SelectableCardContext);
  if (!context) {
    throw new Error(
      'useSelectionContext must be used within a SelectableCardProvider'
    );
  }
  return context;
};

// Custom hook for individual item selection status
export const useSelection = (id: string): boolean => {
  const { isSelected } = useSelectionContext();
  return isSelected(id);
};
