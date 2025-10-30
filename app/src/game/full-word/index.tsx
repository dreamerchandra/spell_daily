import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Keyboard } from '../../components/atoms/Keyboard';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { SpellingInput } from '../../components/organisms/SpellingInput/KeyboardInput';
import { useHintState } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { makeArray, useFullWordState } from './full-word-state';
import type { GameComponent } from '../../common/game-type';

export const FullWordGame: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, setIsCorrect, setUserInput, setNewWord } =
      useFullWordState();

    const hintState = useHintState();

    const { speak, isPlaying, isSupported } = useSpellingSpeech();

    const wordLength = wordDef.word.length;

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

    const handleKeyPress = (key: string) => {
      let newWord = state.userInput.join('');
      if (key === '⌫') {
        newWord = newWord.slice(0, newWord.length - 1);
        const newArr = makeArray(newWord, wordLength);
        setUserInput(newArr);
        return;
      }
      if (newWord.length === state.userInput.length) return;
      newWord += key;
      const newArr = makeArray(newWord, wordLength);
      setUserInput(newArr);
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

          <SpellingInput
            userInput={state.userInput}
            isCorrect={state.isCorrect}
            className="mb-8"
            wordDef={wordDef}
            disableTalkBack={false}
          />

          <Keyboard onKeyPress={handleKeyPress} />

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
