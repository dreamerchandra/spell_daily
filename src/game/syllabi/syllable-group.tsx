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
}> = ({ options, syllableIndex, selectedSyllables, onSelect, onDragStart }) => {
  const shuffled = useRef(getRandomOptions(options));

  return (
    <div
      key={syllableIndex}
      className="border-1 flex flex-col rounded-xl shadow-sm"
    >
      <h4 className="mb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        Part {syllableIndex + 1}
      </h4>
      <div className="flex flex-col gap-2">
        {shuffled.current.map((option, optionIndex) => {
          const isSelected = selectedSyllables[syllableIndex] === option;

          let buttonClasses =
            'px-3 py-2 rounded-lg font-medium transition-all duration-200 border text-center ';

          if (isSelected) {
            buttonClasses +=
              'bg-game-primary-100 border-game-primary-500 text-game-primary-700 dark:bg-game-primary-900 dark:text-game-primary-300 shadow-md';
          } else {
            buttonClasses +=
              'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing';
          }

          return (
            <button
              key={optionIndex}
              draggable={true}
              onClick={() => onSelect(option, syllableIndex)}
              onDragStart={e => onDragStart(e, option, syllableIndex)}
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
        />
      ))}
    </div>
  );
};
