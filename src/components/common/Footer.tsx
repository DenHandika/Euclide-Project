'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isExamScreen = pathname?.startsWith('/exam/') && !pathname?.includes('/result');

  if (isExamScreen) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                EU
              </div>
              <span className="text-white font-bold text-base tracking-tight">
                EUCLIDE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Ujian CBT & Manajemen Operasional Bimbingan Belajar Modern SNBT dengan Analitik Rasionalisasi PTN.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Standar Evaluasi Akademik 2026
            </div>
          </div>

          {/* Modul Siswa */}
          <div>
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3">
              Modul Siswa
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/tryouts" className="hover:text-white transition">
                  Katalog Paket Tryout
                </Link>
              </li>
              <li>
                <Link href="/drilling" className="hover:text-white transition">
                  Modul Latihan Mandiri
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01/result" className="hover:text-white transition">
                  Rasionalisasi Peluang PTN
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01" className="hover:text-white transition">
                  Simulasi Player CBT
                </Link>
              </li>
            </ul>
          </div>

          {/* Manajemen & Tentor */}
          <div>
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3">
              Manajemen & Pengajar
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Buku Kas & Ringkasan
                </Link>
              </li>
              <li>
                <Link href="/admin/payments" className="hover:text-white transition">
                  Import Excel SPP (.xlsx)
                </Link>
              </li>
              <li>
                <Link href="/admin/classes" className="hover:text-white transition">
                  Monitoring Kuota Batch
                </Link>
              </li>
              <li>
                <Link href="/admin/students" className="hover:text-white transition">
                  Roster & Akses Siswa
                </Link>
              </li>
              <li>
                <Link href="/tentor/grading" className="hover:text-white transition">
                  Koreksi Esai & Rubrik
                </Link>
              </li>
            </ul>
          </div>

          {/* Program Bimbingan */}
          <div>
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3">
              Program Bimbel
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="text-white font-medium block">SNBT Super Intensif</span>
                <span className="text-[11px] text-slate-500">7 Subtest TPS & Literasi</span>
              </li>
              <li>
                <span className="text-white font-medium block">Kedokteran Priority</span>
                <span className="text-[11px] text-slate-500">Target Passing Grade 740+ (Contoh Target Referensi FK UI)</span>
              </li>
              <li>
                <span className="text-white font-medium block">Drilling Kuantitatif & MTK</span>
                <span className="text-[11px] text-slate-500">Bank Soal Rumus Presisi KaTeX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs">
          <div>
            &copy; {new Date().getFullYear()} EUCLIDE EdTech System. Seluruh hak cipta dilindungi.
          </div>
          <div className="mt-2 sm:mt-0 text-slate-400 font-medium">
            Platform CBT Tryout & Manajemen Bimbel
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
