import { type ReactNode } from 'react';
import { AvatarComponent } from './avatar/avatar';
import { SettingsMenu } from '../atoms/SettingsMenu';

interface HeaderProps {
  ProgressComponent: ReactNode;
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
}

export const Header = ({
  ProgressComponent,
  soundEnabled = true,
  onSoundToggle,
}: HeaderProps) => {
  return (
    <header className={`m-auto flex max-w-md items-center justify-between p-4`}>
      <SettingsMenu soundEnabled={soundEnabled} onSoundToggle={onSoundToggle} />
      {ProgressComponent}
      <div className="h-16 w-16" aria-label="Helper">
        <AvatarComponent />
      </div>
    </header>
  );
};
