'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationState } from '@/hooks/usePagination';
import { pageNumbers } from '@/lib/pagination';

export default function Pagination({
  pagination: p,
  label,
}: {
  pagination: PaginationState;
  label: string;
}) {
  if (p.totalItems === 0) return null;
  return (
    <nav
      aria-label={`Pagination ${label}`}
      className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-1 py-4 text-xs text-slate-500"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p role="status" aria-live="polite">
          Menampilkan{' '}
          <strong className="font-semibold text-slate-700">
            {p.from}–{p.to}
          </strong>{' '}
          dari {p.totalItems}
        </p>
        <label className="flex items-center gap-2">
          Per halaman
          <select
            aria-label={`Jumlah ${label} per halaman`}
            value={p.pageSize}
            onChange={(event) => p.setPageSize(Number(event.target.value))}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            {p.pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Halaman sebelumnya: ${label}`}
          disabled={p.page === 1}
          onClick={() => p.setPage(p.page - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft size={17} />
        </button>
        <span className="px-3 font-medium sm:hidden">
          {p.page} / {p.totalPages}
        </span>
        {pageNumbers(p.page, p.totalPages).map((number) =>
          typeof number === 'number' ? (
            <button
              type="button"
              key={number}
              aria-label={`Halaman ${number}: ${label}`}
              aria-current={p.page === number ? 'page' : undefined}
              onClick={() => p.setPage(number)}
              className={`hidden h-11 min-w-11 items-center sm:flex justify-center rounded-xl px-2 text-xs font-semibold transition ${p.page === number ? 'bg-[#EDF2FA] text-[#315D97]' : 'hover:bg-slate-100'}`}
            >
              {number}
            </button>
          ) : (
            <span
              aria-hidden="true"
              key={number}
              className="hidden px-1 sm:inline"
            >
              …
            </span>
          )
        )}
        <button
          type="button"
          aria-label={`Halaman berikutnya: ${label}`}
          disabled={p.page === p.totalPages}
          onClick={() => p.setPage(p.page + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}
