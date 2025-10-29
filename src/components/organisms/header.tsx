import { type ReactNode } from 'react';
import { AvatarComponent } from './avatar/avatar';
import { SettingsMenu } from '../atoms/SettingsMenu';
import type { GameMode } from '../../common/game-type';
import { useIsTestMode, useSetTestMode } from '../../context/hint-context';

interface HeaderProps {
  ProgressComponent: ReactNode;
  gameMode?: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
}

export const Header = ({
  ProgressComponent,
  gameMode = 'fullWord',
  onGameModeChange,
  soundEnabled = true,
  onSoundToggle,
}: HeaderProps) => {
  const testMode = useIsTestMode();
  const onTestModeToggle = useSetTestMode();

  return (
    <header className={`m-auto flex max-w-md items-center justify-between p-4`}>
      <SettingsMenu
        currentMode={gameMode}
        onModeChange={onGameModeChange}
        soundEnabled={soundEnabled}
        onSoundToggle={onSoundToggle}
        testMode={testMode}
        onTestModeToggle={onTestModeToggle}
      />
      {ProgressComponent}
      <div className="h-16 w-16" aria-label="Helper">
        <AvatarComponent />
      </div>
    </header>
  );
};
