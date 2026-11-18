import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateVerificationStatus, CertificationItem } from '../types';
import {
  Award,
  Check,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

interface UploadCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certToEdit?: CertificationItem | null;
}

const ALLOWED_IMAGE_MIME = [
  'image/png',
  'image/x-png',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/webp',
];

export const UploadCertificateModal: React.FC<UploadCertificateModalProps> = ({
  isOpen,
  onClose,
  certToEdit,
}) => {
  const { data, isAdmin, uploadFile, updatePortfolio, deleteCertification, showToast } =
    usePortfolio();

  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [certificateLink, setCertificateLink] = useState('');
  const [description, setDescription] = useState('');
  const [verificationStatus, setVerificationStatus] =
    useState<CertificateVerificationStatus>('Verified');

  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [imageLocalPreview, setImageLocalPreview] = useState('');
  const [isSavingCert, setIsSavingCert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (certToEdit) {
      setName(certToEdit.name || '');
      setIssuingOrg(certToEdit.issuingOrg || '');
      setIssueDate(certToEdit.issueDate || '');
      setYear(certToEdit.year || new Date().getFullYear().toString());
      setExpiryDate(certToEdit.expiryDate || '');
      setCredentialId(certToEdit.credentialId || '');
      setCertificateLink(
        certToEdit.certificateLink && certToEdit.certificateLink !== '#'
          ? certToEdit.certificateLink
          : ''
      );
      setDescription(certToEdit.description || '');
      setVerificationStatus(certToEdit.verificationStatus || 'Verified');
      setImageUrl(certToEdit.imageUrl || '');
      setPdfUrl(
        certToEdit.pdfUrl ||
          (certToEdit.certificateDocument &&
          certToEdit.certificateDocument.toLowerCase().endsWith('.pdf')
            ? certToEdit.certificateDocument
            : '')
      );
      setImageLocalPreview(certToEdit.imageUrl || '');
    } else {
      setName('');
      setIssuingOrg('');
      setIssueDate('');
      setYear(new Date().getFullYear().toString());
      setExpiryDate('No Expiry');
      setCredentialId('');
      setCertificateLink('');
      setDescription('');
      setVerificationStatus('Verified');
      setImageUrl('');
      setPdfUrl('');
      setImageLocalPreview('');
    }
    setSelectedImageFile(null);
    setSelectedPdfFile(null);
    setConfirmDelete(false);
  }, [certToEdit, isOpen]);

  useEffect(() => {
    return () => {
      if (imageLocalPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imageLocalPreview);
      }
    };
  }, [imageLocalPreview]);

  if (!isOpen || !isAdmin) return null;

  const handleSelectImage = (file: File) => {
    const hasValidMime = ALLOWED_IMAGE_MIME.includes(file.type.toLowerCase());
    const hasValidExt = /\.(png|jpe?g|webp)$/i.test(file.name);
    if (!hasValidMime && !hasValidExt) {
      showToast('Please upload a JPG, JPEG, PNG, or WebP image.', 'error');
      return;
    }
    if (imageLocalPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imageLocalPreview);
    }
    setSelectedImageFile(file);
    setImageLocalPreview(URL.createObjectURL(file));
  };

  const handleSelectPdf = (file: File) => {
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showToast('Please select a valid PDF document.', 'error');
      return;
    }
    setSelectedPdfFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a certificate title.', 'error');
      return;
    }
    if (!issuingOrg.trim()) {
      showToast('Please enter the issuing organization.', 'error');
      return;
    }

    setIsSavingCert(true);
    try {
      let finalImageUrl = imageUrl.trim();
      let finalPdfUrl = pdfUrl.trim();

      if (selectedImageFile) {
        showToast('Uploading certificate image to persistent storage...', 'info');
        const imgRes = await uploadFile(selectedImageFile);
        if (!imgRes.success || !imgRes.url) {
          showToast(imgRes.error || 'Failed to store certificate image.', 'error');
          setIsSavingCert(false);
          return;
        }
        finalImageUrl = imgRes.url;
      }

      if (selectedPdfFile) {
        showToast('Uploading certificate PDF to persistent storage...', 'info');
        const pdfRes = await uploadFile(selectedPdfFile);
        if (!pdfRes.success || !pdfRes.url) {
          showToast(pdfRes.error || 'Failed to store certificate PDF.', 'error');
          setIsSavingCert(false);
          return;
        }
        finalPdfUrl = pdfRes.url;
      }

      const finalCertLink =
        certificateLink.trim() || finalPdfUrl || finalImageUrl || '#';

      if (certToEdit) {
        const updatedList = data.certifications.map((c) => {
          if (c.id !== certToEdit.id) return c;
          return {
            ...c,
            name: name.trim(),
            issuingOrg: issuingOrg.trim(),
            issueDate: issueDate.trim() || undefined,
            year: year.trim() || new Date().getFullYear().toString(),
            expiryDate: expiryDate.trim() || undefined,
            credentialId: credentialId.trim() || undefined,
            certificateLink: finalCertLink,
            imageUrl: finalImageUrl || undefined,
            pdfUrl: finalPdfUrl || undefined,
            certificateDocument: finalPdfUrl || finalImageUrl || undefined,
            description: description.trim() || undefined,
            verificationStatus,
          };
        });

        await updatePortfolio({ ...data, certifications: updatedList });
        showToast(`Certificate "${name.trim()}" updated successfully!`, 'success');
      } else {
        const newCert: CertificationItem = {
          id: 'cert-' + Date.now(),
          name: name.trim(),
          issuingOrg: issuingOrg.trim(),
          issueDate: issueDate.trim() || undefined,
          year: year.trim() || new Date().getFullYear().toString(),
          expiryDate: expiryDate.trim() || undefined,
          credentialId: credentialId.trim() || undefined,
          certificateLink: finalCertLink,
          imageUrl: finalImageUrl || undefined,
          pdfUrl: finalPdfUrl || undefined,
          certificateDocument: finalPdfUrl || finalImageUrl || undefined,
          description: description.trim() || undefined,
          verificationStatus,
          enabled: true,
          order: 0,
        };

        const reordered = [newCert, ...data.certifications].map((item, idx) => ({
          ...item,
          order: idx,
        }));

        await updatePortfolio({ ...data, certifications: reordered });
        showToast(`Certificate "${newCert.name}" added successfully!`, 'success');
      }

      onClose();
    } finally {
      setIsSavingCert(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={certToEdit ? 'Edit certificate' : 'Add certificate'}
        className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                {certToEdit ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Upload certificate image (JPG, PNG, WebP) and/or PDF document
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate form"
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Certificate Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MS-CIT / AWS Certified Cloud Practitioner"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                placeholder="e.g. MKCL / Coursera / Google"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) =>
                  setVerificationStatus(e.target.value as CertificateVerificationStatus)
                }
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              >
                <option value="Verified">Verified</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Issue Date
              </label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. Jul 2024"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="No Expiry"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Credential ID
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. MKCL-2024-8821"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Credential Verification URL
              </label>
              <input
                type="text"
                value={certificateLink}
                onChange={(e) => setCertificateLink(e.target.value)}
                placeholder="https://verify.example.com/..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Skills covered, coursework details, or credential overview..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-xs text-white resize-none"
            />
          </div>

          {/* Persistent Upload Slots: Image & PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Image Upload */}
            <div className="p-3 border border-zinc-800 bg-zinc-900 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-white inline-flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Certificate Image</span>
                </span>
                {(imageLocalPreview || imageUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setSelectedImageFile(null);
                      setImageLocalPreview('');
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-rose-400"
                  >
                    Remove
                  </button>
                )}
              </div>

              {imageLocalPreview && (
                <div className="w-full h-24 border border-zinc-800 bg-zinc-950 overflow-hidden">
                  <img
                    src={imageLocalPreview}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) handleSelectImage(file);
                }}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-950 hover:border-zinc-500 text-xs font-mono text-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {selectedImageFile
                    ? selectedImageFile.name
                    : imageUrl
                      ? 'Replace Image'
                      : 'Upload Image (JPG/PNG/WebP)'}
                </span>
              </button>
            </div>

            {/* PDF Upload */}
            <div className="p-3 border border-zinc-800 bg-zinc-900 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-white inline-flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Certificate</span>
                </span>
                {(selectedPdfFile || pdfUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPdfUrl('');
                      setSelectedPdfFile(null);
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-rose-400"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="h-24 border border-zinc-800 bg-zinc-950 p-3 flex flex-col items-center justify-center text-center">
                <FileText className="w-5 h-5 text-zinc-400 mb-1" />
                <span className="text-[11px] font-mono text-zinc-300 truncate max-w-full">
                  {selectedPdfFile
                    ? `Selected: ${selectedPdfFile.name}`
                    : pdfUrl
                      ? `Stored: ${pdfUrl.split('/').pop()}`
                      : 'No PDF attached'}
                </span>
              </div>

              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) handleSelectPdf(file);
                }}
              />
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-950 hover:border-zinc-500 text-xs font-mono text-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{pdfUrl ? 'Replace PDF' : 'Upload PDF File'}</span>
              </button>
            </div>
          </div>

          {/* Delete Confirmation Row */}
          {certToEdit && confirmDelete && (
            <div className="p-3 border border-rose-800 bg-rose-950/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-rose-300">
                Permanently remove &quot;{certToEdit.name}&quot;?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 border border-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteCertification(certToEdit.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-rose-700 text-white font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800">
            {certToEdit ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-rose-400 hover:border-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingCert}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-zinc-700 bg-zinc-950 keep-dark text-white keep-white hover:bg-zinc-800 text-xs font-mono font-semibold disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {isSavingCert
                    ? 'Saving...'
                    : certToEdit
                      ? 'Save Certificate'
                      : 'Publish Certificate'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
