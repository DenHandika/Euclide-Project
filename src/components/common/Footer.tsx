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
    <footer className="bg-[#FFFFFF] border-t border-[#E4E4DC] text-[#637096] text-xs py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-2.5 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#13224E] text-white flex items-center justify-center font-serif font-bold text-xs">
                EU
              </div>
              <span className="text-[#13224E] font-serif font-bold text-base tracking-tight">
                EUCLIDE
              </span>
            </div>
            <p className="text-xs text-[#637096] leading-relaxed">
              Sistem Computer-Based Test (CBT) dan Manajemen Bimbingan Belajar Berbasis Analitika Rasionalisasi UTBK-SNBT.
            </p>
            <div className="text-[10px] font-mono text-[#9EABC7]">
              Standar Evaluasi Akademik SNBT 2026
            </div>
          </div>

          {/* Modul Siswa */}
          <div>
            <h4 className="font-serif font-bold text-xs text-[#13224E] uppercase tracking-wider mb-2.5">
              Modul Siswa
            </h4>
            <ul className="space-y-1.5 text-xs text-[#637096]">
              <li>
                <Link href="/tryouts" className="hover:text-[#13224E] transition">
                  Simulasi Akbar UTBK
                </Link>
              </li>
              <li>
                <Link href="/drilling" className="hover:text-[#13224E] transition">
                  Modul Latihan Subtest
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01/result" className="hover:text-[#13224E] transition">
                  Rasionalisasi Peluang PTN
                </Link>
              </li>
              <li>
                <Link href="/exam/to-utbk-national-01" className="hover:text-[#13224E] transition">
                  Player Ujian CBT
                </Link>
              </li>
            </ul>
          </div>

          {/* Manajemen & Tentor */}
          <div>
            <h4 className="font-serif font-bold text-xs text-[#13224E] uppercase tracking-wider mb-2.5">
              Manajemen & Pengajar
            </h4>
            <ul className="space-y-1.5 text-xs text-[#637096]">
              <li>
                <Link href="/admin" className="hover:text-[#13224E] transition">
                  Buku Kas & Ringkasan
                </Link>
              </li>
              <li>
                <Link href="/admin/payments" className="hover:text-[#13224E] transition">
                  Import Excel SPP (.xlsx)
                </Link>
              </li>
              <li>
                <Link href="/admin/classes" className="hover:text-[#13224E] transition">
                  Monitoring Kuota Batch
                </Link>
              </li>
              <li>
                <Link href="/tentor/grading" className="hover:text-[#13224E] transition">
                  Koreksi Esai & Rubrik Nilai
                </Link>
              </li>
            </ul>
          </div>

          {/* Program & Evaluasi */}
          <div>
            <h4 className="font-serif font-bold text-xs text-[#13224E] uppercase tracking-wider mb-2.5">
              Program Bimbingan
            </h4>
            <ul className="space-y-1.5 text-xs text-[#637096]">
              <li>
                <span className="text-[#13224E] font-medium">SNBT Super Intensif</span>
                <span className="block text-[10px] text-[#9EABC7]">7 Subtest TPS & Literasi</span>
              </li>
              <li>
                <span className="text-[#13224E] font-medium">Kedokteran Priority</span>
                <span className="block text-[10px] text-[#9EABC7]">Target Passing Grade 740+</span>
              </li>
              <li>
                <span className="text-[#13224E] font-medium">Drilling Kuantitatif & MTK</span>
                <span className="block text-[10px] text-[#9EABC7]">Bank Soal Rumus Presisi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E4E4DC] flex flex-col sm:flex-row items-center justify-between text-[#9EABC7] text-[11px] font-mono">
          <div>
            © {new Date().getFullYear()} EUCLIDE EdTech System. Seluruh hak cipta dilindungi.
          </div>
          <div className="mt-2 sm:mt-0">
            Platform CBT Tryout & Rasionalisasi PTN
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
