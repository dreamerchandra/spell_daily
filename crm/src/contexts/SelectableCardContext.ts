import { createContext } from 'react';

// Context type definition
export interface SelectableCardContextType {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  hasSelections: boolean;
  clearSelections: () => void;
}

// Create the context
export const SelectableCardContext = createContext<
  SelectableCardContextType | undefined
>(undefined);
