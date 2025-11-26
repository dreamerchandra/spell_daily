import React, { useRef, type FC } from 'react';

interface SyllableGroupProps {
  allOptions: string[][];
  actualSyllables: string[];
  onSelect: (syllable: string, index: number) => void;
  selectedSyllables: string[];
  onDragStart?: (syllable: string, fromIndex: number) => void;
}

const getRandomOptions = (option: string[]): string[] => {
  const shuffled = [...option].sort(() => 0.5 - Math.random());
  return shuffled;
};

const RandomOption: FC<{
  options: string[];
  syllableIndex: number;
  selectedSyllables: string[];
  onSelect: (syllable: string, index: number) => void;
  onDragStart: (
    e: React.DragEvent,
    syllable: string,
    fromIndex: number
  ) => void;
  onTouchStart?: (
    e: React.TouchEvent,
    syllable: string,
    fromIndex: number
  ) => void;
}> = ({
  options,
  syllableIndex,
  selectedSyllables,
  onSelect,
  onDragStart,
  onTouchStart,
}) => {
  const shuffled = useRef(getRandomOptions(options));

  return (
    <div
      key={syllableIndex}
      className="border-1 flex flex-col rounded-xl shadow-sm"
    >
      <h4 className="mb-3 text-center text-sm font-semibold text-ui-textMuted">
        Part {syllableIndex + 1}
      </h4>
      <div className="flex flex-col gap-2">
        {shuffled.current.map((option, optionIndex) => {
          const isSelected = selectedSyllables[syllableIndex] === option;

          let buttonClasses =
            'px-3 py-2 rounded-lg font-medium transition-all duration-200 border text-center ';

          if (isSelected) {
            buttonClasses +=
              'bg-indigo-50 border-ui-primary text-ui-primary shadow-md';
          } else {
            buttonClasses +=
              'bg-white border-gray-200 text-ui-text hover:bg-gray-50 hover:border-gray-300 cursor-grab active:cursor-grabbing';
          }

          return (
            <button
              key={optionIndex}
              draggable={true}
              onClick={() => onSelect(option, syllableIndex)}
              onDragStart={e => onDragStart(e, option, syllableIndex)}
              onTouchStart={e => {
                // Mark this element as being dragged for touch interactions
                e.currentTarget.setAttribute('data-touch-dragging', 'true');
                onTouchStart?.(e, option, syllableIndex);
              }}
              onTouchEnd={e => {
                // Clean up dragging state
                e.currentTarget.removeAttribute('data-touch-dragging');
              }}
              className={buttonClasses}
              data-syllable-option={option}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const SyllableGroup: React.FC<SyllableGroupProps> = ({
  allOptions,
  actualSyllables: _actualSyllables,
  onSelect,
  selectedSyllables,
  onDragStart,
}) => {
  const handleDragStart = (
    e: React.DragEvent,
    syllable: string,
    fromIndex: number
  ) => {
    e.dataTransfer.setData('text/plain', syllable);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        syllable,
        fromIndex,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(syllable, fromIndex);
  };

  const handleTouchStart = (
    _e: React.TouchEvent,
    syllable: string,
    fromIndex: number
  ) => {
    // Touch start logic if needed
    console.log(
      `Touch started on syllable "${syllable}" from index ${fromIndex}`
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {allOptions.map((options, syllableIndex) => (
        <RandomOption
          key={syllableIndex}
          options={options}
          syllableIndex={syllableIndex}
          selectedSyllables={selectedSyllables}
          onSelect={onSelect}
          onDragStart={handleDragStart}
          onTouchStart={handleTouchStart}
        />
      ))}
    </div>
  );
};
