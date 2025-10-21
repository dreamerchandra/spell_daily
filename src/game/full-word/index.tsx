import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSpellingSpeech } from '../../hooks';
import { Button } from '../../components/atoms/Button';
import { Keyboard } from '../../components/atoms/Keyboard';
import { WordInput } from '../../components/atoms/WordInput';
import { Syllable } from '../../components/atoms/hints/syllable';
import type { WordDef } from '../../words';
import type { GameRef } from '../../components/common/game-ref';
import { Definition } from '../../components/atoms/hints/definition';
import { useHintState, useResetHint } from '../../context/hint-context/index';

const makeArray = (word: string, wordLength: number) => {
  const returnArr = new Array(wordLength).fill('');
  word.split('').forEach((l, i) => {
    returnArr[i] = l;
  });
  return returnArr;
};

export const FullWordGame = forwardRef<
  GameRef,
  { wordDef: WordDef; setDisableChecking: (disable: boolean) => void }
>(({ wordDef, setDisableChecking }, ref) => {
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const hintState = useHintState();

  const { speak, isPlaying, isSupported } = useSpellingSpeech();

  const wordLength = wordDef.word.length;
  const resetHint = useResetHint();

  useEffect(() => {
    setUserInput(new Array(wordLength).fill(''));
    resetHint(1);
  }, [resetHint, wordDef.word, wordLength]);

  useEffect(() => {
    setDisableChecking(userInput.includes(''));
  }, [setDisableChecking, userInput]);

  const handleKeyPress = (key: string) => {
    let newWord = userInput.join('');
    if (key === '⌫') {
      newWord = newWord.slice(0, newWord.length - 1);
      const newArr = makeArray(newWord, wordLength);
      setUserInput(newArr);
      return;
    }
    if (newWord.length === userInput.length) return;
    newWord += key;
    const newArr = makeArray(newWord, wordLength);
    setUserInput(newArr);
  };

  useImperativeHandle(ref, () => {
    return {
      checkAnswer: () => {
        const userWord = userInput.join('');
        const isWordCorrect = userWord === wordDef.word;
        setIsCorrect(isWordCorrect);
        return isWordCorrect;
      },
    };
  });

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
          userInput={userInput}
          isCorrect={isCorrect}
          className="mb-8"
          wordDef={wordDef}
        />

        <Keyboard onKeyPress={handleKeyPress} className="mb-6 p-2" />

        {isCorrect !== null && (
          <div className="mt-6 text-center">
            {isCorrect ? (
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
