import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { UploadProfileModal } from './UploadProfileModal';
import { 
  GraduationCap, 
  Code2, 
  Lightbulb, 
  Rocket, 
  Layers, 
  Briefcase, 
  CheckCircle, 
  Sparkles,
  Camera,
  Upload
} from 'lucide-react';

export const About: React.FC = () => {
  const { data, isAdmin, theme } = usePortfolio();
  const { profile } = data;
  const [profileUploadOpen, setProfileUploadOpen] = useState(false);
  const isLight = theme === 'light';

  const pillars = [
    {
      icon: GraduationCap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/40',
      title: 'B.Sc. IT Education',
      desc: 'Deepening foundational knowledge in algorithms, databases, web technologies, and software architecture.'
    },
    {
      icon: Code2,
      color: 'text-white',
      bgColor: 'bg-zinc-900 border-zinc-800',
      title: 'Web Development & Tech',
      desc: 'Crafting responsive user interfaces, structured backend APIs, and modern component-driven frontends.'
    },
    {
      icon: Lightbulb,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/40',
      title: 'Problem Solving & Logic',
      desc: 'Approaching code with systematic debugging, clean architecture, and practical algorithmic efficiency.'
    },
    {
      icon: Rocket,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/40',
      title: 'Practical Project Delivery',
      desc: 'Turning concepts into tangible, deployable systems like coaching management portals and library systems.'
    },
    {
      icon: Layers,
      color: 'text-white',
      bgColor: 'bg-zinc-900 border-zinc-800',
      title: 'Continuous Upskilling',
      desc: 'Actively learning new libraries, TypeScript, Next.js, and integrating modern developer productivity tooling.'
    },
    {
      icon: Briefcase,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/40',
      title: 'Freelancing & Digital Work',
      desc: 'Ready for freelance collaborations, custom website development, and business workflow automations.'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient gradient */}
      <div className={`absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-orange-500/10' : 'bg-orange-600/10'
      }`} />
      <div className={`absolute -bottom-20 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-amber-500/10' : 'bg-amber-500/5'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 ${
            isLight
              ? 'bg-orange-100 border border-orange-300 text-orange-700'
              : 'bg-orange-950/60 border border-orange-500/30 text-orange-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover My Journey</span>
          </div>
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
            isLight ? 'text-zinc-900' : 'text-white'
          }`}>
            About <span className="glow-gradient-text">Me</span>
          </h2>
          <p className={`mt-3 max-w-2xl text-sm sm:text-base ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            Bridging academic rigor with hands-on web development, clean aesthetic design, and purposeful technology solutions.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Animated Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className={`relative group rounded-3xl p-1 transition-all duration-300 ${
              isLight
                ? 'bg-gradient-to-br from-orange-400/50 via-amber-200/60 to-orange-300/50 shadow-xl shadow-orange-500/10 border border-orange-200/80'
                : 'bg-gradient-to-br from-orange-600/40 via-zinc-800 to-amber-500/30 shadow-2xl shadow-orange-950/40'
            }`}>
              <div 
                id="about-profile-card"
                className={`rounded-[22px] p-6 sm:p-8 space-y-6 transition-colors duration-300 ${
                  isLight
                    ? 'bg-white border border-zinc-200/80 shadow-sm text-zinc-900'
                    : 'bg-zinc-950 text-white'
                }`}
              >
                
                {/* Profile Top Bar with Photo & Details */}
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => {
                      if (isAdmin) setProfileUploadOpen(true);
                    }}
                    className={`relative w-20 h-20 overflow-hidden border-2 shrink-0 transition-all ${
                      isLight
                        ? 'border-orange-500 shadow-md shadow-orange-500/20'
                        : 'border-orange-500/50 shadow-lg shadow-orange-950/50'
                    } ${isAdmin ? 'cursor-pointer group/avatar' : ''}`}
                    title={isAdmin ? "Click to upload/change photo" : profile.name}
                  >
                    <img 
                      src={profile.avatarUrl || '/sandesh_profile.jpg'} 
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + '/sandesh_profile.jpg') {
                          target.src = '/sandesh_profile.jpg';
                        }
                      }}
                      className={`w-full h-full object-cover ${
                        isAdmin ? 'group-hover/avatar:scale-110 transition-transform duration-500' : ''
                      }`}
                    />
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Camera className="w-5 h-5 text-orange-400" />
                        <span className="text-[9px] font-bold mt-0.5">Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold tracking-tight truncate ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    }`}>
                      {profile.name}
                    </h3>
                    <p className={`profile-headline text-xs font-mono truncate font-semibold ${
                      isLight ? 'text-orange-600' : 'text-orange-400'
                    }`}>
                      {profile.headline}
                    </p>
                    <p className={`profile-college text-xs mt-1 truncate font-medium ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      Thakur Shyamnarayan Degree College
                    </p>
                  </div>
                </div>

                {/* Direct Upload Profile Photo Button - Only visible in Admin Edit Mode */}
                {isAdmin && (
                  <button
                    onClick={() => setProfileUploadOpen(true)}
                    className={`w-full py-2 px-3 border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isLight
                        ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800'
                        : 'bg-zinc-900 border-orange-500/30 hover:border-orange-500 hover:bg-orange-950/30 text-orange-300 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-orange-500" />
                    <span>Upload / Change Profile Image</span>
                  </button>
                )}

                {/* Badges / Student Highlights */}
                <div className={`space-y-2.5 pt-2 border-t ${
                  isLight ? 'border-zinc-200' : 'border-zinc-800'
                }`}>
                  <div className={`highlight-row flex items-center justify-between text-xs py-2 px-3 rounded-lg border transition-colors ${
                    isLight 
                      ? 'bg-zinc-100/80 border-zinc-200/90 text-zinc-900 shadow-xs' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}>
                    <span className={`highlight-label font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Academic Track</span>
                    <span className={`highlight-value-primary font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>B.Sc. Information Technology</span>
                  </div>
                  <div className={`highlight-row flex items-center justify-between text-xs py-2 px-3 rounded-lg border transition-colors ${
                    isLight 
                      ? 'bg-zinc-100/80 border-zinc-200/90 text-zinc-900 shadow-xs' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}>
                    <span className={`highlight-label font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Current Phase</span>
                    <span className={`highlight-value-orange font-bold font-mono ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>{profile.stats.currentSemester}</span>
                  </div>
                  <div className={`highlight-row flex items-center justify-between text-xs py-2 px-3 rounded-lg border transition-colors ${
                    isLight 
                      ? 'bg-zinc-100/80 border-zinc-200/90 text-zinc-900 shadow-xs' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}>
                    <span className={`highlight-label font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Primary Focus</span>
                    <span className={`highlight-value-primary font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>Full-Stack & Data Systems</span>
                  </div>
                  <div className={`highlight-row flex items-center justify-between text-xs py-2 px-3 rounded-lg border transition-colors ${
                    isLight 
                      ? 'bg-zinc-100/80 border-zinc-200/90 text-zinc-900 shadow-xs' 
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}>
                    <span className={`highlight-label font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Work Readiness</span>
                    <span className={`highlight-value-emerald font-bold font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Freelance & Internship Ready</span>
                  </div>
                </div>

                {/* Quote / Philosophy Box */}
                <div className={`quote-box p-4 rounded-2xl border text-xs leading-relaxed italic transition-colors ${
                  isLight
                    ? 'bg-orange-50/90 border-orange-200 text-orange-950 font-medium shadow-xs'
                    : 'bg-orange-950/20 border-orange-800/40 text-orange-200/90'
                }`}>
                  "I believe great digital applications are born from the intersection of clean code logic, disciplined problem solving, and empathetic user design."
                </div>

                {/* Social Quick Links */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                  <span className={`text-xs ${isLight ? 'text-zinc-600 font-medium' : 'text-zinc-400'}`}>Connect directly:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <a 
                      href={profile.socials.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                        isLight
                          ? 'bg-pink-50 border-pink-200 text-[#E1306C] hover:bg-pink-100 shadow-xs'
                          : 'bg-pink-950/60 border-pink-700/40 text-pink-300 hover:bg-pink-900'
                      }`}
                      title="Instagram"
                    >
                      Instagram
                    </a>
                    <a 
                      href={profile.socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                        isLight
                          ? 'bg-blue-50 border-blue-200 text-[#0A66C2] hover:bg-blue-100 shadow-xs'
                          : 'bg-blue-950/60 border-blue-700/40 text-blue-300 hover:bg-blue-900'
                      }`}
                      title="LinkedIn"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href={`mailto:${profile.email}`} 
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                        isLight
                          ? 'bg-red-50 border-red-200 text-[#EA4335] hover:bg-red-100 shadow-xs'
                          : 'bg-red-950/60 border-red-700/40 text-red-300 hover:bg-red-900'
                      }`}
                      title="Email"
                    >
                      Email
                    </a>
                    <a 
                      href={profile.socials.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors ${
                        isLight
                          ? 'bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200 shadow-xs'
                          : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700'
                      }`}
                      title="GitHub"
                    >
                      GitHub
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Pillars Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Detailed Narrative Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed">
              {profile.aboutLong.map((para, idx) => (
                <p 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-colors ${
                    isLight
                      ? 'bg-white border-zinc-200 text-zinc-700 shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Core Competency Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-300 hover:translate-y-[-2px] ${
                      isLight
                        ? 'bg-white border-zinc-200 hover:border-orange-500/60 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 hover:border-orange-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        isLight
                          ? 'bg-orange-50 border-orange-200'
                          : pillar.bgColor
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isLight ? 'text-orange-600' : pillar.color
                        }`} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold tracking-tight ${
                          isLight ? 'text-zinc-900' : 'text-white'
                        }`}>
                          {pillar.title}
                        </h4>
                        <p className={`text-xs mt-1 leading-normal ${
                          isLight ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </motion.div>

        </div>

      </div>

      {/* Upload Profile Modal */}
      <UploadProfileModal
        isOpen={profileUploadOpen}
        onClose={() => setProfileUploadOpen(false)}
      />
    </section>
  );
};
