import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameRef } from './common/game-ref';
import type { GameComponent, GameMode } from './common/game-type';
import { Button } from './components/atoms/Button';
import { Continue } from './components/atoms/continue';
import { Footer } from './components/atoms/footer';
import { Progress } from './components/atoms/Progress';
import { Avatar } from './components/organisms/avatar/avatar';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { FullWordGame } from './game/full-word';
import { JumbledWordGame } from './game/jumbled-word/index';
import { SyllableGame } from './game/syllabi';
import { VoiceTypingGame } from './game/voice-typing';
import { useLocalStorageState } from './hooks/use-local-storage-state';
import { useShortcut } from './hooks/use-shortcut';
import { sampleWords } from './words';
import { FourOptionGame, TwoOptionGame } from './game/multiple-choice';

const ComponentMap: Record<GameMode, GameComponent> = {
  fullWord: FullWordGame,
  syllable: SyllableGame,
  voiceTyping: VoiceTypingGame,
  jumbled: JumbledWordGame,
  fourOption: FourOptionGame,
  twoOption: TwoOptionGame,
} as const;

export const App = () => {
  const gameRef = useRef<GameRef>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words] = useState(sampleWords);
  const [disableChecking, setDisableChecking] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const [gameMode, setGameMode] = useLocalStorageState<GameMode>(
    'GAME_TYPE',
    'syllable'
  );

  const Component = ComponentMap[gameMode];
  const [start, setStart] = useState(false);
  const onCheckAnswer = useCallback(() => {
    if (gameRef.current?.isCorrect()) {
      setCanContinue(true);
    }
  }, []);

  const moveToNextWord = useCallback(() => {
    setCurrentWordIndex(prev => (prev < words.length - 1 ? prev + 1 : prev));
    setCanContinue(false);
  }, [words.length]);

  useShortcut('Enter', () => {
    if (canContinue) {
      moveToNextWord();
      return;
    }
    if (!disableChecking) {
      onCheckAnswer();
    }
  });

  useEffect(() => {
    Avatar.show({
      text: 'Hiii! I can guide you through learning spelling!',
      yesText: "🎉 Let's go!",
      onYes: () => {
        setStart(true);
      },
    });
  }, []);

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
            <Progress score={currentWordIndex + 1} total={words.length} />
          }
          gameMode={gameMode}
          onGameModeChange={setGameMode}
        />
      }
      footer={
        <Footer>
          <div className="text-center">
            {canContinue ? (
              <Continue disabled={!canContinue} onClick={moveToNextWord} />
            ) : (
              <Button
                onClick={onCheckAnswer}
                disabled={disableChecking}
                variant="primary"
                size="lg"
              >
                CHECK
              </Button>
            )}
          </div>
        </Footer>
      }
    >
      {start ? (
        <Component
          ref={gameRef}
          wordDef={sampleWords[currentWordIndex]}
          setDisableChecking={setDisableChecking}
        />
      ) : null}
    </Layout>
  );
};
