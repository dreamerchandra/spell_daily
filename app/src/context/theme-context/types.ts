import type { ThemeName, ThemeColors } from '../../config/theme-types';

export interface ThemeContextType {
  currentTheme: ThemeName;
  themeColors: ThemeColors;
  themeName: string;
  setTheme: (theme: ThemeName) => void;
  nextTheme: () => void;
}
