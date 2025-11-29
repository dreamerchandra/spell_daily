import { useEffect, useState } from 'react';
import { gameSequence, type GameSequenceType } from '../words';
import { isDev } from '../env';

const MOCK_DELAY_MS = isDev ? 0 : 1000;

export const useGameSequence = () => {
  const [result, setResult] = useState<{
    data: GameSequenceType;
    isLoading: boolean;
    error: string | null;
  }>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      gameSequence
        .then(gameSequence => {
          setResult({
            data: gameSequence,
            isLoading: false,
            error: null,
          });
        })
        .catch(error => {
          setResult({
            data: [],
            isLoading: false,
            error: error.message || 'Failed to load game sequence',
          });
        });
    }, MOCK_DELAY_MS);
    return () => clearTimeout(timerId);
  }, []);

  return result;
};
