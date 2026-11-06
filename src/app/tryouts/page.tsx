'use client';
import Pagination from '@/components/common/Pagination';
import usePagination from '@/hooks/usePagination';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import TryoutCard from '@/components/common/TryoutCard';

export default function TryoutsCatalogPage() {
  const { tryouts, currentUser } = useApp();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const categories = [
    { id: 'all', label: 'Semua tryout' },
    { id: 'grand', label: 'UTBK lengkap' },
    { id: 'tps', label: 'TPS & matematika' },
    { id: 'literasi', label: 'Literasi' },
  ];
  const filtered = tryouts.filter(
    (t) =>
      (category === 'all' ||
        (category === 'grand'
          ? t.subtests.length >= 7
          : category === 'literasi'
            ? t.subtests.every((subtest) => subtest.category === 'Literasi')
            : t.subtests.length < 7 &&
              t.subtests.some((subtest) => subtest.category !== 'Literasi'))) &&
      `${t.title} ${t.description} ${t.subtests.map((s) => s.name).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase().trim())
  );
  const tryoutsPagination = usePagination(
    filtered,
    6,
    search + '|' + category,
    [3, 6, 12, 24]
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <p className="eu-eyebrow">RUANG BELAJAR</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Siap latihan, {currentUser.name.split(' ')[0]}?
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Pilih tryout sesuai kebutuhanmu. Mulai, evaluasi, lalu tingkatkan
            lagi.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E0E7F0] bg-[#EAF0FA] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold">
              Belajar lebih terarah dari hasil tryout
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lihat evaluasi subtes dan target program studi untuk menyusun
              langkah berikutnya.
            </p>
          </div>
          <Link
            href="/exam/to-utbk-national-01/result"
            className="flex shrink-0 items-center gap-2 text-sm font-bold text-[#244676] hover:underline"
          >
            Contoh hasil tryout
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div
            role="group"
            aria-label="Kategori tryout"
            className="flex flex-wrap gap-2"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${category === c.id ? 'border-[#244676] bg-[#244676] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-[#B4C5DE]'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 xl:w-64">
            <Search size={17} className="shrink-0 text-slate-400" />
            <input
              aria-label="Cari tryout"
              placeholder="Cari materi atau tryout..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 w-full bg-transparent py-3 text-sm outline-none"
            />
          </label>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          {filtered.length} paket tersedia{' '}
          <span className="text-slate-400">· Data contoh versi demo</span>
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tryoutsPagination.pageItems.map((t) => (
            <TryoutCard key={t.id} tryout={t} />
          ))}
        </div>
        <Pagination pagination={tryoutsPagination} label="tryout" />

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 text-slate-400" />
            <h2 className="font-bold">Tryout belum ditemukan</h2>
            <p className="mt-2 text-sm text-slate-500">
              Coba kata kunci lain atau tampilkan semua kategori.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
              className="eu-button-secondary mt-5"
            >
              Tampilkan semua tryout
            </button>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Ingin belajar satu materi dulu?
          </p>
          <Link
            href="/drilling"
            className="flex items-center gap-2 text-sm font-semibold text-[#244676]"
          >
            Buka latihan soal
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
