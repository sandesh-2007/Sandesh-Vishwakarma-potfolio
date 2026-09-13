import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const HoverGridBackground: React.FC = () => {
  const { theme } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);
  const posRef = useRef<{ x: number; y: number }>({ x: -500, y: -500 });
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Only bind pointer interactions if fine pointer or touch
    const handlePointerMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isHovered) {
        setIsHovered(true);
      }
      updateMask();
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    const updateMask = () => {
      if (gridContainerRef.current) {
        const { x, y } = posRef.current;
        const mask = `radial-gradient(circle 380px at ${x}px ${y}px, black 0%, rgba(0, 0, 0, 0.65) 45%, rgba(0, 0, 0, 0.15) 70%, transparent 100%)`;
        gridContainerRef.current.style.maskImage = mask;
        gridContainerRef.current.style.webkitMaskImage = mask;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isHovered]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-400 ease-out"
      style={{
        // Strict requirement: Opacity between 10% and 20% (0.15 = 15%) and only visible on hover!
        opacity: isHovered ? 0.15 : 0,
      }}
    >
      {/* Spotlight-masked Grid Layer */}
      <div
        ref={gridContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            theme === 'dark'
              ? `linear-gradient(to right, rgba(255, 255, 255, 0.95) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 1px, transparent 1px)`
              : `linear-gradient(to right, rgba(0, 0, 0, 0.9) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
};
