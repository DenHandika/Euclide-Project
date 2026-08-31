'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserStatus, User } from '@/types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  UserCheck,
  Mail,
  Phone,
  Target,
  Edit,
  PlusCircle,
} from 'lucide-react';

export default function AdminStudentsPage() {
  const { students, toggleStudentStatus, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stu.nis && stu.nis.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || stu.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Manajemen Akun & Membership Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Roster & Hak Akses Siswa Bimbel
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola status keaktifan akun (Active, Suspended karena SPP, Graduated/Alumni) dan pantau target prodi PTN.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-elevated border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari siswa berdasarkan Nama, NIS, atau Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {(['all', 'active', 'suspended', 'graduated'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition ${
                  statusFilter === st
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'Semua Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Daftar Siswa Terdaftar ({filteredStudents.length})
            </h2>
            <span className="text-xs text-slate-400">Total: {students.length} Akun</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Siswa & NIS</th>
                  <th className="pb-3 px-3">Kontak / Email</th>
                  <th className="pb-3 px-3">Target PTN Impian</th>
                  <th className="pb-3 px-3">Status SPP</th>
                  <th className="pb-3 px-3">Status Akun</th>
                  <th className="pb-3 px-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu) => {
                  let statusBadge = (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  );

                  if (stu.status === 'suspended') {
                    statusBadge = (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Suspended (SPP)</span>
                      </span>
                    );
                  } else if (stu.status === 'graduated') {
                    statusBadge = (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        <GraduationCap className="w-3 h-3" />
                        <span>Alumni (Expired)</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{stu.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {stu.nis || 'EUC-2026-XXXX'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        <div>{stu.email}</div>
                        <div className="text-[10px] text-slate-400">{stu.phone || '0812-xxxx-xxxx'}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-blue-700">
                          {stu.targetPTN1 || 'Universitas Indonesia'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {stu.targetProdi1 || 'Teknik Informatika'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            stu.sppStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : stu.sppStatus === 'overdue'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {stu.sppStatus === 'paid' ? 'Lunas SPP' : stu.sppStatus === 'overdue' ? 'Tunggakan' : 'Unpaid'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">{statusBadge}</td>

                      <td className="py-3.5 px-3 text-right">
                        {/* Interactive Status Switcher Dropdown */}
                        <select
                          value={stu.status}
                          onChange={(e) => toggleStudentStatus(stu.id, e.target.value as UserStatus)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="active">Set Active</option>
                          <option value="suspended">Set Suspended</option>
                          <option value="graduated">Set Graduated</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
