import React, { useState } from 'react';
import { useHintState } from '../../context/hint-context';
import { useSyllabiSpeech } from '../../hooks/useSpeech';

interface DroppableSlotProps {
  index: number;
  syllable: string;
  audioSyllable: string;
  placeholder: string;
  onDrop: (syllable: string, targetIndex: number) => void;
  onRemove?: (index: number) => void;
  isCorrect?: boolean | null;
}

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  index,
  syllable,
  placeholder,
  onDrop,
  onRemove,
  audioSyllable,
  isCorrect = null,
}) => {
  const { currentHint } = useHintState();
  const { isPlaying: isSpeaking, speak: speakSyllable } = useSyllabiSpeech();
  const showHintSpeaker = currentHint > 0;

  const onSyllableSpeak = () => {
    speakSyllable(audioSyllable);
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedSyllable = e.dataTransfer.getData('text/plain');
    if (droppedSyllable) {
      onDrop(droppedSyllable, index);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleClick = () => {
    const isFilled = Boolean(syllable);

    if (isFilled) {
      handleRemove();
    } else if (showHintSpeaker) {
      // If slot is empty and hints are active, play syllable audio
      onSyllableSpeak();
    }
  };

  const getSlotClasses = () => {
    let classes =
      'min-w-[80px] rounded-lg border-2 px-3 py-2 text-center font-medium transition-all duration-200 ';

    if (isDragOver) {
      classes +=
        'border-game-success-500 bg-game-success-50 text-game-success-700 dark:bg-game-success-900 dark:text-game-success-300 scale-105';
    } else if (syllable) {
      // Show success colors when answer is correct, primary otherwise
      if (isCorrect === true) {
        classes +=
          'border-game-success-500 bg-game-success-100 text-game-success-700 dark:bg-game-success-900 dark:text-game-success-300';
      } else {
        classes +=
          'border-game-primary-500 bg-game-primary-100 text-game-primary-700 dark:bg-game-primary-900 dark:text-game-primary-300 cursor-pointer hover:bg-game-primary-200 dark:hover:bg-game-primary-800';
      }
    } else {
      classes +=
        'border-dashed border-gray-400 bg-white text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:border-game-primary-400 hover:bg-game-primary-50 dark:hover:bg-game-primary-900';
      if (showHintSpeaker) {
        classes += ' cursor-pointer';
      }
    }

    return classes;
  };

  const getTitle = () => {
    if (syllable) return 'Click to remove';
    if (showHintSpeaker) return 'Click to hear syllable pronunciation';
    return undefined;
  };

  return (
    <div className="relative inline-block">
      <div
        className={getSlotClasses()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        title={getTitle()}
      >
        {syllable || placeholder}
        {syllable && <span className="ml-1 text-xs opacity-60">✕</span>}
      </div>
      {showHintSpeaker && !syllable && (
        <button
          className={`absolute -right-2 -top-1 rounded-full p-1 text-xs transition-colors ${
            isSpeaking
              ? 'bg-game-primary-500 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-game-primary-100 hover:text-game-primary-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-game-primary-800 dark:hover:text-game-primary-300'
          }`}
          onClick={e => {
            e.stopPropagation();
            onSyllableSpeak();
          }}
          title="Play syllable pronunciation"
        >
          🔊
        </button>
      )}
    </div>
  );
};
