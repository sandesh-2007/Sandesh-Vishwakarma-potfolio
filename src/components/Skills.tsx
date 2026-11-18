import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FolderGit2, Pause, Play, SlidersHorizontal, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillItem } from '../types';
import { SkillIcon } from './SkillIcon';

interface OrbitMetrics {
  rx: number;
  ry: number;
  stageWidth: number;
  stageHeight: number;
  compact: boolean;
}

function getOrbitMetrics(width: number): OrbitMetrics {
  const safeWidth = Math.max(300, width || 720);
  if (safeWidth < 520) {
    const rx = Math.min(safeWidth * 0.37, 150);
    return {
      rx,
      ry: rx * 0.56,
      stageWidth: safeWidth,
      stageHeight: 360,
      compact: true,
    };
  }
  if (safeWidth < 768) {
    const rx = Math.min(safeWidth * 0.39, 225);
    return {
      rx,
      ry: rx * 0.48,
      stageWidth: safeWidth,
      stageHeight: 380,
      compact: false,
    };
  }
  const rx = Math.min(safeWidth * 0.39, 315);
  return {
    rx,
    ry: rx * 0.46,
    stageWidth: safeWidth,
    stageHeight: 450,
    compact: false,
  };
}

export const Skills: React.FC = () => {
  const { data, theme, isAdmin, openAdminTab } = usePortfolio();
  const isLight = theme === 'light';

  // Only enabled skills are displayed in the public orbit, ordered consistently
  const visibleSkills = useMemo<SkillItem[]>(() => {
    return [...(data.skills || [])]
      .filter((skill) => skill.enabled !== false)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [data.skills]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [stageWidth, setStageWidth] = useState<number>(820);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [manualPaused, setManualPaused] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Active inspected skill ID (hover takes immediate priority, then focus, then mobile/click pin)
  const activeId = hoveredId ?? focusedId ?? pinnedId;

  const activeSkill = useMemo(() => {
    if (!activeId) return null;
    return visibleSkills.find((s) => s.id === activeId) || null;
  }, [activeId, visibleSkills]);

  // Clear stale IDs if skills are edited or disabled in Admin
  useEffect(() => {
    if (hoveredId && !visibleSkills.some((s) => s.id === hoveredId)) setHoveredId(null);
    if (focusedId && !visibleSkills.some((s) => s.id === focusedId)) setFocusedId(null);
    if (pinnedId && !visibleSkills.some((s) => s.id === pinnedId)) setPinnedId(null);
  }, [visibleSkills, hoveredId, focusedId, pinnedId]);

  // Respect user's prefers-reduced-motion OS setting
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

  // Measure orbit stage width responsively
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setStageWidth(rect.width);
      }
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metrics = useMemo(() => getOrbitMetrics(stageWidth), [stageWidth]);

  // Animation refs to keep 60fps without React state re-renders
  const angleRef = useRef<number>(0);
  const velocityRef = useRef<number>(1);
  const targetVelocityRef = useRef<number>(1);
  const activeIdRef = useRef<string | null>(null);
  const metricsRef = useRef<OrbitMetrics>(metrics);
  const skillsRef = useRef<SkillItem[]>(visibleSkills);

  useEffect(() => {
    const shouldPause = Boolean(activeId) || manualPaused || reducedMotion;
    targetVelocityRef.current = shouldPause ? 0 : 1;
    activeIdRef.current = activeId;
  }, [activeId, manualPaused, reducedMotion]);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    skillsRef.current = visibleSkills;
  }, [visibleSkills]);

  // Apply orbital transforms directly to DOM nodes for smooth 60fps performance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId = 0;
    let lastTime = performance.now();

    const applyPositions = (baseAngle: number) => {
      const list = skillsRef.current;
      const count = list.length;
      if (count === 0) return;

      const { rx, ry } = metricsRef.current;
      const currentActiveId = activeIdRef.current;

      for (let i = 0; i < count; i++) {
        const skill = list[i];
        const el = nodeRefs.current[skill.id];
        if (!el) continue;

        const theta = baseAngle + (i / count) * Math.PI * 2;
        const x = rx * Math.cos(theta);
        const y = ry * Math.sin(theta);

        // 3D depth factor: 0 at far back (-ry), 1 at near front (+ry)
        const depth = (Math.sin(theta) + 1) / 2;
        const isSelected = currentActiveId === skill.id;
        const depthScale = 0.8 + 0.28 * depth;
        const finalScale = isSelected ? Math.max(depthScale * 1.18, 1.24) : depthScale;

        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${finalScale.toFixed(3)})`;
        el.style.opacity = isSelected ? '1' : (0.58 + 0.42 * depth).toFixed(3);
        el.style.zIndex = isSelected ? '50' : String(Math.round(10 + depth * 30));

        // Position the contextual detail popup directly beside the active skill node
        if (isSelected && popupRef.current) {
          const popupEl = popupRef.current;
          const { stageWidth: sw, stageHeight: sh, compact } = metricsRef.current;
          const popupW = popupEl.offsetWidth || (compact ? 250 : 300);
          const popupH = popupEl.offsetHeight || 200;

          const nodeCenterX = sw / 2 + x;
          const nodeCenterY = sh / 2 + y;
          const gap = 26;

          // Place popup to the side / below / above the skill, always clamped within stage bounds
          let left = nodeCenterX + 16;
          if (nodeCenterX > sw * 0.55) {
            left = nodeCenterX - popupW - 16;
          }
          left = Math.max(10, Math.min(sw - popupW - 10, left));

          let top = y < 0 ? nodeCenterY + gap : nodeCenterY - popupH - gap;
          // If opposite vertical placement overflows, fall back to safe vertical clamp
          if (top < 10) {
            top = Math.min(sh - popupH - 10, nodeCenterY + gap);
          } else if (top + popupH > sh - 10) {
            top = Math.max(10, nodeCenterY - popupH - gap);
          }
          top = Math.max(10, Math.min(sh - popupH - 10, top));

          popupEl.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Smoothly ease angular velocity toward target (0 when paused, 1 when rotating)
      const targetVel = targetVelocityRef.current;
      const easeRate = targetVel === 0 ? 10 : 5.5;
      velocityRef.current += (targetVel - velocityRef.current) * Math.min(1, dt * easeRate);
      if (Math.abs(targetVel - velocityRef.current) < 0.002) {
        velocityRef.current = targetVel;
      }

      // Base angular speed (~0.24 rad/s => full revolution in ~26 seconds)
      if (!reducedMotion) {
        angleRef.current = (angleRef.current + dt * 0.24 * velocityRef.current) % (Math.PI * 2);
      }

      applyPositions(angleRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    applyPositions(angleRef.current);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, visibleSkills.length, metrics.rx, metrics.ry]);

  // Synchronously position the popup on mount/change to prevent any top-left (0,0) flash
  useLayoutEffect(() => {
    if (!activeId || !popupRef.current) return;
    const list = skillsRef.current;
    const count = list.length;
    const idx = list.findIndex((s) => s.id === activeId);
    if (idx === -1 || count === 0) return;

    const { rx, ry, stageWidth: sw, stageHeight: sh, compact } = metricsRef.current;
    const theta = angleRef.current + (idx / count) * Math.PI * 2;
    const x = rx * Math.cos(theta);
    const y = ry * Math.sin(theta);

    const popupEl = popupRef.current;
    const popupW = popupEl.offsetWidth || (compact ? 250 : 300);
    const popupH = popupEl.offsetHeight || 200;

    const nodeCenterX = sw / 2 + x;
    const nodeCenterY = sh / 2 + y;
    const gap = 26;

    let left = nodeCenterX + 16;
    if (nodeCenterX > sw * 0.55) {
      left = nodeCenterX - popupW - 16;
    }
    left = Math.max(10, Math.min(sw - popupW - 10, left));

    let top = y < 0 ? nodeCenterY + gap : nodeCenterY - popupH - gap;
    if (top < 10) {
      top = Math.min(sh - popupH - 10, nodeCenterY + gap);
    } else if (top + popupH > sh - 10) {
      top = Math.max(10, nodeCenterY - popupH - gap);
    }
    top = Math.max(10, Math.min(sh - popupH - 10, top));

    popupEl.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
  }, [activeId, metrics]);

  // Global Escape key dismisses active panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (hoveredId || focusedId || pinnedId)) {
        setHoveredId(null);
        setFocusedId(null);
        setPinnedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredId, focusedId, pinnedId]);

  const handleNodeClick = (skillId: string) => {
    // On touch / explicit click, toggle pin cleanly
    setPinnedId((prev) => (prev === skillId ? null : skillId));
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className={`py-20 sm:py-24 border-b transition-colors ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Section Header */}
        <div
          className={`pb-10 mb-10 border-b flex flex-col md:flex-row md:items-end justify-between gap-4 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          <div>
            <p
              className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              03 · Interactive Stack
            </p>
            <h2
              id="skills-heading"
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              Skills & Technologies
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:items-end md:flex-col">
            <p className={`max-w-xl text-sm sm:text-base md:text-right ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Hover, focus, or select any technology in orbit to inspect capabilities and related builds.
            </p>

            <div className="flex items-center gap-2 self-start md:self-end">
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setManualPaused((p) => !p)}
                  aria-pressed={manualPaused}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-white hover:text-white'
                  }`}
                >
                  {manualPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{manualPaused ? 'Resume Orbit' : 'Pause Orbit'}</span>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  id="admin-manage-skills-btn"
                  onClick={() => openAdminTab('skills')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors ${
                    isLight
                      ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'border-white bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Manage Skills</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactive 3D Orbit Frame */}
        <div
          className={`border relative overflow-hidden ${
            isLight ? 'border-zinc-200 bg-zinc-50/35' : 'border-zinc-800 bg-zinc-950'
          }`}
        >
          {/* Top Subtle Telemetry Bar */}
          <div
            className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between text-[11px] font-mono ${
              isLight ? 'border-zinc-200 bg-white text-zinc-500' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeId || manualPaused || reducedMotion
                    ? isLight
                      ? 'bg-zinc-400'
                      : 'bg-zinc-600'
                    : isLight
                      ? 'bg-zinc-950 animate-pulse'
                      : 'bg-white animate-pulse'
                }`}
              />
              <span>
                {reducedMotion
                  ? 'REDUCED MOTION MODE'
                  : activeId
                    ? `INSPECTING · ${activeSkill?.name.toUpperCase() || ''}`
                    : manualPaused
                      ? 'ORBIT PAUSED'
                      : '3D ORBIT ACTIVE'}
              </span>
            </div>
            <span className="tabular-nums">
              {visibleSkills.length} {visibleSkills.length === 1 ? 'SKILL' : 'SKILLS'} ENABLED
            </span>
          </div>

          {/* Main 3D Orbital Stage */}
          <div
            ref={stageRef}
            onClick={(e) => {
              if (e.target === e.currentTarget && pinnedId) {
                setPinnedId(null);
              }
            }}
            style={{ height: `${metrics.stageHeight}px` }}
            className="relative w-full select-none overflow-hidden"
          >
            {visibleSkills.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className={`text-sm font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  No enabled skills are currently configured in the stack.
                </p>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAdminTab('skills')}
                    className={`mt-4 px-4 py-2 text-xs font-mono uppercase tracking-wider border ${
                      isLight
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-white bg-white text-zinc-950'
                    }`}
                  >
                    Enable or Add Skills
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Elliptical 3D Orbital SVG Track Rings & Axis Guides */}
                <svg
                  className="pointer-events-none absolute inset-0 w-full h-full"
                  viewBox={`0 0 ${metrics.stageWidth} ${metrics.stageHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  {/* Vertical & Horizontal Hairline Crosshairs */}
                  <line
                    x1={metrics.stageWidth / 2}
                    y1={24}
                    x2={metrics.stageWidth / 2}
                    y2={metrics.stageHeight - 24}
                    stroke={isLight ? '#e4e4e7' : '#27272a'}
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                  <line
                    x1={Math.max(20, metrics.stageWidth / 2 - metrics.rx - 36)}
                    y1={metrics.stageHeight / 2}
                    x2={Math.min(metrics.stageWidth - 20, metrics.stageWidth / 2 + metrics.rx + 36)}
                    y2={metrics.stageHeight / 2}
                    stroke={isLight ? '#e4e4e7' : '#27272a'}
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />

                  {/* Primary 3D Tilted Elliptical Orbit Path */}
                  <ellipse
                    cx={metrics.stageWidth / 2}
                    cy={metrics.stageHeight / 2}
                    rx={metrics.rx}
                    ry={metrics.ry}
                    fill="none"
                    stroke={isLight ? '#d4d4d8' : '#3f3f46'}
                    strokeWidth="1"
                  />

                  {/* Subtle Secondary Concentric Track */}
                  <ellipse
                    cx={metrics.stageWidth / 2}
                    cy={metrics.stageHeight / 2}
                    rx={metrics.rx * 0.72}
                    ry={metrics.ry * 0.72}
                    fill="none"
                    stroke={isLight ? '#e4e4e7' : '#27272a'}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Central Label: MY TECH STACK */}
                <div
                  style={{ zIndex: 22 }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center"
                >
                  <div
                    className={`px-4 sm:px-6 py-3 sm:py-3.5 border backdrop-blur-sm transition-colors ${
                      isLight
                        ? 'bg-white/95 border-zinc-950 text-zinc-950'
                        : 'bg-zinc-950/95 border-zinc-200 text-white'
                    }`}
                  >
                    <p
                      className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] mb-1 ${
                        isLight ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                    >
                      CORE ARCHITECTURE
                    </p>
                    <h3 className="font-display text-xs sm:text-base font-extrabold uppercase tracking-[0.14em] whitespace-nowrap">
                      MY TECH STACK
                    </h3>
                  </div>
                </div>

                {/* Orbiting Skill Nodes (Upright at all rotation angles) */}
                {visibleSkills.map((skill, idx) => {
                  const isSelected = activeId === skill.id;
                  const initialTheta = (idx / visibleSkills.length) * Math.PI * 2;
                  const initialX = metrics.rx * Math.cos(initialTheta);
                  const initialY = metrics.ry * Math.sin(initialTheta);
                  const initialDepth = (Math.sin(initialTheta) + 1) / 2;
                  const initialScale = 0.8 + 0.28 * initialDepth;

                  return (
                    <button
                      key={skill.id}
                      ref={(el) => {
                        nodeRefs.current[skill.id] = el;
                      }}
                      type="button"
                      onMouseEnter={() => setHoveredId(skill.id)}
                      onMouseLeave={() => setHoveredId((prev) => (prev === skill.id ? null : prev))}
                      onFocus={() => setFocusedId(skill.id)}
                      onBlur={() => setFocusedId((prev) => (prev === skill.id ? null : prev))}
                      onClick={() => handleNodeClick(skill.id)}
                      aria-label={`${skill.name} (${skill.level}). Inspect skill description and related projects.`}
                      aria-expanded={isSelected}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate3d(calc(-50% + ${initialX.toFixed(2)}px), calc(-50% + ${initialY.toFixed(2)}px), 0) scale(${initialScale.toFixed(3)})`,
                        zIndex: Math.round(10 + initialDepth * 30),
                        opacity: Number((0.58 + 0.42 * initialDepth).toFixed(3)),
                        willChange: 'transform, opacity',
                      }}
                      className={`group absolute flex items-center gap-2 border px-2.5 sm:px-3.5 py-2 sm:py-2.5 cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
                        isSelected
                          ? isLight
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg focus-visible:ring-zinc-950'
                            : 'bg-white text-zinc-950 border-white shadow-lg focus-visible:ring-white'
                          : isLight
                            ? 'bg-white text-zinc-950 border-zinc-300 hover:border-zinc-950 focus-visible:ring-zinc-950'
                            : 'bg-zinc-950 text-zinc-100 border-zinc-700 hover:border-white focus-visible:ring-white'
                      }`}
                    >
                      <SkillIcon
                        skill={skill}
                        className={`${metrics.compact ? 'w-4 h-4' : 'w-5 h-5'} shrink-0`}
                      />
                      <span
                        className={`font-mono font-semibold whitespace-nowrap ${
                          metrics.compact ? 'text-[10px]' : 'text-xs'
                        }`}
                      >
                        {skill.name}
                      </span>
                    </button>
                  );
                })}

                {/* Floating Detail Popup Anchored Right Near the Active Skill Node */}
                <AnimatePresence>
                  {activeSkill && (
                    <div
                      ref={popupRef}
                      style={{ left: 0, top: 0, zIndex: 60, willChange: 'transform' }}
                      className={`absolute w-[250px] sm:w-[300px] ${
                        pinnedId === activeSkill.id ? 'pointer-events-auto' : 'pointer-events-none'
                      }`}
                    >
                      <motion.div
                        key={activeSkill.id}
                        role="dialog"
                        aria-live="polite"
                        aria-label={`${activeSkill.name} details`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.14, ease: 'easeOut' }}
                        className={`border p-3.5 sm:p-4 shadow-xl transition-colors ${
                          isLight
                            ? 'bg-white border-zinc-950 text-zinc-950'
                            : 'bg-zinc-950 border-zinc-200 text-white'
                        }`}
                      >
                        {/* Popup Header */}
                        <div
                          className={`flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b ${
                            isLight ? 'border-zinc-200' : 'border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 border flex items-center justify-center shrink-0 ${
                                isLight
                                  ? 'border-zinc-950 bg-zinc-950 text-white'
                                  : 'border-white bg-white text-zinc-950'
                              }`}
                            >
                              <SkillIcon skill={activeSkill} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4
                                className={`text-sm font-bold tracking-tight truncate ${
                                  isLight ? 'text-zinc-950' : 'text-white'
                                }`}
                              >
                                {activeSkill.name}
                              </h4>
                              <div
                                className={`flex items-center gap-1.5 text-[10px] font-mono ${
                                  isLight ? 'text-zinc-500' : 'text-zinc-400'
                                }`}
                              >
                                <span>{activeSkill.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{activeSkill.level}</span>
                              </div>
                            </div>
                          </div>

                          {pinnedId === activeSkill.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPinnedId(null);
                                setHoveredId(null);
                                setFocusedId(null);
                              }}
                              className={`p-1 border transition-colors shrink-0 ${
                                isLight
                                  ? 'border-zinc-300 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
                                  : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
                              }`}
                              aria-label="Close skill popup"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Skill Description */}
                        <p
                          className={`text-[11px] sm:text-xs leading-relaxed mb-3 ${
                            isLight ? 'text-zinc-700' : 'text-zinc-300'
                          }`}
                        >
                          {activeSkill.description?.trim()
                            ? activeSkill.description
                            : `Core competency in ${activeSkill.name} applied across web architecture and practical builds.`}
                        </p>

                        {/* Related Projects */}
                        <div className="space-y-1.5">
                          <div
                            className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider ${
                              isLight ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            <FolderGit2 className="w-3 h-3" />
                            <span>Related Projects</span>
                          </div>

                          {activeSkill.relatedProjects && activeSkill.relatedProjects.length > 0 ? (
                            <ul className="space-y-1">
                              {activeSkill.relatedProjects.map((project, pIdx) => (
                                <li
                                  key={`${activeSkill.id}-proj-${pIdx}`}
                                  className={`px-2 py-1 border text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 ${
                                    isLight
                                      ? 'border-zinc-200 bg-zinc-50 text-zinc-900'
                                      : 'border-zinc-800 bg-zinc-900/70 text-zinc-100'
                                  }`}
                                >
                                  <span
                                    className={`text-[9px] shrink-0 ${
                                      isLight ? 'text-zinc-400' : 'text-zinc-500'
                                    }`}
                                  >
                                    {String(pIdx + 1).padStart(2, '0')}
                                  </span>
                                  <span className="truncate">{project}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[10px] font-mono text-zinc-500">
                              No related projects linked yet.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
