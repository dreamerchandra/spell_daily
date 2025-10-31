import type { ThemeColors, ThemeName } from './theme-types';

// Dark Theme (Current) - Deep and mysterious
const darkTheme: ThemeColors = {
  // Primary - Purple family (matching current game colors)
  primary: '#a855f7',
  primaryLight: '#c084fc',
  primaryDark: '#9333ea',

  // Secondary - Orange family (matching current game colors)
  secondary: '#f59e0b',
  secondaryLight: '#fbbf24',
  secondaryDark: '#d97706',

  // Accent - Success green
  accent: '#10b981',
  accentLight: '#34d399',
  accentDark: '#059669',

  // Backgrounds
  background: {
    main: 'linear-gradient(to bottom right, #1a1625, #2a2438, #1a1625)',
    surface: 'rgba(45, 52, 74, 0.95)',
    overlay: 'rgba(26, 22, 37, 0.9)',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
  },

  // Text colors
  text: {
    primary: '#f8fafc',
    secondary: '#e2e8f0',
    inverse: '#1a1625',
    muted: '#94a3b8',
  },

  // UI colors
  ui: {
    border: '#4f4560',
    shadow: 'rgba(0, 0, 0, 0.4)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(168, 85, 247, 0.15)',
    active: 'rgba(168, 85, 247, 0.25)',
    disabled: 'rgba(148, 163, 184, 0.3)',
    focus: 'rgba(168, 85, 247, 0.3)',
  },
};

