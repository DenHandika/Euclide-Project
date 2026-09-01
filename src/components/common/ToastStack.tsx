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
        let bg = 'bg-[#FFFFFF] text-[#13224E] border-[#13224E]';
        let icon = <Info className="w-4 h-4 text-[#1B3B8C] shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-[#FFFFFF] text-[#13224E] border-[#1B8A5A]';
          icon = <CheckCircle2 className="w-4 h-4 text-[#1B8A5A] shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-[#FFFFFF] text-[#13224E] border-[#D0342C]';
          icon = <AlertCircle className="w-4 h-4 text-[#D0342C] shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-[#FFFFFF] text-[#13224E] border-[#EFA93B]';
          icon = <AlertTriangle className="w-4 h-4 text-[#C8831A] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3 border-2 text-xs font-medium transition-all animate-in slide-in-from-right-5 ${bg}`}
          >
            <div className="flex items-center space-x-2.5 mr-2">
              {icon}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#637096] hover:text-[#13224E] p-1"
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
