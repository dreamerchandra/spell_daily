import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS as dndCSS } from '@dnd-kit/utilities';
import {
  getPhoneticColorByActualSyllable,
  phoneticColors,
} from '../../../config/pallet-config';
import type { WordDef } from '../../../words';
import {
  BASE_BOX_CLASSES,
  SUCCESS_STYLES,
  ERROR_STYLES,
  PRIMARY_STYLES,
  EMPTY_STYLES,
  WHITE_TEXT,
  GRAY_TEXT,
} from './styles';
import { useOnHintIncrease } from '../../../context/hint-context';
import type { JumbledInputLetter } from './types';

export interface SpellingInputDragDropProps {
  userInput: JumbledInputLetter[];
  availableLetters: JumbledInputLetter[];
  isCorrect: boolean | null;
  className?: string;
  wordDef: WordDef;
  showSyllableColors?: boolean;
  onUserInputChange: (newInput: JumbledInputLetter[]) => void;
}

// Droppable slot component for input letters
interface DroppableSlotProps {
  id: string;
  letter: JumbledInputLetter | null;
  index: number;
  isCorrect: boolean | null;
  showSyllableColors: boolean;
  phoneticColorClass?: string;
  onRemove: () => void;
  placeHolder: string | null;
}

const DroppableSlot = ({
  id,
  letter,
  index: _index,
  isCorrect,
  showSyllableColors,
  phoneticColorClass,
  onRemove,
  placeHolder,
}: DroppableSlotProps) => {
  const [lastTap, setLastTap] = useState<number>(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !letter });

  const style = {
    transform: dndCSS.Transform.toString(transform),
    transition,
  };

  // Mobile-friendly double tap handler
  const handleTap = () => {
    if (!letter) return;

    const currentTime = Date.now();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      // Double tap detected
      onRemove();
    }

    setLastTap(currentTime);
  };

  const getBoxStyles = () => {
    let baseStyles = `${BASE_BOX_CLASSES} w-auto`;

    if (isDragging) {
      baseStyles += ' opacity-50';
    }

    if (!letter && placeHolder) {
      baseStyles += ' italic text-gray-500';
      letter = { letter: placeHolder, pos: _index };
    }

    if (showSyllableColors && phoneticColorClass) {
      if (letter) {
        if (isCorrect === true) {
          return `${baseStyles} ${SUCCESS_STYLES}`;
        }
        return `${baseStyles} ${phoneticColorClass} ${WHITE_TEXT}`;
      }
      return `${baseStyles} ${phoneticColorClass} ${GRAY_TEXT} border-dashed`;
    }

    if (letter) {
      if (isCorrect === true) {
        return `${baseStyles} ${SUCCESS_STYLES}`;
      }
      if (isCorrect === false) {
        return `${baseStyles} ${ERROR_STYLES}`;
      }
      return `${baseStyles} ${PRIMARY_STYLES}`;
    }

    return `${baseStyles} ${EMPTY_STYLES} border-dashed`;
  };

  return (
    <div className={letter ? 'group relative flex-1' : ''}>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          touchAction: 'none',
        }}
        className={`${getBoxStyles()}`}
        onDoubleClick={handleTap}
        onClick={handleTap}
        onTouchEnd={e => {
          if (e.currentTarget === e.target) {
            e.preventDefault();
            handleTap();
          }
        }}
        title={letter ? 'Tap twice to remove' : 'Drop letter here'}
        {...attributes}
        {...(letter ? listeners : {})}
      >
        {letter?.letter || ''}
        {letter && (
          <button
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-60 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Draggable letter component for available letters
interface DraggableLetterProps {
  id: string;
  letter: JumbledInputLetter;
  onClick: () => void;
  showSyllableColors?: boolean;
  phoneticColorClass?: string;
}

const DraggableLetter = ({
  id,
  letter,
  onClick,
  showSyllableColors = false,
  phoneticColorClass,
}: DraggableLetterProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: dndCSS.Transform.toString(transform),
    transition,
  };

  const getBackgroundClasses = () => {
    if (showSyllableColors && phoneticColorClass) {
      return `${phoneticColorClass} ${WHITE_TEXT}`;
    }
    return 'bg-gradient-to-r from-dark-700/70 to-dark-800/70 text-gray-200 hover:from-dark-800 hover:to-dark-900';
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: 'none',
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`flex h-10 min-w-[2.5rem] transform cursor-move select-none items-center justify-center rounded-lg border border-dark-600/30 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 ${getBackgroundClasses()} ${
        isDragging ? 'opacity-50' : ''
      }`}
      title="Drag to position or click to add"
    >
      {letter.letter}
    </div>
  );
};

