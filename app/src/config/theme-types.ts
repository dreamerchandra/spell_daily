export type ThemeName = 'dark' | 'purple' | 'ocean' | 'sunset';

// Theme interface for consistent structure
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;

  // Background colors
  background: {
    main: string;
    surface: string;
    overlay: string;
    gradient: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    inverse: string;
    muted: string;
  };

  // UI element colors
  ui: {
    border: string;
    shadow: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Interactive states
  interactive: {
    hover: string;
    active: string;
    disabled: string;
    focus: string;
  };
}
