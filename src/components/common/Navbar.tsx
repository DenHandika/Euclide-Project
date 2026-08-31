'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  BookOpen,
  LayoutDashboard,
  CreditCard,
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
  GraduationCap,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Navigation Items per Role
  const navLinksByRole = {
    siswa: [
      { name: 'Katalog Tryout', href: '/tryouts', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Drilling Modul', href: '/drilling', icon: <Layers className="w-4 h-4" /> },
      { name: 'Rasionalisasi SNBT', href: '/exam/to-utbk-national-01/result', icon: <Award className="w-4 h-4" /> },
    ],
    tentor: [
      { name: 'Koreksi Esai', href: '/tentor/grading', icon: <FileCheck2 className="w-4 h-4" /> },
      { name: 'Bank Soal (KaTeX)', href: '/admin/questions', icon: <Compass className="w-4 h-4" /> },
      { name: 'Analitik Subtest', href: '/tentor/analytics', icon: <Award className="w-4 h-4" /> },
    ],
    admin: [
      { name: 'Dashboard Kas', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: 'Import Excel SPP', href: '/admin/payments', icon: <FileSpreadsheet className="w-4 h-4" /> },
      { name: 'Kuota & Batch', href: '/admin/classes', icon: <Layers className="w-4 h-4" /> },
      { name: 'Roster Siswa', href: '/admin/students', icon: <Users className="w-4 h-4" /> },
      { name: 'Bank Soal', href: '/admin/questions', icon: <Compass className="w-4 h-4" /> },
    ],
  };

  const currentNav = navLinksByRole[currentRole] || navLinksByRole.siswa;

  // Account status notifications
  const isSuspended = currentUser.status === 'suspended';
  const isGraduated = currentUser.status === 'graduated';

  return (
    <>
      {/* Top Notification Banner for Inactive/Suspended/Graduated Accounts */}
      {(isSuspended || isGraduated) && (
        <div
          className={`w-full py-2 px-4 text-xs font-semibold flex items-center justify-between transition-all ${
            isSuspended
              ? 'bg-rose-600 text-white'
              : 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>
              {isSuspended && (
                <>
                  <strong>Pemberitahuan Akun Ditangguhkan:</strong> Akun Anda terdeteksi memiliki tunggakan SPP.{' '}
                  <span className="underline font-normal">Akses CBT Simulasi dibatasi sementara hingga pelunasan kasir.</span>
                </>
              )}
              {isGraduated && (
                <>
                  <strong>Status Alumni / Lulus:</strong> Akun ini telah menyelesaikan periode bimbingan 2025. Akses tryout dalam mode arsip read-only.
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
                  <span className="font-extrabold text-base tracking-tighter">EU</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg text-navy tracking-tight group-hover:text-blue-600 transition">
                    EUCLIDE
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-1">
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
                      className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs'
                          : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right User & CTA Area */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Role Indicator Badge */}
              <div className="flex items-center space-x-2 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentRole === 'admin'
                      ? 'bg-rose-500'
                      : currentRole === 'tentor'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase text-slate-700 leading-none">
                    {currentRole}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 truncate max-w-[130px] leading-tight">
                    {currentUser.name}
                  </div>
                </div>
              </div>

              {/* Role CTA button */}
              {currentRole === 'siswa' && (
                <Link
                  href="/exam/to-utbk-national-01"
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ujian CBT Live</span>
                </Link>
              )}

              {currentRole === 'admin' && (
                <Link
                  href="/admin/payments"
                  className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Import Kas Excel</span>
                </Link>
              )}

              {currentRole === 'tentor' && (
                <Link
                  href="/tentor/grading"
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-amber-600/20 transition transform hover:-translate-y-0.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Koreksi Esai</span>
                </Link>
              )}

              <Link
                href="/login"
                className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-100 transition"
                title="Ganti / Logout"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                  {currentRole}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {currentNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex space-x-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ganti Akun / Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
