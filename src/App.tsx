import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
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
import { FloatingNavControls } from './components/FloatingNavControls';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';
import { LoadingScreen } from './components/LoadingScreen';

const PortfolioContent: React.FC = () => {
  const { theme } = usePortfolio();
  const [showIntroLoader, setShowIntroLoader] = useState(true);
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
          ? 'bg-zinc-950 text-zinc-100 selection:bg-white selection:text-zinc-950'
          : 'bg-white text-zinc-950 selection:bg-zinc-950 selection:text-white'
      }`}
    >
      {/* 5-Second Monochrome Loading Page */}
      {showIntroLoader && (
        <LoadingScreen
          durationMs={5000}
          onComplete={() => setShowIntroLoader(false)}
        />
      )}

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
        <Education />
        <Skills />
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
