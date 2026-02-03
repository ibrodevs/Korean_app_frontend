import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeType } from '../themes';

export type { ThemeType };

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme-mode');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Можно добавить автоматическое определение темы системы
        setIsDark(false);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setIsDark(false);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      AsyncStorage.setItem('theme-mode', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem('theme-mode', dark ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return {
    ...context,
    colors: context.theme,
  };
};