import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Camera, Upload, X, Check, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface UploadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadProfileModal: React.FC<UploadProfileModalProps> = ({ isOpen, onClose }) => {
  const { data, uploadProfilePhoto, updatePortfolio, showToast } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(data.profile.avatarUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>(data.profile.avatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image size should be under 15MB', 'error');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    try {
      if (activeTab === 'upload' && selectedFile) {
        const success = await uploadProfilePhoto(selectedFile);
        if (success) {
          onClose();
        }
      } else if (activeTab === 'url' && urlInput.trim()) {
        const updated = {
          ...data,
          profile: {
            ...data.profile,
            avatarUrl: urlInput.trim(),
          },
        };
        await updatePortfolio(updated);
        showToast('Profile image URL updated successfully!', 'success');
        onClose();
      } else if (previewUrl && previewUrl !== data.profile.avatarUrl) {
        const updated = {
          ...data,
          profile: {
            ...data.profile,
            avatarUrl: previewUrl,
          },
        };
        await updatePortfolio(updated);
        showToast('Profile image updated!', 'success');
        onClose();
      } else {
        showToast('Please choose an image file or provide a URL', 'info');
      }
    } catch (err) {
      showToast('Failed to update profile image', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-zinc-950 border border-orange-500/30 rounded-3xl p-6 shadow-2xl shadow-orange-950/40 text-white overflow-hidden"
        >
          {/* Decorative orange glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Upload Profile Photo</h3>
                <p className="text-xs text-zinc-400">Update your portfolio display avatar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl mt-4 border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-900/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image File</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                activeTab === 'url'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-900/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Current / New Preview */}
          <div className="flex items-center justify-center py-5">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-xl shadow-orange-950/50 bg-zinc-900">
                <img
                  src={previewUrl || data.profile.avatarUrl}
                  alt="Profile Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-500 text-white border-2 border-zinc-950 shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
                  dragOver
                    ? 'border-orange-500 bg-orange-950/20'
                    : 'border-zinc-800 hover:border-orange-500/60 bg-zinc-900/60'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-white">Click or drag image file here</p>
                <p className="text-xs text-zinc-400 mt-1">Supports JPG, PNG, WEBP (Max 15MB)</p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/40 text-xs font-mono text-orange-300">
                    <Check className="w-3 h-3 text-orange-400" />
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Direct Image Link</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setPreviewUrl(e.target.value.trim());
                    }
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-zinc-400" />
                Paste any publicly accessible photo URL from Google Drive, Unsplash, or GitHub.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-5 mt-5 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Photo</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
