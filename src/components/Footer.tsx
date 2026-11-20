import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BrandLogo } from './BrandLogo';
import {
  ArrowUp,
  Lock,
  Unlock
} from 'lucide-react';

interface FooterProps {
  onOpenDiagnostics?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { data, isAdmin, theme, setLoginModalOpen, setEditModalOpen, setSheetsModalOpen } = usePortfolio();
  const isLight = theme === 'light';
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
    <footer
      id="footer"
      className={`border-t pt-16 pb-12 text-xs transition-colors ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-600'
          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <span
              className={`font-display font-extrabold text-lg uppercase tracking-tight block ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              {profile.name}
            </span>
            <p className={`text-xs leading-relaxed max-w-md ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              B.Sc. Information Technology student at Thakur Shyamnarayan Degree College. Focused on building production-ready web applications, responsive user interfaces, and reliable data tools.
            </p>
            <div className={`pt-1 flex items-center gap-2 text-[11px] font-mono font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Freelance Projects & Developer Internships</span>
            </div>

            <div className="pt-3 flex items-center gap-2">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className={`p-2 border transition-colors inline-flex items-center justify-center ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 hover:border-white'
                }`}
                title="GitHub"
              >
                <BrandLogo name="github" isDark={!isLight} className="w-4 h-4" />
              </a>

              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className={`p-2 border transition-colors inline-flex items-center justify-center ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 hover:border-white'
                }`}
                title="LinkedIn"
              >
                <BrandLogo name="linkedin" className="w-4 h-4" />
              </a>

              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className={`p-2 border transition-colors inline-flex items-center justify-center ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 hover:border-white'
                }`}
                title="Instagram"
              >
                <BrandLogo name="instagram" className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                aria-label="Direct Email"
                className={`p-2 border transition-colors inline-flex items-center justify-center ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 hover:border-white'
                }`}
                title="Email"
              >
                <BrandLogo name="mail" className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className={`font-semibold text-xs uppercase tracking-wider font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li><a href="#about" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>About Me</a></li>
              <li><a href="#education" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>Education & College</a></li>
              <li><a href="#projects" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>Featured Projects</a></li>
              <li><a href="#experience" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>Experience & Accounting</a></li>
              <li><a href="#certifications" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>Certifications</a></li>
            </ul>
          </div>

          {/* Col 3: Connect & Admin */}
          <div className="space-y-2.5">
            <h4 className={`font-semibold text-xs uppercase tracking-wider font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              Connect & Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>
                  <BrandLogo name="github" isDark={!isLight} className="w-3.5 h-3.5" />
                  <span>GitHub Repositories</span>
                </a>
              </li>
              <li>
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>
                  <BrandLogo name="linkedin" className="w-3.5 h-3.5" />
                  <span>LinkedIn Network</span>
                </a>
              </li>
              <li>
                <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>
                  <BrandLogo name="instagram" className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className={`flex items-center gap-2 transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-white'}`}>
                  <BrandLogo name="mail" className="w-3.5 h-3.5" />
                  <span className="truncate">{profile.email}</span>
                </a>
              </li>
              <li className="pt-2 flex flex-col gap-2">
                {isAdmin && (
                  <button
                    id="footer-sheets-btn"
                    onClick={() => setSheetsModalOpen(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors w-fit text-xs font-mono ${
                      isLight
                        ? 'bg-zinc-50 border-zinc-300 text-zinc-950 hover:border-zinc-950'
                        : 'bg-zinc-900 border-zinc-700 text-white hover:border-white'
                    }`}
                  >
                    <BrandLogo name="sheets" className="w-3.5 h-3.5" />
                    <span>{isSheetConnected ? 'Google Sheets (Connected)' : 'Configure Google Sheets'}</span>
                  </button>
                )}

                <button
                  id="footer-admin-btn"
                  onClick={handleEditClick}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border transition-colors w-fit text-xs font-mono ${
                    isLight
                      ? 'bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-white hover:text-zinc-950 hover:border-white'
                  }`}
                >
                  {isAdmin ? <Unlock className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3" />}
                  <span>{isAdmin ? 'Edit Portfolio Suite (Open)' : 'Admin Login / Edit'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          <p className="text-[11px] font-mono">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 border text-xs font-mono transition-colors ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-950 hover:text-white hover:border-zinc-950'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-white hover:text-zinc-950 hover:border-white'
            }`}
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
