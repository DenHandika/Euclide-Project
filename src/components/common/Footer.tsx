'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, Sparkles, BookOpen, Layers, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                EU
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">EUCLIDE</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Platform Computer-Based Test (CBT) & Sistem Manajemen Bimbingan Belajar Modern Berbasis Analitika Terpadu UTBK-SNBT.
            </p>
            <div className="text-[11px] text-slate-500">
              Vercel Ready • KaTeX Engine • IRT Scoring
            </div>
          </div>

          {/* Modules Col */}
          <div>
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-3">
              Modul Siswa
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tryouts" className="hover:text-white transition">
                  Simulasi Akbar UTBK
                </Link>
              </li>
              <li>
                <Link href="/drilling" className="hover:text-white transition">
                  Drilling Soal Kuantitatif
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01/result" className="hover:text-white transition">
                  Rasionalisasi Passing Grade SNBT
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01" className="hover:text-white transition">
                  CBT Exam Player Mobile
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Tentor Col */}
          <div>
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-3">
              Manajemen & Pengajar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Dashboard Keuangan & Kas
                </Link>
              </li>
              <li>
                <Link href="/admin/payments" className="hover:text-white transition">
                  Bulk Import SPP Excel (.xlsx)
                </Link>
              </li>
              <li>
                <Link href="/admin/classes" className="hover:text-white transition">
                  Monitoring Kuota Batch
                </Link>
              </li>
              <li>
                <Link href="/tentor/grading" className="hover:text-white transition">
                  Koreksi Esai & Rubrik Nilai
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider mb-3">
              Simulasi Demo
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Gunakan widget <strong>Demo Role Switcher</strong> di pojok kanan bawah untuk berganti peran seketika.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 font-medium text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Light Mode Clean Standard</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} EUCLIDE EdTech System. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <span>Inter Typography</span>
            <span>•</span>
            <span>SheetJS Excel Engine</span>
            <span>•</span>
            <span>Recharts Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
