// Base classes for styling
export const BASE_BOX_CLASSES =
  'flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300';

// Success state styles
export const SUCCESS_STYLES =
  'border-game-success-500/60 bg-game-success-500/20 text-game-success-300';

// Error state styles
export const ERROR_STYLES =
  'border-game-error-500/60 bg-game-error-500/20 text-game-error-300';

// Primary state styles (for filled letters)
export const PRIMARY_STYLES =
  'border-game-primary-500/60 bg-game-primary-500/20 text-game-primary-300';

// Empty state styles (for unfilled letters)
export const EMPTY_STYLES = 'border-dark-700/50 bg-dark-800/30 text-dark-500';

// Active state (focus ring)
export const ACTIVE_RING =
  'ring-2 ring-game-primary-400/50 animate-pulse transition-all duration-300';

// Placeholder text color (for auto-filled hints)
export const PLACEHOLDER_TEXT = 'text-dark-500/70';

// Default text colors
export const WHITE_TEXT = 'text-white';
export const GRAY_TEXT = 'text-gray-300';

// Custom animation classes
export const CELEBRATION_ANIMATIONS = {
  bounce: 'animate-bounce scale-110 duration-300',
  pulse: 'animate-pulse scale-105 shadow-lg shadow-green-500/50',
  jump: 'animate-bounce -translate-y-2 rotate-12',
  glow: 'shadow-xl shadow-emerald-400/50 ring-2 ring-emerald-400/30 scale-110',
  typewriter: 'animate-pulse',
  cursor: 'animate-ping ring-2 ring-blue-400',
} as const;