export const SpellingInputDragDrop = ({
  userInput,
  availableLetters,
  isCorrect = null,
  className = '',
  wordDef,
  showSyllableColors = false,
  onUserInputChange,
}: SpellingInputDragDropProps) => {
  const [showPlaceHolders, setShowPlaceHolders] = useState(false);
  useOnHintIncrease(hint => {
    if (hint >= 3) {
      setShowPlaceHolders(true);
    }
  });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const phoneticGrouping = useMemo(() => {
    return getPhoneticColorByActualSyllable(wordDef.actualSyllable);
  }, [wordDef.actualSyllable]);

  // Create unique IDs for all items
  const inputItems = userInput.map((letter, index) => ({
    id: `input-${index}`,
    letter,
    index,
  }));

  // Create available items with syllable index for proper color mapping
  const availableItems = availableLetters.map((letter, availableIndex) => {
    // Create a mapping of letter positions to syllable indices in the original word
    const wordLetterToSyllableMap: number[] = [];

    for (let syllIdx = 0; syllIdx < wordDef.actualSyllable.length; syllIdx++) {
      const syllable = wordDef.actualSyllable[syllIdx];
      for (let i = 0; i < syllable.length; i++) {
        wordLetterToSyllableMap.push(syllIdx);
      }
    }

    // Find all positions where this letter appears in the word
    const wordLetters = wordDef.word.split('');
    const letterPositions = wordLetters
      .map((wordLetter, pos) =>
        wordLetter.toLowerCase() === letter.letter.toLowerCase() ? pos : -1
      )
      .filter(pos => pos !== -1);

    // Count how many of this letter we've seen before this available index
    const letterOccurrenceIndex = availableLetters
      .slice(0, availableIndex)
      .filter(
        l => l.letter.toLowerCase() === letter.letter.toLowerCase()
      ).length;

    // Get the syllable index for this occurrence of the letter
    const wordPosition =
      letterPositions[letterOccurrenceIndex] || letterPositions[0] || 0;
    const syllableIndex = wordLetterToSyllableMap[wordPosition] || 0;

    return {
      id: `available-${availableIndex}`,
      letter,
      index: availableIndex,
      syllableIndex,
      hintColor: phoneticColors[syllableIndex],
    };
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Parse IDs to get source and target info
    const [activeSource, activeIndexStr] = activeId.split('-');
    const [overSource, overIndexStr] = overId.split('-');
    const activeIndex = parseInt(activeIndexStr);
    const overIndex = parseInt(overIndexStr);

    if (activeSource === 'available' && overSource === 'input') {
      const newUserInput = [...userInput];
      const letter = availableLetters[activeIndex];
      newUserInput[overIndex] = letter;
      onUserInputChange(newUserInput);
    } else if (activeSource === 'input' && overSource === 'input') {
      // Rearranging within input slots
      if (activeIndex !== overIndex) {
        const newUserInput = arrayMove(userInput, activeIndex, overIndex);
        onUserInputChange(newUserInput);
      }
    } else if (activeSource === 'input' && overSource === 'available') {
      // Moving from input back to available (remove from input)
      const letter = userInput[activeIndex];
      if (letter) {
        const newUserInput = [...userInput];
        newUserInput[activeIndex] = { letter: '', pos: activeIndex };
        onUserInputChange(newUserInput);
      }
    }
  };

  const handleInputLetterDoubleClick = (index: number) => {
    const letter = userInput[index];
    if (!letter) return;

    const newUserInput = [...userInput];
    newUserInput[index] = { letter: '', pos: index };

    onUserInputChange(newUserInput);
  };

  const handleAvailableLetterClick = (letter: JumbledInputLetter) => {
    const firstEmptyIndex = userInput.findIndex(
      slot => slot === null || slot.letter === ''
    );
    if (firstEmptyIndex === -1) return;

    const newUserInput = [...userInput];
    newUserInput[firstEmptyIndex] = letter;

    onUserInputChange(newUserInput);
  };

  return (
    <DndContext
      key={`${userInput.map(item => item.letter).join('')}-${availableLetters.map(item => item.letter).join('')}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={className}>
        {/* Input slots */}
        <SortableContext
          items={inputItems.map(item => item.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="mb-4 flex justify-center gap-2">
            {inputItems.map((item, index) => (
              <DroppableSlot
                key={item.id}
                id={item.id}
                letter={item.letter}
                index={index}
                isCorrect={isCorrect}
                placeHolder={
                  showPlaceHolders && !item.letter ? wordDef.word[index] : null
                }
                showSyllableColors={showSyllableColors}
                phoneticColorClass={phoneticGrouping[index]}
                onRemove={() => handleInputLetterDoubleClick(index)}
              />
            ))}
          </div>
        </SortableContext>

        {/* Available letters */}
        {availableLetters.length > 0 && (
          <div className="space-y-2">
            <p className="text-center text-xs text-gray-400">
              Available Letters (drag or click to use)
            </p>
            <SortableContext
              items={availableItems.map(item => item.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {availableItems.map(item => (
                  <DraggableLetter
                    key={item.id}
                    id={item.id}
                    letter={item.letter}
                    onClick={() => handleAvailableLetterClick(item.letter)}
                    showSyllableColors={showSyllableColors}
                    phoneticColorClass={item.hintColor}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="flex h-10 min-w-[2.5rem] transform cursor-move select-none items-center justify-center rounded-lg border border-dark-600/30 bg-gradient-to-r from-dark-700/70 to-dark-800/70 text-sm font-semibold text-gray-200 opacity-75 shadow-sm">
            {String(activeId).startsWith('input-')
              ? userInput[parseInt(String(activeId).split('-')[1])].letter
              : availableLetters[parseInt(String(activeId).split('-')[1])]
                  .letter}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
