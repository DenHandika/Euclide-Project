'use client';
import Pagination from '@/components/common/Pagination';
import usePagination from '@/hooks/usePagination';

import StatusBadge from '@/components/common/StatusBadge';

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
  PlusCircle,
  Printer,
  X,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { payments, addManualPayment, importPaymentsBulk, showToast } =
    useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parsedRows, setParsedRows] = useState<PaymentImportRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const paymentsPagination = usePagination(payments, 5);
  const paymentImportPagination = usePagination(
    parsedRows,
    10,
    fileName,
    [10, 25, 50]
  );

  const [isDragging, setIsDragging] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(
    null
  );

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

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        const validatedRows: PaymentImportRow[] = rawJson.map((row) => {
          const nis = String(
            row.Nomor_Induk || row.NIS || row.nis || ''
          ).trim();
          const nama = String(
            row.Nama || row.Nama_Siswa || row.nama || ''
          ).trim();
          const bulan = String(
            row.Bulan || row.Periode || 'Februari 2026'
          ).trim();
          const nominal = Number(row.Nominal || row.Jumlah || row.amount || 0);
          const status = String(row.Status || row.status || 'Lunas').trim();

          const isValid = !!(nis && nama && nominal > 0);
          const errorMessage = !nis
            ? 'Nomor Induk kosong'
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
        showToast(
          `Berhasil membaca ${validatedRows.length} baris dari ${file.name}`,
          'info'
        );
      } catch (err) {
        showToast(
          'Gagal memproses file spreadsheet. Pastikan format valid.',
          'error'
        );
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
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Pembayaran_SPP');
    XLSX.writeFile(workbook, 'Template_Bulk_Import_SPP_Euclide.xlsx');
    showToast('Template Excel berhasil diunduh!', 'success');
  };

  const handleSaveToDatabase = () => {
    if (parsedRows.length === 0) return;
    importPaymentsBulk(parsedRows);
    setParsedRows([]);
    setFileName('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addManualPayment(manualForm);
    setManualModalOpen(false);
    setSelectedReceipt(created);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-8 font-sans text-[#263D5F]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="font-sans text-xs font-bold uppercase text-[#1B8A5A] block mb-1">
              MODUL EXCEL & KASIR SPP BIMBEL
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#263D5F]">
              Import Pembayaran Excel (.xlsx) & Kasir
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Impor massal ratusan baris data pembayaran via spreadsheet
              SheetJS, validasi instan, dan cetak kuitansi.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-sans text-xs">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] hover:bg-[#F6F8FC] text-[#263D5F] px-3.5 py-2 border border-slate-200 transition rounded-xl min-h-11"
            >
              <Download className="w-3.5 h-3.5 text-[#1B3B8C]" />
              <span>Unduh Template .xlsx</span>
            </button>
            <button
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-[#2E578F] hover:bg-[#234573] text-white px-3.5 py-2 transition rounded-xl min-h-11"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#EFA93B]" />
              <span>Entri Kasir Tunai</span>
            </button>
          </div>
        </div>

        {/* 1. Drag & Drop File Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed p-8 text-center cursor-pointer transition-all rounded-2xl shadow-sm ${
            isDragging
              ? 'border-[#1B8A5A] bg-[#EAF7F0]'
              : 'border-slate-200 bg-[#FFFFFF] hover:border-slate-200'
          } `}
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

          <div className="max-w-md mx-auto space-y-2 font-sans">
            <div className="w-10 h-10 bg-[#F6F8FC] border border-slate-200 text-[#263D5F] flex items-center justify-center mx-auto rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-sans font-bold text-base text-[#263D5F]">
                {fileName
                  ? `File Terpilih: ${fileName}`
                  : 'Tarik & Letakkan File Spreadsheet (.xlsx / .csv)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                atau klik untuk memilih file dari komputer (SheetJS Parser
                Client-Side).
              </p>
            </div>

            <div className="font-sans text-xs text-slate-500 pt-1">
              Format Kolom: <strong>Nomor_Induk</strong>, <strong>Nama</strong>,{' '}
              <strong>Bulan</strong>, <strong>Nominal</strong>,{' '}
              <strong>Status</strong>
            </div>
          </div>
        </div>

        {/* 2. Spreadsheet Preview Table */}
        {parsedRows.length > 0 && (
          <div className="bg-[#FFFFFF] border border-slate-200 p-6 space-y-4 animate-in fade-in rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-sans font-bold text-base text-[#263D5F]">
                  Pratinjau Data Impor ({parsedRows.length} Baris)
                </h3>
                <p className="font-sans text-xs text-slate-500">
                  Valid:{' '}
                  <strong className="text-[#1B8A5A]">{validCount}</strong> baris
                  • Tidak Valid:{' '}
                  <strong className="text-[#D0342C]">{errorCount}</strong> baris
                </p>
              </div>

              <div className="flex items-center space-x-2 font-sans text-xs">
                <button
                  onClick={() => setParsedRows([])}
                  className="px-3 py-1.5 text-slate-500 hover:text-[#263D5F] bg-[#F6F8FC] border border-slate-200 rounded-xl min-h-11"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={validCount === 0}
                  className="inline-flex items-center space-x-1.5 bg-[#1B8A5A] hover:bg-[#126340] disabled:opacity-40 text-white px-3.5 py-1.5 transition font-semibold rounded-xl min-h-11"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan ke Database ({validCount} Data)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-sans">
                <thead className="sticky top-0 bg-[#F6F8FC] border-b border-slate-200 font-sans text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 px-2">Status Baris</th>
                    <th className="py-2 px-2">Nomor Induk (NIS)</th>
                    <th className="py-2 px-2">Nama Siswa</th>
                    <th className="py-2 px-2">Bulan</th>
                    <th className="py-2 px-2">Nominal</th>
                    <th className="py-2 px-2">Status Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paymentImportPagination.pageItems.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#F6F8FC] ${!row.isValid ? 'bg-[#FDECEB]/50' : ''}`}
                    >
                      <td className="py-2 px-2 font-sans text-xs">
                        {row.isValid ? (
                          <span className="text-[#1B8A5A] font-bold">
                            Valid
                          </span>
                        ) : (
                          <span className="text-[#D0342C] font-semibold">
                            {row.errorMessage}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 font-sans text-[#263D5F]">
                        {row.Nomor_Induk}
                      </td>
                      <td className="py-2 px-2 font-semibold text-[#263D5F]">
                        {row.Nama}
                      </td>
                      <td className="py-2 px-2 text-slate-500">{row.Bulan}</td>
                      <td className="py-2 px-2 font-sans font-bold text-[#263D5F]">
                        {formatIDR(Number(row.Nominal))}
                      </td>
                      <td className="py-2 px-2 font-sans text-xs">
                        {row.Status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              pagination={paymentImportPagination}
              label="baris impor pembayaran"
            />
          </div>
        )}

        {/* 3. Existing Payment History Table */}
        <div className="bg-[#FFFFFF] border border-slate-200 p-6 space-y-4 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-bold text-[#263D5F]">
                Buku Kas Pembayaran Tersimpan ({payments.length} Transaksi)
              </h2>
              <p className="text-xs text-slate-500">
                Log pembukuan resmi bimbel yang tersimpan di sistem lokal.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 font-sans text-xs text-slate-500 uppercase tracking-wider">
                  <th className="pb-2 px-2">No. Invoice</th>
                  <th className="pb-2 px-2">Nama Siswa / NIS</th>
                  <th className="pb-2 px-2">Periode</th>
                  <th className="pb-2 px-2">Metode</th>
                  <th className="pb-2 px-2">Nominal</th>
                  <th className="pb-2 px-2">Waktu Bayar</th>
                  <th className="pb-2 px-2">Status</th>
                  <th className="pb-2 px-2 text-right">Kuitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsPagination.pageItems.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#F6F8FC] transition">
                    <td className="py-2.5 px-2 font-sans font-semibold text-[#263D5F]">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-[#263D5F]">
                        {pay.studentName}
                      </div>
                      <div className="text-xs font-sans text-slate-500">
                        {pay.nis}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">{pay.month}</td>
                    <td className="py-2.5 px-2 font-sans text-xs text-[#1B3B8C]">
                      {pay.paymentMethod}
                    </td>
                    <td className="py-2.5 px-2 font-sans font-bold text-[#263D5F]">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-2.5 px-2 font-sans text-xs text-slate-500">
                      {pay.paidAt}
                    </td>
                    <td className="py-2.5 px-2 font-sans text-xs">
                      <StatusBadge
                        tone={
                          pay.status === 'Lunas'
                            ? 'success'
                            : pay.status === 'Menunggu'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {pay.status}
                      </StatusBadge>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {pay.status === 'Lunas' && (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="inline-flex items-center space-x-1 font-sans text-xs text-[#1B3B8C] hover:underline bg-[#F6F8FC] px-2 py-1 border border-slate-200 rounded-xl min-h-11"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Kuitansi</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={paymentsPagination} label="pembayaran" />
        </div>
      </div>

      {/* Manual Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#182D4D]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border border-slate-200 space-y-4 font-sans rounded-3xl shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-sans font-bold text-base text-[#263D5F]">
                Entri Pembayaran Kasir Manual
              </h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="text-slate-500 rounded-xl min-h-11"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-sans font-semibold text-[#263D5F] mb-1">
                  Nomor Induk Siswa (NIS)
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.nis}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, nis: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#F6F8FC] border border-slate-200 font-sans text-xs focus:outline-none focus:border-[#7F9FC8] focus:ring-2 focus:ring-blue-100 rounded-xl min-h-11"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#263D5F] mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.studentName}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      studentName: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#F6F8FC] border border-slate-200 text-xs font-semibold text-[#263D5F] focus:outline-none focus:border-[#7F9FC8] focus:ring-2 focus:ring-blue-100 rounded-xl min-h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#263D5F] mb-1">
                    Bulan SPP
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.month}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, month: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-[#F6F8FC] border border-slate-200 text-xs focus:outline-none rounded-xl min-h-11"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#263D5F] mb-1">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={manualForm.amount}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        amount: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-[#F6F8FC] border border-slate-200 text-xs font-sans font-bold focus:outline-none rounded-xl min-h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#263D5F] mb-1">
                  Metode Bayar
                </label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      paymentMethod: e.target.value as any,
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#F6F8FC] border border-slate-200 text-xs focus:outline-none rounded-xl min-h-11"
                >
                  <option value="Tunai / Kasir">Tunai / Kasir</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Virtual Account">Virtual Account</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2 font-sans">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 bg-[#F6F8FC] border border-slate-200 rounded-xl min-h-11"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-[#2E578F] hover:bg-[#234573] font-semibold rounded-xl min-h-11"
                >
                  Simpan & Cetak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
