import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationItem } from '../types';
import { UploadCertificateModal } from './UploadCertificateModal';
import { CertificateViewerModal } from './CertificateViewerModal';
import { 
  Award, 
  Calendar, 
  Building, 
  ExternalLink, 
  Upload, 
  Plus, 
  CheckCircle, 
  FileText,
  Eye,
  Sparkles,
  Trash2
} from 'lucide-react';

export const Certifications: React.FC = () => {
  const { data, uploadCertificateDocument, isAdmin, setLoginModalOpen, deleteCertification } = usePortfolio();
  const { certifications } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [certToEdit, setCertToEdit] = useState<CertificationItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState<CertificationItem | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleDeleteCert = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!isAdmin) {
      setLoginModalOpen(true);
      return;
    }
    if (window.confirm(`Are you sure you want to remove certificate "${name}"?`)) {
      deleteCertification(id);
    }
  };

  // Hidden file inputs for direct card uploads
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleCardFileUpload = async (certId: string, file: File) => {
    setUploadingId(certId);
    try {
      await uploadCertificateDocument(certId, file);
    } finally {
      setUploadingId(null);
    }
  };

  const openNewCertModal = () => {
    setCertToEdit(null);
    setModalOpen(true);
  };

  const openEditCertModal = (cert: CertificationItem) => {
    setCertToEdit(cert);
    setModalOpen(true);
  };

  const handleViewCert = (cert: CertificationItem) => {
    setViewingCert(cert);
    setViewerOpen(true);
  };

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient orange lighting */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Credentials & Accreditations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Licenses & <span className="glow-gradient-text">Certifications</span>
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xl text-sm sm:text-base">
              Verified qualifications and certificate documents validating skills in IT, computer systems, and development.
            </p>
          </div>

          {/* Prominent Upload Certificate CTA Button - Only visible in Admin Edit Mode */}
          {isAdmin && (
            <div className="shrink-0">
              <button
                id="upload-new-cert-btn"
                onClick={openNewCertModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-950/50 hover:shadow-orange-500/25 transition-all duration-300 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Upload / Add Certificate</span>
              </button>
            </div>
          )}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => {
            const hasDocument = (cert.imageUrl && cert.imageUrl.length > 0) || (cert.certificateLink && cert.certificateLink !== '#');
            const isUploading = uploadingId === cert.id;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative rounded-3xl p-6 bg-zinc-950 border border-zinc-800 hover:border-orange-500/60 shadow-xl shadow-black/60 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div>
                  {/* Header with year, delete button and badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-orange-300">
                      <Calendar className="w-3 h-3 text-orange-400" />
                      {cert.year}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Delete / Remove Certificate Button - Only visible in Admin Edit Mode */}
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeleteCert(e, cert.id, cert.name)}
                          className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-red-950/70 border border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-colors active:scale-95"
                          title="Remove / Delete Certificate"
                          aria-label={`Remove ${cert.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Certificate Preview Image if present */}
                  {cert.imageUrl ? (
                    <div 
                      onClick={() => handleViewCert(cert)}
                      className="cursor-pointer relative w-full h-36 rounded-2xl overflow-hidden mb-4 bg-zinc-900 border border-zinc-800 group/img"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                        <Eye className="w-4 h-4 text-orange-400" />
                        <span>Click to view certificate</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Certificate Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                    {cert.name}
                  </h3>

                  {/* Issuing Organization */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2">
                    <Building className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{cert.issuingOrg}</span>
                  </div>
                </div>

                {/* Card Bottom Controls */}
                <div className="pt-5 mt-5 border-t border-zinc-800/80 space-y-3">
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified Completion
                    </span>

                    {/* View Certificate button if file or link exists */}
                    {hasDocument && (
                      <button
                        onClick={() => handleViewCert(cert)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    )}
                  </div>

                  {/* Direct Upload / Replace Certificate File Action - Only for Admin */}
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      {/* Hidden input for this card */}
                      <input
                        ref={(el) => (fileInputRefs.current[cert.id] = el)}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCardFileUpload(cert.id, e.target.files[0]);
                          }
                        }}
                      />

                      <button
                        onClick={() => fileInputRefs.current[cert.id]?.click()}
                        disabled={isUploading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/60 hover:bg-zinc-800/80 text-[11px] font-semibold text-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-orange-400" />
                            <span>{hasDocument ? 'Replace File' : 'Upload File'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openEditCertModal(cert)}
                        className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  )}
                </div>

                {/* Corner accent glow */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Upload / Edit Certificate Modal */}
      <UploadCertificateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        certToEdit={certToEdit}
      />

      {/* Full Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        certificate={viewingCert}
      />
    </section>
  );
};
