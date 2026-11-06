'use client';
import Pagination from '@/components/common/Pagination';
import usePagination from '@/hooks/usePagination';

import StatusBadge from '@/components/common/StatusBadge';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EssaySubmission } from '@/types';
import MathRenderer from '@/components/common/MathRenderer';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  FilePenLine,
  MessageCircle,
  Search,
  X,
} from 'lucide-react';

type Filter = 'pending' | 'graded' | 'all';
const filters: { id: Filter; label: string }[] = [
  { id: 'pending', label: 'Perlu dikoreksi' },
  { id: 'graded', label: 'Sudah dinilai' },
  { id: 'all', label: 'Semua jawaban' },
];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function TentorGradingPage() {
  const { essaySubmissions, gradeEssay, showToast, currentUser } = useApp();
  const [selectedEssay, setSelectedEssay] = useState<EssaySubmission | null>(
    null
  );
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('pending');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selectedEssay) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedEssay]);

  const openGrading = (essay: EssaySubmission) => {
    setSelectedEssay(essay);
    setScoreInput(essay.score === undefined ? '' : String(essay.score));
    setFeedbackInput(essay.feedback ?? '');
  };
  const saveGrade = (event: React.FormEvent) => {
    event.preventDefault();
    const score = Number(scoreInput);
    if (
      !selectedEssay ||
      !scoreInput.trim() ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 100
    ) {
      showToast('Isi nilai antara 0 dan 100.', 'warning');
      return;
    }
    if (!feedbackInput.trim()) {
      showToast('Tambahkan umpan balik untuk siswa.', 'warning');
      return;
    }
    gradeEssay(selectedEssay.id, score, feedbackInput.trim());
    setSelectedEssay(null);
  };

  const pending = essaySubmissions.filter((essay) => !essay.isGraded);
  const graded = essaySubmissions.filter((essay) => essay.isGraded);
  const progress = essaySubmissions.length
    ? Math.round((graded.length / essaySubmissions.length) * 100)
    : 0;
  const filtered = essaySubmissions.filter((essay) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'graded' ? essay.isGraded : !essay.isGraded);
    const text = `${essay.studentName} ${essay.studentNis} ${essay.tryoutTitle} ${essay.subtestId.replace(/_/g, ' ')}`;
    return (
      matchesFilter && text.toLowerCase().includes(query.toLowerCase().trim())
    );
  });
  const essaysPagination = usePagination(filtered, 5, query + '|' + filter);

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-12 pt-7 font-sans text-slate-800 sm:pt-10">
      <div className="mx-auto w-full space-y-7 px-5 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Ruang pengajar
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#213B64] sm:text-4xl">
              Koreksi esai
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Setiap umpan balik membantu siswa melangkah lebih jauh.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-slate-500 shadow-sm">
            <FilePenLine size={16} className="text-[#486FA7]" />
            Penilaian manual · 0–100
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="min-w-0 space-y-6">
            <section
              aria-label="Ringkasan koreksi"
              className="relative overflow-hidden rounded-[28px] bg-[#E8EEF9] p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-16 h-52 w-52 rounded-full border-[28px] border-white/30"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#52719A]">
                    Halo, {currentUser.name.split(' ')[0]} 👋
                  </p>
                  <h2 className="mt-2 max-w-md text-xl font-bold leading-snug text-[#244676] sm:text-2xl">
                    {pending.length
                      ? 'Ada cerita belajar yang menunggu tanggapanmu.'
                      : 'Semua jawaban sudah mendapat perhatianmu.'}
                  </h2>
                </div>
                <div
                  aria-hidden="true"
                  className="hidden h-16 w-16 shrink-0 rotate-6 items-center justify-center rounded-2xl bg-white/80 text-[#5277A8] sm:flex"
                >
                  <BookOpen size={31} strokeWidth={1.5} />
                </div>
              </div>
              <dl className="relative mt-7 flex flex-wrap gap-x-9 gap-y-4 sm:gap-x-12">
                <div>
                  <dt className="text-xs text-[#52719A]">Perlu dikoreksi</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-3xl font-bold text-[#244676]">
                    {pending.length}
                    <span className="mt-1 rounded-full bg-white/70 p-1.5 text-[#A67932]">
                      <Clock3 size={15} />
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#52719A]">Sudah dinilai</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-3xl font-bold text-[#244676]">
                    {graded.length}
                    <span className="mt-1 rounded-full bg-white/70 p-1.5 text-[#34856D]">
                      <CheckCheck size={15} />
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#52719A]">Total jawaban</dt>
                  <dd className="mt-1.5 text-3xl font-bold text-[#244676]">
                    {essaySubmissions.length}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              aria-labelledby="submission-title"
              className="overflow-hidden rounded-[24px] bg-white shadow-[0_3px_24px_-12px_rgba(38,62,100,0.12)]"
            >
              <div className="px-5 pt-6 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2
                    id="submission-title"
                    className="text-lg font-bold text-[#253C5C]"
                  >
                    Jawaban siswa
                  </h2>
                  <span aria-live="polite" className="text-xs text-slate-500">
                    {filtered.length} jawaban ditampilkan
                  </span>
                </div>
                <label className="mt-5 flex items-center gap-3 rounded-xl border border-transparent bg-[#F6F8FC] px-4 focus-within:border-[#7796C2] focus-within:ring-2 focus-within:ring-blue-100">
                  <Search size={18} className="shrink-0 text-slate-500" />
                  <span className="sr-only">
                    Cari siswa, kode siswa, atau tryout
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari siswa atau tryout…"
                    className="min-h-12 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
                </label>
                <div
                  role="group"
                  aria-label="Filter status koreksi"
                  className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100"
                >
                  {filters.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={filter === item.id}
                      onClick={() => setFilter(item.id)}
                      className={`min-h-12 shrink-0 border-b-2 px-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${filter === item.id ? 'border-[#426DA8] text-[#315D97]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      {item.label}
                      <span
                        className={`ml-2 rounded-md px-1.5 py-0.5 text-[11px] ${filter === item.id ? 'bg-[#EDF2FA]' : 'bg-slate-50'}`}
                      >
                        {item.id === 'pending'
                          ? pending.length
                          : item.id === 'graded'
                            ? graded.length
                            : essaySubmissions.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <ul className="divide-y divide-slate-100/80">
                {essaysPagination.pageItems.map((essay, index) => (
                  <li
                    key={essay.id}
                    className="p-5 transition hover:bg-[#FAFBFE] sm:px-7 sm:py-6"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        aria-hidden="true"
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${index % 2 ? 'bg-[#F3EDFA] text-[#8B6BA5]' : 'bg-[#ECF2FC] text-[#6183B2]'}`}
                      >
                        {initials(essay.studentName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold leading-6 text-[#263D5F]">
                              {essay.studentName}
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {essay.studentNis}
                            </p>
                          </div>
                          <StatusBadge
                            tone={essay.isGraded ? 'success' : 'warning'}
                          >
                            {essay.isGraded
                              ? 'Sudah dinilai'
                              : 'Menunggu koreksi'}
                          </StatusBadge>
                        </div>
                        <p className="mt-4 text-xs font-medium capitalize text-[#5A7294]">
                          {essay.subtestId.replace(/_/g, ' ')}{' '}
                          <span className="mx-1 text-slate-300">·</span> Soal{' '}
                          {essay.questionNumber}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {essay.tryoutTitle}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                            <Clock3 size={13} />
                            {essay.submittedAt}
                            <span className="mx-1 text-slate-200">|</span>
                            {essay.wordCount} kata
                          </p>
                          <div className="flex items-center gap-4">
                            {essay.isGraded && (
                              <p className="text-lg font-bold text-[#2F745C]">
                                {essay.score}
                                <span className="ml-1 text-xs font-normal text-slate-500">
                                  /100
                                </span>
                              </p>
                            )}
                            <button
                              onClick={() => openGrading(essay)}
                              aria-label={`${essay.isGraded ? 'Lihat penilaian' : 'Koreksi jawaban'} ${essay.studentName}`}
                              className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${essay.isGraded ? 'bg-[#F0F4FA] text-[#42668F] hover:bg-[#E5ECF6]' : 'bg-[#2E578F] text-white shadow-sm hover:bg-[#234573]'}`}
                            >
                              {essay.isGraded
                                ? 'Lihat penilaian'
                                : 'Koreksi jawaban'}
                              <ChevronRight size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-5 sm:px-7">
                <Pagination
                  pagination={essaysPagination}
                  label="jawaban esai"
                />
              </div>

              {!filtered.length && (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5FA] text-[#6D8EB7]">
                    {filter === 'pending' && !query ? (
                      <CheckCheck size={26} />
                    ) : (
                      <Search size={24} />
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-bold">
                    {query
                      ? 'Belum ada jawaban yang cocok'
                      : filter === 'pending'
                        ? 'Antreanmu sudah selesai'
                        : 'Belum ada jawaban di sini'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {query
                      ? 'Coba nama siswa, Kode Siswa, atau judul tryout lain.'
                      : 'Jawaban siswa akan muncul sesuai status koreksinya.'}
                  </p>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-4 min-h-11 px-3 text-sm font-semibold text-[#426DA8]"
                    >
                      Hapus pencarian
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:pt-1">
            <section className="rounded-[24px] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#263D5F]">
                  Progres koreksi
                </h2>
                <CheckCheck size={18} className="text-[#73A48F]" />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <p className="text-3xl font-bold tracking-tight text-[#315D7B]">
                  {progress}
                  <span className="text-lg">%</span>
                </p>
                <p className="pb-1 text-xs text-slate-500">
                  {graded.length} dari {essaySubmissions.length} jawaban
                </p>
              </div>
              <div
                role="progressbar"
                aria-label="Progres koreksi esai"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0F4F6]"
              >
                <div
                  className="h-full rounded-full bg-[#8DB7A8] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-xs leading-6 text-slate-500">
                {pending.length
                  ? 'Luangkan waktu untuk membaca sebelum memberi nilai.'
                  : 'Terima kasih sudah memberi umpan balik untuk siswa.'}
              </p>
            </section>
            <section className="rounded-[24px] bg-[#FDF5E8] p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[#B48A4B]">
                <MessageCircle size={21} />
              </div>
              <h2 className="text-base font-bold text-[#826336]">
                Nilai membantu mengukur.
                <br />
                Umpan balik membantu tumbuh.
              </h2>
              <p className="mt-3 text-xs leading-7 text-[#806841]">
                Sebutkan satu hal yang sudah baik dan satu langkah kecil yang
                bisa siswa perbaiki pada latihan berikutnya.
              </p>
            </section>
            <p className="px-2 text-xs leading-6 text-slate-500">
              Data contoh · Penilaian belum terhubung ke server.
            </p>
          </aside>
        </div>
      </div>

      {selectedEssay && (
        <dialog
          ref={dialogRef}
          aria-labelledby="grading-title"
          onCancel={() => setSelectedEssay(null)}
          className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%_-_1.5rem)] max-w-5xl overflow-y-auto rounded-[24px] border-0 bg-[#F8FAFD] p-0 text-slate-700 shadow-2xl backdrop:bg-[#182D4D]/40 backdrop:backdrop-blur-sm sm:w-[calc(100%_-_3rem)]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs font-medium text-[#7188A6]">
                Ruang koreksi
              </p>
              <h2
                id="grading-title"
                className="mt-1 text-lg font-bold text-[#263D5F]"
              >
                {selectedEssay.studentName}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {selectedEssay.studentNis} · Soal {selectedEssay.questionNumber}
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup penilaian"
              onClick={() => setSelectedEssay(null)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid gap-5 p-4 sm:p-7 lg:grid-cols-[1.2fr_1fr]">
            <div className="min-w-0 space-y-5">
              <section className="rounded-2xl bg-white p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#385C8C]">
                  <BookOpen size={17} />
                  Pertanyaan
                </h3>
                <div className="text-sm leading-7 text-slate-600">
                  <MathRenderer content={selectedEssay.questionText} />
                </div>
              </section>
              <section className="rounded-2xl bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#385C8C]">
                    Jawaban siswa
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedEssay.wordCount} kata
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-8 text-slate-600">
                  {selectedEssay.studentAnswer}
                </p>
              </section>
            </div>
            <div className="min-w-0 space-y-5">
              <section className="rounded-2xl bg-[#EDF3FA] p-5">
                <h3 className="text-sm font-bold text-[#385C8C]">
                  Panduan penilaian
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-xs leading-7 text-[#637E9F]">
                  {selectedEssay.rubricGuide ||
                    'Gunakan rubrik yang ditetapkan untuk soal ini.'}
                </p>
              </section>
              <form onSubmit={saveGrade} className="rounded-2xl bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="essay-score"
                    className="text-sm font-bold text-[#385C8C]"
                  >
                    Nilai esai
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="essay-score"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      required
                      value={scoreInput}
                      onChange={(event) => setScoreInput(event.target.value)}
                      placeholder="—"
                      className="min-h-12 w-20 rounded-xl border border-slate-200 bg-[#F8FAFD] px-3 text-center text-xl font-bold text-[#315D7B] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
                <input
                  aria-label="Geser nilai esai"
                  type="range"
                  min="0"
                  max="100"
                  value={scoreInput || 0}
                  onChange={(event) => setScoreInput(event.target.value)}
                  className="mt-5 min-h-8 w-full accent-[#527FA7]"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Isi nilai setelah membaca jawaban dan panduan.
                </p>
                <label
                  htmlFor="essay-feedback"
                  className="mb-3 mt-6 block text-sm font-bold text-[#385C8C]"
                >
                  Umpan balik untuk siswa
                </label>
                <textarea
                  id="essay-feedback"
                  rows={5}
                  required
                  maxLength={5000}
                  value={feedbackInput}
                  onChange={(event) => setFeedbackInput(event.target.value)}
                  placeholder="Apa yang sudah baik? Apa yang bisa diperbaiki?"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFD] p-3.5 text-sm leading-7 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEssay(null)}
                    className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2E578F] px-5 text-sm font-semibold text-white hover:bg-[#234573]"
                  >
                    Simpan penilaian
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
