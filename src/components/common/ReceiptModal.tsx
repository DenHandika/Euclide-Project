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
    <div className="fixed inset-0 z-50 bg-[#182D4D]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] max-w-lg w-full border border-slate-200 p-6 space-y-5 font-sans rounded-3xl shadow-xl">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
          <div className="flex items-center space-x-2 font-sans text-xs font-bold text-[#263D5F]">
            <span className="w-2.5 h-2.5 bg-[#1B8A5A]" />
            <span>KUITANSI PEMBAYARAN RESMI</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 font-sans text-xs bg-[#2E578F] hover:bg-[#234573] text-white px-3 py-1.5 transition rounded-xl min-h-11"
            >
              <Printer className="w-3 h-3" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-[#263D5F] rounded-xl min-h-11"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Physical Receipt Sheet */}
        <div id="printable-receipt" className="border border-slate-200 p-6 bg-[#FFFFFF] space-y-4 font-sans text-xs rounded-2xl shadow-sm print:rounded-none print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-slate-200 pb-3 flex items-start justify-between">
            <div>
              <div className="font-sans font-black text-xl text-[#263D5F] tracking-tight">EUCLIDE</div>
              <p className="text-xs text-slate-500 uppercase font-sans">Bimbel & CBT Management System</p>
              <p className="text-xs text-slate-500">Jl. Geometri No. 2026, Kampus Klaster 1</p>
            </div>
            <div className="text-right font-sans">
              <span className="inline-block px-2 py-0.5 bg-[#EAF7F0] text-[#126340] font-bold border border-[#1B8A5A]/30 rounded-full">
                LUNAS TERVERIFIKASI
              </span>
              <div className="text-xs text-slate-500 mt-1">No: {payment.invoiceNumber}</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#F6F8FC] border border-slate-100 font-sans text-xs rounded-xl">
            <div>
              <span className="text-xs text-slate-500 block uppercase">Nama Siswa / Wajib Bayar</span>
              <span className="font-bold text-[#263D5F]">{payment.studentName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block uppercase">Nomor Induk Siswa (NIS)</span>
              <span className="font-bold text-[#263D5F]">{payment.nis}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block uppercase">Periode Pembayaran</span>
              <span className="text-[#263D5F]">{payment.month}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block uppercase">Metode Pembayaran</span>
              <span className="text-[#263D5F]">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 font-sans text-xs uppercase text-slate-500">
                <th className="py-1.5">Deskripsi Transaksi</th>
                <th className="py-1.5 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2">
                  <div className="font-semibold text-[#263D5F]">Biaya SPP Program Bimbingan SNBT</div>
                  <div className="text-xs text-slate-500">{payment.notes || 'Pembayaran SPP Reguler'}</div>
                </td>
                <td className="py-2 text-right font-sans font-bold text-[#263D5F]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 font-sans">
                <td className="py-2 font-bold text-[#263D5F]">TOTAL PEMBAYARAN</td>
                <td className="py-2 text-right font-bold text-sm text-[#263D5F]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
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
