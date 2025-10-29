import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
} from 'react';
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
} from '@dnd-kit/core';
import type { GameComponent } from '../../common/game-type';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { useHintState } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import type { WordDef } from '../../words';
import { useMultiChoiceState } from './multiple-choice-state';
import { useSetTimeout } from '../../hooks/use-setTimeout';
import { pubSub } from '../../util/pub-sub';

interface DroppableSlotProps {
  id: string;
  isOver: boolean;
  children: ReactNode;
  isCorrect?: boolean | null;
}

const DroppableSlot = ({ children, isOver, isCorrect }: DroppableSlotProps) => {
  const isEmpty = !children;
  const timer = useSetTimeout();

  return (
    <span
      onAnimationEnd={() => {
        timer(() => {
          pubSub.publish('Animation:End');
        }, 500);
      }}
      className={`inline-flex min-w-16 items-center justify-center px-2 py-1 transition-all duration-300 ease-out ${
        isEmpty
          ? `border-b-2 border-dashed border-gray-300 dark:border-gray-600 ${
              isOver
                ? 'scale-105 border-dashed border-game-primary-400 bg-game-primary-500/10'
                : 'border-dashed hover:border-gray-400 dark:hover:border-gray-500'
            }`
          : `rounded-md border bg-transparent px-3 py-1 ${
              isCorrect === true
                ? 'success-border border-dashed text-game-success-600 dark:text-game-success-400'
                : isCorrect === false
                  ? 'border-dashed border-game-error-500 text-game-error-600 dark:text-game-error-400'
                  : 'border-dashed border-game-primary-500 text-game-primary-600 dark:text-game-primary-400'
            }`
      }`}
    >
      {isEmpty ? (
        <span className="select-none text-xs font-medium text-gray-400 dark:text-gray-500">
          {isOver ? '✨' : '___'}
        </span>
      ) : (
        children
      )}
    </span>
  );
};

