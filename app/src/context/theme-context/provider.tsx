import { useEffect, useState, type ReactNode } from 'react';
import type { ThemeName } from '../../config/theme-types';
import {
  getTheme,
  getNextTheme,
  generateCSSCustomProperties,
  THEME_NAMES,
  THEME_ORDER,
} from '../../config/themes';
import { ThemeContext } from './context';
import type { ThemeContextType } from './types';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Load theme from localStorage or default to 'dark'
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('spell-daily-theme');
    // Check if the saved theme is still valid (in case 'light' was removed)
    if (savedTheme && THEME_ORDER.includes(savedTheme as ThemeName)) {
      return savedTheme as ThemeName;
    }
    return 'dark';
  });

  const themeColors = getTheme(currentTheme);
  const themeName = THEME_NAMES[currentTheme];

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const cssProperties = generateCSSCustomProperties(themeColors);

    Object.entries(cssProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });
  }, [themeColors]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spell-daily-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  const nextTheme = () => {
    const next = getNextTheme(currentTheme);
    setCurrentTheme(next);
  };

  const value: ThemeContextType = {
    currentTheme,
    themeColors,
    themeName,
    setTheme,
    nextTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
