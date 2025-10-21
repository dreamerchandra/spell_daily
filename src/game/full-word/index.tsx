import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameRef } from '../../common/game-ref';
import { Button } from '../../components/atoms/Button';
import { Keyboard } from '../../components/atoms/Keyboard';
import { WordInput } from '../../components/atoms/WordInput';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { useHintState, useNextHint } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import type { WordDef } from '../../words';
import { makeArray, useFullWordState } from './full-word-state';
import { Avatar } from '../../components/organisms/avatar/avatar';

export const FullWordGame = forwardRef<
  GameRef,
  { wordDef: WordDef; setDisableChecking: (disable: boolean) => void }
>(({ wordDef, setDisableChecking }, ref) => {
  const { state, setIsCorrect, setUserInput, setNewWord } = useFullWordState();
  const nextHint = useNextHint();

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
  }, [nextHint, setUserInput, state.incorrectAttempts, wordDef.word]);

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
    speak(wordDef.word);
    setNewWord(wordDef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordDef]);

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
            <Button
              onClick={playAudio}
              variant="secondary"
              disabled={isPlaying}
              className={`rounded-full p-3 ${isPlaying ? 'animate-bounce' : ''}`}
            >
              <span className="text-xl">{isPlaying ? '🎤' : '🔊'}</span>
            </Button>
          </div>
        </div>

        {hintState.currentHint > 0 ? (
          <Syllable wordDef={wordDef} />
        ) : (
          <Definition definition={wordDef.definition} />
        )}

        <WordInput
          userInput={state.userInput}
          isCorrect={state.isCorrect}
          className="mb-8"
          wordDef={wordDef}
        />

        <Keyboard onKeyPress={handleKeyPress} className="mb-6 p-2" />

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
});
