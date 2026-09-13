import React from 'react';
import { Skull, ShieldAlert, Volume2, VolumeX, Terminal, ArrowRight, Activity } from 'lucide-react';

interface BreachIntroOverlayProps {
  progress: number;
  logs: string[];
  deviceModel: string;
  os: string;
  onSkip: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const BreachIntroOverlay: React.FC<BreachIntroOverlayProps> = ({
  progress,
  logs,
  deviceModel,
  os,
  onSkip,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <div 
      id="breach-intro-overlay" 
      className="relative flex flex-col justify-between p-6 sm:p-8 bg-black text-emerald-400 font-mono select-none overflow-hidden min-h-[480px] sm:min-h-[520px]"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)'
      }}
    >
      {/* Background Cyber Scanlines & Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Scanline flickering bar */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-red-500/5 to-transparent h-12 w-full animate-pulse" />

      {/* Top Threat Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-red-500/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/70 border border-red-500/60 shadow-lg shadow-red-500/20 text-red-400 animate-pulse">
            <Skull className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-500 font-bold tracking-widest text-xs sm:text-sm uppercase">
                CRITICAL THREAT // ZERO-DAY EXPLOIT
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-zinc-100 tracking-tight mt-0.5">
              TARGET DEVICE COMPROMISE DETECTED
            </h2>
          </div>
        </div>

        {/* Sound toggle button */}
        <button
          type="button"
          onClick={onToggleSound}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/40 text-red-300 hover:text-red-200 text-xs transition-colors"
          title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Audio ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Middle Exploit Diagnostics & Target Information */}
      <div className="relative z-10 my-auto py-6 space-y-5">
        {/* Identified Hardware Target Box */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 backdrop-blur-sm shadow-inner">
          <div className="flex items-center justify-between text-xs text-red-400 mb-2 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Target Victim Intercepted</span>
            </div>
            <span className="px-2 py-0.5 rounded-sm bg-red-500/20 border border-red-500/30 text-red-300 text-[10px]">
              VULNERABLE
            </span>
          </div>
          <div className="text-base sm:text-xl font-bold text-white tracking-wide">
            {deviceModel}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            Platform: <span className="text-emerald-400">{os}</span> • Port: <span className="text-amber-400">1337 (Root Shell)</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Exfiltrating Host Registers & DMA Bus...
            </span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-emerald-500/30 p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Log stream */}
        <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs font-mono space-y-1.5 max-h-32 overflow-y-auto">
          {logs.map((log, idx) => (
            <div 
              key={idx} 
              className={`leading-relaxed ${
                log.includes('TARGET') || log.includes('COMPROMISED') 
                  ? 'text-red-400 font-semibold' 
                  : log.includes('PRIVILEGES') || log.includes('EXFILTRATING')
                    ? 'text-amber-400'
                    : 'text-emerald-400'
              }`}
            >
              {log}
            </div>
          ))}
          <div className="flex items-center gap-1 text-emerald-500 animate-pulse">
            <span>▋</span>
            <span className="text-[11px] text-zinc-400">injecting exploit bytecode...</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/80">
        <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Automated exploit sequence in progress</span>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs transition-all hover:translate-x-0.5"
        >
          <span>Enter Root Terminal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
