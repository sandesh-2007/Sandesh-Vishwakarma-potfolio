import React, { useRef, useEffect, useCallback } from 'react';

interface PixelDisintegrationHeadingProps {
  text: string;
  className: string;
  isLight: boolean;
  pixelSize?: number;
  samplingStep?: number;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export const PixelDisintegrationHeading: React.FC<PixelDisintegrationHeadingProps> = ({
  text,
  className,
  isLight,
  pixelSize = 3.0,
  samplingStep = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  // Initialize and sample pixels co-composed into permanent pixel text
  const initParticles = useCallback(() => {
    const h1 = h1Ref.current;
    const canvas = canvasRef.current;
    if (!h1 || !canvas) return;

    const rect = h1.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const computed = window.getComputedStyle(h1);
    const fontSize = computed.fontSize;
    const fontFamily = computed.fontFamily;
    const fontWeight = computed.fontWeight;
    const fontStyle = computed.fontStyle;

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = isLight ? '#09090b' : '#ffffff';

    // Word wrapping matching HTML element width with center alignment
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > rect.width - 20 && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const lineHeight = parseFloat(computed.lineHeight) || parseFloat(fontSize) * 1.2;
    const centerX = rect.width / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, centerX, index * lineHeight);
    });

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const step = samplingStep; 
    const pSize = pixelSize; 
    const newParticles: Particle[] = [];

    for (let y = 0; y < canvas.height; y += step * dpr) {
      for (let x = 0; x < canvas.width; x += step * dpr) {
        const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const posX = x / dpr;
          const posY = y / dpr;

          newParticles.push({
            x: posX,
            y: posY,
            originX: posX,
            originY: posY,
            vx: 0,
            vy: 0,
            color: `rgb(${red}, ${green}, ${blue})`,
            size: pSize,
          });
        }
      }
    }

    particlesRef.current = newParticles;
    ctx.clearRect(0, 0, rect.width, rect.height);
  }, [text, isLight, pixelSize, samplingStep]);

  // Continuous animation loop rendering permanent pixel text and mouse scattering physics
  useEffect(() => {
    const timer = setTimeout(() => {
      initParticles();
    }, 50);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const animate = () => {
      if (!active) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 70;

        if (mouse.active && dist < maxDist) {
          const force = (1 - dist / maxDist) * 12;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force;
          p.vy -= Math.sin(angle) * force;
        }

        // Silky smooth spring back to origin
        const ox = p.originX - p.x;
        const oy = p.originY - p.y;
        p.vx += ox * 0.05;
        p.vy += oy * 0.05;

        // Smooth friction / damping
        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      };
    }
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => handleTouchMove(e as unknown as React.TouchEvent<HTMLDivElement>)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative inline-block text-center cursor-pointer select-none py-2 px-3 sm:py-3 sm:px-4"
    >
      {/* Invisible HTML Heading defining layout dimensions and accessibility */}
      <h1 ref={h1Ref} className={`${className} opacity-0 pointer-events-none select-none`}>
        {text}
      </h1>

      {/* Permanent Pixel Text Canvas Renderer overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mx-auto my-auto"
      />
    </div>
  );
};
