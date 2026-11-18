import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Terminal, Sun, Moon } from 'lucide-react';

interface LoadingScreenProps {
  durationMs?: number;
  onComplete: () => void;
}

interface IntroPixel {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  durationMs = 5000,
  onComplete,
}) => {
  const { data, theme, toggleTheme } = usePortfolio();
  const isLight = theme === 'light';
  const { profile } = data;
  const displayName = (profile.name || 'Sandesh Vishwakarma').trim();

  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState<number>(110);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<IntroPixel[]>([]);
  const completedRef = useRef(false);

  const triggerExit = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setIsExiting(true);
    window.setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Lock background page scroll while loader is visible
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerExit]);

  // Build crisp pixel coordinates ensuring full name is always 100% visible and unclipped
  const buildPixels = useCallback(() => {
    const stageEl = stageRef.current;
    const canvas = canvasRef.current;
    if (!stageEl || !canvas) return;

    const stageRect = stageEl.getBoundingClientRect();
    if (stageRect.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const padX = 24;
    const padY = 16;
    const availWidth = Math.max(200, stageRect.width - padX * 2);

    // Responsive font size matching portfolio Hero/Display typography
    const isDesktop = window.innerWidth >= 1024;
    const isTablet = window.innerWidth >= 640;
    let fontSizePx = isDesktop ? 56 : isTablet ? 46 : 30;

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    const fontFamily = "'Archivo', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
    const setFont = (size: number) => {
      offCtx.font = `800 ${size}px ${fontFamily}`;
    };

    setFont(fontSizePx);

    // Build wrapped lines cleanly
    const wrapText = (): string[] => {
      const words = displayName.split(/\s+/);
      const wrapped: string[] = [];
      let current = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const next = `${current} ${words[i]}`;
        if (offCtx.measureText(next).width > availWidth && current.length > 0) {
          wrapped.push(current);
          current = words[i];
        } else {
          current = next;
        }
      }
      wrapped.push(current);
      return wrapped;
    };

    let lines = wrapText();

    // Shrink font slightly if any single word (e.g. "Vishwakarma") exceeds available width
    while (
      fontSizePx > 22 &&
      lines.some((line) => offCtx.measureText(line).width > availWidth)
    ) {
      fontSizePx -= 2;
      setFont(fontSizePx);
      lines = wrapText();
    }

    const lineHeight = Math.round(fontSizePx * 1.15);
    const totalTextHeight = lines.length * lineHeight;
    const width = Math.ceil(stageRect.width);
    const height = Math.ceil(totalTextHeight + padY * 2);

    setCanvasHeight(height);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.font = `800 ${fontSizePx}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = isLight ? '#09090b' : '#ffffff';

    const centerX = width / 2;
    lines.forEach((line, idx) => {
      ctx.fillText(line, centerX, padY + idx * lineHeight);
    });

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    const step = isTablet ? 3 : 2;
    const pSize = isTablet ? 2.8 : 2.1;
    const nextPixels: IntroPixel[] = [];

    for (let y = 0; y < canvas.height; y += step * dpr) {
      for (let x = 0; x < canvas.width; x += step * dpr) {
        const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        if (pixels[idx + 3] > 110) {
          const tx = x / dpr;
          const ty = y / dpr;
          const seed = Math.sin(tx * 12.9898 + ty * 78.233) * 43758.5453;
          const rand1 = seed - Math.floor(seed);
          const seed2 = Math.sin(tx * 39.346 + ty * 11.135) * 24634.6345;
          const rand2 = seed2 - Math.floor(seed2);

          const angle = rand1 * Math.PI * 2;
          const spread = 14 + rand2 * 44;
          const sx = Math.max(2, Math.min(width - 4, tx + Math.cos(angle) * spread));
          const sy = Math.max(2, Math.min(height - 4, ty + Math.sin(angle) * spread));

          nextPixels.push({
            x: sx,
            y: sy,
            startX: sx,
            startY: sy,
            targetX: tx,
            targetY: ty,
            size: pSize,
            delay: (tx / Math.max(1, width)) * 0.2,
          });
        }
      }
    }

    pixelsRef.current = nextPixels;
    ctx.clearRect(0, 0, width, height);
  }, [displayName, isLight]);

  // 5-second synchronized timeline & canvas pixel convergence loop
  useEffect(() => {
    buildPixels();

    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) buildPixels();
      });
    }

    const handleResize = () => buildPixels();
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / durationMs);
      const pct = Math.min(100, Math.round(ratio * 100));
      setProgress(pct);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        if (ctx && rect.width > 0 && rect.height > 0) {
          ctx.clearRect(0, 0, rect.width, rect.height);
          ctx.fillStyle = isLight ? '#09090b' : '#ffffff';

          const list = pixelsRef.current;
          for (let i = 0; i < list.length; i++) {
            const p = list[i];
            const localT = Math.max(0, Math.min(1, (ratio - p.delay) / 0.42));
            const eased = 1 - Math.pow(1 - localT, 3);
            p.x = p.startX + (p.targetX - p.startX) * eased;
            p.y = p.startY + (p.targetY - p.startY) * eased;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
      }

      if (ratio < 1 && !completedRef.current) {
        rafId = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        triggerExit();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [durationMs, buildPixels, isLight, triggerExit]);

  const remainingSeconds = Math.max(0, ((100 - progress) / 100) * (durationMs / 1000)).toFixed(1);

  const milestoneText =
    progress < 28
      ? 'Preparing workspace'
      : progress < 62
        ? 'Loading featured projects & skills'
        : progress < 92
          ? 'Formatting resume & showcase'
          : 'Portfolio ready';

  return (
    <div
      id="portfolio-loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-50 flex flex-col justify-between vercel-grid-bg transition-all duration-500 ${
        isLight ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-zinc-100 keep-dark'
      } ${isExiting ? 'opacity-0 pointer-events-none scale-[1.01]' : 'opacity-100'}`}
    >
      {/* Top Navbar-Matched Bar */}
      <div
        className={`w-full border-b backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/95 border-zinc-200 text-zinc-950'
            : 'bg-zinc-950/95 border-zinc-800 text-white keep-dark keep-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-tight whitespace-nowrap shrink-0">
            {displayName}
          </span>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight
                  ? 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900'
                  : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 keep-dark'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              id="skip-loading-btn"
              type="button"
              onClick={triggerExit}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLight
                  ? 'bg-zinc-950 text-white hover:bg-zinc-800 keep-dark keep-white'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200'
              }`}
            >
              <span>Enter Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Stage: Architectural Monochrome Developer Station */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6">
        <div
          className={`w-full max-w-3xl border transition-colors ${
            isLight
              ? 'bg-white border-zinc-200'
              : 'bg-zinc-950 border-zinc-800 keep-dark'
          }`}
        >
          {/* Slim Monochrome Developer Station Bar (Matches Hero.tsx) */}
          <div
            className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-4 ${
              isLight
                ? 'border-zinc-200 bg-zinc-50'
                : 'border-zinc-800 bg-zinc-900/50 keep-dark'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono min-w-0">
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              <span className={`font-semibold truncate ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                sandesh@dev-station:~
              </span>
              <span className={isLight ? 'text-zinc-400' : 'text-zinc-600'} aria-hidden="true">/</span>
              <span className={`truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                portfolio-init
              </span>
            </div>

            <span className={`text-xs font-mono font-semibold tabular-nums shrink-0 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {remainingSeconds}s
            </span>
          </div>

          {/* Center Display Content */}
          <div className="px-4 sm:px-8 py-8 sm:py-10 text-center">
            {/* Clean Unboxed Status Metadata Line (Matches Hero.tsx) */}
            <div
              className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-mono mb-4 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={isLight ? 'text-zinc-950' : 'text-white keep-white'}>{profile.status}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{profile.stats.currentSemester}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.location}</span>
            </div>

            {/* Full-Width Unclipped Pixel-Assembled Name Canvas */}
            <div
              ref={stageRef}
              style={{ height: `${canvasHeight}px` }}
              className="relative w-full flex items-center justify-center overflow-visible"
            >
              <canvas
                ref={canvasRef}
                className="block pointer-events-none"
              />
              <span className="sr-only">{displayName}</span>
            </div>

            {/* Role & Tagline (Matches Hero.tsx) */}
            <div
              className={`mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:text-base font-semibold tracking-tight ${
                isLight ? 'text-zinc-800' : 'text-zinc-200'
              }`}
            >
              <span>{profile.headline}</span>
              <span className={isLight ? 'text-zinc-300' : 'text-zinc-700'} aria-hidden="true">/</span>
              <span className={`font-mono text-xs sm:text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {profile.tagline}
              </span>
            </div>

            {/* Progress Track & Tabular Counter */}
            <div className="mt-7 max-w-xl mx-auto text-left">
              <div className="flex items-center justify-between gap-4 text-xs font-mono mb-2.5">
                <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
                  {milestoneText}
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isLight ? 'text-zinc-950' : 'text-white keep-white'
                  }`}
                >
                  {String(progress).padStart(3, '0')}%
                </span>
              </div>

              <div
                className={`w-full h-1.5 overflow-hidden ${
                  isLight ? 'bg-zinc-200' : 'bg-zinc-800'
                }`}
              >
                <div
                  style={{ width: `${progress}%` }}
                  className={`h-full transition-[width] duration-75 ease-linear ${
                    isLight ? 'bg-zinc-950 keep-dark' : 'bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4-Column Architectural Metrics Strip (Matches Hero.tsx) */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 border-t ${
              isLight ? 'border-zinc-200 bg-zinc-50/50' : 'border-zinc-800 bg-zinc-900/20 keep-dark'
            }`}
          >
            <div className={`p-4 border-b sm:border-b-0 border-r ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Projects
              </div>
              <div className={`mt-1 text-xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white keep-white'}`}>
                {profile.stats.projectsCount}
              </div>
            </div>

            <div className={`p-4 border-b sm:border-b-0 sm:border-r ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Skills
              </div>
              <div className={`mt-1 text-xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white keep-white'}`}>
                {profile.stats.technologiesCount}
              </div>
            </div>

            <div className={`p-4 border-r ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
              <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Certs
              </div>
              <div className={`mt-1 text-xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white keep-white'}`}>
                {profile.stats.certificationsCount}
              </div>
            </div>

            <div className="p-4">
              <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Phase
              </div>
              <div className={`mt-1 text-xs font-bold font-mono leading-tight pt-1 truncate ${isLight ? 'text-zinc-950' : 'text-white keep-white'}`}>
                {profile.stats.currentSemester}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer-Matched Bar */}
      <div
        className={`w-full border-t ${
          isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950 keep-dark'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono">
          <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
            © {new Date().getFullYear()} {displayName} · B.Sc. Information Technology
          </span>
          <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
            Press Esc or click Enter Portfolio to continue
          </span>
        </div>
      </div>
    </div>
  );
};
