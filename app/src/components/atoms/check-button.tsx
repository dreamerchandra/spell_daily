import { useCallback, useState, type FC } from 'react';
import { Button } from './Button';
import { useSetTimeout } from '../../hooks/use-setTimeout';
import type { GameState } from '../../common/game-ref';
import { useShortcut } from '../../hooks/use-shortcut';

export const CheckButton: FC<{
  onCheckAnswer: () => GameState;
  disableChecking: boolean;
}> = ({ onCheckAnswer, disableChecking }) => {
  const [gameState, setGameState] = useState<GameState>('UNANSWERED');
  const timer = useSetTimeout();

  const onClick = useCallback(() => {
    if (disableChecking) return;
    const gameState = onCheckAnswer();
    setGameState(gameState);
    if (gameState === 'SO_CLOSE') {
      return;
    }
    timer(() => {
      setGameState('UNANSWERED');
    }, 2000);
  }, [disableChecking, onCheckAnswer, timer]);

  useShortcut('Enter', onClick);

  return (
    <div className="m-auto flex w-[80%] flex-col justify-center">
      {gameState === 'SO_CLOSE' && (
        <p className="mb-2 text-center text-lg text-yellow-600">
          So close! Try again.
        </p>
      )}
      <Button
        onClick={onClick}
        className="m-auto w-[80%]"
        disabled={disableChecking}
        variant={
          gameState === 'UNANSWERED'
            ? 'primary'
            : gameState === 'CORRECT'
              ? 'success'
              : 'error'
        }
        size="lg"
      >
        {gameState === 'UNANSWERED'
          ? 'CHECK'
          : gameState === 'CORRECT'
            ? 'CORRECT'
            : gameState === 'SO_CLOSE'
              ? 'SO CLOSE'
              : 'WRONG'}
      </Button>
    </div>
  );
};
