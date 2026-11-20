/**
 * Helper utilities for resilient file uploads across both Express backend servers
 * and static hosting deployments (where POST /api/upload returns HTTP 404/405/HTML).
 */

export function isStaticUploadUnavailable(res: Response): boolean {
  if (res.status === 404 || res.status === 405 || res.status === 501) {
    return true;
  }
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (!res.ok && contentType.includes('text/html')) {
    return true;
  }
  return false;
}

export async function optimizeDataUrlForLocalStorage(
  dataUrl: string,
  fileType: string,
  maxDimension = 1400,
  quality = 0.82
): Promise<string> {
  const mime = (fileType || '').toLowerCase();
  const isRasterImage =
    mime.startsWith('image/') &&
    !mime.includes('svg') &&
    !mime.includes('gif');

  if (!isRasterImage || typeof document === 'undefined') {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        const needsResize = width > maxDimension || height > maxDimension;
        const needsCompression = dataUrl.length > 260_000;

        if (!needsResize && !needsCompression) {
          resolve(dataUrl);
          return;
        }

        if (needsResize) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP (preserves transparency with high compression), fallback to JPEG
        let compressed = canvas.toDataURL('image/webp', quality);
        if (!compressed.startsWith('data:image/webp')) {
          const fallbackMime = mime === 'image/png' ? 'image/png' : 'image/jpeg';
          compressed = canvas.toDataURL(fallbackMime, quality);
        }

        resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
