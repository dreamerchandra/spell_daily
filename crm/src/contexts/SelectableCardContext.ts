import { createContext } from 'react';

// Context type definition
export type SelectableCardContextType = {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelection: (id: string) => void;
  isSelected: (id: string) => boolean;
  hasSelections: boolean;
  clearSelections: () => void;
  disableSelection?: boolean;
};

// Create the context
export const SelectableCardContext = createContext<
  SelectableCardContextType | undefined
>(undefined);
