import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory, ProjectItem } from '../types';
import { 
  ExternalLink, 
  FolderGit2, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  Code2,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { data, isAdmin, theme, setLoginModalOpen, setEditModalOpen, deleteProject } = usePortfolio();
  const isLight = theme === 'light';
  const { projects } = data;
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleEditProject = () => {
    if (!isAdmin) {
      setLoginModalOpen(true);
      return;
    }
    setEditModalOpen(true);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!isAdmin) {
      setLoginModalOpen(true);
      return;
    }
    if (window.confirm(`Are you sure you want to remove project "${name}"?`)) {
      deleteProject(id);
    }
  };

  const categories = [
    'All',
    'Web Development',
    'Systems & Software',
    'Data & Analysis',
    'College Projects'
  ];

  const filteredProjects = projects.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.category === activeCategory;
  });

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-transparent">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
          <div className="text-center md:text-left">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-mono uppercase tracking-wider mb-3 ${
              isLight 
                ? 'bg-orange-50 border-orange-200 text-orange-800' 
                : 'bg-orange-950/60 border-orange-500/30 text-orange-400'
            }`}>
              <FolderGit2 className="w-3.5 h-3.5 text-orange-500" />
              <span>Featured Portfolio Works</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Featured <span className="glow-gradient-text">Projects</span>
            </h2>
            <p className={`mt-3 max-w-2xl text-sm sm:text-base ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Engineered systems, client portals, and data analysis utilities built with modern developer workflows.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleEditProject}
              className={`flex items-center gap-2 px-4 py-2.5 border hover:border-orange-500 text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0 ${
                isLight 
                  ? 'bg-white border-zinc-200 hover:bg-orange-50/50 text-zinc-900' 
                  : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-orange-500" />
              <span>Manage / Add Projects</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className={`flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl border ${
            isLight 
              ? 'bg-white border-zinc-200 shadow-sm' 
              : 'bg-zinc-950 border-zinc-800'
          }`}>
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-950/30'
                      : isLight
                        ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`group relative rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-300 hover:translate-y-[-6px] ${
                  isLight 
                    ? 'bg-white border-zinc-200 hover:border-orange-500 shadow-md shadow-zinc-200/50 hover:shadow-orange-500/10' 
                    : 'bg-zinc-950 border-zinc-800 hover:border-orange-500/60 shadow-xl shadow-black/50 hover:shadow-orange-950/30'
                }`}
              >
                {/* Top Image Box with zoom hover */}
                <div className={`relative w-full h-52 sm:h-56 overflow-hidden ${
                  isLight ? 'bg-zinc-100' : 'bg-zinc-900'
                }`}>
                  <img
                    src={project.image}
                    alt={project.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/80 backdrop-blur-md border border-zinc-700 text-orange-400 shadow-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Top Right: Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`text-xl font-bold tracking-tight group-hover:text-orange-500 transition-colors ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}>
                      {project.name}
                    </h3>
                    <p className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies Tags */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border transition-colors ${
                            isLight
                              ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 group-hover:border-zinc-700 group-hover:text-white'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: GitHub, Live Demo & Delete */}
                  <div className={`pt-4 border-t flex items-center justify-between gap-2.5 ${
                    isLight ? 'border-zinc-100' : 'border-zinc-800/80'
                  }`}>
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                          isLight 
                            ? 'text-zinc-700 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 border-zinc-200' 
                            : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border-zinc-800'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-orange-500" />
                        <span>Source Code</span>
                      </a>
                    )}

                    {project.liveDemoLink && (
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all active:scale-95"
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Remove/Delete Project Button - Only visible in Admin Edit Mode */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                        className={`p-2 rounded-xl border transition-colors shrink-0 active:scale-95 ${
                          isLight 
                            ? 'bg-zinc-50 hover:bg-red-50 border-zinc-200 hover:border-red-300 text-zinc-500 hover:text-red-500' 
                            : 'bg-zinc-900 hover:bg-red-950/70 border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-red-400'
                        }`}
                        title="Remove / Delete Project"
                        aria-label={`Remove ${project.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Subtle Glow Ring on hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/0 group-hover:border-orange-500/30 pointer-events-none transition-colors duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            No projects in category "{activeCategory}".
          </div>
        )}

      </div>
    </section>
  );
};
