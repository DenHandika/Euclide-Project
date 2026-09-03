'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MOCK_USERS } from '@/data/mockData';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Mail,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Users,
  FileCheck2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, switchUser, signInWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = customEmail.trim() || 'raihan.pratama@siswa.euclide.edu';
    const success = signInWithGoogle(emailToUse);
    if (success) {
      router.push('/tryouts');
    }
  };

  const handleRoleQuickLogin = (role: 'admin' | 'tentor' | 'siswa', targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  const handleUserSelect = (userId: string) => {
    const u = MOCK_USERS.find((x) => x.id === userId);
    if (u) {
      switchUser(u);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans pb-24 md:pb-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-bold text-lg mb-1 shadow-md">
            EU
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal Masuk EUCLIDE
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Sistem Autentikasi Peserta Ujian CBT & Pengelola Bimbel
          </p>
        </div>

        {/* Examination Registration Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-card">
          {/* 1. Google SSO Sign In */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 font-sans">
              Masuk Akun Siswa Terdaftar
            </label>
            <form onSubmit={handleGoogleLogin} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="nama.siswa@siswa.euclide.edu"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-xs transition"
              >
                {/* Google G icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Masuk dengan Akun Google</span>
              </button>
            </form>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Atau Pilih Akses Cepat Demo
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* 2. Demo Role Shortcuts */}
          <div className="space-y-2.5">
            <button
              onClick={() => handleRoleQuickLogin('siswa', '/tryouts')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 transition group text-left shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Masuk sebagai Siswa</div>
                  <div className="text-[11px] text-slate-500">Raihan Pratama (Akun Aktif)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('tentor', '/tentor/grading')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/40 transition group text-left shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  T
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Masuk sebagai Tentor</div>
                  <div className="text-[11px] text-slate-500">Dr. Hendra Wijaya (Koreksi Esai)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('admin', '/admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-800 bg-slate-50/70 hover:bg-slate-100 transition group text-left shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Masuk sebagai Admin / Owner</div>
                  <div className="text-[11px] text-slate-500">Siti Rahmawati (Buku Kas & Kuota)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
