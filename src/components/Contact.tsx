import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Mail,
  Send, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare,
  Github,
  Linkedin,
  Instagram,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { data, sendMessage, setSheetsModalOpen, isAdmin } = usePortfolio();
  const { profile } = data;
  const sheetsConfig = data.sheetsConfig;
  const isSheetConnected = !!(sheetsConfig && sheetsConfig.spreadsheetId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    const result = await sendMessage(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setLastSyncResult(result.syncedToSheets || false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 7000);
    }
  };

  const socialCards = [
    {
      name: 'Email Address',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
      bgColor: 'bg-red-950/30 border-red-500/40 text-[#EA4335]',
      accentColor: 'group-hover:text-[#EA4335]'
    },
    {
      name: 'GitHub',
      value: 'Repositories & Code Projects',
      href: profile.socials.github,
      icon: Github,
      bgColor: 'bg-zinc-900 border-zinc-700 text-white',
      accentColor: 'group-hover:text-white'
    },
    {
      name: 'LinkedIn',
      value: 'Professional Network & Experience',
      href: profile.socials.linkedin,
      icon: Linkedin,
      bgColor: 'bg-sky-950/30 border-[#0A66C2]/50 text-[#0A66C2]',
      accentColor: 'group-hover:text-[#0A66C2]'
    },
    {
      name: 'Instagram',
      value: 'Design, Creative Works & Updates',
      href: profile.socials.instagram,
      icon: Instagram,
      bgColor: 'bg-pink-950/30 border-[#E1306C]/50 text-[#E1306C]',
      accentColor: 'group-hover:text-[#E1306C]'
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Let's Build Something <span className="glow-gradient-text">Impactful</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm sm:text-base">
            Whether you have a freelance web project, student collaboration, or prospective job opportunity, I'd love to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Methods & Social Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Status Box */}
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-lg">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                  Ready for New Projects
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Available for Freelance & Projects
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                Specializing in responsive modern web applications, spreadsheet workflow automation, and custom management tools.
              </p>
            </div>

            {/* Social & Contact List */}
            <div className="space-y-3">
              {socialCards.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90 shadow-md transition-all duration-300 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${item.bgColor} shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">{item.name}</div>
                      <div className={`text-sm font-semibold text-white ${item.accentColor} transition-colors`}>
                        {item.value}
                      </div>
                    </div>
                  </div>

                  <ExternalLink className={`w-4 h-4 text-zinc-600 ${item.accentColor} transition-colors`} />
                </a>
              ))}
            </div>

            {/* Google Sheets Integration Card - ONLY VISIBLE TO LOGGED-IN ADMIN */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Google Sheets Sync</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-950 border border-orange-500/40 text-orange-400">
                        Admin Only
                      </span>
                      {isSheetConnected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {isSheetConnected 
                        ? (sheetsConfig?.spreadsheetTitle || 'Connected to Google Sheet')
                        : 'Save responses directly to Google Sheets'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSheetsModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isSheetConnected ? 'Manage' : 'Connect'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Interactive Professional Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-7 sm:p-9 bg-zinc-950 border border-zinc-800 shadow-2xl shadow-orange-950/20">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Fill in the details below and your message will be delivered directly to Sandesh.
                  </p>
                </div>

                {isAdmin && isSheetConnected && (
                  <button
                    onClick={() => setSheetsModalOpen(true)}
                    className="self-start sm:self-auto inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full hover:bg-emerald-900/40 transition-colors"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    <span>Sheets Linked (Admin)</span>
                  </button>
                )}
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                  <p className="text-xs sm:text-sm text-emerald-200/90">
                    Thank you for reaching out! Sandesh will respond to your email shortly.
                  </p>
                  {lastSyncResult && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-mono">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Details saved into Google Sheet row!</span>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                    >
                      Send Another Note
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                      Project / Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Website Development / Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project, timeline, or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    id="contact-send-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-400 shadow-lg shadow-orange-950/50 hover:shadow-orange-500/25 transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
