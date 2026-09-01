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
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Navigation Items per Role
  const navLinksByRole = {
    siswa: [
      { name: 'Katalog Tryout', href: '/tryouts', icon: <BookOpen className="w-3.5 h-3.5" /> },
      { name: 'Modul Latihan', href: '/drilling', icon: <Layers className="w-3.5 h-3.5" /> },
      { name: 'Rasionalisasi SNBT', href: '/exam/to-utbk-national-01/result', icon: <Award className="w-3.5 h-3.5" /> },
    ],
    tentor: [
      { name: 'Koreksi Esai', href: '/tentor/grading', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
      { name: 'Bank Soal KaTeX', href: '/admin/questions', icon: <Compass className="w-3.5 h-3.5" /> },
      { name: 'Analitik Subtest', href: '/tentor/analytics', icon: <Award className="w-3.5 h-3.5" /> },
    ],
    admin: [
      { name: 'Buku Kas & Ringkasan', href: '/admin', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
      { name: 'Import Excel SPP', href: '/admin/payments', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
      { name: 'Kuota & Batch', href: '/admin/classes', icon: <Layers className="w-3.5 h-3.5" /> },
      { name: 'Roster Siswa', href: '/admin/students', icon: <Users className="w-3.5 h-3.5" /> },
      { name: 'Bank Soal', href: '/admin/questions', icon: <Compass className="w-3.5 h-3.5" /> },
    ],
  };

  const currentNav = navLinksByRole[currentRole] || navLinksByRole.siswa;

  const isSuspended = currentUser.status === 'suspended';
  const isGraduated = currentUser.status === 'graduated';

  return (
    <>
      {/* Top Status Notification Banner */}
      {(isSuspended || isGraduated) && (
        <div
          className={`w-full py-2 px-4 text-xs font-medium border-b flex items-center justify-between transition-all ${
            isSuspended
              ? 'bg-[#FDECEB] text-[#A6211A] border-[#D0342C]/30'
              : 'bg-[#F3F3ED] text-[#13224E] border-[#CECEC2]'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center space-x-2 font-sans">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#D0342C]" />
            <span>
              {isSuspended && (
                <>
                  <strong className="font-semibold">Pemberitahuan Akun:</strong> Akses CBT simulasi ditangguhkan sementara karena kewajiban administrasi SPP.
                </>
              )}
              {isGraduated && (
                <>
                  <strong className="font-semibold">Arsip Alumni:</strong> Akun ini telah menyelesaikan periode bimbingan. Mode akses arsip evaluasi.
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E4E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Editorial Title */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 rounded-sm bg-[#13224E] border border-[#13224E] flex items-center justify-center text-white">
                  <span className="font-serif font-black text-sm tracking-tighter">EU</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-[#13224E] tracking-tight leading-none group-hover:text-[#1B3B8C] transition">
                    EUCLIDE
                  </span>
                  <span className="text-[9px] font-mono text-[#637096] uppercase tracking-widest mt-0.5">
                    CBT & BIMBEL SYSTEM
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
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition ${
                        isActive
                          ? 'border-[#1B3B8C] text-[#1B3B8C] font-semibold bg-[#FAFAF7]'
                          : 'border-transparent text-[#637096] hover:text-[#13224E] hover:bg-[#FAFAF7]'
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right User Area & Precision OMR Badge */}
            <div className="hidden md:flex items-center space-x-3">
              {/* OMR Role Indicator Badge */}
              <div className="flex items-center space-x-2 bg-[#FAFAF7] border border-[#E4E4DC] px-3 py-1.5 rounded-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentRole === 'admin'
                      ? 'bg-[#13224E]'
                      : currentRole === 'tentor'
                      ? 'bg-[#EFA93B]'
                      : 'bg-[#1B8A5A]'
                  }`}
                />
                <div className="text-left font-sans">
                  <div className="text-[9px] font-mono uppercase text-[#637096] leading-none">
                    Peran: <strong className="text-[#13224E]">{currentRole}</strong>
                  </div>
                  <div className="text-[11px] font-medium text-[#13224E] truncate max-w-[130px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              {currentRole === 'siswa' && (
                <Link
                  href="/exam/to-utbk-national-01"
                  className="inline-flex items-center space-x-1.5 bg-[#1B3B8C] hover:bg-[#274DB8] text-white text-xs font-medium px-3.5 py-1.5 rounded-sm border border-[#13224E] transition"
                >
                  <span>Mulai Ujian CBT</span>
                </Link>
              )}

              {currentRole === 'admin' && (
                <Link
                  href="/admin/payments"
                  className="inline-flex items-center space-x-1.5 bg-[#1B8A5A] hover:bg-[#126340] text-white text-xs font-medium px-3.5 py-1.5 rounded-sm transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Import Excel</span>
                </Link>
              )}

              {currentRole === 'tentor' && (
                <Link
                  href="/tentor/grading"
                  className="inline-flex items-center space-x-1.5 bg-[#EFA93B] hover:bg-[#C8831A] text-[#13224E] text-xs font-semibold px-3.5 py-1.5 rounded-sm border border-[#C8831A]/40 transition"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Koreksi Esai</span>
                </Link>
              )}

              <Link
                href="/login"
                className="text-[#637096] hover:text-[#D0342C] p-1.5 transition"
                title="Ganti Akun / Keluar"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#13224E] hover:bg-[#FAFAF7]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E4E4DC] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-2">
            <div className="flex items-center space-x-3 p-2.5 bg-[#FAFAF7] border border-[#E4E4DC] rounded-sm mb-3">
              <div className="w-8 h-8 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center font-serif font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#13224E] truncate">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-[#637096] uppercase">{currentRole} • {currentUser.email}</div>
              </div>
            </div>

            <div className="space-y-1">
              {currentNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-medium ${
                    pathname === link.href
                      ? 'bg-[#FAFAF7] text-[#1B3B8C] font-semibold border-l-2 border-[#1B3B8C]'
                      : 'text-[#637096] hover:text-[#13224E]'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E4E4DC]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-xs font-medium text-[#13224E] bg-[#FAFAF7] border border-[#E4E4DC]"
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
