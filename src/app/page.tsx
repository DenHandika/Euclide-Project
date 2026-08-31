'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  Calculator,
  Lock,
  Smartphone,
} from 'lucide-react';
import MathRenderer from '@/components/common/MathRenderer';

export default function LandingPage() {
  const { switchRole, tryouts } = useApp();

  const featureCards = [
    {
      title: 'Mobile-First CBT Engine',
      description: 'Player ujian responsif dengan timer per subtest, 4 format soal (Pilihan Ganda, Kotak Ceklis, Isian Singkat, Esai), dan palet nomor interaktif.',
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      badge: 'Ergonomis',
    },
    {
      title: 'Formula KaTeX & IRT Scoring',
      description: 'Rendering rumus matematika, matriks, dan kalkulus tajam tanpa lag, dilengkapi kalkulasi bobot Item Response Theory (IRT).',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      badge: 'High Precision',
    },
    {
      title: 'Rasionalisasi SNBT & Radar Chart',
      description: 'Analisis peluang lolos PTN Pilihan 1 & 2 (Zona Aman / Kompetitif / Kritis) lengkap dengan rekomendasi strategi tentor.',
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      badge: 'Passing Grade AI',
    },
    {
      title: 'Excel SPP & Kasir Digital',
      description: 'Impor massal pembayaran via spreadsheet .xlsx / .csv dengan validasi baris instan, kuitansi digital, dan pembukuan kas bimbel.',
      icon: <FileSpreadsheet className="w-6 h-6 text-indigo-600" />,
      badge: 'Automated Finance',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-navy to-slate-900 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Ujian Resmi UTBK-SNBT 2026 & BPPP</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Sistem CBT Tryout & Manajemen Bimbel{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">
                Presisi Tinggi
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
              Ekosistem terpadu untuk <strong>Siswa</strong> (CBT Mobile-First & Rasionalisasi PTN), <strong>Tentor</strong> (Koreksi Esai & Bank Soal KaTeX), dan <strong>Owner Bimbel</strong> (Keuangan Kas & Excel Bulk Import).
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/exam/to-utbk-national-01"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>Simulasi CBT Siswa Live</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => switchRole('admin')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold px-6 py-3.5 rounded-xl backdrop-blur-md transition transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Masuk Dashboard Admin</span>
              </Link>
            </div>

            {/* Live Stats Row */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-left">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-extrabold text-white">4.820+</div>
                <div className="text-[11px] text-slate-400">Peserta Tryout Aktif</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-extrabold text-amber-400">7 Subtest</div>
                <div className="text-[11px] text-slate-400">Lengkap Standar BPPP</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-extrabold text-emerald-400">97.2%</div>
                <div className="text-[11px] text-slate-400">Akurasi Rasionalisasi</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-extrabold text-blue-300">0.05s</div>
                <div className="text-[11px] text-slate-400">Latency KaTeX Engine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Role Selection Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Siswa */}
          <div className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Portal Siswa
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">
                Simulasi CBT & Rasionalisasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Ujian dengan timer subtest ketat, navigasi nomor cepat, anti-cheat, dan evaluasi radar chart passing grade PTN tujuan.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>4 Tipe Soal (Pilihan Ganda, Ceklis, Isian, Esai)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Analisis Zona Aman / Kompetitif PTN</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/exam/to-utbk-national-01"
                onClick={() => switchRole('siswa')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <span>Uji CBT Siswa</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Tentor */}
          <div className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                Portal Tentor
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">
                Koreksi Esai & Bank Soal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Antrean koreksi esai siswa dengan slider rubrik skor, catatan strategi PTN, dan pembuat soal dengan live KaTeX preview.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Rubrik Penilaian Manual Real-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Editor Rumus KaTeX & Matriks</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/tentor/grading"
                onClick={() => switchRole('tentor')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Buka Antrean Esai</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-200 hover:border-indigo-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                Portal Super-Admin
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">
                Keuangan, Excel & Kuota Bimbel
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Impor massal data pembayaran siswa via file Excel, cetak kuitansi kasir digital, dan kelola kapasitas kuota batch bimbel.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bulk Import .xlsx/.csv & Validator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Manajemen Status Siswa & SPP</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => switchRole('admin')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800"
              >
                <span>Buka Dashboard Admin</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tryout Catalog Preview Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Layers className="w-4 h-4" />
              <span>Katalog Simulasi CBT</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Pilihan Paket Tryout & Drilling Intensif
            </h2>
          </div>
          <Link
            href="/tryouts"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Lihat Semua ({tryouts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tryouts.map((to) => (
            <div
              key={to.id}
              className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                    {to.code}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {to.badge || 'Terbuka'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  {to.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {to.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Durasi</span>
                    <span className="font-semibold">{to.totalDurationMinutes} Menit</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jumlah Subtest</span>
                    <span className="font-semibold">{to.subtests.length} Subtest</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{to.participantsCount}</span> peserta
                </div>
                <Link
                  href={`/exam/${to.id}`}
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs transition"
                >
                  <span>Mulai CBT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Dirancang Khusus untuk Standar Tryout Modern
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Setiap komponen dirancang agar cepat, akurat, dan ramah sentuhan (touch-friendly) untuk siswa pengguna smartphone maupun laptop pengawas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KaTeX Math Formula Live Banner Showcase */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                KaTeX Live Formula Engine
              </span>
              <h3 className="text-xl font-bold">Rendering Rumus Sains & Matematika Kompleks</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Mendukung integral lipat, determinan matriks $2 \times 2$, logaritma berbobot, dan notasi kalkulus presisi tanpa ketergantungan gambar statis.
              </p>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-center w-full md:w-auto">
              <div className="text-xs text-slate-400 mb-1 font-mono">Live Demo Math:</div>
              <div className="text-sm font-medium text-amber-300">
                <MathRenderer
                  content="$$V(t) = \int_{0}^{t} (3x^2 - 4x + 6) \, dx \implies \det \begin{pmatrix} 2 & x \\ 3 & 5 \end{pmatrix} = 8$$"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
