import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Gem,
  MapPin,
  Pause,
  Play,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { DEFAULT_EXPERIENCE_SETTINGS } from '../data/initialData';
import { ExperienceItem } from '../types';
import { ExperienceCard } from './ExperienceCard';

export const Experience: React.FC = () => {
  const { data, theme, isAdmin, openAdminTab } = usePortfolio();
  const isLight = theme === 'light';

  const settings = useMemo(
    () => ({
      ...DEFAULT_EXPERIENCE_SETTINGS,
      ...(data.experienceSettings || {}),
    }),
    [data.experienceSettings]
  );

  // Only enabled/published experiences rendered for public visitors, sorted by admin order
  const publishedExperiences = useMemo<ExperienceItem[]>(() => {
    return [...(data.experience || [])]
      .filter((exp) => exp.enabled !== false)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [data.experience]);

  const gapPx =
    settings.cardGap === 'compact' ? 12 : settings.cardGap === 'spacious' ? 28 : 20;
  const speedPxPerSec =
    settings.speed === 'slow' ? 24 : settings.speed === 'fast' ? 72 : 42;

  // Repeat tiles cleanly so the seamless infinite track always spans > 2x viewport width
  const repeatCount = useMemo(() => {
    const len = publishedExperiences.length;
    if (len === 0) return 0;
    if (len === 1) return 6;
    if (len === 2) return 4;
    if (len === 3) return 3;
    return 2;
  }, [publishedExperiences.length]);

  const repeatedItems = useMemo(() => {
    const list: Array<{ exp: ExperienceItem; setIndex: number; itemIndex: number }> = [];
    for (let s = 0; s < repeatCount; s++) {
      publishedExperiences.forEach((exp, idx) => {
        list.push({ exp, setIndex: s, itemIndex: idx });
      });
    }
    return list;
  }, [publishedExperiences, repeatCount]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const secondSetFirstCardRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inspectedExp, setInspectedExp] = useState<ExperienceItem | null>(null);
  const [cardWidthPx, setCardWidthPx] = useState<number>(390);

  // Physics / scroll state refs for zero-jank 60fps loop
  const offsetRef = useRef<number>(0);
  const loopWidthRef = useRef<number>(0);
  const stepWidthRef = useRef<number>(430);
  const velocityRef = useRef<number>(1);
  const targetVelocityRef = useRef<number>(1);
  const nudgeRemainingRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const dragMovedRef = useRef<boolean>(false);

  const computeCardWidth = useCallback(
    (containerWidth: number) => {
      if (containerWidth <= 0) return 380;
      if (containerWidth >= 1024) {
        const cols = settings.desktopCards || 3;
        return Math.max(260, Math.floor((containerWidth - gapPx * (cols - 1)) / cols));
      }
      if (containerWidth >= 640) {
        return Math.max(270, Math.floor((containerWidth - gapPx) / 2));
      }
      return Math.max(250, Math.floor(containerWidth));
    },
    [settings.desktopCards, gapPx]
  );

  // Measure loop width & card step cleanly whenever layout or card count changes
  const measureTrack = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (viewport) {
      const vw = viewport.getBoundingClientRect().width;
      setCardWidthPx(computeCardWidth(vw));
    }

    const first = firstCardRef.current;
    const secondSetFirst = secondSetFirstCardRef.current;
    if (!first || !track) return;

    const cardRect = first.getBoundingClientRect();
    const singleCardStep = cardRect.width + gapPx;
    stepWidthRef.current = singleCardStep;

    if (secondSetFirst) {
      const exactPeriod = secondSetFirst.offsetLeft - first.offsetLeft;
      if (exactPeriod > 0) {
        loopWidthRef.current = exactPeriod;
      }
    } else if (publishedExperiences.length > 0) {
      loopWidthRef.current = singleCardStep * publishedExperiences.length;
    }

    // Ensure initial offset sits cleanly inside [-loopWidth, 0)
    const lw = loopWidthRef.current;
    if (lw > 0) {
      if (offsetRef.current === 0) {
        offsetRef.current = settings.direction === 'ltr' ? -lw : 0;
      }
      while (offsetRef.current >= 0) offsetRef.current -= lw;
      while (offsetRef.current < -lw) offsetRef.current += lw;
      track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
    }
  }, [computeCardWidth, gapPx, publishedExperiences.length, settings.direction]);

  useEffect(() => {
    measureTrack();
    if (typeof ResizeObserver === 'undefined' || !viewportRef.current) return;
    const observer = new ResizeObserver(() => measureTrack());
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [measureTrack]);

  // Re-measure cleanly after cardWidthPx updates
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => measureTrack());
    return () => window.cancelAnimationFrame(raf);
  }, [cardWidthPx, measureTrack]);

  // Reset offset if experience list shrinks or resets
  useEffect(() => {
    offsetRef.current = 0;
    nudgeRemainingRef.current = 0;
    setActiveIndex(0);
    measureTrack();
  }, [publishedExperiences.length, measureTrack]);

  // Detect OS reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const shouldPause =
      !settings.autoScroll ||
      reducedMotion ||
      (settings.pauseOnHover && isHovered) ||
      manualPaused ||
      Boolean(inspectedExp) ||
      isDraggingRef.current;
    targetVelocityRef.current = shouldPause ? 0 : 1;
  }, [
    settings.autoScroll,
    settings.pauseOnHover,
    isHovered,
    manualPaused,
    reducedMotion,
    inspectedExp,
  ]);

  // Continuous infinite animation loop (LTR / RTL configurable)
  useEffect(() => {
    if (typeof window === 'undefined' || publishedExperiences.length === 0) return;

    let rafId = 0;
    let lastTime = performance.now();
    let lastReportedIndex = -1;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const track = trackRef.current;
      const loopWidth = loopWidthRef.current;
      const stepWidth = stepWidthRef.current;

      if (track && loopWidth > 0) {
        // Smooth velocity easing on pause/resume
        const targetVel = targetVelocityRef.current;
        const rate = targetVel === 0 ? 11 : 4.5;
        velocityRef.current += (targetVel - velocityRef.current) * Math.min(1, dt * rate);
        if (Math.abs(targetVel - velocityRef.current) < 0.002) {
          velocityRef.current = targetVel;
        }

        // Smooth manual navigation / indicator nudge
        if (Math.abs(nudgeRemainingRef.current) > 0.25) {
          const nudgeStep = nudgeRemainingRef.current * Math.min(1, dt * 11);
          offsetRef.current += nudgeStep;
          nudgeRemainingRef.current -= nudgeStep;
        } else if (nudgeRemainingRef.current !== 0) {
          offsetRef.current += nudgeRemainingRef.current;
          nudgeRemainingRef.current = 0;
        }

        // Continuous scroll (LTR = positive offset direction; RTL = negative offset direction)
        if (settings.autoScroll && !reducedMotion && !isDraggingRef.current) {
          const dirSign = settings.direction === 'rtl' ? -1 : 1;
          offsetRef.current += dirSign * speedPxPerSec * velocityRef.current * dt;
        }

        // Seamless wrap within [-loopWidth, 0)
        while (offsetRef.current >= 0) {
          offsetRef.current -= loopWidth;
        }
        while (offsetRef.current < -loopWidth) {
          offsetRef.current += loopWidth;
        }

        track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;

        // Update active indicator cleanly only when index changes
        if (stepWidth > 0 && publishedExperiences.length > 0) {
          const normalizedPos = (-offsetRef.current) % loopWidth;
          const computedIdx =
            Math.round(normalizedPos / stepWidth) % publishedExperiences.length;
          if (computedIdx !== lastReportedIndex) {
            lastReportedIndex = computedIdx;
            setActiveIndex(computedIdx);
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    publishedExperiences.length,
    reducedMotion,
    settings.autoScroll,
    settings.direction,
    speedPxPerSec,
  ]);

  // Manual prev / next navigation (scrolls cleanly by 1 card)
  const stepCarousel = (direction: 'prev' | 'next') => {
    const step = stepWidthRef.current || cardWidthPx + gapPx;
    nudgeRemainingRef.current += direction === 'prev' ? step : -step;
  };

  // Jump cleanly to a specific indicator index
  const jumpToIndex = (targetIdx: number) => {
    const loopWidth = loopWidthRef.current;
    const step = stepWidthRef.current;
    if (!loopWidth || !step) return;

    const desiredOffset = -((targetIdx * step) % loopWidth);
    let delta = desiredOffset - offsetRef.current;
    // Take shortest modular path
    if (delta > loopWidth / 2) delta -= loopWidth;
    if (delta < -loopWidth / 2) delta += loopWidth;
    nudgeRemainingRef.current = delta;
    setActiveIndex(targetIdx);
  };

  // Touch / mouse pointer horizontal drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    dragMovedRef.current = false;
    nudgeRemainingRef.current = 0;
    targetVelocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      dragMovedRef.current = true;
    }
    const loopWidth = loopWidthRef.current;
    if (loopWidth > 0 && trackRef.current) {
      let next = dragStartOffsetRef.current + dx;
      while (next >= 0) next -= loopWidth;
      while (next < -loopWidth) next += loopWidth;
      offsetRef.current = next;
      trackRef.current.style.transform = `translate3d(${next.toFixed(2)}px, 0, 0)`;
    }
  };

  const handlePointerEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const shouldPause =
      !settings.autoScroll ||
      reducedMotion ||
      (settings.pauseOnHover && isHovered) ||
      manualPaused ||
      Boolean(inspectedExp);
    targetVelocityRef.current = shouldPause ? 0 : 1;
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  const statusText = reducedMotion
    ? 'Reduced Motion'
    : !settings.autoScroll
      ? 'Manual Mode'
      : (settings.pauseOnHover && isHovered) || manualPaused || inspectedExp
        ? 'Paused · Hover/Inspect'
        : settings.direction === 'rtl'
          ? 'Auto-Scrolling Right to Left'
          : 'Auto-Scrolling Left to Right';

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={`py-20 sm:py-24 border-b transition-colors ${
        isLight ? 'border-zinc-200 bg-zinc-50/40' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Header */}
        <div
          className={`pb-10 mb-10 border-b flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          <div>
            <p
              className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              04 · Work History
            </p>
            <h2
              id="experience-heading"
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              {settings.heading || 'Experience'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:items-end lg:flex-col">
            {settings.description && (
              <p
                className={`max-w-xl text-sm sm:text-base lg:text-right ${
                  isLight ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                {settings.description}
              </p>
            )}

            {/* Controls: Arrows, Play/Pause, Admin shortcut */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
              {publishedExperiences.length > 0 && settings.showArrows && (
                <>
                  <button
                    type="button"
                    id="exp-prev-btn"
                    onClick={() => stepCarousel('prev')}
                    aria-label="Scroll experience cards left"
                    className={`p-2 border transition-colors ${
                      isLight
                        ? 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white'
                        : 'border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-white hover:bg-white hover:text-zinc-950'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    id="exp-next-btn"
                    onClick={() => stepCarousel('next')}
                    aria-label="Scroll experience cards right"
                    className={`p-2 border transition-colors ${
                      isLight
                        ? 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white'
                        : 'border-zinc-700 bg-zinc-950 text-zinc-100 hover:border-white hover:bg-white hover:text-zinc-950'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {publishedExperiences.length > 0 && settings.autoScroll && !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setManualPaused((p) => !p)}
                  aria-pressed={manualPaused}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-white hover:text-white'
                  }`}
                >
                  {manualPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{manualPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  id="admin-manage-experience-btn"
                  onClick={() => openAdminTab('experience')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'border-white bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Manage Experience</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {publishedExperiences.length === 0 ? (
          <div
            className={`p-10 border text-center ${
              isLight
                ? 'border-zinc-200 bg-white text-zinc-500'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400'
            }`}
          >
            <p className="text-sm font-mono">No published experiences are currently visible.</p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => openAdminTab('experience')}
                className={`mt-4 px-4 py-2 text-xs font-mono uppercase tracking-wider border ${
                  isLight
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-white bg-white text-zinc-950'
                }`}
              >
                Add or Enable Experiences
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Infinite Horizontal Viewport */}
            <div
              ref={viewportRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              role="region"
              aria-roledescription="carousel"
              aria-label="Experience timeline carousel"
              className="relative overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
            >
              <div
                ref={trackRef}
                style={{ willChange: 'transform', gap: `${gapPx}px` }}
                className="flex items-stretch w-max"
              >
                {repeatedItems.map(({ exp, setIndex, itemIndex }) => {
                  const refProp =
                    setIndex === 0 && itemIndex === 0
                      ? firstCardRef
                      : setIndex === 1 && itemIndex === 0
                        ? secondSetFirstCardRef
                        : undefined;

                  return (
                    <div
                      key={`${exp.id}-set${setIndex}-idx${itemIndex}`}
                      ref={refProp}
                      aria-hidden={setIndex > 0 ? true : undefined}
                      style={{ width: `${cardWidthPx}px` }}
                      onClick={() => {
                        if (!dragMovedRef.current) {
                          setInspectedExp(exp);
                        }
                      }}
                      className="shrink-0 cursor-pointer"
                    >
                      <ExperienceCard
                        exp={exp}
                        isLight={isLight}
                        onInspect={(item) => {
                          if (!dragMovedRef.current) {
                            setInspectedExp(item);
                          }
                        }}
                        className="h-full min-h-[256px]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle Navigation Indicators + Status */}
            {settings.showIndicators && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Experience cards">
                  {publishedExperiences.map((exp, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={`ind-${exp.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Jump to ${exp.role} at ${exp.organization}`}
                        onClick={() => jumpToIndex(idx)}
                        className={`h-1.5 transition-all duration-300 ${
                          isActive
                            ? isLight
                              ? 'w-8 bg-zinc-950'
                              : 'w-8 bg-white'
                            : isLight
                              ? 'w-3 bg-zinc-300 hover:bg-zinc-500'
                              : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                        }`}
                      />
                    );
                  })}
                </div>

                <div
                  className={`flex items-center gap-2 text-[11px] font-mono ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <span className="tabular-nums">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(publishedExperiences.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{statusText}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Monochrome Experience Full Detail Modal */}
      {inspectedExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setInspectedExp(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${inspectedExp.role} details`}
            className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto border border-zinc-800 bg-zinc-950 text-white p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 border border-zinc-800 bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                  {inspectedExp.logoUrl ? (
                    <img
                      src={inspectedExp.logoUrl}
                      alt={`${inspectedExp.organization} logo`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-zinc-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{inspectedExp.role}</h3>
                  <p className="text-sm font-medium text-zinc-300 mt-0.5">
                    {inspectedExp.organization}
                    {inspectedExp.type ? ` · ${inspectedExp.type}` : ''}
                  </p>
                  <p className="text-xs font-mono text-zinc-400 mt-1 tabular-nums">
                    {inspectedExp.startDate} —{' '}
                    {inspectedExp.isCurrent ? 'Present' : inspectedExp.endDate}
                  </p>
                  {(inspectedExp.location || inspectedExp.workMode) && (
                    <p className="text-xs font-mono text-zinc-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {[inspectedExp.location, inspectedExp.workMode].filter(Boolean).join(' · ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedExp(null)}
                className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                aria-label="Close experience detail modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inspectedExp.description && (
              <p className="text-sm leading-relaxed text-zinc-300">{inspectedExp.description}</p>
            )}

            {inspectedExp.responsibilities && inspectedExp.responsibilities.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Responsibilities
                </h4>
                <ul className="space-y-2">
                  {inspectedExp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2.5 text-sm text-zinc-200">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-zinc-300" />
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {inspectedExp.achievements && inspectedExp.achievements.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {inspectedExp.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5 text-sm text-zinc-200">
                      <Award className="w-4 h-4 mt-0.5 shrink-0 text-zinc-300" />
                      <span className="leading-relaxed">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {inspectedExp.skills && inspectedExp.skills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5" />
                  <span>Associated Skills</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedExp.skills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
