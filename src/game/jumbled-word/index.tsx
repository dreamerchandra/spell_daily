import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameComponent } from '../../common/game-type';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { JumbledInput } from '../../components/organisms/SpellingInput/JumbledInput';
import { showSyllable } from '../../components/organisms/SpellingInput/utils';
import { useHintState } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { useJumbledWordState } from './jumbled-word-state';

export const JumbledWordGame: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, updateInputAndAvailable, setIsCorrect, setNewWord } =
      useJumbledWordState();

    const hintState = useHintState();

    const { speak, isPlaying, isSupported } = useSpellingSpeech();

    useImperativeHandle(ref, () => {
      return {
        isCorrect: () => {
          const userWord = state.userInput.join('');
          const isWordCorrect = userWord === wordDef.word;
          setIsCorrect(isWordCorrect);
          return isWordCorrect;
        },
      };
    });

    useEffect(() => {
      setNewWord(wordDef);
    }, [setNewWord, wordDef]);

    useEffect(() => {
      setDisableChecking(state.userInput.includes(''));
    }, [setDisableChecking, state.userInput]);

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

          <JumbledInput
            userInput={state.userInput}
            availableLetters={state.availableLetters}
            isCorrect={state.isCorrect}
            className="mb-8"
            wordDef={wordDef}
            showSyllableColors={showSyllable(hintState.currentHint)}
            onUserInputChange={updateInputAndAvailable}
          />

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
    );
  }
);
