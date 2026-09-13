import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { FileText, Download, Eye, Sparkles, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';

interface ResumeSectionProps {
  onOpenResumeModal: () => void;
}

export const Resume: React.FC<ResumeSectionProps> = ({ onOpenResumeModal }) => {
  const { data, isAdmin } = usePortfolio();
  const { profile } = data;

  const handleDownload = () => {
    if (profile.resumeUrl && profile.resumeUrl !== '#resume' && profile.resumeUrl !== '#') {
      window.open(profile.resumeUrl, '_blank');
    } else {
      onOpenResumeModal();
    }
  };

  return (
    <section id="resume" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-72 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-12 bg-zinc-950 border border-zinc-800 hover:border-orange-500/40 shadow-2xl shadow-orange-950/40"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Content Area */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Formal Curriculum Vitae</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isAdmin ? (
                  <>Download or View My <span className="glow-gradient-text">Complete Resume</span></>
                ) : (
                  <>Verified Curriculum Vitae & <span className="glow-gradient-text">Coursework</span></>
                )}
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Detailed technical summary highlighting coursework at Thakur Shyamnarayan Degree College, technical stack proficiencies, accounting experience, and certified academic credentials.
              </p>

              {/* Highlights Row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified History</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <GraduationCap className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>B.Sc. IT Syllabus</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Audit Experience</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0 justify-center">
              {/* View Resume Button */}
              <button
                id="resume-view-btn"
                onClick={onOpenResumeModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 shadow-md transition-all duration-300 active:scale-95"
              >
                <Eye className="w-4 h-4 text-orange-400" />
                <span>View Resume Online</span>
              </button>

              {/* Download Resume Button - Only visible in Admin Edit Mode */}
              {isAdmin && (
                <button
                  id="resume-download-btn"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-400 shadow-lg shadow-orange-950/50 hover:shadow-orange-500/25 transition-all duration-300 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </button>
              )}

              {/* File Info Subtitle - Only for Admin */}
              {isAdmin && (
                <p className="text-[11px] text-center text-zinc-400 font-mono">
                  {profile.resumeFileName || 'Sandesh_Vishwakarma_Resume.pdf'}
                </p>
              )}
            </div>

          </div>

          {/* Decorative Background Accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
};
