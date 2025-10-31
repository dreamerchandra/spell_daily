// Base classes for styling
export const BASE_BOX_CLASSES =
  'flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold transition-all duration-300';

// Success state styles
export const SUCCESS_STYLES = 'themed-success-box';

// Error state styles
export const ERROR_STYLES = 'themed-error-box';

// Primary state styles (for filled letters)
export const PRIMARY_STYLES = 'themed-primary-box';

// Empty state styles (for unfilled letters)
export const EMPTY_STYLES = 'themed-empty-box';

// Active state (focus ring)
export const ACTIVE_RING =
  'themed-active-ring animate-pulse transition-all duration-300';

// Placeholder text color (for auto-filled hints)
export const PLACEHOLDER_TEXT = 'text-dark-500/70';

// Default text colors
export const WHITE_TEXT = 'themed-primary-text';
export const GRAY_TEXT = 'themed-secondary-text';

// Custom animation classes
export const CELEBRATION_ANIMATIONS = {
  bounce: 'animate-bounce scale-110 duration-300',
  pulse: 'animate-pulse scale-105 shadow-lg shadow-green-500/50',
  jump: 'animate-bounce -translate-y-2 rotate-12',
  glow: 'shadow-xl shadow-emerald-400/50 ring-2 ring-emerald-400/30 scale-110',
  typewriter: 'animate-pulse',
  cursor: 'animate-ping ring-2 ring-blue-400',
} as const;
