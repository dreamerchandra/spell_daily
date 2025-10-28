import { useCallback, useRef, useState, useEffect } from 'react';
import { Button } from './components/atoms/Button';
import { Footer } from './components/atoms/footer';
import { Progress } from './components/atoms/Progress';
import type { GameRef } from './common/game-ref';
import { Header } from './components/organisms/header';
import { Layout } from './components/organisms/layout';
import { FullWordGame } from './game/full-word';
import { SyllableGame } from './game/syllabi';
import { sampleWords } from './words';
import { useShortcut } from './hooks/use-shortcut';
import { Avatar } from './components/organisms/avatar/avatar';
import { Continue } from './components/atoms/continue';

type GameMode = 'fullWord' | 'syllable';

export const App = () => {
  const gameRef = useRef<GameRef>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words] = useState(sampleWords);
  const [disableChecking, setDisableChecking] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('fullWord');
  const [showGameSelection, setShowGameSelection] = useState(false);

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

  const selectGameMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setShowGameSelection(false);
    setStart(true);
  }, []);

  useEffect(() => {
    Avatar.show({
      text: 'Hiii! I can guide you through learning spelling!',
      yesText: "🎉 Let's go!",
      onYes: () => {
        setShowGameSelection(true);
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
      {showGameSelection ? (
        <div className="relative w-full max-w-md px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">
            Choose Your Spelling Game
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => selectGameMode('fullWord')}
              className="w-full rounded-xl border border-blue-300 bg-blue-50 p-6 text-left transition-all hover:bg-blue-100 hover:shadow-lg dark:border-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800"
            >
              <h3 className="mb-2 text-xl font-semibold text-blue-700 dark:text-blue-300">
                🔤 Full Word Spelling
              </h3>
              <p className="text-blue-600 dark:text-blue-400">
                Type the complete word letter by letter using the keyboard
              </p>
            </button>

            <button
              onClick={() => selectGameMode('syllable')}
              className="w-full rounded-xl border border-green-300 bg-green-50 p-6 text-left transition-all hover:bg-green-100 hover:shadow-lg dark:border-green-600 dark:bg-green-900 dark:hover:bg-green-800"
            >
              <h3 className="mb-2 text-xl font-semibold text-green-700 dark:text-green-300">
                🧩 Syllable Picker
              </h3>
              <p className="text-green-600 dark:text-green-400">
                Build words by selecting the correct syllables from options
              </p>
            </button>
          </div>
        </div>
      ) : start ? (
        gameMode === 'fullWord' ? (
          <FullWordGame
            ref={gameRef}
            wordDef={sampleWords[currentWordIndex]}
            setDisableChecking={setDisableChecking}
          />
        ) : (
          <SyllableGame
            ref={gameRef}
            wordDef={sampleWords[currentWordIndex]}
            setDisableChecking={setDisableChecking}
          />
        )
      ) : null}
    </Layout>
  );
};
