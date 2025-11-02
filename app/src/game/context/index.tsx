import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameComponent } from '../../common/game-type';
import type { WordUsage } from '../../words';
import { useSpellingSpeech } from '../../hooks';
import { useContextState } from './context-state';
import {
  successSoundManager,
  SuccessAnimationType,
} from '../../util/soundManager';

export const ContextGame: GameComponent<WordUsage> = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, selectAnswer, setIsCorrect, setNewWord } = useContextState();

    const { speak } = useSpellingSpeech();

    useImperativeHandle(ref, () => {
      return {
        isCorrect: () => {
          if (!state.selectedAnswer || !state.currentQuestion) {
            return false;
          }
          const isAnswerCorrect =
            state.selectedAnswer === state.currentQuestion.correctAnswer;
          setIsCorrect(isAnswerCorrect);
          if (isAnswerCorrect) {
            successSoundManager.playSuccess(SuccessAnimationType.GENERIC, 1);
          }
          return isAnswerCorrect;
        },
      };
    });

    useEffect(() => {
      setNewWord(wordDef);
    }, [setNewWord, wordDef]);

    useEffect(() => {
      setDisableChecking(state.selectedAnswer === null);
    }, [setDisableChecking, state.selectedAnswer]);

    const playAudio = () => {
      speak(wordDef.word);
    };

    const handleAnswerSelect = (answer: string) => {
      selectAnswer(answer);
    };

    if (!state.currentQuestion) {
      return (
        <div className="relative w-full max-w-md px-4 text-center">
          <p className="text-game-secondary-600 dark:text-game-secondary-400">
            Loading context question...
          </p>
        </div>
      );
    }

    return (
      <div className="relative w-full max-w-2xl px-4 text-center">
        <div className="mb-4">
          <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="mb-2 text-lg font-medium text-blue-300">
              Read this sentence:
            </p>
            <p className="text-xl font-semibold italic text-white">
              "{state.currentQuestion.sentence}"
            </p>
          </div>

          {/* Question prompt */}
          <div className="mb-6">
            <p className="mb-4 text-lg text-gray-300">
              What does{' '}
              <span
                className="font-bold uppercase text-yellow-400"
                onClick={playAudio}
              >
                {wordDef.word}
              </span>{' '}
              mean in this sentence?
            </p>
          </div>

          {/* Answer options */}
          <div className="mx-auto mb-6 grid max-w-lg grid-cols-1 gap-3">
            {state.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                  state.selectedAnswer === option
                    ? state.isCorrect === true
                      ? 'border-green-500/50 bg-green-500/20 text-green-300'
                      : state.isCorrect === false
                        ? option === state.currentQuestion?.correctAnswer
                          ? 'border-green-500/50 bg-green-500/20 text-green-300'
                          : 'border-red-500/50 bg-red-500/20 text-red-300'
                        : 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                    : state.isCorrect !== null &&
                        option === state.currentQuestion?.correctAnswer
                      ? 'border-gray-500/30 bg-gray-500/10 text-gray-300 hover:border-gray-500/50 hover:bg-gray-500/20'
                      : 'border-gray-500/30 bg-gray-500/10 text-gray-300 hover:border-gray-500/50 hover:bg-gray-500/20'
                } ${state.isCorrect !== null ? 'cursor-default' : 'cursor-pointer'} `}
                disabled={state.isCorrect !== null}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>{' '}
                {option}
              </button>
            ))}
          </div>

          {/* Result feedback */}
          {state.isCorrect !== null && (
            <div className="mt-6 text-center">
              {state.isCorrect ? null : (
                <div className="rounded-xl border border-game-error-500/40 bg-game-error-500/10 p-4 backdrop-blur-sm">
                  <p className="text-base font-medium text-game-error-300">
                    😊 Not quite right. Try again! 💪
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

ContextGame.displayName = 'ContextGame';
