import React, { useMemo, useState } from 'react';
import { ArrowUpRight, FolderGit2, SlidersHorizontal, X, Eye } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory, ProjectItem } from '../types';
import { BrandLogo } from './BrandLogo';

type FilterValue = 'All' | ProjectCategory;

const CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'Systems & Software',
  'Data & Analysis',
  'College Projects',
];

export const Projects: React.FC = () => {
  const { data, theme, isAdmin, openAdminTab } = usePortfolio();
  const isLight = theme === 'light';
  const projects = data.projects || [];

  const [activeCategory, setActiveCategory] = useState<FilterValue>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    CATEGORIES.forEach((cat) => {
      counts[cat] = projects.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const filterTabs: FilterValue[] = ['All', ...CATEGORIES];

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={`py-20 sm:py-24 border-b scroll-mt-16 transition-colors ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Header */}
        <div
          className={`pb-10 mb-8 border-b flex flex-col lg:flex-row lg:items-end justify-between gap-6 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          <div>
            <p
              className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              04 · Selected Work
            </p>
            <h2
              id="projects-heading"
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              Featured Projects
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end lg:items-center gap-4">
            <p
              className={`max-w-md text-sm sm:text-base ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
            >
              Production-focused web applications, academic management systems, and automated financial tools.
            </p>

            {isAdmin && (
              <button
                type="button"
                id="admin-manage-projects-btn"
                onClick={() => openAdminTab('projects')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors shrink-0 self-start sm:self-auto ${
                  isLight
                    ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'border-white bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Manage Projects</span>
              </button>
            )}
          </div>
        </div>

        {/* Sharp Monochrome Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab;
            const count = categoryCounts[tab] ?? 0;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider border transition-colors whitespace-nowrap ${
                  isActive
                    ? isLight
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-950 border-white'
                    : isLight
                      ? 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-950 hover:text-zinc-950'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-white hover:text-white'
                }`}
              >
                {tab === 'All' ? `All (${count})` : `${tab}${count > 0 ? ` (${count})` : ''}`}
              </button>
            );
          })}
        </div>

        {/* Responsive 3-Column Architectural Project Grid */}
        {filteredProjects.length === 0 ? (
          <div
            className={`p-10 border text-center ${
              isLight
                ? 'border-zinc-200 bg-zinc-50/40 text-zinc-500'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400'
            }`}
          >
            <p className="text-sm font-mono">No projects found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, idx) => {
              const hasLiveDemo = Boolean(
                project.liveDemoLink &&
                  project.liveDemoLink !== '#' &&
                  project.liveDemoLink.startsWith('http')
              );
              const hasGithub = Boolean(
                project.githubLink &&
                  project.githubLink !== '#' &&
                  project.githubLink.startsWith('http')
              );
              const indexLabel = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={project.id}
                  className={`project-card-rounded-br group border rounded-br-[28px] overflow-hidden flex flex-col justify-between transition-colors ${
                    isLight
                      ? 'bg-white border-zinc-200 hover:border-zinc-950'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-500'
                  }`}
                >
                  <div>
                    {/* Compact Project Thumbnail */}
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      aria-label={`Inspect ${project.name}`}
                      className={`relative block w-full h-36 overflow-hidden border-b text-left ${
                        isLight
                          ? 'bg-zinc-100 border-zinc-200'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      {!failedImages[project.id] && project.image ? (
                        <img
                          src={project.image}
                          alt={project.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                          }
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                          <FolderGit2
                            className={`w-6 h-6 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}
                          />
                          <span
                            className={`text-[10px] font-mono uppercase tracking-wider ${
                              isLight ? 'text-zinc-500' : 'text-zinc-400'
                            }`}
                          >
                            {project.category}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-mono font-semibold uppercase tracking-wider">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Project</span>
                      </div>
                    </button>

                    {/* Compact Project Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider tabular-nums ${
                            isLight ? 'text-zinc-500' : 'text-zinc-400'
                          }`}
                        >
                          {indexLabel} · {project.category}
                        </span>
                        {project.featured && (
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                              isLight ? 'text-zinc-950' : 'text-white'
                            }`}
                          >
                            Featured
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold tracking-tight leading-snug line-clamp-1 ${
                          isLight ? 'text-zinc-950' : 'text-white'
                        }`}
                      >
                        {project.name}
                      </h3>

                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isLight ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      >
                        {project.description}
                      </p>

                      {/* Crisp Bordered Stack Tags */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(project.technologies || []).slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-1.5 py-0.5 text-[9.5px] font-mono uppercase border ${
                              isLight
                                ? 'border-zinc-300 bg-white text-zinc-800'
                                : 'border-zinc-800 bg-zinc-900/60 text-zinc-300'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.technologies || []).length > 3 && (
                          <span
                            className={`px-1.5 py-0.5 text-[9.5px] font-mono uppercase border ${
                              isLight
                                ? 'border-zinc-200 bg-zinc-50 text-zinc-500'
                                : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                            }`}
                          >
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Hairline Card Footer */}
                  <div
                    className={`px-4 py-2.5 border-t rounded-br-2xl flex items-center justify-between gap-2 ${
                      isLight ? 'border-zinc-200' : 'border-zinc-800'
                    }`}
                  >
                    {hasLiveDemo ? (
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase tracking-wider transition-colors ${
                          isLight
                            ? 'text-zinc-950 hover:text-zinc-600'
                            : 'text-white hover:text-zinc-300'
                        }`}
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className={`inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase tracking-wider transition-colors ${
                          isLight
                            ? 'text-zinc-950 hover:text-zinc-600'
                            : 'text-white hover:text-zinc-300'
                        }`}
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}

                    {hasGithub && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase tracking-wider transition-colors ${
                          isLight
                            ? 'text-zinc-700 hover:text-zinc-950'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <BrandLogo name="github" isDark={!isLight} className="w-3 h-3" />
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Monochrome Project Detail Preview Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className={`relative max-w-2xl w-full border shadow-2xl overflow-hidden ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-950'
                : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`px-5 py-4 border-b flex items-center justify-between gap-4 ${
                isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  {selectedProject.category}
                </p>
                <h3 className="text-base sm:text-lg font-bold tracking-tight truncate">
                  {selectedProject.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className={`p-1.5 border transition-colors shrink-0 ${
                  isLight
                    ? 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-white hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto">
              {selectedProject.image && !failedImages[selectedProject.id] && (
                <div
                  className={`w-full aspect-[16/9] border-b overflow-hidden ${
                    isLight ? 'border-zinc-200 bg-zinc-100' : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-5">
                <p
                  className={`text-sm leading-relaxed ${
                    isLight ? 'text-zinc-700' : 'text-zinc-300'
                  }`}
                >
                  {selectedProject.description}
                </p>

                <div>
                  <p
                    className={`text-[10px] font-mono uppercase tracking-wider mb-2 ${
                      isLight ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProject.technologies || []).map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 text-[11px] font-mono uppercase border ${
                          isLight
                            ? 'border-zinc-300 bg-zinc-50 text-zinc-900'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`pt-4 border-t flex flex-wrap items-center gap-3 ${
                    isLight ? 'border-zinc-200' : 'border-zinc-800'
                  }`}
                >
                  {selectedProject.liveDemoLink &&
                    selectedProject.liveDemoLink !== '#' &&
                    selectedProject.liveDemoLink.startsWith('http') && (
                      <a
                        href={selectedProject.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                          isLight
                            ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                            : 'bg-white text-zinc-950 hover:bg-zinc-200'
                        }`}
                      >
                        <span>Open Live Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                  {selectedProject.githubLink &&
                    selectedProject.githubLink !== '#' &&
                    selectedProject.githubLink.startsWith('http') && (
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border transition-colors ${
                          isLight
                            ? 'border-zinc-300 bg-white text-zinc-950 hover:border-zinc-950'
                            : 'border-zinc-700 bg-zinc-950 text-white hover:border-white'
                        }`}
                      >
                        <BrandLogo name="github" isDark={!isLight} className="w-3.5 h-3.5" />
                        <span>View Source on GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