interface DraggableOptionProps {
  id: string;
  option: string;
  isDragging: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const DraggableOption = ({
  option,
  onSelect,
  isDragging,
  disabled,
}: DraggableOptionProps) => {
  return (
    <div
      className={`relative cursor-pointer select-none overflow-hidden rounded-lg border p-3 text-center font-medium shadow-sm transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
        isDragging
          ? 'rotate-2 scale-110 opacity-50'
          : 'cursor-grab border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100 active:cursor-grabbing dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      onClick={onSelect}
      draggable
    >
      <span className="relative">{option}</span>
    </div>
  );
};

const UsageSentence = ({
  usage,
  droppedOption,
  isCorrect,
}: {
  usage: string;
  droppedOption: string | null;
  isCorrect: boolean | null;
}) => {
  const words = usage.split(' ');

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-4 text-lg shadow-sm dark:border-gray-600 dark:bg-gray-800">
      {words.map((word, index) => {
        if (word.includes('___')) {
          const beforeBlank = word.split('___')[0];
          const afterBlank = word.split('___')[1];

          return (
            <span key={index} className="flex items-center">
              {beforeBlank && (
                <span className="text-gray-700 dark:text-gray-300">
                  {beforeBlank}
                </span>
              )}
              <DroppableSlot
                id={`slot-${index}`}
                isOver={false}
                isCorrect={isCorrect}
              >
                {droppedOption && (
                  <span className="relative font-bold tracking-wide text-white drop-shadow-sm">
                    {droppedOption}
                  </span>
                )}
              </DroppableSlot>
              {afterBlank && (
                <span className="text-gray-700 dark:text-gray-300">
                  {afterBlank}
                </span>
              )}
            </span>
          );
        } else {
          // Regular word
          return (
            <span key={index} className="text-gray-700 dark:text-gray-300">
              {word}
            </span>
          );
        }
      })}
    </div>
  );
};

interface MultiOptionGameProps {
  wordDef: WordDef;
  setDisableChecking: (disabled: boolean) => void;
  numberOfOptions: number;
}

const MultiOptionGame = forwardRef<
  { isCorrect: () => boolean },
  MultiOptionGameProps
>(({ wordDef, setDisableChecking, numberOfOptions }, ref) => {
  const { state, setDroppedOption, setIsCorrect, setNewWord } =
    useMultiChoiceState(numberOfOptions);
  const hintState = useHintState();
  const { speak, isPlaying, isSupported } = useSpellingSpeech();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor)
  );

  useImperativeHandle(ref, () => {
    return {
      isCorrect: () => {
        if (!state.droppedOption || !wordDef) {
          setIsCorrect(false);
          return false;
        }

        const isWordCorrect =
          state.droppedOption.toLowerCase() === wordDef.word.toLowerCase();
        setIsCorrect(isWordCorrect);
        return isWordCorrect;
      },
    };
  });

  useEffect(() => {
    if (wordDef) {
      setNewWord(wordDef);
    }
  }, [setNewWord, wordDef]);

  useEffect(() => {
    setDisableChecking(!state.droppedOption);
  }, [setDisableChecking, state.droppedOption]);

  const playAudio = () => {
    if (wordDef) {
      speak(wordDef.word);
    }
  };

  const handleOptionSelect = (option: string) => {
    setDroppedOption(option);
  };

  const handleDragStart = (_event: DragStartEvent) => {
    // Handle drag start if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle drop logic
      const droppedOption = active.id as string;
      setDroppedOption(droppedOption);
    }
  };

  if (!wordDef || !state.selectedUsage) {
    return (
      <div className="relative w-full max-w-md px-4 text-center">
        <p className="text-game-secondary-600 dark:text-game-secondary-400">
          Loading word options...
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full max-w-2xl px-4 text-center">
        <div className="mb-4">
          <div className="mb-6 text-center">
            {!isSupported && (
              <p className="mb-2 text-sm text-game-secondary-400">
                ⚠️ Audio not supported in this browser
              </p>
            )}
            <div className="flex justify-center gap-3">
              <Speaker onSpeak={playAudio} isPlaying={isPlaying} />
            </div>
          </div>

          {hintState.currentHint > 0 ? <Syllable wordDef={wordDef} /> : null}

          <div className="mb-8">
            <UsageSentence
              usage={state.selectedUsage}
              droppedOption={state.droppedOption}
              isCorrect={state.isCorrect}
            />
          </div>

          <div className="mb-8">
            <h4 className="text-md mb-4 font-medium text-gray-700 dark:text-gray-300">
              Choose the correct spelling:
            </h4>
            <div className="flex flex-wrap justify-start gap-4">
              {state.options.map((option, idx) => (
                <DraggableOption
                  key={idx}
                  disabled={state.isCorrect === true}
                  id={option}
                  option={option}
                  isDragging={false}
                  onSelect={() => handleOptionSelect(option)}
                />
              ))}
            </div>
          </div>

          {state.isCorrect !== null && (
            <div className="mt-6 text-center">
              {state.isCorrect ? (
                <div className="rounded-xl border border-game-success-500/40 bg-game-success-500/10 p-4 backdrop-blur-sm">
                  <p className="text-lg font-semibold text-game-success-300">
                    🎉 Awesome! That's correct! 🎉
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-game-error-500/40 bg-game-error-500/10 p-4 backdrop-blur-sm">
                  <p className="text-base font-medium text-game-error-300">
                    😊 Try again! You've got this! 💪
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>{/* Render dragging overlay if needed */}</DragOverlay>
    </DndContext>
  );
});

const withOptionHoc = (numberOfOptions: number): GameComponent => {
  return forwardRef<
    { isCorrect: () => boolean },
    Omit<MultiOptionGameProps, 'numberOfOptions'>
  >((props, ref) => (
    <MultiOptionGame {...props} numberOfOptions={numberOfOptions} ref={ref} />
  ));
};

export const FourOptionGame = withOptionHoc(4);
export const TwoOptionGame = withOptionHoc(2);
