import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { GameComponent } from '../../common/game-type';
import { Definition } from '../../components/atoms/hints/definition';
import { Syllable } from '../../components/atoms/hints/syllable';
import { Speaker } from '../../components/atoms/speaker';
import { SpellingInput } from '../../components/organisms/SpellingInput/KeyboardInput';
import { useHintState } from '../../context/hint-context/index';
import { useSpeechRecognition, useSpellingSpeech } from '../../hooks';
import { useVoiceTypingState } from './voice-typing-state';
import { getGameState } from '../../common/game-ref';
import {
  SuccessAnimationType,
  successSoundManager,
} from '../../util/soundManager';

const VoiceWaveAnimation = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  const bars = [
    { height: 'h-3', delay: '0ms' },
    { height: 'h-5', delay: '100ms' },
    { height: 'h-4', delay: '200ms' },
    { height: 'h-6', delay: '300ms' },
    { height: 'h-4', delay: '400ms' },
    { height: 'h-5', delay: '500ms' },
    { height: 'h-3', delay: '600ms' },
  ];

  return (
    <div className="mb-4 flex h-12 items-end justify-center gap-1">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-1 animate-pulse rounded-full bg-gradient-to-t from-game-primary-600 to-game-primary-400 ${bar.height}`}
          style={{
            animationDelay: bar.delay,
            animationDuration: '800ms',
          }}
        />
      ))}
    </div>
  );
};

const VoiceMicrophoneButton = ({
  isListening,
  isSupported,
  onStart,
  onStop,
  error,
}: {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  error: string | null;
}) => {
  return (
    <div className="mb-6 text-center">
      {!isSupported && (
        <p className="mb-2 text-sm text-game-secondary-400">
          ⚠️ Speech recognition not supported in this browser
        </p>
      )}

      {error && <p className="mb-2 text-sm text-game-error-400">❌ {error}</p>}

      <button
        onClick={isListening ? onStop : onStart}
        disabled={!isSupported}
        className={`relative mx-auto mb-4 flex h-12 w-12 transform items-center justify-center rounded-full text-2xl text-white transition-all duration-200 hover:scale-105 active:scale-95 ${isListening ? 'animate-pulse bg-game-error-500 hover:bg-game-error-600' : 'bg-game-primary-500 hover:bg-game-primary-600'} ${!isSupported ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {isListening ? <>🔴</> : <>🎤</>}
      </button>

      <p className="text-sm text-dark-500">
        {isListening ? 'Listening... Click to stop' : 'Click to say letters'}
      </p>
    </div>
  );
};

export const VoiceTypingGame: GameComponent = forwardRef(
  ({ wordDef, setDisableChecking }, ref) => {
    const {
      state,
      setIsCorrect,
      addCharacter,
      setNewWord,
      setRecognizedText,
      tryAgain,
    } = useVoiceTypingState();
    const hintState = useHintState();
    const {
      speak,
      isPlaying,
      isSupported: speechSupported,
    } = useSpellingSpeech();

    const {
      interimTranscript,
      finalTranscript,
      isListening,
      isSupported: recognitionSupported,
      start: startListening,
      stop: stopListening,
      reset: resetRecognition,
      error,
    } = useSpeechRecognition({
      continuous: false,
      interimResults: true,
    });

    useImperativeHandle(ref, () => {
      return {
        getCorrectState: () => {
          const gameState = getGameState(
            state.userInput,
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
      setNewWord(wordDef);
      resetRecognition();
    }, [setNewWord, wordDef, resetRecognition]);

    // Process speech recognition results
    useEffect(() => {
      if (finalTranscript) {
        const cleanedTranscript = finalTranscript.toUpperCase().trim();
        setRecognizedText(finalTranscript);

        const spaceSeparatedLetters = cleanedTranscript.split(' ');
        if (!spaceSeparatedLetters.every(letter => letter.length === 1)) {
          return;
        }
        spaceSeparatedLetters.forEach(letter => {
          addCharacter(letter);
        });
      }
    }, [finalTranscript, addCharacter, setRecognizedText]);

    useEffect(() => {
      // Disable checking when word is not complete or still listening
      setDisableChecking(state.userInput.includes('') || isListening);
    }, [setDisableChecking, state.userInput, isListening]);

    const handleStartListening = () => {
      resetRecognition();
      setRecognizedText('');
      startListening();
    };

    const handleTryAgain = () => {
      tryAgain();
      resetRecognition();
      startListening();
    };

    const playAudio = () => {
      speak(wordDef.word);
    };

    return (
      <div className="relative w-full max-w-md px-4 text-center">
        <div className="mb-4">
          <div className="mb-6 text-center">
            {!speechSupported && (
              <p className="mb-2 text-sm text-game-secondary-400">
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

          <div className="mb-4 text-center text-xs text-dark-500">
            You can say one letter or multiple letters at once
          </div>

          <SpellingInput
            userInput={state.userInput}
            isCorrect={state.isCorrect}
            className="mb-8"
            wordDef={wordDef}
            disableTalkBack={true}
          />
          <button
            onClick={handleTryAgain}
            disabled={!state.userInput.some(char => char !== '')}
            className="mb-4 rounded-lg bg-game-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-game-primary-600 disabled:cursor-not-allowed disabled:bg-game-primary-300"
          >
            Clear Input
          </button>

          {state.recognizedText && (
            <div className="mb-4 rounded-lg border border-game-primary-400/40 bg-game-primary-400/10 p-3 text-center">
              <div className="mb-1 text-sm text-game-primary-400">
                You said:
              </div>
              <div className="text-lg font-semibold text-white">
                {state.recognizedText}
                {interimTranscript && (
                  <span className="italic text-dark-500">
                    {' '}
                    {interimTranscript} (listening...)
                  </span>
                )}
              </div>
            </div>
          )}

          <VoiceMicrophoneButton
            isListening={isListening}
            isSupported={recognitionSupported}
            onStart={handleStartListening}
            onStop={stopListening}
            error={error}
          />

          <VoiceWaveAnimation isActive={!!interimTranscript} />

          {state.isCorrect !== null && (
            <div className="mt-6 text-center">
              {state.isCorrect ? null : (
                <div className="rounded-xl border border-game-error-500/40 bg-game-error-500/10 p-4 backdrop-blur-sm">
                  <p className="text-base font-medium text-game-error-300">
                    😊 Try again! You've got this! 💪
                  </p>
                  <button
                    onClick={handleTryAgain}
                    className="mt-2 rounded-lg bg-game-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-game-primary-600"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
