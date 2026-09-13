import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { OtherSkillItem, OtherSkillCategory } from '../types';
import { 
  Palette, 
  Figma, 
  Presentation, 
  Image as ImageIcon, 
  Share2, 
  ExternalLink, 
  Upload, 
  Plus, 
  Eye, 
  X, 
  Sparkles, 
  FileDown, 
  Trash2, 
  Edit3, 
  Calendar, 
  Layers,
  FileText
} from 'lucide-react';

const CATEGORIES: { label: string; value: 'All' | OtherSkillCategory; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'All Works', value: 'All', icon: Layers },
  { label: 'Figma & UI/UX', value: 'Figma & UI/UX', icon: Figma },
  { label: 'Graphic Design', value: 'Graphic Design', icon: Palette },
  { label: 'PPTs & Presentations', value: 'PPTs & Presentations', icon: Presentation },
  { label: 'Posters & Banners', value: 'Posters & Banners', icon: ImageIcon },
  { label: 'Social Media Posts', value: 'Social Media Posts', icon: Share2 },
];

export const OtherSkills: React.FC = () => {
  const { data, theme, isAdmin, addOtherSkill, updateOtherSkill, deleteOtherSkill, setLoginModalOpen } = usePortfolio();
  const isLight = theme === 'light';
  const otherSkills = data.otherSkills || [];

  const [selectedCategory, setSelectedCategory] = useState<'All' | OtherSkillCategory>('All');
  const [activePreviewItem, setActivePreviewItem] = useState<OtherSkillItem | null>(null);
  
  // Upload / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OtherSkillItem | null>(null);

  // Filtered items
  const filteredItems = selectedCategory === 'All' 
    ? otherSkills 
    : otherSkills.filter(item => item.category === selectedCategory);

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setLoginModalOpen(true);
      return;
    }
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: OtherSkillItem) => {
    if (!isAdmin) {
      setLoginModalOpen(true);
      return;
    }
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from Other Skills?`)) {
      await deleteOtherSkill(id);
    }
  };

  const getCategoryIcon = (category: OtherSkillCategory) => {
    switch (category) {
      case 'Figma & UI/UX':
        return <Figma className="w-3.5 h-3.5 text-orange-400" />;
      case 'Graphic Design':
        return <Palette className="w-3.5 h-3.5 text-amber-400" />;
      case 'PPTs & Presentations':
        return <Presentation className="w-3.5 h-3.5 text-orange-500" />;
      case 'Posters & Banners':
        return <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Social Media Posts':
        return <Share2 className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  return (
    <section id="other-skills" className={`py-24 relative overflow-hidden bg-transparent border-t transition-colors ${
      isLight ? 'border-zinc-200' : 'border-zinc-900/60'
    }`}>
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono uppercase tracking-wider mb-3 border ${
              isLight 
                ? 'bg-orange-50 border-orange-200 text-orange-800' 
                : 'bg-orange-950/60 border-orange-500/30 text-orange-400'
            }`}>
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              <span>Other Skills & Creative Showcase</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Designs, UI/UX & <span className="glow-gradient-text">Presentations</span>
            </h2>
            <p className={`mt-3 max-w-2xl text-sm sm:text-base leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Showcasing my creative works including Figma UI/UX prototypes, graphic design, college seminar PPT presentations, tech fest posters, and social media creative posts.
            </p>
          </div>

          {/* Action CTA for Admin / Upload - Only visible in Admin Edit Mode */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                id="upload-other-skill-btn"
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-orange-950/40 hover:shadow-orange-500/25 transition-all duration-300 group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Upload / Add Work</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className={`flex flex-wrap items-center gap-2 mb-10 pb-2 border-b ${
          isLight ? 'border-zinc-200' : 'border-zinc-900'
        }`}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            const count = cat.value === 'All' 
              ? otherSkills.length 
              : otherSkills.filter(i => i.category === cat.value).length;

            return (
              <button
                key={cat.value}
                id={`filter-${cat.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium transition-all duration-200 border rounded-lg ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/40'
                    : isLight
                      ? 'bg-white text-zinc-700 border-zinc-200 hover:text-zinc-950 hover:border-orange-300 hover:bg-orange-50/40 shadow-xs'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isSelected 
                    ? 'text-white' 
                    : isLight 
                      ? 'text-zinc-500' 
                      : 'text-zinc-400'
                }`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  isSelected 
                    ? 'bg-white/25 border-white/40 text-white font-semibold' 
                    : isLight
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-700 font-semibold'
                      : 'bg-black/60 border-zinc-800 text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Creative Works Grid */}
        {filteredItems.length === 0 ? (
          <div className={`p-12 text-center border border-dashed rounded-xl ${
            isLight ? 'border-zinc-300 bg-white/70 shadow-xs' : 'border-zinc-800 bg-zinc-950/50'
          }`}>
            <Palette className={`w-12 h-12 mx-auto mb-3 animate-pulse ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
            <p className={`font-semibold text-base ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>No items in this category yet</p>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              {isAdmin 
                ? 'Click the "Upload / Add Work" button above to showcase your Figma prototypes, graphic designs, PPTs, or posters!'
                : 'Creative design prototypes, graphic works, and presentations will appear here.'}
            </p>
            {isAdmin && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-orange-600 text-white hover:bg-orange-500 transition-colors inline-flex items-center gap-1.5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Work</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-xl border ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-orange-500 shadow-md shadow-zinc-200/50 hover:shadow-orange-500/10'
                    : 'bg-zinc-950 border-zinc-800 hover:border-orange-500/60 shadow-xl shadow-black/80'
                }`}
              >
                {/* Top Image & Preview Overlay */}
                <div>
                  <div className={`relative aspect-[16/10] overflow-hidden border-b ${
                    isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
                  }`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient shade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-zinc-700/80 text-white text-[11px] font-medium shadow-sm">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </div>

                    {/* Date Badge */}
                    {item.date && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 text-zinc-300 text-[10px] font-mono">
                        <Calendar className="w-3 h-3 text-orange-400" />
                        <span>{item.date}</span>
                      </div>
                    )}

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActivePreviewItem(item)}
                        className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                        title="View Full Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Preview</span>
                      </button>
                      {item.externalUrl && item.externalUrl !== '#' && (
                        <a
                          href={item.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-900 border border-zinc-700 text-white hover:border-orange-500 hover:text-orange-400 text-xs shadow-lg transition-colors"
                          title="Open Live Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className={`text-lg font-bold tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1 ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`mt-2 text-xs line-clamp-2 leading-relaxed ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {item.description}
                    </p>

                    {/* Tools / Tags */}
                    {item.toolsUsed && item.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {item.toolsUsed.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-2 py-0.5 text-[10px] font-mono border rounded ${
                              isLight
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                            }`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={`px-5 py-3.5 border-t flex items-center justify-between text-xs ${
                  isLight ? 'bg-zinc-50/90 border-zinc-100' : 'bg-zinc-900/40 border-zinc-900'
                }`}>
                  <button
                    onClick={() => setActivePreviewItem(item)}
                    className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className={`flex items-center gap-1 transition-colors ${
                          isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Download / Open File"
                      >
                        <FileDown className="w-3.5 h-3.5 text-amber-500" />
                        <span>File</span>
                      </a>
                    )}

                    {item.externalUrl && item.externalUrl !== '#' && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 transition-colors ${
                          isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Open External / Figma link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                        <span>Open</span>
                      </a>
                    )}

                    {/* Admin Edit / Delete controls */}
                    {isAdmin && (
                      <div className={`flex items-center gap-1 ml-2 pl-2 border-l ${
                        isLight ? 'border-zinc-200' : 'border-zinc-800'
                      }`}>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className={`p-1 transition-colors ${
                            isLight ? 'text-zinc-500 hover:text-orange-600' : 'text-zinc-400 hover:text-orange-400'
                          }`}
                          title="Edit this item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className={`p-1 transition-colors ${
                            isLight ? 'text-zinc-500 hover:text-red-600' : 'text-zinc-400 hover:text-red-400'
                          }`}
                          title="Delete this item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Preview Modal */}
      <AnimatePresence>
        {activePreviewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-4xl max-h-[90vh] border shadow-2xl flex flex-col overflow-hidden rounded-2xl ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/90'
              }`}>
                <div className="flex items-center gap-2.5">
                  {getCategoryIcon(activePreviewItem.category)}
                  <span className="text-xs font-mono text-orange-500 font-semibold uppercase tracking-wider">
                    {activePreviewItem.category}
                  </span>
                </div>
                <button
                  onClick={() => setActivePreviewItem(null)}
                  className={`p-1.5 border transition-colors rounded-lg ${
                    isLight 
                      ? 'text-zinc-500 hover:text-zinc-900 bg-zinc-100 border-zinc-200 hover:bg-zinc-200' 
                      : 'text-zinc-400 hover:text-white bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                  }`}
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1">
                {/* Image showcase */}
                <div className={`w-full border overflow-hidden flex items-center justify-center max-h-[55vh] rounded-xl ${
                  isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
                }`}>
                  <img
                    src={activePreviewItem.imageUrl}
                    alt={activePreviewItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full max-h-[55vh] object-contain"
                  />
                </div>

                {/* Details */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {activePreviewItem.title}
                    </h3>
                    {activePreviewItem.date && (
                      <span className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1 border rounded-lg ${
                        isLight 
                          ? 'text-zinc-600 bg-zinc-100 border-zinc-200' 
                          : 'text-zinc-400 bg-zinc-900 border-zinc-800'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {activePreviewItem.date}
                      </span>
                    )}
                  </div>

                  <p className={`mt-3 text-sm leading-relaxed whitespace-pre-line ${
                    isLight ? 'text-zinc-600' : 'text-zinc-300'
                  }`}>
                    {activePreviewItem.description}
                  </p>

                  {/* Tools */}
                  {activePreviewItem.toolsUsed && activePreviewItem.toolsUsed.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                      <span className={`text-xs font-mono block mb-2 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Tools & Skills Used:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activePreviewItem.toolsUsed.map((t, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 text-xs font-mono border rounded ${
                              isLight 
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-700' 
                                : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/90 border-zinc-800'
              }`}>
                <div className="flex items-center gap-2">
                  {activePreviewItem.externalUrl && activePreviewItem.externalUrl !== '#' && (
                    <a
                      href={activePreviewItem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md rounded-lg"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Figma / Live Link</span>
                    </a>
                  )}

                  {activePreviewItem.fileUrl && (
                    <a
                      href={activePreviewItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className={`px-4 py-2 border text-xs font-semibold flex items-center gap-2 transition-colors rounded-lg ${
                        isLight 
                          ? 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-800' 
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'
                      }`}
                    >
                      <FileDown className="w-3.5 h-3.5 text-amber-500" />
                      <span>Download File / Presentation</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActivePreviewItem(null)}
                  className={`px-4 py-2 border text-xs font-medium transition-colors rounded-lg ${
                    isLight 
                      ? 'border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100' 
                      : 'border-zinc-700 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload & Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <UploadOtherSkillModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingItem(null);
            }}
            itemToEdit={editingItem}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit: OtherSkillItem | null;
}

const UploadOtherSkillModal: React.FC<UploadModalProps> = ({ onClose, itemToEdit }) => {
  const { addOtherSkill, updateOtherSkill, theme } = usePortfolio();
  const isLight = theme === 'light';

  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [category, setCategory] = useState<OtherSkillCategory>(itemToEdit?.category || 'Figma & UI/UX');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [externalUrl, setExternalUrl] = useState(itemToEdit?.externalUrl || '');
  const [date, setDate] = useState(itemToEdit?.date || new Date().getFullYear().toString());
  const [toolsString, setToolsString] = useState(itemToEdit?.toolsUsed?.join(', ') || '');
  const [previewImageUrl, setPreviewImageUrl] = useState(itemToEdit?.imageUrl || '');

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
    }
  };

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      // If it's an image and no preview image set, show it
      if (file.type.startsWith('image/') && !previewFile) {
        setPreviewImageUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsSubmitting(true);
    try {
      const tools = toolsString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      if (itemToEdit) {
        await updateOtherSkill(
          {
            ...itemToEdit,
            title,
            category,
            description,
            imageUrl: previewImageUrl || itemToEdit.imageUrl,
            externalUrl: externalUrl.trim() || undefined,
            date: date.trim() || undefined,
            toolsUsed: tools
          },
          previewFile || undefined,
          documentFile || undefined
        );
      } else {
        await addOtherSkill(
          {
            title,
            category,
            description,
            imageUrl: previewImageUrl || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
            externalUrl: externalUrl.trim() || undefined,
            date: date.trim() || undefined,
            toolsUsed: tools
          },
          previewFile || undefined,
          documentFile || undefined
        );
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-2xl max-h-[90vh] border shadow-2xl flex flex-col overflow-hidden rounded-2xl ${
          isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/90'
        }`}>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-orange-500" />
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              {itemToEdit ? 'Edit Creative Work' : 'Upload Creative Work / Other Skill'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 border transition-colors rounded-lg ${
              isLight 
                ? 'text-zinc-500 hover:text-zinc-900 bg-zinc-100 border-zinc-200 hover:bg-zinc-200' 
                : 'text-zinc-400 hover:text-white bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
              Title / Project Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fintech Mobile App Figma Prototype, Tech Fest Poster..."
              className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs rounded-lg ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OtherSkillCategory)}
                className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs rounded-lg ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900' 
                    : 'bg-zinc-900 border-zinc-800 text-white'
                }`}
              >
                <option value="Figma & UI/UX">Figma & UI/UX</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="PPTs & Presentations">PPTs & Presentations</option>
                <option value="Posters & Banners">Posters & Banners</option>
                <option value="Social Media Posts">Social Media Posts</option>
                <option value="Other Creative">Other Creative</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                Year / Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2025"
                className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs rounded-lg ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' 
                    : 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the design concept, problem solved, or presentation agenda..."
              className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs resize-none rounded-lg ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          {/* Tools Used */}
          <div>
            <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
              Tools & Software Used (Comma separated)
            </label>
            <input
              type="text"
              value={toolsString}
              onChange={(e) => setToolsString(e.target.value)}
              placeholder="Figma, Canva, Adobe Illustrator, PowerPoint, Photoshop..."
              className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs rounded-lg ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          {/* External Link */}
          <div>
            <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
              Figma / Live Demo / Drive Link (Optional)
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://www.figma.com/file/... or https://canva.com/..."
              className={`w-full px-3.5 py-2.5 border focus:border-orange-500 focus:outline-none text-xs rounded-lg ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500'
              }`}
            />
          </div>

          {/* File Uploads Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
            {/* Preview Image File */}
            <div>
              <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                Preview Thumbnail (PNG / JPG / SVG)
              </label>
              <input
                type="file"
                ref={previewInputRef}
                onChange={handlePreviewFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => previewInputRef.current?.click()}
                className={`w-full p-4 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-center group transition-colors ${
                  isLight 
                    ? 'border-zinc-300 bg-zinc-50 hover:border-orange-500 hover:bg-orange-50/30' 
                    : 'border-zinc-700 bg-zinc-900/60 hover:border-orange-500'
                }`}
              >
                <Upload className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className={`text-xs font-medium ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
                  {previewFile ? previewFile.name : 'Select Preview Image'}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>Image for grid showcase</span>
              </button>
            </div>

            {/* Document File (PPT, PDF, Poster file) */}
            <div>
              <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                Work File / Slide Deck (PPT, PDF, ZIP)
              </label>
              <input
                type="file"
                ref={docInputRef}
                onChange={handleDocFileChange}
                accept=".pdf,.ppt,.pptx,.key,.zip,image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className={`w-full p-4 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-center group transition-colors ${
                  isLight 
                    ? 'border-zinc-300 bg-zinc-50 hover:border-orange-500 hover:bg-orange-50/30' 
                    : 'border-zinc-700 bg-zinc-900/60 hover:border-orange-500'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className={`text-xs font-medium ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
                  {documentFile ? documentFile.name : 'Select Presentation or File'}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>PPT, PDF or source file</span>
              </button>
            </div>
          </div>

          {/* Image preview thumbnail if available */}
          {previewImageUrl && (
            <div className={`mt-2 p-2 border flex items-center gap-3 rounded-lg ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className="w-16 h-12 bg-zinc-200 border border-zinc-300 overflow-hidden shrink-0 rounded">
                <img
                  src={previewImageUrl}
                  alt="Selected Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-xs truncate ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Preview image ready
              </span>
            </div>
          )}

          {/* Submit Footer */}
          <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium border transition-colors rounded-lg ${
                isLight 
                  ? 'text-zinc-700 hover:text-zinc-900 border-zinc-200 bg-white hover:bg-zinc-100' 
                  : 'text-zinc-400 hover:text-white border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white transition-all shadow-md disabled:opacity-50 rounded-lg"
            >
              {isSubmitting ? 'Uploading...' : itemToEdit ? 'Save Changes' : 'Upload Work'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
