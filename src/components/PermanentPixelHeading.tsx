import React, { useRef, useEffect, useCallback } from 'react';

interface PermanentPixelHeadingProps {
  text: string;
  className: string;
  isLight: boolean;
  pixelSize?: number;
  samplingStep?: number;
}

export const PermanentPixelHeading: React.FC<PermanentPixelHeadingProps> = ({
  text,
  className,
  isLight,
  pixelSize = 3.5,
  samplingStep = 4,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const renderPixelText = useCallback(() => {
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

    ctx.clearRect(0, 0, rect.width, rect.height);

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

          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(posX, posY, pSize, pSize);
        }
      }
    }
  }, [text, isLight, pixelSize, samplingStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      renderPixelText();
    }, 50);

    const handleResize = () => {
      renderPixelText();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderPixelText]);

  return (
    <div ref={containerRef} className="relative inline-block text-center select-none w-full">
      {/* Invisible HTML Heading for SEO, Accessibility and Layout Measurement */}
      <h2 ref={h1Ref} className={`${className} opacity-0 pointer-events-none select-none`}>
        {text}
      </h2>

      {/* Permanent Pixel Text Canvas Renderer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none mx-auto my-auto"
      />
    </div>
  );
};
