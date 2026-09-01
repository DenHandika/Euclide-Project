'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  FileCheck2,
  ArrowRight,
  Clock,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import MathRenderer from '@/components/common/MathRenderer';

export default function LandingPage() {
  const { switchRole, tryouts } = useApp();

  // Interactive Hero CBT Question preview state
  const [heroSelectedOpt, setHeroSelectedOpt] = useState<string>('B');
  const [heroFlagged, setHeroFlagged] = useState<boolean>(false);

  const heroQuestion = {
    subtest: 'Penalaran Matematika & Kuantitatif',
    timeRemaining: '18:45',
    prompt:
      'Diberikan laju pengisian volume tangki air $V(t) = \\int_{0}^{t} (3x^2 - 4x + 6) \\, dx$ liter/menit. Jika kapasitas penuh tangki adalah $90\\text{ liter}$, maka nilai $t$ yang memenuhi adalah...',
    options: [
      { id: 'A', text: '$t^3 - 2t^2 + 6t - 90 = 0$' },
      { id: 'B', text: '$t^3 - 2t^2 + 6t = 90 \\implies t = 5\\text{ menit}$' },
      { id: 'C', text: '$3t^2 - 4t + 6 = 90$' },
      { id: 'D', text: '$t^3 - 4t^2 + 6t = 45$' },
      { id: 'E', text: '$6t^2 - 4t = 90$' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-[#13224E]">
      {/* 1. Hero Section: Direct Live Exam Paper Preview */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#E4E4DC] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#1B3B8C] border-b border-[#1B3B8C]/40 pb-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B8A5A]" />
                <span>Naskah Simulasi UTBK-SNBT • Standar IRT 2026</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#13224E] leading-[1.18]">
                Sistem CBT Tryout & Bimbingan Belajar{' '}
                <span className="stabilo">Presisi Tinggi</span>
              </h1>

              <p className="text-[#637096] text-sm sm:text-base leading-relaxed font-sans">
                Dirancang khusus untuk simulasi UTBK-SNBT dengan formula matematika KaTeX bebas latensi, lembar jawaban OMR, dan kalkulasi rasionalisasi peluang PTN.
              </p>

              {/* Key Highlights with OMR bullet points */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    A
                  </span>
                  <span className="text-xs text-[#13224E] leading-snug">
                    <strong>Player CBT Mobile-First:</strong> 4 format soal, timer otomatis per subtest, dan anti-cheat.
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    B
                  </span>
                  <span className="text-xs text-[#13224E] leading-snug">
                    <strong>Rasionalisasi Daya Saing:</strong> Pemetaan skor ke Passing Grade & kuota PTN Pilihan 1 & 2.
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    C
                  </span>
                  <span className="text-xs text-[#13224E] leading-snug">
                    <strong>Buku Kas & Import Excel:</strong> Rekonsiliasi SPP massal dengan file spreadsheet .xlsx.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/exam/to-utbk-national-01"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#1B3B8C] hover:bg-[#274DB8] text-white text-xs font-medium px-5 py-3 border border-[#13224E] transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Uji Coba CBT Lengkap</span>
                </Link>
                <Link
                  href="/tryouts"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FAFAF7] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] text-xs font-medium px-5 py-3 transition"
                >
                  <span>Lihat Katalog Soal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Live Interactive CBT Exam Worksheet (Show Product Directly) */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] border-2 border-[#13224E] p-5 sm:p-6 space-y-4">
                {/* Worksheet Header Strip */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC]">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-[#13224E] text-white flex items-center justify-center font-mono font-bold text-xs">
                      4
                    </span>
                    <div>
                      <div className="text-xs font-serif font-bold text-[#13224E]">
                        {heroQuestion.subtest}
                      </div>
                      <div className="text-[10px] font-mono text-[#637096]">
                        SOAL 04 DARI 20 • FORMAT PILIHAN GANDA (OMR)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-[#FAFAF7] border border-[#13224E] font-mono text-xs font-bold text-[#13224E]">
                      <Clock className="w-3 h-3 text-[#1B3B8C]" />
                      <span>{heroQuestion.timeRemaining}</span>
                    </div>

                    <button
                      onClick={() => setHeroFlagged(!heroFlagged)}
                      className={`flex items-center space-x-1 px-2 py-0.5 text-xs font-mono border transition ${
                        heroFlagged
                          ? 'bg-[#EFA93B] text-[#13224E] border-[#C8831A] font-bold'
                          : 'bg-[#FAFAF7] text-[#637096] border-[#CECEC2]'
                      }`}
                      title="Klik untuk mencoba tombol ragu-ragu"
                    >
                      <Bookmark className={`w-3 h-3 ${heroFlagged ? 'fill-[#13224E]' : ''}`} />
                      <span className="hidden sm:inline">{heroFlagged ? 'Ragu' : 'Tandai Ragu'}</span>
                    </button>
                  </div>
                </div>

                {/* Prompt with KaTeX Rendering */}
                <div className="text-xs sm:text-sm font-serif font-semibold text-[#13224E] leading-relaxed pt-1">
                  <MathRenderer content={heroQuestion.prompt} />
                </div>

                {/* Interactive OMR Options */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono text-[#637096] uppercase flex items-center justify-between">
                    <span>Klik bulatan OMR di bawah untuk mencoba:</span>
                    {heroSelectedOpt === 'B' && (
                      <span className="text-[#1B8A5A] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kunci Terpilih (Opsi B)</span>
                      </span>
                    )}
                  </div>

                  {heroQuestion.options.map((opt) => {
                    const isSelected = heroSelectedOpt === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setHeroSelectedOpt(opt.id)}
                        className={`flex items-start space-x-3 p-2.5 border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1B3B8C] bg-[#FAFAF7]'
                            : 'border-[#E4E4DC] bg-[#FFFFFF] hover:border-[#CECEC2] hover:bg-[#FAFAF7]'
                        }`}
                      >
                        <span
                          className={`omr-bubble shrink-0 ${
                            isSelected ? 'omr-bubble-filled' : ''
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="pt-0.5 text-xs text-[#13224E] leading-relaxed">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mini OMR Navigator Bar at bottom */}
                <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center space-x-1 overflow-x-auto">
                    <span className="text-[#637096] mr-1">Palet Soal:</span>
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className="w-5 h-5 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[9px] font-bold"
                      >
                        {n}
                      </span>
                    ))}
                    <span className="w-5 h-5 rounded-full bg-[#13224E] text-white ring-2 ring-[#13224E] ring-offset-1 flex items-center justify-center text-[9px] font-bold">
                      4
                    </span>
                    {[5, 6, 7, 8].map((n) => (
                      <span
                        key={n}
                        className="w-5 h-5 rounded-full border border-[#CECEC2] bg-[#FFFFFF] text-[#637096] flex items-center justify-center text-[9px]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/exam/to-utbk-national-01"
                    className="inline-flex items-center space-x-1 text-[#1B3B8C] hover:underline font-semibold"
                  >
                    <span>Masuk CBT Penuh</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Asymmetric Ruang Kerja Section (Siswa as Primary Spotlight, Tentor & Admin as Secondary) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b border-[#13224E] pb-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#13224E]">
              Ruang Kerja Terintegrasi
            </h2>
            <p className="text-xs text-[#637096]">
              Akses modul siswa untuk pelaksanaan ujian CBT, serta modul pengajar dan pengelola bimbel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Primary Card (8 Cols): Modul Siswa & Rasionalisasi PTN */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border-2 border-[#13224E] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#1B8A5A] text-white flex items-center justify-center text-xs font-mono font-bold">
                  S
                </span>
                <h3 className="font-serif font-bold text-lg text-[#13224E]">
                  Portal Peserta Ujian & Rasionalisasi SNBT
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#1B8A5A] font-semibold bg-[#EAF7F0] px-2.5 py-0.5 border border-[#1B8A5A]/30">
                Modul Utama Siswa
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#637096] leading-relaxed font-sans">
              Pengalaman ujian terstandarisasi UTBK dengan timer per subtest otomatis, navigasi lembar jawaban OMR, anti-cheat keluar layar, dan hasil analitik peluang lolos PTN Pilihan 1 & 2.
            </p>

            {/* Sub-feature boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[#FAFAF7] border border-[#E4E4DC] space-y-1">
                <div className="font-mono text-xs font-bold text-[#1B3B8C] flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1B3B8C] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>4 Format Soal UTBK</span>
                </div>
                <p className="text-xs text-[#637096] leading-relaxed">
                  Pilihan ganda OMR, pilihan majemuk ceklis, isian singkat, dan esai penalaran ilmiah.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAFAF7] border border-[#E4E4DC] space-y-1">
                <div className="font-mono text-xs font-bold text-[#1B8A5A] flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#1B8A5A] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Analisis Zona Lolos PTN</span>
                </div>
                <p className="text-xs text-[#637096] leading-relaxed">
                  Evaluasi skor capaian terhadap Passing Grade dan daya tampung resmi kuota PTN.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between font-mono text-xs">
              <span className="text-[#637096]">
                Akses demo: Siswa Raihan Pratama (Aktif)
              </span>
              <Link
                href="/exam/to-utbk-national-01"
                onClick={() => switchRole('siswa')}
                className="inline-flex items-center space-x-1.5 bg-[#1B3B8C] hover:bg-[#274DB8] text-white px-4 py-2 font-medium transition"
              >
                <span>Buka Lembar Ujian CBT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Secondary Column (4 Cols): Stacked Tentor & Super-Admin Cards */}
          <div className="lg:col-span-4 space-y-5">
            {/* Secondary Card 1: Tentor */}
            <div className="bg-[#FFFFFF] border border-[#13224E] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#EFA93B] text-[#13224E] flex items-center justify-center text-[10px] font-mono font-bold">
                    T
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#13224E]">
                    Portal Pengajar & Tentor
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#C8831A] font-bold">
                  Koreksi Esai
                </span>
              </div>
              <p className="text-xs text-[#637096] leading-relaxed">
                Antrean penilaian lembar esai dengan rubrik slider (0–100) dan editor bank soal KaTeX dengan live preview.
              </p>
              <div className="pt-1">
                <Link
                  href="/tentor/grading"
                  onClick={() => switchRole('tentor')}
                  className="inline-flex items-center space-x-1 text-xs font-mono font-semibold text-[#C8831A] hover:underline"
                >
                  <span>Antrean Koreksi Esai →</span>
                </Link>
              </div>
            </div>

            {/* Secondary Card 2: Admin */}
            <div className="bg-[#FFFFFF] border border-[#13224E] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#13224E] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                    A
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#13224E]">
                    Portal Pengelola Bimbel
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#13224E] font-bold">
                  Buku Kas & SPP
                </span>
              </div>
              <p className="text-xs text-[#637096] leading-relaxed">
                Import massal data pembayaran Excel (.xlsx), monitoring kapasitas kuota kelas, dan cetak kuitansi kasir resmi.
              </p>
              <div className="pt-1">
                <Link
                  href="/admin/payments"
                  onClick={() => switchRole('admin')}
                  className="inline-flex items-center space-x-1 text-xs font-mono font-semibold text-[#13224E] hover:underline"
                >
                  <span>Import Excel SPP →</span>
                </Link>
              </div>
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
                Pilihan paket tryout UTBK terstandarisasi dengan 7 subtest resmi.
              </p>
            </div>
            <Link
              href="/tryouts"
              className="text-xs font-mono font-medium text-[#1B3B8C] hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua ({tryouts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tryouts.map((to) => (
              <div
                key={to.id}
                className="bg-[#FAFAF7] border border-[#E4E4DC] p-5 flex flex-col justify-between hover:border-[#13224E] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono text-[10px]">
                    <span className="font-semibold text-[#13224E] border border-[#CECEC2] bg-[#FFFFFF] px-2 py-0.5">
                      {to.code}
                    </span>
                    <span className="text-[#C8831A] bg-[#EFA93B]/20 px-2 py-0.5 font-bold">
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
                      <span className="text-[9px] text-[#9EABC7] block uppercase">Subtest</span>
                      <span className="font-semibold text-[#13224E]">{to.subtests.length} Subtest</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#637096] text-[11px]">
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
    </div>
  );
}
