import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPageRange, pageNumbers } from '../src/lib/pagination';

test('empty and undersized lists have safe ranges without nonexistent rows', () => {
  assert.deepEqual(getPageRange(0, 9, 5), {
    page: 1,
    totalPages: 1,
    offset: 0,
    from: 0,
    to: 0,
  });
  assert.deepEqual(getPageRange(3, 4, 5), {
    page: 1,
    totalPages: 1,
    offset: 0,
    from: 1,
    to: 3,
  });
  assert.throws(() => getPageRange(5, 1, 0));
});

test('global student numbering continues and last pages clamp after deletion/filtering', () => {
  assert.equal(getPageRange(6, 2, 5).from, 6);
  assert.equal(getPageRange(6, 2, 5).to, 6);
  assert.equal(getPageRange(80, 14, 6).from, 79);
  assert.equal(getPageRange(80, 14, 6).to, 80);
  assert.equal(getPageRange(3, 14, 6).page, 1);
  assert.equal(getPageRange(80, -1, 6).page, 1);
});

test('every row appears exactly once across all pages, including 300-row import preview', () => {
  for (const total of [0, 1, 6, 9, 80, 300, 650]) {
    const source = Array.from({ length: total }, (_, index) => index);
    for (const size of [3, 5, 6, 10, 25, 50]) {
      const collected: number[] = [];
      const count = getPageRange(total, 1, size).totalPages;
      for (let page = 1; page <= count; page++) {
        const range = getPageRange(total, page, size);
        collected.push(...source.slice(range.offset, range.to));
      }
      assert.deepEqual(collected, source);
    }
  }
});

test('page button windows include endpoints and current page without duplicate numbers', () => {
  for (const total of [1, 2, 7, 20, 130])
    for (let page = 1; page <= total; page++) {
      const buttons = pageNumbers(page, total);
      const numbers = buttons.filter(
        (item): item is number => typeof item === 'number'
      );
      assert.ok(
        numbers.includes(1) && numbers.includes(total) && numbers.includes(page)
      );
      assert.equal(new Set(buttons).size, buttons.length);
      assert.ok(numbers.every((number) => number >= 1 && number <= total));
      assert.ok(buttons.length <= 7);
    }
});
