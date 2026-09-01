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
  Sparkles,
  Zap,
  GraduationCap,
  Users,
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-amber-100 selection:text-slate-900">
      {/* 1. Hero Section: Modern, Impactful, Interactive EdTech Workspace */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-700 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Simulasi Standar SNBT 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Platform CBT Tryout & Manajemen Bimbel{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Terintegrasi
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Sistem ujian berbasis komputer resmi dengan formula matematika KaTeX bebas latensi, navigasi lembar OMR cerdas, analitik rasionalisasi PTN, dan modul kasir SPP otomatis.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
                <Link
                  href="/exam/to-utbk-national-01"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Uji Coba CBT Lengkap</span>
                </Link>
                <Link
                  href="/tryouts"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-semibold px-5 py-3.5 rounded-xl transition"
                >
                  <span>Katalog Paket Soal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Anti-Curang Screen Lock</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Editor Rumus KaTeX Visual</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Import Excel SPP & Siswa</span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive CBT Exam Worksheet Preview */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Worksheet Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono font-bold text-xs">
                      4
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {heroQuestion.subtest}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        SOAL 04 DARI 20 • PILIHAN GANDA (OMR)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 rounded-lg font-mono text-xs font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{heroQuestion.timeRemaining}</span>
                    </div>

                    <button
                      onClick={() => setHeroFlagged(!heroFlagged)}
                      className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                        heroFlagged
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Uji coba tombol ragu-ragu"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${heroFlagged ? 'fill-amber-900' : ''}`} />
                      <span className="hidden sm:inline">{heroFlagged ? 'Ragu' : 'Tandai Ragu'}</span>
                    </button>
                  </div>
                </div>

                {/* Prompt with MathRenderer */}
                <div className="text-sm sm:text-base font-serif font-medium text-slate-900 leading-relaxed pt-3">
                  <MathRenderer content={heroQuestion.prompt} />
                </div>

                {/* Interactive OMR Options */}
                <div className="space-y-2.5 pt-3">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                    <span>PILIH JAWABAN (BULATAN OMR):</span>
                    {heroSelectedOpt === 'B' && (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
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
                        className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <span
                          className={`omr-bubble shrink-0 ${
                            isSelected ? 'omr-bubble-filled' : ''
                          }`}
                        >
                          {opt.id}
                        </span>
                        <div className="pt-0.5 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans">
                          <MathRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mini OMR Navigator Bar */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 overflow-x-auto font-mono">
                    <span className="text-slate-500 mr-1 text-[11px]">Palet Soal:</span>
                    {[1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold"
                      >
                        {n}
                      </span>
                    ))}
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white ring-2 ring-blue-500 ring-offset-1 flex items-center justify-center text-[10px] font-bold">
                      4
                    </span>
                    {[5, 6, 7, 8].map((n) => (
                      <span
                        key={n}
                        className="w-6 h-6 rounded-md border border-slate-200 bg-white text-slate-600 flex items-center justify-center text-[10px]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/exam/to-utbk-national-01"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-bold"
                  >
                    <span>Masuk CBT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="py-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">650+</div>
              <div className="text-xs text-slate-500 mt-0.5">Siswa Terdaftar Aktif</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">7 Subtest</div>
              <div className="text-xs text-slate-500 mt-0.5">Format Standar SNBT</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">4 Format</div>
              <div className="text-xs text-slate-500 mt-0.5">OMR, Ceklis, Isian & Esai</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">2 Pilihan</div>
              <div className="text-xs text-slate-500 mt-0.5">Rasionalisasi Kuota PTN</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Asymmetric Ruang Kerja Portals */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ruang Kerja Terintegrasi 3 Role
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Dirancang khusus untuk kebutuhan peserta tryout, tentor pengoreksi esai, dan manajemen operasional bimbel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Primary Spotlight (8 Cols): Siswa Portal */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-card hover:shadow-card-hover transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Portal Siswa & Rasionalisasi PTN
                  </h3>
                  <p className="text-xs text-slate-500">Simulasi CBT 4 Format Soal & Peta Peluang Kampus Impian</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Modul Siswa
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Pengalaman ujian terstandarisasi dengan countdown timer per subtest, navigasi palet soal docked, perlindungan anti-curang keluar layar, serta hasil evaluasi skor terhadap passing grade PTN Pilihan 1 & 2.
            </p>

            {/* Sub-feature boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-xs font-bold text-blue-700 flex items-center space-x-1.5">
                  <Zap className="w-4 h-4" />
                  <span>4 Tipe Soal Terstandarisasi</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilihan tunggal OMR, pilihan majemuk ceklis, isian singkat matematis, dan esai penalaran analitis.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>Rasionalisasi Passing Grade</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluasi skor capaian terhadap batas minimal jurusan PTN dengan visualisasi radar chart 7 subtest.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Akses demo: Siswa Raihan Pratama (Aktif)
              </span>
              <Link
                href="/exam/to-utbk-national-01"
                onClick={() => switchRole('siswa')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <span>Buka Simulasi CBT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Secondary Stack (4 Cols): Tentor & Admin Portals */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tentor Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-card hover:shadow-card-hover transition">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Portal Tentor
                    </h4>
                    <span className="text-[11px] text-slate-500">Koreksi & Bank Soal</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Antrean koreksi berkas jawaban esai siswa dengan rubrik slider (0–100) dan editor visual matematika KaTeX.
              </p>
              <div className="pt-1">
                <Link
                  href="/tentor/grading"
                  onClick={() => switchRole('tentor')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>Buka Koreksi Esai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-card hover:shadow-card-hover transition">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Portal Admin & Owner
                    </h4>
                    <span className="text-[11px] text-slate-500">Kasir SPP & Roster</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Import massal data pembayaran & siswa (.xlsx), monitoring kapasitas kelas, dan pencatatan kuitansi resmi.
              </p>
              <div className="pt-1">
                <Link
                  href="/admin/payments"
                  onClick={() => switchRole('admin')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 hover:text-blue-600"
                >
                  <span>Buka Modul Kasir SPP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tryout Booklet Catalog Section */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Katalog Naskah Simulasi CBT
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Paket tryout UTBK terstandarisasi dengan 7 subtest resmi SNBT.
              </p>
            </div>
            <Link
              href="/tryouts"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Lihat Semua Paket ({tryouts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tryouts.map((to) => (
              <div
                key={to.id}
                className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-blue-500/50 hover:bg-white hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {to.code}
                    </span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                      {to.badge || 'Terbuka'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                    {to.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 line-clamp-2">
                    {to.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-white p-3 rounded-xl border border-slate-200/70 mb-5">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Durasi Total</span>
                      <span className="font-bold text-slate-800">{to.totalDurationMinutes} Menit</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Jumlah Subtest</span>
                      <span className="font-bold text-slate-800">{to.subtests.length} Subtest</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {to.participantsCount.toLocaleString('id-ID')} Peserta
                  </span>
                  <Link
                    href={`/exam/${to.id}`}
                    className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
