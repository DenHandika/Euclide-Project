'use client';
import Pagination from '@/components/common/Pagination';
import usePagination from '@/hooks/usePagination';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserStatus } from '@/types';
import StudentBulkImportModal from '@/components/admin/StudentBulkImportModal';
import { AccountStatusBadge } from '@/components/common/StatusBadge';
import {
  Search,
  Upload,
  Users,
  UserCheck,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

const statusFilters = [
  { id: 'all', label: 'Semua' },
  { id: 'active', label: 'Aktif' },
  { id: 'nonactive', label: 'Nonaktif' },
  { id: 'suspended', label: 'SPP tertunggak' },
  { id: 'graduated', label: 'Lulus' },
  { id: 'leave', label: 'Cuti' },
];
const statusOptions: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'nonactive', label: 'Nonaktif' },
  { value: 'suspended', label: 'SPP tertunggak' },
  { value: 'graduated', label: 'Lulus' },
  { value: 'leave', label: 'Cuti' },
];

export default function AdminStudentsPage() {
  const { students, toggleStudentStatus, batches } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const filteredStudents = students.filter((student) => {
    const matches =
      `${student.name} ${student.nis ?? ''} ${student.email} ${student.targetPTN1 ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
    return (
      matches && (statusFilter === 'all' || student.status === statusFilter)
    );
  });
  const studentsPagination = usePagination(
    filteredStudents,
    5,
    searchTerm + '|' + statusFilter
  );

  const batchName = (id?: string) =>
    batches.find((batch) => batch.id === id)?.name ?? 'Belum ditempatkan';
  const initial = (name: string) =>
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  const statusSelect = (id: string, name: string, status: UserStatus) => (
    <div className="relative inline-block">
      <select
        aria-label={`Ubah status ${name}`}
        value={status}
        onChange={(event) =>
          toggleStudentStatus(id, event.target.value as UserStatus)
        }
        className="min-h-11 w-44 appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-600 outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-8 font-sans text-slate-700 sm:py-10">
      <div className="mx-auto w-full space-y-6 px-5 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Ruang pengelola
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#213B64] sm:text-4xl">
              Siswa bimbingan
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Kenali siswa, pantau kelasnya, dan kelola akses belajarnya.
            </p>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2E578F] px-5 text-sm font-semibold text-white hover:bg-[#234573]"
          >
            <Upload size={17} />
            Impor siswa
          </button>
        </header>

        <dl className="flex flex-wrap gap-x-8 gap-y-4 rounded-2xl bg-white px-5 py-5 sm:gap-x-14 sm:px-6">
          {[
            {
              label: 'Total siswa',
              value: students.length,
              Icon: Users,
              color: 'bg-blue-50 text-blue-600',
            },
            {
              label: 'Siswa aktif',
              value: students.filter((student) => student.status === 'active')
                .length,
              Icon: UserCheck,
              color: 'bg-emerald-50 text-emerald-700',
            },
            {
              label: 'Alumni',
              value: students.filter(
                (student) => student.status === 'graduated'
              ).length,
              Icon: GraduationCap,
              color: 'bg-violet-50 text-violet-600',
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}
              >
                <item.Icon size={21} strokeWidth={1.7} />
              </span>
              <div>
                <dt className="text-xs text-slate-500">{item.label}</dt>
                <dd className="mt-1 text-xl font-bold text-[#263D5F]">
                  {item.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <section
          aria-labelledby="student-list-title"
          className="overflow-hidden rounded-[24px] bg-white shadow-[0_3px_24px_-12px_rgba(38,62,100,0.12)]"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-5 xl:flex-row xl:items-center sm:px-6">
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter status siswa"
            >
              {statusFilters.map((filter) => {
                const count =
                  filter.id === 'all'
                    ? students.length
                    : students.filter((student) => student.status === filter.id)
                        .length;
                return (
                  <button
                    key={filter.id}
                    aria-pressed={statusFilter === filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-xs font-semibold transition ${statusFilter === filter.id ? 'bg-[#EDF2FA] text-[#315D97]' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {filter.label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[11px] ${statusFilter === filter.id ? 'bg-white text-[#315D97]' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="flex w-full items-center gap-2.5 rounded-xl bg-[#F6F8FC] px-3.5 focus-within:ring-2 focus-within:ring-blue-100 xl:w-80">
              <Search size={17} className="shrink-0 text-slate-500" />
              <span className="sr-only">
                Cari nama, Kode Siswa, email, atau PTN
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari nama, kode, email, atau PTN…"
                className="min-h-11 w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-6">
            <h2
              id="student-list-title"
              className="text-sm font-bold text-[#263D5F]"
            >
              Daftar siswa
            </h2>
            <p aria-live="polite" className="text-xs text-slate-500">
              {filteredStudents.length} siswa ditampilkan
            </p>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1340px] text-left text-sm">
              <thead className="bg-[#F8FAFD] text-xs font-medium text-slate-500">
                <tr>
                  <th scope="col" className="w-16 px-6 py-3.5 font-medium">
                    No.
                  </th>
                  <th className="px-4 py-3.5 font-medium whitespace-nowrap">
                    Kode Siswa
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-medium">
                    Siswa
                  </th>
                  <th className="px-4 py-3.5 font-medium">Kelas bimbingan</th>
                  <th className="px-4 py-3.5 font-medium">
                    Target kampus & prodi
                  </th>
                  <th className="px-4 py-3.5 font-medium whitespace-nowrap">
                    WhatsApp
                  </th>
                  <th className="px-4 py-3.5 font-medium whitespace-nowrap">
                    Status akun
                  </th>
                  <th className="px-6 py-3.5 text-right font-medium whitespace-nowrap">
                    Kelola status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsPagination.pageItems.map((student, index) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-[#FAFBFE]"
                  >
                    <td className="px-6 py-5 text-xs tabular-nums text-slate-500">
                      {studentsPagination.offset + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-xs font-medium tabular-nums text-slate-500">
                      {student.nis || 'Belum tersedia'}
                    </td>
                    <td className="min-w-[280px] px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EDF2FA] text-xs font-bold text-[#6686B0]"
                        >
                          {initial(student.name)}
                        </span>
                        <div>
                          <p className="font-semibold text-[#263D5F]">
                            {student.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[200px] max-w-[260px] px-4 py-5 text-xs leading-6 text-[#526B8C]">
                      {batchName(student.batchId)}
                    </td>
                    <td className="min-w-[220px] max-w-[300px] px-4 py-5">
                      <p className="text-xs font-semibold leading-6 text-[#405C80]">
                        {student.targetPTN1 || 'Belum dipilih'}
                      </p>
                      <p className="mt-0.5 text-xs leading-6 text-slate-500">
                        {student.targetProdi1 || 'Belum dipilih'}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-xs tabular-nums text-slate-500">
                      {student.phone || 'Belum tersedia'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5">
                      <AccountStatusBadge status={student.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      {statusSelect(student.id, student.name, student.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 lg:hidden">
            {studentsPagination.pageItems.map((student, index) => (
              <article key={student.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-xs font-medium tabular-nums text-slate-500">
                      No. {studentsPagination.offset + index + 1} ·{' '}
                      {student.nis || 'Kode belum tersedia'}
                    </p>
                    <h3 className="text-sm font-bold text-[#263D5F]">
                      {student.name}
                    </h3>
                  </div>
                  <AccountStatusBadge status={student.status} />
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {batchName(student.batchId)}
                </p>
                <p className="mt-1 text-xs leading-6 text-[#526B8C]">
                  {student.targetPTN1 || 'Target belum dipilih'}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {student.targetProdi1}
                </p>
                <p className="mt-1 break-all text-xs leading-6 text-slate-500">
                  {student.email}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {student.phone || 'Nomor belum tersedia'}
                  </p>
                  {statusSelect(student.id, student.name, student.status)}
                </div>
              </article>
            ))}
          </div>
          <div className="px-5 sm:px-6">
            <Pagination pagination={studentsPagination} label="siswa" />
          </div>
          {!filteredStudents.length && (
            <div className="px-5 py-14 text-center">
              <Search size={27} className="mx-auto text-slate-400" />
              <h3 className="mt-4 font-bold text-[#263D5F]">
                Siswa belum ditemukan
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Coba kata kunci atau filter status lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-4 min-h-11 px-3 text-sm font-semibold text-[#426DA8]"
              >
                Tampilkan semua siswa
              </button>
            </div>
          )}
        </section>
        <p className="text-xs leading-6 text-slate-500">
          Data contoh untuk uji frontend. Pengelolaan siswa belum terhubung ke
          server.
        </p>
      </div>
      <StudentBulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
