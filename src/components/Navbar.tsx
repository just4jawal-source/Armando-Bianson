import React, { useState, useEffect } from 'react';
import { Sun, Moon, Lock, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigateToAdmin: () => void;
  isAdminView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToAdmin, isAdminView }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) {
      window.location.hash = id;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAFA]/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={(e) => {
            if (!isAdminView) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="group flex items-center gap-2 text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 transition-transform group-hover:scale-125 duration-200" />
          <span>Armando Bianson</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {!isAdminView ? (
            <>
              <button
                onClick={() => scrollToSection('work')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Contact
              </button>
            </>
          ) : (
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">
              Admin Portal
            </span>
          )}

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin link */}
          <button
            onClick={onNavigateToAdmin}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all font-medium ${
              isAdminView
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{isAdminView ? 'Exit Admin' : (isAdmin ? 'Dashboard' : 'Admin')}</span>
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-neutral-600 dark:text-neutral-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 dark:text-neutral-200"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAFA] dark:bg-[#0c0c0e] border-b border-neutral-200 dark:border-neutral-800 px-6 py-5 flex flex-col gap-4">
          {!isAdminView ? (
            <>
              <button
                onClick={() => scrollToSection('work')}
                className="text-left text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
              >
                Contact
              </button>
            </>
          ) : null}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200 py-1.5"
            >
              <Lock className="w-4 h-4 text-blue-600" />
              <span>{isAdminView ? 'Back to Portfolio' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
