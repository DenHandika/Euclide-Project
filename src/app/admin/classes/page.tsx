'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ClassBatch } from '@/types';
import {
  Layers,
  PlusCircle,
  Users,
  MapPin,
  Clock,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function AdminClassesPage() {
  const { batches, showToast } = useApp();
  const [classList, setClassList] = useState<ClassBatch[]>(batches);
  const [modalOpen, setModalOpen] = useState(false);

  const [newBatch, setNewBatch] = useState<Omit<ClassBatch, 'id'>>({
    name: 'SNBT Supercamp Gelombang 2',
    program: 'SNBT Super Intensif',
    room: 'Ruang Euclide Beta (Lt. 2)',
    tutorName: 'Ahmad Fauzi, S.Si.',
    currentStudents: 12,
    maxCapacity: 25,
    schedule: 'Selasa & Kamis (16.00 - 19.30 WIB)',
    status: 'active',
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ClassBatch = {
      ...newBatch,
      id: `batch-${Date.now()}`,
    };
    setClassList([created, ...classList]);
    setModalOpen(false);
    showToast(`Batch ${created.name} berhasil dibuat!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Manajemen Kapasitas & Rombongan Belajar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Monitoring Kuota & Batch Bimbingan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau rasio keterisian kursi kelas tatap muka, alokasi ruang belajar, dan jadwal tentor pengampu.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Batch Baru</span>
          </button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classList.map((batch) => {
            const percentage = Math.round((batch.currentStudents / batch.maxCapacity) * 100);
            const isFull = percentage >= 100;

            return (
              <div
                key={batch.id}
                className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {batch.program}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isFull ? 'Kapasitas Penuh' : 'Tersedia Kursi'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {batch.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{batch.room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tutor: {batch.tutorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{batch.schedule}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Kuota Terisi:</span>
                      <span className="text-slate-900 font-mono">
                        {batch.currentStudents} / {batch.maxCapacity} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? 'bg-rose-500'
                            : percentage > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Status: {batch.status.toUpperCase()}</span>
                  <span className="font-bold text-blue-600 hover:underline cursor-pointer">
                    Atur Siswa
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Batch Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Buka Batch Kelas Baru</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Batch / Kelas</label>
                <input
                  type="text"
                  required
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program</label>
                  <select
                    value={newBatch.program}
                    onChange={(e) => setNewBatch({ ...newBatch, program: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SNBT Super Intensif">SNBT Super Intensif</option>
                    <option value="Kedokteran Priority">Kedokteran Priority</option>
                    <option value="Reguler Weekend">Reguler Weekend</option>
                    <option value="Drilling UTBK 2026">Drilling UTBK 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maks. Kapasitas</label>
                  <input
                    type="number"
                    required
                    value={newBatch.maxCapacity}
                    onChange={(e) => setNewBatch({ ...newBatch, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruangan / Lab</label>
                <input
                  type="text"
                  required
                  value={newBatch.room}
                  onChange={(e) => setNewBatch({ ...newBatch, room: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tutor Pengampu</label>
                <input
                  type="text"
                  required
                  value={newBatch.tutorName}
                  onChange={(e) => setNewBatch({ ...newBatch, tutorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jadwal Sesi</label>
                <input
                  type="text"
                  required
                  value={newBatch.schedule}
                  onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-600/20"
                >
                  Buka Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
