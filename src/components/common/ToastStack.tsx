'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastStack() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-4 h-4 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-900/95 text-emerald-100 border-emerald-700';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900/95 text-rose-100 border-rose-700';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900/95 text-amber-100 border-amber-700';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md text-xs font-medium transition-all duration-300 animate-in slide-in-from-right-5 ${bg}`}
          >
            <div className="flex items-center space-x-2.5 mr-2">
              {icon}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastStack;
