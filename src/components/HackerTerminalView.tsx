import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Skull, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  Radio, 
  Copy, 
  Check, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Battery, 
  BatteryCharging, 
  Monitor, 
  Laptop, 
  Globe, 
  Clock, 
  Flame, 
  Zap,
  RotateCcw
} from 'lucide-react';

interface SystemInfo {
  deviceModel: string;
  os: string;
  browser: string;
  deviceType: string;
  screenResolution: string;
  viewportSize: string;
  refreshRate: string;
  pixelRatio: string;
  colorDepth: string;
  hdrSupport: boolean;
  cpuCores: string;
  deviceMemory: string;
  gpuModel: string;
  networkType: string;
  onlineStatus: boolean;
  latencyMs: number | null;
  storageEstimate: string;
  audioSampleRate: string;
  doNotTrack: boolean;
  language: string;
  timeZone: string;
  localTime: string;
  batteryLevel: number | null;
  isBatteryCharging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
  hasBatteryApi: boolean;
  touchSupport: boolean;
  maxTouchPoints: number;
  userAgent: string;
}

interface HackerTerminalViewProps {
  sysInfo: SystemInfo;
  currentTime: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSwitchToCleanSpecs: () => void;
  onClose: () => void;
  onCopySpecs: () => void;
  copied: boolean;
  onRunPython: () => void;
  onMeasurePing: () => void;
  playTone: (freq: number, type?: OscillatorType, duration?: number, vol?: number) => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'warning' | 'success';
  text: string;
}

