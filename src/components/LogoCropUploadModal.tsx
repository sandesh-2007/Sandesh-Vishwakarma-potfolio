import React, { useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, Upload, X, ZoomIn } from 'lucide-react';

interface LogoCropUploadModalProps {
  file: File | null;
  onCancel: () => void;
  onConfirmUpload: (croppedBase64: string, fileName: string, mimeType: string) => Promise<void>;
}

export const LogoCropUploadModal: React.FC<LogoCropUploadModalProps> = ({
  file,
  onCancel,
  onConfirmUpload,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  if (!file || !imageSrc) return null;

  const handleSaveCropped = async () => {
    const img = imgRef.current;
    if (!img) return;
    setIsProcessing(true);

    try {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        await onConfirmUpload(imageSrc, file.name, file.type || 'image/png');
        return;
      }

      // Clean white backdrop for transparent logos or aspect fill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const natW = img.naturalWidth || size;
      const natH = img.naturalHeight || size;
      const baseScale = Math.max(size / natW, size / natH);
      const drawW = natW * baseScale * zoom;
      const drawH = natH * baseScale * zoom;

      const maxShiftX = Math.max(0, (drawW - size) / 2) + size * 0.15;
      const maxShiftY = Math.max(0, (drawH - size) / 2) + size * 0.15;

      const dx = (size - drawW) / 2 + (offsetX / 100) * maxShiftX;
      const dy = (size - drawH) / 2 + (offsetY / 100) * maxShiftY;

      ctx.drawImage(img, dx, dy, drawW, drawH);

      const supportedMime =
        file.type === 'image/jpeg' || file.type === 'image/webp'
          ? file.type
          : 'image/png';
      const dataUrl = canvas.toDataURL(supportedMime, 0.92);
      const ext = supportedMime === 'image/jpeg' ? 'jpg' : supportedMime === 'image/webp' ? 'webp' : 'png';
      const cleanBase = file.name.replace(/\.[^.]+$/, '');
      await onConfirmUpload(dataUrl, `${cleanBase}_logo.${ext}`, supportedMime);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadOriginal = async () => {
    setIsProcessing(true);
    try {
      await onConfirmUpload(imageSrc, file.name, file.type || 'image/png');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 text-white p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h4 className="text-sm font-bold tracking-tight">Crop &amp; Preview Organization Logo</h4>
            <p className="text-[11px] font-mono text-zinc-400">
              Square 1:1 logo preview · Supports PNG, JPG, JPEG, WebP
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Cancel logo upload"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live 1:1 Crop Stage */}
        <div className="flex justify-center py-2">
          <div className="relative w-44 h-44 border border-zinc-600 bg-white overflow-hidden">
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Logo crop preview"
              style={{
                transform: `translate(${offsetX * 0.4}%, ${offsetY * 0.4}%) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="w-full h-full object-cover select-none"
            />
            <div className="pointer-events-none absolute inset-0 border border-dashed border-zinc-400/60" />
          </div>
        </div>

        {/* Zoom & Pan Sliders */}
        <div className="space-y-2.5 text-xs font-mono">
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span className="inline-flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> Zoom
              </span>
              <span>{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Horizontal</span>
                <span>{offsetX}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={offsetX}
                onChange={(e) => setOffsetX(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Vertical</span>
                <span>{offsetY}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setOffsetX(0);
              setOffsetY(0);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleUploadOriginal}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-700 text-xs font-mono text-zinc-200 hover:bg-zinc-900 disabled:opacity-50"
            >
              <Upload className="w-3 h-3" />
              <span>Original</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSaveCropped}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-700 bg-zinc-950 keep-dark text-white keep-white font-mono text-xs font-bold hover:bg-zinc-800 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Uploading...' : 'Crop & Upload'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
