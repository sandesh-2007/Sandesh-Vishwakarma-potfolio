import React, { useState } from 'react';
import {
  Code2,
  Database,
  Terminal,
  Cpu,
  Layers,
  Palette,
  Bot,
  Globe,
  Server,
  GitBranch,
  FileCode2,
  Sparkles,
} from 'lucide-react';
import { SkillItem } from '../types';

export const SKILL_ICON_PRESETS = [
  { value: 'React', label: 'React' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'HTML', label: 'HTML5' },
  { value: 'CSS', label: 'CSS3' },
  { value: 'Tailwind', label: 'Tailwind CSS' },
  { value: 'Supabase', label: 'Supabase' },
  { value: 'Git', label: 'Git' },
  { value: 'GitHub', label: 'GitHub' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Code2', label: 'Code / Generic' },
  { value: 'Database', label: 'Database' },
  { value: 'Terminal', label: 'Terminal / CLI' },
  { value: 'Globe', label: 'Web / Cloud' },
  { value: 'Server', label: 'Backend / Server' },
  { value: 'Cpu', label: 'Systems / Hardware' },
  { value: 'Layers', label: 'Architecture' },
  { value: 'Palette', label: 'Design / UI' },
  { value: 'Bot', label: 'AI / Automation' },
] as const;

interface SkillIconProps {
  skill: Pick<SkillItem, 'name' | 'icon' | 'iconUrl'>;
  className?: string;
}

export const SkillIcon: React.FC<SkillIconProps> = ({ skill, className = 'w-6 h-6' }) => {
  const [imgError, setImgError] = useState(false);

  if (skill.iconUrl && !imgError) {
    return (
      <img
        src={skill.iconUrl}
        alt={`${skill.name} icon`}
        className={`${className} object-contain select-none`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  const key = (skill.icon || skill.name || '').toLowerCase().trim();
  const nameKey = (skill.name || '').toLowerCase().trim();
  const matcher = key || nameKey;

  if (matcher === 'react' || matcher === 'atom' || nameKey.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)" />
      </svg>
    );
  }

  if (matcher === 'javascript' || matcher === 'js' || nameKey.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" />
        <path d="M10.5 10.5v5.2a1.8 1.8 0 0 1-3.4.7" strokeLinecap="square" />
        <path d="M17.2 11.4c-.5-.7-1.3-1-2.1-.9-.9.1-1.6.7-1.6 1.5 0 .9.7 1.3 1.9 1.7 1.3.4 2 .9 2 2 0 1.2-1 2-2.4 2-1.1 0-2-.5-2.5-1.3" strokeLinecap="square" />
      </svg>
    );
  }

  if (matcher === 'typescript' || matcher === 'ts' || nameKey.includes('typescript')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" />
        <path d="M6.2 10.6h5.2M8.8 10.6v7" strokeLinecap="square" />
        <path d="M17.6 11.5c-.5-.7-1.3-1-2.1-.9-.9.1-1.6.7-1.6 1.5 0 .9.7 1.3 1.9 1.7 1.3.4 2 .9 2 2 0 1.2-1 2-2.4 2-1.1 0-2-.5-2.5-1.3" strokeLinecap="square" />
      </svg>
    );
  }

  if (matcher === 'python' || nameKey.includes('python')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M11.8 3C8.5 3 8.8 4.4 8.8 4.4V6.8h4.7v.9H6.3S3 7.3 3 11.8s2.8 4.5 2.8 4.5h1.7v-2.1s-.1-2.8 2.7-2.8h4.6s2.6 0 2.6-2.5V5.4S17.8 3 11.8 3z" strokeLinejoin="round" />
        <circle cx="9.8" cy="5.1" r="0.8" fill="currentColor" stroke="none" />
        <path d="M12.2 21c3.3 0 3-1.4 3-1.4v-2.4h-4.7v-.9h7.2s3.3.4 3.3-4.1-2.8-4.5-2.8-4.5h-1.7v2.1s.1 2.8-2.7 2.8H9.2s-2.6 0-2.6 2.5v3.5S6.2 21 12.2 21z" strokeLinejoin="round" />
        <circle cx="14.2" cy="18.9" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (matcher === 'html' || matcher === 'html5' || matcher === 'filecode2' || nameKey === 'html') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M4 3h16l-1.5 15.2L12 21l-6.5-2.8L4 3z" strokeLinejoin="miter" />
        <path d="M8 7.5h8l-.3 3H8.5l.3 3.2 3.2 1 3.2-1 .3-2.2" strokeLinecap="square" />
      </svg>
    );
  }

  if (matcher === 'css' || matcher === 'css3' || nameKey === 'css') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M4 3h16l-1.5 15.2L12 21l-6.5-2.8L4 3z" strokeLinejoin="miter" />
        <path d="M7.8 7.5h8.4l-.4 3.4H9.4l.2 2.4h5.7l-.4 2.8-2.9.9-2.9-.9-.2-1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (matcher === 'tailwind' || matcher === 'tailwindcss' || matcher === 'tailwind css' || nameKey.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M6.8 10.2C7.6 7 9.6 5.4 12.6 5.4c4.5 0 5.1 3.4 7.3 3.9 1.5.4 2.8-.2 3.6-1.6-.8 3.2-2.8 4.8-5.8 4.8-4.5 0-5.1-3.4-7.3-3.9-1.5-.4-2.8.2-3.6 1.6zM1 16.6c.8-3.2 2.8-4.8 5.8-4.8 4.5 0 5.1 3.4 7.3 3.9 1.5.4 2.8-.2 3.6-1.6-.8 3.2-2.8 4.8-5.8 4.8-4.5 0-5.1-3.4-7.3-3.9-1.5-.4-2.8.2-3.6 1.6z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (matcher === 'supabase' || nameKey.includes('supabase')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M13.5 3L5.2 13.4c-.6.8 0 1.9 1 1.9h5.3l-.9 5.7c-.1.9 1 1.4 1.6.7l8.6-10.6c.6-.8 0-1.9-1-1.9h-5.3l.9-5.5c.2-.9-1-1.4-1.9-.7z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (matcher === 'git' || matcher === 'gitbranch' || nameKey === 'git') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M12 2.5L21.5 12 12 21.5 2.5 12 12 2.5z" />
        <circle cx="12" cy="8.5" r="1.4" />
        <circle cx="12" cy="15.5" r="1.4" />
        <circle cx="15.5" cy="12" r="1.4" />
        <path d="M12 9.9v4.2M13 9.5l1.6 1.6" />
      </svg>
    );
  }

  if (matcher === 'github' || nameKey.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (matcher === 'figma' || nameKey.includes('figma')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
        <path d="M9 3h3v6H9a3 3 0 0 1 0-6z" />
        <path d="M12 3h3a3 3 0 0 1 0 6h-3V3z" />
        <path d="M9 9h3v6H9a3 3 0 0 1 0-6z" />
        <circle cx="15" cy="12" r="3" />
        <path d="M9 15h3v3a3 3 0 0 1-6 0 3 3 0 0 1 3-3z" />
      </svg>
    );
  }

  if (matcher === 'database') return <Database className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'terminal') return <Terminal className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'cpu') return <Cpu className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'layers') return <Layers className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'palette') return <Palette className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'bot') return <Bot className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'globe') return <Globe className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'server') return <Server className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'sparkles') return <Sparkles className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'gitbranch') return <GitBranch className={className} strokeWidth={1.7} aria-hidden="true" />;
  if (matcher === 'filecode2') return <FileCode2 className={className} strokeWidth={1.7} aria-hidden="true" />;

  return <Code2 className={className} strokeWidth={1.7} aria-hidden="true" />;
};
