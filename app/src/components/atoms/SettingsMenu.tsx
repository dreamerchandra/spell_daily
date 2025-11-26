import { useState } from 'react';
import { Popover } from './Popover';
import type { GameMode } from '../../common/game-type';

interface SettingsMenuProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  testMode: boolean;
  onTestModeToggle: (enabled: boolean) => void;
}

export const SettingsMenu = ({
  currentMode,
  onModeChange,
  testMode,
  onTestModeToggle,
}: SettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const gameModes = [
    { value: 'fullWord' as GameMode, label: 'Full Word' },
    { value: 'syllable' as GameMode, label: 'Syllable' },
    { value: 'voiceTyping' as GameMode, label: 'Voice' },
    { value: 'jumbled' as GameMode, label: 'Jumbled' },
    { value: 'fourOption' as GameMode, label: '4-Option' },
    { value: 'twoOption' as GameMode, label: '2-Option' },
    { value: 'typing' as GameMode, label: 'Typing' },
    { value: 'context' as GameMode, label: 'Context' },
    { value: 'correctSentence' as GameMode, label: 'Usage' },
  ];

  const handleModeChange = (mode: GameMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };

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
        {/* Game Mode Section */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-light text-ui-text">Game Mode</span>
          <select
            value={currentMode}
            onChange={e => handleModeChange(e.target.value as GameMode)}
            className="rounded-lg border-2 border-gray-300 bg-white px-3 py-1 text-ui-text backdrop-blur-sm transition-colors hover:border-gray-400 focus:border-ui-primary focus:outline-none"
          >
            {gameModes.map(mode => (
              <option
                key={mode.value}
                value={mode.value}
                className="bg-white text-ui-text"
              >
                {mode.label}
              </option>
            ))}
          </select>
        </div>

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
