import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { TechIllustration } from './TechIllustration';
import { UploadProfileModal } from './UploadProfileModal';
import { 
  ArrowRight, 
  Mail, 
  FileDown, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  Upload,
  Linkedin,
  Instagram,
  Github
} from 'lucide-react';

interface HeroProps {
  onOpenResumeModal: () => void;
  onOpenSurpriseModal?: () => void;
  isGiftVisible?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenResumeModal,
  onOpenSurpriseModal,
  isGiftVisible = true
}) => {
  const { data, isAdmin } = usePortfolio();
  const { profile } = data;
  const [profileUploadOpen, setProfileUploadOpen] = useState(false);

  return (
    <section 
      id="top" 
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center overflow-hidden bg-transparent"
    >
      {/* Decorative ambient blurred color spots with orange and amber tones */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start space-y-6"
          >
            {/* Top Bar: Status Badge + Direct Profile Photo & Upload Option */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status & Semester Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-md backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  {profile.status}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-orange-400 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  {profile.stats.currentSemester}
                </span>
              </div>

              {/* Quick Profile Image & Upload Button - Only visible in Admin Edit Mode */}
              {isAdmin && (
                <button
                  onClick={() => setProfileUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-orange-500/40 hover:border-orange-500 hover:bg-orange-950/40 text-xs font-semibold text-zinc-200 hover:text-white transition-all group shadow-sm active:scale-95"
                  title="Click to change or upload your profile image"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-orange-500/60 shrink-0">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Camera className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span>Change Photo</span>
                </button>
              )}
            </div>

            {/* Main Name & Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white">
                Hi, I'm{' '}
                <span className="glow-gradient-text block sm:inline">
                  {profile.name}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                  {profile.headline}
                </span>
                <span className="hidden sm:inline text-zinc-700">|</span>
                <span className="text-sm sm:text-base font-semibold text-orange-400 tracking-wide">
                  "{profile.tagline}"
                </span>
              </div>
            </div>

            {/* Short Introduction Paragraph */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              {profile.shortBio}
            </p>

            {/* Quick Location & Education Tag */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-zinc-300">{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-zinc-300">Thakur Shyamnarayan Degree College</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 w-full sm:w-auto">
              {/* Button 1: View My Projects */}
              <a
                id="hero-view-projects-btn"
                href="#projects"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-400 shadow-lg shadow-orange-950/60 hover:shadow-orange-500/25 transition-all duration-300 active:scale-95"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Button 2: Contact Me */}
              <a
                id="hero-contact-btn"
                href="#contact"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-orange-400 hover:bg-zinc-800/80 transition-all duration-300 active:scale-95 shadow-sm"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>Contact Me</span>
              </a>

              {/* Button 3: Download Resume - Only visible in Admin Edit Mode */}
              {isAdmin && (
                <button
                  id="hero-download-resume-btn"
                  onClick={onOpenResumeModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                >
                  <FileDown className="w-4 h-4 text-orange-400" />
                  <span>Download Resume</span>
                </button>
              )}

              {/* Button 4: Upload Profile Photo CTA - Only visible in Admin Edit Mode */}
              {isAdmin && (
                <button
                  onClick={() => setProfileUploadOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-orange-400 bg-orange-950/30 border border-orange-500/40 hover:bg-orange-950/60 hover:border-orange-500 transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Profile Photo</span>
                </button>
              )}
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-zinc-400 font-mono">Connect:</span>

              {/* Instagram */}
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#E1306C] hover:border-[#E1306C]/60 hover:bg-pink-950/20 transition-all shadow-sm active:scale-95"
                title="Instagram: @sandesh_vishwakarma_101"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-blue-950/20 transition-all shadow-sm active:scale-95"
                title="LinkedIn: Sandesh Vishwakarma"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* Direct Email */}
              <a
                href={`mailto:${profile.email}`}
                aria-label="Direct Email"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#EA4335] hover:border-red-500/60 hover:bg-red-950/20 transition-all shadow-sm active:scale-95"
                title="Email: sandesh.vishwakarma2007@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>

              {/* GitHub */}
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                title="GitHub Repositories"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Metrics highlight */}
            <div className="grid grid-cols-3 gap-3 pt-6 w-full max-w-lg border-t border-zinc-800/90">
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                <div className="text-xl sm:text-2xl font-black text-orange-400 font-mono">
                  {profile.stats.projectsCount}
                </div>
                <div className="text-xs text-zinc-400 font-medium">Projects Built</div>
              </div>
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {profile.stats.technologiesCount}
                </div>
                <div className="text-xs text-zinc-400 font-medium">Tools & Skills</div>
              </div>
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {profile.stats.certificationsCount}
                </div>
                <div className="text-xs text-zinc-400 font-medium">Certifications</div>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Illustration with Abstract Tech and Floating Badges */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <TechIllustration 
              onOpenSurpriseModal={onOpenSurpriseModal}
              isGiftVisible={isGiftVisible}
            />
          </div>

        </div>
      </div>

      {/* Upload Profile Photo Modal */}
      <UploadProfileModal
        isOpen={profileUploadOpen}
        onClose={() => setProfileUploadOpen(false)}
      />
    </section>
  );
};
