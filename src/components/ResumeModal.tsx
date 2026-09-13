import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { printResume, openPrintableResumeTab } from '../utils/printResume';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code2, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data, isAdmin, showToast } = usePortfolio();
  const { profile, education, skills, experience, certifications, projects } = data;
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    showToast('Opening print dialog...', 'info');
    try {
      await printResume(data);
      showToast('Print ready! Choose "Save as PDF" to download the file.', 'success');
    } catch (err) {
      console.error('Print failed, opening printable tab fallback:', err);
      openPrintableResumeTab(data);
      showToast('Opened printable resume in a new tab!', 'info');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleOpenTab = () => {
    openPrintableResumeTab(data);
    showToast('Opened printable resume in a new tab. Press Ctrl+P to print or save as PDF.', 'info');
  };

  const handleDownload = () => {
    if (profile.resumeUrl && profile.resumeUrl !== '#resume' && profile.resumeUrl !== '#') {
      window.open(profile.resumeUrl, '_blank');
      showToast('Opening resume document...', 'info');
    } else {
      // If no external URL file uploaded yet, use high quality print-to-PDF
      handlePrint();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="resume-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      >
        
        {/* Backdrop click */}
        <div className="fixed inset-0 no-print" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          id="resume-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-orange-950/40 overflow-hidden"
        >
          {/* Header Action Bar */}
          <div 
            id="resume-modal-header"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-zinc-800 bg-zinc-900/90 no-print"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Curriculum Vitae — {profile.name}
                </h3>
                <p className="text-xs font-mono text-orange-400">
                  {profile.headline} • {profile.resumeFileName || 'Official_Resume.pdf'}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Primary Print / Save as PDF button */}
              <button
                id="resume-print-btn"
                onClick={handlePrint}
                disabled={isPrinting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all active:scale-95 disabled:opacity-50"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isPrinting ? 'Printing...' : 'Print / Save PDF'}</span>
              </button>

              {/* Open in new tab fallback */}
              <button
                id="resume-open-tab-btn"
                onClick={handleOpenTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                title="Open clean printable page in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>Open in Tab</span>
              </button>

              {/* Download Official File Button */}
              <button
                id="resume-modal-download-btn"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                title="Download original file or PDF"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Download</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-auto sm:ml-0"
                aria-label="Close resume"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Resume Content */}
          <div 
            id="resume-printable-content"
            className="p-6 sm:p-10 overflow-y-auto space-y-8 text-zinc-200"
          >
            
            {/* Top Resume Header */}
            <div className="border-b border-zinc-800 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="text-sm font-semibold text-orange-400 mt-0.5">
                    {profile.headline} • {profile.tagline}
                  </p>
                </div>

                <div className="text-xs text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {profile.shortBio}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-zinc-800 pb-2">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                <span className="uppercase tracking-wider font-mono text-xs">Education</span>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-white">
                      <span>{edu.degree}</span>
                      <span className="text-xs font-mono text-orange-400">{edu.startYear} — {edu.endYear}</span>
                    </div>
                    <div className="text-amber-300 text-xs font-medium">{edu.institution}</div>
                    <p className="text-zinc-400 text-xs mt-1">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-zinc-800 pb-2">
                <Briefcase className="w-4 h-4 text-orange-400" />
                <span className="uppercase tracking-wider font-mono text-xs">Experience</span>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs sm:text-sm space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold text-white">
                      <span>{exp.role} • <span className="text-orange-300 font-normal">{exp.organization}</span></span>
                      <span className="text-xs font-mono text-zinc-400">{exp.startDate} — {exp.endDate} ({exp.type})</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-zinc-800 pb-2">
                <Code2 className="w-4 h-4 text-orange-400" />
                <span className="uppercase tracking-wider font-mono text-xs">Key Projects</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                    <div className="font-bold text-white">{proj.name}</div>
                    <p className="text-zinc-400 text-[11px] mt-1 line-clamp-2">{proj.description}</p>
                    <div className="text-orange-400 font-mono text-[10px] mt-2">
                      Stack: {proj.technologies.slice(0, 4).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider font-mono text-white border-b border-zinc-800 pb-1.5">
                  Technical Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-zinc-900 text-[11px] text-zinc-300 border border-zinc-800 font-mono">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider font-mono text-white border-b border-zinc-800 pb-1.5">
                  Certifications
                </div>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {certifications.map((c) => (
                    <li key={c.id} className="flex items-center justify-between">
                      <span>• {c.name}</span>
                      <span className="font-mono text-zinc-500 text-[11px]">{c.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
