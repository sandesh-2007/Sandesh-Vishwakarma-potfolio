import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { BrandLogo, BrandLogoName } from './BrandLogo';
import {
  Send,
  ArrowUpRight,
  CheckCircle2,
  Settings
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { data, sendMessage, setSheetsModalOpen, isAdmin, theme } = usePortfolio();
  const isLight = theme === 'light';
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

  const socialCards: Array<{
    name: string;
    value: string;
    href: string;
    logo: BrandLogoName;
    external: boolean;
  }> = [
    {
      name: 'Email Address',
      value: profile.email,
      href: `mailto:${profile.email}`,
      logo: 'mail',
      external: false
    },
    {
      name: 'GitHub',
      value: 'Repositories & Code Projects',
      href: profile.socials.github,
      logo: 'github',
      external: true
    },
    {
      name: 'LinkedIn',
      value: 'Professional Network & Experience',
      href: profile.socials.linkedin,
      logo: 'linkedin',
      external: true
    },
    {
      name: 'Instagram',
      value: 'Design, Creative Works & Updates',
      href: profile.socials.instagram,
      logo: 'instagram',
      external: true
    }
  ];

  return (
    <section
      id="contact"
      className={`py-20 sm:py-24 transition-colors ${
        isLight ? 'bg-zinc-50/40' : 'bg-zinc-950'
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
              10 · Get In Touch
            </p>
            <h2
              className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}
            >
              Let&apos;s Build Something Impactful
            </h2>
          </div>
          <p className={`max-w-xl text-sm sm:text-base ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Whether you have a freelance web project, student collaboration, or prospective job opportunity, I&apos;d love to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Availability, Social Links & Admin Sheets Sync */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-6 border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400 font-semibold'}>
                  Ready for New Projects
                </span>
              </div>
              <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                Available for Freelance & Projects
              </h3>
              <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Specializing in responsive modern web applications, spreadsheet workflow automation, and custom management tools.
              </p>
            </div>

            <div className={`border divide-y ${isLight ? 'bg-white border-zinc-200 divide-zinc-200' : 'bg-zinc-950 border-zinc-800 divide-zinc-800'}`}>
              {socialCards.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`group flex items-center justify-between p-4 transition-colors ${
                    isLight ? 'hover:bg-zinc-50' : 'hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2 border shrink-0 flex items-center justify-center ${
                        isLight
                          ? 'bg-zinc-50 border-zinc-200'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      <BrandLogo name={item.logo} isDark={!isLight} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {item.name}
                      </div>
                      <div className={`text-sm font-semibold truncate ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLight ? 'text-zinc-400 group-hover:text-zinc-950' : 'text-zinc-500 group-hover:text-white'}`} />
                </a>
              ))}
            </div>

            {isAdmin && (
              <div
                className={`p-4 border flex items-center justify-between gap-3 ${
                  isLight ? 'bg-white border-zinc-300' : 'bg-zinc-950 border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 border flex items-center justify-center shrink-0 ${
                      isLight
                        ? 'bg-zinc-50 border-zinc-200'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <BrandLogo name="sheets" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={`font-bold ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                        Google Sheets Sync
                      </span>
                      <span className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        · Admin{isSheetConnected ? ' · Active' : ''}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {isSheetConnected
                        ? sheetsConfig?.spreadsheetTitle || 'Connected to Google Sheet'
                        : 'Save responses directly to Google Sheets'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSheetsModalOpen(true)}
                  className={`px-3 py-1.5 border text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-800'
                      : 'bg-white text-zinc-950 border-white hover:bg-zinc-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isSheetConnected ? 'Manage' : 'Connect'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div
              className={`p-7 sm:p-9 border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className={`text-xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    Send a Direct Message
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Fill in the details below and your message will be delivered directly to Sandesh.
                  </p>
                </div>

                {isAdmin && isSheetConnected && (
                  <button
                    onClick={() => setSheetsModalOpen(true)}
                    className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-mono border px-2.5 py-1 transition-colors ${
                      isLight
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : 'text-emerald-400 bg-emerald-950/40 border-emerald-800 hover:bg-emerald-950/70'
                    }`}
                  >
                    <BrandLogo name="sheets" className="w-3.5 h-3.5" />
                    <span>Sheets Linked (Admin)</span>
                  </button>
                )}
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-8 border text-center space-y-3 ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-200 text-zinc-950'
                      : 'bg-emerald-950/30 border-emerald-800 text-white'
                  }`}
                >
                  <div
                    className={`w-11 h-11 border mx-auto flex items-center justify-center ${
                      isLight
                        ? 'bg-white border-emerald-300 text-emerald-700'
                        : 'bg-zinc-950 border-emerald-700 text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold">Message Sent Successfully!</h4>
                  <p className={`text-xs sm:text-sm ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Thank you for reaching out! Sandesh will respond to your email shortly.
                  </p>
                  {lastSyncResult && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-emerald-500/40 text-xs font-mono">
                      <BrandLogo name="sheets" className="w-4 h-4" />
                      <span>Details saved into Google Sheet row.</span>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className={`mt-3 px-4 py-2 text-xs font-semibold border transition-colors ${
                        isLight
                          ? 'bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-800'
                          : 'bg-white text-zinc-950 border-white hover:bg-zinc-200'
                      }`}
                    >
                      Send Another Note
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 text-xs sm:text-sm border focus:outline-none transition-colors ${
                          isLight
                            ? 'bg-white border-zinc-300 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950'
                            : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 text-xs sm:text-sm border focus:outline-none transition-colors ${
                          isLight
                            ? 'bg-white border-zinc-300 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950'
                            : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                      Project / Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Website Development / Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-4 py-3 text-xs sm:text-sm border focus:outline-none transition-colors ${
                        isLight
                          ? 'bg-white border-zinc-300 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950'
                          : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300'}`}>
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project, timeline, or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 text-xs sm:text-sm border focus:outline-none transition-colors resize-none ${
                        isLight
                          ? 'bg-white border-zinc-300 text-zinc-950 placeholder-zinc-400 focus:border-zinc-950'
                          : 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-white'
                      }`}
                    />
                  </div>

                  <button
                    id="contact-send-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                      isLight
                        ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                        : 'bg-white text-zinc-950 hover:bg-zinc-200'
                    }`}
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