// Purple Theme - Vibrant and magical
const purpleTheme: ThemeColors = {
  // Primary - Purple family
  primary: '#8b5cf6',
  primaryLight: '#a78bfa',
  primaryDark: '#7c3aed',

  // Secondary - Pink family
  secondary: '#ec4899',
  secondaryLight: '#f472b6',
  secondaryDark: '#db2777',

  // Accent - Cyan family
  accent: '#06b6d4',
  accentLight: '#22d3ee',
  accentDark: '#0891b2',

  // Backgrounds
  background: {
    main: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #1e1b4b 70%, #0f0a19 100%)',
    surface: 'rgba(30, 27, 75, 0.95)',
    overlay: 'rgba(15, 10, 25, 0.9)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },

  // Text colors
  text: {
    primary: '#f1f5f9',
    secondary: '#e2e8f0',
    inverse: '#1e1b4b',
    muted: '#94a3b8',
  },

  // UI colors
  ui: {
    border: '#4c1d95',
    shadow: 'rgba(139, 92, 246, 0.2)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(139, 92, 246, 0.15)',
    active: 'rgba(139, 92, 246, 0.25)',
    disabled: 'rgba(148, 163, 184, 0.3)',
    focus: 'rgba(139, 92, 246, 0.3)',
  },
};

// Ocean Theme - Cool and calming
const oceanTheme: ThemeColors = {
  // Primary - Blue family
  primary: '#0ea5e9',
  primaryLight: '#38bdf8',
  primaryDark: '#0284c7',

  // Secondary - Teal family
  secondary: '#14b8a6',
  secondaryLight: '#2dd4bf',
  secondaryDark: '#0d9488',

  // Accent - Indigo family
  accent: '#6366f1',
  accentLight: '#818cf8',
  accentDark: '#4f46e5',

  // Backgrounds
  background: {
    main: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 30%, #155e75 70%, #0e7490 100%)',
    surface: 'rgba(12, 74, 110, 0.95)',
    overlay: 'rgba(8, 47, 73, 0.9)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
  },

  // Text colors
  text: {
    primary: '#f0f9ff',
    secondary: '#e0f2fe',
    inverse: '#0c4a6e',
    muted: '#94a3b8',
  },

  // UI colors
  ui: {
    border: '#0369a1',
    shadow: 'rgba(14, 165, 233, 0.2)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(14, 165, 233, 0.15)',
    active: 'rgba(14, 165, 233, 0.25)',
    disabled: 'rgba(148, 163, 184, 0.3)',
    focus: 'rgba(14, 165, 233, 0.3)',
  },
};

// Sunset Theme - Warm and energetic
const sunsetTheme: ThemeColors = {
  // Primary - Muted amber family
  primary: '#d97706',
  primaryLight: '#f59e0b',
  primaryDark: '#b45309',

  // Secondary - Gentle orange family
  secondary: '#fdba74',
  secondaryLight: '#fed7aa',
  secondaryDark: '#fb923c',

  // Accent - Soft golden family
  accent: '#ca8a04',
  accentLight: '#eab308',
  accentDark: '#a16207',

  // Backgrounds
  background: {
    main: 'linear-gradient(135deg, #451a03 0%, #78350f 30%, #92400e 70%, #d97706 100%)',
    surface: 'rgba(69, 26, 3, 0.95)',
    overlay: 'rgba(41, 15, 2, 0.9)',
    gradient: 'linear-gradient(135deg, #d97706, #fdba74)',
  },

  // Text colors
  text: {
    primary: '#fef3f2',
    secondary: '#fed7cc',
    inverse: '#451a03',
    muted: '#fdba74',
  },

  // UI colors
  ui: {
    border: '#92400e',
    shadow: 'rgba(217, 119, 6, 0.2)',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#f87171',
    info: '#60a5fa',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(217, 119, 6, 0.15)',
    active: 'rgba(217, 119, 6, 0.25)',
    disabled: 'rgba(253, 186, 116, 0.3)',
    focus: 'rgba(217, 119, 6, 0.3)',
  },
};

// Theme mapping
export const THEMES: Record<ThemeName, ThemeColors> = {
  dark: darkTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
};

// Theme order for cycling
export const THEME_ORDER: ThemeName[] = ['dark', 'purple', 'ocean', 'sunset'];

// Theme display names
export const THEME_NAMES: Record<ThemeName, string> = {
  dark: 'Dark Magic',
  purple: 'Purple Storm',
  ocean: 'Ocean Depths',
  sunset: 'Golden Hour',
};

// Utility functions
export const getTheme = (themeName: ThemeName): ThemeColors => {
  return THEMES[themeName];
};

export const getNextTheme = (currentTheme: ThemeName): ThemeName => {
  const currentIndex = THEME_ORDER.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  return THEME_ORDER[nextIndex];
};

// CSS custom properties generator
export const generateCSSCustomProperties = (
  theme: ThemeColors
): Record<string, string> => {
  return {
    // Primary colors
    '--color-primary': theme.primary,
    '--color-primary-light': theme.primaryLight,
    '--color-primary-dark': theme.primaryDark,

    // Secondary colors
    '--color-secondary': theme.secondary,
    '--color-secondary-light': theme.secondaryLight,
    '--color-secondary-dark': theme.secondaryDark,

    // Accent colors
    '--color-accent': theme.accent,
    '--color-accent-light': theme.accentLight,
    '--color-accent-dark': theme.accentDark,

    // Background colors
    '--bg-main': theme.background.main,
    '--bg-surface': theme.background.surface,
    '--bg-overlay': theme.background.overlay,
    '--bg-gradient': theme.background.gradient,

    // Text colors
    '--text-primary': theme.text.primary,
    '--text-secondary': theme.text.secondary,
    '--text-inverse': theme.text.inverse,
    '--text-muted': theme.text.muted,

    // UI colors
    '--ui-border': theme.ui.border,
    '--ui-shadow': theme.ui.shadow,
    '--ui-success': theme.ui.success,
    '--ui-warning': theme.ui.warning,
    '--ui-error': theme.ui.error,
    '--ui-info': theme.ui.info,

    // Interactive states
    '--interactive-hover': theme.interactive.hover,
    '--interactive-active': theme.interactive.active,
    '--interactive-disabled': theme.interactive.disabled,
    '--interactive-focus': theme.interactive.focus,
  };
};
