import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Keyboard } from '../../components/atoms/Keyboard';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { SpellingInput } from '../../components/organisms/SpellingInput/KeyboardInput';
import { useHintState } from '../../context/hint-context/index';
import { useSpellingSpeech } from '../../hooks';
import { makeArray, useFullWordState } from './typing-with-box';
import type { GameComponent } from '../../common/game-type';
import { getGameState } from '../../common/game-ref';

export const TypingWithBox: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking, skipToNext }, ref) => {
    const { state, setIsCorrect, setUserInput, setNewWord } =
      useFullWordState();

    const hintState = useHintState();

    const { speak, isPlaying, isSupported } = useSpellingSpeech();

    const wordLength = wordDef.word.length;
    const lastAttempt = state.attempts[state.attempts.length - 1];

    useImperativeHandle(ref, () => {
      return {
        getCorrectState: () => {
          const gameState = getGameState(
            lastAttempt.userInput,
            wordDef.actualSyllable
          );
          if (gameState === 'CORRECT') {
            setIsCorrect(true);
          } else if (gameState === 'INCORRECT') {
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
      const lastAttempt = state.attempts[state.attempts.length - 1];
      setDisableChecking(lastAttempt.userInput.includes(''));
    }, [setDisableChecking, state.attempts]);

    const handleKeyPress = (key: string) => {
      let newWord = lastAttempt.userInput.join('');
      if (key === '⌫') {
        newWord = newWord.slice(0, newWord.length - 1);
        const newArr = makeArray(newWord, wordLength);
        setUserInput(newArr);
        return;
      }
      if (newWord.length === lastAttempt.userInput.length) return;
      newWord += key;
      const newArr = makeArray(newWord, wordLength);
      setUserInput(newArr);
    };

    const playAudio = () => {
      speak(wordDef.word);
    };

    const lastTwoAttempts = state.attempts.slice(-2);
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

          <div className="mb-4 flex flex-col items-center gap-2">
            {lastTwoAttempts.map((attempt, index) => (
              <div key={index}>
                <SpellingInput
                  userInput={attempt.userInput}
                  isCorrect={attempt.isCorrect}
                  wordDef={wordDef}
                  disableTalkBack={true}
                />
              </div>
            ))}
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
          </div>
          <Keyboard onKeyPress={handleKeyPress} />
        </div>
      </div>
    );
  }
);
