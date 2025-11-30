import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnswerState, GameRef } from './common/game-ref';
import { type GameComponent, type GameType } from './common/game-type';
import { CompletedAnimation } from './components/atoms/completed-animation';
import { Footer } from './components/atoms/footer';
import { FooterButton } from './components/atoms/footer-button';
import { ProgressWithTimer, type TimerRef } from './components/atoms/Progress';
import { StreakAnimation } from './components/atoms/streak-animation';
import { Avatar } from './components/organisms/avatar/avatar';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { useSetTestMode } from './context/hint-context';
import { useOnTestModeChange } from './context/hint-context/index';
import { ContextGame } from './game/context';
import { CorrectSentenceGame } from './game/correct-sentence';
import { JumbledWordGame } from './game/jumbled-word/index';
import { FourOptionGame, TwoOptionGame } from './game/multiple-choice';
import { SyllableGame } from './game/syllabi';
import { TypingWithBox } from './game/typing-with-box';
import { TypingWithoutBox } from './game/typing-withou-box';
import { VoiceTypingGame } from './game/voice-typing';
import { useLocalStorageState } from './hooks/use-local-storage-state';
import { useSetTimeout } from './hooks/use-setTimeout';
import { useSteak } from './hooks/use-steak';
import { type GameSequenceType } from './words';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComponentMap: Record<GameType, GameComponent<any>> = {
  typingWithBox: TypingWithBox,
  syllable: SyllableGame,
  voiceTyping: VoiceTypingGame,
  jumbled: JumbledWordGame,
  fourOption: FourOptionGame,
  twoOption: TwoOptionGame,
  typingWithoutBox: TypingWithoutBox,
  context: ContextGame,
  correctSentence: CorrectSentenceGame,
} as const;

type GameState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

const useGameState = (gameSequence: GameSequenceType) => {
  const [gameState, setGameState] = useState<GameState>('NOT_STARTED');
  const [answerState, setAnswerState] = useState<AnswerState>('UNANSWERED');

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [canContinue, setCanContinue] = useState(false);
  const gameMode = gameSequence[currentWordIndex].mode;
  const timerRef = useRef<TimerRef>(null);
  const setTestMode = useSetTestMode();
  const isTestMode = gameSequence[currentWordIndex].isTestMode;
  const testTimerSeconds = gameSequence[currentWordIndex].testTimerSeconds;
  useEffect(() => {
    if (gameState === 'NOT_STARTED') return;
    if (isTestMode) {
      setTestMode(true);
      timerRef.current?.startTimer(testTimerSeconds);
    } else {
      setTestMode(false);
      timerRef.current?.stopTimer();
    }
  }, [isTestMode, setTestMode, gameState, testTimerSeconds]);
  const endGame = useCallback(() => {
    setGameState('COMPLETED');
    setCanContinue(false);
    timerRef.current?.stopTimer();
  }, []);
  const moveToNextWord = useCallback(() => {
    setAnswerState('UNANSWERED');
    if (currentWordIndex === gameSequence.length - 1) {
      endGame();
      return;
    }
    setCurrentWordIndex(prev => prev + 1);
    setCanContinue(false);
  }, [currentWordIndex, gameSequence.length, endGame]);

  return {
    currentWordIndex,
    gameMode,
    canContinue,
    setCanContinue,
    timerRef,
    gameState,
    setGameState,
    moveToNextWord,
    isTestMode,
    answerState,
    setAnswerState,
  };
};

export const Game = ({ gameSequence }: { gameSequence: GameSequenceType }) => {
  const gameRef = useRef<GameRef>(null);
  const {
    gameMode,
    canContinue,
    setCanContinue,
    moveToNextWord,
    currentWordIndex,
    gameState,
    timerRef,
    setGameState,
    isTestMode,
    answerState,
    setAnswerState,
  } = useGameState(gameSequence);

  const [disableChecking, setDisableChecking] = useState(true);
  const {
    streak,
    incrementStreak,
    resetStreak,
    stopAnimation,
    startAnimation,
  } = useSteak();
  const stopStreakTimer = useSetTimeout();

  const [soundEnabled, setSoundEnabled] = useLocalStorageState<boolean>(
    'SOUND_ENABLED',
    true
  );

  const Component = ComponentMap[gameMode];
  const setContinueState = useCallback(() => {
    timerRef.current?.stopTimer();
    setCanContinue(true);
  }, [setCanContinue, timerRef]);
  const onCheckAnswer = useCallback((): AnswerState => {
    const state = gameRef.current?.getCorrectState();
    setAnswerState(state ?? 'UNANSWERED');
    if (state === 'CORRECT') {
      setContinueState();
      incrementStreak();
    } else {
      resetStreak();
    }
    return state ?? 'UNANSWERED';
  }, [setAnswerState, setContinueState, incrementStreak, resetStreak]);

  useOnTestModeChange(enabled => {
    if (enabled) {
      timerRef.current?.startTimer(
        gameSequence[currentWordIndex].testTimerSeconds
      );
    } else {
      timerRef.current?.stopTimer();
    }
  });

  const onTimeUp = useCallback(() => {
    Avatar.show({
      text: "Time is up! Let's try the next word.",
      yesText: 'Next',
      onYes: () => {
        moveToNextWord();
      },
    });
  }, [moveToNextWord]);

  useEffect(() => {
    Avatar.show({
      text: 'Hiii! I can guide you through learning spelling!',
      yesText: "🎉 Let's go!",
      onYes: () => {
        setGameState('IN_PROGRESS');
      },
    });
  }, [setGameState]);

  useEffect(() => {
    if (currentWordIndex === 0) return;
    if (currentWordIndex % 2 === 0) {
      Avatar.changeCharacter('by_rating/4');
    } else {
      Avatar.changeCharacter('by_rating/3');
    }
  }, [currentWordIndex]);

  return (
    <Layout
      removeHeaderFooter={gameState === 'COMPLETED'}
      header={
        <Header
          ProgressComponent={
            <ProgressWithTimer
              score={currentWordIndex + 1}
              total={gameSequence.length}
              ref={timerRef}
              disableTimer={!isTestMode}
              onTimeUp={onTimeUp}
            />
          }
          soundEnabled={soundEnabled}
          onSoundToggle={setSoundEnabled}
        />
      }
      footer={
        <Footer
          isSuccess={answerState === 'CORRECT'}
          onAnimationComplete={useCallback(() => {
            if (streak.isStreakScheduled) {
              startAnimation();
            }
          }, [streak.isStreakScheduled, startAnimation])}
        >
          <FooterButton
            answerState={answerState}
            onClickContinue={() => {
              if (streak.isStreakScheduled) {
                return startAnimation();
              }
              moveToNextWord();
            }}
            canContinue={canContinue}
            disableContinue={!canContinue || streak.isPlaying}
            onCheckAnswer={onCheckAnswer}
            disableChecking={disableChecking}
          />
        </Footer>
      }
    >
      <StreakAnimation
        streak={streak}
        onDone={() => {
          stopStreakTimer(() => {
            stopAnimation();
            moveToNextWord();
          }, 500);
        }}
      />
      <CompletedAnimation isCompleted={gameState === 'COMPLETED'} />
      {gameState === 'IN_PROGRESS' ? (
        <Component
          ref={gameRef}
          wordDef={gameSequence[currentWordIndex].def}
          setDisableChecking={setDisableChecking}
          skipToNext={setContinueState}
        />
      ) : null}
    </Layout>
  );
};
