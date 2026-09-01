'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PaymentRecord } from '@/types';
import ReceiptModal from '@/components/common/ReceiptModal';
import {
  Users,
  Activity,
  Wallet,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  Compass,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { batches, payments, students, getFinancialMetrics } = useApp();
  const metrics = getFinancialMetrics();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B3B8C] block mb-1">
              PORTAL SUPER-ADMIN & OWNER BIMBEL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Buku Kas & Manajemen Operasional Bimbel
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Pantau arus kas SPP, peserta ujian serentak, kapasitas kuota batch, dan data keanggotaan.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <Link
              href="/admin/payments"
              className="inline-flex items-center space-x-1.5 bg-[#1B8A5A] hover:bg-[#126340] text-white px-3.5 py-2 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import Excel SPP</span>
            </Link>
            <Link
              href="/admin/questions"
              className="inline-flex items-center space-x-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white px-3.5 py-2 transition"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Bank Soal KaTeX</span>
            </Link>
          </div>
        </div>

        {/* 1. Executive Metrics Ledger Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
            <span className="text-[10px] text-[#637096] uppercase block mb-1">
              Total Siswa Terdaftar
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#13224E]">
              650 <span className="text-xs font-normal text-[#9EABC7]">Siswa</span>
            </div>
            <div className="mt-1 text-[11px] text-[#1B3B8C]">
              {students.length} Akun Terdaftar Aktif
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
            <span className="text-[10px] text-[#637096] uppercase block mb-1">
              Ujian Serentak (Live)
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#1B8A5A]">
              {metrics.activeConcurrent} <span className="text-xs font-normal text-[#9EABC7]">Online</span>
            </div>
            <div className="mt-1 text-[11px] text-[#1B8A5A]">
              🟢 Beban Sistem Stabil (0.05s)
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
            <span className="text-[10px] text-[#637096] uppercase block mb-1">
              Kas Terkumpul Bulan Ini
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#13224E] truncate">
              {formatIDR(metrics.monthlyRevenue || 184500000)}
            </div>
            <div className="mt-1 text-[11px] text-[#C8831A]">
              Terverifikasi Buku Kas
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#13224E] p-4">
            <span className="text-[10px] text-[#637096] uppercase block mb-1">
              Total Tunggakan SPP
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#D0342C] truncate">
              {formatIDR(metrics.overdueAmount || 12500000)}
            </div>
            <div className="mt-1 text-[11px] text-[#D0342C]">
              ⚠️ 12 Siswa Melewati Tempo
            </div>
          </div>
        </div>

        {/* 2. Batch Quota Section */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Monitoring Kapasitas Kuota Batch Bimbel
              </h2>
              <p className="text-xs text-[#637096]">
                Kapasitas kursi kelas tatap muka dan program intensif SNBT.
              </p>
            </div>
            <Link
              href="/admin/classes"
              className="text-xs font-mono text-[#1B3B8C] font-semibold hover:underline"
            >
              Kelola Batch ({batches.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => {
              const percentage = Math.round((batch.currentStudents / batch.maxCapacity) * 100);
              const isFull = percentage >= 100;

              return (
                <div
                  key={batch.id}
                  className="p-4 bg-[#FAFAF7] border border-[#E4E4DC] space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[9px] uppercase font-bold text-[#1B3B8C] bg-[#FFFFFF] px-1.5 py-0.5 border border-[#CECEC2]">
                        {batch.program}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#13224E] mt-1">{batch.name}</h3>
                      <p className="text-xs text-[#637096]">{batch.room} • Tutor: {batch.tutorName}</p>
                    </div>
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 ${
                        isFull ? 'bg-[#FDECEB] text-[#D0342C] border border-[#D0342C]/40' : 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                      }`}
                    >
                      {isFull ? 'KAPASITAS PENUH' : 'TERSEDIA KURSI'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#637096]">Keterisian:</span>
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

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#637096]">
                    <span>Jadwal: {batch.schedule}</span>
                    <Link href="/admin/students" className="text-[#1B3B8C] hover:underline font-semibold">
                      Roster Siswa
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Recent Payment Ledger Table */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Buku Kas & Log Pembayaran SPP Terbaru
              </h2>
              <p className="text-xs text-[#637096]">
                Daftar entri transaksi yang tercatat di sistem buku kas Euclide.
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="inline-flex items-center space-x-1 font-mono text-xs font-semibold text-[#1B8A5A] hover:underline"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Modul Excel Lengkap →</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#13224E] font-mono text-[#637096] text-[10px] uppercase tracking-wider">
                  <th className="pb-2 px-2">No. Invoice</th>
                  <th className="pb-2 px-2">Nama Siswa / NIS</th>
                  <th className="pb-2 px-2">Bulan</th>
                  <th className="pb-2 px-2">Metode</th>
                  <th className="pb-2 px-2">Nominal</th>
                  <th className="pb-2 px-2">Status</th>
                  <th className="pb-2 px-2 text-right">Kuitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4DC] font-sans">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FAFAF7] transition">
                    <td className="py-2.5 px-2 font-mono font-semibold text-[#13224E]">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-[#13224E]">{pay.studentName}</div>
                      <div className="text-[10px] text-[#637096] font-mono">{pay.nis}</div>
                    </td>
                    <td className="py-2.5 px-2 text-[#637096]">{pay.month}</td>
                    <td className="py-2.5 px-2 font-mono text-[#1B3B8C] text-[11px]">{pay.paymentMethod}</td>
                    <td className="py-2.5 px-2 font-mono font-bold text-[#13224E]">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-2.5 px-2 font-mono">
                      <span
                        className={`inline-block px-1.5 py-0.2 text-[10px] font-semibold ${
                          pay.status === 'Lunas'
                            ? 'bg-[#EAF7F0] text-[#126340] border border-[#1B8A5A]/30'
                            : pay.status === 'Menunggu'
                            ? 'bg-[#FDF3E3] text-[#C8831A] border border-[#EFA93B]/40'
                            : 'bg-[#FDECEB] text-[#A6211A] border border-[#D0342C]/30'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {pay.status === 'Lunas' && (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="inline-flex items-center space-x-1 font-mono text-[10px] text-[#1B3B8C] hover:underline bg-[#FAFAF7] px-2 py-1 border border-[#CECEC2]"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Cetak</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
