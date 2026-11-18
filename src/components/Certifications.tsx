import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { DEFAULT_CERTIFICATIONS_SETTINGS } from '../data/initialData';
import { CertificationItem } from '../types';
import { CertificationCard } from './CertificationCard';
import { CertificateViewerModal } from './CertificateViewerModal';
import { UploadCertificateModal } from './UploadCertificateModal';

export const Certifications: React.FC = () => {
  const { data, theme, isAdmin, openAdminTab } = usePortfolio();
  const isLight = theme === 'light';

  const settings = useMemo(
    () => ({
      ...DEFAULT_CERTIFICATIONS_SETTINGS,
      ...(data.certificationsSettings || {}),
    }),
    [data.certificationsSettings]
  );

  // Only published/enabled certificates shown publicly, ordered by admin order
  const publishedCerts = useMemo<CertificationItem[]>(() => {
    return [...(data.certifications || [])]
      .filter((cert) => cert.enabled !== false)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [data.certifications]);

  const gapPx =
    settings.cardGap === 'compact' ? 12 : settings.cardGap === 'spacious' ? 28 : 20;
  const speedPxPerSec =
    settings.speed === 'slow' ? 24 : settings.speed === 'fast' ? 74 : 44;

  // Repeat tiles so seamless loop spans well beyond viewport width
  const repeatCount = useMemo(() => {
    const len = publishedCerts.length;
    if (len === 0) return 0;
    if (len === 1) return 6;
    if (len === 2) return 4;
    if (len === 3) return 3;
    return 2;
  }, [publishedCerts.length]);

  const repeatedItems = useMemo(() => {
    const list: Array<{ cert: CertificationItem; setIndex: number; itemIndex: number }> = [];
    for (let s = 0; s < repeatCount; s++) {
      publishedCerts.forEach((cert, idx) => {
        list.push({ cert, setIndex: s, itemIndex: idx });
      });
    }
    return list;
  }, [publishedCerts, repeatCount]);

  const [modalOpen, setModalOpen] = useState(false);
  const [certToEdit, setCertToEdit] = useState<CertificationItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState<CertificationItem | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidthPx, setCardWidthPx] = useState<number>(380);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const secondSetFirstCardRef = useRef<HTMLDivElement | null>(null);

  const offsetRef = useRef<number>(0);
  const loopWidthRef = useRef<number>(0);
  const stepWidthRef = useRef<number>(400);
  const velocityRef = useRef<number>(1);
  const targetVelocityRef = useRef<number>(1);
  const nudgeRemainingRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const dragMovedRef = useRef<boolean>(false);

  const computeCardWidth = useCallback(
    (containerWidth: number) => {
      if (containerWidth <= 0) return 360;
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

    const rect = first.getBoundingClientRect();
    const singleStep = rect.width + gapPx;
    stepWidthRef.current = singleStep;

    if (secondSetFirst) {
      const exactPeriod = secondSetFirst.offsetLeft - first.offsetLeft;
      if (exactPeriod > 0) {
        loopWidthRef.current = exactPeriod;
      }
    } else if (publishedCerts.length > 0) {
      loopWidthRef.current = singleStep * publishedCerts.length;
    }

    const lw = loopWidthRef.current;
    if (lw > 0) {
      if (offsetRef.current === 0) {
        offsetRef.current = settings.direction === 'ltr' ? -lw : 0;
      }
      while (offsetRef.current >= 0) offsetRef.current -= lw;
      while (offsetRef.current < -lw) offsetRef.current += lw;
      track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
    }
  }, [computeCardWidth, gapPx, publishedCerts.length, settings.direction]);

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

  // Reset cleanly when certificate list length changes
  useEffect(() => {
    offsetRef.current = 0;
    nudgeRemainingRef.current = 0;
    setActiveIndex(0);
    measureTrack();
  }, [publishedCerts.length, measureTrack]);

  // OS reduced motion preference
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
      viewerOpen ||
      modalOpen ||
      isDraggingRef.current;
    targetVelocityRef.current = shouldPause ? 0 : 1;
  }, [
    settings.autoScroll,
    settings.pauseOnHover,
    reducedMotion,
    isHovered,
    manualPaused,
    viewerOpen,
    modalOpen,
  ]);

  // Continuous seamless infinite scroll loop
  useEffect(() => {
    if (typeof window === 'undefined' || publishedCerts.length === 0) return;

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
        const targetVel = targetVelocityRef.current;
        const rate = targetVel === 0 ? 11 : 4.5;
        velocityRef.current += (targetVel - velocityRef.current) * Math.min(1, dt * rate);
        if (Math.abs(targetVel - velocityRef.current) < 0.002) {
          velocityRef.current = targetVel;
        }

        // Smooth manual step or indicator jump
        if (Math.abs(nudgeRemainingRef.current) > 0.25) {
          const nudgeStep = nudgeRemainingRef.current * Math.min(1, dt * 11);
          offsetRef.current += nudgeStep;
          nudgeRemainingRef.current -= nudgeStep;
        } else if (nudgeRemainingRef.current !== 0) {
          offsetRef.current += nudgeRemainingRef.current;
          nudgeRemainingRef.current = 0;
        }

        // Continuous auto scroll (LTR = positive offset direction; RTL = negative offset direction)
        if (settings.autoScroll && !reducedMotion && !isDraggingRef.current) {
          const dirSign = settings.direction === 'rtl' ? -1 : 1;
          offsetRef.current += dirSign * speedPxPerSec * velocityRef.current * dt;
        }

        // Wrap offset seamlessly inside [-loopWidth, 0)
        while (offsetRef.current >= 0) {
          offsetRef.current -= loopWidth;
        }
        while (offsetRef.current < -loopWidth) {
          offsetRef.current += loopWidth;
        }

        track.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;

        if (stepWidth > 0 && publishedCerts.length > 0) {
          const normalizedPos = (-offsetRef.current) % loopWidth;
          const computedIdx =
            Math.round(normalizedPos / stepWidth) % publishedCerts.length;
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
    publishedCerts.length,
    reducedMotion,
    settings.autoScroll,
    settings.direction,
    speedPxPerSec,
  ]);

  const stepCarousel = (direction: 'prev' | 'next') => {
    const step = stepWidthRef.current || cardWidthPx + gapPx;
    nudgeRemainingRef.current += direction === 'prev' ? step : -step;
  };

  const jumpToIndex = (targetIdx: number) => {
    const loopWidth = loopWidthRef.current;
    const step = stepWidthRef.current;
    if (!loopWidth || !step) return;

    const desiredOffset = -((targetIdx * step) % loopWidth);
    let delta = desiredOffset - offsetRef.current;
    if (delta > loopWidth / 2) delta -= loopWidth;
    if (delta < -loopWidth / 2) delta += loopWidth;
    nudgeRemainingRef.current = delta;
    setActiveIndex(targetIdx);
  };

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
      viewerOpen ||
      modalOpen;
    targetVelocityRef.current = shouldPause ? 0 : 1;
    // Allow click handlers on the releasing tick to read dragMovedRef safely before clearing
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 0);
  };

  const openNewCertModal = () => {
    setCertToEdit(null);
    setModalOpen(true);
  };

  const openEditCertModal = (cert: CertificationItem) => {
    setCertToEdit(cert);
    setModalOpen(true);
  };

  const handleViewCert = (cert: CertificationItem) => {
    if (dragMovedRef.current) return;
    setViewingCert(cert);
    setViewerOpen(true);
  };

  const statusText = reducedMotion
    ? 'Reduced Motion'
    : !settings.autoScroll
      ? 'Manual Mode'
      : (settings.pauseOnHover && isHovered) || manualPaused || viewerOpen || modalOpen
        ? 'Paused'
        : settings.direction === 'rtl'
          ? 'Auto-Scrolling Right to Left'
          : 'Auto-Scrolling Left to Right';

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className={`py-20 sm:py-24 border-b transition-colors ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
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
              07 · Credentials
            </p>
            <h2
              id="certifications-heading"
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              {settings.heading || 'Licenses & Certifications'}
            </h2>
            {settings.description && (
              <p
                className={`mt-3 max-w-xl text-sm sm:text-base ${
                  isLight ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                {settings.description}
              </p>
            )}
          </div>

          {/* Carousel Controls & Admin Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
            {publishedCerts.length > 0 && settings.showArrows && (
              <>
                <button
                  type="button"
                  id="cert-prev-btn"
                  onClick={() => stepCarousel('prev')}
                  aria-label="Scroll certificates left"
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
                  id="cert-next-btn"
                  onClick={() => stepCarousel('next')}
                  aria-label="Scroll certificates right"
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

            {publishedCerts.length > 0 && settings.autoScroll && !reducedMotion && (
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
              <>
                <button
                  type="button"
                  id="upload-new-cert-btn"
                  onClick={openNewCertModal}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-300 bg-white text-zinc-950 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white'
                      : 'border-zinc-700 bg-zinc-950 text-white hover:border-white hover:bg-white hover:text-zinc-950'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certificate</span>
                </button>

                <button
                  type="button"
                  id="admin-manage-certifications-btn"
                  onClick={() => openAdminTab('certifications')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'border-white bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Manage CMS</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Empty State */}
        {publishedCerts.length === 0 ? (
          <div
            className={`p-10 border text-center ${
              isLight
                ? 'border-zinc-200 bg-white text-zinc-500'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400'
            }`}
          >
            <p className="text-sm font-mono">No published certificates are currently visible.</p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => openAdminTab('certifications')}
                className={`mt-4 px-4 py-2 text-xs font-mono uppercase tracking-wider border ${
                  isLight
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-white bg-white text-zinc-950'
                }`}
              >
                Manage Certifications
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
              aria-label="Licenses and certifications carousel"
              className="relative overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
            >
              <div
                ref={trackRef}
                style={{ willChange: 'transform', gap: `${gapPx}px` }}
                className="flex items-stretch w-max"
              >
                {repeatedItems.map(({ cert, setIndex, itemIndex }) => {
                  const refProp =
                    setIndex === 0 && itemIndex === 0
                      ? firstCardRef
                      : setIndex === 1 && itemIndex === 0
                        ? secondSetFirstCardRef
                        : undefined;

                  return (
                    <div
                      key={`${cert.id}-set${setIndex}-idx${itemIndex}`}
                      ref={refProp}
                      aria-hidden={setIndex > 0 ? true : undefined}
                      style={{ width: `${cardWidthPx}px` }}
                      className="shrink-0"
                    >
                      <CertificationCard
                        cert={cert}
                        isLight={isLight}
                        onPreview={handleViewCert}
                        onEdit={isAdmin ? openEditCertModal : undefined}
                        className="h-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Indicators & Live Scroll Telemetry */}
            {(settings.showIndicators || publishedCerts.length > 0) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {settings.showIndicators ? (
                  <div
                    className="flex items-center gap-1.5"
                    role="tablist"
                    aria-label="Certificate slides"
                  >
                    {publishedCerts.map((cert, idx) => {
                      const isActive = activeIndex === idx;
                      return (
                        <button
                          key={`cert-ind-${cert.id}`}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-label={`Jump to ${cert.name}`}
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
                ) : (
                  <span />
                )}

                <div
                  className={`flex items-center gap-2 text-[11px] font-mono ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <span className="tabular-nums">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(publishedCerts.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{statusText}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <UploadCertificateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        certToEdit={certToEdit}
      />

      <CertificateViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        certificate={viewingCert}
      />
    </section>
  );
};
