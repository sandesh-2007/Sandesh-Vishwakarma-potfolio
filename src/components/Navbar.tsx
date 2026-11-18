import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Menu,
  X,
  FileText,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onOpenResumeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const { data, theme, toggleTheme } = usePortfolio();
  const isLight = theme === 'light';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('education');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'education',
        'projects',
        'experience',
        'certifications',
        'achievements',
        'resume',
        'contact'
      ];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Top bar concise single-line links
  const desktopLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  // Full mobile drawer directory preserving all sections
  const mobileLinks = [
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border-zinc-200 text-zinc-950'
          : 'bg-zinc-950/95 border-zinc-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          id="brand-logo"
          className={`text-sm sm:text-base font-extrabold uppercase tracking-tight whitespace-nowrap shrink-0 transition-opacity hover:opacity-75 ${
            isLight ? 'text-zinc-950' : 'text-white'
          }`}
        >
          {data.profile.name}
        </a>

        {/* Zone 2: Clean Architectural Nav Links (No Pills) */}
        <nav className="hidden md:flex items-center h-full">
          {desktopLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`h-full px-4 flex items-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                  isActive
                    ? isLight
                      ? 'border-zinc-950 text-zinc-950'
                      : 'border-white text-white'
                    : isLight
                      ? 'border-transparent text-zinc-500 hover:text-zinc-950'
                      : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + 1 Primary Monochrome Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className={`p-2 border transition-colors whitespace-nowrap shrink-0 ${
              isLight
                ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900'
                : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-100'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark and light mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            id="navbar-resume-btn"
            onClick={onOpenResumeModal}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                : 'bg-white text-zinc-950 hover:bg-zinc-200'
            }`}
            title="View & Download Sandesh's Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Resume</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2 shrink-0">
          <button
            id="mobile-theme-toggle"
            onClick={toggleTheme}
            className={`p-2 border ${
              isLight
                ? 'border-zinc-200 bg-white text-zinc-950'
                : 'border-zinc-800 bg-zinc-900 text-white'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="mobile-view-resume-btn"
            onClick={onOpenResumeModal}
            className={`p-2 border ${
              isLight
                ? 'border-zinc-950 bg-zinc-950 text-white'
                : 'border-white bg-white text-zinc-950'
            }`}
            aria-label="View Resume"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 border ${
              isLight
                ? 'border-zinc-200 bg-white text-zinc-950'
                : 'border-zinc-800 bg-zinc-900 text-white'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-5 space-y-4 ${
            isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {mobileLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 text-xs font-semibold border transition-colors ${
                  isLight
                    ? 'text-zinc-900 bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                    : 'text-zinc-200 bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenResumeModal();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>View / Download Resume</span>
          </button>
        </div>
      )}
    </header>
  );
};
