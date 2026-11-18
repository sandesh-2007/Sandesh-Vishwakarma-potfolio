import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Eye, FileText, Pencil } from 'lucide-react';
import { CertificationItem } from '../types';

interface CertificationCardProps {
  cert: CertificationItem;
  isLight: boolean;
  onPreview?: (cert: CertificationItem) => void;
  onEdit?: (cert: CertificationItem) => void;
  className?: string;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  cert,
  isLight,
  onPreview,
  onEdit,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [cert.imageUrl]);

  const pdfSource =
    cert.pdfUrl ||
    (cert.certificateDocument && cert.certificateDocument.toLowerCase().endsWith('.pdf')
      ? cert.certificateDocument
      : cert.certificateLink && cert.certificateLink.toLowerCase().endsWith('.pdf')
        ? cert.certificateLink
        : undefined);

  const hasExternalVerification = Boolean(
    cert.certificateLink &&
      cert.certificateLink !== '#' &&
      cert.certificateLink.startsWith('http')
  );

  const hasDocument = Boolean(cert.imageUrl || pdfSource || hasExternalVerification);
  const statusLabel = cert.verificationStatus || 'Verified';
  const dateDisplay = cert.issueDate ? `${cert.issueDate}` : cert.year;

  const handleCardClick = () => {
    if (onPreview) {
      onPreview(cert);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (onPreview && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPreview(cert);
        }
      }}
      tabIndex={onPreview ? 0 : undefined}
      role={onPreview ? 'button' : undefined}
      aria-label={onPreview ? `View certificate: ${cert.name}` : undefined}
      className={`group border p-5 sm:p-6 flex flex-col justify-between transition-colors select-none text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${
        onPreview ? 'cursor-pointer' : ''
      } ${
        isLight
          ? 'bg-white border-zinc-200 hover:border-zinc-950 text-zinc-950 focus-visible:outline-zinc-950'
          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-500 text-white focus-visible:outline-white'
      } ${className}`}
    >
      <div>
        {/* Top Metadata Row — Clean Unboxed Typography */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className={`text-xs font-mono tabular-nums flex items-center gap-1.5 min-w-0 truncate ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            <span className={`font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              {dateDisplay}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{statusLabel}</span>
            {pdfSource && (
              <>
                <span aria-hidden="true">·</span>
                <span className="uppercase">PDF</span>
              </>
            )}
          </div>

          <div
            className={`w-8 h-8 border flex items-center justify-center shrink-0 ${
              isLight
                ? 'bg-zinc-50 border-zinc-200 text-zinc-950'
                : 'bg-zinc-900 border-zinc-800 text-white'
            }`}
          >
            {pdfSource && !cert.imageUrl ? (
              <FileText className="w-4 h-4" />
            ) : (
              <Award className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Media / Document Frame */}
        <div
          className={`relative w-full h-36 overflow-hidden mb-4 border flex items-center justify-center ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          {cert.imageUrl && !imageError ? (
            <>
              <img
                src={cert.imageUrl}
                alt={cert.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-semibold">
                <Eye className="w-4 h-4" />
                <span>View Certificate</span>
              </div>
            </>
          ) : pdfSource ? (
            <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
              <FileText className={`w-7 h-7 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`} />
              <span className={`text-xs font-mono font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                PDF Certificate Document
              </span>
              <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Click to inspect document
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
              <Award className={`w-7 h-7 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
              <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {cert.issuingOrg}
              </span>
            </div>
          )}
        </div>

        {/* Title & Issuer */}
        <h3
          className={`text-base sm:text-lg font-bold tracking-tight leading-snug line-clamp-2 ${
            isLight ? 'text-zinc-950' : 'text-white'
          }`}
        >
          {cert.name}
        </h3>

        <p
          className={`text-xs mt-1.5 font-medium truncate ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}
        >
          {cert.issuingOrg}
        </p>

        {cert.description && (
          <p
            className={`text-xs mt-2 leading-relaxed line-clamp-2 ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            {cert.description}
          </p>
        )}

        {(cert.credentialId || cert.expiryDate) && (
          <div
            className={`mt-2.5 text-[11px] font-mono tabular-nums flex flex-wrap items-center gap-x-2 gap-y-0.5 ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            {cert.credentialId && <span className="truncate">ID: {cert.credentialId}</span>}
            {cert.credentialId && cert.expiryDate && <span aria-hidden="true">·</span>}
            {cert.expiryDate && <span>Valid: {cert.expiryDate}</span>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`pt-4 mt-5 border-t flex items-center justify-between gap-2 ${
          isLight ? 'border-zinc-200' : 'border-zinc-800'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${
            isLight ? 'text-zinc-700' : 'text-zinc-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{statusLabel}</span>
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(cert);
              }}
              aria-label={`Edit ${cert.name}`}
              className={`inline-flex items-center gap-1 px-2.5 py-1 border text-[11px] font-mono font-semibold transition-colors ${
                isLight
                  ? 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950'
                  : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-white hover:text-white'
              }`}
            >
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}

          {onPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(cert);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 border text-[11px] font-mono font-semibold transition-colors ${
                isLight
                  ? 'border-zinc-200 bg-zinc-50 text-zinc-950 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white'
                  : 'border-zinc-800 bg-zinc-900 text-white hover:border-white hover:bg-white hover:text-zinc-950'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{hasDocument ? 'Preview' : 'Details'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
