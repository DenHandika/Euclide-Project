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
  PlusCircle,
  Printer,
  X,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { payments, addManualPayment, importPaymentsBulk, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parsedRows, setParsedRows] = useState<PaymentImportRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

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
          const nis = String(row.Nomor_Induk || row.NIS || row.nis || '').trim();
          const nama = String(row.Nama || row.Nama_Siswa || row.nama || '').trim();
          const bulan = String(row.Bulan || row.Periode || 'Februari 2026').trim();
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
        showToast(`Berhasil membaca ${validatedRows.length} baris dari ${file.name}`, 'info');
      } catch (err) {
        showToast('Gagal memproses file spreadsheet. Pastikan format valid.', 'error');
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
    <div className="min-h-screen bg-[#FAFAF7] py-8 font-sans text-[#13224E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#13224E] pb-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#1B8A5A] block mb-1">
              MODUL EXCEL & KASIR SPP BIMBEL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#13224E]">
              Import Pembayaran Excel (.xlsx) & Kasir
            </h1>
            <p className="text-xs sm:text-sm text-[#637096] mt-0.5">
              Impor massal ratusan baris data pembayaran via spreadsheet SheetJS, validasi instan, dan cetak kuitansi.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#13224E] px-3.5 py-2 border border-[#CECEC2] transition"
            >
              <Download className="w-3.5 h-3.5 text-[#1B3B8C]" />
              <span>Unduh Template .xlsx</span>
            </button>
            <button
              onClick={() => setManualModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-[#13224E] hover:bg-[#1B3B8C] text-white px-3.5 py-2 transition"
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
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#1B8A5A] bg-[#EAF7F0]'
              : 'border-[#CECEC2] bg-[#FFFFFF] hover:border-[#13224E]'
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

          <div className="max-w-md mx-auto space-y-2 font-sans">
            <div className="w-10 h-10 bg-[#FAFAF7] border border-[#CECEC2] text-[#13224E] flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                {fileName ? `File Terpilih: ${fileName}` : 'Tarik & Letakkan File Spreadsheet (.xlsx / .csv)'}
              </h3>
              <p className="text-xs text-[#637096] mt-0.5">
                atau klik untuk memilih file dari komputer (SheetJS Parser Client-Side).
              </p>
            </div>

            <div className="font-mono text-[10px] text-[#9EABC7] pt-1">
              Format Kolom: <strong>Nomor_Induk</strong>, <strong>Nama</strong>, <strong>Bulan</strong>, <strong>Nominal</strong>, <strong>Status</strong>
            </div>
          </div>
        </div>

        {/* 2. Spreadsheet Preview Table */}
        {parsedRows.length > 0 && (
          <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E4DC] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#13224E]">
                  Pratinjau Data Impor ({parsedRows.length} Baris)
                </h3>
                <p className="font-mono text-xs text-[#637096]">
                  Valid: <strong className="text-[#1B8A5A]">{validCount}</strong> baris • Tidak Valid:{' '}
                  <strong className="text-[#D0342C]">{errorCount}</strong> baris
                </p>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={() => setParsedRows([])}
                  className="px-3 py-1.5 text-[#637096] hover:text-[#13224E] bg-[#FAFAF7] border border-[#CECEC2]"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={validCount === 0}
                  className="inline-flex items-center space-x-1.5 bg-[#1B8A5A] hover:bg-[#126340] disabled:opacity-40 text-white px-3.5 py-1.5 transition font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan ke Database ({validCount} Data)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-sans">
                <thead className="sticky top-0 bg-[#FAFAF7] border-b border-[#13224E] font-mono text-[10px] uppercase text-[#637096]">
                  <tr>
                    <th className="py-2 px-2">Status Baris</th>
                    <th className="py-2 px-2">Nomor Induk (NIS)</th>
                    <th className="py-2 px-2">Nama Siswa</th>
                    <th className="py-2 px-2">Bulan</th>
                    <th className="py-2 px-2">Nominal</th>
                    <th className="py-2 px-2">Status Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4DC]">
                  {parsedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#FAFAF7] ${!row.isValid ? 'bg-[#FDECEB]/50' : ''}`}
                    >
                      <td className="py-2 px-2 font-mono text-[11px]">
                        {row.isValid ? (
                          <span className="text-[#1B8A5A] font-bold">Valid</span>
                        ) : (
                          <span className="text-[#D0342C] font-semibold">{row.errorMessage}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 font-mono text-[#13224E]">{row.Nomor_Induk}</td>
                      <td className="py-2 px-2 font-semibold text-[#13224E]">{row.Nama}</td>
                      <td className="py-2 px-2 text-[#637096]">{row.Bulan}</td>
                      <td className="py-2 px-2 font-mono font-bold text-[#13224E]">
                        {formatIDR(Number(row.Nominal))}
                      </td>
                      <td className="py-2 px-2 font-mono text-[10px]">{row.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Existing Payment History Table */}
        <div className="bg-[#FFFFFF] border border-[#13224E] p-6 space-y-4">
          <div className="border-b border-[#E4E4DC] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#13224E]">
                Buku Kas Pembayaran Tersimpan ({payments.length} Transaksi)
              </h2>
              <p className="text-xs text-[#637096]">
                Log pembukuan resmi bimbel yang tersimpan di sistem lokal.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#13224E] font-mono text-[10px] text-[#637096] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#E4E4DC]">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FAFAF7] transition">
                    <td className="py-2.5 px-2 font-mono font-semibold text-[#13224E]">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-[#13224E]">{pay.studentName}</div>
                      <div className="text-[10px] font-mono text-[#637096]">{pay.nis}</div>
                    </td>
                    <td className="py-2.5 px-2 text-[#637096]">{pay.month}</td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-[#1B3B8C]">{pay.paymentMethod}</td>
                    <td className="py-2.5 px-2 font-mono font-bold text-[#13224E]">
                      {formatIDR(pay.amount)}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[10px] text-[#637096]">{pay.paidAt}</td>
                    <td className="py-2.5 px-2 font-mono text-[10px]">
                      <span
                        className={`inline-block px-1.5 py-0.2 font-semibold ${
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

      {/* Manual Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 border-2 border-[#13224E] space-y-4 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4DC]">
              <h3 className="font-serif font-bold text-base text-[#13224E]">
                Entri Pembayaran Kasir Manual
              </h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="text-[#637096]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-semibold text-[#13224E] mb-1">
                  Nomor Induk Siswa (NIS)
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.nis}
                  onChange={(e) => setManualForm({ ...manualForm, nis: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] font-mono text-xs focus:outline-none focus:border-[#13224E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#13224E] mb-1">Nama Siswa</label>
                <input
                  type="text"
                  required
                  value={manualForm.studentName}
                  onChange={(e) => setManualForm({ ...manualForm, studentName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs font-semibold text-[#13224E] focus:outline-none focus:border-[#13224E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#13224E] mb-1">Bulan SPP</label>
                  <input
                    type="text"
                    required
                    value={manualForm.month}
                    onChange={(e) => setManualForm({ ...manualForm, month: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#13224E] mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#13224E] mb-1">Metode Bayar</label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, paymentMethod: e.target.value as any })
                  }
                  className="w-full px-2.5 py-1.5 bg-[#FAFAF7] border border-[#CECEC2] text-xs focus:outline-none"
                >
                  <option value="Tunai / Kasir">Tunai / Kasir</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Virtual Account">Virtual Account</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#E4E4DC] flex items-center justify-end space-x-2 font-mono">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-3 py-1.5 text-[#637096] bg-[#FAFAF7] border border-[#CECEC2]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-[#13224E] hover:bg-[#1B3B8C] font-semibold"
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
