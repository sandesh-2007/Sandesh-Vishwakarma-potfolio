import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Menu, 
  X, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Award, 
  Mail,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  onOpenResumeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const { data, theme, toggleTheme } = usePortfolio();
  const isLight = theme === 'light';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section detection
      const sections = ['about', 'education', 'other-skills', 'skills', 'projects', 'experience', 'certifications', 'achievements', 'resume', 'contact'];
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

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Other Skills', href: '#other-skills' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-zinc-800 shadow-lg shadow-black/60 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Name (Orange Logo Removed as requested) */}
        <a 
          href="#top" 
          className="group flex flex-col focus:outline-none"
          id="brand-logo"
        >
          <span className="font-bold text-base text-white tracking-tight group-hover:text-orange-400 transition-colors">
            {data.profile.name}
          </span>
          <span className="text-[11px] font-mono text-orange-400 tracking-wide">
            {data.profile.headline}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-800">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-orange-600 border border-orange-500/50 shadow-sm' 
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 border transition-all duration-300 group shadow-sm bg-zinc-900 border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/80"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark and light mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-xs font-semibold text-zinc-300 group-hover:text-amber-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-orange-500 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="text-xs font-semibold text-zinc-700 group-hover:text-orange-600">Dark Mode</span>
              </>
            )}
          </button>

          {/* View Resume CTA in Header */}
          <button
            id="navbar-resume-btn"
            onClick={onOpenResumeModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md shadow-orange-950/40 hover:shadow-orange-500/25 transition-all duration-300 active:scale-95"
            title="View & Download Sandesh's Resume"
          >
            <FileText className="w-4 h-4" />
            <span>View Resume</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Mobile Theme Toggle */}
          <button
            id="mobile-theme-toggle"
            onClick={toggleTheme}
            className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-300"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-orange-500" />
            )}
          </button>

          {/* Mobile View Resume Button */}
          <button
            id="mobile-view-resume-btn"
            onClick={onOpenResumeModal}
            className="p-2 border border-orange-500/50 bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm"
            title="View Resume"
            aria-label="View Resume"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800 px-6 py-5 mt-3 space-y-4 shadow-2xl">
          {/* Theme switcher inside mobile drawer */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-500" />}
              <span>Theme</span>
            </span>
            <span className="text-orange-400 font-mono text-[11px]">
              {theme === 'dark' ? 'Dark Mode (Tap for Light)' : 'Light Mode (Tap for Dark)'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:text-orange-400 hover:border-orange-500/40 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-950/50"
            >
              <FileText className="w-4 h-4" />
              <span>View / Download Resume</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
