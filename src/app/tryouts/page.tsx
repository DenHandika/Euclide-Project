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
} from 'lucide-react';

export default function TryoutsCatalogPage() {
  const { tryouts, activeSessions } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Naskah' },
    { id: 'grand', label: 'Grand Tryout Nasional' },
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
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#637096] font-bold block mb-1">
              STANDAR RESMI UTBK-SNBT BPPP 2026
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Katalog Naskah Simulasi CBT
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Pilih paket ujian untuk mengukur skor IRT dan rasionalisasi daya saing PTN impian.
            </p>
          </div>

          <Link
            href="/exam/to-utbk-national-01/result"
            className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] text-xs font-mono px-3.5 py-2 border border-[#13224E] transition"
          >
            <Award className="w-4 h-4 text-[#1B8A5A]" />
            <span>Hasil Terakhir (Rasionalisasi)</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-[#637096] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 border whitespace-nowrap transition ${
                filterCategory === cat.id
                  ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                  : 'bg-[#FFFFFF] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
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
                className="bg-[#FFFFFF] border border-[#13224E] p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Strip */}
                  <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                    <span className="bg-[#FAFAF7] text-[#13224E] px-2 py-0.5 border border-[#CECEC2] font-semibold">
                      {to.code}
                    </span>
                    <span className="text-[#C8831A] bg-[#FDF3E3] border border-[#EFA93B]/40 px-2 py-0.5 font-bold">
                      {to.badge || 'Terbuka'}
                    </span>
                  </div>

                  <h2 className="font-serif text-base font-bold text-[#13224E] mb-2 leading-snug">
                    {to.title}
                  </h2>
                  <p className="text-xs text-[#637096] mb-4 line-clamp-3">
                    {to.description}
                  </p>

                  {/* Specs Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#FAFAF7] p-2.5 border border-[#E4E4DC] mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[#1B3B8C] shrink-0" />
                      <div>
                        <span className="text-[9px] text-[#9EABC7] block uppercase">Durasi</span>
                        <span className="font-bold text-[#13224E]">{to.totalDurationMinutes} Menit</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#C8831A] shrink-0" />
                      <div>
                        <span className="text-[9px] text-[#9EABC7] block uppercase">Jumlah Soal</span>
                        <span className="font-bold text-[#13224E]">{to.totalQuestions} Soal</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtest List */}
                  <div className="space-y-1 mb-5">
                    <div className="font-mono text-[10px] text-[#637096] uppercase font-bold">
                      Struktur Subtest ({to.subtests.length}):
                    </div>
                    <div className="space-y-1">
                      {to.subtests.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between text-xs py-1 px-2 bg-[#FAFAF7] border border-[#E4E4DC] text-[#13224E]"
                        >
                          <span className="font-medium truncate">{st.name}</span>
                          <span className="text-[10px] font-mono text-[#637096]">
                            {st.durationMinutes}m • {st.questionCount}q
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#637096]">
                    {to.participantsCount.toLocaleString('id-ID')} peserta
                  </span>

                  {isCompleted ? (
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/exam/${to.id}/result`}
                        className="inline-flex items-center space-x-1 bg-[#1B8A5A] hover:bg-[#126340] text-white px-3 py-1.5 font-medium transition"
                      >
                        <Award className="w-3 h-3" />
                        <span>Rasionalisasi</span>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/exam/${to.id}`}
                      className="inline-flex items-center space-x-1 bg-[#1B3B8C] hover:bg-[#274DB8] text-white px-3.5 py-1.5 font-medium transition"
                    >
                      <span>{isInProgress ? 'Lanjutkan' : 'Mulai Ujian'}</span>
                      <ArrowRight className="w-3 h-3" />
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
