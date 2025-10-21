import { useEffect, type ReactNode } from 'react';

interface KeyboardKeyProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'normal' | 'special';
}

const KeyboardKey = ({
  children,
  onClick,
  variant = 'normal',
}: KeyboardKeyProps) => {
  const baseClasses =
    'transform rounded-lg font-semibold shadow-sm transition-all duration-200 hover:scale-105 border';

  const variantClasses = {
    normal:
      'bg-gradient-to-r from-slate-600/70 to-slate-700/70 border-slate-500/30 text-gray-200 hover:from-slate-700 hover:to-slate-800',
    special:
      'bg-gradient-to-r from-game-error-600/80 to-game-error-700/80 border-game-error-500/30 text-white hover:from-game-error-700 hover:to-game-error-800',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} px-3 py-2.5 text-sm`}
    >
      {children}
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
}
const keyboard = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export const Keyboard = ({ onKeyPress, className = '' }: KeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Backspace') {
        onKeyPress('⌫');
        return;
      }
      if (e.key.length !== 1) return;
      if (/[a-zA-Z]/.test(e.key) === false) return;
      const key = e.key.toUpperCase();
      const allKeys = keyboard.flat();
      if (allKeys.includes(key)) {
        onKeyPress(key);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);

  return (
    <div className={`space-y-2 ${className}`}>
      {keyboard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map(key => (
            <KeyboardKey
              key={key}
              onClick={() => onKeyPress(key)}
              variant={key === '⌫' ? 'special' : 'normal'}
            >
              {key}
            </KeyboardKey>
          ))}
        </div>
      ))}
    </div>
  );
};
