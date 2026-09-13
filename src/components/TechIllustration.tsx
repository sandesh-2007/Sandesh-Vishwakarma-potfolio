import React from 'react';
import { motion } from 'motion/react';
import { Code2, Sparkles, Github, Gift } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface TechIllustrationProps {
  onOpenSurpriseModal?: () => void;
  isGiftVisible?: boolean;
}

export const TechIllustration: React.FC<TechIllustrationProps> = ({
  onOpenSurpriseModal,
  isGiftVisible = true
}) => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Ambient background glow rings with orange & amber aura */}
      <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse-subtle transition-opacity duration-500 ${
        isLight
          ? 'bg-gradient-to-tr from-orange-400/20 via-amber-300/25 to-orange-300/15'
          : 'bg-gradient-to-tr from-orange-600/25 via-amber-600/20 to-orange-400/15'
      }`} />
      
      {/* Outer concentric tech rings */}
      <div className={`tech-orbit-ring absolute w-[92%] h-[92%] rounded-full border border-dashed animate-[spin_40s_linear_infinite] transition-colors ${
        isLight ? 'border-orange-400/30' : 'border-orange-500/20'
      }`} />
      <div className={`tech-orbit-ring absolute w-[76%] h-[76%] rounded-full border border-dotted animate-[spin_30s_linear_infinite_reverse] transition-colors ${
        isLight ? 'border-orange-400/35' : 'border-orange-400/25'
      }`} />

      {/* Main Central Hub */}
      <motion.div 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="tech-terminal-card"
        className={`relative z-10 w-[82%] h-[82%] rounded-3xl backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden group transition-all duration-500 ${
          isLight
            ? 'bg-white/95 border border-zinc-200/90 shadow-2xl shadow-orange-500/10 hover:border-orange-500/60 text-zinc-900'
            : 'bg-zinc-950/90 border border-zinc-800 shadow-2xl shadow-orange-950/40 hover:border-orange-500/60 text-white'
        }`}
      >
        {/* Top header bar */}
        <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
          isLight ? 'border-zinc-200/80' : 'border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
            <span className={`w-3 h-3 rounded-full inline-block transition-colors ${
              isLight ? 'bg-zinc-300' : 'bg-zinc-600'
            }`} />
            <span className={`ml-2 text-xs font-mono tracking-wider transition-colors ${
              isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'
            }`}>
              sandesh@dev-station:~
            </span>
          </div>
          <div className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-colors ${
            isLight
              ? 'text-orange-700 bg-orange-50 border-orange-200/80 font-semibold'
              : 'text-orange-400 bg-orange-950/70 border-orange-800/50'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            <span>B.Sc. IT Active</span>
          </div>
        </div>

        {/* Code & Logic Canvas */}
        <div className="my-auto py-2 font-mono text-xs space-y-2">
          <div className="flex items-center">
            <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>01</span>
            <span className={`font-semibold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>const</span>
            <span className={`ml-1.5 font-bold ${isLight ? 'text-zinc-950' : 'text-white'}`}>developer</span>
            <span className={`ml-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>=</span>
            <span className={`ml-1.5 font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>&#123;</span>
          </div>
          
          <div className="pl-6 space-y-1.5">
            <div>
              <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>02</span>
              <span className={isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'}>name:</span>
              <span className={`ml-2 font-semibold ${isLight ? 'text-orange-600' : 'text-orange-300'}`}>"Sandesh Vishwakarma"</span>,
            </div>
            <div>
              <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>03</span>
              <span className={isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'}>degree:</span>
              <span className={`ml-2 font-medium ${isLight ? 'text-zinc-900' : 'text-white'}`}>"B.Sc. IT (Thakur College)"</span>,
            </div>
            <div>
              <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>04</span>
              <span className={isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'}>focus:</span>
              <span className={`ml-2 font-semibold ${isLight ? 'text-orange-600' : 'text-orange-300'}`}>["FullStack", "WebDev", "Data"]</span>,
            </div>
            <div>
              <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>05</span>
              <span className={isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'}>readyForWork:</span>
              <span className={`ml-2 font-bold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>true</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className={`mr-2 font-mono ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>06</span>
            <span className={`font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>&#125;;</span>
            <span className="ml-3 inline-block w-2 h-4 bg-orange-500 animate-pulse" />
          </div>
        </div>

        {/* Live Metrics Grid inside Illustration */}
        <div className={`grid grid-cols-3 gap-2 pt-3 border-t transition-colors ${
          isLight ? 'border-zinc-200/80' : 'border-zinc-800'
        }`}>
          <div className={`rounded-xl p-2 border text-center transition-colors ${
            isLight
              ? 'bg-zinc-50 border-zinc-200/90 shadow-xs'
              : 'bg-zinc-900/70 border-zinc-800'
          }`}>
            <div className={`text-[10px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Semester</div>
            <div className={`text-xs font-bold font-mono ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>2nd / 3rd</div>
          </div>
          <div className={`rounded-xl p-2 border text-center transition-colors ${
            isLight
              ? 'bg-zinc-50 border-zinc-200/90 shadow-xs'
              : 'bg-zinc-900/70 border-zinc-800'
          }`}>
            <div className={`text-[10px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Core Stack</div>
            <div className={`text-xs font-bold font-mono ${isLight ? 'text-zinc-900' : 'text-white'}`}>TS • React • C++</div>
          </div>
          <div className={`rounded-xl p-2 border text-center transition-colors ${
            isLight
              ? 'bg-zinc-50 border-zinc-200/90 shadow-xs'
              : 'bg-zinc-900/70 border-zinc-800'
          }`}>
            <div className={`text-[10px] font-medium ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Status</div>
            <div className={`text-xs font-bold font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Open to Work</div>
          </div>
        </div>

        {/* Subtle decorative glow overlay */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Floating Orbital Tech Badges */}
      {/* 0. Mystery Gift Icon - In the user-marked area (top-left of the tech terminal card) */}
      {isGiftVisible && onOpenSurpriseModal && (
        <motion.button
          id="hero-mystery-gift-icon-btn"
          type="button"
          onClick={onOpenSurpriseModal}
          animate={{ 
            y: [-6, 6, -6],
            rotate: [0, 4, -4, 0]
          }}
          transition={{ 
            duration: 4.2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-0 sm:top-2 -left-4 sm:-left-10 lg:-left-16 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-xl cursor-pointer group flex items-center justify-center ${
            isLight
              ? 'bg-white/95 border-orange-300/90 text-orange-600 hover:border-orange-500 shadow-orange-500/20'
              : 'bg-zinc-950/95 border-orange-500/60 text-orange-400 hover:border-orange-400 hover:bg-zinc-900 shadow-black/80'
          }`}
          title="🎁 Open Mystery Terminal"
          aria-label="Open Mystery Terminal"
        >
          {/* Ambient Glowing Aura */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 opacity-50 blur-md group-hover:opacity-95 animate-pulse transition duration-500 pointer-events-none" />

          {/* Radar Ping Dot in Corner */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-black/50"></span>
          </span>

          {/* Sirf Icon */}
          <Gift className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-orange-400 transition-colors duration-200" />
        </motion.button>
      )}

      {/* 1. React */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-4 right-10 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-orange-200 shadow-md shadow-orange-500/10 text-orange-600'
            : 'bg-zinc-900/90 border-orange-500/40 shadow-lg shadow-orange-950/40 text-orange-300'
        }`}
      >
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold ${
          isLight ? 'bg-orange-50 text-orange-600' : 'bg-orange-500/20 text-orange-400'
        }`}>
          ⚛
        </div>
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>React</span>
      </motion.div>

      {/* 2. JavaScript */}
      <motion.div 
        animate={{ y: [6, -8, 6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className={`absolute top-1/4 -left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-amber-200 shadow-md shadow-amber-500/10 text-amber-700'
            : 'bg-zinc-900/90 border-amber-500/40 shadow-lg shadow-amber-950/30 text-amber-300'
        }`}
      >
        <span className="w-5 h-5 rounded bg-amber-400 text-zinc-950 font-bold text-[11px] flex items-center justify-center shadow-xs">
          JS
        </span>
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>JavaScript</span>
      </motion.div>

      {/* 3. Code: C++ / Python */}
      <motion.div 
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute -bottom-3 left-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-orange-200 shadow-md shadow-orange-500/10 text-orange-600'
            : 'bg-zinc-900/90 border-orange-500/40 shadow-lg shadow-orange-950/40 text-orange-300'
        }`}
      >
        <Code2 className={`w-4 h-4 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>C++ / Python</span>
      </motion.div>

      {/* 4. Figma */}
      <motion.div 
        animate={{ y: [8, -6, 8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className={`absolute top-8 -right-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-purple-200 shadow-md shadow-purple-500/10 text-purple-700'
            : 'bg-zinc-900/90 border-zinc-700 shadow-lg shadow-black/40 text-white'
        }`}
      >
        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[11px] ${
          isLight ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-orange-500/20 text-orange-400'
        }`}>
          Fg
        </span>
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>Figma</span>
      </motion.div>

      {/* 5. GitHub (with real GitHub icon from lucide-react) */}
      <motion.div 
        animate={{ y: [-7, 7, -7] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute -bottom-4 right-12 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-zinc-200 shadow-md shadow-zinc-950/5 text-zinc-900'
            : 'bg-zinc-900/90 border-zinc-700 shadow-lg text-white'
        }`}
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
          isLight ? 'bg-zinc-100 text-zinc-900 border border-zinc-200' : 'bg-zinc-800 text-white'
        }`}>
          <Github className="w-3.5 h-3.5" />
        </span>
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>GitHub</span>
      </motion.div>

      {/* 6. Excel */}
      <motion.div 
        animate={{ y: [6, -7, 6] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className={`absolute bottom-24 -left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-emerald-200 shadow-md shadow-emerald-500/10 text-emerald-800'
            : 'bg-zinc-900/90 border-emerald-500/40 shadow-lg shadow-black/30 text-emerald-300'
        }`}
      >
        <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
          X
        </span>
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>Excel</span>
      </motion.div>

      {/* 7. AI Tools */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-2/3 -right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-orange-200 shadow-md shadow-orange-500/10 text-orange-600'
            : 'bg-zinc-900/95 border-orange-500/50 shadow-lg shadow-orange-950/50 text-orange-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>AI Tools</span>
      </motion.div>
    </div>
  );
};
