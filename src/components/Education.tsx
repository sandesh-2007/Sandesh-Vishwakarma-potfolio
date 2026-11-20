import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink } from 'lucide-react';

export const Education: React.FC = () => {
  const { data, theme } = usePortfolio();
  const isLight = theme === 'light';
  const { education } = data;

  return (
    <section
      id="education"
      className={`py-20 sm:py-24 border-b transition-colors ${
        isLight ? 'border-zinc-200 bg-zinc-50/40' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Header */}
        <div
          className={`pb-10 mb-12 border-b flex flex-col md:flex-row md:items-end justify-between gap-4 ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}
        >
          <div>
            <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              02 · Academic Timeline
            </p>
            <h2
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              Education & Qualifications
            </h2>
          </div>
          <p className={`max-w-xl text-sm sm:text-base ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Formal technical education, foundational coursework, and continuous academic milestones.
          </p>
        </div>

        {/* Clean Vercel Monochrome Vertical Timeline */}
        <div className="relative max-w-4xl">
          {/* Left Spine */}
          <div
            className={`hidden sm:block absolute left-4 top-2 bottom-2 w-px ${
              isLight ? 'bg-zinc-200' : 'bg-zinc-800'
            }`}
          />

          <div className="space-y-8">
            {(education || []).map((item) => (
              <div
                key={item.id}
                className="relative sm:pl-14"
              >
                {/* Graduation Cap Timeline Node */}
                <div
                  className={`hidden sm:flex absolute left-0 top-5 w-8 h-8 p-1 border items-center justify-center ${
                    isLight
                      ? 'bg-white border-zinc-950'
                      : 'bg-zinc-100 border-zinc-700'
                  }`}
                >
                  <img
                    src="/assets/aistudio/image_d362e988.png"
                    alt="Graduation Cap"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain select-none"
                  />
                </div>

                {/* Hairline Card */}
                <div
                  className={`p-6 sm:p-8 border transition-colors ${
                    isLight
                      ? 'bg-white border-zinc-200 hover:border-zinc-950'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {/* Unboxed Meta Row */}
                  <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono mb-3 ${
                      isLight ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    <span className={`font-semibold tabular-nums ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                      {item.startYear} — {item.endYear}
                    </span>
                    {item.status && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={isLight ? 'text-emerald-700 font-medium' : 'text-emerald-400 font-medium'}>
                          {item.status}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Degree & Institution */}
                  <h3
                    className={`text-lg sm:text-xl font-bold tracking-tight ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    {item.degree}
                  </h3>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      isLight ? 'text-zinc-700' : 'text-zinc-300'
                    }`}
                  >
                    {item.institution}
                  </p>

                  {/* Description */}
                  <p
                    className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Certificate Link if present */}
                  {item.certificateLink && item.certificateLink !== '#' && (
                    <div className={`mt-4 pt-3 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                      <a
                        href={item.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold underline-offset-4 hover:underline ${
                          isLight ? 'text-zinc-950' : 'text-white'
                        }`}
                      >
                        <span>View Academic Record / Certificate</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
