"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PaymentRecord } from "@/types";
import { Printer, X } from "lucide-react";

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export function ReceiptModal({ payment, onClose }: ReceiptModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setPortalTarget(document.body), []);
  useEffect(() => {
    if (!payment || !portalTarget) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const previousPrintMode = document.body.getAttribute("data-print-receipt");
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-print-receipt", "true");
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousPrintMode === null)
        document.body.removeAttribute("data-print-receipt");
      else document.body.setAttribute("data-print-receipt", previousPrintMode);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [payment, portalTarget]);

  if (!payment || !portalTarget) return null;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="receipt-dialog m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:p-6"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="min-w-0 space-y-5 font-sans">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 no-print">
          <h2 id={titleId} className="text-lg font-bold">
            Pratinjau kuitansi
          </h2>
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex cursor-pointer items-center space-x-1 font-sans text-xs bg-[#2E578F] hover:bg-[#234573] text-white px-3 py-1.5 transition rounded-xl min-h-11"
            >
              <Printer aria-hidden="true" className="w-4 h-4" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              type="button"
              autoFocus
              aria-label="Tutup pratinjau kuitansi"
              onClick={onClose}
              className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Physical Receipt Sheet */}
        <div
          id="printable-receipt"
          className="min-w-0 space-y-5 bg-white font-sans text-sm"
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="font-sans font-black text-xl text-[#263D5F] tracking-tight">
                EUCLIDE
              </div>
              <p className="text-sm text-slate-600">
                Bimbingan belajar Euclide
              </p>
            </div>
            <div className="text-right font-sans">
              <span className="text-sm font-semibold text-slate-800">
                {payment.status}
              </span>
              <div className="text-xs text-slate-600 mt-1">
                No: {payment.invoiceNumber}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-4 border-b border-slate-200 pb-4 font-sans text-sm sm:grid-cols-2">
            <div>
              <span className="text-xs text-slate-600 block uppercase">
                Nama Siswa / Wajib Bayar
              </span>
              <span className="font-bold text-[#263D5F]">
                {payment.studentName}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-600 block uppercase">
                Kode siswa
              </span>
              <span className="font-bold text-[#263D5F]">{payment.nis}</span>
            </div>
            <div>
              <span className="text-xs text-slate-600 block uppercase">
                Periode Pembayaran
              </span>
              <span className="text-[#263D5F]">{payment.month}</span>
            </div>
            <div>
              <span className="text-xs text-slate-600 block uppercase">
                Metode Pembayaran
              </span>
              <span className="text-[#263D5F]">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Details Table */}
          <table className="w-full text-left">
            <caption className="sr-only">
              Rincian pembayaran {payment.invoiceNumber}
            </caption>
            <thead>
              <tr className="border-b border-slate-200 font-sans text-xs uppercase text-slate-600">
                <th scope="col" className="py-1.5">
                  Deskripsi transaksi
                </th>
                <th scope="col" className="py-1.5 text-right">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2">
                  <div className="font-semibold text-[#263D5F]">
                    Biaya SPP Program Bimbingan SNBT
                  </div>
                  <div className="text-xs text-slate-600">
                    {payment.notes || "Pembayaran SPP Reguler"}
                  </div>
                </td>
                <td className="py-2 text-right font-sans font-bold text-[#263D5F]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 font-sans">
                <td className="py-2 font-bold text-[#263D5F]">
                  TOTAL PEMBAYARAN
                </td>
                <td className="py-2 text-right font-bold text-sm text-[#263D5F]">
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-600">
            <div>
              <div>
                Dicatat oleh: <strong>{payment.recordedBy}</strong>
              </div>
              <div>Waktu Bayar: {payment.paidAt}</div>
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    portalTarget,
  );
}

export default ReceiptModal;
