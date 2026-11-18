import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, Star, HeartHandshake, Code } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { data, theme } = usePortfolio();
  const isLight = theme === 'light';
  const { achievements } = data;

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('nss')) {
      return <HeartHandshake className="w-5 h-5" />;
    }
    if (category.toLowerCase().includes('competition')) {
      return <Trophy className="w-5 h-5" />;
    }
    if (category.toLowerCase().includes('project')) {
      return <Code className="w-5 h-5" />;
    }
    return <Star className="w-5 h-5" />;
  };

  return (
    <section
      id="achievements"
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
              08 · Honors & Milestones
            </p>
            <h2
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              Key Achievements
            </h2>
          </div>
          <p className={`max-w-xl text-sm sm:text-base ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Demonstrating holistic growth through NSS social initiatives, collegiate hackathons, and technical coursework accomplishments.
          </p>
        </div>

        {/* Architectural 2-Column Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(achievements || []).map((item) => (
            <div
              key={item.id}
              className={`p-6 sm:p-7 border transition-colors ${
                isLight
                  ? 'bg-white border-zinc-200 hover:border-zinc-950'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 border flex items-center justify-center shrink-0 ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-950'
                      : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                >
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono mb-1.5 ${
                      isLight ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    <span className={`font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                      {item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.date}</span>
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    {item.title}
                  </h3>

                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {item.description}
                  </p>

                  {item.highlightBadge && (
                    <div className="mt-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-mono border ${
                          isLight
                            ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        {item.highlightBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
