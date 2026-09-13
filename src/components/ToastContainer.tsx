import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
          let border = 'border-cyan-500/40 bg-slate-900/95';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
            border = 'border-emerald-500/40 bg-slate-900/95';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
            border = 'border-rose-500/40 bg-slate-900/95';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl ${border}`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-xs font-medium text-slate-100">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
