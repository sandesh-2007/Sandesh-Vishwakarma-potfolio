import React, { useState } from 'react';
import { X, Maximize2, CheckCircle2, Eye, Layers } from 'lucide-react';

const UI_OPTIONS = [
  {
    id: 'option-1',
    number: 'Option 1',
    title: 'Minimal Bento Grid (Apple / Linear Style)',
    subtitle: 'Most Popular • Clean Bento Cards Layout',
    description:
      'Pure white/off-white background, crisp black headings, aur structured Bento Box cards jisme Profile Photo, Bio, Location, Skills, aur Featured Projects ek saath clean grid mein dikhte hain.',
    image: '/src/assets/images/option_1_bento_grid_1794947173832.jpg',
    fallbackImage: '/ui-options/option1.jpg',
  },
  {
    id: 'option-2',
    number: 'Option 2',
    title: 'Clean Monochrome Developer (Vercel / Next.js Style)',
    subtitle: 'High-Contrast Black & White • Sharp Grid Lines',
    description:
      'Pure Black & White architectural layout, 1px razor-sharp divider borders, bold geometric typography, tabular stats strip, aur 2-column structured project cards.',
    image: '/src/assets/images/option_2_vercel_monochrome_1794947174624.jpg',
    fallbackImage: '/ui-options/option2.jpg',
  },
  {
    id: 'option-3',
    number: 'Option 3',
    title: 'Editorial Studio (Designer + Developer Style)',
    subtitle: 'Magazine Layout • Best for Code + UI/UX Showcase',
    description:
      'Oversized bold black typography, left side par numbered chapter index (01 About, 02 Projects, 03 UI/UX & Presentations) aur right side par bade visual project showcase cards.',
    image: '/src/assets/images/option_3_editorial_studio_1794947178121.jpg',
    fallbackImage: '/ui-options/option3.jpg',
  },
  {
    id: 'option-4',
    number: 'Option 4',
    title: 'Split-Dashboard (Interactive Sidebar Style)',
    subtitle: 'Fixed Left Profile Card • Scrollable Right Content',
    description:
      'Left side par fixed Profile Sidebar (Photo, Name, Social links, Menu, aur Resume button) aur right side par smooth scrolling About, Skills Matrix, aur Projects grid.',
    image: '/src/assets/images/option_4_split_dashboard_1794947181198.jpg',
    fallbackImage: '/ui-options/option4.jpg',
  },
];

export const UIDesignPreviewModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedZoom, setSelectedZoom] = useState<typeof UI_OPTIONS[0] | null>(null);

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 text-white border border-zinc-800 shadow-xl text-xs font-bold hover:bg-zinc-800 transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>View 4 Modern UI Design Options</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white text-zinc-950 border border-zinc-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-zinc-950 text-white text-[11px] font-mono font-bold uppercase">
                UI Reference Gallery
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-950 tracking-tight">
                4 Modern Portfolio UI Concepts — Select Your Favorite
              </h2>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Kisi bhi design image par click karke Full-Screen zoom mein dekhein, aur chat mein bataiye kaunsa Option (1, 2, 3, ya 4) apply karna hai.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 text-xs font-bold transition-colors"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
            <span>Close Preview</span>
          </button>
        </div>

        {/* 4 UI Options Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          {UI_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className="group border border-zinc-200 hover:border-zinc-950 bg-zinc-50/60 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
            >
              <div>
                {/* Option Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-zinc-950 text-white mr-2">
                      {opt.number}
                    </span>
                    <span className="text-sm font-extrabold text-zinc-950">
                      {opt.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedZoom(opt)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Full Screen</span>
                  </button>
                </div>

                {/* Screenshot Preview Image */}
                <div
                  onClick={() => setSelectedZoom(opt)}
                  className="relative aspect-video w-full bg-zinc-100 overflow-hidden cursor-pointer border-b border-zinc-200"
                >
                  <img
                    src={opt.image}
                    alt={opt.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.endsWith(opt.fallbackImage)) {
                        target.src = opt.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-zinc-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4" />
                      <span>Click to Zoom Full Image</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Footer */}
              <div className="p-4 bg-white">
                <div className="text-xs font-mono font-semibold text-zinc-700 mb-1">
                  {opt.subtitle}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Instruction Bar */}
        <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Chat mein bas <strong>"Option 1"</strong>, <strong>"Option 2"</strong>, <strong>"Option 3"</strong>, ya <strong>"Option 4"</strong> likh kar bhejiye — hum turant pura portfolio us design mein convert kar denge!
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shrink-0"
          >
            View Current Website Behind
          </button>
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      {selectedZoom && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedZoom(null)}
        >
          <div
            className="w-full max-w-6xl bg-white border border-zinc-300 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-zinc-950 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white text-zinc-950 text-xs font-mono font-bold">
                  {selectedZoom.number}
                </span>
                <span className="font-bold text-sm sm:text-base">
                  {selectedZoom.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedZoom(null)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Back to All 4 Options</span>
              </button>
            </div>
            <div className="bg-zinc-100 max-h-[80vh] overflow-auto flex items-center justify-center">
              <img
                src={selectedZoom.image}
                alt={selectedZoom.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith(selectedZoom.fallbackImage)) {
                    target.src = selectedZoom.fallbackImage;
                  }
                }}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
