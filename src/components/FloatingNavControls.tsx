import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FloatingNavControlsProps {
  onOpenDiagnostics?: () => void;
}

export const FloatingNavControls: React.FC<FloatingNavControlsProps> = ({ onOpenDiagnostics }) => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // 1. IntersectionObserver directly observes the footer element
    const footerElement = document.getElementById('footer') || document.querySelector('footer');
    let observer: IntersectionObserver | null = null;

    if (footerElement) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          // When footer enters viewport or is near (within 100px)
          setIsFooterVisible(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '100px 0px 0px 0px', // Trigger slightly before it hits top of footer
          threshold: 0.05
        }
      );
      observer.observe(footerElement);
    }

    // 2. Fallback scroll handler for Back to Top and safety margin check
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show back to top if scrolled past 350px
      setShowScrollTop(scrollY > 350);

      // Fallback check: if footerElement is somehow not caught by observer
      if (!footerElement) {
        setIsFooterVisible(scrollY + windowHeight >= docHeight - 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer && footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  const scrollToFooter = () => {
    const footerElement = document.getElementById('footer') || document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <aside 
      aria-label="Page navigation shortcuts"
      className="fixed right-4 sm:right-6 top-20 z-40 flex flex-col items-end gap-2 pointer-events-none transition-all duration-300"
    >
      {/* Floating Move to Footer Button - REMOVED completely whenever footer is visible */}
      {!isFooterVisible && (
        <button
          id="floating-move-to-footer-btn"
          onClick={scrollToFooter}
          className={`pointer-events-auto group flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-95 text-xs font-semibold animate-in fade-in zoom-in-95 ${
            isLight
              ? 'bg-white/95 hover:bg-orange-600 border border-zinc-200/90 hover:border-orange-500 text-zinc-700 hover:text-white shadow-lg shadow-zinc-950/10'
              : 'bg-zinc-950/90 hover:bg-orange-600 border border-zinc-800 hover:border-orange-500 text-zinc-300 hover:text-white shadow-xl shadow-black/60'
          }`}
          title="Scroll down to Footer & Contact"
          aria-label="Move to Footer"
        >
          <span className={`hidden sm:inline text-[11px] font-mono tracking-tight transition-colors ${
            isLight
              ? 'text-zinc-700 group-hover:text-white font-medium'
              : 'text-zinc-400 group-hover:text-white'
          }`}>
            Move to Footer
          </span>
          <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            isLight
              ? 'bg-orange-50 border border-orange-200/70 text-orange-600 group-hover:bg-white/20 group-hover:border-transparent group-hover:text-white'
              : 'bg-orange-500/20 text-orange-400 group-hover:bg-white/20 group-hover:text-white'
          }`}>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </button>
      )}

      {/* Floating Back to Top Button (always available when scrolled down) */}
      {showScrollTop && (
        <button
          id="floating-back-to-top-btn"
          onClick={scrollToTop}
          className={`pointer-events-auto group flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-95 text-xs font-semibold animate-in fade-in zoom-in-95 ${
            isLight
              ? 'bg-white/95 hover:bg-orange-50 border border-zinc-200/90 hover:border-orange-300 text-zinc-700 hover:text-orange-600 shadow-lg shadow-zinc-950/10'
              : 'bg-zinc-950/90 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 text-zinc-300 hover:text-orange-400 shadow-xl shadow-black/60'
          }`}
          title="Scroll to Top of Page"
          aria-label="Back to Top"
        >
          <span className={`hidden sm:inline text-[11px] font-mono tracking-tight transition-colors ${
            isLight
              ? 'text-zinc-700 group-hover:text-orange-600 font-medium'
              : 'text-zinc-400 group-hover:text-orange-400'
          }`}>
            Back to Top
          </span>
          <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            isLight
              ? 'bg-zinc-100 border border-zinc-200/80 text-zinc-700 group-hover:bg-orange-500/15 group-hover:text-orange-600 group-hover:border-orange-200'
              : 'bg-zinc-800 text-zinc-400 group-hover:bg-orange-500/20 group-hover:text-orange-400'
          }`}>
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
        </button>
      )}
    </aside>
  );
};

