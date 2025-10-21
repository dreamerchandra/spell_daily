import { useCallback, useRef, useState } from 'react';
import { Button } from './components/atoms/Button';
import { Footer } from './components/atoms/footer';
import { Progress } from './components/atoms/Progress';
import type { GameRef } from './components/common/game-ref';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { FullWordGame } from './game/full-word';
import { sampleWords } from './words';
import { useShortcut } from './hooks/use-shortcut';

export const App = () => {
  const gameRef = useRef<GameRef>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words] = useState(sampleWords);
  const [disableChecking, setDisableChecking] = useState(true);

  const onCheckAnswer = useCallback(() => {
    if (gameRef.current?.isCorrect()) {
      setCurrentWordIndex(prev => (prev < words.length - 1 ? prev + 1 : prev));
    }
  }, [words.length]);

  useShortcut('Enter', () => {
    if (!disableChecking) {
      onCheckAnswer();
    }
  });

  return (
    <Layout
      header={
        <Header
          ProgressComponent={
            <Progress score={currentWordIndex + 1} total={words.length} />
          }
        />
      }
      footer={
        <Footer>
          <div className="text-center">
            <Button
              onClick={onCheckAnswer}
              disabled={disableChecking}
              variant="success"
              size="lg"
            >
              CHECK ✨
            </Button>
          </div>
        </Footer>
      }
    >
      <FullWordGame
        ref={gameRef}
        wordDef={sampleWords[currentWordIndex]}
        setDisableChecking={setDisableChecking}
      />
    </Layout>
  );
};
