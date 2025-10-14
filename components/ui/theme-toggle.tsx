'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get current theme
    const getCurrentTheme = () => {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
    };

    const currentTheme = getCurrentTheme();
    setTheme(currentTheme);
    
    // Apply the theme
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Applied dark theme on mount');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Applied light theme on mount');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    
    setTheme(newTheme);
    
    // Update class and localStorage
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class');
    }
    
    localStorage.setItem('theme', newTheme);
    console.log('Saved theme to localStorage:', newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="bg-white/20 hover:bg-white/30 border-0 text-white"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="bg-white/20 hover:bg-white/30 border-0 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition-all duration-300"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}