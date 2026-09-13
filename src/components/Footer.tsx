import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  ArrowUp, 
  Lock, 
  Unlock, 
  Sparkles, 
  Heart,
  Github,
  Linkedin,
  Instagram,
  Mail,
  FileSpreadsheet,
  Terminal,
  Download,
  FolderArchive
} from 'lucide-react';

interface FooterProps {
  onOpenDiagnostics?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiagnostics }) => {
  const { data, isAdmin, setLoginModalOpen, setEditModalOpen, setSheetsModalOpen } = usePortfolio();
  const { profile } = data;
  const isSheetConnected = !!(data.sheetsConfig && data.sheetsConfig.spreadsheetId);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = () => {
    if (isAdmin) {
      setEditModalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <footer id="footer" className="relative bg-transparent border-t border-zinc-900/80 pt-16 pb-12 overflow-hidden text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl text-white tracking-tight">
                {profile.name}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              B.Sc. Information Technology student at Thakur Shyamnarayan Degree College. Focused on building production-ready web applications, responsive user interfaces, and reliable data tools.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-orange-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Freelance Projects & Developer Internships</span>
            </div>

            {/* Social Icons Row */}
            <div className="pt-3 flex items-center gap-2.5">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-colors shadow-sm"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-blue-950/20 transition-colors shadow-sm"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#E1306C] hover:border-[#E1306C]/60 hover:bg-pink-950/20 transition-colors shadow-sm"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                aria-label="Direct Email"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#EA4335] hover:border-red-500/60 hover:bg-red-950/20 transition-colors shadow-sm"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About Me</a></li>
              <li><a href="#education" className="hover:text-orange-400 transition-colors">Education & College</a></li>
              <li><a href="#other-skills" className="hover:text-orange-400 transition-colors">Other Skills (Design/UI)</a></li>
              <li><a href="#skills" className="hover:text-orange-400 transition-colors">Skills & Tech</a></li>
              <li><a href="#projects" className="hover:text-orange-400 transition-colors">Featured Projects</a></li>
              <li><a href="#experience" className="hover:text-orange-400 transition-colors">Experience & Accounting</a></li>
              <li><a href="#certifications" className="hover:text-orange-400 transition-colors">Certifications & Accreditations</a></li>
            </ul>
          </div>

          {/* Col 3: Social & Admin Control */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              Connect & Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repositories</span>
                </a>
              </li>
              <li>
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors">
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn Network</span>
                </a>
              </li>
              <li>
                <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#E1306C] transition-colors">
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#EA4335] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                  <span>{profile.email}</span>
                </a>
              </li>
              <li className="pt-2 flex flex-col gap-2">
                {isAdmin && (
                  <button
                    id="footer-sheets-btn"
                    onClick={() => setSheetsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/80 transition-colors w-fit text-xs font-mono"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isSheetConnected ? 'Google Sheets (Connected)' : 'Configure Google Sheets'}</span>
                  </button>
                )}

                {onOpenDiagnostics && (
                  <button
                    id="footer-terminal-btn"
                    onClick={onOpenDiagnostics}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-400 transition-colors w-fit text-xs font-mono"
                    title="Open System Diagnostics Terminal"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>System Diagnostics Terminal</span>
                  </button>
                )}

                <a
                  id="footer-download-zip-btn"
                  href="/api/download-zip"
                  download="sandesh-portfolio-source-code.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-600/90 to-amber-600/90 hover:from-orange-500 hover:to-amber-500 text-white font-medium shadow-sm transition-all w-fit text-xs active:scale-95 cursor-pointer"
                  title="Download Complete Website Source Code as .ZIP"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-white" />
                  <span>Download Source (.ZIP)</span>
                </a>

                <button
                  id="footer-admin-btn"
                  onClick={handleEditClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-orange-500/50 transition-colors w-fit"
                >
                  {isAdmin ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-zinc-400" />}
                  <span>{isAdmin ? 'Edit Portfolio Suite (Open)' : 'Admin Login / Edit'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and top scroll */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-[11px]">
            © {new Date().getFullYear()} {profile.name}. All rights reserved. Designed with modern technology standards.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
