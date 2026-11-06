export function getPageRange(
  totalItems: number,
  requestedPage: number,
  pageSize: number
) {
  if (
    !Number.isInteger(totalItems) ||
    totalItems < 0 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    throw new Error('Invalid pagination size');
  }
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(
    totalPages,
    Math.max(1, Math.trunc(requestedPage) || 1)
  );
  const offset = (page - 1) * pageSize;
  return {
    page,
    totalPages,
    offset,
    from: totalItems ? offset + 1 : 0,
    to: Math.min(offset + pageSize, totalItems),
  };
}

export function pageNumbers(
  page: number,
  totalPages: number
): (number | 'start-gap' | 'end-gap')[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3)
    for (let i = 1; i <= Math.min(4, totalPages); i++) pages.add(i);
  if (page >= totalPages - 2)
    for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++)
      pages.add(i);
  const sorted = Array.from(pages)
    .filter((n) => n > 0 && n <= totalPages)
    .sort((a, b) => a - b);
  const result: (number | 'start-gap' | 'end-gap')[] = [];
  sorted.forEach((value, index) => {
    if (index && value - sorted[index - 1] > 1)
      result.push(value < page ? 'start-gap' : 'end-gap');
    result.push(value);
  });
  return result;
}
