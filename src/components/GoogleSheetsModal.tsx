import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Table, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Link as LinkIcon, 
  Trash2, 
  FileSpreadsheet, 
  Send,
  Database,
  ArrowRight,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';

export const GoogleSheetsModal: React.FC = () => {
  const { 
    sheetsModalOpen, 
    setSheetsModalOpen, 
    isAdmin,
    login,
    data, 
    googleUser, 
    hasGoogleAuth, 
    isGoogleConnecting, 
    connectGoogleAccount, 
    disconnectGoogleAccount, 
    createAndConnectGoogleSheet, 
    connectExistingGoogleSheet, 
    disconnectGoogleSheet, 
    syncAllMessagesToSheet,
    messages,
    sendMessage,
    showToast
  } = usePortfolio();

  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  const [mode, setMode] = useState<'status' | 'link_existing'>('status');
  const [existingInput, setExistingInput] = useState('');
  const [tabInput, setTabInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  if (!sheetsModalOpen) return null;

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) return;
    setIsVerifyingAdmin(true);
    setAdminError('');

    const res = await login(adminPassword);
    setIsVerifyingAdmin(false);

    if (!res.success) {
      setAdminError(res.error || 'Incorrect administrator password');
    } else {
      setAdminPassword('');
      showToast('Admin access granted! You can now configure Google Sheets.', 'success');
    }
  };

  const sheetsConfig = data.sheetsConfig;
  const isConnected = !!(sheetsConfig && sheetsConfig.spreadsheetId);

  const handleCreateNew = async () => {
    await createAndConnectGoogleSheet();
  };

  const handleLinkExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingInput.trim()) {
      showToast('Please provide a Google Spreadsheet URL or ID', 'error');
      return;
    }
    const success = await connectExistingGoogleSheet(existingInput.trim(), tabInput.trim() || undefined);
    if (success) {
      setMode('status');
      setExistingInput('');
      setTabInput('');
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    await syncAllMessagesToSheet();
    setIsSyncing(false);
  };

  const handleTestAppend = async () => {
    setIsTesting(true);
    try {
      await sendMessage({
        name: 'Test Visitor (Verification)',
        email: 'test@example.com',
        subject: 'Google Sheets Integration Live Test',
        message: 'This is a test submission to verify that contact form responses automatically store in Google Sheets.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect this Google Sheet from your portfolio? New submissions will only be stored locally.')) {
      await disconnectGoogleSheet();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSheetsModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-8 text-zinc-200"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-orange-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Google Sheets Integration
                  {isConnected && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400">
                  Save all contact form submissions directly into your Google Spreadsheet
                </p>
              </div>
            </div>

            <button
              onClick={() => setSheetsModalOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            {!isAdmin ? (
              <div className="py-8 px-4 text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-950/40">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Admin Password Required
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Google Sheets synchronization and account connection are restricted to Sandesh. Please enter your administrator password to unlock sheet controls.
                  </p>
                </div>

                <form onSubmit={handleAdminUnlock} className="max-w-xs mx-auto space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Enter admin password..."
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        if (adminError) setAdminError('');
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-orange-500 text-center font-mono transition-colors"
                    />
                  </div>

                  {adminError && (
                    <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingAdmin || !adminPassword}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-md shadow-orange-950 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isVerifyingAdmin ? 'Verifying Password...' : 'Unlock Google Sheets Access'}</span>
                  </button>

                  <p className="text-[11px] text-zinc-500 font-mono">
                    Only the portfolio owner can connect their Google account
                  </p>
                </form>
              </div>
            ) : (
              <>
                {/* Google Account Authentication Section */}
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-semibold text-white">Google Workspace Authorization</span>
                </div>
                {hasGoogleAuth ? (
                  <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Authorized
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Auth Needed
                  </span>
                )}
              </div>

              {googleUser ? (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    {googleUser.photoURL ? (
                      <img
                        src={googleUser.photoURL}
                        alt={googleUser.displayName || 'Google User'}
                        className="w-8 h-8 rounded-full border border-zinc-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white">
                        {googleUser.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-white">{googleUser.displayName || 'Google Account'}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{googleUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!hasGoogleAuth && (
                      <button
                        onClick={() => connectGoogleAccount()}
                        disabled={isGoogleConnecting}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isGoogleConnecting ? 'Connecting...' : 'Re-authorize Token'}
                      </button>
                    )}
                    <button
                      onClick={() => disconnectGoogleAccount()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-zinc-400">
                    Sign in with your Google account to enable writing contact responses to Google Sheets.
                  </p>

                  {/* Official Google Sign-In Button */}
                  <button
                    onClick={() => connectGoogleAccount()}
                    disabled={isGoogleConnecting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>{isGoogleConnecting ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Connected Sheet Card */}
            {isConnected && sheetsConfig ? (
              <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      Connected Google Spreadsheet
                    </span>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Table className="w-4 h-4 text-emerald-400" />
                      {sheetsConfig.spreadsheetTitle || 'Sandesh Portfolio - Contact Submissions'}
                    </h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      Sheet Tab: <span className="text-zinc-200 font-bold">{sheetsConfig.sheetName}</span>
                    </p>
                  </div>

                  <a
                    href={sheetsConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all active:scale-95"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Columns Information */}
                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-[11px] font-mono text-zinc-400 block mb-2">
                    Stored Columns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Timestamp', 'Full Name', 'Email Address', 'Subject', 'Message Details', 'Message ID'].map((col) => (
                      <span
                        key={col}
                        className="px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Live Sync */}
                <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSyncAll}
                      disabled={isSyncing || isGoogleConnecting}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                      title="Batch sync all existing messages to Google Sheet"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : `Sync All Messages (${messages.length})`}</span>
                    </button>

                    <button
                      onClick={handleTestAppend}
                      disabled={isTesting}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                      title="Send a sample submission to test Google Sheet append"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isTesting ? 'Testing...' : 'Send Test Row'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            ) : mode === 'status' ? (
              /* No sheet connected yet options */
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-zinc-900/80 border border-dashed border-zinc-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No Google Sheet Connected Yet</h4>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      Connect your Google Sheet so every contact form submission is instantly stored in your cloud spreadsheet!
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleCreateNew}
                      disabled={isGoogleConnecting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isGoogleConnecting ? 'Setting up...' : 'Create & Link New Google Sheet'}</span>
                    </button>

                    <button
                      onClick={() => setMode('link_existing')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Link Existing Sheet URL/ID</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Link Existing Sheet Form */
              <form onSubmit={handleLinkExisting} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-orange-400" />
                    Link Existing Google Spreadsheet
                  </h4>
                  <button
                    type="button"
                    onClick={() => setMode('status')}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Google Spreadsheet URL or ID <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={existingInput}
                    onChange={(e) => setExistingInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-orange-500 text-xs text-white placeholder-zinc-500 font-mono outline-none"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Paste the full URL from your browser or just the alphanumeric Spreadsheet ID.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Sheet Tab Name (Optional, defaults to first tab)
                  </label>
                  <input
                    type="text"
                    value={tabInput}
                    onChange={(e) => setTabInput(e.target.value)}
                    placeholder="e.g. Contact Messages or Sheet1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-orange-500 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('status')}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGoogleConnecting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <span>{isGoogleConnecting ? 'Connecting...' : 'Connect Sheet'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Explanatory Banner */}
            <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/20 text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-orange-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                How It Works
              </p>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Jab bhi koi visitor contact form submit karega, uski details (Date, Name, Email, Subject aur Message) turant is Google Sheet me nayi row me save ho jayegi.
              </p>
            </div>
            </>
          )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500">
              Powered by Google Sheets API v4 & Firebase Auth
            </span>
            <button
              onClick={() => setSheetsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
