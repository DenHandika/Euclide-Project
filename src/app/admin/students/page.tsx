'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, UserStatus } from '@/types';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Filter,
} from 'lucide-react';

export default function AdminStudentsPage() {
  const { students, toggleStudentStatus, batches } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stu.nis && stu.nis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stu.targetPTN1 && stu.targetPTN1.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || stu.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBatchName = (batchId?: string) => {
    if (!batchId) return 'Reguler SNBT';
    const b = batches.find((x) => x.id === batchId);
    return b ? b.name : 'Reguler SNBT';
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B3B8C] block mb-1">
              ROSTER PESERTA & AKSES CBT
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Daftar Siswa & Pengendalian Status Akun
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Kelola status keaktifan peserta, pembekuan akses (SPP Overdue), dan status alumni.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#637096] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari NIS, nama, atau target PTN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs text-[#13224E] font-mono focus:outline-none focus:border-[#13224E]"
            />
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs w-full sm:w-auto overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-[#637096] shrink-0" />
            {['all', 'active', 'suspended', 'graduated'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 border whitespace-nowrap transition ${
                  statusFilter === st
                    ? 'bg-[#13224E] text-white border-[#13224E] font-semibold'
                    : 'bg-[#FAFAF7] text-[#637096] border-[#E4E4DC] hover:border-[#CECEC2]'
                }`}
              >
                {st === 'all'
                  ? 'Semua Siswa'
                  : st === 'active'
                  ? 'Aktif'
                  : st === 'suspended'
                  ? 'Suspended (SPP)'
                  : 'Alumni'}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#13224E] font-mono text-[10px] text-[#637096] uppercase tracking-wider">
                  <th className="pb-2 px-2">NIS</th>
                  <th className="pb-2 px-2">Nama Siswa</th>
                  <th className="pb-2 px-2">Batch Kelas</th>
                  <th className="pb-2 px-2">Target PTN</th>
                  <th className="pb-2 px-2">Status Akun</th>
                  <th className="pb-2 px-2 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4DC]">
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-[#FAFAF7] transition">
                    <td className="py-3 px-2 font-mono font-semibold text-[#13224E]">{stu.nis || 'EUC-2026-XXXX'}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-[#13224E]">{stu.name}</div>
                      <div className="text-[10px] text-[#637096] font-mono">{stu.email}</div>
                    </td>
                    <td className="py-3 px-2 font-mono text-[#1B3B8C] font-semibold">
                      {getBatchName(stu.batchId)}
                    </td>
                    <td className="py-3 px-2 font-serif font-bold text-[#13224E]">
                      {stu.targetPTN1 || 'Universitas Indonesia (UI)'}
                    </td>
                    <td className="py-3 px-2 font-mono text-[10px]">
                      <span
                        className={`inline-block px-1.5 py-0.2 font-semibold ${
                          stu.status === 'active'
                            ? 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                            : stu.status === 'suspended'
                            ? 'bg-[#FDECEB] text-[#A6211A] border border-[#D0342C]/30'
                            : 'bg-[#F3F3ED] text-[#637096] border border-[#CECEC2]'
                        }`}
                      >
                        {stu.status === 'active'
                          ? 'Aktif'
                          : stu.status === 'suspended'
                          ? 'SPP Overdue'
                          : 'Alumni'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[10px]">
                      <select
                        value={stu.status}
                        onChange={(e) =>
                          toggleStudentStatus(stu.id, e.target.value as UserStatus)
                        }
                        className="bg-[#FAFAF7] border border-[#CECEC2] px-2 py-1 text-xs text-[#13224E] focus:outline-none focus:border-[#13224E]"
                      >
                        <option value="active">Aktif (Bisa CBT)</option>
                        <option value="suspended">Suspended (Blokir CBT)</option>
                        <option value="graduated">Alumni</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
