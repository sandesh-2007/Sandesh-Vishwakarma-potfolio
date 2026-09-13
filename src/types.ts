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
  description: string;
  responsibilities: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  year: string;
  certificateLink: string;
  imageUrl?: string;
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
}

export interface PortfolioData {
  profile: PersonalProfile;
  education: EducationItem[];
  otherSkills?: OtherSkillItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
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
