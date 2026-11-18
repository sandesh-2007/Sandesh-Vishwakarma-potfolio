import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, Eye, CheckCircle2, GraduationCap, Briefcase } from 'lucide-react';

interface ResumeSectionProps {
  onOpenResumeModal: () => void;
}

export const Resume: React.FC<ResumeSectionProps> = ({ onOpenResumeModal }) => {
  const { data, isAdmin, theme } = usePortfolio();
  const isLight = theme === 'light';
  const { profile } = data;

  const handleDownload = () => {
    if (profile.resumeUrl && profile.resumeUrl !== '#resume' && profile.resumeUrl !== '#') {
      window.open(profile.resumeUrl, '_blank');
    } else {
      onOpenResumeModal();
    }
  };

  return (
    <section
      id="resume"
      className={`py-20 sm:py-24 border-b transition-colors ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-8 sm:p-12 border ${
            isLight
              ? 'bg-zinc-50/70 border-zinc-200'
              : 'bg-zinc-900/30 border-zinc-800'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <p className={`text-xs font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                09 · Curriculum Vitae
              </p>

              <h2
                className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  isLight ? 'text-zinc-950' : 'text-white'
                }`}
              >
                {isAdmin
                  ? 'Download or View My Complete Resume'
                  : 'Verified Curriculum Vitae & Coursework'}
              </h2>

              <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Detailed technical summary highlighting coursework at Thakur Shyamnarayan Degree College, technical stack proficiencies, accounting experience, and certified academic credentials.
              </p>

              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified History</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>B.Sc. IT Syllabus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Audit Experience</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                id="resume-view-btn"
                onClick={onOpenResumeModal}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  isLight
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>View Resume Online</span>
              </button>

              {isAdmin && (
                <button
                  id="resume-download-btn"
                  onClick={handleDownload}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap ${
                    isLight
                      ? 'bg-white border-zinc-300 text-zinc-950 hover:border-zinc-950'
                      : 'bg-zinc-950 border-zinc-700 text-white hover:border-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume (PDF)</span>
                </button>
              )}

              {isAdmin && (
                <p className={`text-[11px] text-center font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {profile.resumeFileName || 'Sandesh_Vishwakarma_Resume.pdf'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
