import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { OtherSkills } from './components/OtherSkills';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Achievements } from './components/Achievements';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminEditPanel } from './components/AdminEditPanel';
import { ResumeModal } from './components/ResumeModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ToastContainer } from './components/ToastContainer';
import { CursorGlow } from './components/CursorGlow';
import { HoverGridBackground } from './components/HoverGridBackground';
import { FloatingNavControls } from './components/FloatingNavControls';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';

const PortfolioContent: React.FC = () => {
  const { theme } = usePortfolio();
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [isGiftDismissed, setIsGiftDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('gift_terminal_exited') === 'true';
    } catch {
      return false;
    }
  });

  const handleCloseTerminal = () => {
    setSurpriseModalOpen(false);
    setIsGiftDismissed(true);
    try {
      sessionStorage.setItem('gift_terminal_exited', 'true');
    } catch {}
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${
        theme === 'dark'
          ? 'bg-black text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200'
          : 'bg-zinc-50 text-zinc-900 selection:bg-orange-500/30 selection:text-orange-900'
      }`}
    >
      {/* Interactive Background Grid Lines with 10-20% Opacity on Hover */}
      <HoverGridBackground />

      {/* Orange Neon Light Mouse Cursor Follower */}
      <CursorGlow />

      {/* Navigation Header */}
      <Navbar 
        onOpenResumeModal={() => setResumeModalOpen(true)} 
      />

      {/* Main Portfolio Sections */}
      <main className="flex-1">
        <Hero 
          onOpenResumeModal={() => setResumeModalOpen(true)} 
          onOpenSurpriseModal={() => setSurpriseModalOpen(true)}
          isGiftVisible={!isGiftDismissed}
        />
        <About />
        <Education />
        <OtherSkills />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Achievements />
        <Resume onOpenResumeModal={() => setResumeModalOpen(true)} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenDiagnostics={() => setSurpriseModalOpen(true)} />

      {/* Interactive Modals & Suites */}
      <FloatingNavControls onOpenDiagnostics={() => setSurpriseModalOpen(true)} />
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
      <SystemDiagnosticsModal
        isOpen={surpriseModalOpen}
        onClose={handleCloseTerminal}
      />
      <AdminLoginModal />
      <AdminEditPanel />
      <GoogleSheetsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
