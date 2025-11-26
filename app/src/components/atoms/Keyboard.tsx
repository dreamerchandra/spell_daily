import { useEffect } from 'react';

interface KeyboardKeyProps {
  char: string;
  onClick: () => void;
  variant?: 'normal' | 'special' | 'wide';
  className?: string;
}

const KeyboardKey = ({
  char,
  onClick,
  variant = 'normal',
  className = '',
}: KeyboardKeyProps) => {
  const baseClasses =
    'flex items-center justify-center rounded-md font-normal transition-all duration-100 active:scale-95 select-none touch-manipulation border';

  const variantClasses = {
    normal:
      'bg-ui-keyBg border-ui-keyBorder text-ui-text hover:bg-gray-200 h-[54px] flex-1 min-w-[32px] shadow-sm',
    special:
      'bg-ui-accentCoral border-red-300 text-white hover:bg-red-400 h-[54px] flex-1 min-w-[48px] shadow-sm',
    wide: 'bg-ui-keyBg border-ui-keyBorder text-ui-text hover:bg-gray-200 h-[54px] shadow-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type="button"
    >
      <span className="pointer-events-none text-[16px] leading-none">
        {char}
      </span>
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
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const Keyboard = ({ onKeyPress, className = '' }: KeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        onKeyPress('⌫');
        return;
      }

      if (e.key.length !== 1) return;
      if (!/[a-zA-Z]/.test(e.key)) return;

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
    <div className={`w-full ${className}`} style={{ maxWidth: '100vw' }}>
      <div className="flex flex-col gap-3 px-2 pb-3">
        {/* Row 1: QWERTYUIOP */}
        <div className="flex justify-center gap-2">
          {keyboard[0].map(key => (
            <KeyboardKey key={key} char={key} onClick={() => onKeyPress(key)} />
          ))}
        </div>

        {/* Row 2: ASDFGHJKL */}
        <div className="flex justify-center gap-2  px-2 max-w-[100vw]px-4 max-w-[100vw]">
          {keyboard[1].map(key => (
            <KeyboardKey key={key} char={key} onClick={() => onKeyPress(key)} />
          ))}
        </div>

        {/* Row 3: ZXCVBNM with Backspace */}
        <div className="flex justify-center gap-2">
          {keyboard[2].map(key => (
            <KeyboardKey key={key} char={key} onClick={() => onKeyPress(key)} />
          ))}
          <KeyboardKey
            char="⌫"
            onClick={() => onKeyPress('⌫')}
            variant="special"
            className="min-w-[48px]"
          />
        </div>
      </div>
    </div>
  );
};
