import React from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Building, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const { experience } = data;

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Work & <span className="glow-gradient-text">Practical Roles</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm sm:text-base">
            Hands-on organizational experience applying numerical accuracy, financial accountability, and operational workflow systems.
          </p>
        </div>

        {/* Experience List */}
        <div className="space-y-8">
          {experience.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 shadow-xl shadow-black/40 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-950/80 border border-orange-500/40 text-orange-300">
                      {exp.type}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {exp.role}
                  </h3>

                  <div className="flex items-center gap-2 text-sm sm:text-base text-amber-300 font-medium mt-1">
                    <Building className="w-4 h-4 text-orange-400" />
                    <span>{exp.organization}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Description paragraph */}
              {exp.description && (
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  {exp.description}
                </p>
              )}

              {/* Key Responsibilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Core Responsibilities & Accomplishments:
                </h4>
                <ul className="space-y-2.5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
