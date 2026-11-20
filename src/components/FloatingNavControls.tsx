import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FloatingNavControlsProps {
  onOpenDiagnostics?: () => void;
}

export const FloatingNavControls: React.FC<FloatingNavControlsProps> = () => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footerElement = document.getElementById('footer') || document.querySelector('footer');
    let observer: IntersectionObserver | null = null;

    if (footerElement) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsFooterVisible(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '100px 0px 0px 0px',
          threshold: 0.05
        }
      );
      observer.observe(footerElement);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setShowScrollTop(scrollY > 350);

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
      className="fixed right-4 sm:right-6 bottom-6 z-30 flex flex-col items-end gap-2 pointer-events-none"
    >
      {!isFooterVisible && (
        <button
          id="floating-move-to-footer-btn"
          onClick={scrollToFooter}
          className={`pointer-events-auto group flex items-center gap-2 px-3 py-2 border backdrop-blur-md transition-colors text-xs font-mono ${
            isLight
              ? 'bg-white/95 hover:bg-zinc-950 border-zinc-300 hover:border-zinc-950 text-zinc-800 hover:text-white shadow-sm'
              : 'bg-zinc-950/95 hover:bg-white border-zinc-800 hover:border-white text-zinc-200 hover:text-zinc-950 shadow-sm'
          }`}
          title="Scroll down to Footer & Contact"
          aria-label="Move to Footer"
        >
          <span className="hidden sm:inline text-[11px]">Move to Footer</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}

      {showScrollTop && (
        <button
          id="floating-back-to-top-btn"
          onClick={scrollToTop}
          className={`pointer-events-auto group flex items-center gap-2 px-3 py-2 border backdrop-blur-md transition-colors text-xs font-mono ${
            isLight
              ? 'bg-white/95 hover:bg-zinc-950 border-zinc-300 hover:border-zinc-950 text-zinc-800 hover:text-white shadow-sm'
              : 'bg-zinc-950/95 hover:bg-white border-zinc-800 hover:border-white text-zinc-200 hover:text-zinc-950 shadow-sm'
          }`}
          title="Scroll to Top of Page"
          aria-label="Back to Top"
        >
          <span className="hidden sm:inline text-[11px]">Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}
    </aside>
  );
};
