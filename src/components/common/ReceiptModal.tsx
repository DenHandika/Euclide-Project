'use client';

import React from 'react';
import { PaymentRecord } from '@/types';
import { Printer, X, CheckCircle, ShieldCheck, Download } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export function ReceiptModal({ payment, onClose }: ReceiptModalProps) {
  if (!payment) return null;

  const formatCurrency = (val: number) => {
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-navy p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide">Kuitansi Pembayaran Digital</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 text-slate-800 space-y-4">
          {/* Institution Header */}
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-black text-lg">
                EU
              </div>
              <div>
                <h2 className="text-base font-black text-navy leading-tight">BIMBEL EUCLIDE</h2>
                <p className="text-[10px] text-slate-500">Pusat Persiapan UTBK-SNBT & Kedokteran Terpadu</p>
                <p className="text-[9px] text-slate-400">Jl. Pendidikan No. 42, Kampus Terpadu • Telp (021) 7788-9900</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                LUNAS / VERIFIED
              </span>
              <div className="text-[11px] font-mono text-slate-500 mt-1">{payment.invoiceNumber}</div>
            </div>
          </div>

          {/* Receipt Details Table */}
          <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Diterima dari:</span>
              <span className="col-span-2 font-bold text-slate-900">{payment.studentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Nomor Induk (NIS):</span>
              <span className="col-span-2 font-mono font-semibold text-slate-800">{payment.nis}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Periode Tagihan:</span>
              <span className="col-span-2 font-medium text-slate-800">{payment.month}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Metode Bayar:</span>
              <span className="col-span-2 font-semibold text-blue-700">{payment.paymentMethod}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Tanggal Transaksi:</span>
              <span className="col-span-2 text-slate-700">{payment.paidAt}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500">Petugas / Kasir:</span>
              <span className="col-span-2 text-slate-700">{payment.recordedBy}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                Total Pembayaran
              </span>
              <span className="text-xs text-blue-700 italic">
                {payment.notes || 'Pembayaran SPP Bimbingan Intensif'}
              </span>
            </div>
            <div className="text-lg font-black text-navy font-mono">
              {formatCurrency(payment.amount)}
            </div>
          </div>

          {/* Legal Stamp & Verification */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <div>
              <p className="font-semibold text-slate-600">EUCLIDE Official Digital Stamp</p>
              <p>Dokumen ini sah diterbitkan oleh sistem keuangan Euclide.</p>
            </div>
            <div className="text-center border-t border-slate-300 pt-1 px-4">
              <p className="font-bold text-slate-700">Bendahara Bimbel</p>
              <p className="text-[9px] text-slate-400">Dr. Hendra Wijaya</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kuitansi / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
