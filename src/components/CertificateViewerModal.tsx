import React, { useEffect, useState } from 'react';
import { CertificationItem } from '../types';
import {
  Award,
  Building,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Hash,
  Image as ImageIcon,
  ShieldCheck,
  X,
} from 'lucide-react';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificationItem | null;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'pdf'>('image');
  const [imgError, setImgError] = useState(false);

  const imageUrl = certificate?.imageUrl?.trim() || '';
  const pdfUrl =
    certificate?.pdfUrl?.trim() ||
    (certificate?.certificateDocument &&
    certificate.certificateDocument.toLowerCase().endsWith('.pdf')
      ? certificate.certificateDocument.trim()
      : certificate?.certificateLink &&
          certificate.certificateLink.toLowerCase().endsWith('.pdf')
        ? certificate.certificateLink.trim()
        : '');

  useEffect(() => {
    setImgError(false);
    if (imageUrl) {
      setActiveMediaTab('image');
    } else if (pdfUrl) {
      setActiveMediaTab('pdf');
    }
  }, [certificate?.id, imageUrl, pdfUrl]);

  if (!isOpen || !certificate) return null;

  const verifyUrl =
    certificate.certificateLink &&
    certificate.certificateLink !== '#' &&
    certificate.certificateLink.startsWith('http')
      ? certificate.certificateLink
      : '';

  const activeDownloadUrl =
    (activeMediaTab === 'pdf' && pdfUrl) ||
    imageUrl ||
    pdfUrl ||
    (certificate.certificateLink && certificate.certificateLink !== '#'
      ? certificate.certificateLink
      : '');

  const showingPdf = (activeMediaTab === 'pdf' && Boolean(pdfUrl)) || (!imageUrl && Boolean(pdfUrl));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${certificate.name} preview`}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden border border-zinc-800 bg-zinc-950 text-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-zinc-800 shrink-0">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-1.5">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{certificate.verificationStatus || 'Verified'} Credential</span>
              {certificate.credentialId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate tabular-nums">ID: {certificate.credentialId}</span>
                </>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {certificate.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 mt-2 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>{certificate.issuingOrg}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Issued: {certificate.issueDate || certificate.year}</span>
              </span>
              {certificate.expiryDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Expires: {certificate.expiryDate}</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate preview"
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {certificate.description && (
            <p className="text-sm leading-relaxed text-zinc-300">{certificate.description}</p>
          )}

          {/* Switcher if both Image & PDF exist */}
          {imageUrl && pdfUrl && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMediaTab('image')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono transition-colors ${
                  activeMediaTab === 'image'
                    ? 'border-zinc-400 bg-zinc-900 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Certificate Image</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('pdf')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono transition-colors ${
                  activeMediaTab === 'pdf'
                    ? 'border-zinc-400 bg-zinc-900 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
            </div>
          )}

          {/* Media Viewport */}
          <div className="border border-zinc-800 bg-zinc-900 flex items-center justify-center min-h-[260px] overflow-hidden">
            {showingPdf && pdfUrl ? (
              <iframe
                src={pdfUrl}
                title={`${certificate.name} PDF document`}
                className="w-full h-[460px] bg-white"
              />
            ) : imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={certificate.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="max-h-[480px] w-full object-contain bg-zinc-950"
              />
            ) : (
              <div className="text-center p-10 space-y-3">
                <Award className="w-10 h-10 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-white">{certificate.name}</p>
                <p className="text-xs font-mono text-zinc-400">
                  Issued by {certificate.issuingOrg} · {certificate.issueDate || certificate.year}
                </p>
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-700 bg-zinc-950 hover:border-white text-xs font-mono text-white transition-colors"
                  >
                    <span>Verify Online Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Credential Metadata Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono border-t border-zinc-800 pt-4">
            <div className="p-3 border border-zinc-800 bg-zinc-900">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Status</span>
              </div>
              <div className="mt-1 font-semibold text-white">
                {certificate.verificationStatus || 'Verified'}
              </div>
            </div>

            <div className="p-3 border border-zinc-800 bg-zinc-900">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>Credential ID</span>
              </div>
              <div className="mt-1 font-semibold text-white truncate tabular-nums">
                {certificate.credentialId || 'Not Specified'}
              </div>
            </div>

            <div className="p-3 border border-zinc-800 bg-zinc-900">
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Validity</span>
              </div>
              <div className="mt-1 font-semibold text-white tabular-nums">
                {certificate.issueDate || certificate.year}
                {certificate.expiryDate ? ` — ${certificate.expiryDate}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <span className="text-xs font-mono text-zinc-300 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{certificate.verificationStatus || 'Verified'} Record</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-700 bg-zinc-900 hover:border-white text-xs font-mono font-semibold text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify URL</span>
              </a>
            )}

            {activeDownloadUrl && (
              <>
                <a
                  href={activeDownloadUrl}
                  download={`${certificate.name.replace(/\s+/g, '_')}_Certificate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-700 bg-zinc-900 hover:border-white text-xs font-mono font-semibold text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <a
                  href={activeDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-700 bg-zinc-950 keep-dark text-white keep-white hover:bg-zinc-800 text-xs font-mono font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
