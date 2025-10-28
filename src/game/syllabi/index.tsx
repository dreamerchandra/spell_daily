import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameRef } from '../../common/game-ref';
import { Definition } from '../../components/atoms/hints/definition';
import {
  useNextHint,
  useOnHintIncrease,
} from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import type { WordDef } from '../../words';
import { useSyllableState } from './syllable-state';
import { Avatar } from '../../components/organisms/avatar/avatar';
import { Speaker } from '../../components/atoms/speaker';
import { SyllableGroup } from './syllable-group';
import { DroppableSlot } from './droppable-slot';

export const SyllableGame = forwardRef<
  GameRef,
  { wordDef: WordDef; setDisableChecking: (disable: boolean) => void }
>(({ wordDef, setDisableChecking }, ref) => {
  const {
    state,
    selectSyllable,
    setIsCorrect,
    resetSelection,
    removeSyllable,
    setNewWord,
  } = useSyllableState();
  const nextHint = useNextHint();

  useOnHintIncrease(() => {
    if (state.incorrectAttempts === 0) return;
    const firstMisspelled = wordDef.actualSyllable.findIndex(
      (syllable, index) => {
        return state.selectedSyllables[index] !== syllable;
      }
    );
    if (firstMisspelled === -1) return;

    for (let i = firstMisspelled; i < wordDef.actualSyllable.length; i++) {
      removeSyllable(i);
    }
  });

  useEffect(() => {
    if (state.incorrectAttempts === 0) return;
    const isEvenAttempt = state.incorrectAttempts % 2 === 0;
    if (isEvenAttempt) {
      Avatar.show({
        text: 'Want some hint?',
        yesText: 'Yes, please!',
        noText: 'No, I got this!',
        onYes: () => {
          nextHint();
        },
      });
    } else {
      Avatar.changeCharacter('by_rating/1');
    }
  }, [nextHint, state.incorrectAttempts, wordDef.word]);

  const { speak, isPlaying, isSupported } = useSpellingSpeech();

  useImperativeHandle(ref, () => {
    return {
      isCorrect: () => {
        const selectedWord = state.selectedSyllables.join('');
        const correctWord = wordDef.actualSyllable.join('');
        const isWordCorrect = selectedWord === correctWord;
        setIsCorrect(isWordCorrect);
        return isWordCorrect;
      },
    };
  });

  useEffect(() => {
    if (wordDef.syllableOptions && wordDef.syllableOptions.length > 0) {
      setNewWord(wordDef);
    }
  }, [setNewWord, wordDef]);

  useEffect(() => {
    setDisableChecking(state.selectedSyllables.includes(''));
  }, [setDisableChecking, state.selectedSyllables]);

  const playAudio = () => {
    speak(wordDef.word);
  };

  const handleReset = () => {
    resetSelection();
  };

  const handleDragStart = (syllable: string, fromIndex: number) => {
    // Optional: Add visual feedback or logging when drag starts
    console.log(`Dragging syllable "${syllable}" from picker ${fromIndex}`);
  };

  // Don't render if syllableOptions is not available
  if (!wordDef.syllableOptions || wordDef.syllableOptions.length === 0) {
    return (
      <div className="relative w-full max-w-md px-4 text-center">
        <p className="text-game-secondary-600 dark:text-game-secondary-400">
          Syllable options not available for this word.
        </p>
      </div>
    );
  }

  return (
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

        <Definition definition={wordDef.definition} />

        <div className="mb-6 rounded-xl border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Build the word:
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {wordDef.actualSyllable.map((_, index) => (
              <DroppableSlot
                key={index}
                index={index}
                syllable={state.selectedSyllables[index]}
                placeholder={`Part ${index + 1}`}
                onDrop={selectSyllable}
                onRemove={removeSyllable}
                audioSyllable={wordDef.syllable[index]}
                isCorrect={state.isCorrect}
              />
            ))}
          </div>
        </div>

        {/* Syllable groups */}
        <div className="mb-6">
          <SyllableGroup
            allOptions={wordDef.syllableOptions}
            actualSyllables={wordDef.actualSyllable}
            onSelect={selectSyllable}
            selectedSyllables={state.selectedSyllables}
            onDragStart={handleDragStart}
          />
        </div>

        {/* Reset button */}
        {state.selectedSyllables.some(s => s !== '') &&
          state.isCorrect === null && (
            <div className="mb-4">
              <button
                onClick={handleReset}
                className="rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Reset Selection
              </button>
            </div>
          )}

        {state.isCorrect !== null && (
          <div className="mt-6 text-center">
            {state.isCorrect ? (
              <div className="rounded-xl border border-game-success-500/40 bg-game-success-500/10 p-4 backdrop-blur-sm">
                <p className="text-lg font-semibold text-game-success-300">
                  🎉 Excellent! You built the word correctly! 🎉
                </p>
                <p className="mt-2 text-sm text-game-success-400">
                  {wordDef.actualSyllable.join(' + ')} = {wordDef.word}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-game-error-500/40 bg-game-error-500/10 p-4 backdrop-blur-sm">
                <p className="text-base font-medium text-game-error-300">
                  😊 Try again! Look at the syllables carefully! 💪
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SyllableGame.displayName = 'SyllableGame';
