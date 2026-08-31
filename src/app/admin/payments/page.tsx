'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '@/context/AppContext';
import { PaymentRecord, PaymentImportRow } from '@/types';
import ReceiptModal from '@/components/common/ReceiptModal';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  PlusCircle,
  Printer,
  Trash2,
  FileCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { payments, addManualPayment, importPaymentsBulk, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [parsedRows, setParsedRows] = useState<PaymentImportRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Manual payment form state
  const [manualForm, setManualForm] = useState({
    nis: 'EUC-2026-0042',
    studentName: 'Muhammad Raihan Pratama',
    month: 'Februari 2026',
    amount: 1750000,
    paymentMethod: 'Tunai / Kasir' as const,
    status: 'Lunas' as const,
    recordedBy: 'Kasir Front Desk',
    notes: 'Pembayaran SPP Reguler Tunai',
  });

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Handle File Upload (.xlsx / .csv) using SheetJS
  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Normalize and validate columns
        const validatedRows: PaymentImportRow[] = rawJson.map((row) => {
          const nis = String(row.Nomor_Induk || row.NIS || row.nis || '').trim();
          const nama = String(row.Nama || row.Nama_Siswa || row.nama || '').trim();
          const bulan = String(row.Bulan || row.Periode || 'Februari 2026').trim();
          const nominal = Number(row.Nominal || row.Jumlah || row.amount || 0);
          const status = String(row.Status || row.status || 'Lunas').trim();

          const isValid = !!(nis && nama && nominal > 0);
          const errorMessage = !nis
            ? 'Nomor Induk (NIS) kosong'
            : !nama
            ? 'Nama Siswa kosong'
            : nominal <= 0
            ? 'Nominal tidak valid'
            : undefined;

          return {
            Nomor_Induk: nis,
            Nama: nama,
            Bulan: bulan,
            Nominal: nominal,
            Status: status,
            isValid,
            errorMessage,
          };
        });

        setParsedRows(validatedRows);
        showToast(`Berhasil membaca ${validatedRows.length} baris dari ${file.name}`, 'info');
      } catch (err) {
        showToast('Gagal memproses file spreadsheet. Pastikan format file valid.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // 2. Download Sample Template Excel (.xlsx)
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        Nomor_Induk: 'EUC-2026-0042',
        Nama: 'Muhammad Raihan Pratama',
        Bulan: 'Maret 2026',
        Nominal: 1750000,
        Status: 'Lunas',
      },
      {
        Nomor_Induk: 'EUC-2026-0043',
        Nama: 'Amanda Putri Maharani',
        Bulan: 'Maret 2026',
        Nominal: 2200000,
        Status: 'Lunas',
      },
      {
        Nomor_Induk: 'EUC-2026-0089',
        Nama: 'Dimas Anggara',
        Bulan: 'Maret 2026',
        Nominal: 1250000,
        Status: 'Menunggu',
      },
      {
        Nomor_Induk: 'EUC-2026-0044',
        Nama: 'Fikri Haikal',
        Bulan: 'Maret 2026',
        Nominal: 1750000,
        Status: 'Lunas',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Pembayaran_SPP');
    XLSX.writeFile(workbook, 'Template_Bulk_Import_SPP_Euclide.xlsx');
    showToast('Template Excel berhasil diunduh!', 'success');
  };

  // 3. Save Validated Rows to AppContext State
  const handleSaveToDatabase = () => {
    if (parsedRows.length === 0) return;
    const res = importPaymentsBulk(parsedRows);
    setParsedRows([]);
    setFileName('');
  };

  // 4. Save Manual Cash Entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addManualPayment(manualForm);
    setManualModalOpen(false);
    setSelectedReceipt(created);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Modul Keuangan & SheetJS Excel Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Excel Bulk Payment Import & Kasir SPP
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Impor massal ratusan pembayaran via file Excel (.xlsx / .csv), validasi baris otomatis, dan cetak kuitansi kasir.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Unduh Template .xlsx</span>
            </button>
            <button
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-navy hover:bg-blue-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-navy/20 transition"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Entri Kasir Tunai</span>
            </button>
          </div>
        </div>

        {/* 1. Drag & Drop File Upload Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/50 shadow-elevated'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFile(e.target.files[0]);
              }
            }}
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {fileName ? `File Terpilih: ${fileName}` : 'Tarik & Letakkan File Excel SPP (.xlsx / .csv)'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                atau klik untuk memilih file dari komputer Anda (Mendukung format SheetJS).
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <span>Kolom Wajib: <strong>Nomor_Induk</strong>, <strong>Nama</strong>, <strong>Bulan</strong>, <strong>Nominal</strong>, <strong>Status</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Interactive Spreadsheet Preview Table */}
        {parsedRows.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-5 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Preview Data Impor ({parsedRows.length} Baris)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Valid: <strong className="text-emerald-700">{validCount}</strong> baris • Tidak Valid:{' '}
                    <strong className="text-rose-600">{errorCount}</strong> baris
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setParsedRows([])}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={validCount === 0}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan ke Database ({validCount} Data)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Status Baris</th>
                    <th className="py-2.5 px-3">Nomor Induk (NIS)</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Bulan</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3">Status Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 ${!row.isValid ? 'bg-rose-50/50' : ''}`}
                    >
                      <td className="py-2.5 px-3">
                        {row.isValid ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-rose-600 font-bold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{row.errorMessage}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        {row.Nomor_Induk}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{row.Nama}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.Bulan}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {formatIDR(Number(row.Nominal))}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            row.Status === 'Lunas'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {row.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Existing Payment History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Daftar Pembayaran Tersimpan ({payments.length} Transaksi)
              </h2>
              <p className="text-xs text-slate-500">
                Log pembukuan resmi bimbel yang tersimpan di sistem lokal.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">No. Invoice</th>
                  <th className="pb-3 px-3">Nama Siswa / NIS</th>
                  <th className="pb-3 px-3">Periode</th>
                  <th className="pb-3 px-3">Metode</th>
                  <th className="pb-3 px-3">Nominal</th>
                  <th className="pb-3 px-3">Waktu Bayar</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-700">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{pay.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pay.nis}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">{pay.month}</td>
                    <td className="py-3.5 px-3 font-semibold text-blue-700">{pay.paymentMethod}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">{pay.paidAt}</td>
                    <td className="py-3.5 px-3">
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
                    <td className="py-3.5 px-3 text-right">
                      {pay.status === 'Lunas' && (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Kuitansi</span>
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

      {/* Manual Cash Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Entri Pembayaran Kasir Manual
                </h3>
              </div>
              <button
                onClick={() => setManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Induk Siswa (NIS)
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.nis}
                  onChange={(e) => setManualForm({ ...manualForm, nis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  required
                  value={manualForm.studentName}
                  onChange={(e) => setManualForm({ ...manualForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bulan SPP</label>
                  <input
                    type="text"
                    required
                    value={manualForm.month}
                    onChange={(e) => setManualForm({ ...manualForm, month: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, paymentMethod: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tunai / Kasir">Tunai / Kasir</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Virtual Account">Virtual Account</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan</label>
                <input
                  type="text"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-600/20"
                >
                  Simpan & Cetak Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
