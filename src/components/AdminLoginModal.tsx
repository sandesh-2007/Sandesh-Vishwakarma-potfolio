import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { googleSignIn } from '../services/googleAuth';
import { 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, resetPasswordWithGoogle, data, showToast, theme } = usePortfolio();
  const isLight = theme === 'light';
  
  // View states: 'login' | 'forgot'
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  // Login form state
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<'verify' | 'reset'>('verify');
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!loginModalOpen) return null;

  const ownerEmail = (data.profile.email || 'sandesh.vishwakarma2007@gmail.com').toLowerCase().trim();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setErrorMsg('');

    const res = await login(password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid administrator password.');
    } else {
      setPassword('');
    }
  };

  const handleGoogleVerify = async () => {
    setIsVerifyingGoogle(true);
    setErrorMsg('');

    try {
      const result = await googleSignIn();
      if (!result || !result.user) {
        throw new Error('Google authentication cancelled.');
      }

      const signedInEmail = (result.user.email || '').toLowerCase().trim();

      if (signedInEmail !== ownerEmail) {
        setErrorMsg(`Unauthorized email (${signedInEmail}). Only the verified portfolio owner account is permitted to reset the password.`);
        setIsVerifyingGoogle(false);
        return;
      }

      // Verification successful!
      setVerifiedEmail(signedInEmail);
      setGoogleAccessToken(result.accessToken || '');
      setForgotStep('reset');
      showToast('Identity verified as Sandesh! Please set your new password.', 'success');
    } catch (err: any) {
      console.error('Google verification error:', err);
      setErrorMsg(err.message || 'Google verification failed. Please try again.');
    } finally {
      setIsVerifyingGoogle(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setIsResetting(true);
    const res = await resetPasswordWithGoogle(newPassword, verifiedEmail, googleAccessToken);
    setIsResetting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update password.');
    } else {
      // Reset form states
      setView('login');
      setForgotStep('verify');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setVerifiedEmail('');
      setGoogleAccessToken('');
    }
  };

  const handleClose = () => {
    setLoginModalOpen(false);
    setView('login');
    setForgotStep('verify');
    setErrorMsg('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-7 shadow-2xl shadow-orange-950/40"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* VIEW 1: NORMAL ADMIN LOGIN */}
          {view === 'login' && (
            <>
              {/* Icon and Title */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Admin Authentication
                  </h3>
                  <p className="text-xs text-orange-400 font-mono">
                    Protected Portfolio Edit Suite
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed">
                Please enter your administrator passcode to access the live content management dashboard.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-medium text-zinc-300">
                      Admin Security Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      placeholder="Enter administrator password..."
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-900 transition-colors"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4 text-orange-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying credentials...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authenticate & Open Edit Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Forgot Password Trigger Link */}
                <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setForgotStep('verify');
                      setErrorMsg('');
                    }}
                    className="text-xs text-zinc-400 hover:text-orange-400 transition-colors font-medium"
                  >
                    Forgot Admin Password?
                  </button>

                  <span className="text-[11px] text-zinc-600 font-mono">
                    Owner Protected
                  </span>
                </div>
              </form>
            </>
          )}

          {/* VIEW 2: FORGOT PASSWORD FLOW (GOOGLE IDENTITY VERIFICATION) */}
          {view === 'forgot' && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Reset Admin Password
                  </h3>
                  <p className="text-xs text-orange-400 font-mono">
                    Google Identity Verification
                  </p>
                </div>
              </div>

              {/* STEP A: GOOGLE SIGN-IN VERIFICATION */}
              {forgotStep === 'verify' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-colors ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  }`}>
                    <p className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      Owner Verification Required
                    </p>
                    <p className={`leading-relaxed text-[11px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      To prevent unauthorized access, password recovery is restricted exclusively to the portfolio owner's registered Google account.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGoogleVerify}
                    disabled={isVerifyingGoogle}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-zinc-900 bg-white hover:bg-zinc-100 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isVerifyingGoogle ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
                        <span>Verifying Google Account...</span>
                      </>
                    ) : (
                      <>
                        {/* Official Google 'G' Logo */}
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>Verify Identity with Google</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setErrorMsg('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Login</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP B: ENTER NEW PASSWORD FORM */}
              {forgotStep === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {/* Verified badge */}
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-emerald-300">
                        Owner Identity Verified
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400/90 truncate">
                        {verifiedEmail}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                      New Administrator Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        minLength={6}
                        placeholder="Enter new password (min 6 chars)..."
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-900 transition-colors"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-orange-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Repeat new password..."
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-900 transition-colors"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-orange-400" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isResetting || !newPassword || !confirmPassword}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isResetting ? (
                      <span>Saving new password...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Save New Password & Log In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setForgotStep('verify');
                        setErrorMsg('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Cancel & Return to Login</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
