'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '@/context/AppContext';
import { StudentImportRow } from '@/types';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  FileDown,
} from 'lucide-react';

interface StudentBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentBulkImportModal({ isOpen, onClose }: StudentBulkImportModalProps) {
  const { importStudentsBulk, showToast } = useApp();
  const [parsedRows, setParsedRows] = useState<StudentImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (data.length === 0) {
          showToast('File spreadsheet kosong atau tidak terbaca.', 'error');
          return;
        }

        const formatted: StudentImportRow[] = data.map((item: any) => {
          const nis = String(item.NIS || item.nis || item.Nomor_Induk || '').trim();
          const nama = String(item.Nama || item.nama || item.Name || '').trim();
          const email = String(item.Email || item.email || '').trim();
          const batch = String(item.Batch_Kelas || item.batch || 'batch-super-intensif').trim();
          const ptn = String(item.Target_PTN || item.ptn || 'Universitas Indonesia (UI)').trim();
          const prodi = String(item.Target_Prodi || item.prodi || 'Pendidikan Dokter').trim();
          const phone = String(item.No_Telepon_WA || item.phone || item.telepon || '081234567890').trim();
          const status = String(item.Status || item.status || 'Aktif').trim();

          const isValid = nis.length > 0 && nama.length > 0;

          return {
            NIS: nis || 'EUC-2026-XXXX',
            Nama: nama || 'Tanpa Nama',
            Email: email || `${nis.toLowerCase()}@siswa.euclide.edu`,
            Batch_Kelas: batch,
            Target_PTN: ptn,
            Target_Prodi: prodi,
            No_Telepon_WA: phone,
            Status: status,
            isValid,
            errorMessage: !isValid ? 'NIS atau Nama siswa tidak boleh kosong' : undefined,
          };
        });

