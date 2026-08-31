'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole, User } from '@/types';
import { MOCK_USERS } from '@/data/mockData';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export function RoleSwitcher() {
  const { currentRole, currentUser, switchRole, switchUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const rolesConfig: {
    role: UserRole;
    title: string;
    badgeColor: string;
    icon: React.ReactNode;
    description: string;
    quickLinks: { label: string; href: string }[];
  }[] = [
    {
      role: 'admin',
      title: 'Admin / Owner',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
      icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
      description: 'Super-Admin: Excel Kas, Kuota Kelas, Bank Soal, Roster Siswa',
      quickLinks: [
        { label: 'Dashboard Kas', href: '/admin' },
        { label: 'Import Excel SPP', href: '/admin/payments' },
        { label: 'Roster Siswa', href: '/admin/students' },
        { label: 'Bank Soal', href: '/admin/questions' },
      ],
    },
    {
      role: 'tentor',
      title: 'Tentor / Pengajar',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
      icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
      description: 'Instructor: Koreksi Esai Manual, Bank Soal, Analitik Subtest',
      quickLinks: [
        { label: 'Koreksi Esai', href: '/tentor/grading' },
        { label: 'Buat Soal KaTeX', href: '/admin/questions' },
        { label: 'Analitik Subtest', href: '/tentor/analytics' },
      ],
    },
    {
      role: 'siswa',
      title: 'Siswa / Peserta',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      description: 'Student: CBT Exam Player, Timer Subtest, Rasionalisasi SNBT',
      quickLinks: [
        { label: 'Katalog Tryout', href: '/tryouts' },
        { label: 'Simulasi CBT', href: '/exam/to-utbk-national-01' },
        { label: 'Rasionalisasi SNBT', href: '/exam/to-utbk-national-01/result' },
        { label: 'Drilling TPS', href: '/drilling' },
      ],
    },
  ];

  const studentAccounts = MOCK_USERS.filter((u) => u.role === 'siswa');

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md">
      {/* Expanded Modal / Card */}
      {isOpen && (
        <div className="mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Demo Role Switcher
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
            >
              Tutup
            </button>
          </div>

          {/* Role selector cards */}
          <div className="mt-3 space-y-2">
            {rolesConfig.map((item) => {
              const isCurrent = currentRole === item.role;
              return (
                <div
                  key={item.role}
                  onClick={() => switchRole(item.role)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-800">{item.title}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-600 text-white font-medium px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                      </div>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>

                  {/* Quick Jump Links */}
                  {isCurrent && (
                    <div className="mt-2.5 pt-2 border-t border-blue-100/80 flex flex-wrap gap-1.5">
                      {item.quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center space-x-1 text-[10px] font-medium bg-white text-blue-700 hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md border border-blue-200 shadow-2xs transition"
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

          {/* Test Student Account States (Active, Suspended, Graduated) */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Simulasi Status Akun Siswa:</span>
              <span className="text-[10px] text-amber-600 font-normal">Uji Banner Notifikasi</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {studentAccounts.slice(0, 3).map((stu) => {
                const isSelected = currentUser.id === stu.id;
                let statusBadge = '🟢 Aktif';
                let btnBorder = 'border-slate-200';
                if (stu.status === 'suspended') {
                  statusBadge = '🔴 Suspend (SPP)';
                  btnBorder = 'border-rose-200 text-rose-700 bg-rose-50/50';
                } else if (stu.status === 'graduated') {
                  statusBadge = '🎓 Alumni (Expired)';
                  btnBorder = 'border-purple-200 text-purple-700 bg-purple-50/50';
                }

                return (
                  <button
                    key={stu.id}
                    onClick={() => {
                      switchUser(stu);
                    }}
                    className={`text-[10px] p-1.5 rounded-lg border text-left transition font-medium truncate ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50 font-bold' : btnBorder
                    }`}
                  >
                    <div className="truncate">{stu.name.split(' ')[0]}</div>
                    <div className="text-[9px] opacity-80">{statusBadge}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-navy hover:bg-navy-light text-white px-3.5 py-2 rounded-full shadow-elevated border border-blue-400/30 transition-all transform hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <div className="flex items-center space-x-1.5 text-xs font-semibold">
          <span className="text-slate-300">Role:</span>
          <span className="capitalize text-amber-300 font-bold">{currentRole}</span>
          <span className="text-slate-300">({currentUser.name.split(' ')[0]})</span>
        </div>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default RoleSwitcher;
