import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameRef, GameState } from './common/game-ref';
import { type GameComponent, type GameMode } from './common/game-type';
import { Continue } from './components/atoms/continue';
import { Footer } from './components/atoms/footer';
import { ProgressWithTimer, type TimerRef } from './components/atoms/Progress';
import { Avatar } from './components/organisms/avatar/avatar';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { FullWordGame } from './game/full-word';
import { JumbledWordGame } from './game/jumbled-word/index';
import { SyllableGame } from './game/syllabi';
import { TypingGame } from './game/typing';
import { VoiceTypingGame } from './game/voice-typing';
import { useLocalStorageState } from './hooks/use-local-storage-state';
import { sampleSpellingWords, sampleWordUsage } from './words';
import { FourOptionGame, TwoOptionGame } from './game/multiple-choice';
import { useIsTestMode, useSetTestMode } from './context/hint-context';
import { ContextGame } from './game/context';
import { CorrectSentenceGame } from './game/correct-sentence';
import { CheckButton } from './components/atoms/check-button';
import { useOnTestModeChange } from './context/hint-context/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComponentMap: Record<GameMode, GameComponent<any>> = {
  fullWord: FullWordGame,
  syllable: SyllableGame,
  voiceTyping: VoiceTypingGame,
  jumbled: JumbledWordGame,
  fourOption: FourOptionGame,
  twoOption: TwoOptionGame,
  typing: TypingGame,
  context: ContextGame,
  correctSentence: CorrectSentenceGame,
} as const;

const useWords = (mode: GameMode) => {
  return useMemo(() => {
    if (mode === 'context' || mode === 'correctSentence') {
      return sampleWordUsage;
    } else {
      return sampleSpellingWords;
    }
  }, [mode]);
};

export const App = () => {
  const gameRef = useRef<GameRef>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [disableChecking, setDisableChecking] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const [gameMode, setGameMode] = useLocalStorageState<GameMode>(
    'GAME_TYPE',
    'syllable'
  );
  const words = useWords(gameMode);

  const timerRef = useRef<TimerRef>(null);
  const [soundEnabled, setSoundEnabled] = useLocalStorageState<boolean>(
    'SOUND_ENABLED',
    true
  );
  const isTestMode = useIsTestMode();
  const setTestMode = useSetTestMode();

  const Component = ComponentMap[gameMode];
  const [start, setStart] = useState(false);
  const onCheckAnswer = useCallback((): GameState => {
    const answer = gameRef.current?.getCorrectState();
    if (answer === 'CORRECT') {
      timerRef.current?.stopTimer();
      setCanContinue(true);
    }
    return answer ?? 'UNANSWERED';
  }, []);

  useOnTestModeChange(enabled => {
    if (enabled) {
      timerRef.current?.startTimer(words[currentWordIndex].word.length * 2);
    } else {
      timerRef.current?.stopTimer();
    }
  });

  const moveToNextWord = useCallback(() => {
    setCurrentWordIndex(prev => {
      const nextIndex = prev < words.length - 1 ? prev + 1 : prev;
      if (isTestMode) {
        timerRef.current?.startTimer(words[nextIndex].word.length * 2);
      }
      return nextIndex;
    });
    setCanContinue(false);
  }, [isTestMode, words]);

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
      noText: '🧪 Test Mode',
      onNo: () => {
        setTestMode(true);
        timerRef.current?.startTimer(words[0].word.length * 2);
        setStart(true);
      },
      onYes: () => {
        setStart(true);
      },
    });
  }, [setTestMode, words]);

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
      header={
        <Header
          ProgressComponent={
            <ProgressWithTimer
              score={currentWordIndex + 1}
              total={words.length}
              ref={timerRef}
              disableTimer={!isTestMode}
              onTimeUp={onTimeUp}
            />
          }
          gameMode={gameMode}
          onGameModeChange={setGameMode}
          soundEnabled={soundEnabled}
          onSoundToggle={setSoundEnabled}
        />
      }
      footer={
        <Footer isSuccess={canContinue}>
          {canContinue ? (
            <Continue disabled={!canContinue} onClick={moveToNextWord} />
          ) : (
            <CheckButton
              onCheckAnswer={onCheckAnswer}
              disableChecking={disableChecking}
            />
          )}
        </Footer>
      }
    >
      {start ? (
        <Component
          ref={gameRef}
          wordDef={words[currentWordIndex]}
          setDisableChecking={setDisableChecking}
        />
      ) : null}
    </Layout>
  );
};
