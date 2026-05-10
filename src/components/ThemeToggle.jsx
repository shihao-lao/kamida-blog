'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div className="relative w-5 h-5">
        <Sun
          className="absolute inset-0 w-5 h-5 transition-all duration-300"
          style={{
            color: 'var(--warning)',
            opacity: theme === 'light' ? 1 : 0,
            transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
          }}
        />
        <Moon
          className="absolute inset-0 w-5 h-5 transition-all duration-300"
          style={{
            color: 'var(--brand-primary)',
            opacity: theme === 'dark' ? 1 : 0,
            transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
          }}
        />
      </div>
    </button>
  );
}

