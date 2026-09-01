'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  BookOpen,
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Award,
  Layers,
  FileCheck2,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Links per Role
  const navLinksByRole = {
    siswa: [
      { name: 'Katalog Tryout', href: '/tryouts', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Modul Latihan', href: '/drilling', icon: <Layers className="w-4 h-4" /> },
      { name: 'Rasionalisasi SNBT', href: '/exam/to-utbk-national-01/result', icon: <Award className="w-4 h-4" /> },
    ],
    tentor: [
      { name: 'Koreksi Esai', href: '/tentor/grading', icon: <FileCheck2 className="w-4 h-4" /> },
      { name: 'Bank Soal KaTeX', href: '/admin/questions', icon: <Compass className="w-4 h-4" /> },
      { name: 'Analisis Subtest', href: '/tentor/analytics', icon: <Award className="w-4 h-4" /> },
    ],
    admin: [
      { name: 'Buku Kas & Ringkasan', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: 'Import Excel SPP', href: '/admin/payments', icon: <FileSpreadsheet className="w-4 h-4" /> },
      { name: 'Kuota & Batch', href: '/admin/classes', icon: <Layers className="w-4 h-4" /> },
      { name: 'Roster Siswa', href: '/admin/students', icon: <Users className="w-4 h-4" /> },
      { name: 'Bank Soal', href: '/admin/questions', icon: <Compass className="w-4 h-4" /> },
    ],
  };

  const currentNav = navLinksByRole[currentRole] || navLinksByRole.siswa;

  const isSuspended = currentUser.status === 'suspended';
  const isGraduated = currentUser.status === 'graduated';
  const isExamScreen = pathname.startsWith('/exam/') && !pathname.includes('/result');

  if (isExamScreen) {
    return null;
  }

  return (
    <>
      {/* Top Status Notification Banner */}
      {(isSuspended || isGraduated) && (
        <div
          className={`w-full py-2 px-4 text-xs font-medium border-b flex items-center justify-between transition-all ${
            isSuspended
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              {isSuspended && (
                <>
                  <strong>Pemberitahuan Akun:</strong> Akses CBT simulasi ditangguhkan sementara karena kewajiban administrasi SPP. Hubungi kasir/admin.
                </>
              )}
              {isGraduated && (
                <>
                  <strong>Arsip Alumni:</strong> Akun ini telah menyelesaikan masa bimbingan. Mode akses arsip evaluasi aktif.
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition">
                  EU
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition">
                    EUCLIDE
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    CBT & Bimbel System
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1">
                {currentNav.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right User Area & Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Role Indicator Badge */}
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentRole === 'admin'
                      ? 'bg-slate-900'
                      : currentRole === 'tentor'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div className="text-left">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block leading-none">
                    {currentRole}
                  </span>
                  <span className="text-slate-800 font-bold text-xs truncate max-w-[120px] block">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {currentRole === 'siswa' && (
                <Link
                  href="/exam/to-utbk-national-01"
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Mulai CBT</span>
                </Link>
              )}

              {currentRole === 'admin' && (
                <Link
                  href="/admin/payments"
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Import Excel</span>
                </Link>
              )}

              {currentRole === 'tentor' && (
                <Link
                  href="/tentor/grading"
                  className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Koreksi Esai</span>
                </Link>
              )}

              <Link
                href="/login"
                className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-100 transition"
                title="Ganti Akun / Logout"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-500 capitalize">{currentRole} • {currentUser.email}</div>
              </div>
            </div>

            <div className="space-y-1">
              {currentNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Ganti Akun / Logout
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
