import { useState } from 'react';
import { Popover } from '../atoms/Popover';

type GameMode = 'fullWord' | 'syllable' | 'voiceTyping';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export const GameModeSelector = ({
  currentMode,
  onModeChange,
}: GameModeSelectorProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleModeSelect = (mode: GameMode) => {
    onModeChange(mode);
    setIsPopoverOpen(false);
  };

  const gameModes = [
    {
      value: 'fullWord' as GameMode,
      label: 'Full Word',
      description: 'Type the complete word letter by letter',
    },
    {
      value: 'syllable' as GameMode,
      label: 'Syllable Picker',
      description: 'Build words by selecting syllables',
    },
    {
      value: 'voiceTyping' as GameMode,
      label: 'Voice Typing',
      description: 'Speak the word using your microphone',
    },
  ];

  return (
    <Popover
      isOpen={isPopoverOpen}
      onToggle={() => setIsPopoverOpen(!isPopoverOpen)}
      trigger={
        <button className="" aria-label="Game mode selector">
          -
        </button>
      }
    >
      <div className="space-y-1">
        <div className="mb-2 px-2 py-1">
          <span className="text-xs font-semibold text-gray-300">Game Mode</span>
        </div>
        {gameModes.map(mode => (
          <button
            key={mode.value}
            onClick={() => handleModeSelect(mode.value)}
            className={`w-full rounded-lg p-3 text-left transition-all duration-200 ${
              currentMode === mode.value
                ? 'border border-game-primary-500/30 bg-gradient-to-r from-game-primary-600/20 to-game-primary-700/20 text-game-primary-300'
                : 'text-gray-200 hover:bg-dark-600/50 hover:text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium">{mode.label}</div>
                <div className="text-xs text-gray-400">{mode.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Popover>
  );
};
