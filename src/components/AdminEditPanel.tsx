import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioData, EducationItem, SkillItem, ProjectItem, ExperienceItem, CertificationItem, AchievementItem, SkillCategory, ProjectCategory } from '../types';
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
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';

export const AdminEditPanel: React.FC = () => {
  const { 
    data, 
    editModalOpen, 
    setEditModalOpen, 
    setSheetsModalOpen,
    syncAllMessagesToSheet,
    updatePortfolio, 
    resetPortfolio, 
    logout, 
    isSaving,
    adminToken,
    messages,
    fetchMessages,
    showToast
  } = usePortfolio();

  // Local draft state that user can modify and then "Save Changes" or "Cancel"
  const [draft, setDraft] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications' | 'achievements' | 'resume' | 'messages'>('profile');
  const [isUploading, setIsUploading] = useState(false);

  // Sync draft whenever modal opens or original data updates
  useEffect(() => {
    if (editModalOpen) {
      setDraft(JSON.parse(JSON.stringify(data)));
      fetchMessages();
    }
  }, [editModalOpen, data]);

  if (!editModalOpen) return null;

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
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              fileType: file.type,
            }),
          });
          const json = await res.json();
          if (res.ok && json.fileUrl) {
            callback(json.fileUrl);
            showToast('File uploaded successfully!', 'success');
          } else {
            // If server storage failed, use data URL as reliable fallback
            callback(base64Data);
            showToast('File stored in memory!', 'info');
          }
        } catch (e) {
          callback(base64Data);
          showToast('Stored file locally in browser', 'info');
        } finally {
          setIsUploading(false);
        }
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
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draft.profile.avatarUrl}
                      onChange={(e) => setDraft({
                        ...draft,
                        profile: { ...draft.profile, avatarUrl: e.target.value }
                      })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], (url) => {
                              setDraft({
                                ...draft,
                                profile: { ...draft.profile, avatarUrl: url }
                              });
                            });
                          }
                        }}
                      />
                    </label>
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

            {/* TAB 3: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Skills & Technologies</h3>
                    <p className="text-xs text-slate-400">Add, rename, re-categorize, or calibrate skill levels</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSkill: SkillItem = {
                        id: 'sk-' + Date.now(),
                        name: 'New Skill',
                        category: 'Frontend',
                        proficiency: 80,
                        icon: 'Code2',
                        level: 'Intermediate'
                      };
                      setDraft({ ...draft, skills: [newSkill, ...draft.skills] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draft.skills.map((skill, idx) => (
                    <div key={skill.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              skills: draft.skills.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400">Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...draft.skills];
                              updated[idx].name = e.target.value;
                              setDraft({ ...draft, skills: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400">Category</label>
                          <select
                            value={skill.category}
                            onChange={(e) => {
                              const updated = [...draft.skills];
                              updated[idx].category = e.target.value as SkillCategory;
                              setDraft({ ...draft, skills: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Programming">Programming</option>
                            <option value="Data & Tools">Data & Tools</option>
                            <option value="Design & AI">Design & AI</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400">Proficiency ({skill.proficiency}%)</label>
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={skill.proficiency}
                            onChange={(e) => {
                              const updated = [...draft.skills];
                              updated[idx].proficiency = Number(e.target.value);
                              setDraft({ ...draft, skills: updated });
                            }}
                            className="w-full accent-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400">Level Tag</label>
                          <input
                            type="text"
                            value={skill.level}
                            onChange={(e) => {
                              const updated = [...draft.skills];
                              updated[idx].level = e.target.value;
                              setDraft({ ...draft, skills: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], (url) => {
                                    const updated = [...draft.projects];
                                    updated[idx].image = url;
                                    setDraft({ ...draft, projects: updated });
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

            {/* TAB 5: EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Experience</h3>
                    <p className="text-xs text-slate-400">Manage work history, responsibilities, and organization details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newExp: ExperienceItem = {
                        id: 'exp-' + Date.now(),
                        role: 'Role / Designation',
                        organization: 'Organization / Company Name',
                        type: 'Part-Time',
                        startDate: '2024',
                        endDate: 'Present',
                        description: 'Overview of work scope...',
                        responsibilities: [
                          'Executed key tasks and operations with high precision.'
                        ]
                      };
                      setDraft({ ...draft, experience: [newExp, ...draft.experience] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {draft.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{exp.role}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              experience: draft.experience.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...draft.experience];
                              updated[idx].role = e.target.value;
                              setDraft({ ...draft, experience: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Organization</label>
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => {
                              const updated = [...draft.experience];
                              updated[idx].organization = e.target.value;
                              setDraft({ ...draft, experience: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Type (e.g. Part-Time, Full-Time)</label>
                          <input
                            type="text"
                            value={exp.type}
                            onChange={(e) => {
                              const updated = [...draft.experience];
                              updated[idx].type = e.target.value;
                              setDraft({ ...draft, experience: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx].startDate = e.target.value;
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => {
                                const updated = [...draft.experience];
                                updated[idx].endDate = e.target.value;
                                setDraft({ ...draft, experience: updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Responsibilities bullets */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-mono text-slate-400">Responsibilities (Bullet Points)</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...draft.experience];
                              updated[idx].responsibilities.push('New responsibility...');
                              setDraft({ ...draft, experience: updated });
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
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
                                  updated[idx].responsibilities[bIdx] = e.target.value;
                                  setDraft({ ...draft, experience: updated });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...draft.experience];
                                  updated[idx].responsibilities = updated[idx].responsibilities.filter((_, i) => i !== bIdx);
                                  setDraft({ ...draft, experience: updated });
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Certifications & Workshops</h3>
                    <p className="text-xs text-slate-400">Manage verified certificates, MS-CIT, Tally, and credentials</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCert: CertificationItem = {
                        id: 'cert-' + Date.now(),
                        name: 'New Certification Title',
                        issuingOrg: 'Issuing Organization',
                        year: '2024',
                        certificateLink: '#'
                      };
                      setDraft({ ...draft, certifications: [newCert, ...draft.certifications] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draft.certifications.map((cert, idx) => (
                    <div key={cert.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              ...draft,
                              certifications: draft.certifications.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const updated = [...draft.certifications];
                              updated[idx].name = e.target.value;
                              setDraft({ ...draft, certifications: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.issuingOrg}
                            onChange={(e) => {
                              const updated = [...draft.certifications];
                              updated[idx].issuingOrg = e.target.value;
                              setDraft({ ...draft, certifications: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">Year</label>
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => {
                              const updated = [...draft.certifications];
                              updated[idx].year = e.target.value;
                              setDraft({ ...draft, certifications: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1">Certificate Document / Image</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cert.certificateDocument || cert.certificateLink}
                              onChange={(e) => {
                                const updated = [...draft.certifications];
                                updated[idx].certificateDocument = e.target.value;
                                updated[idx].certificateLink = e.target.value;
                                setDraft({ ...draft, certifications: updated });
                              }}
                              placeholder="URL or upload file..."
                              className="flex-1 px-3 py-2 rounded-xl bg-black border border-zinc-700 text-xs text-white"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/40 text-xs font-semibold text-orange-300">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleFileUpload(e.target.files[0], (url) => {
                                      const updated = [...draft.certifications];
                                      updated[idx].certificateDocument = url;
                                      updated[idx].certificateLink = url;
                                      setDraft({ ...draft, certifications: updated });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0];
                              handleFileUpload(file, (url) => {
                                setDraft({
                                  ...draft,
                                  profile: {
                                    ...draft.profile,
                                    resumeUrl: url,
                                    resumeFileName: file.name
                                  }
                                });
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
                      <FileSpreadsheet className="w-3.5 h-3.5" />
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
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
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
                                <FileSpreadsheet className="w-2.5 h-2.5" />
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
