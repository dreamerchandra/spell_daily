import { Game } from './Game';
import { useGameSequence } from './hooks/use-game-sequence';
import { ErrorComponent } from './components/atoms/error-component';
import { LoadingComponent } from './components/atoms/loading-component';
import { useEffect, useState } from 'react';
import { footerAnimation } from './util/riveManager';

type FetchStatus = 'LOADING' | 'SUCCESS' | 'ERROR';

const useAppAssertLoaded = () => {
  const [loadRive, setLoadRive] = useState<FetchStatus>('LOADING');

  useEffect(() => {
    footerAnimation
      .loadBuffer()
      .then(() => {
        setLoadRive('SUCCESS');
      })
      .catch(() => {
        setLoadRive('ERROR'); // Proceed even if Rive fails to load
      });
  }, []);

  return loadRive === 'SUCCESS';
};

export const App = () => {
  const { data, error, isLoading } = useGameSequence();
  const assertLoaded = useAppAssertLoaded();

  if (isLoading || !assertLoaded) {
    return <LoadingComponent />;
  }
  if (error) {
    return (
      <ErrorComponent
        customMessage={'Try refreshing the page or come back later.'}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }
  return <Game gameSequence={data} />;
};
