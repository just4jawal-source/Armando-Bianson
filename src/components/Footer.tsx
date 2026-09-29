import React from 'react';
import { Lock, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const { isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-12 px-6 md:px-12 bg-[#FAFAFA] dark:bg-[#0c0c0e]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            Armando Bianson
          </p>
          <p className="text-neutral-400">
            Build. Automate. Create. — UGC & Generative AI Video Direction
          </p>
        </div>

        <div className="flex items-center gap-6">
          <p>© {currentYear} All rights reserved.</p>
          
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            onClick={onNavigateToAdmin}
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3 text-neutral-400" />
            <span>{isAdmin ? 'Dashboard' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
