import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, Star, Sparkles, HeartHandshake, Compass, Code, Award } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { data } = usePortfolio();
  const { achievements } = data;

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('nss')) {
      return <HeartHandshake className="w-5 h-5 text-orange-400" />;
    }
    if (category.toLowerCase().includes('competition')) {
      return <Trophy className="w-5 h-5 text-amber-400" />;
    }
    if (category.toLowerCase().includes('project')) {
      return <Code className="w-5 h-5 text-white" />;
    }
    return <Star className="w-5 h-5 text-orange-400" />;
  };

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors & Extracurriculars</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Key <span className="glow-gradient-text">Achievements</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm sm:text-base">
            Demonstrating holistic growth through NSS social initiatives, collegiate hackathons, and technical coursework accomplishments.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="group relative rounded-3xl p-6 sm:p-7 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 shadow-xl shadow-black/40 transition-all duration-300 hover:translate-y-[-3px]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-orange-500/40 transition-all">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-orange-400 font-mono">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  {item.highlightBadge && (
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-300">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        {item.highlightBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top corner gradient */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-bl-full pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
