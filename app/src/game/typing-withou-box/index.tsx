import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Keyboard } from '../../components/atoms/Keyboard';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { useHintState } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { useTypingState } from './typing-without-box-state';
import type { GameComponent } from '../../common/game-type';
import { TypingInput } from '../../components/organisms/SpellingInput/TypingInput';
import { getGameState } from '../../common/game-ref';
import {
  SuccessAnimationType,
  successSoundManager,
} from '../../util/soundManager';
import { SpellingInput } from '../../components/organisms/SpellingInput/KeyboardInput';

export const TypingWithoutBox: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking, skipToNext }, ref) => {
    const { state, setIsCorrect, setUserInput, setNewWord } = useTypingState();

    const hintState = useHintState();

    const { speak, isPlaying, isSupported } = useSpellingSpeech();

    useImperativeHandle(ref, () => {
      return {
        getCorrectState: () => {
          const gameState = getGameState(
            state.userInput.split(''),
            wordDef.actualSyllable
          );
          if (gameState === 'CORRECT') {
            successSoundManager.playSuccess(SuccessAnimationType.GENERIC, 1);
            setIsCorrect(true);
          } else if (gameState === 'INCORRECT' || gameState === 'SO_CLOSE') {
            if (state.incorrectAttempts + 1 >= state.maxAttempts) {
              skipToNext();
            }
            setIsCorrect(false);
          }
          return gameState;
        },
      };
    });

    useEffect(() => {
      setNewWord(wordDef);
    }, [setNewWord, wordDef]);

    useEffect(() => {
      setDisableChecking(state.userInput.length === 0);
    }, [setDisableChecking, state.userInput]);

    const handleKeyPress = (key: string) => {
      if (key === '⌫') {
        const newInput = state.userInput.slice(0, -1);
        setUserInput(newInput);
        return;
      }

      const newInput = state.userInput + key;
      setUserInput(newInput);
    };

    const playAudio = () => {
      speak(wordDef.word);
    };

    return (
      <div className="relative w-full max-w-md px-4 text-center">
        <div className="mb-4">
          <div className="mb-6 text-center">
            {!isSupported && (
              <p className="mb-2 text-sm text-yellow-400">
                ⚠️ Audio not supported in this browser
              </p>
            )}
            <div className="flex justify-center gap-3">
              <Speaker onSpeak={playAudio} isPlaying={isPlaying} />
            </div>
          </div>

          {hintState.currentHint > 0 ? (
            <Syllable wordDef={wordDef} />
          ) : (
            <Definition definition={wordDef.definition} />
          )}

          <TypingInput
            userInput={state.userInput.split('')}
            disableTalkBack={false}
            wordDef={wordDef}
            isCorrect={state.isCorrect}
            className="mb-8"
          />

          {state.revealAnswer && (
            <div className="mb-4 flex flex-col items-center gap-2">
              <div>
                <SpellingInput
                  userInput={wordDef.word.split('')}
                  isCorrect={false}
                  wordDef={wordDef}
                  disableTalkBack={true}
                />
              </div>
            </div>
          )}

          <Keyboard onKeyPress={handleKeyPress} />
        </div>
      </div>
    );
  }
);
