'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Clock,
  Award,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function TryoutsCatalogPage() {
  const { tryouts, activeSessions, currentUser } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Simulasi' },
    { id: 'grand', label: 'Grand Tryout Nasional' },
    { id: 'tps', label: 'Drilling Kuantitatif & TPS' },
    { id: 'literasi', label: 'Literasi & Bahasa' },
  ];

  const filteredTryouts = tryouts.filter((to) => {
    if (filterCategory === 'grand') return to.id.includes('national');
    if (filterCategory === 'tps') return to.id.includes('tps');
    if (filterCategory === 'literasi') return to.id.includes('literasi');
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standar BPPP UTBK-SNBT 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Katalog Simulasi CBT Tryout
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pilih paket ujian untuk mengukur kesiapan skor IRT dan rasionalisasi peluang PTN impian Anda.
            </p>
          </div>

          {/* Quick Result Shortcut */}
          <Link
            href="/exam/to-utbk-national-01/result"
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Lihat Hasil Terakhir (Rasionalisasi)</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filterCategory === cat.id
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tryout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredTryouts.map((to) => {
            const session = activeSessions[to.id];
            const isCompleted = session?.isCompleted;
            const isInProgress = session && !session.isCompleted;

            return (
              <div
                key={to.id}
                className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                      {to.code}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {to.badge || 'Terbuka'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {to.title}
                  </h2>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-3">
                    {to.description}
                  </p>

                  {/* Exam Specs Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Waktu</span>
                        <span className="font-bold text-slate-800">{to.totalDurationMinutes} Menit</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jumlah Soal</span>
                        <span className="font-bold text-slate-800">{to.totalQuestions} Soal</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtests Accordion / List */}
                  <div className="space-y-1.5 mb-6">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Struktur Subtest ({to.subtests.length}):
                    </div>
                    <div className="space-y-1">
                      {to.subtests.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-100/70 text-slate-700"
                        >
                          <span className="font-medium truncate">{st.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 font-mono">
                            {st.durationMinutes}m • {st.questionCount}q
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{to.participantsCount.toLocaleString('id-ID')} peserta</span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/exam/${to.id}/result`}
                        className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Rasionalisasi</span>
                      </Link>
                      <Link
                        href={`/exam/${to.id}`}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline px-2"
                      >
                        Ulangi
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/exam/${to.id}`}
                      className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span>{isInProgress ? 'Lanjutkan CBT' : 'Mulai Ujian'}</span>
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
