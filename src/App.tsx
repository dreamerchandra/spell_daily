import { useCallback, useRef, useState, useEffect } from 'react';
import { Button } from './components/atoms/Button';
import { Footer } from './components/atoms/footer';
import { Progress } from './components/atoms/Progress';
import type { GameRef } from './common/game-ref';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { FullWordGame } from './game/full-word';
import { sampleWords } from './words';
import { useShortcut } from './hooks/use-shortcut';
import { Avatar } from './components/organisms/avatar/avatar';

export const App = () => {
  const gameRef = useRef<GameRef>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words] = useState(sampleWords);
  const [disableChecking, setDisableChecking] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  const [start, setStart] = useState(false);

  const onCheckAnswer = useCallback(() => {
    if (gameRef.current?.isCorrect()) {
      setCanContinue(true);
      // setCurrentWordIndex(prev => (prev < words.length - 1 ? prev + 1 : prev));
    }
  }, [words.length]);

  useShortcut('Enter', () => {
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
        />
      }
      footer={
        <Footer>
          <div className="text-center">
            {canContinue ? (
              <Button
                onClick={() => {
                  setCurrentWordIndex(prev =>
                    prev < words.length - 1 ? prev + 1 : prev
                  );
                  setCanContinue(false);
                }}
                variant="primary"
                size="lg"
              >
                CONTINUE
              </Button>
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
        <FullWordGame
          ref={gameRef}
          wordDef={sampleWords[currentWordIndex]}
          setDisableChecking={setDisableChecking}
        />
      ) : null}
    </Layout>
  );
};
