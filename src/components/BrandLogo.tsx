import React from 'react';

export type BrandLogoName = 'github' | 'linkedin' | 'mail' | 'instagram' | 'sheets';

export const BRAND_LOGO_PATHS: Record<BrandLogoName, string> = {
  github: '/assets/aistudio/image_c63038f3.png',
  linkedin: '/assets/aistudio/image_754bc6c4.png',
  mail: '/assets/aistudio/image_6e395f75.png',
  instagram: '/assets/aistudio/image_7b04d573.png',
  sheets: '/assets/aistudio/image_35947093.png',
};

const BRAND_LOGO_ALT: Record<BrandLogoName, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  mail: 'Gmail',
  instagram: 'Instagram',
  sheets: 'Google Sheets',
};

interface BrandLogoProps {
  name: BrandLogoName;
  className?: string;
  invertOnDark?: boolean;
  isDark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  className = 'w-4 h-4',
  invertOnDark = true,
  isDark = false,
}) => {
  const shouldInvert = name === 'github' && invertOnDark && isDark;

  return (
    <img
      src={BRAND_LOGO_PATHS[name]}
      alt={BRAND_LOGO_ALT[name]}
      loading="lazy"
      decoding="async"
      className={`inline-block shrink-0 object-contain select-none ${shouldInvert ? 'invert' : ''} ${className}`}
    />
  );
};
