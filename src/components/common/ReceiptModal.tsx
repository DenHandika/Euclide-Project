'use client';

import React from 'react';
import { PaymentRecord } from '@/types';
import { Printer, X, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export function ReceiptModal({ payment, onClose }: ReceiptModalProps) {
  if (!payment) return null;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#13224E]/70 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] max-w-lg w-full border-2 border-[#13224E] shadow-sheet p-6 space-y-5 font-sans">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-[#E4E4DC] pb-3 no-print">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[#13224E]">
            <span className="w-2.5 h-2.5 bg-[#1B8A5A]" />
            <span>KUITANSI PEMBAYARAN RESMI</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 font-mono text-xs bg-[#13224E] hover:bg-[#1B3B8C] text-white px-3 py-1.5 transition"
            >
              <Printer className="w-3 h-3" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#637096] hover:text-[#13224E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Physical Receipt Sheet */}
        <div id="printable-receipt" className="border border-[#13224E] p-6 bg-[#FFFFFF] space-y-4 font-sans text-xs">
          {/* Header */}
          <div className="border-b-2 border-[#13224E] pb-3 flex items-start justify-between">
            <div>
              <div className="font-serif font-black text-xl text-[#13224E] tracking-tight">EUCLIDE</div>
              <p className="text-[10px] text-[#637096] uppercase font-mono">Bimbel & CBT Management System</p>
              <p className="text-[10px] text-[#637096]">Jl. Geometri No. 2026, Kampus Klaster 1</p>
            </div>
            <div className="text-right font-mono">
              <span className="inline-block px-2 py-0.5 bg-[#EAF7F0] text-[#126340] font-bold border border-[#1B8A5A]/30">
                LUNAS TERVERIFIKASI
              </span>
              <div className="text-[10px] text-[#637096] mt-1">No: {payment.invoiceNumber}</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAFAF7] border border-[#E4E4DC] font-mono text-xs">
            <div>
              <span className="text-[9px] text-[#9EABC7] block uppercase">Nama Siswa / Wajib Bayar</span>
              <span className="font-bold text-[#13224E]">{payment.studentName}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#9EABC7] block uppercase">Nomor Induk Siswa (NIS)</span>
              <span className="font-bold text-[#13224E]">{payment.nis}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#9EABC7] block uppercase">Periode Pembayaran</span>
              <span className="text-[#13224E]">{payment.month}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#9EABC7] block uppercase">Metode Pembayaran</span>
              <span className="text-[#13224E]">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#13224E] font-mono text-[10px] uppercase text-[#637096]">
                <th className="py-1.5">Deskripsi Transaksi</th>
                <th className="py-1.5 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4DC]">
              <tr>
                <td className="py-2">
                  <div className="font-semibold text-[#13224E]">Biaya SPP Program Bimbingan SNBT</div>
                  <div className="text-[10px] text-[#637096]">{payment.notes || 'Pembayaran SPP Reguler'}</div>
                </td>
                <td className="py-2 text-right font-mono font-bold text-[#13224E]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#13224E] font-mono">
                <td className="py-2 font-bold text-[#13224E]">TOTAL PEMBAYARAN</td>
                <td className="py-2 text-right font-bold text-sm text-[#13224E]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <div className="pt-4 border-t border-[#E4E4DC] flex items-center justify-between text-[10px] font-mono text-[#637096]">
            <div>
              <div>Dicatat oleh: <strong>{payment.recordedBy}</strong></div>
              <div>Waktu Bayar: {payment.paidAt}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-[#1B8A5A]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sah Elektronik EUCLIDE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
