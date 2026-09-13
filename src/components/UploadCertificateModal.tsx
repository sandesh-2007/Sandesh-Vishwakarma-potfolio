import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationItem } from '../types';
import { Award, Upload, X, Check, FileText, Image as ImageIcon, Calendar, Building, Link as LinkIcon, Trash2 } from 'lucide-react';

interface UploadCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certToEdit?: CertificationItem | null;
}

export const UploadCertificateModal: React.FC<UploadCertificateModalProps> = ({
  isOpen,
  onClose,
  certToEdit,
}) => {
  const { data, uploadFile, updatePortfolio, addNewCertificateWithFile, deleteCertification, showToast } = usePortfolio();

  const [name, setName] = useState(certToEdit?.name || '');
  const [issuingOrg, setIssuingOrg] = useState(certToEdit?.issuingOrg || '');
  const [year, setYear] = useState(certToEdit?.year || new Date().getFullYear().toString());
  const [certificateLink, setCertificateLink] = useState(certToEdit?.certificateLink || '');
  const [imageUrl, setImageUrl] = useState(certToEdit?.imageUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(certToEdit?.imageUrl || certToEdit?.certificateLink || '');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when certToEdit changes
  React.useEffect(() => {
    if (certToEdit) {
      setName(certToEdit.name);
      setIssuingOrg(certToEdit.issuingOrg);
      setYear(certToEdit.year);
      setCertificateLink(certToEdit.certificateLink || '');
      setImageUrl(certToEdit.imageUrl || '');
      setPreviewUrl(certToEdit.imageUrl || certToEdit.certificateLink || '');
    } else {
      setName('');
      setIssuingOrg('');
      setYear(new Date().getFullYear().toString());
      setCertificateLink('');
      setImageUrl('');
      setPreviewUrl('');
    }
    setSelectedFile(null);
  }, [certToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    } else {
      setPreviewUrl('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter the certificate title', 'error');
      return;
    }
    if (!issuingOrg.trim()) {
      showToast('Please enter the issuing authority or institute', 'error');
      return;
    }

    setIsUploading(true);
    try {
      let finalCertLink = certificateLink.trim();
      let finalImageUrl = imageUrl.trim();

      if (selectedFile) {
        showToast('Uploading certificate file...', 'info');
        const uploadRes = await uploadFile(selectedFile);
        if (uploadRes.success && uploadRes.url) {
          finalCertLink = uploadRes.url;
          if (selectedFile.type.startsWith('image/')) {
            finalImageUrl = uploadRes.url;
          }
        }
      }

      if (certToEdit) {
        // Update existing certificate
        const updatedCertifications = data.certifications.map((c) => {
          if (c.id === certToEdit.id) {
            return {
              ...c,
              name: name.trim(),
              issuingOrg: issuingOrg.trim(),
              year: year.trim(),
              certificateLink: finalCertLink || '#',
              imageUrl: finalImageUrl || c.imageUrl,
            };
          }
          return c;
        });

        await updatePortfolio({
          ...data,
          certifications: updatedCertifications,
        });
        showToast(`Certificate "${name}" updated successfully!`, 'success');
      } else {
        // Create new certificate
        const newCertItem: CertificationItem = {
          id: 'cert-' + Date.now(),
          name: name.trim(),
          issuingOrg: issuingOrg.trim(),
          year: year.trim(),
          certificateLink: finalCertLink || '#',
          imageUrl: finalImageUrl || undefined,
        };

        await updatePortfolio({
          ...data,
          certifications: [newCertItem, ...data.certifications],
        });
        showToast(`New Certificate "${name}" added successfully!`, 'success');
      }

      onClose();
    } catch (err) {
      showToast('Failed to save certificate', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-orange-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-orange-950/40 text-white my-8 overflow-hidden"
        >
          {/* Decorative orange background glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {certToEdit ? 'Edit & Upload Certificate' : 'Upload New Certificate'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Attach certificates (images or PDFs) to showcase verified credentials
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Certificate Name / Course Title <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Certified Web Developer / MS-CIT / Python"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Issuing Authority & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Issuing Organization <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={issuingOrg}
                    onChange={(e) => setIssuingOrg(e.target.value)}
                    placeholder="e.g. Coursera / HackerRank / MKCL"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Year Issued
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Certificate File Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Upload Certificate Document / Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                  dragOver
                    ? 'border-orange-500 bg-orange-950/25'
                    : 'border-zinc-800 hover:border-orange-500/60 bg-zinc-900/60'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Click to choose file or drag certificate here
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Supports Images (PNG, JPG, WebP) or PDF documents
                </p>

                {selectedFile ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-xs font-mono text-orange-300">
                    <FileText className="w-3.5 h-3.5 text-orange-400" />
                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                  </div>
                ) : previewUrl ? (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Certificate File Attached
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Preview Thumbnail if image */}
              {previewUrl && previewUrl.startsWith('data:image') || (previewUrl && previewUrl.match(/\.(jpeg|jpg|png|webp)/i)) ? (
                <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  <img
                    src={previewUrl}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-zinc-300">
                    Preview
                  </span>
                </div>
              ) : null}
            </div>

            {/* Optional Verification / Public Link */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Certificate Link / Verification URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="url"
                  value={certificateLink}
                  onChange={(e) => setCertificateLink(e.target.value)}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
              {certToEdit && (
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to remove certificate "${certToEdit.name}"?`)) {
                      await deleteCertification(certToEdit.id);
                      onClose();
                    }
                  }}
                  className="p-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 hover:text-red-200 transition-colors flex items-center gap-1.5"
                  title="Remove this certificate"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{certToEdit ? 'Save Changes' : 'Upload Certificate'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
