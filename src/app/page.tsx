'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  GraduationCap,
  ArrowRight,
  Calculator,
  Smartphone,
  Check,
} from 'lucide-react';
import MathRenderer from '@/components/common/MathRenderer';

export default function LandingPage() {
  const { switchRole, tryouts } = useApp();

  const featureList = [
    {
      title: 'Player CBT Berorientasi Mobile',
      description: 'Navigasi butir soal menggunakan palet bulatan OMR, timer per subtest dengan auto-advance, serta dukungan 4 format soal.',
      tag: 'OMR Player',
    },
    {
      title: 'Kalkulasi KaTeX & Arsitektur IRT',
      description: 'Rendering notasi kalkulus, matriks, dan aljabar presisi tinggi tanpa latensi server, dirancang untuk migrasi bertahap ke kalibrasi IRT.',
      tag: 'Formula Presisi',
    },
    {
      title: 'Rasionalisasi Passing Grade SNBT',
      description: 'Pemetaan capaian skor terhadap ambang batas target PTN Pilihan 1 & 2 lengkap dengan visualisasi Radar Chart 7 subtest.',
      tag: 'Analitika PTN',
    },
    {
      title: 'Manajemen Kas & Import Excel SPP',
      description: 'Pembukuan keuangan kas bimbel terpadu, drag-and-drop file spreadsheet .xlsx dengan validasi baris, dan cetak kuitansi digital.',
      tag: 'Buku Kas & SPP',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans">
      {/* 1. Hero Section: Editorial Examination Sheet */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E4E4DC] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Examination Header Strip */}
          <div className="max-w-3xl mx-auto mb-8 border border-[#13224E] p-2 flex items-center justify-between font-mono text-[10px] text-[#637096] bg-[#FAFAF7]">
            <span>LEMBAR SISTEM CBT & BIMBEL</span>
            <span className="font-bold text-[#13224E]">KODE SISTEM: EUCLIDE-2026</span>
            <span className="hidden sm:inline">STANDAR NASIONAL UTBK-SNBT</span>
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#13224E] leading-[1.15]">
              Sistem CBT Tryout & Manajemen Bimbel{' '}
              <span className="stabilo">Presisi Tinggi</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#637096] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-normal">
              Ekosistem terpadu untuk <strong className="text-[#13224E] font-medium">Siswa</strong> (Player CBT OMR & Rasionalisasi PTN), <strong className="text-[#13224E] font-medium">Tentor</strong> (Koreksi Esai & Bank Soal KaTeX), dan <strong className="text-[#13224E] font-medium">Pengelola Bimbel</strong> (Buku Kas & Import Excel).
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/exam/to-utbk-national-01"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#1B3B8C] hover:bg-[#274DB8] text-white text-xs font-medium px-6 py-3 border border-[#13224E] transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Lembar Ujian Siswa</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => switchRole('admin')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] text-xs font-medium px-6 py-3 transition"
              >
                <ShieldCheck className="w-4 h-4 text-[#1B3B8C]" />
                <span>Masuk Portal Manajemen</span>
              </Link>
            </div>

            {/* Precision Stats Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left font-mono">
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC]">
                <div className="text-xl font-bold text-[#13224E]">4.820+</div>
                <div className="text-[10px] text-[#637096] font-sans">Peserta Terdaftar</div>
              </div>
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC]">
                <div className="text-xl font-bold text-[#1B3B8C]">7 Subtest</div>
                <div className="text-[10px] text-[#637096] font-sans">Struktur Resmi BPPP</div>
              </div>
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC]">
                <div className="text-xl font-bold text-[#1B8A5A]">97.2%</div>
                <div className="text-[10px] text-[#637096] font-sans">Akurasi Rasionalisasi*</div>
              </div>
              <div className="p-3 bg-[#FAFAF7] border border-[#E4E4DC]">
                <div className="text-xl font-bold text-[#13224E]">0.05s</div>
                <div className="text-[10px] text-[#637096] font-sans">Latensi Render KaTeX</div>
              </div>
            </div>
            <p className="text-[10px] text-[#9EABC7] italic text-right max-w-4xl mx-auto">
              *Data ilustrasi — perhitungan aktual akan disesuaikan skala data riil bimbel.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Role Portals (OMR & Paper Style) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-[#13224E] pb-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#13224E]">
              Tiga Ruang Kerja Terintegrasi
            </h2>
            <p className="text-xs text-[#637096]">
              Akses cepat demonstrasi fitur sesuai hak akses pengguna.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#637096] uppercase">MODUL 01 — 03</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Siswa */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E4E4DC] hover:border-[#1B3B8C] transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#1B3B8C] font-semibold bg-[#FAFAF7] px-2 py-0.5 border border-[#E4E4DC]">
                  PERAN: SISWA
                </span>
                <span className="w-3 h-3 rounded-full bg-[#1B8A5A]" title="Aktif" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                CBT & Rasionalisasi PTN
              </h3>
              <p className="text-xs text-[#637096] leading-relaxed">
                Ujian dengan timer subtest otomatis, palet nomor OMR, anti-cheat keluar layar, dan hasil analitik peluang PTN.
              </p>
              <ul className="space-y-1.5 text-xs text-[#13224E] font-medium pt-1">
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px] font-mono shrink-0">1</span>
                  <span>4 format soal (Pilihan Ganda, Ceklis, Isian, Esai)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px] font-mono shrink-0">2</span>
                  <span>Evaluasi Zona Aman / Kompetitif PTN</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E4E4DC]">
              <Link
                href="/exam/to-utbk-national-01"
                onClick={() => switchRole('siswa')}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#1B3B8C] hover:underline"
              >
                <span>Uji CBT Siswa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Tentor */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E4E4DC] hover:border-[#EFA93B] transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#C8831A] font-semibold bg-[#FAFAF7] px-2 py-0.5 border border-[#E4E4DC]">
                  PERAN: TENTOR
                </span>
                <span className="w-3 h-3 rounded-full bg-[#EFA93B]" title="Aktif" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Koreksi Esai & Bank Soal
              </h3>
              <p className="text-xs text-[#637096] leading-relaxed">
                Antrean penilaian lembar jawaban esai dengan rubrik slider (0–100), ulasan komentar, serta editor rumus KaTeX.
              </p>
              <ul className="space-y-1.5 text-xs text-[#13224E] font-medium pt-1">
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFA93B] text-[#13224E] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">1</span>
                  <span>Rubrik skor manual & feedback langsung</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFA93B] text-[#13224E] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">2</span>
                  <span>Editor naskah matematika live preview</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E4E4DC]">
              <Link
                href="/tentor/grading"
                onClick={() => switchRole('tentor')}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C8831A] hover:underline"
              >
                <span>Antrean Koreksi Esai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E4E4DC] hover:border-[#13224E] transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#13224E] font-semibold bg-[#FAFAF7] px-2 py-0.5 border border-[#E4E4DC]">
                  PERAN: SUPER-ADMIN
                </span>
                <span className="w-3 h-3 rounded-full bg-[#13224E]" title="Aktif" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Buku Kas & Kuota Kelas
              </h3>
              <p className="text-xs text-[#637096] leading-relaxed">
                Import massal data pembayaran Excel (.xlsx/.csv), monitoring kuota batch bimbel, dan cetak kuitansi kasir resmi.
              </p>
              <ul className="space-y-1.5 text-xs text-[#13224E] font-medium pt-1">
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#13224E] text-white flex items-center justify-center text-[10px] font-mono shrink-0">1</span>
                  <span>Parser spreadsheet SheetJS dengan validator baris</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#13224E] text-white flex items-center justify-center text-[10px] font-mono shrink-0">2</span>
                  <span>Roster siswa & status keanggotaan aktif</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E4E4DC]">
              <Link
                href="/admin"
                onClick={() => switchRole('admin')}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#13224E] hover:underline"
              >
                <span>Buka Dashboard Kas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tryout Booklet Catalog Section */}
      <section className="py-12 bg-[#FFFFFF] border-t border-[#E4E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-[#13224E] pb-2 mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#13224E]">
                Katalog Naskah Simulasi CBT
              </h2>
              <p className="text-xs text-[#637096]">
                Pilihan paket tryout UTBK terstandarisasi.
              </p>
            </div>
            <Link
              href="/tryouts"
              className="text-xs font-mono font-medium text-[#1B3B8C] hover:underline flex items-center space-x-1"
            >
              <span>LIHAT SEMUA ({tryouts.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tryouts.map((to) => (
              <div
                key={to.id}
                className="bg-[#FAFAF7] border border-[#E4E4DC] p-5 flex flex-col justify-between hover:border-[#13224E] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-semibold text-[#13224E] border border-[#CECEC2] bg-[#FFFFFF] px-2 py-0.5">
                      {to.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#C8831A] bg-[#EFA93B]/20 px-2 py-0.5">
                      {to.badge || 'Terbuka'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#13224E] mb-2 leading-snug">
                    {to.title}
                  </h3>
                  <p className="text-xs text-[#637096] mb-4 line-clamp-2">
                    {to.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#FFFFFF] p-2.5 border border-[#E4E4DC] mb-4">
                    <div>
                      <span className="text-[9px] text-[#9EABC7] block uppercase">Durasi</span>
                      <span className="font-semibold text-[#13224E]">{to.totalDurationMinutes} Menit</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#9EABC7] block uppercase">Jumlah Subtest</span>
                      <span className="font-semibold text-[#13224E]">{to.subtests.length} Subtest</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#637096]">
                    {to.participantsCount.toLocaleString('id-ID')} peserta
                  </span>
                  <Link
                    href={`/exam/${to.id}`}
                    className="inline-flex items-center space-x-1 bg-[#1B3B8C] hover:bg-[#274DB8] text-white text-xs font-medium px-3 py-1.5 transition"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KaTeX Math Paper Showcase */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border-2 border-[#13224E] p-6 sm:p-8">
          <div className="border-b border-[#E4E4DC] pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#13224E]" />
              <span className="font-mono text-xs font-bold text-[#13224E] uppercase tracking-wider">
                Contoh Naskah Rumus KaTeX
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#637096]">LATENSI 0ms (CLIENT-SIDE)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Ketajaman Formula Matematika & Sains
              </h3>
              <p className="text-xs text-[#637096] leading-relaxed">
                Mendukung integral lipat, matriks $2 \times 2$, persamaan diferensial, dan fungsi kuadrat tanpa ketergantungan file gambar statis.
              </p>
            </div>
            <div className="p-4 bg-[#FAFAF7] border border-[#E4E4DC] text-center">
              <MathRenderer
                content="$$V(t) = \int_{0}^{t} (3x^2 - 4x + 6) \, dx \implies \det \begin{pmatrix} 2 & x \\ 3 & 5 \end{pmatrix} = 8$$"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
