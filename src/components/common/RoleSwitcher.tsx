'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { MOCK_USERS } from '@/data/mockData';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export function RoleSwitcher() {
  const { currentRole, currentUser, switchRole, switchUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const rolesConfig: {
    role: UserRole;
    title: string;
    icon: React.ReactNode;
    description: string;
    quickLinks: { label: string; href: string }[];
  }[] = [
    {
      role: 'admin',
      title: 'Super-Admin / Owner',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      description: 'Buku Kas, Import Excel SPP, Kuota Batch & Bank Soal',
      quickLinks: [
        { label: 'Buku Kas', href: '/admin' },
        { label: 'Import Excel', href: '/admin/payments' },
        { label: 'Roster Siswa', href: '/admin/students' },
        { label: 'Bank Soal', href: '/admin/questions' },
      ],
    },
    {
      role: 'tentor',
      title: 'Tentor / Pengajar',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      description: 'Koreksi Esai Manual (0-100), Bank Soal KaTeX, Analitik Subtest',
      quickLinks: [
        { label: 'Koreksi Esai', href: '/tentor/grading' },
        { label: 'Bank Soal KaTeX', href: '/admin/questions' },
        { label: 'Analitik Subtest', href: '/tentor/analytics' },
      ],
    },
    {
      role: 'siswa',
      title: 'Siswa / Peserta CBT',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      description: 'Player CBT Mobile-First, Timer Subtest, Rasionalisasi SNBT',
      quickLinks: [
        { label: 'Katalog Tryout', href: '/tryouts' },
        { label: 'Simulasi CBT', href: '/exam/to-utbk-national-01' },
        { label: 'Rasionalisasi', href: '/exam/to-utbk-national-01/result' },
        { label: 'Modul Latihan', href: '/drilling' },
      ],
    },
  ];

  const studentAccounts = MOCK_USERS.filter((u) => u.role === 'siswa');

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md font-sans">
      {/* Expanded Control Box */}
      {isOpen && (
        <div className="mb-2 bg-[#FFFFFF] border-2 border-[#13224E] shadow-sheet p-4 rounded-sm animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E4DC]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#1B8A5A]" />
              <span className="font-mono text-xs font-semibold text-[#13224E] uppercase tracking-wider">
                Panel Pengalih Peran Demo
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#637096] hover:text-[#13224E] text-xs font-mono px-2 py-0.5 border border-[#E4E4DC] hover:bg-[#FAFAF7]"
            >
              Tutup [✕]
            </button>
          </div>

          {/* Role selector list with OMR bubbles */}
          <div className="mt-3 space-y-2">
            {rolesConfig.map((item) => {
              const isCurrent = currentRole === item.role;
              return (
                <div
                  key={item.role}
                  onClick={() => switchRole(item.role)}
                  className={`p-3 border cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                      : 'border-[#E4E4DC] hover:border-[#CECEC2] bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {/* OMR Bubble Selector */}
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] ${
                          isCurrent
                            ? 'bg-[#1B3B8C] border-[#13224E] text-white font-bold'
                            : 'border-[#CECEC2] bg-[#FFFFFF] text-[#637096]'
                        }`}
                      >
                        {isCurrent ? <Check className="w-3 h-3" /> : ''}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-sm text-[#13224E]">{item.title}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono bg-[#EFA93B]/25 text-[#13224E] font-semibold px-1.5 py-0.2">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#637096] leading-tight mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick links */}
                  {isCurrent && (
                    <div className="mt-2.5 pt-2 border-t border-[#E4E4DC] flex flex-wrap gap-1.5">
                      {item.quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center space-x-1 text-[10px] font-mono bg-[#FFFFFF] text-[#1B3B8C] hover:bg-[#1B3B8C] hover:text-white px-2 py-0.5 border border-[#1B3B8C]/40 transition"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Student Account Status Simulators */}
          <div className="mt-3 pt-2.5 border-t border-[#E4E4DC]">
            <div className="text-[10px] font-mono text-[#637096] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Uji Status Akun Siswa:</span>
              <span className="text-[#C8831A]">Cek Banner Akses</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
              {studentAccounts.slice(0, 3).map((stu) => {
                const isSelected = currentUser.id === stu.id;
                let statusLabel = 'Aktif';
                let borderCol = 'border-[#E4E4DC] text-[#13224E]';
                if (stu.status === 'suspended') {
                  statusLabel = 'SPP Overdue';
                  borderCol = 'border-[#D0342C]/40 text-[#D0342C] bg-[#FDECEB]';
                } else if (stu.status === 'graduated') {
                  statusLabel = 'Alumni';
                  borderCol = 'border-[#637096]/40 text-[#637096] bg-[#F3F3ED]';
                }

                return (
                  <button
                    key={stu.id}
                    onClick={() => switchUser(stu)}
                    className={`p-1.5 text-left border transition ${
                      isSelected ? 'border-[#13224E] bg-[#FAFAF7] font-bold' : borderCol
                    }`}
                  >
                    <div className="truncate font-sans font-medium">{stu.name.split(' ')[0]}</div>
                    <div className="text-[9px] opacity-75">{statusLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#13224E] hover:bg-[#1B3B8C] text-white px-3.5 py-2 border border-[#13224E] shadow-sheet transition text-xs font-mono"
      >
        <span className="w-2 h-2 rounded-full bg-[#EFA93B]" />
        <span>Peran: <strong className="text-[#EFA93B] uppercase">{currentRole}</strong></span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default RoleSwitcher;
