import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameRef, AnswerState } from './common/game-ref';
import { type GameComponent, type GameType } from './common/game-type';
import { Continue } from './components/atoms/continue';
import { Footer } from './components/atoms/footer';
import { ProgressWithTimer, type TimerRef } from './components/atoms/Progress';
import { Avatar } from './components/organisms/avatar/avatar';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { TypingWithBox } from './game/typing-with-box';
import { JumbledWordGame } from './game/jumbled-word/index';
import { SyllableGame } from './game/syllabi';
import { TypingWithoutBox } from './game/typing-withou-box';
import { VoiceTypingGame } from './game/voice-typing';
import { useLocalStorageState } from './hooks/use-local-storage-state';
import { type GameSequenceType } from './words';
import { FourOptionGame, TwoOptionGame } from './game/multiple-choice';
import { useSetTestMode } from './context/hint-context';
import { ContextGame } from './game/context';
import { CorrectSentenceGame } from './game/correct-sentence';
import { CheckButton } from './components/atoms/check-button';
import { useOnTestModeChange } from './context/hint-context/index';
import { StreakAnimation } from './components/atoms/streak-animation';
import { useSteak } from './hooks/use-steak';
import { pubSub } from './util/pub-sub';
import { useSetTimeout } from './hooks/use-setTimeout';
import { CompletedAnimation } from './components/atoms/completed-animation';

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
  } = useGameState(gameSequence);

  const [disableChecking, setDisableChecking] = useState(true);
  const { streak, incrementStreak, resetStreak, stopAnimation } = useSteak();
  const stopStreakTimer = useSetTimeout();
  const publishStreakEndTimer = useSetTimeout();

  const [soundEnabled, setSoundEnabled] = useLocalStorageState<boolean>(
    'SOUND_ENABLED',
    true
  );

  const Component = ComponentMap[gameMode];
  const onCheckAnswer = useCallback((): AnswerState => {
    const state = gameRef.current?.getCorrectState();
    if (state === 'CORRECT') {
      timerRef.current?.stopTimer();
      setCanContinue(true);
      incrementStreak();
    } else {
      resetStreak();
    }
    return state ?? 'UNANSWERED';
  }, [setCanContinue, timerRef, incrementStreak, resetStreak]);

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
        <Footer isSuccess={canContinue}>
          {canContinue ? (
            <Continue
              disabled={!canContinue || streak.isPlaying}
              onClick={moveToNextWord}
            />
          ) : (
            <CheckButton
              onCheckAnswer={onCheckAnswer}
              disableChecking={disableChecking}
            />
          )}
        </Footer>
      }
    >
      <StreakAnimation
        streak={streak}
        onDone={() => {
          stopStreakTimer(() => {
            stopAnimation();
            publishStreakEndTimer(() => {
              pubSub.publish('Streak:End');
            }, 500);
          }, 500);
        }}
      />
      <CompletedAnimation isCompleted={gameState === 'COMPLETED'} />
      {gameState === 'IN_PROGRESS' ? (
        <Component
          ref={gameRef}
          wordDef={gameSequence[currentWordIndex].def}
          setDisableChecking={setDisableChecking}
        />
      ) : null}
    </Layout>
  );
};
