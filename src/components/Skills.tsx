import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillCategory, SkillItem } from '../types';
import { 
  Sparkles, 
  Code2, 
  Cpu, 
  Database, 
  Layers, 
  Palette, 
  Terminal, 
  FileCode2, 
  Atom, 
  GitBranch, 
  Sheet, 
  Bot, 
  Image, 
  Search,
  CheckCircle2
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const { skills } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Frontend', 'Programming', 'Data & Tools', 'Design & AI'];

  const filteredSkills = skills.filter((skill) => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'filecode2':
      case 'html5':
        return <FileCode2 className="w-5 h-5 text-orange-400" />;
      case 'palette':
      case 'css':
        return <Palette className="w-5 h-5 text-amber-400" />;
      case 'sparkles':
      case 'javascript':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'atom':
      case 'react':
        return <Atom className="w-5 h-5 text-orange-400" />;
      case 'layers':
      case 'typescript':
        return <Layers className="w-5 h-5 text-white" />;
      case 'cpu':
      case 'c++':
      case 'c':
        return <Cpu className="w-5 h-5 text-orange-400" />;
      case 'terminal':
      case 'python':
        return <Terminal className="w-5 h-5 text-amber-400" />;
      case 'database':
      case 'sql':
        return <Database className="w-5 h-5 text-white" />;
      case 'sheet':
      case 'excel':
        return <Sheet className="w-5 h-5 text-emerald-400" />;
      case 'gitbranch':
      case 'git':
        return <GitBranch className="w-5 h-5 text-orange-400" />;
      case 'bot':
      case 'ai':
        return <Bot className="w-5 h-5 text-orange-400" />;
      case 'image':
      case 'canva':
        return <Image className="w-5 h-5 text-amber-400" />;
      case 'figma':
        return <span className="font-bold text-xs text-orange-400 font-mono">Fg</span>;
      default:
        return <Code2 className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Skills & <span className="glow-gradient-text">Technologies</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm sm:text-base">
            From modern web development to analytical software and AI tools, a versatile foundation built for real-world software solutions.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-950/50'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

        </div>

        {/* Skills Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative rounded-2xl p-5 bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/50 shadow-lg shadow-black/40 transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-105 group-hover:border-orange-500/40 transition-all">
                      {getSkillIcon(skill.icon || skill.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {skill.level}
                  </span>
                </div>

                {/* Animated Proficiency Bar */}
                <div className="mt-4 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                    <span>Proficiency</span>
                    <span className="text-orange-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400"
                    />
                  </div>
                </div>

                {/* Decorative hover glow */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No skills match "{searchQuery}". Try selecting "All" or updating the search.
          </div>
        )}

      </div>
    </section>
  );
};
