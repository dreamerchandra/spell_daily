import type { ReactNode } from 'react';

interface ScrambledKeyProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'normal' | 'special' | 'disabled';
  disabled?: boolean;
}

const ScrambledKey = ({
  children,
  onClick,
  variant = 'normal',
  disabled = false,
}: ScrambledKeyProps) => {
  const baseClasses =
    'transform rounded-lg font-semibold shadow-sm transition-all duration-200 border min-w-[1rem] h-12';

  const variantClasses = {
    normal:
      'bg-gradient-to-r from-ui-keyBg to-gray-200 border-ui-keyBorder text-ui-text hover:from-gray-200 hover:to-gray-300 hover:scale-105',
    special:
      'bg-gradient-to-r from-ui-accentCoral to-red-400 border-red-300 text-white hover:from-red-400 hover:to-red-500 hover:scale-105',
    disabled:
      'bg-gradient-to-r from-gray-300 to-gray-400 border-gray-400 text-gray-500 cursor-not-allowed',
  };

  const currentVariant = disabled ? 'disabled' : variant;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[currentVariant]} px-3 py-2.5 text-sm`}
    >
      {children}
    </button>
  );
};

interface ScrambledKeyboardProps {
  availableLetters: string[];
  onLetterPress: (letter: string) => void;
  onBackspace: () => void;
  className?: string;
  disabled: boolean;
}

export const ScrambledKeyboard = ({
  availableLetters,
  onLetterPress,
  onBackspace,
  className = '',
  disabled,
}: ScrambledKeyboardProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Scrambled letters */}
      <div className="flex flex-nowrap justify-center gap-2">
        {availableLetters.map((letter, letterIndex) => (
          <ScrambledKey
            key={`${letter}-${letterIndex}`}
            onClick={() => onLetterPress(letter)}
            variant="normal"
            disabled={disabled}
          >
            {letter}
          </ScrambledKey>
        ))}
      </div>

      {/* Backspace button */}
      <div className="flex justify-center">
        <ScrambledKey
          onClick={onBackspace}
          variant="special"
          disabled={disabled}
        >
          ⌫ Delete
        </ScrambledKey>
      </div>
    </div>
  );
};
