import { useContext } from 'react';
import { SelectableCardContext } from '../contexts/SelectableCardContext';
import type { SelectableCardContextType } from '../contexts/SelectableCardContext';

// Custom hook to use the selection context
export const useSelectionContext = (): SelectableCardContextType => {
  const context = useContext(SelectableCardContext);
  if (!context) {
    return {
      disableSelection: true,
      clearSelections: () => {},
      hasSelections: false,
      isSelected: () => false,
      selectedIds: [],
      setSelectedIds: () => {},
      toggleSelection: () => {},
    };
  }
  return context;
};

// Custom hook for individual item selection status
export const useSelection = (id: string): boolean => {
  const { isSelected } = useSelectionContext();
  return isSelected(id);
};
