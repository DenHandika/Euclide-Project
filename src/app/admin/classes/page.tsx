'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ClassBatch } from '@/types';
import {
  Layers,
  PlusCircle,
  Users,
  Edit2,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';

export default function AdminClassesPage() {
  const { batches, updateBatchCapacity, showToast } = useApp();
  const [editingBatch, setEditingBatch] = useState<ClassBatch | null>(null);
  const [newCapacity, setNewCapacity] = useState<number>(30);

  const handleSaveCapacity = () => {
    if (editingBatch) {
      updateBatchCapacity(editingBatch.id, newCapacity);
      setEditingBatch(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B3B8C] block mb-1">
              MANAJEMEN RUANG & KUOTA KELAS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Monitoring Kapasitas Batch Bimbel
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Alokasi kuota siswa per kelas, tutor penanggung jawab, dan ruang tatap muka.
            </p>
          </div>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((batch) => {
            const percentage = Math.round((batch.currentStudents / batch.maxCapacity) * 100);
            const isFull = percentage >= 100;

            return (
              <div
                key={batch.id}
                className="bg-[#FFFFFF] border border-[#13224E] p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="bg-[#FAFAF7] border border-[#CECEC2] px-2 py-0.5 font-semibold text-[#13224E]">
                      {batch.program}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 ${
                        isFull
                          ? 'bg-[#FDECEB] text-[#D0342C] border border-[#D0342C]/40'
                          : 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                      }`}
                    >
                      {isFull ? 'KAPASITAS PENUH' : 'TERSEDIA KURSI'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#13224E]">{batch.name}</h3>
                    <p className="text-xs text-[#637096]">{batch.room} • Tutor: <strong className="text-[#13224E]">{batch.tutorName}</strong></p>
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1 font-mono text-xs bg-[#FAFAF7] p-3 border border-[#E4E4DC]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#637096]">Keterisian Kursi:</span>
                      <span className="font-bold text-[#13224E]">
                        {batch.currentStudents} / {batch.maxCapacity} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E4E4DC] overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isFull ? 'bg-[#D0342C]' : percentage > 80 ? 'bg-[#EFA93B]' : 'bg-[#1B8A5A]'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#637096] flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1B3B8C]" />
                    <span>Jadwal: {batch.schedule}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E4DC] flex items-center justify-between font-mono text-xs">
                  <span className="text-[11px] text-[#637096]">
                    Sisa: {Math.max(0, batch.maxCapacity - batch.currentStudents)} kursi
                  </span>
                  <button
                    onClick={() => {
                      setEditingBatch(batch);
                      setNewCapacity(batch.maxCapacity);
                    }}
                    className="inline-flex items-center space-x-1 text-[#1B3B8C] hover:underline font-semibold bg-[#FAFAF7] px-2 py-1 border border-[#CECEC2]"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Ubah Kuota</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Capacity Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-sm w-full p-6 border-2 border-[#13224E] space-y-4 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                Ubah Batas Kuota Kelas
              </h3>
              <button onClick={() => setEditingBatch(null)} className="text-[#637096]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#637096] block font-mono">Nama Kelas:</span>
                <span className="font-bold text-[#13224E] text-sm">{editingBatch.name}</span>
              </div>

              <div>
                <label className="block font-mono font-semibold text-[#13224E] mb-1">
                  Kapasitas Maksimal Siswa (Kursi)
                </label>
                <input
                  type="number"
                  value={newCapacity}
                  min={editingBatch.currentStudents}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border-2 border-[#13224E] font-mono text-base font-bold text-[#13224E] focus:outline-none"
                />
                <p className="text-[10px] font-mono text-[#637096] mt-1">
                  *Tidak boleh kurang dari jumlah siswa terdaftar saat ini ({editingBatch.currentStudents} siswa).
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E4DC] flex justify-end space-x-2 font-mono">
                <button
                  onClick={() => setEditingBatch(null)}
                  className="px-3 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-[#637096]"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCapacity}
                  className="px-4 py-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
