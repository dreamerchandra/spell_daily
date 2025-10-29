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
import { useFourOptionState } from './four-option-state';

interface DroppableSlotProps {
  id: string;
  isOver: boolean;
  children: ReactNode;
}

const DroppableSlot = ({ children, isOver }: DroppableSlotProps) => {
  const isEmpty = !children;

  return (
    <span
      className={`inline-flex min-w-16 items-center justify-center px-2 py-1 transition-all duration-300 ease-out ${
        isEmpty
          ? `border-b-2 border-dashed border-game-primary-300 ${
              isOver
                ? 'scale-105 border-game-primary-400 bg-game-primary-500/10'
                : 'hover:border-game-primary-400'
            }`
          : `rounded-md bg-primary-gradient px-3 py-1 shadow-md`
      }`}
    >
      {isEmpty ? (
        <span className="select-none text-xs font-medium text-game-primary-300">
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
}

const DraggableOption = ({
  option,
  onSelect,
  isDragging,
}: DraggableOptionProps) => {
  return (
    <div
      className={`relative cursor-pointer select-none overflow-hidden rounded-2xl border border-dark-600 bg-gradient-to-br from-dark-800 to-dark-700 p-4 text-center font-semibold shadow-lg backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 hover:border-game-primary-500 hover:shadow-xl hover:shadow-game-primary-500/20 active:scale-95 active:shadow-md ${
        isDragging ? 'rotate-2 scale-110 opacity-50' : ''
      }`}
      onClick={onSelect}
      draggable
    >
      <div className="absolute inset-0 bg-gradient-to-br from-game-primary-500/5 to-game-secondary-500/5 opacity-0 transition-opacity hover:opacity-100" />
      <span className="relative text-white drop-shadow-sm">{option}</span>
    </div>
  );
};

const UsageSentence = ({
  usage,
  droppedOption,
}: {
  usage: string;
  droppedOption: string | null;
}) => {
  const words = usage.split(' ');

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-1 rounded-xl border-2 border-dark-600 bg-gradient-to-r from-dark-800/80 to-dark-700/80 p-4 text-lg backdrop-blur-sm">
      {words.map((word, index) => {
        if (word.includes('___')) {
          const beforeBlank = word.split('___')[0];
          const afterBlank = word.split('___')[1];

          return (
            <span key={index} className="flex items-center">
              {beforeBlank && (
                <span className="text-white/90">{beforeBlank}</span>
              )}
              <DroppableSlot id={`slot-${index}`} isOver={false}>
                {droppedOption && (
                  <span className="relative font-bold tracking-wide text-white drop-shadow-sm">
                    {droppedOption}
                  </span>
                )}
              </DroppableSlot>
              {afterBlank && (
                <span className="text-white/90">{afterBlank}</span>
              )}
            </span>
          );
        } else {
          // Regular word
          return (
            <span key={index} className="text-white/90">
              {word}
            </span>
          );
        }
      })}
    </div>
  );
};

export const FourOptionGame: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, setDroppedOption, setIsCorrect, setNewWord } =
      useFourOptionState();
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
      return <div>Loading...</div>;
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
              />
            </div>

            <div className="mb-8">
              <h4 className="text-md mb-4 font-medium text-white/90">
                Choose the correct spelling:
              </h4>
              <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
                {state.options.map(option => (
                  <DraggableOption
                    key={option}
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
  }
);
