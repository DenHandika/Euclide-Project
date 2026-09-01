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
  ArrowRight,
  Sparkles,
  Layers,
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Portal Admin & Owner Bimbel</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Buku Kas & Manajemen Operasional
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau arus kas SPP, sesi ujian serentak, kapasitas kuota batch, dan roster siswa.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 text-xs font-bold">
            <Link
              href="/admin/payments"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel SPP</span>
            </Link>
            <Link
              href="/admin/questions"
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <Compass className="w-4 h-4" />
              <span>Bank Soal</span>
            </Link>
          </div>
        </div>

        {/* 1. Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Siswa Terdaftar
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              650 <span className="text-xs font-normal text-slate-400">Siswa</span>
            </div>
            <div className="mt-2 text-xs text-blue-600 font-semibold">
              {students.length} Akun Terdaftar Aktif
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ujian Serentak (Live)
              </span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {metrics.activeConcurrent} <span className="text-xs font-normal text-slate-400">Online</span>
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesi Ujian Aktif Lancar</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kas Terkumpul Bulan Ini
              </span>
              <Wallet className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 truncate">
              {formatIDR(metrics.monthlyRevenue || 184500000)}
            </div>
            <div className="mt-2 text-xs text-amber-600 font-semibold">
              Terverifikasi Buku Kas Kasir
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tunggakan SPP Berjalan
              </span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 truncate">
              {formatIDR(metrics.overdueAmount || 3750000)}
            </div>
            <div className="mt-2 text-xs text-rose-600 font-semibold">
              3 Siswa Belum Bayar
            </div>
          </div>
        </div>

        {/* 2. Main Tables Grid: Kuota Batch & Transaksi Terkini */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kuota Batch Kelas (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Monitoring Kapasitas Kuota Kelas
                </h3>
                <p className="text-xs text-slate-500">Keterisian kursi per batch bimbingan aktif</p>
              </div>
              <Link
                href="/admin/classes"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Kelola Batch</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {batches.map((batch) => {
                const percent = Math.round((batch.currentStudents / batch.maxCapacity) * 100);
                const isFull = percent >= 95;

                return (
                  <div
                    key={batch.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {batch.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          Tentor: {batch.tutorName} • {batch.schedule}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isFull
                            ? 'bg-rose-100 text-rose-800'
                            : percent > 75
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isFull ? 'Penuh (100%)' : `${percent}% Terisi`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-rose-600' : percent > 75 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{batch.currentStudents} Kursi Terisi</span>
                        <span>Maks. {batch.maxCapacity} Siswa</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaksi SPP Terkini (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pembukuan SPP Terbaru
                </h3>
                <p className="text-xs text-slate-500">Transaksi kasir & rekonsiliasi Excel</p>
              </div>
              <Link
                href="/admin/payments"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {payments.slice(0, 5).map((pay) => (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{pay.studentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {pay.invoiceNumber} • {pay.month}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {formatIDR(pay.amount)}
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 ml-auto"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Kuitansi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Receipt Modal */}
        {selectedReceipt && (
          <ReceiptModal
            payment={selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
          />
        )}
      </div>
    </div>
  );
}
