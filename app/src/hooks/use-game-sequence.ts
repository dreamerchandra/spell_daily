import { useEffect, useState } from 'react';
import { gameSequence, type GameSequenceType } from '../words';

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
    setTimeout(() => {
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
    }, 1000);
  }, []);

  return result;
};