        setParsedRows(formatted);
        showToast(`Berhasil membaca ${formatted.length} baris data siswa dari file ${file.name}`, 'info');
      } catch (err) {
        showToast('Gagal memproses file Excel. Pastikan format file .xlsx atau .csv valid.', 'error');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        NIS: 'EUC-2026-0101',
        Nama: 'Andi Saputra Pratama',
        Email: 'andi.saputra@siswa.euclide.edu',
        Batch_Kelas: 'batch-super-intensif',
        Target_PTN: 'Universitas Indonesia (UI)',
        Target_Prodi: 'Pendidikan Dokter',
        No_Telepon_WA: '081234567891',
        Status: 'Aktif',
      },
      {
        NIS: 'EUC-2026-0102',
        Nama: 'Siti Nurhaliza',
        Email: 'siti.nurhaliza@siswa.euclide.edu',
        Batch_Kelas: 'batch-kedokteran',
        Target_PTN: 'Universitas Gadjah Mada (UGM)',
        Target_Prodi: 'Kedokteran',
        No_Telepon_WA: '081234567892',
        Status: 'Aktif',
      },
      {
        NIS: 'EUC-2026-0103',
        Nama: 'Budi Santoso',
        Email: 'budi.santoso@siswa.euclide.edu',
        Batch_Kelas: 'batch-reguler-weekend',
        Target_PTN: 'Institut Teknologi Bandung (ITB)',
        Target_Prodi: 'STEI - Rekayasa',
        No_Telepon_WA: '081234567893',
        Status: 'Aktif',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Siswa_Bimbel');
    XLSX.writeFile(workbook, 'Template_Bulk_Import_Siswa_Euclide.xlsx');
    showToast('Template Excel data siswa berhasil diunduh!', 'success');
  };

  const handleSaveToDatabase = () => {
    if (parsedRows.length === 0) return;
    importStudentsBulk(parsedRows);
    setParsedRows([]);
    setFileName('');
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#FFFFFF] max-w-4xl w-full p-6 border-2 border-[#13224E] space-y-5 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4DC] shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#1B3B8C]" />
              <h3 className="font-serif font-bold text-lg text-[#13224E]">
                Import Massal Data Siswa Excel (.xlsx)
              </h3>
            </div>
            <p className="font-mono text-xs text-[#637096] mt-0.5">
              Unggah data 600–700 siswa sekaligus dari spreadsheet untuk registrasi angkatan baru.
            </p>
          </div>
          <button onClick={onClose} className="text-[#637096] hover:text-[#13224E]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#FAFAF7] border border-[#E4E4DC] text-xs font-mono shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F3F3ED] text-[#13224E] border border-[#CECEC2] font-semibold transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#1B3B8C]" />
              <span>Unduh Template (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 bg-[#1B3B8C] hover:bg-[#274DB8] text-white font-bold transition flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih File Excel</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {fileName && (
            <div className="text-[11px] text-[#13224E]">
              File: <strong className="text-[#1B3B8C]">{fileName}</strong> ({parsedRows.length} baris)
            </div>
          )}
        </div>

        {/* Preview Table */}
        <div className="flex-1 overflow-y-auto border border-[#E4E4DC] p-3 space-y-3 bg-[#FFFFFF]">
          {parsedRows.length === 0 ? (
            <div className="py-12 text-center text-[#637096] space-y-2">
              <FileSpreadsheet className="w-10 h-10 mx-auto text-[#9EABC7]" />
              <p className="text-xs">Belum ada file Excel yang dipilih.</p>
              <p className="text-[11px] font-mono text-[#9EABC7]">
                Klik tombol &quot;Unduh Template&quot; di atas untuk mengisi data siswa sesuai format.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-[#E4E4DC]">
                <span>Pratinjau Data Siswa:</span>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-[#1B8A5A] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{validCount} Baris Siap Import</span>
                  </span>
                  {errorCount > 0 && (
                    <span className="text-[#D0342C] font-semibold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{errorCount} Baris Tidak Valid</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#13224E] font-mono text-[10px] text-[#637096] uppercase">
                      <th className="pb-1.5 px-2">NIS</th>
                      <th className="pb-1.5 px-2">Nama Siswa</th>
                      <th className="pb-1.5 px-2">Email</th>
                      <th className="pb-1.5 px-2">Target PTN</th>
                      <th className="pb-1.5 px-2">Target Prodi</th>
                      <th className="pb-1.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4DC]">
                    {parsedRows.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className={row.isValid ? 'hover:bg-[#FAFAF7]' : 'bg-[#FDECEB]/40'}>
                        <td className="py-2 px-2 font-mono font-semibold text-[#13224E]">{row.NIS}</td>
                        <td className="py-2 px-2 font-semibold text-[#13224E]">{row.Nama}</td>
                        <td className="py-2 px-2 font-mono text-[10px] text-[#637096]">{row.Email}</td>
                        <td className="py-2 px-2 font-serif font-bold text-[#13224E]">{row.Target_PTN}</td>
                        <td className="py-2 px-2 text-[#1B3B8C] text-[11px]">{row.Target_Prodi}</td>
                        <td className="py-2 px-2 font-mono text-[10px]">
                          {row.isValid ? (
                            <span className="text-[#1B8A5A] font-bold">Valid</span>
                          ) : (
                            <span className="text-[#D0342C]">{row.errorMessage}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 50 && (
                <p className="text-[10px] font-mono text-[#9EABC7] italic text-center pt-2">
                  ... dan {parsedRows.length - 50} baris data lainnya
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E4E4DC] shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#CECEC2] text-[#637096] hover:text-[#13224E]"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={parsedRows.length === 0 || validCount === 0}
            onClick={handleSaveToDatabase}
            className={`px-5 py-2 text-white font-bold transition flex items-center space-x-1.5 ${
              parsedRows.length === 0 || validCount === 0
                ? 'bg-[#CECEC2] cursor-not-allowed text-[#637096]'
                : 'bg-[#1B8A5A] hover:bg-[#126340]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan {validCount} Siswa ke Database</span>
          </button>
        </div>
      </div>
    </div>
  );
}
