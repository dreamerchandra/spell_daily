import { type ReactNode } from 'react';
import { AvatarComponent } from './avatar/avatar';

interface HeaderProps {
  ProgressComponent: ReactNode;
}

export const Header = ({ ProgressComponent }: HeaderProps) => {
  return (
    <header className={`m-auto flex max-w-md items-center justify-between p-4`}>
      {/* empty div to center the progress bar */}
      <div />
      {ProgressComponent}
      <div className="h-16 w-16" aria-label="Helper">
        <AvatarComponent />
      </div>
    </header>
  );
};
