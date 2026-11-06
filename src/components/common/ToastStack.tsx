'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastStack() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none font-sans text-xs">
      {toasts.map((toast) => {
        let bg = 'bg-white text-[#263D5F] border-slate-200';
        let icon = <Info className="w-4 h-4 text-[#1B3B8C] shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-white text-[#263D5F] border-emerald-200';
          icon = <CheckCircle2 className="w-4 h-4 text-[#1B8A5A] shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-white text-[#263D5F] border-rose-200';
          icon = <AlertCircle className="w-4 h-4 text-[#D0342C] shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-white text-[#263D5F] border-amber-200';
          icon = <AlertTriangle className="w-4 h-4 text-[#C8831A] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-2 rounded-2xl p-3 border text-sm font-medium shadow-lg transition-all animate-in slide-in-from-right-5 ${bg}`}
          >
            <div className="flex items-center space-x-2.5 mr-2">
              {icon}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              aria-label="Tutup pemberitahuan"
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-[#263D5F] p-1 rounded-xl min-h-11"
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
