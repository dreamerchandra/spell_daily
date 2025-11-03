import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameComponent } from '../../common/game-type';
import { Definition } from '../../components/atoms/hints/definition';
import { Speaker } from '../../components/atoms/speaker';
import { SyllableInput } from '../../components/organisms/SyllableInput';
import { useOnHintIncrease } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { SyllableGroup } from './syllable-group';
import { useSyllableState } from './syllable-state';
import { getGameState } from '../../common/game-ref';
import {
  SuccessAnimationType,
  successSoundManager,
} from '../../util/soundManager';

export const SyllableGame: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, selectSyllable, setIsCorrect, removeSyllable, setNewWord } =
      useSyllableState();

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

    const { speak, isPlaying, isSupported } = useSpellingSpeech();

    useImperativeHandle(ref, () => {
      return {
        getCorrectState: () => {
          const gameState = getGameState(
            state.selectedSyllables,
            wordDef.actualSyllable
          );
          if (gameState === 'CORRECT') {
            successSoundManager.playSuccess(SuccessAnimationType.GENERIC, 1);
            setIsCorrect(true);
          } else if (gameState === 'INCORRECT' || gameState === 'SO_CLOSE') {
            setIsCorrect(false);
          }
          return gameState;
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

          <SyllableInput
            wordDef={wordDef}
            state={state}
            selectSyllable={selectSyllable}
            removeSyllable={removeSyllable}
          />

          <div className="mb-6">
            {state.isCorrect !== true ? (
              <SyllableGroup
                allOptions={wordDef.syllableOptions}
                actualSyllables={wordDef.actualSyllable}
                onSelect={selectSyllable}
                selectedSyllables={state.selectedSyllables}
                onDragStart={handleDragStart}
              />
            ) : null}
          </div>

          {state.isCorrect !== null && (
            <div className="mt-6 text-center">
              {state.isCorrect ? null : (
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
  }
);

SyllableGame.displayName = 'SyllableGame';
