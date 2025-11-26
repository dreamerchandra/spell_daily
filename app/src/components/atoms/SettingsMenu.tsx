import { useState } from 'react';
import { Popover } from './Popover';

interface SettingsMenuProps {
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  testMode: boolean;
  onTestModeToggle: (enabled: boolean) => void;
}

export const SettingsMenu = ({
  testMode,
  onTestModeToggle,
}: SettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTestModeToggle = () => {
    onTestModeToggle(!testMode);
    setIsOpen(false);
  };

  //   const handleSoundToggle = () => {
  //     if (onSoundToggle) {
  //       onSoundToggle(!soundEnabled);
  //     }
  //   };

  return (
    <Popover
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      trigger={
        <button className="" aria-label="Settings menu">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6" />
            <path d="M1 12h6m6 0h6" />
          </svg>
        </button>
      }
    >
      <div className="flex w-60 flex-col gap-2 p-2">
        {/* Sound Section */}
        {/* <div className="flex items-center justify-between">
          <span className="text-lg font-light text-white">Sound</span>
          <button
            onClick={handleSoundToggle}
            className={`relative h-8 w-16 rounded-full border-2 border-white/30 p-1 transition-colors ${
              soundEnabled ? 'bg-red-400' : 'bg-transparent'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full border border-white/50 bg-white shadow-sm transition-transform ${
                soundEnabled
                  ? 'translate-x-7 bg-white'
                  : 'translate-x-0 bg-white/20'
              }`}
            />
          </button>
        </div> */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-light text-white">Test Mode</span>
          <button
            onClick={handleTestModeToggle}
            className={`relative h-8 w-16 rounded-full border-2 border-white/30 p-1 transition-colors ${
              testMode ? 'bg-red-400' : 'bg-transparent'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full border border-white/50 bg-white shadow-sm transition-transform ${
                testMode
                  ? 'translate-x-7 bg-white'
                  : 'translate-x-0 bg-white/20'
              }`}
            />
          </button>
        </div>
      </div>
    </Popover>
  );
};
