import { useState, useEffect } from 'react';
import { Button, Keyboard, WordInput, Header } from '../../components/atoms';
import { useSpellingSpeech } from '../../hooks';
import { Progress } from '../../components/atoms/Progress';

interface GameWord {
  word: string;
  definition: string;
  audioUrl?: string;
}

const sampleWords: GameWord[] = [
  {
    word: 'SYSTEM',
    definition: 'A plan or way things are organized or set up. 📋',
  },
  {
    word: 'RAINBOW',
    definition: 'Beautiful colors that appear in the sky after rain! 🌈',
  },
  {
    word: 'BUTTERFLY',
    definition: 'A pretty insect with colorful wings that can fly! 🦋',
  },
  {
    word: 'ELEPHANT',
    definition: 'A big gray animal with a long trunk and big ears! 🐘',
  },
  {
    word: 'TREASURE',
    definition: 'Special valuable things like gold coins and jewels! 💎',
  },
];

export const FullWordGame = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showDefinition, setShowDefinition] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);

  // Use the speech hook
  const { speak, isPlaying, isSupported } = useSpellingSpeech();

  const currentWord = sampleWords[currentWordIndex];
  const wordLength = currentWord.word.length;

  useEffect(() => {
    setUserInput(new Array(wordLength).fill(''));
    setIsCorrect(null);
    setShowDefinition(true);
  }, [currentWordIndex, wordLength]);

  const handleKeyPress = (key: string) => {
    if (key === '⌫') {
      // Backspace
      const newInput = [...userInput];
      for (let i = newInput.length - 1; i >= 0; i--) {
        if (newInput[i] !== '') {
          newInput[i] = '';
          break;
        }
      }
      setUserInput(newInput);
      return;
    }

    // Find the first empty position
    const emptyIndex = userInput.findIndex(letter => letter === '');
    if (emptyIndex !== -1) {
      const newInput = [...userInput];
      newInput[emptyIndex] = key;
      setUserInput(newInput);
    }
  };

  const checkAnswer = () => {
    const userWord = userInput.join('');
    const isWordCorrect = userWord === currentWord.word;
    setIsCorrect(isWordCorrect);

    if (isWordCorrect) {
      setTimeout(() => {
        if (currentWordIndex < sampleWords.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setGameComplete(true);
        }
      }, 2000);
    }
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setGameComplete(false);
    setIsCorrect(null);
  };

  const playAudio = () => {
    speak(currentWord.word);
  };

  if (gameComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-700/50 bg-gray-800/90 p-12 text-center shadow-2xl backdrop-blur-sm">
          <div className="mb-6 text-8xl">🎉</div>
          <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
            Amazing Job!
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            You spelled all the words correctly!
          </p>
          <Button
            onClick={restartGame}
            variant="primary"
            size="lg"
            className="rounded-2xl"
          >
            Play Again! 🚀
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-dark-gradient">
      {/* Header */}
      <Header
        ProgressComponent={
          <Progress score={currentWordIndex + 1} total={sampleWords.length} />
        }
      />

      <div className="flex h-[calc(100vh-90px)] items-center justify-center">
        <div className="relative w-full max-w-md px-4 text-center">
          <div className="flex items-center justify-center"></div>

          {/* Main Game Area */}
          <div className="mb-4 lg:rounded-3xl lg:border lg:border-gray-700/30 lg:bg-gray-800/80 lg:p-6 lg:shadow-2xl lg:backdrop-blur-sm">
            {/* Audio Controls */}
            {/* Audio Controls */}
            <div className="mb-6 text-center">
              <p className="mb-4 text-lg font-semibold text-gray-300">
                TYPE WHAT YOU HEAR
              </p>
              {!isSupported && (
                <p className="mb-2 text-sm text-yellow-400">
                  ⚠️ Audio not supported in this browser
                </p>
              )}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={playAudio}
                  variant="primary"
                  disabled={isPlaying}
                  className={`rounded-full p-3 ${isPlaying ? 'animate-pulse' : ''}`}
                >
                  <span className="text-xl">{isPlaying ? '🎵' : '▶️'}</span>
                </Button>
                <Button
                  onClick={playAudio}
                  variant="secondary"
                  disabled={isPlaying}
                  className={`rounded-full p-3 ${isPlaying ? 'animate-bounce' : ''}`}
                >
                  <span className="text-xl">{isPlaying ? '🎤' : '🔊'}</span>
                </Button>
                <Button
                  onClick={() => setShowDefinition(!showDefinition)}
                  variant="success"
                  className="rounded-full p-3"
                >
                  <span className="text-xl">
                    {showDefinition ? '🙈' : '💡'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Definition */}
            {showDefinition && (
              <div className="mb-8 text-center">
                <div className="inline-block rounded-2xl border border-slate-600/40 bg-gradient-to-r from-slate-700/60 to-slate-600/60 p-4 backdrop-blur-sm">
                  <p className="text-lg font-medium text-gray-200">
                    {currentWord.definition}
                  </p>
                </div>
              </div>
            )}

            {/* Word Input Boxes */}
            <WordInput
              word={userInput}
              isCorrect={isCorrect}
              className="mb-8"
            />

            {/* Virtual Keyboard */}
            <Keyboard onKeyPress={handleKeyPress} className="mb-6 p-2" />

            {/* Check Button */}
            <div className="text-center">
              <Button
                onClick={checkAnswer}
                disabled={userInput.includes('')}
                variant="success"
                size="lg"
              >
                CHECK ✨
              </Button>
            </div>

            {/* Feedback */}
            {isCorrect !== null && (
              <div className="mt-6 text-center">
                {isCorrect ? (
                  <div className="rounded-xl border border-game-success-500/40 bg-game-success-500/10 p-4 backdrop-blur-sm">
                    <p className="text-lg font-semibold text-game-success-300">
                      🎉 Awesome! That's correct! 🎉
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-game-error-500/40 bg-game-error-500/10 p-4 backdrop-blur-sm">
                    <p className="text-base font-medium text-game-error-300">
                      😊 Try again! You've got this! 💪
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
