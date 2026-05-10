'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'theme';
const THEMES = ['light', 'dark'];

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return THEMES.includes(stored) ? stored : null;
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';

  root.classList.toggle('dark', isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children, initialTheme = 'light' }) {
  const [theme, setTheme] = useState(initialTheme);

  const syncTheme = useCallback((nextTheme, { persist = false } = {}) => {
    applyTheme(nextTheme);
    setTheme(nextTheme);

    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const resolveTheme = () => getStoredTheme() ?? getSystemTheme();

    syncTheme(resolveTheme());

    const handleChange = () => {
      if (!getStoredTheme()) {
        syncTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [syncTheme]);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    syncTheme(newTheme, { persist: true });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

