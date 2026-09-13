import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const CursorGlow: React.FC = () => {
  const { theme } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Position coordinates for high-performance rendering
  const cursorRef = useRef<{ x: number; y: number }>({ x: -200, y: -200 });
  const auraRef = useRef<{ x: number; y: number }>({ x: -200, y: -200 });
  const auraElemRef = useRef<HTMLDivElement>(null);
  const coreElemRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable if pointer device is fine (mouse / trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], label, .cursor-pointer')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth animation loop for silky fluid motion (lerp for aura, direct for core)
    const animate = () => {
      const targetX = cursorRef.current.x;
      const targetY = cursorRef.current.y;

      // Smooth lag effect for ambient neon aura
      auraRef.current.x += (targetX - auraRef.current.x) * 0.18;
      auraRef.current.y += (targetY - auraRef.current.y) * 0.18;

      if (auraElemRef.current) {
        auraElemRef.current.style.transform = `translate3d(${auraRef.current.x}px, ${auraRef.current.y}px, 0)`;
      }

      if (coreElemRef.current) {
        coreElemRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Outer Neon Ambient Light Aura */}
      <div
        ref={auraElemRef}
        className="absolute top-0 left-0 w-[360px] h-[360px] -ml-[180px] -mt-[180px] pointer-events-none transition-transform duration-75 ease-out"
        style={{
          willChange: 'transform',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(255, 115, 0, 0.28) 0%, rgba(249, 115, 22, 0.14) 30%, rgba(234, 88, 12, 0.05) 55%, transparent 70%)'
            : 'radial-gradient(circle, rgba(249, 115, 22, 0.22) 0%, rgba(251, 146, 60, 0.10) 35%, transparent 70%)',
          filter: 'blur(10px)',
          transform: `translate3d(${auraRef.current.x}px, ${auraRef.current.y}px, 0)`,
        }}
      />

      {/* Secondary Concentrated Neon Radiance */}
      <div
        ref={coreElemRef}
        className="absolute top-0 left-0 -ml-4 -mt-4 pointer-events-none transition-transform duration-[20ms] ease-out"
        style={{
          willChange: 'transform',
          transform: `translate3d(${cursorRef.current.x}px, ${cursorRef.current.y}px, 0)`,
        }}
      >
        {/* Core Neon Flare & Border Ring */}
        <div
          className={`transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered ? 'w-10 h-10 -ml-1 -mt-1 scale-125' : 'w-8 h-8 scale-100'
          }`}
        >
          {/* Inner pulsating neon orange core dot */}
          <div
            className={`rounded-full transition-all duration-200 ${
              isHovered
                ? 'w-3.5 h-3.5 bg-orange-400 border-2 border-white shadow-[0_0_15px_#ff6600,0_0_30px_#f97316]'
                : 'w-2.5 h-2.5 bg-orange-500 border border-orange-200 shadow-[0_0_10px_#ff6600,0_0_20px_#f97316]'
            }`}
          />
          {/* Outer glowing border ring */}
          <div
            className={`absolute inset-0 rounded-full border border-orange-500/50 transition-transform duration-300 ${
              isHovered ? 'scale-110 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'scale-90 border-orange-500/30'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
