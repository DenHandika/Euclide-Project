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
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, switchUser, signInWithGoogle } = useApp();
  const [customEmail, setCustomEmail] = useState('');

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
    const u = MOCK_USERS.find((x) => x.id === userId);
    if (u) {
      switchUser(u);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#13224E] text-white font-serif font-black text-base mb-1">
            EU
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13224E] tracking-tight">
            Portal Verifikasi EUCLIDE
          </h2>
          <p className="text-xs text-[#637096] font-sans">
            Sistem Autentikasi Peserta Ujian CBT & Pengelola Akademik
          </p>
        </div>

        {/* Examination Registration Card */}
        <div className="bg-[#FFFFFF] border-2 border-[#13224E] p-6 sm:p-8 space-y-6">
          {/* Header strip */}
          <div className="border-b border-[#E4E4DC] pb-2 flex items-center justify-between font-mono text-[10px] text-[#637096]">
            <span>LEMBAR AUTENTIKASI PESERTA</span>
            <span className="font-bold text-[#13224E]">TAHUN AKADEMIK 2026</span>
          </div>

          {/* 1. Google SSO Sign In */}
          <div>
            <label className="block text-xs font-semibold text-[#13224E] mb-2 font-sans">
              Masuk dengan Akun Google Terdaftar
            </label>
            <form onSubmit={handleGoogleLogin} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-[#637096] absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="nama.siswa@siswa.euclide.edu"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAFAF7] border border-[#CECEC2] text-xs text-[#13224E] focus:outline-none focus:border-[#1B3B8C] font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] font-medium text-xs py-2 px-4 border border-[#13224E] transition"
              >
                {/* Google G icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Masuk via Google SSO (Auto Whitelist)</span>
              </button>
            </form>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E4E4DC]"></div>
            <span className="flex-shrink mx-3 text-[9px] font-mono text-[#9EABC7] uppercase tracking-wider">
              Akses Cepat Demo Sesuai Peran
            </span>
            <div className="flex-grow border-t border-[#E4E4DC]"></div>
          </div>

          {/* 2. Demo Role Shortcuts */}
          <div className="space-y-2">
            <button
              onClick={() => handleRoleQuickLogin('siswa', '/tryouts')}
              className="w-full flex items-center justify-between p-2.5 border border-[#E4E4DC] hover:border-[#1B3B8C] bg-[#FAFAF7] transition group text-left"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center font-mono text-xs">
                  S
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#13224E]">Masuk sebagai Siswa</div>
                  <div className="text-[10px] font-mono text-[#637096]">Raihan Pratama (Aktif)</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B3B8C] group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('tentor', '/tentor/grading')}
              className="w-full flex items-center justify-between p-2.5 border border-[#E4E4DC] hover:border-[#EFA93B] bg-[#FAFAF7] transition group text-left"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-[#EFA93B] text-[#13224E] flex items-center justify-center font-mono text-xs font-bold">
                  T
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#13224E]">Masuk sebagai Tentor</div>
                  <div className="text-[10px] font-mono text-[#637096]">Ahmad Fauzi, S.Si.</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8831A] group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => handleRoleQuickLogin('admin', '/admin')}
              className="w-full flex items-center justify-between p-2.5 border border-[#E4E4DC] hover:border-[#13224E] bg-[#FAFAF7] transition group text-left"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-[#13224E] text-white flex items-center justify-center font-mono text-xs">
                  A
                </span>
                <div>
                  <div className="text-xs font-semibold text-[#13224E]">Masuk sebagai Super-Admin</div>
                  <div className="text-[10px] font-mono text-[#637096]">Dr. Hendra Wijaya (Buku Kas)</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#13224E] group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* 3. Account Status Simulators */}
          <div className="pt-2 border-t border-[#E4E4DC] space-y-2">
            <div className="text-[10px] font-mono text-[#637096] uppercase tracking-wider flex justify-between">
              <span>Simulasi Status Akun Khusus:</span>
              <span className="text-[#C8831A]">Uji Banner</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button
                onClick={() => handleUserSelect('user-siswa-suspended')}
                className="p-2 text-left border border-[#D0342C]/40 bg-[#FDECEB] text-[#D0342C]"
              >
                <div className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-[#D0342C]" />
                  <span>SPP Tertunggak</span>
                </div>
                <div className="text-[9px] opacity-80">Dimas (Suspended)</div>
              </button>

              <button
                onClick={() => handleUserSelect('user-siswa-graduated')}
                className="p-2 text-left border border-[#CECEC2] bg-[#F3F3ED] text-[#13224E]"
              >
                <div className="font-bold flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-[#13224E]" />
                  <span>Alumni Lulus</span>
                </div>
                <div className="text-[9px] opacity-80">Siti Nurhaliza</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-[#9EABC7]">
          Kerahasiaan data peserta terlindungi standar keamanan client-side.
        </div>
      </div>
    </div>
  );
}
