'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Home,
  BookOpen,
  Zap,
  Award,
  User,
  LayoutDashboard,
  FileCheck2,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { currentRole } = useApp();

  // Do not show bottom nav during active CBT exam sessions
  const isExamScreen = pathname?.startsWith('/exam/') && !pathname?.includes('/result');
  if (isExamScreen) {
    return null;
  }

  const studentNav = [
    { name: 'Beranda', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Tryout', href: '/tryouts', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Latihan', href: '/drilling', icon: <Zap className="w-5 h-5" /> },
    { name: 'Rapor PTN', href: '/exam/to-utbk-national-01/result', icon: <Award className="w-5 h-5" /> },
  ];

  const tentorNav = [
    { name: 'Beranda', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Koreksi', href: '/tentor/grading', icon: <FileCheck2 className="w-5 h-5" /> },
    { name: 'Analisis', href: '/tentor/analytics', icon: <Award className="w-5 h-5" /> },
  ];

  const adminNav = [
    { name: 'Beranda', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Kas & SPP', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Import SPP', href: '/admin/payments', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Siswa', href: '/admin/students', icon: <User className="w-5 h-5" /> },
  ];

  const activeNav =
    currentRole === 'admin'
      ? adminNav
      : currentRole === 'tentor'
      ? tentorNav
      : studentNav;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around">
        {activeNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
