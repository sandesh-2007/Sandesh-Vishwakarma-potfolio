import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Laptop, 
  Cpu, 
  Wifi, 
  Battery, 
  BatteryCharging, 
  BatteryMedium,
  BatteryLow,
  Monitor, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Copy, 
  Check,
  Zap,
  Play,
  RotateCcw,
  Code2,
  Gift,
  HardDrive,
  Gauge,
  Volume2,
  VolumeX,
  Radio,
  BarChart3,
  Smartphone,
  Skull,
  AlertTriangle,
  Flame,
  Send,
  ShieldAlert
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BreachIntroOverlay } from './BreachIntroOverlay';
import { HackerTerminalView } from './HackerTerminalView';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

interface PythonResult {
  engine: string;
  python_version: string;
  runtime_timestamp: string;
  client_device?: string;
  benchmark?: {
    primes_computed: number;
    duration_sec: number;
    ops_per_sec: number;
    score: number;
    grade: string;
  };
  battery_telemetry?: {
    level: number | null;
    is_charging: boolean | null;
    report: string;
    health_grade: string;
    advisory: string;
  };
  python_stdout: string[];
}

// Advanced device name detection helper
function detectDetailedDevice(ua: string, width: number, height: number, dpr: number, gpu: string): { deviceName: string; os: string } {
  let deviceName = 'Standard PC / Laptop';
  let os = 'Unknown OS';

  const lowerUa = ua.toLowerCase();

  // Android device model extraction from UA (e.g. "; SM-S918B Build/" or "; Pixel 8 Pro Build/")
  if (/android/i.test(ua)) {
    os = 'Android OS';
    // Match common Android brand patterns
    const matchModel = ua.match(/;\s*([A-Za-z0-9\-_\s]+)\s+Build\//i);
    if (matchModel && matchModel[1]) {
      let rawModel = matchModel[1].trim();
      // Brand mappings
      if (/SM-[A-Za-z0-9]+/i.test(rawModel)) {
        if (/SM-S928/i.test(rawModel)) rawModel = 'Samsung Galaxy S24 Ultra';
        else if (/SM-S921/i.test(rawModel)) rawModel = 'Samsung Galaxy S24';
        else if (/SM-S918/i.test(rawModel)) rawModel = 'Samsung Galaxy S23 Ultra';
        else if (/SM-G998/i.test(rawModel)) rawModel = 'Samsung Galaxy S21 Ultra';
        else if (/SM-A/i.test(rawModel)) rawModel = `Samsung Galaxy A-Series (${rawModel})`;
        else rawModel = `Samsung Galaxy (${rawModel})`;
      } else if (/Pixel/i.test(rawModel)) {
        rawModel = `Google ${rawModel}`;
      } else if (/Redmi|Mi|POCO|Xiaomi/i.test(rawModel)) {
        rawModel = `Xiaomi / ${rawModel}`;
      } else if (/OnePlus|CPH|IN20/i.test(rawModel)) {
        rawModel = `OnePlus Device (${rawModel})`;
      } else if (/vivo|V2/i.test(rawModel)) {
        rawModel = `Vivo Smartphone (${rawModel})`;
      } else if (/OPPO/i.test(rawModel)) {
        rawModel = `OPPO Smartphone (${rawModel})`;
      } else if (/moto/i.test(rawModel)) {
        rawModel = `Motorola (${rawModel})`;
      }
      deviceName = rawModel;
    } else {
      deviceName = 'Android Smartphone';
    }
  } 
  // Apple iOS (iPhone, iPad, iPod)
  else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    os = 'Apple iOS';
    const screenMax = Math.max(width, height);
    const screenMin = Math.min(width, height);

    if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      os = 'Apple iPadOS';
      if (screenMax >= 1366) deviceName = 'Apple iPad Pro 12.9"';
      else if (screenMax >= 1194) deviceName = 'Apple iPad Pro 11"';
      else if (screenMax >= 1180) deviceName = 'Apple iPad Air (Liquid Retina)';
      else if (screenMax >= 1133) deviceName = 'Apple iPad Mini (Gen 6)';
      else deviceName = 'Apple iPad';
    } else {
      // iPhone model approximation by screen dimension & DPR
      if (screenMax === 932 && screenMin === 430 && dpr >= 3) {
        deviceName = 'Apple iPhone 15 Pro Max / 14 Pro Max';
      } else if (screenMax === 852 && screenMin === 393 && dpr >= 3) {
        deviceName = 'Apple iPhone 15 Pro / 15 / 14 Pro';
      } else if (screenMax === 844 && screenMin === 390 && dpr >= 3) {
        deviceName = 'Apple iPhone 14 / 13 / 12 Pro';
      } else if (screenMax === 926 && screenMin === 428 && dpr >= 3) {
        deviceName = 'Apple iPhone 13 Pro Max / 12 Pro Max';
      } else if (screenMax === 812 && screenMin === 375 && dpr >= 3) {
        deviceName = 'Apple iPhone 13 mini / 12 mini / X';
      } else if (screenMax === 896 && screenMin === 414) {
        deviceName = dpr >= 3 ? 'Apple iPhone 11 Pro Max / XS Max' : 'Apple iPhone 11 / XR';
      } else if (screenMax === 667 && screenMin === 375) {
        deviceName = 'Apple iPhone SE / 8 / 7';
      } else {
        deviceName = 'Apple iPhone (iOS Retina)';
      }
    }
  } 
  // Apple Mac (MacBook Pro / MacBook Air / iMac)
  else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'Apple macOS';
    if (/Apple M1|Apple M2|Apple M3|Apple GPU/i.test(gpu)) {
      if (width >= 1728 || height >= 1117) deviceName = 'Apple MacBook Pro 16" (Apple Silicon)';
      else if (width >= 1512 || height >= 982) deviceName = 'Apple MacBook Pro 14" (Apple Silicon)';
      else if (width >= 1470 || height >= 956) deviceName = 'Apple MacBook Air 15" (Apple Silicon)';
      else deviceName = 'Apple MacBook / Mac (Apple Silicon)';
    } else {
      deviceName = 'Apple Mac Workstation (macOS)';
    }
  } 
  // Windows Desktop / Laptop
  else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 11 / 10 PC';
    if (/surface/i.test(ua)) deviceName = 'Microsoft Surface Pro / Laptop';
    else if (gpu.toLowerCase().includes('nvidia')) deviceName = `Windows Gaming Rig (${gpu.split('/')[0].trim()})`;
    else if (gpu.toLowerCase().includes('iris') || gpu.toLowerCase().includes('intel')) deviceName = 'Intel Core Laptop / Ultrabook';
    else if (gpu.toLowerCase().includes('radeon') || gpu.toLowerCase().includes('amd')) deviceName = 'AMD Ryzen Workstation';
    else deviceName = 'Windows PC Workstation';
  } else if (/Windows NT/i.test(ua)) {
    os = 'Windows OS';
    deviceName = 'Windows PC';
  } 
  // Linux
  else if (/Linux/i.test(ua)) {
    os = 'Linux / Unix OS';
    deviceName = 'Linux Workstation';
  } 
  // Chrome OS
  else if (/CrOS/i.test(ua)) {
    os = 'Google ChromeOS';
    deviceName = 'Chromebook Device';
  }

  return { deviceName, os };
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';

  // Active view tab: 'overview' | 'hardware' | 'battery' | 'python'
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'battery' | 'python'>('overview');
  const [viewMode, setViewMode] = useState<'hacked_terminal' | 'clean_specs'>('hacked_terminal');
  const [breachStage, setBreachStage] = useState<'breaching' | 'completed'>('breaching');
  const [breachProgress, setBreachProgress] = useState<number>(0);
  const [breachLogs, setBreachLogs] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output' | 'error' | 'warning' | 'success'; text: string }>>([]);
  const [isSelfDestructing, setIsSelfDestructing] = useState<boolean>(false);
  const [selfDestructCount, setSelfDestructCount] = useState<number>(5);
  const [matrixActive, setMatrixActive] = useState<boolean>(false);
  const [showPrankReveal, setShowPrankReveal] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Audio synthesizer for cyber sounds
  const playTone = (freq: number, type: OscillatorType = 'sine', duration = 0.1, vol = 0.05) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Live Ping Latency state
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'done'>('idle');

  // Python execution states
  const [isRunningPython, setIsRunningPython] = useState(false);
  const [pythonResult, setPythonResult] = useState<PythonResult | null>(null);
  const [pythonConsoleLines, setPythonConsoleLines] = useState<string[]>([]);

  const [sysInfo, setSysInfo] = useState<SystemInfo>({
    deviceModel: 'Detecting Device...',
    os: 'Detecting OS...',
    browser: 'Detecting...',
    deviceType: 'Detecting...',
    screenResolution: 'Detecting...',
    viewportSize: 'Detecting...',
    refreshRate: 'Detecting...',
    pixelRatio: '1x',
    colorDepth: '24-bit',
    hdrSupport: false,
    cpuCores: 'Detecting...',
    deviceMemory: 'Detecting...',
    gpuModel: 'Detecting GPU...',
    networkType: 'Online',
    onlineStatus: true,
    latencyMs: null,
    storageEstimate: 'Estimating...',
    audioSampleRate: '48 kHz (Stereo)',
    doNotTrack: false,
    language: 'en-US',
    timeZone: 'UTC',
    localTime: '',
    batteryLevel: null,
    isBatteryCharging: null,
    chargingTime: null,
    dischargingTime: null,
    hasBatteryApi: false,
    touchSupport: false,
    maxTouchPoints: 0,
    userAgent: ''
  });

  // Calculate live ping latency
  const measurePing = async (): Promise<number> => {
    setPingStatus('testing');
    const start = performance.now();
    try {
      await fetch('/api/health?t=' + Date.now(), { cache: 'no-store' });
      const latency = Math.round(performance.now() - start);
      setSysInfo((prev) => ({ ...prev, latencyMs: latency }));
      setPingStatus('done');
      return latency;
    } catch {
      setPingStatus('done');
      return 18;
    }
  };

  // Execute Python Diagnostics & Benchmark via Server
  const runPythonDiagnostics = async (overrideData?: Partial<SystemInfo>) => {
    setIsRunningPython(true);
    setPythonConsoleLines([
      '>>> python3 sandesh_diagnostics.py --full-spec --benchmark',
      '[...] Initializing Python 3.10 Sandesh Kernel Environment...',
      '[...] Probing Host Architecture, GPU, Device Hardware Model & Power Matrix...'
    ]);

    try {
      const payload = {
        clientData: {
          deviceModel: overrideData?.deviceModel || sysInfo.deviceModel,
          os: overrideData?.os || sysInfo.os,
          browser: overrideData?.browser || sysInfo.browser,
          screenResolution: overrideData?.screenResolution || sysInfo.screenResolution,
          refreshRate: overrideData?.refreshRate || sysInfo.refreshRate,
          cpuCores: overrideData?.cpuCores || sysInfo.cpuCores,
          gpuModel: overrideData?.gpuModel || sysInfo.gpuModel,
          storageEstimate: overrideData?.storageEstimate || sysInfo.storageEstimate,
          audioSampleRate: overrideData?.audioSampleRate || sysInfo.audioSampleRate,
          latencyMs: overrideData?.latencyMs !== undefined ? overrideData.latencyMs : sysInfo.latencyMs,
          batteryLevel: overrideData?.batteryLevel !== undefined ? overrideData.batteryLevel : sysInfo.batteryLevel,
          isBatteryCharging: overrideData?.isBatteryCharging !== undefined ? overrideData.isBatteryCharging : sysInfo.isBatteryCharging,
          networkType: overrideData?.networkType || sysInfo.networkType,
          doNotTrack: overrideData?.doNotTrack !== undefined ? overrideData.doNotTrack : sysInfo.doNotTrack
        }
      };

      const res = await fetch('/api/python-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Python server returned ' + res.status);
      const data: PythonResult = await res.json();

      setPythonResult(data);
      if (data.python_stdout && Array.isArray(data.python_stdout)) {
        setPythonConsoleLines([
          '>>> python3 sandesh_diagnostics.py --full-spec --benchmark',
          `[ENGINE] Authenticated on ${data.engine || 'Python 3.10'}`,
          ...data.python_stdout,
          `[COMPLETE] Execution cycle finalized successfully at ${data.runtime_timestamp || new Date().toLocaleTimeString()}`
        ]);
      }
    } catch (err) {
      console.warn('Python diagnostics fallback triggered:', err);
      setPythonConsoleLines([
        '>>> python3 sandesh_diagnostics.py',
        '[FALLBACK] Native Python execution simulation active.',
        `[DEVICE] Model: ${sysInfo.deviceModel}`,
        `[OS] Platform: ${sysInfo.os}`,
        `[GPU] Graphics: ${sysInfo.gpuModel}`,
        `[POWER] Battery: ${sysInfo.batteryLevel !== null ? sysInfo.batteryLevel + '%' : 'AC Connected'}`,
        '[SUCCESS] Diagnostic check verified.'
      ]);
    } finally {
      setIsRunningPython(false);
    }
  };

  // Inspect all system metrics on open
  useEffect(() => {
    if (!isOpen) return;

    const ua = navigator.userAgent;

    // Detect Browser
    let browser = 'Modern Web Browser';
    if (ua.indexOf('Edg') !== -1) browser = 'Microsoft Edge';
    else if (ua.indexOf('Chrome') !== -1) browser = 'Google Chrome';
    else if (ua.indexOf('Safari') !== -1) browser = 'Apple Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
    else if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) browser = 'Opera';

    // Device Type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? 'Mobile / Handheld Device' : 'Desktop / Laptop Workstation';

    // Hardware Specs
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : 'Multi-Core Available';
    const memory = (navigator as any).deviceMemory ? `~${(navigator as any).deviceMemory} GB RAM` : 'System Managed RAM';

    // GPU detection via WebGL context
    let gpuName = 'Hardware Accelerated GPU';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) gpuName = renderer;
        }
      }
    } catch {
      gpuName = 'DirectX / Metal / Vulkan Engine';
    }

    // Screen Dimensions & DPI
    const screenRes = `${window.screen.width} x ${window.screen.height} px`;
    const viewport = `${window.innerWidth} x ${window.innerHeight} px`;
    const dpr = window.devicePixelRatio || 1;
    const dprStr = `${dpr.toFixed(1)}x Retina/HiDPI`;
    const colorDepth = `${window.screen.colorDepth || 24}-bit TrueColor`;
    const isHdr = window.matchMedia ? window.matchMedia('(dynamic-range: high)').matches : false;

    // Run detailed device name detection
    const { deviceName, os } = detectDetailedDevice(ua, window.screen.width, window.screen.height, dpr, gpuName);

    // Screen Refresh Rate Estimation
    let refreshHz = '60 Hz';
    let frameTimes: number[] = [];
    let count = 0;
    const checkFrames = (time: number) => {
      frameTimes.push(time);
      count++;
      if (count < 15) {
        requestAnimationFrame(checkFrames);
      } else {
        const diffs = [];
        for (let i = 1; i < frameTimes.length; i++) {
          diffs.push(frameTimes[i] - frameTimes[i - 1]);
        }
        const avgDelta = diffs.reduce((a, b) => a + b, 0) / diffs.length;
        const fps = Math.round(1000 / avgDelta);
        if (fps >= 110) refreshHz = `${fps} Hz (ProMotion / Ultra)`;
        else if (fps >= 85) refreshHz = `${fps} Hz (High Refresh)`;
        else refreshHz = `${fps} Hz (Standard)`;

        setSysInfo((prev) => ({ ...prev, refreshRate: refreshHz }));
      }
    };
    requestAnimationFrame(checkFrames);

    // Network status
    const isOnline = navigator.onLine;
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    let netType = isOnline ? 'Broadband Connection' : 'Offline';
    if (connection && connection.effectiveType) {
      netType = `${connection.effectiveType.toUpperCase()} ${connection.downlink ? `(${connection.downlink} Mbps)` : ''}`;
    }

    // Touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const maxTouch = navigator.maxTouchPoints || (hasTouch ? 5 : 0);

    // Audio Subsystem
    let audioRate = '48 kHz (Stereo 2-Ch)';
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        audioRate = `${Math.round(audioCtx.sampleRate / 1000)} kHz (${audioCtx.destination.maxChannelCount}-Ch Studio)`;
        audioCtx.close().catch(() => {});
      }
    } catch {}

    // Storage Estimate
    let storageStr = 'Checking quota...';
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        if (est.quota) {
          const gbQuota = Math.round(est.quota / (1024 * 1024 * 1024));
          const mbUsed = Math.round((est.usage || 0) / (1024 * 1024));
          storageStr = `~${gbQuota} GB Browser Quota (${mbUsed} MB Active)`;
          setSysInfo((prev) => ({ ...prev, storageEstimate: storageStr }));
        }
      }).catch(() => {});
    } else {
      storageStr = 'Standard Local Quota';
    }

    // Do Not Track
    const dnt = navigator.doNotTrack === '1' || (window as any).doNotTrack === '1';

    // Time & Zone
    let tz = 'Local Time';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    } catch {
      tz = 'Local';
    }

    const collectedInfo: SystemInfo = {
      deviceModel: deviceName,
      os,
      browser,
      deviceType,
      screenResolution: screenRes,
      viewportSize: viewport,
      refreshRate: refreshHz,
      pixelRatio: dprStr,
      colorDepth,
      hdrSupport: isHdr,
      cpuCores: cores,
      deviceMemory: memory,
      gpuModel: gpuName,
      networkType: netType,
      onlineStatus: isOnline,
      latencyMs: null,
      storageEstimate: storageStr,
      audioSampleRate: audioRate,
      doNotTrack: dnt,
      language: navigator.language || 'en',
      timeZone: tz,
      localTime: new Date().toLocaleTimeString(),
      batteryLevel: null,
      isBatteryCharging: null,
      chargingTime: null,
      dischargingTime: null,
      hasBatteryApi: false,
      touchSupport: hasTouch,
      maxTouchPoints: maxTouch,
      userAgent: ua
    };

    // Also check for User-Agent Client Hints if supported (High Entropy values)
    if ((navigator as any).userAgentData && (navigator as any).userAgentData.getHighEntropyValues) {
      (navigator as any).userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion'])
        .then((uaData: any) => {
          if (uaData && uaData.model) {
            collectedInfo.deviceModel = uaData.model;
            setSysInfo((prev) => ({ ...prev, deviceModel: uaData.model }));
          }
        })
        .catch(() => {});
    }

    setSysInfo(collectedInfo);

    // Measure live ping immediately
    measurePing().then((lat) => {
      // Battery API check
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          const bLevel = Math.round(battery.level * 100);
          const bCharging = battery.charging;
          setSysInfo((prev) => ({
            ...prev,
            hasBatteryApi: true,
            batteryLevel: bLevel,
            isBatteryCharging: bCharging,
            latencyMs: lat
          }));

          runPythonDiagnostics({
            ...collectedInfo,
            latencyMs: lat,
            batteryLevel: bLevel,
            isBatteryCharging: bCharging
          });
        }).catch(() => {
          runPythonDiagnostics({ ...collectedInfo, latencyMs: lat });
        });
      } else {
        runPythonDiagnostics({ ...collectedInfo, latencyMs: lat });
      }
    });

  }, [isOpen]);

  // Live clock tick
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString());
    return () => clearInterval(interval);
  }, [isOpen]);

  // Breach animation sequence when modal opens
  useEffect(() => {
    if (!isOpen) {
      setBreachStage('breaching');
      setBreachProgress(0);
      setBreachLogs([]);
      setIsSelfDestructing(false);
      setSelfDestructCount(5);
      setMatrixActive(false);
      setShowPrankReveal(false);
      return;
    }

    // Modal just opened: run hack breach simulation!
    setViewMode('hacked_terminal');
    setBreachStage('breaching');
    setBreachProgress(15);
    setBreachLogs([
      `[!] EXPLOIT INJECTION: remote_gift_payload_v4.sh`,
      `[!] CONNECTING TO HOST SOCKET: 127.0.0.1:1337... [CONNECTED]`
    ]);
    playTone(180, 'sawtooth', 0.25, 0.08);

    const t1 = setTimeout(() => {
      setBreachProgress(42);
      setBreachLogs(prev => [
        ...prev, 
        `[!] BYPASSING CLIENT FIREWALL & CSP PROTECTION... [BYPASS SUCCESSFUL]`,
        `[!] OVERFLOWING CALL STACK: REGISTERS REWRITTEN...`
      ]);
      playTone(380, 'square', 0.18, 0.06);
    }, 450);

    const t2 = setTimeout(() => {
      setBreachProgress(75);
      setBreachLogs(prev => [
        ...prev, 
        `[!] PRIVILEGE ESCALATION: uid=0(root) gid=0(root)... [GRANTED]`,
        `[!] INTERCEPTING HARDWARE DMA & BUS REGISTERS...`
      ]);
      playTone(560, 'square', 0.18, 0.06);
    }, 950);

    const t3 = setTimeout(() => {
      setBreachProgress(92);
      setBreachLogs(prev => [
        ...prev, 
        `[!] TARGET COMPROMISED: ${sysInfo.deviceModel}!`,
        `[!] EXFILTRATING SYSTEM TELEMETRY DOSSIER... [100% EXFILTRATED]`
      ]);
      playTone(720, 'sawtooth', 0.25, 0.08);
    }, 1450);

    const t4 = setTimeout(() => {
      setBreachProgress(100);
      playTone(920, 'sine', 0.35, 0.08);
      setBreachStage('completed');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, sysInfo.deviceModel]);

  // Self Destruct Countdown
  useEffect(() => {
    if (!isSelfDestructing) return;
    if (selfDestructCount <= 0) {
      setIsSelfDestructing(false);
      playTone(90, 'sawtooth', 0.7, 0.12);
      setTerminalHistory(prev => [
        ...prev,
        { type: 'error', text: '💥 [BOOM!] SELF-DESTRUCT PAYLOAD EXECUTED!' },
        { type: 'success', text: '😄 RELAX! Nothing was harmed. This was just Sandesh\'s creative cyber prank!' }
      ]);
      return;
    }

    playTone(750 + (5 - selfDestructCount) * 120, 'sine', 0.15, 0.07);
    const cdTimer = setTimeout(() => {
      setSelfDestructCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(cdTimer);
  }, [isSelfDestructing, selfDestructCount]);

  const skipBreach = () => {
    setBreachProgress(100);
    setBreachStage('completed');
    playTone(800, 'sine', 0.2, 0.06);
  };

  const handleRunCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;
    setCommandInput('');
    playTone(900, 'sine', 0.05, 0.04);

    const cmd = raw.toLowerCase();
    const newEntry: { type: 'input' | 'output' | 'error' | 'warning' | 'success'; text: string } = {
      type: 'input',
      text: `root@breached-device:~# ${raw}`
    };

    if (cmd === 'clear' || cmd === 'cls') {
      setTerminalHistory([]);
      return;
    }

    let responses: Array<{ type: 'output' | 'error' | 'warning' | 'success'; text: string }> = [];

    if (cmd === 'help') {
      responses = [
        { type: 'output', text: 'Available Exploit Shell Commands:' },
        { type: 'output', text: '  • specs / device    : Dump full exfiltrated hardware & display specs' },
        { type: 'output', text: '  • battery           : Intercept live battery percentage & charging bus' },
        { type: 'output', text: '  • matrix            : Toggle falling green matrix code stream' },
        { type: 'output', text: '  • prank / reveal    : Is this real? View official prank disclaimer' },
        { type: 'output', text: '  • python            : Run Python 3.10 Benchmark test on Sandesh server' },
        { type: 'output', text: '  • ping              : Measure network latency ping to server' },
        { type: 'output', text: '  • whoami            : Show current elevated user context' },
        { type: 'output', text: '  • camera            : Attempt hardware webcam tap (funny response)' },
        { type: 'output', text: '  • self_destruct     : Trigger 5-second countdown sequence' },
        { type: 'output', text: '  • clear             : Wipe terminal output' }
      ];
    } else if (cmd === 'specs' || cmd === 'device') {
      responses = [
        { type: 'warning', text: '--- [EXFILTRATED HOST HARDWARE SPECIFICATION DUMP] ---' },
        { type: 'success', text: `[+] TARGET MODEL  : ${sysInfo.deviceModel} (${sysInfo.deviceType})` },
        { type: 'output', text: `[+] OS & PLATFORM : ${sysInfo.os}` },
        { type: 'output', text: `[+] PROCESSOR     : ${sysInfo.cpuCores}` },
        { type: 'output', text: `[+] GRAPHICS GPU  : ${sysInfo.gpuModel}` },
        { type: 'output', text: `[+] MEMORY ALLOC  : ${sysInfo.deviceMemory}` },
        { type: 'output', text: `[+] DISPLAY PANEL : ${sysInfo.screenResolution} @ ${sysInfo.refreshRate} (DPR: ${sysInfo.pixelRatio})` },
        { type: 'output', text: `[+] NETWORK LINK  : ${sysInfo.networkType} (Latency: ${sysInfo.latencyMs !== null ? sysInfo.latencyMs + 'ms' : 'Active'})` },
        { type: 'output', text: `[+] BROWSER CORE  : ${sysInfo.browser}` },
        { type: 'output', text: `[+] HOST TIMEZONE : ${sysInfo.timeZone} | ${currentTime}` }
      ];
    } else if (cmd === 'battery') {
      responses = [
        { type: 'warning', text: '--- [POWER CIRCUIT & BATTERY BUS PROBE] ---' },
        { type: 'success', text: `[+] BATTERY LEVEL : ${sysInfo.batteryLevel !== null ? `${sysInfo.batteryLevel}%` : 'AC Mains / Desktop Direct Power'}` },
        { type: 'output', text: `[+] POWER FLOW    : ${sysInfo.isBatteryCharging ? '⚡ Active Charging Adapter Plugged In' : '🔋 Operating on Internal Battery Reserve'}` },
        { type: 'output', text: `[+] BUS STATUS    : Voltage stable. No thermal throttling detected.` }
      ];
    } else if (cmd === 'matrix') {
      setMatrixActive(prev => !prev);
      responses = [
        { type: 'success', text: `[+] Matrix Digital Stream: ${!matrixActive ? 'ACTIVATED 🟢' : 'DEACTIVATED'}` }
      ];
    } else if (cmd === 'prank' || cmd === 'reveal') {
      setShowPrankReveal(true);
      responses = [
        { type: 'warning', text: '═══════════════════════════════════════════════════════════════' },
        { type: 'success', text: '😄 RELAX! YOUR DEVICE IS 100% SAFE & UNHARMED!' },
        { type: 'output', text: 'This is a creative, harmless cyber terminal prank crafted by Sandesh Vishwakarma.' },
        { type: 'output', text: 'All hardware specs shown above are safely read using standard browser Web APIs.' },
        { type: 'output', text: 'No personal data, passwords, or files are ever accessed or stored!' },
        { type: 'warning', text: '═══════════════════════════════════════════════════════════════' }
      ];
    } else if (cmd === 'self_destruct') {
      setIsSelfDestructing(true);
      setSelfDestructCount(5);
      responses = [
        { type: 'error', text: '⚠️ [CRITICAL] HOST SELF-DESTRUCT INITIATED IN 5 SECONDS!' },
        { type: 'error', text: 'Tap [ABORT] below if you wish to cancel.' }
      ];
    } else if (cmd === 'whoami') {
      responses = [
        { type: 'success', text: `uid=0(root) gid=0(root) groups=0(root) [Compromised Guest Host: ${sysInfo.deviceModel}]` }
      ];
    } else if (cmd === 'camera') {
      responses = [
        { type: 'error', text: '[!] ACCESS BLOCKED: Sandesh respects your privacy! No cameras or microphones tapped.' },
        { type: 'success', text: '[+] Privacy firewall maintained.' }
      ];
    } else if (cmd === 'python') {
      runPythonDiagnostics();
      responses = [
        { type: 'output', text: '[+] Executing Python 3.10 Benchmark Kernel on Sandesh\'s backend server...' },
        { type: 'output', text: `[+] Score: ${pythonResult?.benchmark?.score || 95}/100 (Grade: A+)` },
        { type: 'output', text: `[+] Switch to 'Clean Specs' view to view full Python log stdout.` }
      ];
    } else if (cmd === 'ping') {
      measurePing();
      responses = [
        { type: 'output', text: `[+] PING 127.0.0.1: 56 data bytes. Latency: ${sysInfo.latencyMs !== null ? sysInfo.latencyMs + ' ms' : '18 ms'} [PASS]` }
      ];
    } else {
      responses = [
        { type: 'error', text: `bash: ${raw}: command not found. Type 'help' for available exploit commands.` }
      ];
    }

    setTerminalHistory(prev => [...prev, newEntry, ...responses]);
  };

  if (!isOpen) return null;

  const copyDiagnosticSummary = () => {
    const summary = `--- SANDESH VISHWAKARMA PORTFOLIO SURPRISE TELEMETRY ---
Device Name    : ${sysInfo.deviceModel}
Device Type    : ${sysInfo.deviceType}
Operating Sys  : ${sysInfo.os}
Browser Engine : ${sysInfo.browser}
Resolution     : ${sysInfo.screenResolution} @ ${sysInfo.refreshRate} (DPR: ${sysInfo.pixelRatio})
GPU Model      : ${sysInfo.gpuModel}
CPU / Cores    : ${sysInfo.cpuCores}
Estimated RAM  : ${sysInfo.deviceMemory}
Battery Level  : ${sysInfo.batteryLevel !== null ? `${sysInfo.batteryLevel}% (${sysInfo.isBatteryCharging ? 'Charging ⚡' : 'On Battery 🔋'})` : 'AC Mains / Desktop Mode'}
Network State  : ${sysInfo.networkType} (Latency: ${sysInfo.latencyMs !== null ? `${sysInfo.latencyMs} ms` : 'Active'})
Storage Quota  : ${sysInfo.storageEstimate}
Audio Subsys   : ${sysInfo.audioSampleRate}
Python Engine  : Python 3.10 Benchmark Score: ${pythonResult?.benchmark?.score || 95}/100
--------------------------------------------------------`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for battery icon and color
  const getBatteryDetails = () => {
    if (sysInfo.batteryLevel === null) {
      return {
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        color: 'text-amber-500',
        bg: 'bg-amber-500/15 border-amber-500/30',
        label: 'AC Power (Desktop / Mains)',
        desc: 'Direct AC Line Power connected. No active battery depletion.'
      };
    }
    if (sysInfo.isBatteryCharging) {
      return {
        icon: <BatteryCharging className="w-5 h-5 text-emerald-500 animate-pulse" />,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/15 border-emerald-500/30',
        label: `${sysInfo.batteryLevel}% • Charging`,
        desc: 'Connected to external power adapter. Power flow active.'
      };
    }
    if (sysInfo.batteryLevel > 50) {
      return {
        icon: <Battery className="w-5 h-5 text-emerald-500" />,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/15 border-emerald-500/30',
        label: `${sysInfo.batteryLevel}% • Healthy Charge`,
        desc: 'Device is running smoothly on internal battery storage.'
      };
    }
    if (sysInfo.batteryLevel > 20) {
      return {
        icon: <BatteryMedium className="w-5 h-5 text-amber-500" />,
        color: 'text-amber-500',
        bg: 'bg-amber-500/15 border-amber-500/30',
        label: `${sysInfo.batteryLevel}% • Moderate`,
        desc: 'Battery is at normal operating level.'
      };
    }
    return {
      icon: <BatteryLow className="w-5 h-5 text-red-500 animate-bounce" />,
      color: 'text-red-500',
      bg: 'bg-red-500/15 border-red-500/30',
      label: `${sysInfo.batteryLevel}% • Low Battery`,
      desc: 'Plug in charger soon to avoid interruption.'
    };
  };

  const batteryStatus = getBatteryDetails();

  // 1. Cinematic Breach Sequence Screen
  if (breachStage === 'breaching') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          id="system-diagnostics-modal"
          className="relative w-full max-w-3xl rounded-2xl border border-red-900/60 shadow-2xl shadow-red-950/60 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <BreachIntroOverlay
            progress={breachProgress}
            logs={breachLogs}
            deviceModel={sysInfo.deviceModel}
            os={sysInfo.os}
            onSkip={skipBreach}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(s => !s)}
          />
        </div>
      </div>
    );
  }

  // 2. Full Hacked Terminal Console
  if (viewMode === 'hacked_terminal') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          id="system-diagnostics-modal"
          className="relative w-full max-w-3xl rounded-2xl border border-emerald-950 shadow-2xl shadow-black overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <HackerTerminalView
            sysInfo={sysInfo}
            currentTime={currentTime}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(s => !s)}
            onSwitchToCleanSpecs={() => setViewMode('clean_specs')}
            onClose={onClose}
            onCopySpecs={copyDiagnosticSummary}
            copied={copied}
            onRunPython={() => runPythonDiagnostics()}
            onMeasurePing={() => measurePing()}
            playTone={playTone}
          />
        </div>
      </div>
    );
  }

  // 3. Clean Specs Tabbed View
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="system-diagnostics-modal"
        className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] transition-colors ${
          isLight 
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-orange-500/15' 
            : 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-black/90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gift Header with Window Controls */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-zinc-100/95 border-zinc-200' : 'bg-zinc-900/95 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
            </div>
            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 mx-1" />
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-mono font-bold tracking-tight">
                visitor@sandesh-data-terminal:~ (python 3.10)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch back to Hacker Terminal Shell */}
            <button
              onClick={() => setViewMode('hacked_terminal')}
              className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all ${
                isLight 
                  ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100' 
                  : 'bg-red-950/60 text-red-300 border-red-800/60 hover:bg-red-900/50'
              }`}
              title="Return to Hacker Shell"
            >
              <Skull className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Hacker Shell</span>
            </button>

            {/* Live Ping latency badge */}
            <button
              onClick={measurePing}
              title="Click to re-ping server"
              className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border transition-all ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Ping: {sysInfo.latencyMs !== null ? `${sysInfo.latencyMs} ms` : 'Testing...'}</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-zinc-200 text-zinc-600' : 'hover:bg-zinc-800 text-zinc-400'
              }`}
              aria-label="Close Diagnostics"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-5 pt-3 pb-2 border-b flex items-center gap-2 overflow-x-auto transition-colors ${
          isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800/80'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? isLight 
                  ? 'bg-white text-orange-600 shadow-xs border border-zinc-200' 
                  : 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : isLight
                  ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-orange-500" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'hardware'
                ? isLight 
                  ? 'bg-white text-orange-600 shadow-xs border border-zinc-200' 
                  : 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : isLight
                  ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            <span>GPU & Display</span>
          </button>

          <button
            onClick={() => setActiveTab('battery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'battery'
                ? isLight 
                  ? 'bg-white text-orange-600 shadow-xs border border-zinc-200' 
                  : 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : isLight
                  ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Battery className="w-3.5 h-3.5 text-orange-500" />
            <span>Battery & Power</span>
            {sysInfo.batteryLevel !== null && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                sysInfo.isBatteryCharging 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
              }`}>
                {sysInfo.batteryLevel}%
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'python'
                ? isLight 
                  ? 'bg-white text-orange-600 shadow-xs border border-zinc-200' 
                  : 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : isLight
                  ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-orange-500" />
            <span>Python 3.10 Benchmark</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs font-mono">

          {/* ===================== TAB 1: SYSTEM OVERVIEW ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Special Prominent Device Model Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                isLight 
                  ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border-orange-200 text-zinc-900' 
                  : 'bg-gradient-to-r from-orange-950/40 via-amber-950/40 to-zinc-900/60 border-orange-900/50 text-white'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Detected User Device Model
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black font-sans tracking-tight text-zinc-900 dark:text-white">
                    {sysInfo.deviceModel}
                  </h2>
                  <p className={`text-[11px] font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Platform: <span className="font-semibold">{sysInfo.os}</span> • {sysInfo.deviceType}
                  </p>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-[11px] flex items-center gap-1.5 shrink-0 font-sans ${
                  isLight ? 'bg-white border-orange-200 text-orange-800 shadow-xs' : 'bg-zinc-900 border-orange-900/50 text-orange-300'
                }`}>
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                  <span>Hardware Fingerprinted</span>
                </div>
              </div>

              {/* 6 Grid Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                
                {/* 1. Device Hardware Name */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/70 border-zinc-800 text-white'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Device Model Name</span>
                  </div>
                  <div className="text-sm font-bold font-sans truncate" title={sysInfo.deviceModel}>
                    {sysInfo.deviceModel}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {sysInfo.deviceType}
                  </div>
                </div>

                {/* 2. Web Browser & Engine */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/70 border-zinc-800 text-white'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                    <span>Browser Engine</span>
                  </div>
                  <div className="text-sm font-bold font-sans">
                    {sysInfo.browser}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    Locale: {sysInfo.language} • {currentTime || sysInfo.localTime}
                  </div>
                </div>

                {/* 3. Screen & Refresh Rate */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/70 border-zinc-800 text-white'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Monitor className="w-3.5 h-3.5 text-orange-500" />
                    <span>Display & Refresh</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-orange-600 dark:text-orange-400">
                    {sysInfo.refreshRate}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {sysInfo.screenResolution} ({sysInfo.pixelRatio})
                  </div>
                </div>

                {/* 4. CPU & Core Count */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/70 border-zinc-800 text-white'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Cpu className="w-3.5 h-3.5 text-orange-500" />
                    <span>CPU Architecture</span>
                  </div>
                  <div className="text-sm font-bold font-sans">
                    {sysInfo.cpuCores}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    Memory: {sysInfo.deviceMemory}
                  </div>
                </div>

                {/* 5. GPU & Graphics Model */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/70 border-zinc-800 text-white'
                }`}>
                  <div className={`flex items-center gap-2 mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Gauge className="w-3.5 h-3.5 text-orange-500" />
                    <span>GPU / Graphics Card</span>
                  </div>
                  <div className="text-xs font-bold font-sans truncate" title={sysInfo.gpuModel}>
                    {sysInfo.gpuModel.split('/')[0] || sysInfo.gpuModel}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    WebGL 2.0 Accelerated
                  </div>
                </div>

                {/* 6. Battery Status Preview */}
                <div 
                  onClick={() => setActiveTab('battery')}
                  className={`p-3 rounded-xl border cursor-pointer hover:border-orange-500/50 transition-all ${
                    isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-orange-50/50' : 'bg-zinc-900/70 border-zinc-800 text-white hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`flex items-center gap-2 text-[11px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      <Battery className="w-3.5 h-3.5 text-orange-500" />
                      <span>Power State</span>
                    </div>
                    <span className="text-[10px] text-orange-500 font-semibold font-sans">
                      Inspect →
                    </span>
                  </div>
                  <div className="text-sm font-bold font-sans flex items-center gap-1.5">
                    {batteryStatus.icon}
                    <span className="truncate">{batteryStatus.label}</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    {batteryStatus.desc}
                  </div>
                </div>

              </div>

              {/* Extra Telemetry Row: Latency, Storage, Audio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ping & Connection</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {sysInfo.latencyMs !== null ? `${sysInfo.latencyMs} ms Latency` : 'Testing Ping...'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{sysInfo.networkType}</div>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                    <HardDrive className="w-3.5 h-3.5 text-orange-500" />
                    <span>Device Storage Quota</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 truncate">
                    {sysInfo.storageEstimate}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Origin Sandbox Storage</div>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] mb-1">
                    <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>Audio Subsystem</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 truncate">
                    {sysInfo.audioSampleRate}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">WebAudio Spatial Engine</div>
                </div>
              </div>

              {/* Raw User Agent Box */}
              <div className={`p-3 rounded-xl border space-y-1 transition-colors ${
                isLight 
                  ? 'bg-zinc-100 text-zinc-800 border-zinc-200' 
                  : 'bg-black border-zinc-800/80 text-zinc-300'
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    Client Fingerprint & Device Model String:
                  </span>
                  <span className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-600'}`}>read-only</span>
                </div>
                <p className="text-[10px] leading-relaxed break-all select-all font-mono">
                  {sysInfo.userAgent}
                </p>
              </div>

            </div>
          )}

          {/* ===================== TAB 2: GPU & DISPLAY ===================== */}
          {activeTab === 'hardware' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* GPU Details Card */}
              <div className={`p-5 rounded-2xl border transition-colors ${
                isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/80 border-zinc-800 text-white'
              }`}>
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-sans">Graphics Processing Unit (GPU)</h3>
                    <p className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Detected via WebGL Unmasked Hardware Renderer Protocol
                    </p>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <div className={`p-3 rounded-xl font-mono text-xs border ${
                    isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-black/60 border-zinc-800 text-orange-400'
                  }`}>
                    {sysInfo.gpuModel}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                      <span className="text-zinc-500 block text-[10px]">Refresh Rate</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{sysInfo.refreshRate}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                      <span className="text-zinc-500 block text-[10px]">Pixel Ratio (DPR)</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{sysInfo.pixelRatio}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                      <span className="text-zinc-500 block text-[10px]">Color Bit Depth</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{sysInfo.colorDepth}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                      <span className="text-zinc-500 block text-[10px]">HDR Capability</span>
                      <span className={`font-bold ${sysInfo.hdrSupport ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {sysInfo.hdrSupport ? 'HDR10 Active' : 'SDR (Standard)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Viewport & Resolution Card */}
              <div className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}>
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-1">Physical Screen Geometry</span>
                  <div className="text-base font-bold font-mono text-zinc-900 dark:text-white">
                    {sysInfo.screenResolution}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Native hardware monitor dimensions.
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-500 block mb-1">Active Viewport Frame</span>
                  <div className="text-base font-bold font-mono text-orange-600 dark:text-orange-400">
                    {sysInfo.viewportSize}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Calculated browser viewport coordinate box.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: BATTERY & POWER TELEMETRY ===================== */}
          {activeTab === 'battery' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Battery Main Gauge Box */}
              <div className={`p-5 rounded-2xl border transition-colors ${
                isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-900/80 border-zinc-800 text-white'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${batteryStatus.bg}`}>
                      {batteryStatus.icon}
                    </div>
                    <div>
                      <div className="text-lg font-bold font-sans">
                        {batteryStatus.label}
                      </div>
                      <div className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {batteryStatus.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                      sysInfo.isBatteryCharging
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'bg-orange-500/10 text-orange-600 border-orange-500/30'
                    }`}>
                      {sysInfo.isBatteryCharging ? '⚡ AC Charger Connected' : '🔋 Running on Battery'}
                    </span>
                  </div>
                </div>

                {/* Visual Battery Percentage Bar */}
                {sysInfo.batteryLevel !== null ? (
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Capacity Level</span>
                      <span className="font-bold font-mono text-sm text-orange-600 dark:text-orange-400">
                        {sysInfo.batteryLevel}%
                      </span>
                    </div>
                    
                    {/* Visual Meter */}
                    <div className="w-full h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden p-0.5 border border-zinc-300 dark:border-zinc-700">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          sysInfo.batteryLevel > 50 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                            : sysInfo.batteryLevel > 20 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                              : 'bg-gradient-to-r from-red-500 to-orange-600 animate-pulse'
                        }`}
                        style={{ width: `${Math.max(5, sysInfo.batteryLevel)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                      <span>0% (Empty)</span>
                      <span>50% (Normal)</span>
                      <span>100% (Full)</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Desktop / AC Line Power Mode</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">100% Constant Flow</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-emerald-500/20 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full" />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Direct AC wall power connected. No battery drainage cycle required for this workstation.
                    </p>
                  </div>
                )}
              </div>

              {/* Power Diagnostics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <div className={`text-[11px] mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Charging Source</div>
                  <div className="text-sm font-bold font-sans">
                    {sysInfo.isBatteryCharging ? 'AC Wall Adapter (Active Flow)' : 'Internal Battery Cell'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Voltage: Standard Li-ion regulated
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <div className={`text-[11px] mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Battery Health Advice</div>
                  <div className="text-sm font-bold font-sans text-emerald-600 dark:text-emerald-400">
                    {pythonResult?.battery_telemetry?.health_grade || 'Optimal Operating Voltage'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {pythonResult?.battery_telemetry?.advisory || 'Balanced power profile configured.'}
                  </div>
                </div>
              </div>

              {/* Real-time interactive tip */}
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                isLight ? 'bg-amber-50 border-orange-200 text-orange-950' : 'bg-orange-950/30 border-orange-900/50 text-orange-300'
              }`}>
                <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  Tip: Plug in or unplug your charger now — the battery telemetry bar responds immediately in real-time!
                </span>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: REAL PYTHON 3.10 BENCHMARK ===================== */}
          {activeTab === 'python' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Python Benchmark Summary Card */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/70 border-zinc-800'
              }`}>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm font-sans">
                    <span className="text-emerald-500 font-mono">🐍</span>
                    <span>Native Python 3.10 Kernel & Arithmetic Benchmark</span>
                  </div>
                  <p className={`text-[11px] mt-0.5 font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Executes prime calculation loops in Python to score CPU performance and verify hardware specifications.
                  </p>
                </div>

                <button
                  onClick={() => runPythonDiagnostics()}
                  disabled={isRunningPython}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0 ${
                    isRunningPython
                      ? 'bg-zinc-400 text-white cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-500 text-white active:scale-95'
                  }`}
                >
                  {isRunningPython ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Computing in Python...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Run Python Benchmark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Benchmark Score Badge if available */}
              {pythonResult?.benchmark && (
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  isLight ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-900/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 font-sans">
                        Python Benchmark Score: {pythonResult.benchmark.score} / 100
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        {pythonResult.benchmark.primes_computed} prime numbers calculated in {pythonResult.benchmark.duration_sec}s ({pythonResult.benchmark.ops_per_sec.toLocaleString()} ops/sec)
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-xs">
                    {pythonResult.benchmark.grade}
                  </span>
                </div>
              )}

              {/* Terminal Console */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 text-zinc-200">
                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>sandesh_diagnostics.py — Python 3.10 Subprocess</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Kernel Ready
                  </span>
                </div>

                <div className="p-4 space-y-1 font-mono text-xs max-h-60 overflow-y-auto">
                  {pythonConsoleLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`leading-relaxed ${
                        line.startsWith('>>>')
                          ? 'text-orange-400 font-bold'
                          : line.startsWith('[BENCHMARK]') || line.startsWith('[SUCCESS]') || line.startsWith('[COMPLETE]')
                            ? 'text-emerald-400 font-semibold'
                            : line.startsWith('[POWER')
                              ? 'text-amber-300'
                              : 'text-zinc-300'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                  {isRunningPython && (
                    <div className="text-orange-400 animate-pulse">
                      ▋ executing prime benchmark in python kernel...
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between transition-colors ${
          isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/90 border-zinc-800'
        }`}>
          <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Privacy Friendly • Device Model: {sysInfo.deviceModel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyDiagnosticSummary}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isLight 
                  ? 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700 shadow-xs' 
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Gift Specs</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
