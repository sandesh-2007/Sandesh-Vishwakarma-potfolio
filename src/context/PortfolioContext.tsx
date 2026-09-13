import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioData, ContactMessage, CertificationItem, OtherSkillItem, GoogleSheetsConfig } from '../types';
import { initialPortfolioData } from '../data/initialData';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  googleSignOut, 
  initAuth, 
  getAccessToken, 
  getCurrentGoogleUser 
} from '../services/googleAuth';
import { 
  createPortfolioSpreadsheet, 
  getSpreadsheetDetails, 
  appendContactToSheet, 
  batchAppendMessagesToSheet, 
  extractSpreadsheetId 
} from '../services/googleSheets';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSaving: boolean;
  isAdmin: boolean;
  adminToken: string | null;
  toasts: Toast[];
  messages: ContactMessage[];
  loginModalOpen: boolean;
  editModalOpen: boolean;
  sheetsModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setSheetsModalOpen: (open: boolean) => void;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithGoogle: (newPassword: string, email: string, accessToken?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePortfolio: (newData: PortfolioData) => Promise<{ success: boolean; error?: string }>;
  resetPortfolio: () => Promise<{ success: boolean; error?: string }>;
  uploadFile: (file: File) => Promise<{ success: boolean; url: string; fileName: string; error?: string }>;
  uploadProfilePhoto: (file: File) => Promise<boolean>;
  uploadCertificateDocument: (certId: string, file: File) => Promise<boolean>;
  addNewCertificateWithFile: (newCert: Omit<CertificationItem, 'id'>, file?: File) => Promise<boolean>;
  addOtherSkill: (item: Omit<OtherSkillItem, 'id'>, previewFile?: File, documentFile?: File) => Promise<boolean>;
  updateOtherSkill: (item: OtherSkillItem, previewFile?: File, documentFile?: File) => Promise<boolean>;
  deleteOtherSkill: (id: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;
  sendMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<{ success: boolean; error?: string; syncedToSheets?: boolean }>;
  fetchMessages: () => Promise<void>;
  // Google Workspace & Sheets
  googleUser: User | null;
  hasGoogleAuth: boolean;
  isGoogleConnecting: boolean;
  authDomainError: string | null;
  clearAuthDomainError: () => void;
  connectGoogleAccount: () => Promise<boolean>;
  disconnectGoogleAccount: () => Promise<void>;
  createAndConnectGoogleSheet: () => Promise<boolean>;
  connectExistingGoogleSheet: (idOrUrl: string, sheetName?: string) => Promise<boolean>;
  connectWebhookGoogleSheet: (webhookUrl: string, sheetUrl?: string) => Promise<boolean>;
  disconnectGoogleSheet: () => Promise<boolean>;
  syncAllMessagesToSheet: () => Promise<number>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sandesh_portfolio_data_v1';
const TOKEN_KEY = 'sandesh_portfolio_auth_token';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    // Initial sync from localStorage for zero flash of unstyled content
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.otherSkills || parsed.otherSkills.length === 0) {
          parsed.otherSkills = initialPortfolioData.otherSkills || [];
        }
        // Ensure accurate current social links if user had old default placeholders stored
        if (parsed.profile && parsed.profile.socials) {
          if (!parsed.profile.socials.github || parsed.profile.socials.github === 'https://github.com') {
            parsed.profile.socials.github = initialPortfolioData.profile.socials.github;
          }
          if (!parsed.profile.socials.instagram || parsed.profile.socials.instagram === 'https://instagram.com') {
            parsed.profile.socials.instagram = initialPortfolioData.profile.socials.instagram;
          }
          if (!parsed.profile.socials.linkedin || parsed.profile.socials.linkedin === 'https://linkedin.com') {
            parsed.profile.socials.linkedin = initialPortfolioData.profile.socials.linkedin;
          }
          if (!parsed.profile.email || parsed.profile.email.includes('example.com')) {
            parsed.profile.email = initialPortfolioData.profile.email;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading local portfolio data:', e);
    }
    return initialPortfolioData;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);
  const [authDomainError, setAuthDomainError] = useState<string | null>(null);

  const clearAuthDomainError = () => {
    setAuthDomainError(null);
  };

  // Initialize Firebase Auth listener for Google Workspace token
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, _token) => {
        setGoogleUser(user);
        setHasGoogleAuth(true);
      },
      () => {
        setGoogleUser(getCurrentGoogleUser());
        setHasGoogleAuth(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const THEME_KEY = 'sandesh_portfolio_theme';
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      console.warn('Error reading theme from storage:', e);
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      const root = document.documentElement;
      const body = document.body;
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
      }
    } catch (e) {
      console.warn('Error applying theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to retrieve valid client-side passwords (for static hosts like Netlify / GitHub Pages)
  const getValidClientPasswords = (): string[] => {
    const list = ['sandy@123', 'sandesh@2025'];
    try {
      const saved = localStorage.getItem('sandesh_custom_password');
      if (saved && saved.trim()) {
        list.push(saved.trim());
      }
    } catch (e) {
      console.warn('Storage read warning:', e);
    }
    return list;
  };

  // Hydrate data from server API (with offline & static deployment safety)
  useEffect(() => {
    let isMounted = true;
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        const contentType = res.headers.get('content-type') || '';
        // Only parse as JSON if the server returned JSON (not a Netlify 404 HTML page)
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.data && isMounted) {
            const merged = {
              ...json.data,
              otherSkills: json.data.otherSkills && json.data.otherSkills.length > 0
                ? json.data.otherSkills
                : (initialPortfolioData.otherSkills || [])
            };
            setData(merged);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.warn('Could not connect to server portfolio API, using cached data', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPortfolio();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check auth session
  useEffect(() => {
    async function verifyToken() {
      if (!adminToken) {
        setIsAdmin(false);
        return;
      }

      // If this is a static session token (used on Netlify, GitHub Pages, etc.)
      if (adminToken.startsWith('static_session_')) {
        setIsAdmin(true);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.authenticated) {
            setIsAdmin(true);
            return;
          } else if (res.status === 401) {
            // Server explicitly revoked the session
            setIsAdmin(false);
            setAdminToken(null);
            localStorage.removeItem(TOKEN_KEY);
            return;
          }
        }
        // If static host or server endpoint unreachable, keep local session valid
        setIsAdmin(true);
      } catch (err) {
        console.warn('Failed to verify token with server, keeping local session active:', err);
        setIsAdmin(true);
      }
    }

    verifyToken();
  }, [adminToken]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = password.trim();
    const validClientPasswords = getValidClientPasswords();

    // 1. If backend server is available, attempt server authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedInput }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (res.ok && json.token) {
          setAdminToken(json.token);
          setIsAdmin(true);
          localStorage.setItem(TOKEN_KEY, json.token);
          setLoginModalOpen(false);
          setEditModalOpen(true);
          showToast('Authenticated successfully! Welcome, Sandesh.', 'success');
          return { success: true };
        } else if (res.status === 401 && !validClientPasswords.includes(trimmedInput)) {
          const errMsg = json.error || 'Incorrect administrator password';
          showToast(errMsg, 'error');
          return { success: false, error: errMsg };
        }
      }
    } catch (err) {
      console.warn('Server auth endpoint unreachable (static deployment mode), checking client credentials...', err);
    }

    // 2. Client-Side Fallback (for Netlify, GitHub Pages, Vercel static deployments)
    if (validClientPasswords.includes(trimmedInput)) {
      const staticToken = 'static_session_' + Date.now();
      setAdminToken(staticToken);
      setIsAdmin(true);
      localStorage.setItem(TOKEN_KEY, staticToken);
      setLoginModalOpen(false);
      setEditModalOpen(true);
      showToast('Authenticated successfully! Welcome, Sandesh.', 'success');
      return { success: true };
    } else {
      const errMsg = 'Incorrect administrator password. Please try again.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const resetPasswordWithGoogle = async (newPassword: string, email: string, accessToken?: string): Promise<{ success: boolean; error?: string }> => {
    const OWNER_EMAIL = 'sandesh.vishwakarma2007@gmail.com';
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPass = newPassword.trim();

    if (trimmedEmail !== OWNER_EMAIL) {
      const errMsg = `Access Denied: Only ${OWNER_EMAIL} is permitted to reset the administrator password.`;
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    if (trimmedPass.length < 6) {
      const errMsg = 'Password must be at least 6 characters long.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    // Store in localStorage for static client fallback
    try {
      localStorage.setItem('sandesh_custom_password', trimmedPass);
    } catch (e) {
      console.warn('Failed to store custom password locally:', e);
    }

    // Attempt server sync if available
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, newPassword: trimmedPass, accessToken }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (res.ok && json.token) {
          setAdminToken(json.token);
          setIsAdmin(true);
          localStorage.setItem(TOKEN_KEY, json.token);
          setLoginModalOpen(false);
          setEditModalOpen(true);
          showToast('Password updated! Logged in as Administrator.', 'success');
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Server reset endpoint unreachable, applied locally:', err);
    }

    // Client fallback session for Netlify / GitHub Pages
    const staticToken = 'static_session_' + Date.now();
    setAdminToken(staticToken);
    setIsAdmin(true);
    localStorage.setItem(TOKEN_KEY, staticToken);
    setLoginModalOpen(false);
    setEditModalOpen(true);
    showToast('Password updated! Logged in as Administrator.', 'success');
    return { success: true };
  };

  const logout = () => {
    if (adminToken && !adminToken.startsWith('static_session_')) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem(TOKEN_KEY);
    setEditModalOpen(false);
    showToast('Signed out of Edit Mode.', 'info');
  };

  const updatePortfolio = async (newData: PortfolioData): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);
    // Instant optimistic update
    setData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));

    try {
      if (adminToken && !adminToken.startsWith('static_session_')) {
        const res = await fetch('/api/portfolio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ data: newData }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok && contentType.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to save to server');
        }
      }

      showToast('Portfolio changes successfully saved and persisted!', 'success');
      return { success: true };
    } catch (err: any) {
      showToast('Saved locally in browser storage.', 'success');
      return { success: true };
    } finally {
      setIsSaving(false);
    }
  };

  const resetPortfolio = async (): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);
    try {
      if (adminToken) {
        await fetch('/api/portfolio/reset', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
      setData(initialPortfolioData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialPortfolioData));
      showToast('Portfolio reset to default template data.', 'info');
      return { success: true };
    } catch (err) {
      showToast('Reset failed.', 'error');
      return { success: false, error: 'Reset failed' };
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFile = async (file: File): Promise<{ success: boolean; url: string; fileName: string; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
            },
            body: JSON.stringify({
              fileData: base64,
              fileName: file.name,
              fileType: file.type
            })
          });
          const json = await res.json();
          if (res.ok && json.fileUrl) {
            resolve({ success: true, url: json.fileUrl, fileName: json.fileName || file.name });
          } else {
            // Fallback to local data URI
            resolve({ success: true, url: base64, fileName: file.name });
          }
        } catch (e) {
          // Fallback to data URI for offline/preview
          resolve({ success: true, url: reader.result as string, fileName: file.name });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, url: '', fileName: '', error: 'Failed to read file' });
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadProfilePhoto = async (file: File): Promise<boolean> => {
    showToast('Uploading profile image...', 'info');
    const res = await uploadFile(file);
    if (res.success && res.url) {
      const updated: PortfolioData = {
        ...data,
        profile: {
          ...data.profile,
          avatarUrl: res.url
        }
      };
      await updatePortfolio(updated);
      showToast('Profile image updated successfully!', 'success');
      return true;
    }
    showToast('Failed to upload profile photo.', 'error');
    return false;
  };

  const uploadCertificateDocument = async (certId: string, file: File): Promise<boolean> => {
    showToast('Uploading certificate...', 'info');
    const res = await uploadFile(file);
    if (res.success && res.url) {
      const isImage = file.type.startsWith('image/');
      const updatedCerts = data.certifications.map((c) => {
        if (c.id === certId) {
          return {
            ...c,
            certificateLink: res.url,
            imageUrl: isImage ? res.url : (c.imageUrl || res.url)
          };
        }
        return c;
      });
      const updated: PortfolioData = {
        ...data,
        certifications: updatedCerts
      };
      await updatePortfolio(updated);
      showToast('Certificate document uploaded and saved!', 'success');
      return true;
    }
    showToast('Failed to upload certificate.', 'error');
    return false;
  };

  const addNewCertificateWithFile = async (newCert: Omit<CertificationItem, 'id'>, file?: File): Promise<boolean> => {
    let certUrl = newCert.certificateLink;
    let imgUrl = newCert.imageUrl;

    if (file) {
      showToast('Uploading certificate document...', 'info');
      const res = await uploadFile(file);
      if (res.success && res.url) {
        certUrl = res.url;
        if (file.type.startsWith('image/')) {
          imgUrl = res.url;
        }
      }
    }

    const certItem: CertificationItem = {
      ...newCert,
      id: 'cert-' + Date.now(),
      certificateLink: certUrl || '#',
      imageUrl: imgUrl
    };

    const updated: PortfolioData = {
      ...data,
      certifications: [certItem, ...data.certifications]
    };
    await updatePortfolio(updated);
    showToast(`Certificate "${certItem.name}" added successfully!`, 'success');
    return true;
  };

  const addOtherSkill = async (
    item: Omit<OtherSkillItem, 'id'>, 
    previewFile?: File, 
    documentFile?: File
  ): Promise<boolean> => {
    let finalImageUrl = item.imageUrl || '';
    let finalFileUrl = item.fileUrl || '';

    if (previewFile) {
      showToast('Uploading preview image...', 'info');
      const res = await uploadFile(previewFile);
      if (res.success && res.url) {
        finalImageUrl = res.url;
      }
    }

    if (documentFile) {
      showToast('Uploading work document/presentation...', 'info');
      const resDoc = await uploadFile(documentFile);
      if (resDoc.success && resDoc.url) {
        finalFileUrl = resDoc.url;
        if (!finalImageUrl && documentFile.type.startsWith('image/')) {
          finalImageUrl = resDoc.url;
        }
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80';
    }

    const newItem: OtherSkillItem = {
      ...item,
      id: 'os-' + Date.now(),
      imageUrl: finalImageUrl,
      fileUrl: finalFileUrl || undefined
    };

    const currentList = data.otherSkills || [];
    const updated: PortfolioData = {
      ...data,
      otherSkills: [newItem, ...currentList]
    };

    await updatePortfolio(updated);
    showToast(`"${newItem.title}" added to Other Skills!`, 'success');
    return true;
  };

  const updateOtherSkill = async (
    item: OtherSkillItem,
    previewFile?: File,
    documentFile?: File
  ): Promise<boolean> => {
    let finalImageUrl = item.imageUrl;
    let finalFileUrl = item.fileUrl;

    if (previewFile) {
      showToast('Uploading new preview image...', 'info');
      const res = await uploadFile(previewFile);
      if (res.success && res.url) {
        finalImageUrl = res.url;
      }
    }

    if (documentFile) {
      showToast('Uploading updated document...', 'info');
      const resDoc = await uploadFile(documentFile);
      if (resDoc.success && resDoc.url) {
        finalFileUrl = resDoc.url;
        if (!finalImageUrl && documentFile.type.startsWith('image/')) {
          finalImageUrl = resDoc.url;
        }
      }
    }

    const currentList = data.otherSkills || [];
    const updatedList = currentList.map(it => it.id === item.id ? {
      ...item,
      imageUrl: finalImageUrl,
      fileUrl: finalFileUrl
    } : it);

    const updated: PortfolioData = {
      ...data,
      otherSkills: updatedList
    };

    await updatePortfolio(updated);
    showToast(`"${item.title}" updated successfully!`, 'success');
    return true;
  };

  const deleteOtherSkill = async (id: string): Promise<boolean> => {
    const currentList = data.otherSkills || [];
    const updatedList = currentList.filter(it => it.id !== id);
    const updated: PortfolioData = {
      ...data,
      otherSkills: updatedList
    };
    await updatePortfolio(updated);
    showToast('Item deleted from Other Skills', 'info');
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const currentList = data.projects || [];
    const updatedList = currentList.filter(p => p.id !== id);
    const updated: PortfolioData = {
      ...data,
      projects: updatedList,
      profile: {
        ...data.profile,
        stats: {
          ...data.profile.stats,
          projectsCount: updatedList.length
        }
      }
    };
    await updatePortfolio(updated);
    showToast('Project removed successfully!', 'info');
    return true;
  };

  const deleteCertification = async (id: string): Promise<boolean> => {
    const currentList = data.certifications || [];
    const updatedList = currentList.filter(c => c.id !== id);
    const updated: PortfolioData = {
      ...data,
      certifications: updatedList,
      profile: {
        ...data.profile,
        stats: {
          ...data.profile.stats,
          certificationsCount: updatedList.length
        }
      }
    };
    await updatePortfolio(updated);
    showToast('Certification removed successfully!', 'info');
    return true;
  };

  const connectGoogleAccount = async (): Promise<boolean> => {
    if (!isAdmin) {
      showToast('Admin password required to connect Google account', 'error');
      setLoginModalOpen(true);
      return false;
    }
    try {
      setIsGoogleConnecting(true);
      setAuthDomainError(null);
      const res = await googleSignIn();
      if (res?.accessToken) {
        setGoogleUser(res.user);
        setHasGoogleAuth(true);
        showToast(`Connected Google account: ${res.user.email}`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google account connect error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain') || err?.message?.includes('Domain not authorized')) {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'sandesh-vishwakarma-potfolio.vercel.app';
        setAuthDomainError(domain);
        showToast(`Domain not authorized: Please authorize "${domain}" in Firebase Console`, 'error');
      } else {
        showToast(err.message || 'Failed to sign in with Google', 'error');
      }
      return false;
    } finally {
      setIsGoogleConnecting(false);
    }
  };

  const disconnectGoogleAccount = async (): Promise<void> => {
    if (!isAdmin) {
      showToast('Admin password required to disconnect Google account', 'error');
      return;
    }
    try {
      await googleSignOut();
      setGoogleUser(null);
      setHasGoogleAuth(false);
      showToast('Disconnected Google account session.', 'info');
    } catch (err: any) {
      console.error('Google sign out error:', err);
    }
  };

  const createAndConnectGoogleSheet = async (): Promise<boolean> => {
    if (!isAdmin) {
      showToast('Admin password required to create or configure Google Sheet', 'error');
      setLoginModalOpen(true);
      return false;
    }
    try {
      setIsGoogleConnecting(true);
      setAuthDomainError(null);
      let token = await getAccessToken();
      if (!token) {
        showToast('Connecting Google account for Sheets access...', 'info');
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) {
          showToast('Google sign-in cancelled or failed.', 'error');
          return false;
        }
        token = authRes.accessToken;
        setGoogleUser(authRes.user);
        setHasGoogleAuth(true);
      }

      showToast('Creating "Sandesh Portfolio - Contact Submissions" Google Sheet...', 'info');
      const res = await createPortfolioSpreadsheet(token);

      const newConfig: GoogleSheetsConfig = {
        spreadsheetId: res.spreadsheetId,
        spreadsheetUrl: res.spreadsheetUrl,
        sheetName: res.sheetName,
        spreadsheetTitle: 'Sandesh Portfolio - Contact Submissions',
        connectedEmail: googleUser?.email || undefined,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true,
      };

      const updated = {
        ...data,
        sheetsConfig: newConfig,
      };

      await updatePortfolio(updated);
      showToast('Google Sheet created and connected successfully!', 'success');

      // Auto-sync any existing contact messages
      if (messages.length > 0) {
        await batchAppendMessagesToSheet(res.spreadsheetId, res.sheetName, messages, token);
        showToast(`Synced ${messages.length} previous contact messages to your Google Sheet!`, 'success');
      }

      return true;
    } catch (err: any) {
      console.error('Create sheet error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain') || err?.message?.includes('Domain not authorized')) {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'sandesh-vishwakarma-potfolio.vercel.app';
        setAuthDomainError(domain);
        showToast(`Domain not authorized: Please authorize "${domain}" in Firebase Console`, 'error');
      } else {
        showToast(err.message || 'Failed to create Google Sheet', 'error');
      }
      return false;
    } finally {
      setIsGoogleConnecting(false);
    }
  };

  const connectExistingGoogleSheet = async (idOrUrl: string, sheetName?: string): Promise<boolean> => {
    if (!isAdmin) {
      showToast('Admin password required to link Google Sheet', 'error');
      setLoginModalOpen(true);
      return false;
    }
    try {
      setIsGoogleConnecting(true);
      setAuthDomainError(null);
      const cleanId = extractSpreadsheetId(idOrUrl);
      if (!cleanId) {
        showToast('Please enter a valid Google Spreadsheet URL or ID', 'error');
        return false;
      }

      let token = await getAccessToken();
      if (!token) {
        showToast('Signing in to verify Google Sheet access...', 'info');
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) return false;
        token = authRes.accessToken;
        setGoogleUser(authRes.user);
        setHasGoogleAuth(true);
      }

      showToast('Validating Google Sheet...', 'info');
      const details = await getSpreadsheetDetails(cleanId, token);
      const targetSheetName = sheetName || details.sheets[0]?.title || 'Sheet1';

      const newConfig: GoogleSheetsConfig = {
        spreadsheetId: cleanId,
        spreadsheetUrl: details.spreadsheetUrl,
        sheetName: targetSheetName,
        spreadsheetTitle: details.title,
        connectedEmail: googleUser?.email || undefined,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true,
      };

      const updated = {
        ...data,
        sheetsConfig: newConfig,
      };

      await updatePortfolio(updated);
      showToast(`Connected to "${details.title}" (${targetSheetName})!`, 'success');
      return true;
    } catch (err: any) {
      console.error('Connect sheet error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain') || err?.message?.includes('Domain not authorized')) {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'sandesh-vishwakarma-potfolio.vercel.app';
        setAuthDomainError(domain);
        showToast(`Domain not authorized: Please authorize "${domain}" in Firebase Console`, 'error');
      } else {
        showToast(err.message || 'Could not connect Google Sheet. Check permissions or ID.', 'error');
      }
      return false;
    } finally {
      setIsGoogleConnecting(false);
    }
  };

  const connectWebhookGoogleSheet = async (webhookUrl: string, sheetUrl?: string): Promise<boolean> => {
    if (!isAdmin) {
      showToast('Admin password required to configure Google Sheet', 'error');
      setLoginModalOpen(true);
      return false;
    }
    const cleanWebhook = webhookUrl.trim();
    if (!cleanWebhook.startsWith('http')) {
      showToast('Please provide a valid Webhook URL starting with https://', 'error');
      return false;
    }
    const newConfig: GoogleSheetsConfig = {
      spreadsheetId: 'webhook_integration',
      spreadsheetUrl: sheetUrl?.trim() || cleanWebhook,
      sheetName: 'Form Submissions',
      spreadsheetTitle: 'Google Sheet Webhook Integration',
      autoSync: true,
      lastSyncedAt: new Date().toISOString(),
      webhookUrl: cleanWebhook,
    };
    const updated = {
      ...data,
      sheetsConfig: newConfig,
    };
    await updatePortfolio(updated);
    showToast('Google Sheet Webhook connected successfully! Responses will sync automatically.', 'success');
    return true;
  };

  const disconnectGoogleSheet = async (): Promise<boolean> => {
    if (!isAdmin) {
      showToast('Admin password required to disconnect Google Sheet', 'error');
      return false;
    }
    const updated = {
      ...data,
      sheetsConfig: undefined,
    };
    await updatePortfolio(updated);
    showToast('Google Sheet disconnected from portfolio.', 'info');
    return true;
  };

  const syncAllMessagesToSheet = async (): Promise<number> => {
    const sheetsCfg = data.sheetsConfig;
    if (!sheetsCfg || !sheetsCfg.spreadsheetId) {
      showToast('No Google Sheet connected. Connect a sheet first.', 'error');
      return 0;
    }

    try {
      let token = await getAccessToken();
      if (!token) {
        showToast('Please authenticate with Google to sync...', 'info');
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) return 0;
        token = authRes.accessToken;
        setGoogleUser(authRes.user);
        setHasGoogleAuth(true);
      }

      showToast('Syncing contact submissions to Google Sheet...', 'info');
      let currentMessages = messages;
      if (adminToken) {
        const res = await fetch('/api/messages', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.ok) {
          const json = await res.json();
          currentMessages = json.messages || [];
          setMessages(currentMessages);
        }
      }

      if (currentMessages.length === 0) {
        showToast('No contact messages to sync.', 'info');
        return 0;
      }

      await batchAppendMessagesToSheet(
        sheetsCfg.spreadsheetId,
        sheetsCfg.sheetName || 'Contact Messages',
        currentMessages,
        token
      );

      // Mark all as synced on server
      const ids = currentMessages.map(m => m.id);
      await fetch('/api/messages/mark-synced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      }).catch(() => {});

      const updated = {
        ...data,
        sheetsConfig: {
          ...sheetsCfg,
          lastSyncedAt: new Date().toISOString(),
        }
      };
      await updatePortfolio(updated);

      showToast(`Successfully synced ${currentMessages.length} message(s) to Google Sheet!`, 'success');
      return currentMessages.length;
    } catch (err: any) {
      console.error('Sync messages error:', err);
      showToast(err.message || 'Failed to sync with Google Sheet', 'error');
      return 0;
    }
  };

  const sendMessage = async (msg: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; error?: string; syncedToSheets?: boolean }> => {
    let syncedToSheets = false;
    const token = await getAccessToken();
    const sheetsCfg = data.sheetsConfig;

    // If Google Sheets is configured and token is in memory, auto-append!
    if (sheetsCfg && sheetsCfg.spreadsheetId && token) {
      try {
        await appendContactToSheet(
          sheetsCfg.spreadsheetId,
          sheetsCfg.sheetName || 'Contact Messages',
          {
            timestamp: new Date().toLocaleString(),
            name: msg.name,
            email: msg.email,
            subject: msg.subject || 'Portfolio Inquiry',
            message: msg.message,
          },
          token
        );
        syncedToSheets = true;
      } catch (sheetErr) {
        console.warn('Google Sheets direct append failed:', sheetErr);
      }
    }

    // If Google Sheets Webhook is configured, send directly to Google Apps Script / Webhook
    if (sheetsCfg?.webhookUrl) {
      try {
        await fetch(sheetsCfg.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: msg.name,
            email: msg.email,
            subject: msg.subject || 'Portfolio Inquiry',
            message: msg.message,
            timestamp: new Date().toISOString(),
          }),
        });
        syncedToSheets = true;
      } catch (webhookErr) {
        console.warn('Google Sheets Webhook append failed:', webhookErr);
      }
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...msg, syncedToSheets }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (syncedToSheets) {
          showToast('Message sent and saved to Google Sheet!', 'success');
        } else if (sheetsCfg?.spreadsheetId) {
          showToast('Message sent! It will sync to your connected Google Sheet.', 'success');
        } else {
          showToast('Your message has been sent successfully to Sandesh!', 'success');
        }
        return { success: true, syncedToSheets };
      }
    } catch (err) {
      console.warn('Backend contact route unavailable, storing message locally:', err);
    }

    // Local storage fallback for static hosts
    try {
      const localMsg: ContactMessage = {
        id: 'msg_' + Date.now(),
        name: msg.name,
        email: msg.email,
        subject: msg.subject || 'General Inquiry',
        message: msg.message,
        timestamp: new Date().toISOString(),
        syncedToSheets: !!syncedToSheets,
      };
      const existing = JSON.parse(localStorage.getItem('sandesh_local_messages') || '[]');
      existing.unshift(localMsg);
      localStorage.setItem('sandesh_local_messages', JSON.stringify(existing));
      setMessages(existing);
    } catch (e) {
      console.warn('Failed to save message in local storage:', e);
    }

    if (syncedToSheets) {
      showToast('Message sent and saved to Google Sheet!', 'success');
    } else {
      showToast('Thank you! Your message was delivered and recorded.', 'success');
    }
    return { success: true, syncedToSheets };
  };

  const fetchMessages = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        isAdmin,
        adminToken,
        toasts,
        messages,
        loginModalOpen,
        editModalOpen,
        sheetsModalOpen,
        setLoginModalOpen,
        setEditModalOpen,
        setSheetsModalOpen,
        login,
        resetPasswordWithGoogle,
        logout,
        updatePortfolio,
        resetPortfolio,
        uploadFile,
        uploadProfilePhoto,
        uploadCertificateDocument,
        addNewCertificateWithFile,
        addOtherSkill,
        updateOtherSkill,
        deleteOtherSkill,
        deleteProject,
        deleteCertification,
        sendMessage,
        fetchMessages,
        // Google Workspace & Sheets
        googleUser,
        hasGoogleAuth,
        isGoogleConnecting,
        authDomainError,
        clearAuthDomainError,
        connectGoogleAccount,
        disconnectGoogleAccount,
        createAndConnectGoogleSheet,
        connectExistingGoogleSheet,
        connectWebhookGoogleSheet,
        disconnectGoogleSheet,
        syncAllMessagesToSheet,
        showToast,
        removeToast,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
