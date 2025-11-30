import { useEffect, useRef, useState, useCallback } from 'react';

interface KeyboardKeyProps {
  char: string;
  onClick: () => void;
  variant?: 'letter' | 'wide';
  className?: string;
  status?: 'correct' | 'present' | 'absent' | 'default';
  position: { x: number; y: number };
  onMagneticHit?: (key: string, position: { x: number; y: number }) => void;
}

const KeyboardKey = ({
  char,
  onClick,
  variant = 'letter',
  className = '',
  status = 'default',
  position,
  onMagneticHit,
}: KeyboardKeyProps) => {
  const keyRef = useRef<HTMLButtonElement>(null);

  const baseClasses = `
    relative border rounded-[6px] text-[14px] font-bold h-[44px] cursor-pointer
    transition-all duration-150 flex items-center justify-center
    uppercase active:scale-95 select-none touch-manipulation
    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]
  `;

  const variantClasses = {
    letter: 'w-[36px]',
    wide: 'w-[64px] text-[12px]',
  };

  const statusClasses = {
    default:
      'bg-gradient-to-b from-[#342d4f] to-[#2c2545] border-[#3d3660]/40 text-white/90 hover:from-[#3d3660] hover:to-[#342d4f] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    correct:
      'bg-gradient-to-b from-[#5cbf60] to-[#4caf50] border-[#4caf50]/40 text-white hover:from-[#66c96a] hover:to-[#56b95a] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
    present:
      'bg-gradient-to-b from-[#ffdd33] to-[#ffd700] border-[#ffd700]/40 text-[#333] hover:from-[#ffe066] hover:to-[#ffdd33] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]',
    absent:
      'bg-gradient-to-b from-[#909090] to-[#808080] border-[#808080]/40 text-white/70 hover:from-[#a0a0a0] hover:to-[#909090] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]',
  };

  const handleClick = useCallback(() => {
    onClick();

    // Show visual confirmation
    if (keyRef.current && onMagneticHit) {
      const rect = keyRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      onMagneticHit(char, center);
    }
  }, [char, onClick, onMagneticHit]);

  return (
    <button
      ref={keyRef}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${statusClasses[status]} ${className}`}
      type="button"
      data-key={char.toLowerCase()}
      data-position={JSON.stringify(position)}
    >
      <span className="relative z-10 drop-shadow-sm">{char}</span>
    </button>
  );
};

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
  keyStatuses?: Record<string, 'correct' | 'present' | 'absent'>;
}

const keyboard = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface MagneticHit {
  key: string;
  position: { x: number; y: number };
  id: string;
}

export const Keyboard = ({
  onKeyPress,
  className = '',
  keyStatuses = {},
}: KeyboardProps) => {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const [magneticHits, setMagneticHits] = useState<MagneticHit[]>([]);

  // Visual confirmation animation
  const showMagneticHit = useCallback(
    (key: string, position: { x: number; y: number }) => {
      const hitId = `${Date.now()}-${Math.random()}`;
      const newHit: MagneticHit = { key, position, id: hitId };

      setMagneticHits(prev => [...prev, newHit]);

      // Remove after animation
      setTimeout(() => {
        setMagneticHits(prev => prev.filter(hit => hit.id !== hitId));
      }, 600);
    },
    []
  );

  const handleKeyHit = useCallback(
    (key: string, position: { x: number; y: number }) => {
      showMagneticHit(key, position);
    },
    [showMagneticHit]
  );
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
    <div
      ref={keyboardRef}
      className={`relative mx-auto my-5 max-w-[500px] ${className}`}
      id="keyboard"
    >
      {/* Visual confirmation animations */}
      {magneticHits.map(hit => (
        <div
          key={hit.id}
          className="absolute pointer-events-none z-20"
          style={{
            left: hit.position.x - 8,
            top: hit.position.y - 8,
          }}
        >
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 w-4 h-4 bg-blue-300 rounded-full animate-pulse" />
        </div>
      ))}

      {/* Row 1: QWERTYUIOP */}
      <div className="flex justify-center my-[6px] gap-1">
        {keyboard[0].map(key => (
          <KeyboardKey
            key={key}
            char={key}
            onClick={() => onKeyPress(key)}
            status={keyStatuses[key] || 'default'}
            position={{ x: 0, y: 0 }}
            onMagneticHit={handleKeyHit}
          />
        ))}
      </div>

      {/* Row 2: ASDFGHJKL */}
      <div className="flex justify-center my-[6px] gap-1">
        {keyboard[1].map(key => (
          <KeyboardKey
            key={key}
            char={key}
            onClick={() => onKeyPress(key)}
            status={keyStatuses[key] || 'default'}
            position={{ x: 0, y: 0 }}
            onMagneticHit={handleKeyHit}
          />
        ))}
      </div>

      {/* Row 3: ZXCVBNM with Backspace */}
      <div className="flex justify-center my-[6px] gap-1">
        {keyboard[2].map(key => (
          <KeyboardKey
            key={key}
            char={key}
            onClick={() => onKeyPress(key)}
            status={keyStatuses[key] || 'default'}
            position={{ x: 0, y: 0 }}
            onMagneticHit={handleKeyHit}
          />
        ))}
        <KeyboardKey
          char="⌫"
          onClick={() => onKeyPress('⌫')}
          variant="wide"
          position={{ x: 0, y: 0 }}
          onMagneticHit={handleKeyHit}
          className="bg-gradient-to-b from-[#e57373] to-[#d32f2f] border-[#d32f2f]/40 text-white hover:from-[#ef5350] hover:to-[#c62828] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
        />
      </div>
    </div>
  );
};