export const HackerTerminalView: React.FC<HackerTerminalViewProps> = ({
  sysInfo,
  currentTime,
  soundEnabled,
  onToggleSound,
  onSwitchToCleanSpecs,
  onClose,
  onCopySpecs,
  copied,
  onRunPython,
  onMeasurePing,
  playTone
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<LogEntry[]>([
    { type: 'warning', text: '════════════════════════════════════════════════════════════════' },
    { type: 'error', text: '☠️ [ALERT] HOST ROOT PRIVILEGES COMPROMISED VIA EXPLOIT PAYLOAD' },
    { type: 'success', text: `[+] EXFILTRATED HOST: ${sysInfo.deviceModel} (${sysInfo.deviceType})` },
    { type: 'output', text: 'Type "help" or click the quick-action chips below to run shell commands.' },
    { type: 'warning', text: '════════════════════════════════════════════════════════════════' }
  ]);

  const [isSelfDestructing, setIsSelfDestructing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [matrixActive, setMatrixActive] = useState(false);
  const [showPrankModal, setShowPrankModal] = useState(false);
  const consoleBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isSelfDestructing, showPrankModal]);

  // Self destruct timer
  useEffect(() => {
    if (!isSelfDestructing) return;
    if (countdown <= 0) {
      setIsSelfDestructing(false);
      playTone(85, 'sawtooth', 0.6, 0.12);
      setHistory(prev => [
        ...prev,
        { type: 'error', text: '💥 [BOOM!] SIMULATED PAYLOAD DETONATED!' },
        { type: 'success', text: '😄 RELAX! Nothing was harmed. This is just Sandesh\'s creative cyber prank! Have a great day.' }
      ]);
      return;
    }

    playTone(700 + (5 - countdown) * 130, 'sine', 0.15, 0.08);
    const t = setTimeout(() => {
      setCountdown(c => c - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [isSelfDestructing, countdown, playTone]);

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;
    setInputVal('');
    playTone(920, 'sine', 0.06, 0.04);

    const cmd = raw.toLowerCase();
    const promptEntry: LogEntry = {
      type: 'input',
      text: `root@breached-device:~# ${raw}`
    };

    if (cmd === 'clear' || cmd === 'cls') {
      setHistory([]);
      return;
    }

    let replies: LogEntry[] = [];

    if (cmd === 'help') {
      replies = [
        { type: 'output', text: 'Available Exploitation Commands:' },
        { type: 'output', text: '  • specs / device    : Print exfiltrated hardware, GPU & OS register dump' },
        { type: 'output', text: '  • battery           : Intercept live battery percentage & charging bus' },
        { type: 'output', text: '  • matrix            : Toggle green digital rain stream' },
        { type: 'output', text: '  • prank / reveal    : Is my device really hacked? (Safe disclaimer)' },
        { type: 'output', text: '  • python            : Run Python 3.10 Benchmark test' },
        { type: 'output', text: '  • ping              : Ping remote server to evaluate latency' },
        { type: 'output', text: '  • whoami            : Print root session privileges' },
        { type: 'output', text: '  • camera            : Attempt hardware webcam tap (funny response)' },
        { type: 'output', text: '  • self_destruct     : Trigger 5-second countdown sequence' },
        { type: 'output', text: '  • clear             : Wipe terminal history' }
      ];
    } else if (cmd === 'specs' || cmd === 'device') {
      replies = [
        { type: 'warning', text: '--- [EXFILTRATED HOST HARDWARE DOSSIER] ---' },
        { type: 'success', text: `[+] DEVICE MODEL  : ${sysInfo.deviceModel} (${sysInfo.deviceType})` },
        { type: 'output', text: `[+] OPERATING SYS : ${sysInfo.os}` },
        { type: 'output', text: `[+] CPU CORES     : ${sysInfo.cpuCores}` },
        { type: 'output', text: `[+] GPU RENDERER  : ${sysInfo.gpuModel}` },
        { type: 'output', text: `[+] RAM ESTIMATE  : ${sysInfo.deviceMemory}` },
        { type: 'output', text: `[+] DISPLAY PANEL : ${sysInfo.screenResolution} @ ${sysInfo.refreshRate} (DPR: ${sysInfo.pixelRatio})` },
        { type: 'output', text: `[+] NETWORK LINK  : ${sysInfo.networkType} (Ping: ${sysInfo.latencyMs !== null ? sysInfo.latencyMs + 'ms' : 'Active'})` },
        { type: 'output', text: `[+] BROWSER CORE  : ${sysInfo.browser}` },
        { type: 'output', text: `[+] HOST CLOCK    : ${sysInfo.timeZone} | ${currentTime}` }
      ];
    } else if (cmd === 'battery') {
      replies = [
        { type: 'warning', text: '--- [HARDWARE POWER BUS INTERCEPTION] ---' },
        { type: 'success', text: `[+] BATTERY LEVEL : ${sysInfo.batteryLevel !== null ? `${sysInfo.batteryLevel}%` : 'Direct AC Mains (Desktop Mode)'}` },
        { type: 'output', text: `[+] POWER FLOW    : ${sysInfo.isBatteryCharging ? '⚡ AC Charger Connected & Supplying Current' : '🔋 Operating on Internal Battery Reserve'}` },
        { type: 'output', text: `[+] BUS STATUS    : Safe voltage, 0 heat anomalies detected.` }
      ];
    } else if (cmd === 'matrix') {
      setMatrixActive(m => !m);
      replies = [
        { type: 'success', text: `[+] Matrix Digital Stream: ${!matrixActive ? 'ACTIVATED 🟢' : 'DEACTIVATED'}` }
      ];
    } else if (cmd === 'prank' || cmd === 'reveal') {
      setShowPrankModal(true);
      replies = [
        { type: 'warning', text: '════════════════════════════════════════════════════════════════' },
        { type: 'success', text: '😄 RELAX! YOUR DEVICE IS 100% SAFE & UNHARMED!' },
        { type: 'output', text: 'This is a creative cyber-themed terminal prank crafted by Sandesh Vishwakarma.' },
        { type: 'output', text: 'All hardware specs shown above are safely queried via standard browser Web APIs.' },
        { type: 'output', text: 'No personal data, passwords, or files are ever read or transmitted.' },
        { type: 'warning', text: '════════════════════════════════════════════════════════════════' }
      ];
    } else if (cmd === 'self_destruct') {
      setIsSelfDestructing(true);
      setCountdown(5);
      replies = [
        { type: 'error', text: '🚨 [CRITICAL ALERT] HOST SELF-DESTRUCT INITIATED IN 5 SECONDS!' },
        { type: 'error', text: 'Click [ABORT COUNTDOWN] below if you wish to cancel.' }
      ];
    } else if (cmd === 'whoami') {
      replies = [
        { type: 'success', text: `uid=0(root) gid=0(root) groups=0(root) [Compromised Guest Host: ${sysInfo.deviceModel}]` }
      ];
    } else if (cmd === 'camera') {
      replies = [
        { type: 'error', text: '[!] ACCESS BLOCKED: Sandesh respects your privacy! No cameras or microphones accessed.' },
        { type: 'success', text: '[+] Privacy firewall maintained.' }
      ];
    } else if (cmd === 'python') {
      onRunPython();
      replies = [
        { type: 'output', text: '[+] Executing Python 3.10 Benchmark Kernel...' },
        { type: 'success', text: '[+] Prime numbers benchmark calculated in background.' },
        { type: 'output', text: '[+] Click "Clean Specs View" to see complete benchmark graph.' }
      ];
    } else if (cmd === 'ping') {
      onMeasurePing();
      replies = [
        { type: 'output', text: `[+] Pinging host server: ${sysInfo.latencyMs !== null ? sysInfo.latencyMs + ' ms' : 'Testing...'} [SUCCESS]` }
      ];
    } else {
      replies = [
        { type: 'error', text: `bash: ${raw}: command not found. Type 'help' to see available exploit commands.` }
      ];
    }

    setHistory(prev => [...prev, promptEntry, ...replies]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const abortSelfDestruct = () => {
    setIsSelfDestructing(false);
    playTone(400, 'sine', 0.2, 0.05);
    setHistory(prev => [
      ...prev,
      { type: 'success', text: '🛡️ [ABORTED] Self-destruct sequence successfully canceled by operator.' }
    ]);
  };

  return (
    <div 
      id="hacker-terminal-view"
      className="flex flex-col h-full bg-black text-emerald-400 font-mono select-text overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #090e0b 0%, #000000 100%)'
      }}
    >
      {/* Top Cyber Window Controls Bar */}
      <div className="px-4 sm:px-5 py-3 border-b border-emerald-950/80 bg-zinc-950/90 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/50" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 shrink-0" />

          <div className="flex items-center gap-1.5 truncate">
            <Skull className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
            <span className="text-xs font-bold text-red-400 tracking-wider uppercase truncate">
              ROOT SHELL // {sysInfo.deviceModel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-emerald-300 text-xs transition-colors"
            title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </button>

          {/* Switch to Clean Specs */}
          <button
            type="button"
            onClick={onSwitchToCleanSpecs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-all"
            title="Switch to detailed Clean Diagnostics view"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Clean Specs</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-red-950 bg-red-950/40 hover:bg-red-900/50 text-red-400 transition-colors"
            title="Disengage Root Shell"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-[13px] leading-relaxed">
        
        {/* Banner with ASCII threat header */}
        <div className="p-3 sm:p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-red-300 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-red-400 uppercase">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            <span>CRITICAL WARNING: VISITOR TELEMETRY EXFILTRATED</span>
          </div>
          <div className="text-[11px] text-zinc-300">
            A simulated zero-day exploit payload has connected to your host device. Hardware registers, display panel matrices, and battery telemetry have been indexed below.
          </div>
        </div>

        {/* Real-time Hardware Dossier Box */}
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-zinc-950/80 shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-emerald-400" />
              Exfiltrated Target Specifications
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[10px] animate-pulse font-bold">
              PORT 1337 OPEN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">📱 DEVICE MODEL:</span>
              <span className="text-white font-bold">{sysInfo.deviceModel} ({sysInfo.deviceType})</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">💻 OS & KERNEL:</span>
              <span className="text-emerald-300 font-semibold">{sysInfo.os}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">⚙️ CPU CORES:</span>
              <span className="text-amber-300 font-semibold">{sysInfo.cpuCores} Cores</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">🎮 GPU ENGINE:</span>
              <span className="text-zinc-200 truncate" title={sysInfo.gpuModel}>{sysInfo.gpuModel}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">🧠 MEMORY (RAM):</span>
              <span className="text-emerald-300 font-semibold">{sysInfo.deviceMemory}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">🔋 POWER CIRCUIT:</span>
              <span className="text-amber-300 font-semibold">
                {sysInfo.batteryLevel !== null 
                  ? `${sysInfo.batteryLevel}% [${sysInfo.isBatteryCharging ? 'AC CHARGING ⚡' : 'ON BATTERY 🔋'}]` 
                  : 'DIRECT AC MAINS ⚡'}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">🖥️ DISPLAY PANEL:</span>
              <span className="text-zinc-200">{sysInfo.screenResolution} @ {sysInfo.refreshRate} (DPR: {sysInfo.pixelRatio})</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-zinc-500 w-28 shrink-0">🌐 NETWORK LINK:</span>
              <span className="text-emerald-400">{sysInfo.networkType} (Ping: {sysInfo.latencyMs !== null ? `${sysInfo.latencyMs} ms` : 'Active'})</span>
            </div>

            <div className="flex items-start gap-2 sm:col-span-2">
              <span className="text-zinc-500 w-28 shrink-0">🔍 BROWSER CORE:</span>
              <span className="text-zinc-300 truncate">{sysInfo.browser}</span>
            </div>

            <div className="flex items-start gap-2 sm:col-span-2">
              <span className="text-zinc-500 w-28 shrink-0">🕒 HOST CLOCK:</span>
              <span className="text-zinc-400">{sysInfo.timeZone} | {currentTime}</span>
            </div>
          </div>
        </div>

        {/* Self-Destruct Active Warning Box */}
        {isSelfDestructing && (
          <div className="p-4 rounded-xl border-2 border-red-500 bg-red-950/60 text-red-300 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-red-500/30">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-red-500 animate-bounce" />
              <div>
                <div className="text-base font-black text-white tracking-wider">
                  ⚠️ HOST SELF-DESTRUCT IN 00:0{countdown} SECONDS!
                </div>
                <div className="text-xs text-red-200">
                  Simulated root wipe routine executing...
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={abortSelfDestruct}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
            >
              ABORT SELF-DESTRUCT
            </button>
          </div>
        )}

        {/* Prank Disclaimer Modal / Card */}
        {showPrankModal && (
          <div className="p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/40 text-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>😄 Relax! Your Device is 100% Safe & Unharmed!</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowPrankModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Dismiss ✕
              </button>
            </div>
            <p className="text-xs leading-relaxed text-zinc-300">
              Don't panic! This is Sandesh Vishwakarma's creative portfolio showcase. All data displayed above (device model, CPU cores, GPU renderer, battery) is safely obtained through standard, sandboxed browser Web APIs. No personal data, files, or passwords were touched or exfiltrated!
            </p>
          </div>
        )}

        {/* Matrix Code Stream (if active) */}
        {matrixActive && (
          <div className="p-3 rounded-lg border border-emerald-500/50 bg-black text-emerald-400 text-xs overflow-hidden h-24 flex flex-col justify-end">
            <div className="text-[11px] text-emerald-500/80 animate-pulse font-mono leading-none">
              01001100 01101111 01100001 01100100 01101001 01101110 01100111...
              <br />
              01010011 01100001 01101110 01100100 01100101 01110011 01101000...
              <br />
              01000011 01111001 01100010 01100101 01110010 00100000 01010011...
              <br />
              11001010 11011001 10100101 01011010 10110111 00101010 11010011...
            </div>
          </div>
        )}

        {/* Interactive Shell Output Log */}
        <div className="space-y-1 pt-2">
          {history.map((h, i) => (
            <div 
              key={i} 
              className={`leading-relaxed ${
                h.type === 'input' 
                  ? 'text-white font-bold' 
                  : h.type === 'error'
                    ? 'text-red-400'
                    : h.type === 'warning'
                      ? 'text-amber-400'
                      : h.type === 'success'
                        ? 'text-emerald-300 font-semibold'
                        : 'text-zinc-300'
              }`}
            >
              {h.text}
            </div>
          ))}
          <div ref={consoleBottomRef} />
        </div>

      </div>

      {/* Quick Action Chips for Easy One-Click Commands */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-zinc-900 bg-zinc-950/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-zinc-500 shrink-0 mr-1 hidden sm:inline">QUICK COMMANDS:</span>
        
        <button
          type="button"
          onClick={() => executeCommand('specs')}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 transition-colors"
        >
          📋 dump_specs
        </button>

        <button
          type="button"
          onClick={() => executeCommand('battery')}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 transition-colors"
        >
          🔋 probe_battery
        </button>

        <button
          type="button"
          onClick={() => executeCommand('matrix')}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 transition-colors"
        >
          🟢 {matrixActive ? 'stop_matrix' : 'matrix_rain'}
        </button>

        <button
          type="button"
          onClick={() => executeCommand('python')}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 transition-colors"
        >
          ⚡ run_python3
        </button>

        <button
          type="button"
          onClick={() => executeCommand('self_destruct')}
          className="px-2.5 py-1 rounded-md bg-red-950/50 hover:bg-red-900/60 border border-red-900/60 text-red-300 hover:text-red-200 shrink-0 transition-colors"
        >
          💣 self_destruct
        </button>

        <button
          type="button"
          onClick={() => executeCommand('prank')}
          className="px-2.5 py-1 rounded-md bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-900/60 text-emerald-300 hover:text-emerald-200 shrink-0 transition-colors"
        >
          😄 is_this_real?
        </button>

        <button
          type="button"
          onClick={() => executeCommand('clear')}
          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 transition-colors"
        >
          🧹 clear
        </button>
      </div>

      {/* Terminal Input Bar & Footer Actions */}
      <div className="p-3 sm:p-4 border-t border-emerald-950/80 bg-zinc-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Bash command input form */}
        <form onSubmit={handleFormSubmit} className="flex-1 flex items-center gap-2 bg-black px-3 py-2 rounded-lg border border-zinc-800 focus-within:border-emerald-500 transition-colors">
          <span className="text-emerald-500 font-bold shrink-0">root@breached-device:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'specs', 'battery', 'matrix'..."
            className="flex-1 bg-transparent text-emerald-300 text-xs focus:outline-hidden font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 rounded text-zinc-400 hover:text-emerald-400 transition-colors"
            title="Execute Command"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Copy specs & switch buttons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onCopySpecs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
            title="Copy Exfiltrated Hardware Specs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Specs</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Exit Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
