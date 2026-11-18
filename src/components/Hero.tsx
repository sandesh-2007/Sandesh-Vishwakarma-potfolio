import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { UploadProfileModal } from './UploadProfileModal';
import { PixelDisintegrationHeading } from './PixelDisintegrationHeading';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  FileDown,
  Camera,
  Upload,
  Linkedin,
  Instagram,
  Github,
  Terminal,
  FolderGit2,
  Plus,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface HeroProps {
  onOpenResumeModal: () => void;
  onOpenSurpriseModal?: () => void;
  isGiftVisible?: boolean;
}

const BRICK_ROWS: Array<Array<{ slot: number; span: string }>> = [
  [
    { slot: 0, span: 'col-span-5' },
    { slot: 1, span: 'col-span-7' },
  ],
  [
    { slot: 2, span: 'col-span-4' },
    { slot: 3, span: 'col-span-8' },
  ],
  [
    { slot: 4, span: 'col-span-8' },
    { slot: 5, span: 'col-span-4' },
  ],
  [
    { slot: 6, span: 'col-span-3' },
    { slot: 7, span: 'col-span-5' },
    { slot: 8, span: 'col-span-4' },
  ],
  [
    { slot: 9, span: 'col-span-7' },
    { slot: 10, span: 'col-span-5' },
  ],
];

