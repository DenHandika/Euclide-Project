'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Clock,
  Award,
  Users,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function TryoutsCatalogPage() {
  const { tryouts, activeSessions } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Naskah' },
    { id: 'grand', label: 'Grand Tryout SNBT' },
    { id: 'tps', label: 'Drilling TPS & Kuantitatif' },
    { id: 'literasi', label: 'Literasi & Bahasa' },
  ];

  const filteredTryouts = tryouts.filter((to) => {
    if (filterCategory === 'grand') return to.id.includes('national');
    if (filterCategory === 'tps') return to.id.includes('tps');
    if (filterCategory === 'literasi') return to.id.includes('literasi');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-semibold text-blue-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar Resmi UTBK-SNBT 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Katalog Naskah Simulasi CBT
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pilih paket tryout terstandarisasi untuk mengukur skor capaian dan rasionalisasi peluang PTN impian.
            </p>
          </div>

          <Link
            href="/exam/to-utbk-national-01/result"
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Hasil Terakhir (Rasionalisasi)</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tryout Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredTryouts.map((to) => {
            const session = activeSessions[to.id];
            const isCompleted = session?.isCompleted;
            const isOngoing = session && !isCompleted;

            return (
              <div
                key={to.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-card-hover transition-all duration-200 shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {to.code}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-0.5 rounded-full">
                      {to.badge || 'Terbuka'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {to.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    {to.description}
                  </p>

                  {/* Subtest List Pill Preview */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Subtest Termasuk ({to.subtests.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {to.subtests.map((st) => (
                        <span
                          key={st.id}
                          className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {st.name.split(' ')[0]} ({st.questionCount} soal)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 mb-5">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Waktu Ujian</span>
                      <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{to.totalDurationMinutes} Menit</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Jumlah Butir</span>
                      <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>{to.totalQuestions} Soal</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{to.participantsCount.toLocaleString('id-ID')} Siswa</span>
                  </div>

                  {isCompleted ? (
                    <Link
                      href={`/exam/${to.id}/result`}
                      className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lihat Hasil</span>
                    </Link>
                  ) : isOngoing ? (
                    <Link
                      href={`/exam/${to.id}`}
                      className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition"
                    >
                      <span>Lanjutkan Ujian</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/exam/${to.id}`}
                      className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs hover:shadow transition"
                    >
                      <span>Mulai Simulasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
