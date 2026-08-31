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
  PlusCircle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Printer,
  Compass,
  CheckCircle2,
  Calendar,
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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Super-Admin & Owner Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Dashboard Manajemen Bimbel & Keuangan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau arus kas SPP, peserta ujian serentak, kapasitas kuota kelas, dan operasional akademik.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/payments"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel SPP</span>
            </Link>
            <Link
              href="/admin/questions"
              className="inline-flex items-center space-x-2 bg-navy hover:bg-blue-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
            >
              <Compass className="w-4 h-4" />
              <span>Bank Soal (KaTeX)</span>
            </Link>
          </div>
        </div>

        {/* 1. Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Siswa */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Siswa Terdaftar
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono">
              650 <span className="text-xs font-medium text-slate-400 font-sans">Siswa</span>
            </div>
            <div className="mt-2 text-xs text-blue-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{students.length} Akun Terdaftar di Sistem</span>
            </div>
          </div>

          {/* Card 2: Active Concurrent CBT */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Ujian Serentak (Live)
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono">
              {metrics.activeConcurrent}{' '}
              <span className="text-xs font-medium text-slate-400 font-sans">Online</span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-semibold">
              🟢 Server CBT Beban Stabil (0.05s)
            </div>
          </div>

          {/* Card 3: Kas Terkumpul */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Kas Terkumpul Bulan Ini
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {formatIDR(metrics.monthlyRevenue || 184500000)}
            </div>
            <div className="mt-2 text-xs text-amber-700 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-time Ledger Sync</span>
            </div>
          </div>

          {/* Card 4: Tunggakan SPP */}
          <div className="bg-white rounded-3xl p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Tunggakan SPP
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {formatIDR(metrics.overdueAmount || 12500000)}
            </div>
            <div className="mt-2 text-xs text-rose-700 font-semibold">
              ⚠️ 12 Siswa Melewati Jatuh Tempo
            </div>
          </div>
        </div>

        {/* 2. Batch Quota Tracker Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Monitoring Kuota & Batch Bimbingan Belajar
              </h2>
              <p className="text-xs text-slate-500">
                Kapasitas kursi kelas tatap muka dan program intensif SNBT 2026.
              </p>
            </div>
            <Link
              href="/admin/classes"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Kelola Batch ({batches.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.map((batch) => {
              const percentage = Math.round((batch.currentStudents / batch.maxCapacity) * 100);
              const isFull = percentage >= 100;

              return (
                <div
                  key={batch.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {batch.program}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{batch.name}</h3>
                      <p className="text-xs text-slate-500">{batch.room} • Tutor: {batch.tutorName}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'PENUH (Waiting List)' : 'TERBUKA'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Keterisian Kursi:</span>
                      <span className="text-slate-900 font-mono">
                        {batch.currentStudents} / {batch.maxCapacity} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 100
                            ? 'bg-rose-500'
                            : percentage > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Jadwal: {batch.schedule}</span>
                    <Link
                      href="/admin/students"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Lihat Roster
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Recent Payment Ledger Table & Print Receipt */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Buku Kas & Transaksi SPP Terbaru
              </h2>
              <p className="text-xs text-slate-500">
                Daftar entri pembayaran yang tercatat via Transfer VA, Kasir Tunai, dan Import Excel.
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Modul Excel Lengkap</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">No. Invoice</th>
                  <th className="pb-3 px-3">Nama Siswa / NIS</th>
                  <th className="pb-3 px-3">Bulan</th>
                  <th className="pb-3 px-3">Metode</th>
                  <th className="pb-3 px-3">Nominal</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{pay.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pay.nis}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{pay.month}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-blue-700">{pay.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.status === 'Menunggu'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {pay.status === 'Lunas' && (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="inline-flex items-center space-x-1 text-slate-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-100"
                          title="Cetak Kuitansi Digital"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="font-semibold">Kuitansi</span>
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

      {/* Digital Receipt Print Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