export const Hero: React.FC<HeroProps> = ({
  onOpenResumeModal,
  onOpenSurpriseModal,
  isGiftVisible = true
}) => {
  const {
    data,
    isAdmin,
    theme,
    uploadHeroBoxPhoto,
    removeHeroBoxPhoto,
    setLoginModalOpen,
    showToast
  } = usePortfolio();
  const isLight = theme === 'light';
  const { profile, projects } = data;
  const [profileUploadOpen, setProfileUploadOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [uploadingSlot, setUploadingSlot] = useState<'left' | number | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; label: string } | null>(null);

  const featuredShowcase = (projects || []).slice(0, 4);
  const leftHeroPhoto = profile.heroLeftPhoto || '';
  const collagePhotos = Array.from({ length: 11 }, (_, idx) =>
    profile.heroCollagePhotos?.[idx] || ''
  );

  const handleBoxFileChange = async (
    target: 'left' | number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingSlot(target);
    try {
      await uploadHeroBoxPhoto(target, file);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleGuestEmptyClick = () => {
    showToast('Sign in as Admin to upload photos to Hero boxes.', 'info');
    setLoginModalOpen(true);
  };

  return (
    <section
      id="top"
      className={`relative pt-16 border-b vercel-grid-bg transition-colors ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Display Block: Left Photo Frame + Center Headline + Right Brick Photo Grid */}
        <div className="py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 items-stretch gap-5 lg:gap-6">
          {/* Left Hero Photo Box */}
          <div
            className={`order-2 lg:order-1 lg:col-span-3 h-[240px] sm:h-[260px] lg:h-[280px] relative border overflow-hidden group transition-colors ${
              isLight
                ? 'border-zinc-300 bg-white hover:border-zinc-950'
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-500'
            }`}
          >
            {leftHeroPhoto && !failedImages[leftHeroPhoto] ? (
              <>
                <img
                  key={leftHeroPhoto}
                  src={leftHeroPhoto}
                  alt="Hero showcase left"
                  referrerPolicy="no-referrer"
                  onClick={() =>
                    setLightboxPhoto({ url: leftHeroPhoto, label: 'Hero Showcase Frame' })
                  }
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [leftHeroPhoto]: true }))
                  }
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
                />
                {isAdmin && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <label
                      className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 border text-[11px] font-mono font-semibold shadow-sm transition-colors ${
                        isLight
                          ? 'bg-white/95 border-zinc-300 text-zinc-950 hover:bg-zinc-950 hover:text-white'
                          : 'bg-zinc-950/95 border-zinc-700 text-white hover:bg-white hover:text-zinc-950'
                      }`}
                      title="Replace left frame photo"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{uploadingSlot === 'left' ? '...' : 'Replace'}</span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                        className="hidden"
                        onChange={(e) => handleBoxFileChange('left', e)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeHeroBoxPhoto('left')}
                      aria-label="Remove left frame photo"
                      title="Remove photo"
                      className={`p-1.5 border shadow-sm transition-colors ${
                        isLight
                          ? 'bg-white/95 border-zinc-300 text-zinc-700 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                          : 'bg-zinc-950/95 border-zinc-700 text-zinc-300 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            ) : isAdmin ? (
              <label
                className={`w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-2.5 p-4 cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-zinc-50/50 hover:bg-zinc-100 text-zinc-700'
                    : 'bg-zinc-900/30 hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                <div
                  className={`w-10 h-10 border flex items-center justify-center ${
                    isLight
                      ? 'border-zinc-300 bg-white text-zinc-900'
                      : 'border-zinc-700 bg-zinc-950 text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                  {uploadingSlot === 'left' ? 'Uploading...' : 'Upload Photo'}
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Left Hero Frame
                </span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                  className="hidden"
                  onChange={(e) => handleBoxFileChange('left', e)}
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={handleGuestEmptyClick}
                aria-label="Upload photo to left hero frame (Admin login)"
                className={`w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-2 p-4 transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700'
                    : 'bg-zinc-950 hover:bg-zinc-900/60 text-zinc-600 hover:text-zinc-300'
                }`}
              >
                <Camera className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Upload Photo
                </span>
              </button>
            )}
          </div>

          {/* Center Display Headline Block */}
          <div className="order-1 lg:order-2 lg:col-span-6 py-4 sm:py-6 lg:py-8 text-center flex flex-col items-center justify-center">
            {/* Clean Unboxed Metadata Line (Zero Pills) */}
            <div
              className={`flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs font-mono mb-4 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={isLight ? 'text-zinc-950' : 'text-white'}>{profile.status}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{profile.stats.currentSemester}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.location}</span>
            </div>

            {/* Bold Architectural Display Title */}
            <PixelDisintegrationHeading
              text={`Hi, I'm ${profile.name}`}
              className={`font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.04] text-balance ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
              isLight={isLight}
            />

            <div
              className={`mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:text-lg font-semibold tracking-tight ${
                isLight ? 'text-zinc-800' : 'text-zinc-200'
              }`}
            >
              <span>{profile.headline}</span>
              <span className={isLight ? 'text-zinc-300' : 'text-zinc-700'} aria-hidden="true">/</span>
              <span className={`font-mono text-xs sm:text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {profile.tagline}
              </span>
            </div>
          </div>

          {/* Right Staggered 5-Row Brick Photo Collage (11 Clickable Upload Boxes) */}
          <div
            className={`order-3 lg:col-span-3 h-[250px] sm:h-[260px] lg:h-[280px] border grid grid-rows-5 gap-px overflow-hidden ${
              isLight ? 'border-zinc-300 bg-zinc-300' : 'border-zinc-800 bg-zinc-800'
            }`}
            aria-label="Hero brick photo grid"
          >
            {BRICK_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-12 gap-px h-full min-h-0">
                {row.map(({ slot, span }) => {
                  const photoUrl = collagePhotos[slot];
                  const hasPhoto = Boolean(photoUrl) && !failedImages[`${slot}:${photoUrl}`];
                  const isBusy = uploadingSlot === slot;

                  return (
                    <div
                      key={slot}
                      className={`${span} relative h-full min-h-0 overflow-hidden group/tile transition-colors ${
                        isLight ? 'bg-white' : 'bg-zinc-950'
                      }`}
                    >
                      {hasPhoto ? (
                        <>
                          <img
                            key={photoUrl}
                            src={photoUrl}
                            alt={`Portfolio grid box ${slot + 1}`}
                            referrerPolicy="no-referrer"
                            onClick={() =>
                              setLightboxPhoto({
                                url: photoUrl,
                                label: `Gallery Tile #${slot + 1}`,
                              })
                            }
                            onError={() =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [`${slot}:${photoUrl}`]: true,
                              }))
                            }
                            className="absolute inset-0 w-full h-full object-cover cursor-pointer grayscale-[15%] group-hover/tile:grayscale-0 group-hover/tile:scale-[1.03] transition-all duration-300"
                          />
                          {isAdmin && (
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/tile:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <label
                                className="cursor-pointer p-1 bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
                                title={`Replace photo in box ${slot + 1}`}
                                aria-label={`Replace photo in box ${slot + 1}`}
                              >
                                <Upload className="w-3 h-3" />
                                <input
                                  type="file"
                                  accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                                  className="hidden"
                                  onChange={(e) => handleBoxFileChange(slot, e)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => removeHeroBoxPhoto(slot)}
                                title={`Remove photo from box ${slot + 1}`}
                                aria-label={`Remove photo from box ${slot + 1}`}
                                className="p-1 bg-zinc-950 text-white hover:bg-rose-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </>
                      ) : isAdmin ? (
                        <label
                          className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors ${
                            slot === 1 ? 'pr-8 lg:pr-10' : ''
                          } ${
                            isLight
                              ? 'bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950'
                              : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-white'
                          }`}
                          title={`Upload photo to box ${slot + 1}`}
                          aria-label={`Upload photo to box ${slot + 1}`}
                        >
                          {isBusy ? (
                            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                            className="hidden"
                            onChange={(e) => handleBoxFileChange(slot, e)}
                          />
                        </label>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGuestEmptyClick}
                          aria-label={`Upload photo to box ${slot + 1} (Admin login)`}
                          className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors ${
                            slot === 1 ? 'pr-8 lg:pr-10' : ''
                          } ${
                            isLight
                              ? 'bg-white hover:bg-zinc-50 text-zinc-300 hover:text-zinc-700'
                              : 'bg-zinc-950 hover:bg-zinc-900/70 text-zinc-700 hover:text-zinc-300'
                          }`}
                        >
                          <Plus className="w-3 h-3 opacity-0 group-hover/tile:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Architectural 2-Column Split */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 border-t ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          {/* Left Column: Bio, Actions, Socials & 4-Column Metric Strip */}
          <div
            className={`lg:col-span-5 flex flex-col justify-between lg:border-r ${
              isLight ? 'border-zinc-200' : 'border-zinc-800'
            }`}
          >
            <div className="py-8 sm:py-10 lg:pr-10 space-y-6">
              {/* Profile Quick Identity Strip */}
              <div className="flex items-center gap-4">
                <div
                  onClick={() => {
                    if (isAdmin) setProfileUploadOpen(true);
                  }}
                  className={`relative w-14 h-14 overflow-hidden border shrink-0 ${
                    isLight ? 'border-zinc-300 bg-zinc-100' : 'border-zinc-700 bg-zinc-900'
                  } ${isAdmin ? 'cursor-pointer group' : ''}`}
                  title={isAdmin ? 'Click to upload/change photo' : profile.name}
                >
                  <img
                    src={profile.avatarUrl || '/sandesh_profile.jpg'}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + '/sandesh_profile.jpg') {
                        target.src = '/sandesh_profile.jpg';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    Thakur Shyamnarayan Degree College
                  </p>
                  <p className={`text-xs font-mono truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    B.Sc. Information Technology · Mumbai
                  </p>
                </div>
              </div>

              {/* Short Bio */}
              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isLight ? 'text-zinc-700' : 'text-zinc-300'
                }`}
              >
                {profile.shortBio}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  id="hero-view-projects-btn"
                  href="#projects"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                    isLight
                      ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  id="hero-contact-btn"
                  href="#contact"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                    isLight
                      ? 'bg-white border-zinc-300 text-zinc-950 hover:border-zinc-950 hover:bg-zinc-50'
                      : 'bg-zinc-950 border-zinc-700 text-white hover:border-white hover:bg-zinc-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </a>

                {isAdmin && (
                  <button
                    id="hero-download-resume-btn"
                    onClick={onOpenResumeModal}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                      isLight
                        ? 'bg-zinc-100 border-zinc-300 text-zinc-950 hover:bg-zinc-200'
                        : 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Resume</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => setProfileUploadOpen(true)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                      isLight
                        ? 'bg-zinc-100 border-zinc-300 text-zinc-950 hover:bg-zinc-200'
                        : 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Change Photo</span>
                  </button>
                )}
              </div>

              {/* Clean Monochrome Social Links */}
              <div className="flex items-center gap-2 pt-1">
                <span className={`text-xs font-mono mr-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Connect:
                </span>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className={`p-2 border transition-colors ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:border-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-white'
                  }`}
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className={`p-2 border transition-colors ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:border-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-white'
                  }`}
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className={`p-2 border transition-colors ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:border-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-white'
                  }`}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Direct Email"
                  className={`p-2 border transition-colors ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:border-zinc-950'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-white'
                  }`}
                  title={`Email: ${profile.email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 4-Column Architectural Metrics Strip */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 border-t ${
                isLight ? 'border-zinc-200' : 'border-zinc-800'
              }`}
            >
              <div
                className={`p-4 border-b sm:border-b-0 border-r ${
                  isLight ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Projects
                </div>
                <div className={`mt-1 text-2xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                  {profile.stats.projectsCount}
                </div>
              </div>

              <div
                className={`p-4 border-b sm:border-b-0 sm:border-r ${
                  isLight ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Skills
                </div>
                <div className={`mt-1 text-2xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                  {profile.stats.technologiesCount}
                </div>
              </div>

              <div
                className={`p-4 border-r ${
                  isLight ? 'border-zinc-200' : 'border-zinc-800'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Certs
                </div>
                <div className={`mt-1 text-2xl font-extrabold font-display tabular-nums ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                  {profile.stats.certificationsCount}
                </div>
              </div>

              <div className="p-4">
                <div className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Phase
                </div>
                <div className={`mt-1 text-sm font-bold font-mono leading-tight pt-1 ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                  {profile.stats.currentSemester}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Featured Projects Grid + Developer Station Bar */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Slim Monochrome Developer Station Header */}
            <div
              className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-4 ${
                isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono">
                <Terminal className="w-3.5 h-3.5" />
                <span className={isLight ? 'text-zinc-700 font-semibold' : 'text-zinc-300 font-semibold'}>
                  sandesh@dev-station:~
                </span>
                <span className={isLight ? 'text-zinc-400' : 'text-zinc-600'}>/</span>
                <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>
                  featured-builds
                </span>
              </div>

              {isGiftVisible && onOpenSurpriseModal && (
                <button
                  id="hero-mystery-gift-icon-btn"
                  type="button"
                  onClick={onOpenSurpriseModal}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold border transition-colors ${
                    isLight
                      ? 'bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950'
                      : 'bg-zinc-950 border-zinc-700 text-zinc-200 hover:bg-white hover:text-zinc-950 hover:border-white'
                  }`}
                  title="Open System Terminal"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Terminal</span>
                </button>
              )}
            </div>

            {/* 2x2 Architectural Featured Projects Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 flex-1">
              {featuredShowcase.map((proj, index) => {
                const isTopRow = index < 2;
                const isLeftCol = index % 2 === 0;
                const hasValidLive = proj.liveDemoLink && proj.liveDemoLink !== '#';
                const targetUrl = hasValidLive
                  ? proj.liveDemoLink
                  : proj.githubLink && proj.githubLink !== '#'
                    ? proj.githubLink
                    : '#projects';
                const isExternal = targetUrl.startsWith('http');

                return (
                  <div
                    key={proj.id}
                    className={`p-5 sm:p-6 flex flex-col justify-between gap-4 transition-colors ${
                      isLight
                        ? 'hover:bg-zinc-50/80 border-zinc-200'
                        : 'hover:bg-zinc-900/40 border-zinc-800'
                    } ${isTopRow ? 'border-b' : 'border-b sm:border-b-0'} ${
                      isLeftCol ? 'sm:border-r' : ''
                    } ${index === 2 ? 'border-b sm:border-b-0' : ''}`}
                  >
                    <div className="space-y-3">
                      {/* Thumbnail + Header Row */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-16 h-16 shrink-0 border overflow-hidden flex items-center justify-center ${
                            isLight
                              ? 'border-zinc-200 bg-zinc-100'
                              : 'border-zinc-800 bg-zinc-900'
                          }`}
                        >
                          {!failedImages[proj.id] && proj.image ? (
                            <img
                              src={proj.image}
                              alt={proj.name}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedImages((prev) => ({ ...prev, [proj.id]: true }))
                              }
                              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                            />
                          ) : (
                            <FolderGit2 className={`w-6 h-6 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span
                            className={`text-[10px] font-mono uppercase tracking-wider block ${
                              isLight ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            0{index + 1} · {proj.category}
                          </span>
                          <h3
                            className={`text-sm sm:text-base font-bold tracking-tight leading-snug mt-0.5 line-clamp-2 ${
                              isLight ? 'text-zinc-950' : 'text-white'
                            }`}
                          >
                            {proj.name}
                          </h3>
                        </div>
                      </div>

                      {/* Concise Description */}
                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isLight ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      >
                        {proj.description}
                      </p>

                      {/* Crisp Bordered Stack Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${
                              isLight
                                ? 'border-zinc-200 bg-white text-zinc-700'
                                : 'border-zinc-800 bg-zinc-950 text-zinc-300'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Link */}
                    <div className="pt-1">
                      <a
                        href={targetUrl}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${
                          isLight
                            ? 'text-zinc-950 hover:text-zinc-600'
                            : 'text-white hover:text-zinc-300'
                        }`}
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Profile Photo Modal */}
      <UploadProfileModal
        isOpen={profileUploadOpen}
        onClose={() => setProfileUploadOpen(false)}
      />

      {/* Clean Lightbox Preview for Hero Box Photos */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full border border-zinc-800 bg-zinc-950 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{lightboxPhoto.label}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close photo preview"
                className="p-1 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden bg-zinc-900 flex items-center justify-center">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.label}
                className="max-h-[75vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
