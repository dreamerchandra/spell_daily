import { Game } from './Game';
import { useGameSequence } from './hooks/use-game-sequence';
import { ErrorComponent } from './components/atoms/error-component';
import { LoadingComponent } from './components/atoms/loading-component';

export const App = () => {
  const { data, error, isLoading } = useGameSequence();
  if (isLoading) {
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
