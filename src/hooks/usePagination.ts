'use client';

import { useState } from 'react';
import { getPageRange } from '@/lib/pagination';

export interface PaginationState {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  offset: number;
  from: number;
  to: number;
  pageSizes: readonly number[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export default function usePagination<T>(
  items: T[],
  initialSize = 5,
  resetKey = '',
  pageSizes: readonly number[] = [5, 10, 25, 50]
) {
  const [pageSize, setSize] = useState(initialSize);
  const [selection, setSelection] = useState({ key: resetKey, page: 1 });
  if (selection.key !== resetKey) setSelection({ key: resetKey, page: 1 });
  const range = getPageRange(
    items.length,
    selection.key === resetKey ? selection.page : 1,
    pageSize
  );
  if (selection.key === resetKey && selection.page !== range.page)
    setSelection({ key: resetKey, page: range.page });
  const pagination: PaginationState = {
    ...range,
    totalItems: items.length,
    pageSize,
    pageSizes,
    setPage: (page) =>
      setSelection({
        key: resetKey,
        page: getPageRange(items.length, page, pageSize).page,
      }),
    setPageSize: (size) => {
      if (!pageSizes.includes(size)) return;
      setSize(size);
      setSelection({ key: resetKey, page: 1 });
    },
  };
  return {
    ...pagination,
    pageItems: items.slice(range.offset, range.offset + pageSize),
  };
}
