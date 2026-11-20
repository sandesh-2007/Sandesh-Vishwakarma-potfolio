import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  PortfolioData,
  EducationItem,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  ExperienceCarouselSettings,
  CertificationItem,
  CertificationCarouselSettings,
  CertificateVerificationStatus,
  AchievementItem,
  SkillCategory,
  ProjectCategory,
} from '../types';
import {
  DEFAULT_CERTIFICATIONS_SETTINGS,
  DEFAULT_EXPERIENCE_SETTINGS,
} from '../data/initialData';
import { BrandLogo } from './BrandLogo';
import { 
  X, 
  Save, 
  RotateCcw, 
  LogOut, 
  Plus, 
  Trash2, 
  Upload, 
  User, 
  GraduationCap, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Trophy, 
  FileText, 
  Mail, 
  Check, 
  Sparkles,
  MessageSquare,
  Globe,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Building2,
  Monitor,
  Search,
  SlidersHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { SkillIcon, SKILL_ICON_PRESETS } from './SkillIcon';
import { ExperienceCard } from './ExperienceCard';
import { LogoCropUploadModal } from './LogoCropUploadModal';
import { CertificationCard } from './CertificationCard';

export const AdminEditPanel: React.FC = () => {
  const { 
    data, 
    isAdmin,
    editModalOpen, 
    adminEditTab,
    setEditModalOpen, 
    setLoginModalOpen,
    setSheetsModalOpen,
    syncAllMessagesToSheet,
    updatePortfolio, 
    resetPortfolio, 
    logout, 
    isSaving,
    adminToken,
    messages,
    fetchMessages,
    showToast,
    theme
  } = usePortfolio();

  // Local draft state that user can modify and then "Save Changes" or "Cancel"
  const [draft, setDraft] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications' | 'achievements' | 'resume' | 'messages'>('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [newProjectInputs, setNewProjectInputs] = useState<Record<string, string>>({});

  // Experience CMS UI states
  const [showExpSettings, setShowExpSettings] = useState(true);
  const [newExpSkillInputs, setNewExpSkillInputs] = useState<Record<string, string>>({});
  const [previewExpIds, setPreviewExpIds] = useState<Record<string, boolean>>({});
  const [confirmDeleteExpId, setConfirmDeleteExpId] = useState<string | null>(null);
  const [draggedExpIdx, setDraggedExpIdx] = useState<number | null>(null);
  const [dragOverExpIdx, setDragOverExpIdx] = useState<number | null>(null);
  const [cropUploadState, setCropUploadState] = useState<{ expIndex: number; file: File } | null>(null);

  // Certifications CMS UI states
  const [certSearch, setCertSearch] = useState('');
  const [certFilter, setCertFilter] = useState<'all' | 'enabled' | 'disabled' | 'has_image' | 'has_pdf'>('all');
  const [showCertSettings, setShowCertSettings] = useState(false);
  const [highlightedCertId, setHighlightedCertId] = useState<string | null>(null);
  const [previewCertIds, setPreviewCertIds] = useState<Record<string, boolean>>({});
  const [previewCertPdfIds, setPreviewCertPdfIds] = useState<Record<string, boolean>>({});
  const [confirmDeleteCertId, setConfirmDeleteCertId] = useState<string | null>(null);
  const [draggedCertIdx, setDraggedCertIdx] = useState<number | null>(null);
  const [dragOverCertIdx, setDragOverCertIdx] = useState<number | null>(null);

  // Sync draft & active tab whenever modal opens
  useEffect(() => {
    if (editModalOpen && isAdmin) {
      const cloned: PortfolioData = JSON.parse(JSON.stringify(data));
      cloned.skills = [...(cloned.skills || [])]
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .map((s, i) => ({
          ...s,
          enabled: s.enabled !== false,
          order: i,
          relatedProjects: Array.isArray(s.relatedProjects) ? s.relatedProjects : [],
          description: s.description || '',
        }));
      cloned.experience = [...(cloned.experience || [])]
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .map((e, i) => ({
          ...e,
          enabled: e.enabled !== false,
          order: i,
          isCurrent: e.isCurrent ?? e.endDate?.trim().toLowerCase() === 'present',
          responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities : [],
          achievements: Array.isArray(e.achievements) ? e.achievements : [],
          skills: Array.isArray(e.skills) ? e.skills : [],
        }));
      cloned.certifications = [...(cloned.certifications || [])]
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .map((c, i) => {
          const legacyDoc = c.certificateDocument || (c.certificateLink !== '#' ? c.certificateLink : '');
          const inferredPdf =
            c.pdfUrl ||
            (legacyDoc && legacyDoc.toLowerCase().endsWith('.pdf') ? legacyDoc : undefined);
          return {
            ...c,
            enabled: c.enabled !== false,
            order: i,
            verificationStatus: c.verificationStatus || 'Verified',
            pdfUrl: inferredPdf,
          };
        });
      cloned.experienceSettings = {
        ...DEFAULT_EXPERIENCE_SETTINGS,
        ...(cloned.experienceSettings || {}),
      };
      cloned.certificationsSettings = {
        ...DEFAULT_CERTIFICATIONS_SETTINGS,
        ...(cloned.certificationsSettings || {}),
      };
      const rawHeroGrid = Array.isArray(cloned.profile?.heroCollagePhotos)
        ? cloned.profile.heroCollagePhotos
        : [];
      cloned.profile = {
        ...cloned.profile,
        heroLeftPhoto: cloned.profile?.heroLeftPhoto || '',
        heroRightPhoto: cloned.profile?.heroRightPhoto || rawHeroGrid[0] || '',
        heroCollagePhotos: Array.from({ length: 11 }, (_, idx) =>
          typeof rawHeroGrid[idx] === 'string' ? rawHeroGrid[idx] : ''
        ),
      };
      setDraft(cloned);
      setActiveTab(adminEditTab || 'profile');
      setConfirmDeleteExpId(null);
      setConfirmDeleteCertId(null);
      setCertSearch('');
      setCertFilter('all');
      setHighlightedCertId(null);
      setPreviewCertIds({});
      setPreviewCertPdfIds({});
      fetchMessages();
    }
  }, [editModalOpen, isAdmin, adminEditTab]);

  if (!editModalOpen || !isAdmin) return null;

  // Strict persistent file upload helper (stores on server /uploads/..., never stores base64/blob)
  const uploadFilePersistently = (file: File): Promise<string | null> => {
    setIsUploading(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
            },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              fileType: file.type,
            }),
          });
          if (res.status === 401) {
            logout();
            setLoginModalOpen(true);
            showToast('Admin session expired. Please sign in again to upload files.', 'error');
            resolve(null);
            return;
          }
          if (res.status === 413) {
            showToast('File is too large to upload (max 35MB).', 'error');
            resolve(null);
            return;
          }
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.fileUrl) {
            showToast('File uploaded to persistent storage!', 'success');
            resolve(json.fileUrl as string);
          } else {
            showToast(json?.error || `Server upload failed (HTTP ${res.status}).`, 'error');
            resolve(null);
          }
        } catch (err) {
          showToast('Could not reach upload storage endpoint.', 'error');
          resolve(null);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        showToast('Failed to read selected file.', 'error');
        setIsUploading(false);
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  // Persistent base64 payload upload helper
  const uploadBase64Payload = async (
    base64Data: string,
    fileName: string,
    fileType: string
  ): Promise<string | null> => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({
          fileData: base64Data,
          fileName,
          fileType,
        }),
      });
      if (res.status === 401) {
        logout();
        setLoginModalOpen(true);
        showToast('Admin session expired. Please sign in again to upload images.', 'error');
        return null;
      }
      if (res.status === 413) {
        showToast('Image is too large to upload (max 35MB).', 'error');
        return null;
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.fileUrl) {
        showToast('Image uploaded and stored persistently!', 'success');
        return json.fileUrl as string;
      }
      showToast(json?.error || 'Server upload failed. Please try again.', 'error');
      return null;
    } catch (e) {
      showToast('Could not reach upload storage endpoint.', 'error');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Image / File Upload helper
  const handleFileUpload = async (file: File, callback: (fileUrl: string) => void) => {
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
            },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              fileType: file.type,
            }),
          });
          if (res.status === 401) {
            logout();
            setLoginModalOpen(true);
            showToast('Admin session expired. Please sign in again to upload.', 'error');
            return;
          }
          if (res.status === 413) {
            showToast('File is too large to upload (max 35MB).', 'error');
            return;
          }
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.fileUrl) {
            callback(json.fileUrl);
            showToast('File uploaded successfully!', 'success');
          } else if (res.status === 404) {
            callback(base64Data);
            showToast('File stored locally in browser!', 'info');
          } else {
            showToast(json?.error || `Upload failed (HTTP ${res.status}).`, 'error');
          }
        } catch (e) {
          showToast('Upload endpoint unreachable. Please try again.', 'error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setIsUploading(false);
        showToast('Failed to read selected file.', 'error');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
      showToast('Failed to process file', 'error');
    }
  };

  const handleSave = async () => {
    const res = await updatePortfolio(draft);
    if (res.success) {
      setEditModalOpen(false);
    }
  };

  const handleCancel = () => {
    setDraft(JSON.parse(JSON.stringify(data)));
    setEditModalOpen(false);
    showToast('Editing cancelled, changes discarded.', 'info');
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all portfolio details to initial defaults?')) {
      await resetPortfolio();
      setEditModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-orange-950/40 overflow-hidden"
      >
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              ADMIN
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Portfolio Content Manager</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950 border border-orange-500/40 text-orange-300 font-mono">
                  Live Sync
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Changes persist across website refreshes • No code modifications required
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/50 transition-colors"
              title="Reset portfolio to initial data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <button
              onClick={handleCancel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              id="admin-save-changes-btn"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: Left Tabs Sidebar + Right Form Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="w-full md:w-56 bg-black border-r border-zinc-800/80 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'education'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education ({draft.education.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'skills'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Skills ({draft.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'projects'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects ({draft.projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'experience'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience ({draft.experience.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'certifications'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certifications ({draft.certifications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('achievements')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'achievements'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements ({draft.achievements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'resume'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume & Links</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeTab === 'messages'
                  ? 'bg-orange-950/70 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>Inquiries ({messages.length})</span>
            </button>

            <div className="pt-2 mt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSheetsModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/40 transition-all shadow-sm group"
              >
                <BrandLogo name="sheets" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="overflow-hidden">
                  <div className="font-semibold text-[11px] truncate">Google Sheets</div>
                  <div className="text-[9px] text-emerald-300/80 font-mono truncate">
                    {data.sheetsConfig?.spreadsheetId ? 'Connected' : 'Setup Sync'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-zinc-950">
            
            {/* TAB 1: PROFILE & HERO */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                  Personal Information & Hero Content
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={draft.profile.name}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Headline / Academic Degree</label>
                    <input
                      type="text"
                      value={draft.profile.headline}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, headline: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={draft.profile.tagline}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, tagline: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Status Banner</label>
                    <input
                      type="text"
                      value={draft.profile.status}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, status: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={draft.profile.email}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={draft.profile.location}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, location: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Profile Photo upload or URL */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Profile Photo (Image URL or Upload)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 border border-zinc-700 bg-zinc-900 overflow-hidden shrink-0">
                      <img
                        src={draft.profile.avatarUrl || '/sandesh_profile.jpg'}
                        alt="Profile avatar preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <input
                      type="text"
                      value={draft.profile.avatarUrl}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, avatarUrl: e.target.value }
                      })}
                      placeholder="https://... or /uploads/..."
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (!file) return;
                          const isImg =
                            file.type.startsWith('image/') ||
                            /\.(png|jpe?g|webp|gif)$/i.test(file.name);
                          if (!isImg) {
                            showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
                            return;
                          }
                          const url = await uploadFilePersistently(file);
                          if (url) {
                            setDraft((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, avatarUrl: url },
                            }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Hero Flanking Photo Boxes (Left & Right Frames) */}
                <div className="p-4 border border-zinc-800 bg-zinc-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div>
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                        Hero Photo Frames (Left &amp; Right)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Upload photos for the left and right hero frames flanking your headline (also editable directly on the Hero).
                      </p>
                    </div>
                  </div>

                  {/* Left Hero Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-zinc-300">
                      Left Hero Frame Photo
                    </label>
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 border border-zinc-700 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center">
                        {draft.profile.heroLeftPhoto ? (
                          <img
                            src={draft.profile.heroLeftPhoto}
                            alt="Left hero frame"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={draft.profile.heroLeftPhoto || ''}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, heroLeftPhoto: e.target.value },
                          }))
                        }
                        placeholder="Image URL or /uploads/..."
                        className="flex-1 min-w-0 px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-xs font-mono text-white shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? '...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (!file) return;
                            const url = await uploadFilePersistently(file);
                            if (url) {
                              setDraft((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, heroLeftPhoto: url },
                              }));
                            }
                          }}
                        />
                      </label>
                      {draft.profile.heroLeftPhoto && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, heroLeftPhoto: '' },
                            }))
                          }
                          title="Clear left hero frame"
                          className="p-2 border border-zinc-700 text-zinc-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Hero Box */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-zinc-300">
                      Right Hero Frame Photo
                    </label>
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 border border-zinc-700 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center">
                        {draft.profile.heroRightPhoto ? (
                          <img
                            src={draft.profile.heroRightPhoto}
                            alt="Right hero frame"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={draft.profile.heroRightPhoto || ''}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, heroRightPhoto: e.target.value },
                          }))
                        }
                        placeholder="Image URL or /uploads/..."
                        className="flex-1 min-w-0 px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-xs font-mono text-white shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? '...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.gif,image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (!file) return;
                            const url = await uploadFilePersistently(file);
                            if (url) {
                              setDraft((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, heroRightPhoto: url },
                              }));
                            }
                          }}
                        />
                      </label>
                      {draft.profile.heroRightPhoto && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              profile: { ...prev.profile, heroRightPhoto: '' },
                            }))
                          }
                          title="Clear right hero frame"
                          className="p-2 border border-zinc-700 text-zinc-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Short Introduction */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Short Introduction (Hero)</label>
                  <textarea
                    rows={3}
                    value={draft.profile.shortBio}
                    onChange={(e) => setDraft({
                      ...draft,
                      profile: { ...draft.profile, shortBio: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* About Me Long Paragraphs */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-slate-300">About Me Detailed Paragraphs</label>
                    <button
                      type="button"
                      onClick={() => setDraft({
                        ...draft,
                        profile: {
                          ...draft.profile,
                          aboutLong: [...draft.profile.aboutLong, 'New paragraph...']
                        }
                      })}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Paragraph
                    </button>
                  </div>

                  <div className="space-y-3">
                    {draft.profile.aboutLong.map((para, pIdx) => (
                      <div key={pIdx} className="flex gap-2 items-start">
                        <textarea
                          rows={2}
                          value={para}
                          onChange={(e) => {
                            const updated = [...draft.profile.aboutLong];
                            updated[pIdx] = e.target.value;
                            setDraft({
                              ...draft,
                              profile: { ...draft.profile, aboutLong: updated }
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = draft.profile.aboutLong.filter((_, i) => i !== pIdx);
                            setDraft({
                              ...draft,
                              profile: { ...draft.profile, aboutLong: updated }
                            });
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400">Projects Stat</label>
                    <input
                      type="text"
                      value={draft.profile.stats.projectsCount}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: {
                          ...draft.profile,
                          stats: { ...draft.profile.stats, projectsCount: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400">Skills Stat</label>
                    <input
                      type="text"
                      value={draft.profile.stats.technologiesCount}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: {
                          ...draft.profile,
                          stats: { ...draft.profile.stats, technologiesCount: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400">Certifications Stat</label>
                    <input
                      type="text"
                      value={draft.profile.stats.certificationsCount}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: {
                          ...draft.profile,
                          stats: { ...draft.profile.stats, certificationsCount: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400">Semester Status</label>
                    <input
                      type="text"
                      value={draft.profile.stats.currentSemester}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: {
                          ...draft.profile,
                          stats: { ...draft.profile.stats, currentSemester: e.target.value }
                        }
                      })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Education & Qualifications</h3>
                    <p className="text-xs text-slate-400">Manage academic degrees, institutions, years and records</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu: EducationItem = {
                        id: 'edu-' + Date.now(),
                        degree: 'New Qualification / Degree',
                        institution: 'College / Board / Institution',
                        startYear: '2024',
                        endYear: 'Present',
                        status: 'Pursuing',
                        description: 'Coursework and academic focus...',
                        certificateLink: '#'
                      };
                      setDraft({ ...draft, education: [newEdu, ...draft.education] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Qualification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draft.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-cyan-400 font-semibold">Entry #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              education: draft.education.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Degree Title</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].degree = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].institution = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Start Year</label>
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].startYear = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">End Year / Expected</label>
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].endYear = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Status Badge</label>
                          <input
                            type="text"
                            value={edu.status}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].status = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Certificate / Record Link</label>
                          <input
                            type="text"
                            value={edu.certificateLink || ''}
                            onChange={(e) => {
                              const updated = [...draft.education];
                              updated[idx].certificateLink = e.target.value;
                              setDraft({ ...draft, education: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={edu.description}
                          onChange={(e) => {
                            const updated = [...draft.education];
                            updated[idx].description = e.target.value;
                            setDraft({ ...draft, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS (3D ORBIT MANAGER) */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">3D Skill Orbit Manager</h3>
                    <p className="text-xs text-zinc-400">
                      Add, edit descriptions, upload custom icons, reorder orbit slots, link related projects, or toggle visibility
                    </p>
                  </div>
                  <button
                    type="button"
                    id="admin-add-skill-btn"
                    onClick={() => {
                      const newSkill: SkillItem = {
                        id: 'sk-' + Date.now(),
                        name: 'New Technology',
                        category: 'Frontend',
                        proficiency: 85,
                        icon: 'Code2',
                        level: 'Proficient',
                        description: 'Core capability and practical workflow experience.',
                        relatedProjects: [],
                        enabled: true,
                        order: 0,
                      };
                      const reordered = [newSkill, ...draft.skills].map((s, i) => ({
                        ...s,
                        order: i,
                      }));
                      setDraft({ ...draft, skills: reordered });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-semibold transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                {draft.skills.length === 0 && (
                  <div className="p-8 border border-zinc-800 bg-zinc-900 text-center text-xs font-mono text-zinc-400">
                    No skills configured. Click &quot;Add Skill&quot; above to add a technology to the 3D Orbit.
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {draft.skills.map((skill, idx) => {
                    const isEnabled = skill.enabled !== false;
                    const projectInputVal = newProjectInputs[skill.id] || '';
                    const relatedList = skill.relatedProjects || [];

                    const moveSkill = (direction: -1 | 1) => {
                      const targetIdx = idx + direction;
                      if (targetIdx < 0 || targetIdx >= draft.skills.length) return;
                      const cloned = [...draft.skills];
                      const [moved] = cloned.splice(idx, 1);
                      cloned.splice(targetIdx, 0, moved);
                      const normalized = cloned.map((item, orderIdx) => ({
                        ...item,
                        order: orderIdx,
                      }));
                      setDraft({ ...draft, skills: normalized });
                    };

                    const addRelatedProjectToSkill = (projNameRaw: string) => {
                      const trimmed = projNameRaw.trim();
                      if (!trimmed) return;
                      if (relatedList.includes(trimmed)) {
                        setNewProjectInputs((prev) => ({ ...prev, [skill.id]: '' }));
                        return;
                      }
                      const updated = [...draft.skills];
                      updated[idx] = {
                        ...updated[idx],
                        relatedProjects: [...relatedList, trimmed],
                      };
                      setDraft({ ...draft, skills: updated });
                      setNewProjectInputs((prev) => ({ ...prev, [skill.id]: '' }));
                    };

                    return (
                      <div
                        key={skill.id}
                        className={`p-4 border bg-zinc-900 space-y-3 transition-opacity ${
                          isEnabled ? 'border-zinc-800' : 'border-zinc-800/60 opacity-75'
                        }`}
                      >
                        {/* Top Control Bar: Order, Preview, Toggle, Delete */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 border border-zinc-700 bg-zinc-950 flex items-center justify-center shrink-0 text-white">
                              <SkillIcon skill={skill} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                #{String(idx + 1).padStart(2, '0')} · {skill.name || 'Untitled Skill'}
                              </div>
                              <div className="text-[10px] font-mono text-zinc-400">
                                {isEnabled ? 'Visible on Public Orbit' : 'Hidden from Public Orbit'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Reorder Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveSkill(-1)}
                              title="Move Earlier in Orbit"
                              aria-label={`Move ${skill.name} up`}
                              className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Reorder Down */}
                            <button
                              type="button"
                              disabled={idx === draft.skills.length - 1}
                              onClick={() => moveSkill(1)}
                              title="Move Later in Orbit"
                              aria-label={`Move ${skill.name} down`}
                              className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Enable / Disable Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], enabled: !isEnabled };
                                setDraft({ ...draft, skills: updated });
                              }}
                              title={isEnabled ? 'Disable skill on public site' : 'Enable skill on public site'}
                              aria-pressed={isEnabled}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-mono uppercase ${
                                isEnabled
                                  ? 'border-zinc-500 bg-zinc-950 text-white'
                                  : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                              }`}
                            >
                              {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{isEnabled ? 'On' : 'Off'}</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = draft.skills
                                  .filter((_, i) => i !== idx)
                                  .map((item, orderIdx) => ({ ...item, order: orderIdx }));
                                setDraft({ ...draft, skills: filtered });
                              }}
                              title="Delete skill"
                              aria-label={`Delete ${skill.name}`}
                              className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Core Name, Category, Level, Icon Preset */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Skill Name</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setDraft({ ...draft, skills: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Category</label>
                            <select
                              value={skill.category}
                              onChange={(e) => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], category: e.target.value as SkillCategory };
                                setDraft({ ...draft, skills: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            >
                              <option value="Frontend">Frontend</option>
                              <option value="Programming">Programming</option>
                              <option value="Data & Tools">Data &amp; Tools</option>
                              <option value="Design & AI">Design &amp; AI</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Icon Preset</label>
                            <select
                              value={skill.icon || 'Code2'}
                              onChange={(e) => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setDraft({ ...draft, skills: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            >
                              {SKILL_ICON_PRESETS.map((preset) => (
                                <option key={preset.value} value={preset.value}>
                                  {preset.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Level Tag</label>
                            <input
                              type="text"
                              value={skill.level}
                              onChange={(e) => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], level: e.target.value };
                                setDraft({ ...draft, skills: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Upload / Change Custom Icon */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Custom Icon (Upload Image/SVG or Paste URL)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={skill.iconUrl || ''}
                              onChange={(e) => {
                                const updated = [...draft.skills];
                                updated[idx] = { ...updated[idx], iconUrl: e.target.value };
                                setDraft({ ...draft, skills: updated });
                              }}
                              placeholder="Using preset SVG (or paste URL / upload)"
                              className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-200 shrink-0">
                              <Upload className="w-3 h-3" />
                              <span>{isUploading ? '...' : 'Upload'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = '';
                                  if (file) {
                                    handleFileUpload(file, (url) => {
                                      setDraft((prev) => {
                                        const next = [...prev.skills];
                                        if (next[idx]) {
                                          next[idx] = { ...next[idx], iconUrl: url };
                                        }
                                        return { ...prev, skills: next };
                                      });
                                    });
                                  }
                                }}
                              />
                            </label>
                            {skill.iconUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...draft.skills];
                                  updated[idx] = { ...updated[idx], iconUrl: '' };
                                  setDraft({ ...draft, skills: updated });
                                }}
                                title="Clear custom icon"
                                className="p-1.5 border border-zinc-700 text-zinc-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Skill Description */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Description (Shown in Orbit Inspector Panel)
                          </label>
                          <textarea
                            rows={2}
                            value={skill.description || ''}
                            onChange={(e) => {
                              const updated = [...draft.skills];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setDraft({ ...draft, skills: updated });
                            }}
                            placeholder="Describe what you build with this technology..."
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white resize-none"
                          />
                        </div>

                        {/* Related Projects Editor */}
                        <div className="space-y-2 pt-1">
                          <label className="block text-[10px] font-mono text-zinc-400">
                            Related Projects ({relatedList.length})
                          </label>

                          {relatedList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {relatedList.map((projName, pIdx) => (
                                <span
                                  key={`${skill.id}-rp-${pIdx}`}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 border border-zinc-700 bg-zinc-950 text-[11px] font-mono text-zinc-200"
                                >
                                  <span className="truncate max-w-[180px]">{projName}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...draft.skills];
                                      updated[idx] = {
                                        ...updated[idx],
                                        relatedProjects: relatedList.filter((_, i) => i !== pIdx),
                                      };
                                      setDraft({ ...draft, skills: updated });
                                    }}
                                    aria-label={`Remove ${projName}`}
                                    className="text-zinc-400 hover:text-rose-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={projectInputVal}
                              onChange={(e) =>
                                setNewProjectInputs((prev) => ({
                                  ...prev,
                                  [skill.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addRelatedProjectToSkill(projectInputVal);
                                }
                              }}
                              placeholder="Add related project title..."
                              className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => addRelatedProjectToSkill(projectInputVal)}
                              className="px-2.5 py-1.5 border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-[11px] font-mono text-white shrink-0"
                            >
                              Add
                            </button>
                          </div>

                          {/* Quick link from existing portfolio projects */}
                          {draft.projects.length > 0 && (
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  addRelatedProjectToSkill(e.target.value);
                                }
                              }}
                              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400"
                            >
                              <option value="">+ Quick-link from existing portfolio projects...</option>
                              {draft.projects
                                .filter((p) => !relatedList.includes(p.name))
                                .map((p) => (
                                  <option key={p.id} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Project Showcase</h3>
                    <p className="text-xs text-slate-400">Manage project descriptions, tech tags, links, and cover images</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: 'proj-' + Date.now(),
                        name: 'New Project Title',
                        category: 'Web Development',
                        description: 'Clear description of the application...',
                        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
                        technologies: ['React', 'TypeScript', 'Tailwind'],
                        githubLink: 'https://github.com',
                        liveDemoLink: '#',
                        featured: true
                      };
                      setDraft({ ...draft, projects: [newProj, ...draft.projects] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {draft.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{proj.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              projects: draft.projects.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx].name = e.target.value;
                              setDraft({ ...draft, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                          <select
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx].category = e.target.value as ProjectCategory;
                              setDraft({ ...draft, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          >
                            <option value="Web Development">Web Development</option>
                            <option value="Systems & Software">Systems & Software</option>
                            <option value="Data & Analysis">Data & Analysis</option>
                            <option value="College Projects">College Projects</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">GitHub Link</label>
                          <input
                            type="text"
                            value={proj.githubLink}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx].githubLink = e.target.value;
                              setDraft({ ...draft, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Live Demo Link</label>
                          <input
                            type="text"
                            value={proj.liveDemoLink}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx].liveDemoLink = e.target.value;
                              setDraft({ ...draft, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Project Image and Upload */}
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Project Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proj.image}
                            onChange={(e) => {
                              const updated = [...draft.projects];
                              updated[idx].image = e.target.value;
                              setDraft({ ...draft, projects: updated });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200">
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                e.target.value = '';
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    setDraft((prev) => ({
                                      ...prev,
                                      projects: prev.projects.map((p, i) =>
                                        i === idx ? { ...p, image: url } : p
                                      ),
                                    }));
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...draft.projects];
                            updated[idx].description = e.target.value;
                            setDraft({ ...draft, projects: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white resize-none"
                        />
                      </div>

                      {/* Technologies (comma separated) */}
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={proj.technologies.join(', ')}
                          onChange={(e) => {
                            const updated = [...draft.projects];
                            updated[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setDraft({ ...draft, projects: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: EXPERIENCE CMS */}
            {activeTab === 'experience' && (() => {
              const expSettings: ExperienceCarouselSettings = {
                ...DEFAULT_EXPERIENCE_SETTINGS,
                ...(draft.experienceSettings || {}),
              };

              const updateExpSettings = (patch: Partial<ExperienceCarouselSettings>) => {
                setDraft((prev) => ({
                  ...prev,
                  experienceSettings: {
                    ...DEFAULT_EXPERIENCE_SETTINGS,
                    ...(prev.experienceSettings || {}),
                    ...patch,
                  },
                }));
              };

              return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Experience Carousel CMS</h3>
                    <p className="text-xs text-zinc-400">
                      Drag cards to reorder carousel, upload cropped organization logos, edit responsibilities &amp; skills, or configure carousel settings
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowExpSettings((s) => !s)}
                      aria-expanded={showExpSettings}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{showExpSettings ? 'Hide Carousel Settings' : 'Carousel Settings'}</span>
                    </button>

                    <button
                      type="button"
                      id="admin-add-experience-btn"
                      onClick={() => {
                        const newExp: ExperienceItem = {
                          id: 'exp-' + Date.now(),
                          role: 'Role / Designation',
                          organization: 'Organization Name',
                          type: 'Part-time',
                          startDate: 'Jan 2026',
                          endDate: 'Present',
                          isCurrent: true,
                          location: 'Mumbai, Maharashtra, India',
                          workMode: 'Hybrid',
                          description: 'Overview of role, scope, and core operational responsibilities...',
                          responsibilities: ['Executed core deliverables and collaborated across teams.'],
                          achievements: [],
                          skills: ['Communication'],
                          enabled: true,
                          order: 0,
                        };
                        const reordered = [newExp, ...draft.experience].map((item, i) => ({
                          ...item,
                          order: i,
                        }));
                        setDraft({ ...draft, experience: reordered });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-700 bg-zinc-950 keep-dark text-white keep-white hover:bg-zinc-800 text-xs font-mono font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                </div>

                {/* Experience Public Carousel Settings Panel */}
                {showExpSettings && (
                  <div className="p-4 sm:p-5 border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                        Public Carousel Settings
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Saved directly with portfolio
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={expSettings.heading}
                          onChange={(e) => updateExpSettings({ heading: e.target.value })}
                          placeholder="Experience"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Section Description
                        </label>
                        <input
                          type="text"
                          value={expSettings.description}
                          onChange={(e) => updateExpSettings({ description: e.target.value })}
                          placeholder="Continuous roles across cooperative finance..."
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Animation Speed
                        </label>
                        <select
                          value={expSettings.speed}
                          onChange={(e) =>
                            updateExpSettings({
                              speed: e.target.value as ExperienceCarouselSettings['speed'],
                            })
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        >
                          <option value="slow">Slow</option>
                          <option value="normal">Normal</option>
                          <option value="fast">Fast</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Scroll Direction
                        </label>
                        <select
                          value={expSettings.direction}
                          onChange={(e) =>
                            updateExpSettings({
                              direction: e.target.value as ExperienceCarouselSettings['direction'],
                            })
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        >
                          <option value="ltr">Left to Right</option>
                          <option value="rtl">Right to Left</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Cards Visible on Desktop
                        </label>
                        <select
                          value={expSettings.desktopCards}
                          onChange={(e) =>
                            updateExpSettings({
                              desktopCards: Number(e.target.value) as 2 | 3 | 4,
                            })
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        >
                          <option value={2}>2 Cards</option>
                          <option value={3}>3 Cards</option>
                          <option value={4}>4 Cards</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                          Card Spacing
                        </label>
                        <select
                          value={expSettings.cardGap}
                          onChange={(e) =>
                            updateExpSettings({
                              cardGap: e.target.value as ExperienceCarouselSettings['cardGap'],
                            })
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                        >
                          <option value="compact">Compact (12px)</option>
                          <option value="normal">Normal (20px)</option>
                          <option value="spacious">Spacious (28px)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {[
                        { key: 'autoScroll', label: 'Auto Scrolling' },
                        { key: 'pauseOnHover', label: 'Pause on Hover' },
                        { key: 'showArrows', label: 'Nav Arrows' },
                        { key: 'showIndicators', label: 'Indicators' },
                      ].map((item) => {
                        const checked = Boolean(
                          expSettings[item.key as keyof ExperienceCarouselSettings]
                        );
                        return (
                          <label
                            key={item.key}
                            className="flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-200 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                updateExpSettings({
                                  [item.key]: e.target.checked,
                                } as Partial<ExperienceCarouselSettings>)
                              }
                              className="accent-white"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {draft.experience.length === 0 && (
                  <div className="p-8 border border-zinc-800 bg-zinc-900 text-center text-xs font-mono text-zinc-400">
                    No experience records configured. Click &quot;Add Experience&quot; above to create one.
                  </div>
                )}

                <div className="space-y-5">
                  {draft.experience.map((exp, idx) => {
                    const isEnabled = exp.enabled !== false;
                    const isCurrent = Boolean(
                      exp.isCurrent || (exp.endDate && exp.endDate.trim().toLowerCase() === 'present')
                    );
                    const isPreviewOpen = Boolean(previewExpIds[exp.id]);
                    const expSkills = exp.skills || [];
                    const expAchievements = exp.achievements || [];
                    const expSkillInput = newExpSkillInputs[exp.id] || '';

                    const moveExp = (fromIdx: number, toIdx: number) => {
                      if (toIdx < 0 || toIdx >= draft.experience.length || fromIdx === toIdx) return;
                      const cloned = [...draft.experience];
                      const [moved] = cloned.splice(fromIdx, 1);
                      cloned.splice(toIdx, 0, moved);
                      const normalized = cloned.map((item, orderIdx) => ({
                        ...item,
                        order: orderIdx,
                      }));
                      setDraft({ ...draft, experience: normalized });
                    };

                    const addSkillTag = (rawTag: string) => {
                      const trimmed = rawTag.trim();
                      if (!trimmed) return;
                      if (expSkills.includes(trimmed)) {
                        setNewExpSkillInputs((prev) => ({ ...prev, [exp.id]: '' }));
                        return;
                      }
                      const updated = [...draft.experience];
                      updated[idx] = { ...updated[idx], skills: [...expSkills, trimmed] };
                      setDraft({ ...draft, experience: updated });
                      setNewExpSkillInputs((prev) => ({ ...prev, [exp.id]: '' }));
                    };

                    return (
                      <div
                        key={exp.id}
                        draggable
                        onDragStart={() => setDraggedExpIdx(idx)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverExpIdx !== idx) setDragOverExpIdx(idx);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedExpIdx !== null) {
                            moveExp(draggedExpIdx, idx);
                          }
                          setDraggedExpIdx(null);
                          setDragOverExpIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedExpIdx(null);
                          setDragOverExpIdx(null);
                        }}
                        className={`p-5 border bg-zinc-900 space-y-4 transition-all ${
                          dragOverExpIdx === idx && draggedExpIdx !== idx
                            ? 'border-white ring-1 ring-zinc-500'
                            : isEnabled
                              ? 'border-zinc-800'
                              : 'border-zinc-800/60 opacity-75'
                        }`}
                      >
                        {/* Header Bar: Drag handle, Index, Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-200"
                              title="Drag to reorder carousel position"
                            >
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <div className="w-9 h-9 border border-zinc-700 bg-zinc-950 flex items-center justify-center shrink-0 overflow-hidden">
                              {exp.logoUrl ? (
                                <img
                                  src={exp.logoUrl}
                                  alt={`${exp.organization} logo`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Building2 className="w-4 h-4 text-zinc-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                #{String(idx + 1).padStart(2, '0')} · {exp.role || 'Untitled Role'}
                              </div>
                              <div className="text-[10px] font-mono text-zinc-400 truncate">
                                {exp.organization} · {isEnabled ? 'Published' : 'Hidden Draft'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveExp(idx, idx - 1)}
                              title="Move Earlier"
                              className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === draft.experience.length - 1}
                              onClick={() => moveExp(idx, idx + 1)}
                              title="Move Later"
                              className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewExpIds((prev) => ({
                                  ...prev,
                                  [exp.id]: !prev[exp.id],
                                }))
                              }
                              aria-pressed={isPreviewOpen}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-mono uppercase ${
                                isPreviewOpen
                                  ? 'border-zinc-500 bg-zinc-950 text-white'
                                  : 'border-zinc-700 text-zinc-300 hover:text-white'
                              }`}
                            >
                              <Monitor className="w-3 h-3" />
                              <span>{isPreviewOpen ? 'Hide Preview' : 'Preview'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...draft.experience];
                                updated[idx] = { ...updated[idx], enabled: !isEnabled };
                                setDraft({ ...draft, experience: updated });
                              }}
                              aria-pressed={isEnabled}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-mono uppercase ${
                                isEnabled
                                  ? 'border-zinc-500 bg-zinc-950 text-white'
                                  : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                              }`}
                            >
                              {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{isEnabled ? 'On' : 'Off'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteExpId(exp.id)}
                              title="Delete experience"
                              className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Two-Step Delete Confirmation */}
                        {confirmDeleteExpId === exp.id && (
                          <div className="p-3 border border-rose-800/70 bg-rose-950/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                            <span className="text-rose-300">
                              Delete &quot;{exp.role}&quot;? This removes it from the carousel once saved.
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteExpId(null)}
                                className="px-2.5 py-1 border border-zinc-700 text-zinc-300 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = draft.experience
                                    .filter((_, i) => i !== idx)
                                    .map((item, orderIdx) => ({ ...item, order: orderIdx }));
                                  setDraft({ ...draft, experience: filtered });
                                  setConfirmDeleteExpId(null);
                                }}
                                className="px-2.5 py-1 bg-rose-700 text-white hover:bg-rose-600 font-semibold"
                              >
                                Confirm Delete
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Live Card Preview Before Publishing */}
                        {isPreviewOpen && (
                          <div className="p-3 border border-zinc-700 bg-zinc-950 space-y-2">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                              Live Public Carousel Card Preview ({theme} theme)
                            </div>
                            <div className="max-w-md">
                              <ExperienceCard exp={exp} isLight={theme === 'light'} />
                            </div>
                          </div>
                        )}

                        {/* Organization Logo Upload / Crop / Replace / Delete */}
                        <div className="p-3 border border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 border border-zinc-700 bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden">
                              {exp.logoUrl ? (
                                <img
                                  src={exp.logoUrl}
                                  alt="Organization logo preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-zinc-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-mono font-semibold text-white">
                                Organization Logo
                              </div>
                              <div className="text-[10px] font-mono text-zinc-400 truncate">
                                {exp.logoUrl
                                  ? `Stored URL: ${exp.logoUrl}`
                                  : 'PNG, JPG, JPEG, or WebP · Optional crop before saving'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-mono text-white">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploading ? 'Uploading...' : exp.logoUrl ? 'Replace Logo' : 'Upload Logo'}</span>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = '';
                                  if (!file) return;
                                  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
                                  if (!allowed.includes(file.type.toLowerCase())) {
                                    showToast('Please select a PNG, JPG, JPEG, or WebP image.', 'error');
                                    return;
                                  }
                                  setCropUploadState({ expIndex: idx, file });
                                }}
                              />
                            </label>
                            {exp.logoUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...draft.experience];
                                  updated[idx] = { ...updated[idx], logoUrl: '' };
                                  setDraft({ ...draft, experience: updated });
                                }}
                                className="px-2.5 py-1.5 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-rose-400"
                              >
                                Delete Logo
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                              Job Title / Designation
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx] = { ...updated[idx], role: e.target.value };
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                              Organization Name
                            </label>
                            <input
                              type="text"
                              value={exp.organization}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx] = { ...updated[idx], organization: e.target.value };
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                              Employment Type
                            </label>
                            <select
                              value={exp.type}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx] = { ...updated[idx], type: e.target.value };
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Volunteer">Volunteer</option>
                              <option value="Internship">Internship</option>
                              <option value="Apprenticeship">Apprenticeship</option>
                              <option value="Freelance">Freelance</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => {
                                  const updated = [...draft.experience];
                                  updated[idx] = { ...updated[idx], startDate: e.target.value };
                                  setDraft({ ...draft, experience: updated });
                                }}
                                placeholder="e.g. Mar 2025"
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">End Date</label>
                              <input
                                type="text"
                                disabled={isCurrent}
                                value={isCurrent ? 'Present' : exp.endDate}
                                onChange={(e) => {
                                  const updated = [...draft.experience];
                                  updated[idx] = { ...updated[idx], endDate: e.target.value };
                                  setDraft({ ...draft, experience: updated });
                                }}
                                placeholder="e.g. Dec 2025"
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">Location</label>
                            <input
                              type="text"
                              value={exp.location || ''}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx] = { ...updated[idx], location: e.target.value };
                                setDraft({ ...draft, experience: updated });
                              }}
                              placeholder="Mumbai, Maharashtra, India"
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 items-end">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">Work Mode</label>
                              <select
                                value={exp.workMode || 'Hybrid'}
                                onChange={(e) => {
                                  const updated = [...draft.experience];
                                  updated[idx] = { ...updated[idx], workMode: e.target.value };
                                  setDraft({ ...draft, experience: updated });
                                }}
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              >
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                              </select>
                            </div>

                            <label className="flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isCurrent}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const updated = [...draft.experience];
                                  updated[idx] = {
                                    ...updated[idx],
                                    isCurrent: checked,
                                    endDate: checked ? 'Present' : (exp.endDate === 'Present' ? '' : exp.endDate),
                                  };
                                  setDraft({ ...draft, experience: updated });
                                }}
                                className="accent-white"
                              />
                              <span>Present Role</span>
                            </label>
                          </div>
                        </div>

                        {/* Experience Description */}
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={exp.description || ''}
                            onChange={(e) => {
                              const updated = [...draft.experience];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setDraft({ ...draft, experience: updated });
                            }}
                            placeholder="Brief summary of responsibilities and impact..."
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white resize-none"
                          />
                        </div>

                        {/* Responsibilities bullets */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-mono text-zinc-400">
                              Responsibilities ({exp.responsibilities.length})
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...draft.experience];
                                updated[idx] = {
                                  ...updated[idx],
                                  responsibilities: [...updated[idx].responsibilities, 'New responsibility...'],
                                };
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Responsibility
                            </button>
                          </div>

                          <div className="space-y-2">
                            {exp.responsibilities.map((bullet, bIdx) => (
                              <div key={bIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updated = [...draft.experience];
                                    const nextBullets = [...updated[idx].responsibilities];
                                    nextBullets[bIdx] = e.target.value;
                                    updated[idx] = { ...updated[idx], responsibilities: nextBullets };
                                    setDraft({ ...draft, experience: updated });
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...draft.experience];
                                    updated[idx] = {
                                      ...updated[idx],
                                      responsibilities: updated[idx].responsibilities.filter((_, i) => i !== bIdx),
                                    };
                                    setDraft({ ...draft, experience: updated });
                                  }}
                                  className="p-1.5 text-zinc-400 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Achievements / Accomplishments bullets */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-mono text-zinc-400">
                              Achievements &amp; Accomplishments ({expAchievements.length})
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...draft.experience];
                                updated[idx] = {
                                  ...updated[idx],
                                  achievements: [...expAchievements, 'New key accomplishment...'],
                                };
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Achievement
                            </button>
                          </div>

                          {expAchievements.length > 0 && (
                            <div className="space-y-2">
                              {expAchievements.map((ach, aIdx) => (
                                <div key={aIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={ach}
                                    onChange={(e) => {
                                      const updated = [...draft.experience];
                                      const nextAch = [...expAchievements];
                                      nextAch[aIdx] = e.target.value;
                                      updated[idx] = { ...updated[idx], achievements: nextAch };
                                      setDraft({ ...draft, experience: updated });
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...draft.experience];
                                      updated[idx] = {
                                        ...updated[idx],
                                        achievements: expAchievements.filter((_, i) => i !== aIdx),
                                      };
                                      setDraft({ ...draft, experience: updated });
                                    }}
                                    className="p-1.5 text-zinc-400 hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Associated Skills */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono text-zinc-400">
                            Associated Skills ({expSkills.length})
                          </label>

                          {expSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {expSkills.map((sk, sIdx) => (
                                <span
                                  key={`${exp.id}-sk-${sIdx}`}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 border border-zinc-700 bg-zinc-950 text-[11px] font-mono text-zinc-200"
                                >
                                  <span>{sk}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...draft.experience];
                                      updated[idx] = {
                                        ...updated[idx],
                                        skills: expSkills.filter((_, i) => i !== sIdx),
                                      };
                                      setDraft({ ...draft, experience: updated });
                                    }}
                                    className="text-zinc-400 hover:text-rose-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={expSkillInput}
                              onChange={(e) =>
                                setNewExpSkillInputs((prev) => ({
                                  ...prev,
                                  [exp.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addSkillTag(expSkillInput);
                                }
                              }}
                              placeholder="Add associated skill (e.g. Microsoft Excel, React)..."
                              className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => addSkillTag(expSkillInput)}
                              className="px-3 py-1.5 border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-[11px] font-mono text-white shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Organization Logo Crop & Persistent Upload Modal */}
                <LogoCropUploadModal
                  file={cropUploadState?.file || null}
                  onCancel={() => setCropUploadState(null)}
                  onConfirmUpload={async (base64Data, fileName, mimeType) => {
                    if (!cropUploadState) return;
                    const targetIdx = cropUploadState.expIndex;
                    const uploadedUrl = await uploadBase64Payload(base64Data, fileName, mimeType);
                    if (uploadedUrl) {
                      setDraft((prev) => {
                        const next = [...prev.experience];
                        if (next[targetIdx]) {
                          next[targetIdx] = { ...next[targetIdx], logoUrl: uploadedUrl };
                        }
                        return { ...prev, experience: next };
                      });
                    }
                    setCropUploadState(null);
                  }}
                />
              </div>
              );
            })()}

            {/* TAB 6: CERTIFICATIONS CMS & CAROUSEL SETTINGS */}
            {activeTab === 'certifications' && (() => {
              const certSettings: CertificationCarouselSettings = {
                ...DEFAULT_CERTIFICATIONS_SETTINGS,
                ...(draft.certificationsSettings || {}),
              };

              const updateCertSettings = (patch: Partial<CertificationCarouselSettings>) => {
                setDraft((prev) => ({
                  ...prev,
                  certificationsSettings: {
                    ...DEFAULT_CERTIFICATIONS_SETTINGS,
                    ...(prev.certificationsSettings || {}),
                    ...patch,
                  },
                }));
              };

              const updateCertById = (certId: string, updater: (c: CertificationItem) => CertificationItem) => {
                setDraft((prev) => ({
                  ...prev,
                  certifications: prev.certifications.map((item) =>
                    item.id === certId ? updater(item) : item
                  ),
                }));
              };

              const moveCert = (fromIdx: number, toIdx: number) => {
                if (
                  toIdx < 0 ||
                  toIdx >= draft.certifications.length ||
                  fromIdx === toIdx
                ) {
                  return;
                }
                const cloned = [...draft.certifications];
                const [moved] = cloned.splice(fromIdx, 1);
                cloned.splice(toIdx, 0, moved);
                const normalized = cloned.map((item, i) => ({ ...item, order: i }));
                setDraft({ ...draft, certifications: normalized });
              };

              const isReorderable = certSearch.trim() === '' && certFilter === 'all';
              const query = certSearch.trim().toLowerCase();
              const filteredCerts = draft.certifications.filter((c) => {
                const enabled = c.enabled !== false;
                const hasPdf = Boolean(
                  c.pdfUrl ||
                    (c.certificateDocument && c.certificateDocument.toLowerCase().endsWith('.pdf'))
                );
                if (certFilter === 'enabled' && !enabled) return false;
                if (certFilter === 'disabled' && enabled) return false;
                if (certFilter === 'has_image' && !c.imageUrl) return false;
                if (certFilter === 'has_pdf' && !hasPdf) return false;
                if (!query) return true;
                return (
                  c.name.toLowerCase().includes(query) ||
                  c.issuingOrg.toLowerCase().includes(query) ||
                  (c.credentialId || '').toLowerCase().includes(query) ||
                  (c.year || '').toLowerCase().includes(query) ||
                  (c.description || '').toLowerCase().includes(query)
                );
              });

              return (
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Certifications &amp; Carousel CMS
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Manage certificates, upload images/PDFs, drag-and-drop reorder, and configure carousel behavior
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCertSettings((s) => !s)}
                        aria-expanded={showCertSettings}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>{showCertSettings ? 'Hide Carousel Settings' : 'Carousel Settings'}</span>
                      </button>

                      <button
                        type="button"
                        id="admin-add-certification-btn"
                        onClick={() => {
                          const newCertId = `cert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                          const newCert: CertificationItem = {
                            id: newCertId,
                            name: 'New Certification Title',
                            issuingOrg: 'Issuing Organization',
                            issueDate: 'Jan 2026',
                            year: '2026',
                            expiryDate: 'No Expiry',
                            credentialId: '',
                            certificateLink: '#',
                            description: '',
                            verificationStatus: 'Verified',
                            enabled: true,
                            order: 0,
                          };
                          setDraft((prev) => {
                            const existing = Array.isArray(prev.certifications)
                              ? prev.certifications
                              : [];
                            const reordered = [newCert, ...existing].map((item, i) => ({
                              ...item,
                              order: i,
                            }));
                            return { ...prev, certifications: reordered };
                          });
                          setCertSearch('');
                          setCertFilter('all');
                          setShowCertSettings(false);
                          setHighlightedCertId(newCertId);
                          showToast('New certificate card added — edit details and click Save Changes.', 'success');

                          requestAnimationFrame(() => {
                            setTimeout(() => {
                              const cardEl = document.getElementById(`cert-editor-${newCertId}`);
                              if (cardEl) {
                                cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                const titleInput = cardEl.querySelector<HTMLInputElement>(
                                  'input[data-cert-title-input="true"]'
                                );
                                if (titleInput) {
                                  titleInput.focus();
                                  titleInput.select();
                                }
                              }
                            }, 50);
                          });
                        }}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 border border-zinc-700 bg-zinc-950 keep-dark text-white keep-white hover:bg-zinc-800 text-xs font-mono font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Certificate</span>
                      </button>
                    </div>
                  </div>

                  {/* Carousel Settings Panel */}
                  {showCertSettings && (
                    <div className="p-4 sm:p-5 border border-zinc-800 bg-zinc-900 space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                          Public Carousel Settings
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          Saved directly with portfolio
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={certSettings.heading}
                            onChange={(e) => updateCertSettings({ heading: e.target.value })}
                            placeholder="Licenses & Certifications"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Section Description
                          </label>
                          <input
                            type="text"
                            value={certSettings.description}
                            onChange={(e) => updateCertSettings({ description: e.target.value })}
                            placeholder="Verified qualifications and certificate documents..."
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Animation Speed
                          </label>
                          <select
                            value={certSettings.speed}
                            onChange={(e) =>
                              updateCertSettings({
                                speed: e.target.value as CertificationCarouselSettings['speed'],
                              })
                            }
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          >
                            <option value="slow">Slow</option>
                            <option value="normal">Normal</option>
                            <option value="fast">Fast</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Scroll Direction
                          </label>
                          <select
                            value={certSettings.direction}
                            onChange={(e) =>
                              updateCertSettings({
                                direction: e.target.value as CertificationCarouselSettings['direction'],
                              })
                            }
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          >
                            <option value="ltr">Left to Right</option>
                            <option value="rtl">Right to Left</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Cards Visible on Desktop
                          </label>
                          <select
                            value={certSettings.desktopCards}
                            onChange={(e) =>
                              updateCertSettings({
                                desktopCards: Number(e.target.value) as 2 | 3 | 4,
                              })
                            }
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          >
                            <option value={2}>2 Cards</option>
                            <option value={3}>3 Cards</option>
                            <option value={4}>4 Cards</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                            Card Spacing
                          </label>
                          <select
                            value={certSettings.cardGap}
                            onChange={(e) =>
                              updateCertSettings({
                                cardGap: e.target.value as CertificationCarouselSettings['cardGap'],
                              })
                            }
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                          >
                            <option value="compact">Compact (12px)</option>
                            <option value="normal">Normal (20px)</option>
                            <option value="spacious">Spacious (28px)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {[
                          { key: 'autoScroll', label: 'Auto Scrolling' },
                          { key: 'pauseOnHover', label: 'Pause on Hover' },
                          { key: 'showArrows', label: 'Nav Arrows' },
                          { key: 'showIndicators', label: 'Indicators' },
                        ].map((item) => {
                          const checked = Boolean(
                            certSettings[item.key as keyof CertificationCarouselSettings]
                          );
                          return (
                            <label
                              key={item.key}
                              className="flex items-center gap-2 px-3 py-2 border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-200 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) =>
                                  updateCertSettings({
                                    [item.key]: e.target.checked,
                                  } as Partial<CertificationCarouselSettings>)
                                }
                                className="accent-white"
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search & Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                      <input
                        type="text"
                        value={certSearch}
                        onChange={(e) => setCertSearch(e.target.value)}
                        placeholder="Search by title, organization, credential ID, year..."
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>

                    <select
                      value={certFilter}
                      onChange={(e) =>
                        setCertFilter(
                          e.target.value as
                            | 'all'
                            | 'enabled'
                            | 'disabled'
                            | 'has_image'
                            | 'has_pdf'
                        )
                      }
                      aria-label="Filter certificates"
                      className="px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs font-mono text-white"
                    >
                      <option value="all">All ({draft.certifications.length})</option>
                      <option value="enabled">
                        Enabled ({draft.certifications.filter((c) => c.enabled !== false).length})
                      </option>
                      <option value="disabled">
                        Disabled ({draft.certifications.filter((c) => c.enabled === false).length})
                      </option>
                      <option value="has_image">
                        Has Image ({draft.certifications.filter((c) => Boolean(c.imageUrl)).length})
                      </option>
                      <option value="has_pdf">
                        Has PDF (
                        {
                          draft.certifications.filter((c) =>
                            Boolean(
                              c.pdfUrl ||
                                (c.certificateDocument &&
                                  c.certificateDocument.toLowerCase().endsWith('.pdf'))
                            )
                          ).length
                        }
                        )
                      </option>
                    </select>
                  </div>

                  {!isReorderable && (
                    <div className="px-3 py-2 border border-zinc-800 bg-zinc-900 text-[11px] font-mono text-zinc-400">
                      Clear search or filter selection to drag-and-drop reorder certificates.
                    </div>
                  )}

                  {filteredCerts.length === 0 && (
                    <div className="p-8 border border-zinc-800 bg-zinc-900 text-center text-xs font-mono text-zinc-400">
                      No certificates match your current search/filter.
                    </div>
                  )}

                  {/* Certificates List */}
                  <div className="space-y-4">
                    {filteredCerts.map((cert) => {
                      const idx = draft.certifications.findIndex((c) => c.id === cert.id);
                      const isEnabled = cert.enabled !== false;
                      const isPreviewOpen = Boolean(previewCertIds[cert.id]);
                      const isPdfPreviewOpen = Boolean(previewCertPdfIds[cert.id]);
                      const currentPdfUrl =
                        cert.pdfUrl ||
                        (cert.certificateDocument &&
                        cert.certificateDocument.toLowerCase().endsWith('.pdf')
                          ? cert.certificateDocument
                          : '');

                      return (
                        <div
                          key={cert.id}
                          id={`cert-editor-${cert.id}`}
                          draggable={isReorderable}
                          onDragStart={() => {
                            if (isReorderable) setDraggedCertIdx(idx);
                          }}
                          onDragOver={(e) => {
                            if (!isReorderable) return;
                            e.preventDefault();
                            if (dragOverCertIdx !== idx) setDragOverCertIdx(idx);
                          }}
                          onDrop={(e) => {
                            if (!isReorderable) return;
                            e.preventDefault();
                            if (draggedCertIdx !== null) {
                              moveCert(draggedCertIdx, idx);
                            }
                            setDraggedCertIdx(null);
                            setDragOverCertIdx(null);
                          }}
                          onDragEnd={() => {
                            setDraggedCertIdx(null);
                            setDragOverCertIdx(null);
                          }}
                          className={`p-5 border bg-zinc-900 space-y-4 transition-all ${
                            dragOverCertIdx === idx && draggedCertIdx !== idx
                              ? 'border-white ring-1 ring-zinc-500'
                              : highlightedCertId === cert.id
                                ? 'border-orange-500 ring-1 ring-orange-500/60'
                                : isEnabled
                                  ? 'border-zinc-800'
                                  : 'border-zinc-800/60 opacity-75'
                          }`}
                        >
                          {/* Item Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isReorderable && (
                                <span
                                  className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-200"
                                  title="Drag to reorder carousel slot"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  #{String(idx + 1).padStart(2, '0')} · {cert.name || 'Untitled Certificate'}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-400 truncate">
                                  {cert.issuingOrg} · {cert.verificationStatus || 'Verified'} ·{' '}
                                  {isEnabled ? 'Published' : 'Hidden Draft'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isReorderable && (
                                <>
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveCert(idx, idx - 1)}
                                    title="Move Earlier"
                                    className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === draft.certifications.length - 1}
                                    onClick={() => moveCert(idx, idx + 1)}
                                    title="Move Later"
                                    className="p-1.5 border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewCertIds((prev) => ({
                                    ...prev,
                                    [cert.id]: !prev[cert.id],
                                  }))
                                }
                                aria-pressed={isPreviewOpen}
                                className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-mono uppercase ${
                                  isPreviewOpen
                                    ? 'border-zinc-500 bg-zinc-950 text-white'
                                    : 'border-zinc-700 text-zinc-300 hover:text-white'
                                }`}
                              >
                                <Monitor className="w-3 h-3" />
                                <span>{isPreviewOpen ? 'Hide Card' : 'Preview Card'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateCertById(cert.id, (c) => ({ ...c, enabled: !isEnabled }))
                                }
                                aria-pressed={isEnabled}
                                className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-mono uppercase ${
                                  isEnabled
                                    ? 'border-zinc-500 bg-zinc-950 text-white'
                                    : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                                }`}
                              >
                                {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                <span>{isEnabled ? 'On' : 'Off'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCertId(cert.id)}
                                title="Delete certificate"
                                className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Delete Confirmation */}
                          {confirmDeleteCertId === cert.id && (
                            <div className="p-3 border border-rose-800/70 bg-rose-950/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                              <span className="text-rose-300">
                                Delete &quot;{cert.name}&quot;? It will be removed from the public carousel on save.
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteCertId(null)}
                                  className="px-2.5 py-1 border border-zinc-700 text-zinc-300 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = draft.certifications
                                      .filter((c) => c.id !== cert.id)
                                      .map((item, i) => ({ ...item, order: i }));
                                    setDraft({ ...draft, certifications: filtered });
                                    setConfirmDeleteCertId(null);
                                  }}
                                  className="px-2.5 py-1 bg-rose-700 text-white hover:bg-rose-600 font-semibold"
                                >
                                  Confirm Delete
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Live Public Card Preview */}
                          {isPreviewOpen && (
                            <div className="p-3 border border-zinc-700 bg-zinc-950 space-y-2">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                Live Public Certificate Card Preview ({theme} theme)
                              </div>
                              <div className="max-w-sm">
                                <CertificationCard cert={cert} isLight={theme === 'light'} />
                              </div>
                            </div>
                          )}

                          {/* Basic Content Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 lg:col-span-2">
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Certificate Title
                              </label>
                              <input
                                type="text"
                                data-cert-title-input="true"
                                value={cert.name}
                                onChange={(e) => {
                                  if (highlightedCertId === cert.id) setHighlightedCertId(null);
                                  updateCertById(cert.id, (c) => ({ ...c, name: e.target.value }));
                                }}
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Verification Status
                              </label>
                              <select
                                value={cert.verificationStatus || 'Verified'}
                                onChange={(e) =>
                                  updateCertById(cert.id, (c) => ({
                                    ...c,
                                    verificationStatus: e.target.value as CertificateVerificationStatus,
                                  }))
                                }
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              >
                                <option value="Verified">Verified</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Expired">Expired</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Issuing Organization
                              </label>
                              <input
                                type="text"
                                value={cert.issuingOrg}
                                onChange={(e) =>
                                  updateCertById(cert.id, (c) => ({
                                    ...c,
                                    issuingOrg: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                  Issue Date
                                </label>
                                <input
                                  type="text"
                                  value={cert.issueDate || ''}
                                  onChange={(e) =>
                                    updateCertById(cert.id, (c) => ({
                                      ...c,
                                      issueDate: e.target.value,
                                    }))
                                  }
                                  placeholder="Jul 2024"
                                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                  Year
                                </label>
                                <input
                                  type="text"
                                  value={cert.year}
                                  onChange={(e) =>
                                    updateCertById(cert.id, (c) => ({ ...c, year: e.target.value }))
                                  }
                                  placeholder="2024"
                                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={cert.expiryDate || ''}
                                onChange={(e) =>
                                  updateCertById(cert.id, (c) => ({
                                    ...c,
                                    expiryDate: e.target.value,
                                  }))
                                }
                                placeholder="No Expiry or Mar 2028"
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Credential ID
                              </label>
                              <input
                                type="text"
                                value={cert.credentialId || ''}
                                onChange={(e) =>
                                  updateCertById(cert.id, (c) => ({
                                    ...c,
                                    credentialId: e.target.value,
                                  }))
                                }
                                placeholder="e.g. MKCL-2024-001"
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                                Credential Verification URL
                              </label>
                              <input
                                type="text"
                                value={cert.certificateLink === '#' ? '' : cert.certificateLink}
                                onChange={(e) =>
                                  updateCertById(cert.id, (c) => ({
                                    ...c,
                                    certificateLink: e.target.value.trim() || '#',
                                  }))
                                }
                                placeholder="https://verify.coursera.org/..."
                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                              Certificate Description
                            </label>
                            <textarea
                              rows={2}
                              value={cert.description || ''}
                              onChange={(e) =>
                                updateCertById(cert.id, (c) => ({
                                  ...c,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Key skills, topics, and learning outcomes..."
                              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-xs text-white resize-none"
                            />
                          </div>

                          {/* Persistent File Slots: Certificate Image & PDF Document */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Image Slot */}
                            <div className="p-3 border border-zinc-800 bg-zinc-950 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <ImageIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="text-[11px] font-mono font-semibold text-white truncate">
                                    Certificate Image (JPG, PNG, WebP)
                                  </span>
                                </div>
                                {cert.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateCertById(cert.id, (c) => ({ ...c, imageUrl: '' }))
                                    }
                                    className="text-[10px] font-mono text-zinc-400 hover:text-rose-400 shrink-0"
                                  >
                                    Delete Image
                                  </button>
                                )}
                              </div>

                              {cert.imageUrl && (
                                <div className="w-full h-24 border border-zinc-800 bg-zinc-900 overflow-hidden">
                                  <img
                                    src={cert.imageUrl}
                                    alt={cert.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={cert.imageUrl || ''}
                                  onChange={(e) =>
                                    updateCertById(cert.id, (c) => ({
                                      ...c,
                                      imageUrl: e.target.value,
                                    }))
                                  }
                                  placeholder="Image URL or /uploads/..."
                                  className="flex-1 min-w-0 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 text-[11px] font-mono text-white"
                                />
                                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-mono text-white shrink-0">
                                  <Upload className="w-3 h-3" />
                                  <span>{isUploading ? '...' : cert.imageUrl ? 'Replace' : 'Upload'}</span>
                                  <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      e.target.value = '';
                                      if (!file) return;
                                      const allowed = [
                                        'image/png',
                                        'image/x-png',
                                        'image/jpeg',
                                        'image/jpg',
                                        'image/pjpeg',
                                        'image/webp',
                                      ];
                                      const hasValidMime = allowed.includes(file.type.toLowerCase());
                                      const hasValidExt = /\.(png|jpe?g|webp)$/i.test(file.name);
                                      if (!hasValidMime && !hasValidExt) {
                                        showToast(
                                          'Please select a JPG, JPEG, PNG, or WebP image.',
                                          'error'
                                        );
                                        return;
                                      }
                                      const url = await uploadFilePersistently(file);
                                      if (url) {
                                        updateCertById(cert.id, (c) => ({
                                          ...c,
                                          imageUrl: url,
                                        }));
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* PDF Slot */}
                            <div className="p-3 border border-zinc-800 bg-zinc-950 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="text-[11px] font-mono font-semibold text-white truncate">
                                    PDF Certificate File
                                  </span>
                                </div>
                                {currentPdfUrl && (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPreviewCertPdfIds((prev) => ({
                                          ...prev,
                                          [cert.id]: !prev[cert.id],
                                        }))
                                      }
                                      className="text-[10px] font-mono text-zinc-300 hover:text-white underline underline-offset-2"
                                    >
                                      {isPdfPreviewOpen ? 'Hide PDF' : 'Preview PDF'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCertById(cert.id, (c) => ({
                                          ...c,
                                          pdfUrl: '',
                                          certificateDocument: '',
                                        }))
                                      }
                                      className="text-[10px] font-mono text-zinc-400 hover:text-rose-400"
                                    >
                                      Delete PDF
                                    </button>
                                  </div>
                                )}
                              </div>

                              {currentPdfUrl && isPdfPreviewOpen ? (
                                <iframe
                                  src={currentPdfUrl}
                                  title={`${cert.name} PDF preview`}
                                  className="w-full h-36 border border-zinc-800 bg-white"
                                />
                              ) : (
                                <div className="h-24 border border-zinc-800 bg-zinc-900 px-3 flex flex-col items-center justify-center text-center">
                                  <FileText className="w-4 h-4 text-zinc-400 mb-1" />
                                  <span className="text-[10px] font-mono text-zinc-300 truncate max-w-full">
                                    {currentPdfUrl
                                      ? `Attached: ${currentPdfUrl}`
                                      : 'No PDF certificate uploaded'}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={currentPdfUrl}
                                  onChange={(e) =>
                                    updateCertById(cert.id, (c) => ({
                                      ...c,
                                      pdfUrl: e.target.value,
                                      certificateDocument: e.target.value,
                                    }))
                                  }
                                  placeholder="PDF URL or /uploads/..."
                                  className="flex-1 min-w-0 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 text-[11px] font-mono text-white"
                                />
                                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-mono text-white shrink-0">
                                  <Upload className="w-3 h-3" />
                                  <span>{isUploading ? '...' : currentPdfUrl ? 'Replace' : 'Upload PDF'}</span>
                                  <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      e.target.value = '';
                                      if (!file) return;
                                      const isPdf =
                                        file.type === 'application/pdf' ||
                                        file.name.toLowerCase().endsWith('.pdf');
                                      if (!isPdf) {
                                        showToast('Please select a valid PDF document.', 'error');
                                        return;
                                      }
                                      const url = await uploadFilePersistently(file);
                                      if (url) {
                                        updateCertById(cert.id, (c) => ({
                                          ...c,
                                          pdfUrl: url,
                                          certificateDocument: url,
                                          certificateLink:
                                            c.certificateLink &&
                                            c.certificateLink !== '#' &&
                                            c.certificateLink.startsWith('http')
                                              ? c.certificateLink
                                              : url,
                                        }));
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* TAB 7: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Achievements & Honors</h3>
                    <p className="text-xs text-slate-400">Manage NSS activities, competitions, courses, and honors</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newAch: AchievementItem = {
                        id: 'ach-' + Date.now(),
                        title: 'New Achievement Title',
                        category: 'College Competitions',
                        date: '2024',
                        description: 'Summary of accomplishment...',
                        highlightBadge: 'Commendation'
                      };
                      setDraft({ ...draft, achievements: [newAch, ...draft.achievements] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Achievement</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draft.achievements.map((ach, idx) => (
                    <div key={ach.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{ach.title}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              achievements: draft.achievements.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const updated = [...draft.achievements];
                              updated[idx].title = e.target.value;
                              setDraft({ ...draft, achievements: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Category (e.g. NSS, Competitions)</label>
                          <input
                            type="text"
                            value={ach.category}
                            onChange={(e) => {
                              const updated = [...draft.achievements];
                              updated[idx].category = e.target.value;
                              setDraft({ ...draft, achievements: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Date / Year</label>
                          <input
                            type="text"
                            value={ach.date}
                            onChange={(e) => {
                              const updated = [...draft.achievements];
                              updated[idx].date = e.target.value;
                              setDraft({ ...draft, achievements: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Highlight Badge Label</label>
                          <input
                            type="text"
                            value={ach.highlightBadge || ''}
                            onChange={(e) => {
                              const updated = [...draft.achievements];
                              updated[idx].highlightBadge = e.target.value;
                              setDraft({ ...draft, achievements: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={ach.description}
                          onChange={(e) => {
                            const updated = [...draft.achievements];
                            updated[idx].description = e.target.value;
                            setDraft({ ...draft, achievements: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: RESUME & SOCIAL LINKS */}
            {activeTab === 'resume' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                  Resume File & Social Profiles
                </h3>

                {/* Resume file upload */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">Resume Document</h4>
                  
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Filename Display</label>
                    <input
                      type="text"
                      value={draft.profile.resumeFileName || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, resumeFileName: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Resume File Link / Upload PDF</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draft.profile.resumeUrl}
                        onChange={(e) => setDraft({
                          ...draft,
                          profile: { ...draft.profile, resumeUrl: e.target.value }
                        })}
                        placeholder="Link or uploaded path..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-xs font-semibold text-cyan-300">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (file) {
                              handleFileUpload(file, (url) => {
                                setDraft((prev) => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    resumeUrl: url,
                                    resumeFileName: file.name,
                                  },
                                }));
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-purple-400 font-bold">Social & Work Profiles</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">GitHub Link</label>
                      <input
                        type="text"
                        value={draft.profile.socials.github}
                        onChange={(e) => setDraft({
                          ...draft,
                          profile: {
                            ...draft.profile,
                            socials: { ...draft.profile.socials, github: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">LinkedIn Link</label>
                      <input
                        type="text"
                        value={draft.profile.socials.linkedin}
                        onChange={(e) => setDraft({
                          ...draft,
                          profile: {
                            ...draft.profile,
                            socials: { ...draft.profile.socials, linkedin: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Instagram Link</label>
                      <input
                        type="text"
                        value={draft.profile.socials.instagram}
                        onChange={(e) => setDraft({
                          ...draft,
                          profile: {
                            ...draft.profile,
                            socials: { ...draft.profile.socials, instagram: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: RECEIVED CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Received Client Messages</h3>
                    <p className="text-xs text-zinc-400">Inquiries submitted through your portfolio contact form</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSheetsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/50 text-xs font-semibold font-mono transition-colors"
                    >
                      <BrandLogo name="sheets" className="w-3.5 h-3.5" />
                      <span>{data.sheetsConfig?.spreadsheetId ? 'Sheets Connected' : 'Connect Sheets'}</span>
                    </button>
                    <button
                      onClick={fetchMessages}
                      className="text-xs text-orange-400 hover:text-orange-300 font-mono px-2 py-1"
                    >
                      Refresh Inbox
                    </button>
                  </div>
                </div>

                {/* Google Sheet Sync Quick Banner */}
                {data.sheetsConfig?.spreadsheetId && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <BrandLogo name="sheets" className="w-4 h-4 shrink-0" />
                      <span>
                        Syncing to: <strong>{data.sheetsConfig.spreadsheetTitle || 'Google Sheet'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const res = await syncAllMessagesToSheet();
                          if (res.success) {
                            showToast(`Synced ${res.syncedCount} message(s) to Google Sheets!`, 'success');
                          } else {
                            showToast(res.error || 'Failed to sync to sheets', 'error');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                      >
                        Sync All Pending
                      </button>
                      <a
                        href={data.sheetsConfig.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-emerald-400 hover:text-white"
                        title="Open Sheet in Google"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs">
                    No inquiries received yet. Messages sent via the contact form will appear here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{m.name}</span>
                            {m.syncedToSheets ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                                <BrandLogo name="sheets" className="w-3 h-3" />
                                <span>Synced to Sheets</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                Local only
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(m.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-orange-400 font-mono">
                          {m.email} {m.subject ? `• ${m.subject}` : ''}
                        </div>
                        <p className="text-xs text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                          {m.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </motion.div>
    </div>
  );
};
