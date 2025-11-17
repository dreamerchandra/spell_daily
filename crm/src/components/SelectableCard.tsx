import React, { useState, useRef, type ReactNode, type FC } from 'react';
import { SelectableCardContext } from '../contexts/SelectableCardContext';
import type { SelectableCardContextType } from '../contexts/SelectableCardContext';
import {
  useSelectionContext,
  useSelection,
} from '../hooks/useSelectionContext';

// Context Provider component
interface SelectableCardProviderProps {
  children: ReactNode;
}

export const SelectableCardProvider: FC<SelectableCardProviderProps> = ({
  children,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const hasSelections = selectedIds.length > 0;

  const clearSelections = () => setSelectedIds([]);

  const value: SelectableCardContextType = {
    selectedIds,
    setSelectedIds,
    toggleSelection,
    isSelected,
    hasSelections,
    clearSelections,
  };

  return (
    <SelectableCardContext.Provider value={value}>
      {children}
    </SelectableCardContext.Provider>
  );
};

// SelectableItem component
interface SelectableItemProps {
  id: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  longPressThreshold?: number;
}

export const SelectableItem: FC<SelectableItemProps> = ({
  id,
  onClick,
  children,
  className = '',
  longPressThreshold = 500,
}) => {
  const { toggleSelection, hasSelections, isSelected } = useSelectionContext();
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const itemIsSelected = isSelected(id);

  const clearTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(true);
    pressTimer.current = window.setTimeout(() => {
      setIsLongPressed(true);
      handleLongPress();
    }, longPressThreshold);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    clearTimer();
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    clearTimer();
  };

  const handleLongPress = () => {
    toggleSelection(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent click if it was a long press
    if (isLongPressed) {
      setIsLongPressed(false);
      return;
    }

    // If we have selections or this item is selected, handle as selection toggle
    if (hasSelections || itemIsSelected) {
      toggleSelection(id);
    } else {
      // Normal click behavior
      onClick();
    }
  };

  return (
    <div
      className={`cursor-pointer transition-all duration-200 ${
        itemIsSelected
          ? 'bg-primary-100 border-2 border-primary-500'
          : isPressed
            ? 'bg-app-secondary scale-95'
            : 'hover:bg-app-hover'
      } ${className}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </div>
  );
};

// Selection indicator component (optional utility)
export const SelectionIndicator: FC<{ id: string; className?: string }> = ({
  id,
  className = '',
}) => {
  const isSelected = useSelection(id);
  const { hasSelections } = useSelectionContext();

  if (!hasSelections && !isSelected) return null;

  return (
    <div className={`w-6 h-6 flex items-center justify-center ${className}`}>
      {isSelected ? (
        <svg
          className="w-5 h-5 text-primary-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <div className="w-5 h-5 border-2 border-app-secondary rounded-full"></div>
      )}
    </div>
  );
};
