import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CertificationItem } from '../types';
import { X, ExternalLink, Download, Award, Building, Calendar, CheckCircle } from 'lucide-react';

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
  if (!isOpen || !certificate) return null;

  const fileUrl = certificate.imageUrl || certificate.certificateLink;
  const isPdf = fileUrl?.toLowerCase().endsWith('.pdf');
  const isWebUrl = fileUrl?.startsWith('http') && !fileUrl?.includes('/api/uploads/');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-orange-500/30 rounded-3xl p-6 shadow-2xl shadow-orange-950/50 text-white overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-zinc-800 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono mb-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Credential</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{certificate.name}</h3>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-orange-400" />
                  {certificate.issuingOrg}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {certificate.year}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Certificate Content Viewer */}
          <div className="my-4 flex-1 overflow-auto rounded-2xl border border-zinc-800 bg-black/90 flex items-center justify-center min-h-[280px]">
            {isPdf ? (
              <iframe
                src={fileUrl}
                title={certificate.name}
                className="w-full h-[500px] rounded-xl"
              />
            ) : certificate.imageUrl || (fileUrl && fileUrl.startsWith('data:image')) || (fileUrl && !isWebUrl) ? (
              <img
                src={certificate.imageUrl || fileUrl}
                alt={certificate.name}
                referrerPolicy="no-referrer"
                className="max-h-[520px] max-w-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Award className="w-12 h-12 text-orange-400 mx-auto" />
                <p className="text-sm font-semibold text-white">{certificate.name}</p>
                <p className="text-xs text-zinc-400">Issued by {certificate.issuingOrg}</p>
                {fileUrl && fileUrl !== '#' && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors"
                  >
                    <span>Open Online Credential Record</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 shrink-0">
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Verified & Documented
            </span>

            <div className="flex items-center gap-2">
              {fileUrl && fileUrl !== '#' && (
                <>
                  <a
                    href={fileUrl}
                    download={`${certificate.name.replace(/\s+/g, '_')}_Certificate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500 text-xs font-semibold text-zinc-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Download</span>
                  </a>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors"
                  >
                    <span>Open Fullscreen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
