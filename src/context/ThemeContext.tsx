
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';
import theme from '../theme';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof theme.lightColors | typeof theme.darkColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeType>(colorScheme === 'dark' ? 'dark' : 'light');
  console.log('Current theme mode:', themeMode);

  useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ThemeType }) => {
      setThemeMode(colorScheme);
    };
    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = themeMode === 'dark' ? theme.darkColors : theme.lightColors;

  return (
    <ThemeContext.Provider value={{ theme: themeMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
