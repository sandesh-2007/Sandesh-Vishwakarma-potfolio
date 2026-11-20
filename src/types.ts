export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
}

export interface PersonalProfile {
  name: string;
  headline: string;
  tagline: string;
  shortBio: string;
  aboutLong: string[];
  avatarUrl: string;
  heroLeftPhoto?: string;
  heroRightPhoto?: string;
  heroCollagePhotos?: string[];
  location: string;
  email: string;
  phone?: string;
  status: string;
  resumeUrl: string;
  resumeFileName?: string;
  socials: SocialLinks;
  stats: {
    projectsCount: string;
    technologiesCount: string;
    certificationsCount: string;
    currentSemester: string;
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
  status: string;
  description: string;
  certificateLink?: string;
}

export type SkillCategory = 'Frontend' | 'Programming' | 'Data & Tools' | 'Design & AI';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon: string;
  level: string;
  description?: string;
  relatedProjects?: string[];
  enabled?: boolean;
  order?: number;
  iconUrl?: string;
}

export type ProjectCategory = 'Web Development' | 'Systems & Software' | 'Data & Analysis' | 'College Projects';

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  image: string;
  technologies: string[];
  githubLink: string;
  liveDemoLink: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  type: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  location?: string;
  workMode?: string;
  logoUrl?: string;
  description: string;
  responsibilities: string[];
  achievements?: string[];
  skills?: string[];
  enabled?: boolean;
  order?: number;
}

export interface ExperienceCarouselSettings {
  heading: string;
  description: string;
  speed: 'slow' | 'normal' | 'fast';
  direction: 'ltr' | 'rtl';
  autoScroll: boolean;
  pauseOnHover: boolean;
  showArrows: boolean;
  showIndicators: boolean;
  desktopCards: 2 | 3 | 4;
  cardGap: 'compact' | 'normal' | 'spacious';
}

export type CertificateVerificationStatus =
  | 'Verified'
  | 'Completed'
  | 'In Progress'
  | 'Expired';

export interface CertificationCarouselSettings {
  heading: string;
  description: string;
  speed: 'slow' | 'normal' | 'fast';
  direction: 'ltr' | 'rtl';
  autoScroll: boolean;
  pauseOnHover: boolean;
  showArrows: boolean;
  showIndicators: boolean;
  desktopCards: 2 | 3 | 4;
  cardGap: 'compact' | 'normal' | 'spacious';
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate?: string;
  year: string;
  expiryDate?: string;
  credentialId?: string;
  certificateLink: string;
  imageUrl?: string;
  pdfUrl?: string;
  certificateDocument?: string;
  description?: string;
  verificationStatus?: CertificateVerificationStatus;
  enabled?: boolean;
  order?: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  highlightBadge?: string;
}

export type OtherSkillCategory = 
  | 'Graphic Design' 
  | 'Figma & UI/UX' 
  | 'PPTs & Presentations' 
  | 'Posters & Banners' 
  | 'Social Media Posts' 
  | 'Other Creative';

export interface OtherSkillItem {
  id: string;
  title: string;
  category: OtherSkillCategory;
  description: string;
  imageUrl: string;
  fileUrl?: string;
  externalUrl?: string;
  date?: string;
  toolsUsed?: string[];
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetName: string;
  spreadsheetTitle?: string;
  connectedEmail?: string;
  lastSyncedAt?: string;
  autoSync: boolean;
  webhookUrl?: string;
}

export interface PortfolioData {
  updatedAt?: number;
  skillsOrbitV2?: boolean;
  experienceV2?: boolean;
  profile: PersonalProfile;
  education: EducationItem[];
  otherSkills?: OtherSkillItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  experienceSettings?: ExperienceCarouselSettings;
  certifications: CertificationItem[];
  certificationsSettings?: CertificationCarouselSettings;
  achievements: AchievementItem[];
  sheetsConfig?: GoogleSheetsConfig;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
  syncedToSheets?: boolean;
}
