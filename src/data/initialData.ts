import {
  CertificationCarouselSettings,
  ExperienceCarouselSettings,
  PortfolioData,
} from '../types';

export const DEFAULT_EXPERIENCE_SETTINGS: ExperienceCarouselSettings = {
  heading: 'Experience',
  description:
    'Continuous roles across cooperative finance, volunteer leadership, and web development initiatives.',
  speed: 'normal',
  direction: 'ltr',
  autoScroll: true,
  pauseOnHover: true,
  showArrows: true,
  showIndicators: true,
  desktopCards: 3,
  cardGap: 'normal',
};

export const DEFAULT_CERTIFICATIONS_SETTINGS: CertificationCarouselSettings = {
  heading: 'Licenses & Certifications',
  description:
    'Verified qualifications and certificate documents validating skills in IT, computer systems, and development.',
  speed: 'normal',
  direction: 'ltr',
  autoScroll: true,
  pauseOnHover: true,
  showArrows: true,
  showIndicators: true,
  desktopCards: 3,
  cardGap: 'normal',
};

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'Sandesh Vishwakarma',
    headline: 'B.Sc. IT Student',
    tagline: 'Web Development • Design • Technology',
    shortBio: "I'm a B.Sc. IT student passionate about technology, web development, design, and building useful digital solutions.",
    aboutLong: [
      "I am an enthusiastic and dedicated B.Sc. Information Technology student at Thakur Shyamnarayan Degree College, driven by an eager curiosity for software development, modern web architecture, and intuitive design.",
      "My passion lies in solving real-world challenges through technology. Whether designing responsive client-facing interfaces, optimizing relational database schemas, or automating financial reporting workflows, I focus on delivering clean, maintainable, and high-impact digital solutions.",
      "Always proactive in upskilling, I constantly explore emerging frameworks, modern UI/UX principles, and AI-driven developer productivity tools. I am actively seeking freelance opportunities and future industry roles where I can contribute meaningful value and collaborate with visionary teams."
    ],
    avatarUrl: '/sandesh_profile.jpg',
    heroLeftPhoto: '',
    heroCollagePhotos: Array(11).fill(''),
    location: 'Mumbai, Maharashtra, India',
    email: 'sandesh.vishwakarma2007@gmail.com',
    phone: '+91 91370 00000',
    status: 'Open for Freelance & Internships',
    resumeUrl: '#resume',
    resumeFileName: 'Sandesh_Vishwakarma_Resume.pdf',
    socials: {
      github: 'https://github.com/sandesh-2007',
      linkedin: 'https://www.linkedin.com/in/sandesh-vishwakarma-04a25a346',
      instagram: 'https://www.instagram.com/sandesh_vishwakarma_101',
      email: 'mailto:sandesh.vishwakarma2007@gmail.com'
    },
    stats: {
      projectsCount: '5+',
      technologiesCount: '13+',
      certificationsCount: '4+',
      currentSemester: '2nd / 3rd Sem'
    }
  },
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. Information Technology',
      institution: 'Thakur Shyamnarayan Degree College',
      startYear: '2024',
      endYear: '2027 (Expected)',
      status: 'Currently Pursuing • 2nd / 3rd Semester',
      description: 'Focusing on Core Programming, Database Management Systems, Data Structures, Web Technologies, Computer Networks, and Software Engineering methodologies.',
      certificateLink: '#'
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (HSC) — Science & IT',
      institution: 'Maharashtra State Board',
      startYear: '2022',
      endYear: '2024',
      status: 'Completed with Distinction',
      description: 'Completed foundational coursework in Computer Science, Information Technology, Mathematics, and Physics with strong analytical performance.',
      certificateLink: '#'
    },
    {
      id: 'edu-3',
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Maharashtra State Board',
      startYear: '2021',
      endYear: '2022',
      status: 'Completed',
      description: 'Strong foundation in Science, Mathematics, and introductory computational thinking.',
      certificateLink: '#'
    }
  ],
  otherSkills: [
    {
      id: 'os-1',
      title: 'Mobile Banking & Fintech UI/UX Prototype',
      category: 'Figma & UI/UX',
      description: 'Interactive high-fidelity Figma user interface for personal finance tracking, featuring dark mode analytics, card management, and seamless transaction flows.',
      imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
      externalUrl: 'https://www.figma.com',
      date: '2025',
      toolsUsed: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping']
    },
    {
      id: 'os-2',
      title: 'College TechFest & Hackathon Official Poster',
      category: 'Posters & Banners',
      description: 'High-impact promotional poster and standee graphics designed for university campus technical symposium and coding hackathon.',
      imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
      externalUrl: '#',
      date: '2024',
      toolsUsed: ['Photoshop', 'Canva Pro', 'Graphic Design', 'Print Layout']
    },
    {
      id: 'os-3',
      title: 'B.Sc. IT Seminar: Cloud Computing Presentation PPT',
      category: 'PPTs & Presentations',
      description: 'Comprehensive 25-slide professional presentation deck detailing cloud virtualization, Docker containers, and microservices architecture with custom vector diagrams.',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
      externalUrl: '#',
      date: '2024',
      toolsUsed: ['Microsoft PowerPoint', 'Canva', 'Infographics', 'Visual Storytelling']
    },
    {
      id: 'os-4',
      title: 'Brand Identity & Vector Logo Concepts',
      category: 'Graphic Design',
      description: 'Modern geometric brand logo guidelines, color palettes, and typographic stationery designed for digital creator startups.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      externalUrl: '#',
      date: '2025',
      toolsUsed: ['Adobe Illustrator', 'Logo Design', 'Vector Art', 'Branding']
    },
    {
      id: 'os-5',
      title: 'Developer Workshop Social Media Carousel Posts',
      category: 'Social Media Posts',
      description: 'Engaging multi-slide Instagram and LinkedIn carousel graphics on web development tips, Git cheatsheets, and student coding resources.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80',
      externalUrl: '#',
      date: '2025',
      toolsUsed: ['Canva', 'Social Media Graphics', 'Content Design', 'Typography']
    }
  ],
  skillsOrbitV2: true,
  skills: [
    {
      id: 'sk-react',
      name: 'React',
      category: 'Frontend',
      proficiency: 88,
      icon: 'React',
      level: 'Proficient',
      description: 'Building modular, component-driven SPAs with hooks, reactive state management, and crisp interactive UI architecture.',
      relatedProjects: ["Heaven's Classes Management System", 'Personal Portfolio Website'],
      enabled: true,
      order: 0
    },
    {
      id: 'sk-js',
      name: 'JavaScript',
      category: 'Frontend',
      proficiency: 90,
      icon: 'JavaScript',
      level: 'Proficient',
      description: 'Modern ES6+ asynchronous workflows, DOM APIs, interactive motion logic, and client-side application engineering.',
      relatedProjects: ['Personal Portfolio Website', 'College Academic Portal & Coursework Utilities'],
      enabled: true,
      order: 1
    },
    {
      id: 'sk-ts',
      name: 'TypeScript',
      category: 'Frontend',
      proficiency: 84,
      icon: 'TypeScript',
      level: 'Proficient',
      description: 'Static type safety, clean domain contracts, and scalable React + Express codebase maintainability.',
      relatedProjects: ['Personal Portfolio Website'],
      enabled: true,
      order: 2
    },
    {
      id: 'sk-python',
      name: 'Python',
      category: 'Programming',
      proficiency: 82,
      icon: 'Python',
      level: 'Intermediate',
      description: 'Backend automation, system diagnostics scripting, data processing utilities, and structured application logic.',
      relatedProjects: ['Library Management System', 'Personal Portfolio Website'],
      enabled: true,
      order: 3
    },
    {
      id: 'sk-html',
      name: 'HTML',
      category: 'Frontend',
      proficiency: 95,
      icon: 'HTML',
      level: 'Advanced',
      description: 'Semantic document structure, accessible WAI-ARIA landmarks, SEO metadata, and clean web standards.',
      relatedProjects: ['Personal Portfolio Website', 'College Academic Portal & Coursework Utilities'],
      enabled: true,
      order: 4
    },
    {
      id: 'sk-css',
      name: 'CSS',
      category: 'Frontend',
      proficiency: 92,
      icon: 'CSS',
      level: 'Advanced',
      description: 'Responsive CSS Grid and Flexbox systems, custom print stylesheets, and GPU-composited micro-interactions.',
      relatedProjects: ['Personal Portfolio Website', 'College Academic Portal & Coursework Utilities'],
      enabled: true,
      order: 5
    },
    {
      id: 'sk-tailwind',
      name: 'Tailwind CSS',
      category: 'Frontend',
      proficiency: 92,
      icon: 'Tailwind',
      level: 'Advanced',
      description: 'Utility-first monochrome design systems, adaptive light/dark theming, and rapid responsive UI precision.',
      relatedProjects: ["Heaven's Classes Management System", 'Personal Portfolio Website'],
      enabled: true,
      order: 6
    },
    {
      id: 'sk-supabase',
      name: 'Supabase',
      category: 'Data & Tools',
      proficiency: 78,
      icon: 'Supabase',
      level: 'Intermediate',
      description: 'PostgreSQL relational modeling, authentication integration, row-level policies, and persistent data APIs.',
      relatedProjects: ["Heaven's Classes Management System", 'Library Management System'],
      enabled: true,
      order: 7
    },
    {
      id: 'sk-git',
      name: 'Git',
      category: 'Data & Tools',
      proficiency: 86,
      icon: 'Git',
      level: 'Proficient',
      description: 'Distributed version control, clean feature branching, commit history hygiene, and merge conflict resolution.',
      relatedProjects: ['Personal Portfolio Website', "Heaven's Classes Management System"],
      enabled: true,
      order: 8
    },
    {
      id: 'sk-github',
      name: 'GitHub',
      category: 'Data & Tools',
      proficiency: 88,
      icon: 'GitHub',
      level: 'Proficient',
      description: 'Remote source hosting, pull request workflows, issue tracking, and continuous deployment pipelines.',
      relatedProjects: ['Personal Portfolio Website', 'Library Management System'],
      enabled: true,
      order: 9
    },
    {
      id: 'sk-figma',
      name: 'Figma',
      category: 'Design & AI',
      proficiency: 82,
      icon: 'Figma',
      level: 'Intermediate',
      description: 'Component systems, wireframing, minimal typographic layouts, and interactive UI/UX prototyping.',
      relatedProjects: ['Mobile Banking & Fintech UI/UX Prototype', 'Personal Portfolio Website'],
      enabled: true,
      order: 10
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: "Heaven's Classes Management System",
      category: 'Systems & Software',
      description: 'A comprehensive academic coaching management portal designed to streamline student enrollments, fee payment schedules, batch timetables, and attendance logs with automated receipt generation.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Node.js', 'SQL Database', 'Tailwind CSS', 'Chart.js'],
      githubLink: 'https://github.com',
      liveDemoLink: '#',
      featured: true
    },
    {
      id: 'proj-2',
      name: 'Personal Portfolio Website',
      category: 'Web Development',
      description: 'A cutting-edge, responsive personal brand website featuring futuristic dark aesthetics, glassmorphism cards, dynamic interactive showcases, and an authenticated administrative edit suite for real-time updates.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Express API'],
      githubLink: 'https://github.com',
      liveDemoLink: '#',
      featured: true
    },
    {
      id: 'proj-3',
      name: 'Library Management System',
      category: 'Systems & Software',
      description: 'A robust desktop and web-friendly cataloging application providing instant book ISBN lookup, student borrowing histories, fine calculators, and real-time inventory threshold tracking.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      technologies: ['Python', 'SQL', 'Tkinter / Web UI', 'Relational Database'],
      githubLink: 'https://github.com',
      liveDemoLink: '#',
      featured: true
    },
    {
      id: 'proj-4',
      name: 'Excel Data Analysis & Financial Dashboard',
      category: 'Data & Analysis',
      description: 'Dynamic financial accounting and data analytics workbook built for co-operative societies, incorporating automated VLOOKUP/XLOOKUP formulas, pivot summary cards, and dynamic visual graphs.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      technologies: ['Microsoft Excel', 'Financial Modeling', 'Pivot Charts', 'Data Reconciliation'],
      githubLink: 'https://github.com',
      liveDemoLink: '#',
      featured: false
    },
    {
      id: 'proj-5',
      name: 'College Academic Portal & Coursework Utilities',
      category: 'College Projects',
      description: 'Suite of utilities built for B.Sc. IT coursework, including algorithm visualizers (sorting/searching in C++), interactive SQL sandbox utilities, and responsive student group project showcases.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      technologies: ['C++', 'HTML5', 'CSS3', 'JavaScript', 'Database Queries'],
      githubLink: 'https://github.com',
      liveDemoLink: '#',
      featured: false
    }
  ],
  experienceV2: true,
  experienceSettings: DEFAULT_EXPERIENCE_SETTINGS,
  experience: [
    {
      id: 'exp-1',
      role: 'Assistant Accountant',
      organization: 'Gopal Co-operative Credit Society Ltd.',
      type: 'Part-time',
      startDate: 'Mar 2025',
      endDate: 'Present',
      isCurrent: true,
      location: 'Mumbai, Maharashtra, India',
      workMode: 'Hybrid',
      description: 'Managing day-to-day accounts, balancing cooperative deposit ledgers, and maintaining digital fiscal records.',
      responsibilities: [
        'Accurately recorded daily loan repayments, credit transactions, and member savings entries in financial systems.',
        'Executed end-of-day bank reconciliations and verified discrepancy registers in tally sheets and accounting software.',
        'Prepared monthly financial summaries, balance statements, and ledger audits utilizing advanced Excel spreadsheets.',
        'Collaborated with senior auditors and credit society management to ensure statutory compliance and transparent records.'
      ],
      achievements: [
        'Maintained consistent zero-discrepancy daily ledger closings across monthly cooperative audit cycles.'
      ],
      skills: ['Microsoft Excel', 'Communication', 'Financial Accounting', 'Bank Reconciliation', 'Tally Prime'],
      enabled: true,
      order: 0
    },
    {
      id: 'exp-2',
      role: 'Accountant & Volunteer',
      organization: 'National Service Scheme (NSS)',
      type: 'Volunteer',
      startDate: 'Jun 2025',
      endDate: 'Present',
      isCurrent: true,
      location: 'Mumbai, Maharashtra, India',
      workMode: 'Hybrid',
      description: 'NSS Volunteer & Committee Member coordinating unit event budgets, expense tracking, and community outreach initiatives.',
      responsibilities: [
        'NSS Volunteer & Committee Member managing activity budgets, receipts, and resource disbursements.',
        'Coordinated community service drives, digital literacy workshops, and campus awareness campaigns.'
      ],
      achievements: [
        'Streamlined transparent fund tracking for college NSS unit community programs.'
      ],
      skills: ['Teamwork', 'Communication', 'Accounting', 'Community Outreach'],
      enabled: true,
      order: 1
    },
    {
      id: 'exp-3',
      role: 'Accountant',
      organization: 'Red Ribbon Club, BRAC',
      type: 'Volunteer',
      startDate: 'Aug 2026',
      endDate: 'Present',
      isCurrent: true,
      location: 'Mumbai, Maharashtra, India',
      workMode: 'Hybrid',
      description: 'RRC Accountant overseeing campaign resource records, event expenditure logs, and club financial accountability.',
      responsibilities: [
        'Maintained accurate club financial registers and expenditure summaries for awareness initiatives.',
        'Supported student organizers with transparent budget planning and voucher verification.'
      ],
      achievements: [
        'Delivered structured financial reporting for inter-collegiate awareness campaigns.'
      ],
      skills: ['Accounting', 'Record Keeping', 'Financial Reporting', 'Coordination'],
      enabled: true,
      order: 2
    },
    {
      id: 'exp-4',
      role: 'Volunteer',
      organization: 'Computer Society of India (CSI)',
      type: 'Volunteer',
      startDate: 'Jul 2025',
      endDate: 'Present',
      isCurrent: true,
      location: 'Mumbai, Maharashtra, India',
      workMode: 'Hybrid',
      description: 'CSI Volunteer contributing to front-end event interfaces, technical student workshops, and developer community sessions.',
      responsibilities: [
        'CSI Volunteer supporting coding seminars, technical symposium logistics, and student engagement.',
        'Assisted with front-end web pages and digital collateral for CSI chapter events.'
      ],
      achievements: [
        'Supported smooth execution of campus web development and technical workshop series.'
      ],
      skills: ['Front-End Development', 'Web Development', 'HTML', 'CSS', 'JavaScript', 'Teamwork'],
      enabled: true,
      order: 3
    }
  ],
  certificationsSettings: DEFAULT_CERTIFICATIONS_SETTINGS,
  certifications: [
    {
      id: 'cert-1',
      name: 'MS-CIT (Maharashtra State Certificate in IT)',
      issuingOrg: 'Maharashtra Knowledge Corporation Limited (MKCL)',
      issueDate: 'Jul 2023',
      year: '2023',
      expiryDate: 'No Expiry',
      credentialId: 'MKCL-MSCIT-2023',
      certificateLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
      description: 'State-certified information technology literacy credential covering office productivity, digital tools, and system fundamentals.',
      verificationStatus: 'Verified',
      enabled: true,
      order: 0
    },
    {
      id: 'cert-2',
      name: 'Tally with GST & Financial Accounting',
      issuingOrg: 'Authorized Vocational Training Institute',
      issueDate: 'Nov 2023',
      year: '2023',
      expiryDate: 'No Expiry',
      credentialId: 'TALLY-GST-2023',
      certificateLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      description: 'Applied accounting certification in voucher management, GST computation, ledger reconciliation, and balance statements.',
      verificationStatus: 'Verified',
      enabled: true,
      order: 1
    },
    {
      id: 'cert-3',
      name: 'Web Development Fundamentals (HTML, CSS, JS)',
      issuingOrg: 'Online Tech Academy & Coursework',
      issueDate: 'Apr 2024',
      year: '2024',
      expiryDate: 'No Expiry',
      credentialId: 'WDF-2024-03',
      certificateLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80',
      description: 'Foundational front-end web engineering training covering semantic HTML5, modern CSS layout systems, and ES6+ JavaScript.',
      verificationStatus: 'Completed',
      enabled: true,
      order: 2
    },
    {
      id: 'cert-4',
      name: 'Cybersecurity Basics & Digital Defense',
      issuingOrg: 'Information Security Training Workshop',
      issueDate: 'Aug 2024',
      year: '2024',
      expiryDate: 'No Expiry',
      credentialId: 'CSEC-2024-04',
      certificateLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      description: 'Workshop credential covering threat awareness, secure authentication practices, and foundational network hygiene.',
      verificationStatus: 'Verified',
      enabled: true,
      order: 3
    },
    {
      id: 'cert-5',
      name: 'Workshops & Technical Seminar Certifications',
      issuingOrg: 'College Tech Committee & Youth Forums',
      issueDate: 'Oct 2024',
      year: '2024',
      expiryDate: 'No Expiry',
      credentialId: 'TSDC-SEM-2024',
      certificateLink: '#',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
      description: 'Academic seminars and technical symposium certificates validating collaborative engineering and presentation practice.',
      verificationStatus: 'Completed',
      enabled: true,
      order: 4
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'National Service Scheme (NSS) Active Contributor',
      category: 'NSS Activities',
      date: '2024 - 2025',
      description: 'Actively contributed to community service projects, blood donation camps, digital literacy awareness drives, and environment conservation initiatives organized by the college NSS unit.',
      highlightBadge: 'Social Leadership'
    },
    {
      id: 'ach-2',
      title: 'College Technical Symposium & Presentation',
      category: 'College Competitions',
      date: '2024',
      description: 'Participated in inter-collegiate tech competitions, demonstrating software development workflows and computational problem-solving with high commendations.',
      highlightBadge: 'Academic Excellence'
    },
    {
      id: 'ach-3',
      title: 'Practical Web Engineering & Full-Stack Projects',
      category: 'Projects & Tech',
      date: '2024 - 2025',
      description: 'Successfully deployed working full-stack and accounting systems solving operational bottlenecks for educational institutions and financial societies.',
      highlightBadge: 'Practical Innovation'
    },
    {
      id: 'ach-4',
      title: 'Professional Office & Financial Automation',
      category: 'Courses & Certifications',
      date: '2023 - 2024',
      description: 'Mastered computerized ledger workflows, MS-CIT digital productivity suites, and Tally Prime GST compliance modules.',
      highlightBadge: 'Applied Skills'
    }
  ]
};
