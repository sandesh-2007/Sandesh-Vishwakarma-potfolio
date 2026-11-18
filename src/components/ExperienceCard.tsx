import React, { useEffect, useState } from 'react';
import { Building2, Gem, MapPin } from 'lucide-react';
import { ExperienceItem } from '../types';

interface ExperienceCardProps {
  exp: ExperienceItem;
  isLight: boolean;
  onInspect?: (exp: ExperienceItem) => void;
  className?: string;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  exp,
  isLight,
  onInspect,
  className = '',
}) => {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [exp.logoUrl]);

  const isPresent = Boolean(
    exp.isCurrent || (exp.endDate && exp.endDate.trim().toLowerCase() === 'present')
  );
  const displayEnd = isPresent ? 'Present' : exp.endDate;
  const skills = exp.skills || [];
  const visibleSkills = skills.slice(0, 2);
  const extraSkillCount = Math.max(0, skills.length - visibleSkills.length);
  const visibleBullets = (exp.responsibilities || []).slice(0, 2);
  const hasMoreContent =
    (exp.responsibilities?.length || 0) > 2 ||
    (exp.achievements?.length || 0) > 0 ||
    (exp.description?.length || 0) > 115;

  const orgInitials = (exp.organization || 'EX')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');

  return (
    <article
      className={`flex flex-col justify-between p-5 sm:p-6 border transition-colors select-none ${
        isLight
          ? 'bg-white border-zinc-200 hover:border-zinc-950 text-zinc-950'
          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-500 text-white'
      } ${className}`}
    >
      <div>
        {/* Top Row: Organization Logo + Role Metadata + Present Tag */}
        <div className="flex items-start gap-3.5">
          {/* Square Organization Logo */}
          <div
            className={`w-12 h-12 border flex items-center justify-center shrink-0 overflow-hidden ${
              isLight
                ? 'border-zinc-200 bg-zinc-50 text-zinc-800'
                : 'border-zinc-800 bg-zinc-900 text-zinc-200'
            }`}
          >
            {exp.logoUrl && !logoError ? (
              <img
                src={exp.logoUrl}
                alt={`${exp.organization} logo`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : orgInitials ? (
              <span className="font-mono text-xs font-bold tracking-wider">
                {orgInitials}
              </span>
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>

          {/* Role, Organization, Dates, Location */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight leading-snug truncate ${
                  isLight ? 'text-zinc-950' : 'text-white'
                }`}
              >
                {exp.role}
              </h3>

              {isPresent && (
                <span
                  className={`shrink-0 px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider ${
                    isLight
                      ? 'border-zinc-300 bg-zinc-50 text-zinc-700'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                  }`}
                >
                  Present
                </span>
              )}
            </div>

            <p
              className={`text-xs sm:text-sm font-medium mt-0.5 truncate ${
                isLight ? 'text-zinc-800' : 'text-zinc-200'
              }`}
            >
              {exp.organization}
              {exp.type ? ` · ${exp.type}` : ''}
            </p>

            <p
              className={`text-[11px] sm:text-xs font-mono mt-1 tabular-nums ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {exp.startDate} — {displayEnd}
            </p>

            {(exp.location || exp.workMode) && (
              <p
                className={`text-[11px] font-mono mt-0.5 flex items-center gap-1 truncate ${
                  isLight ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {[exp.location, exp.workMode].filter(Boolean).join(' · ')}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Description & Compact Responsibilities */}
        <div
          className={`mt-4 pt-3.5 border-t space-y-2 ${
            isLight ? 'border-zinc-200/80' : 'border-zinc-800/90'
          }`}
        >
          {exp.description && (
            <p
              className={`text-xs sm:text-[13px] leading-relaxed line-clamp-2 ${
                isLight ? 'text-zinc-700' : 'text-zinc-300'
              }`}
            >
              {exp.description}
            </p>
          )}

          {visibleBullets.length > 0 && (
            <ul className="space-y-1">
              {visibleBullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className={`text-[11px] sm:text-xs leading-snug flex items-start gap-2 ${
                    isLight ? 'text-zinc-600' : 'text-zinc-400'
                  }`}
                >
                  <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono">
                    •
                  </span>
                  <span className="line-clamp-1">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {onInspect && hasMoreContent && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspect(exp);
              }}
              className={`text-[11px] font-mono underline underline-offset-4 transition-colors ${
                isLight
                  ? 'text-zinc-600 hover:text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ... more details
            </button>
          )}
        </div>
      </div>

      {/* Footer Skills Summary + Optional Inspect Trigger */}
      <div
        className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
          isLight ? 'border-zinc-200/80' : 'border-zinc-800/90'
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium min-w-0 ${
            isLight ? 'text-zinc-800' : 'text-zinc-200'
          }`}
        >
          <Gem
            className={`w-3.5 h-3.5 shrink-0 ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          />
          {skills.length > 0 ? (
            <span className="truncate">
              {visibleSkills.join(', ')}
              {extraSkillCount > 0 ? ` and +${extraSkillCount} skills` : ''}
            </span>
          ) : (
            <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>
              {exp.type || 'Practical Experience'}
            </span>
          )}
        </div>

        {onInspect && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(exp);
            }}
            className={`shrink-0 px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider transition-colors ${
              isLight
                ? 'border-zinc-200 text-zinc-700 hover:border-zinc-950 hover:text-zinc-950'
                : 'border-zinc-800 text-zinc-300 hover:border-white hover:text-white'
            }`}
          >
            Inspect
          </button>
        )}
      </div>
    </article>
  );
};
