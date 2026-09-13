import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Calendar, Building, ExternalLink, Sparkles, Award } from 'lucide-react';

export const Education: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  return (
    <section id="education" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Education & <span className="glow-gradient-text">Qualifications</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm sm:text-base">
            Formal technical education, foundational coursework, and continuous academic milestones.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative">
          {/* Vertical timeline spine line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-500 via-amber-500 to-orange-900/40" />

          <div className="space-y-12 md:space-y-16">
            {education.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl bg-black border-2 border-orange-500 items-center justify-center shadow-lg shadow-orange-500/30 z-20">
                    <GraduationCap className="w-5 h-5 text-orange-400" />
                  </div>

                  {/* Left / Right Card Container */}
                  <div className="w-full md:w-1/2 md:px-8">
                    <div className="group relative rounded-2xl p-6 sm:p-7 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 shadow-xl shadow-black/60 transition-all duration-300 hover:translate-y-[-2px]">
                      
                      {/* Top Meta Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/70 border border-orange-500/40 text-orange-300 text-xs font-mono font-semibold">
                          <Calendar className="w-3 h-3 text-orange-400" />
                          <span>{item.startYear} — {item.endYear}</span>
                        </div>

                        {item.status && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                            {item.status}
                          </span>
                        )}
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                        {item.degree}
                      </h3>

                      {/* Institution */}
                      <div className="flex items-center gap-2 text-sm text-zinc-300 mt-1 font-medium">
                        <Building className="w-4 h-4 text-orange-400 shrink-0" />
                        <span>{item.institution}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Certificate or Verification link */}
                      {item.certificateLink && item.certificateLink !== '#' && (
                        <div className="mt-4 pt-3 border-t border-zinc-800">
                          <a
                            href={item.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Academic Record / Certificate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
