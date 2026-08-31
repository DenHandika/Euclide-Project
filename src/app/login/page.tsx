'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MOCK_USERS } from '@/data/mockData';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Mail,
  ArrowRight,
  UserCheck,
  Lock,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, switchRole, switchUser, signInWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>('user-siswa-active');

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = customEmail.trim() || 'raihan.pratama@siswa.euclide.edu';
    signInWithGoogle(emailToUse);
    router.push('/tryouts');
  };

  const handleRoleQuickLogin = (role: 'admin' | 'tentor' | 'siswa', targetPath: string) => {
    switchRole(role);
    router.push(targetPath);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedDemoUser(userId);
    const u = MOCK_USERS.find((x) => x.id === userId);
    if (u) {
      switchUser(u);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-blue-600 text-white shadow-lg shadow-blue-500/20 mb-1">
            <span className="font-extrabold text-xl tracking-tight">EU</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk ke Portal EUCLIDE
          </h2>
          <p className="text-xs text-slate-500">
            Sistem Autentikasi Terintegrasi SSO Google & Akses Multi-Peran
          </p>
        </div>

        {/* Main Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          {/* 1. Sign In With Google Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Masuk Cepat dengan Akun Google
            </label>
            <form onSubmit={handleGoogleLogin} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="nama.siswa@siswa.euclide.edu"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-2xs transition hover:border-slate-400 active:bg-slate-100"
              >
                {/* Simulated Google "G" Icon */}
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
                <span>Lanjutkan dengan Google SSO (Auto Whitelist)</span>
              </button>
            </form>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Atau Pilih Mode Cepat Demo
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* 2. Quick Demo Role Shortcuts */}
          <div className="space-y-2.5">
            <button
              onClick={() => handleRoleQuickLogin('siswa', '/tryouts')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Login sebagai Siswa</div>
                  <div className="text-[10px] text-blue-600">Muhammad Raihan (Aktif)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition transform" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('tentor', '/tentor/grading')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-600 text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Login sebagai Tentor</div>
                  <div className="text-[10px] text-amber-700">Ahmad Fauzi, S.Si. (Koreksi & Soal)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition transform" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('admin', '/admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-900 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Login sebagai Super-Admin</div>
                  <div className="text-[10px] text-slate-500">Dr. Hendra Wijaya (Kas & Excel)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition transform" />
            </button>
          </div>

          {/* 3. Account Status Testing Box */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Uji Simulasi Akun Khusus:</span>
              <span className="text-[10px] text-slate-400 font-normal">Periksa Banner & Hak Akses</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUserSelect('user-siswa-suspended')}
                className="p-2 text-left rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-800 text-[11px] font-medium"
              >
                <div className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Akun Tertunggak SPP</span>
                </div>
                <div className="text-[9px] text-rose-600">Dimas (Suspended)</div>
              </button>

              <button
                onClick={() => handleUserSelect('user-siswa-graduated')}
                className="p-2 text-left rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-800 text-[11px] font-medium"
              >
                <div className="font-bold flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-purple-600" />
                  <span>Akun Alumni Lulus</span>
                </div>
                <div className="text-[9px] text-purple-600">Siti Nurhaliza (Expired)</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Dilindungi oleh Sistem Pengawas CBT Euclide & Enkripsi Keamanan Client-Side.
        </div>
      </div>
    </div>
  );
}
