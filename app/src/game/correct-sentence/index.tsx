import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameComponent } from '../../common/game-type';
import type { WordUsage } from '../../words';
import { useSpellingSpeech } from '../../hooks';
import { useCorrectSentenceState } from './correct-sentence-state';
import {
  successSoundManager,
  SuccessAnimationType,
} from '../../util/soundManager';

export const CorrectSentenceGame: GameComponent<WordUsage> = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const { state, selectAnswer, setIsCorrect, setNewWord } =
      useCorrectSentenceState();

    const { speak } = useSpellingSpeech();

    useImperativeHandle(ref, () => {
      return {
        getCorrectState: () => {
          if (!state.selectedAnswer || !state.currentQuestion) {
            return 'INCORRECT';
          }
          const isAnswerCorrect =
            state.selectedAnswer === state.currentQuestion.correctAnswer;
          setIsCorrect(isAnswerCorrect);
          if (isAnswerCorrect) {
            successSoundManager.playSuccess(SuccessAnimationType.GENERIC, 1);
          }
          return isAnswerCorrect ? 'CORRECT' : 'INCORRECT';
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
          <p className="text-orange-600">Loading question...</p>
        </div>
      );
    }

    return (
      <div className="relative w-full max-w-2xl px-4 text-center">
        <div className="mb-4">
          {/* Word pronunciation */}
          <div className="mb-6">
            <p className="mb-2 text-lg text-gray-300">
              Choose the correct sentence for:{' '}
            </p>
            <span
              className="cursor-pointer text-2xl font-bold uppercase text-yellow-400 hover:text-yellow-300"
              onClick={playAudio}
            >
              {wordDef.word}
            </span>
          </div>

          {/* Question prompt */}
          <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <p className="text-lg font-medium text-purple-300">
              {state.currentQuestion.question}
            </p>
          </div>

          {/* Answer options */}
          <div className="mx-auto mb-6 grid max-w-2xl grid-cols-1 gap-3">
            {state.currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                  state.selectedAnswer === option
                    ? state.isCorrect === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : state.isCorrect === false
                        ? option === state.currentQuestion?.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-ui-primary bg-indigo-50 text-ui-primary'
                    : state.isCorrect !== null &&
                        option === state.currentQuestion?.correctAnswer
                      ? 'border-gray-300 bg-white text-ui-text hover:border-gray-400 hover:bg-gray-50'
                      : 'border-gray-300 bg-white text-ui-text hover:border-gray-400 hover:bg-gray-50'
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

CorrectSentenceGame.displayName = 'CorrectSentenceGame';
