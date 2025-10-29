import { type ReactNode } from 'react';
import { AvatarComponent } from './avatar/avatar';
import { GameModeSelector } from '../atoms/GameModeSelector';
import type { GameMode } from '../../common/game-type';

interface HeaderProps {
  ProgressComponent: ReactNode;
  gameMode?: GameMode;
  onGameModeChange: (mode: GameMode) => void;
}

export const Header = ({
  ProgressComponent,
  gameMode = 'fullWord',
  onGameModeChange,
}: HeaderProps) => {
  return (
    <header className={`m-auto flex max-w-md items-center justify-between p-4`}>
      <GameModeSelector
        currentMode={gameMode}
        onModeChange={onGameModeChange}
      />
      {ProgressComponent}
      <div className="h-16 w-16" aria-label="Helper">
        <AvatarComponent />
      </div>
    </header>
  );
};
