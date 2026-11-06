import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MOCK_QUESTIONS,
  MOCK_TRYOUTS,
  SUBTEST_CONFIGS,
} from '../src/data/mockData';
import { DEMO_QUESTIONS } from '../src/data/demoQuestions';

test('frontend bank covers all subtests and four input types with valid objective keys', () => {
  assert.equal(MOCK_QUESTIONS.length, 80);
  assert.equal(
    new Set(MOCK_QUESTIONS.map((question) => question.id)).size,
    MOCK_QUESTIONS.length
  );
  assert.equal(
    new Set(MOCK_QUESTIONS.map((question) => question.type)).size,
    4
  );
  for (const subtest of SUBTEST_CONFIGS)
    assert.ok(
      MOCK_QUESTIONS.filter((q) => q.subtestId === subtest.id).length >= 8
    );
  for (const question of MOCK_QUESTIONS) {
    assert.ok(question.question.trim() && question.explanation.trim());
    if (question.type === 'single_choice' || question.type === 'multi_select') {
      const options = question.options ?? [];
      assert.equal(options.length, 5);
      assert.equal(new Set(options.map((option) => option.text)).size, 5);
      const keys = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];
      assert.ok(
        keys.length > 0 &&
          keys.every((key) => options.some((option) => option.id === key))
      );
    }
  }
  assert.equal(
    MOCK_QUESTIONS.find((q) => q.id === 'q-pm-3')?.options?.find(
      (option) => option.id === 'B'
    )?.text,
    '$k = 7.5$'
  );
});

test('all package counts, durations, subtest coverage, IDs, and question numbers match actual contents', () => {
  assert.equal(MOCK_TRYOUTS.length, 9);
  assert.equal(
    new Set(MOCK_TRYOUTS.map((tryout) => tryout.id)).size,
    MOCK_TRYOUTS.length
  );
  const bankIds = new Set(MOCK_QUESTIONS.map((question) => question.id));
  for (const tryout of MOCK_TRYOUTS) {
    assert.equal(tryout.totalQuestions, tryout.questions.length);
    assert.equal(
      tryout.totalDurationMinutes,
      tryout.subtests.reduce((sum, subtest) => sum + subtest.durationMinutes, 0)
    );
    assert.equal(
      new Set(tryout.questions.map((q) => q.id)).size,
      tryout.questions.length
    );
    tryout.questions.forEach((question, index) => {
      assert.equal(question.number, index + 1);
      assert.ok(bankIds.has(question.id));
      assert.ok(
        tryout.subtests.some((subtest) => subtest.id === question.subtestId)
      );
    });
    for (const subtest of tryout.subtests) {
      assert.ok(subtest.durationMinutes >= 5 && subtest.questionCount >= 5);
      assert.equal(
        subtest.questionCount,
        tryout.questions.filter((question) => question.subtestId === subtest.id)
          .length
      );
    }
  }
  const quick = MOCK_TRYOUTS.find(
    (tryout) => tryout.id === 'to-demo-cepat-00'
  )!;
  assert.equal(quick.totalQuestions, 35);
  assert.equal(quick.totalDurationMinutes, 35);
  for (const subtest of quick.subtests) {
    assert.equal(subtest.questionCount, 5);
    assert.equal(subtest.durationMinutes, 5);
  }
  assert.equal(
    new Set(quick.questions.map((question) => question.type)).size,
    4
  );
});

test('generated quantitative answers agree with independent calculations and bottle counts are integral', () => {
  for (const question of DEMO_QUESTIONS.filter(
    (q) =>
      q.subtestId === 'pengetahuan_kuantitatif' ||
      q.subtestId === 'penalaran_matematika'
  )) {
    const group = Math.floor((question.number - 1) / 4);
    const variant = (question.number - 1) % 4;
    const pkExpected = [
      group + 5,
      group + 3 + 7 * (group + 2),
      group + 9,
      (group + 3) * 6 - (group + 2),
    ];
    const pmExpected = [
      (10 + group * 2) * (6 + group),
      (20 + group * 5) * 0.8,
      8 + group + (2 + group) * 5,
      ((120 + group * 40) * 3) / 4,
    ];
    const expected =
      question.subtestId === 'pengetahuan_kuantitatif'
        ? pkExpected[variant]
        : pmExpected[variant];
    const actual =
      question.type === 'short_answer'
        ? Number(question.correctAnswer)
        : Number(
            question.options?.find(
              (option) => option.id === question.correctAnswer
            )?.text
          );
    assert.equal(actual, expected, question.id);
    if (question.subtestId === 'penalaran_matematika' && variant === 3)
      assert.ok(Number.isInteger(actual));
  }
});
