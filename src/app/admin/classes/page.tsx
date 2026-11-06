'use client';
import Pagination from '@/components/common/Pagination';
import usePagination from '@/hooks/usePagination';

import StatusBadge from '@/components/common/StatusBadge';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ClassBatch } from '@/types';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Pencil,
  Search,
  Users,
  X,
} from 'lucide-react';

type Availability = 'all' | 'available' | 'full';
const accents = [
  { surface: 'bg-[#ECF2FC]', text: 'text-[#597EAF]', bar: 'bg-[#83A6D3]' },
  { surface: 'bg-[#F3EEFA]', text: 'text-[#8B70A4]', bar: 'bg-[#AD98C8]' },
  { surface: 'bg-[#FFF3E4]', text: 'text-[#A47A3F]', bar: 'bg-[#D5AF72]' },
  { surface: 'bg-[#EBF6F1]', text: 'text-[#4D8B75]', bar: 'bg-[#84B7A5]' },
];

export default function AdminClassesPage() {
  const { batches, updateBatchCapacity } = useApp();
  const [editingBatch, setEditingBatch] = useState<ClassBatch | null>(null);
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState<Availability>('all');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!editingBatch) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [editingBatch]);

  const studentCount = batches.reduce(
    (sum, batch) => sum + batch.currentStudents,
    0
  );
  const availableSeats = batches.reduce(
    (sum, batch) =>
      sum + Math.max(0, batch.maxCapacity - batch.currentStudents),
    0
  );
  const filtered = batches.filter((batch) => {
    const matches =
      `${batch.name} ${batch.program} ${batch.tutorName} ${batch.room}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    return (
      matches &&
      (availability === 'all' ||
        (availability === 'full'
          ? batch.currentStudents >= batch.maxCapacity
          : batch.currentStudents < batch.maxCapacity))
    );
  });
  const classesPagination = usePagination(
    filtered,
    6,
    search + '|' + availability,
    [3, 6, 12, 24]
  );

  const editCapacity = (batch: ClassBatch) => {
    setEditingBatch(batch);
    setCapacity(String(batch.maxCapacity));
    setError('');
  };
  const saveCapacity = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingBatch) return;
    const current = batches.find((batch) => batch.id === editingBatch.id);
    const value = Number(capacity);
    if (
      !current ||
      !capacity.trim() ||
      !Number.isInteger(value) ||
      value < Math.max(1, current.currentStudents) ||
      value > 10000
    ) {
      setError(
        `Isi kapasitas bulat antara ${Math.max(1, current?.currentStudents ?? 1)} dan 10.000 kursi.`
      );
      return;
    }
    updateBatchCapacity(editingBatch.id, value);
    setEditingBatch(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-8 font-sans text-slate-700 sm:py-10">
      <div className="mx-auto w-full space-y-7 px-5 sm:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8AA9CE]" />
              Ruang pengelola
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#213B64] sm:text-4xl">
              Kelas belajar
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Atur ruang untuk belajar, bertemu, dan bertumbuh bersama.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-[#567393] shadow-sm">
            <BookOpen size={16} />
            Program bimbingan Euclide
          </span>
        </header>

        <section
          aria-label="Ringkasan kelas"
          className="flex flex-col justify-between gap-6 overflow-hidden rounded-[28px] bg-[#EAF0F9] p-6 sm:flex-row sm:items-center sm:p-7"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[#6689B7]">
              <Users size={27} strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#2F507C]">
                Tempat untuk langkah berikutnya.
              </h2>
              <p className="mt-1 text-xs leading-6 text-[#537298]">
                Pantau keterisian dan siapkan tempat bagi siswa.
              </p>
            </div>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-5 sm:gap-8">
            <div>
              <dt className="text-xs text-[#537298]">Kelas</dt>
              <dd className="mt-1.5 text-2xl font-bold text-[#2F507C]">
                {batches.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#537298]">Siswa terdaftar</dt>
              <dd className="mt-1.5 text-2xl font-bold text-[#2F507C]">
                {studentCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#537298]">Kursi tersedia</dt>
              <dd className="mt-1.5 text-2xl font-bold text-[#2F507C]">
                {availableSeats}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="classes-title" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2
                id="classes-title"
                className="text-lg font-bold text-[#263D5F]"
              >
                Daftar kelas
              </h2>
              <p aria-live="polite" className="mt-1 text-xs text-slate-500">
                {filtered.length} kelas ditampilkan
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-transparent bg-white px-4 focus-within:border-[#8DA9CE] focus-within:ring-2 focus-within:ring-blue-100">
                <Search size={17} className="shrink-0 text-slate-500" />
                <span className="sr-only">
                  Cari kelas, pengajar, atau ruang
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari kelas atau pengajar…"
                  className="min-h-12 w-full min-w-0 bg-transparent text-sm outline-none sm:w-52"
                />
              </label>
              <div className="relative">
                <label htmlFor="class-availability" className="sr-only">
                  Filter ketersediaan kursi
                </label>
                <select
                  id="class-availability"
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value as Availability)
                  }
                  className="min-h-12 w-full appearance-none rounded-xl border border-transparent bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 focus:border-[#8DA9CE] focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">Semua kapasitas</option>
                  <option value="available">Masih tersedia</option>
                  <option value="full">Kelas penuh</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-4 text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {classesPagination.pageItems.map((batch) => {
              const theme =
                accents[
                  Math.max(
                    0,
                    batches.findIndex((item) => item.id === batch.id)
                  ) % accents.length
                ];
              const remaining = Math.max(
                0,
                batch.maxCapacity - batch.currentStudents
              );
              const percentage =
                batch.maxCapacity > 0
                  ? Math.round(
                      (batch.currentStudents / batch.maxCapacity) * 100
                    )
                  : 100;
              const full = remaining === 0;
              return (
                <article
                  key={batch.id}
                  className="flex flex-col rounded-[24px] bg-white p-5 shadow-[0_3px_24px_-12px_rgba(38,62,100,0.12)] transition-shadow hover:shadow-[0_8px_32px_-14px_rgba(38,62,100,0.2)] sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${theme.surface} ${theme.text}`}
                      >
                        <BookOpen size={22} strokeWidth={1.7} />
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${theme.surface} ${theme.text}`}
                      >
                        {batch.program}
                      </span>
                    </div>
                    <StatusBadge tone={full ? 'danger' : 'success'}>
                      {full ? 'Kelas penuh' : `${remaining} kursi tersedia`}
                    </StatusBadge>
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-7 text-[#263D5F]">
                    {batch.name}
                  </h3>
                  <div className="mt-4 space-y-2.5 text-xs leading-6 text-slate-500">
                    <p className="flex items-start gap-2.5">
                      <MapPin
                        size={16}
                        className="mt-1 shrink-0 text-[#88A0BF]"
                      />
                      <span>{batch.room}</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <Users
                        size={16}
                        className="mt-1 shrink-0 text-[#88A0BF]"
                      />
                      <span>{batch.tutorName}</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <CalendarDays
                        size={16}
                        className="mt-1 shrink-0 text-[#88A0BF]"
                      />
                      <span>{batch.schedule}</span>
                    </p>
                  </div>
                  <div className="mt-auto pt-6">
                    <div className="mb-2.5 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500">Keterisian kelas</span>
                      <span className="font-semibold text-[#486284]">
                        {batch.currentStudents}
                        <span className="font-normal text-slate-500">
                          {' '}
                          / {batch.maxCapacity} siswa
                        </span>
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`Keterisian ${batch.name}`}
                      aria-valuenow={batch.currentStudents}
                      aria-valuemin={0}
                      aria-valuemax={Math.max(1, batch.maxCapacity)}
                      className="h-2 overflow-hidden rounded-full bg-[#F0F3F8]"
                    >
                      <div
                        className={`h-full rounded-full transition-all ${full ? 'bg-[#D99A92]' : theme.bar}`}
                        style={{
                          width: `${Math.min(100, Math.max(0, percentage))}%`,
                        }}
                      />
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        {batch.status === 'upcoming' ? (
                          <>
                            <CalendarDays size={14} />
                            Segera dimulai
                          </>
                        ) : batch.status === 'completed' ? (
                          <>
                            <Check size={14} />
                            Kelas selesai
                          </>
                        ) : (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-[#7DAD95]" />
                            Kelas aktif
                          </>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => editCapacity(batch)}
                        aria-label={`Ubah kuota ${batch.name}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F0F4FA] px-4 text-xs font-semibold text-[#42668F] transition hover:bg-[#E3EBF7]"
                      >
                        <Pencil size={14} />
                        Ubah kuota
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination pagination={classesPagination} label="kelas" />

          {!filtered.length && (
            <div className="rounded-[24px] bg-white px-6 py-14 text-center">
              <Search size={27} className="mx-auto text-[#8AA4C4]" />
              <h3 className="mt-4 font-bold text-[#263D5F]">
                Kelas belum ditemukan
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Coba nama pengajar, ruang, atau pilihan kapasitas yang lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setAvailability('all');
                }}
                className="mt-4 min-h-11 px-3 text-sm font-semibold text-[#426DA8]"
              >
                Tampilkan semua kelas
              </button>
            </div>
          )}
        </section>
        <p className="text-xs leading-6 text-slate-500">
          Data contoh untuk uji frontend. Pengelolaan kelas belum terhubung ke
          server.
        </p>
      </div>

      {editingBatch && (
        <dialog
          ref={dialogRef}
          aria-labelledby="capacity-title"
          onCancel={() => setEditingBatch(null)}
          className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-[28px] border-0 bg-white p-6 text-slate-700 shadow-2xl backdrop:bg-[#182D4D]/40 backdrop:backdrop-blur-sm sm:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECF2FC] text-[#6387B5]">
              <Users size={24} />
            </span>
            <button
              type="button"
              onClick={() => setEditingBatch(null)}
              aria-label="Tutup pengaturan kuota"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
          <h2
            id="capacity-title"
            className="mt-5 text-xl font-bold text-[#263D5F]"
          >
            Atur kapasitas kelas
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            {editingBatch.name}
          </p>
          <form onSubmit={saveCapacity} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="class-capacity"
                className="mb-2 block text-sm font-semibold text-[#486284]"
              >
                Jumlah kursi
              </label>
              <input
                id="class-capacity"
                type="number"
                inputMode="numeric"
                min={Math.max(1, editingBatch.currentStudents)}
                max={10000}
                step={1}
                required
                value={capacity}
                onChange={(event) => {
                  setCapacity(event.target.value);
                  setError('');
                }}
                aria-describedby="capacity-help capacity-error"
                aria-invalid={!!error}
                className="min-h-14 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 text-2xl font-bold text-[#315D7B] focus:border-[#8DA9CE] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <p
                id="capacity-help"
                className="mt-3 text-xs leading-6 text-slate-500"
              >
                Sudah ada {editingBatch.currentStudents} siswa terdaftar.
                Kapasitas tidak boleh lebih kecil dari jumlah tersebut.
              </p>
              <p
                id="capacity-error"
                role="alert"
                className="mt-2 text-xs leading-6 text-rose-700"
              >
                {error}
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditingBatch(null)}
                className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-[#2E578F] px-5 text-sm font-semibold text-white hover:bg-[#234573]"
              >
                Simpan perubahan
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
