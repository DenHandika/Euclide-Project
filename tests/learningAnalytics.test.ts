import { test } from "node:test";
import assert from "node:assert/strict";
import { MOCK_EXAM_RESULT } from "../src/data/mockData";
import {
  cohortLearningRows,
  latestResultsByStudent,
  learningProfile,
  learningRows,
  resultsForStudent,
  resultTimestamp,
} from "../src/lib/learningAnalytics";
import type { ExamResult } from "../src/types";
import {
  readStudentResult,
  storeStudentResult,
} from "../src/lib/resultStorage";

const result = (userId: string, date: string, score: number): ExamResult => ({
  ...MOCK_EXAM_RESULT,
  id: `${userId}-${date}`,
  userId,
  date,
  totalScore: score,
  subtestResults: [{ ...MOCK_EXAM_RESULT.subtestResults[0], score }],
});

test("individual analysis never borrows another student's result and orders Indonesian dates", () => {
  const data = [
    result("a", "28 Februari 2026", 550),
    result("b", "19 November 2026", 900),
    result("a", "3 November 2026", 700),
  ];
  const profile = learningProfile(data, "a")!;
  assert.equal(profile.latest.totalScore, 700);
  assert.deepEqual(
    profile.history.map((item) => item.totalScore),
    [700, 550],
  );
  assert.equal(learningProfile(data, "unknown"), null);
  assert.equal(resultsForStudent(data, "b").length, 1);
  assert.ok(
    resultTimestamp("2026-11-19T07:00:00Z") >
      resultTimestamp("3 November 2026"),
  );
  assert.equal(
    resultTimestamp("19/11/2026"),
    resultTimestamp("19 November 2026"),
  );
});

test("cohort gives each student one latest result and uses only participants with each subtest", () => {
  const older = result("a", "1 Oktober 2026", 100);
  const newer = result("a", "1 November 2026", 500);
  const other = result("b", "2 November 2026", 700);
  other.subtestResults.push({
    ...MOCK_EXAM_RESULT.subtestResults[1],
    score: 800,
  });
  const data = [older, newer, other];
  assert.equal(latestResultsByStudent(data).length, 2);
  const rows = cohortLearningRows(data);
  assert.equal(rows[0].score, 600);
  assert.equal(rows[0].count, 2);
  assert.equal(rows[1].score, 800);
  assert.equal(rows[1].count, 1);
});

test("zero is a valid score, absent question counts are not fabricated, and invalid subtest scores are excluded", () => {
  const zero = result("a", "1 November 2026", 0);
  zero.subtestResults[0] = {
    ...zero.subtestResults[0],
    correctCount: 0,
    incorrectCount: 0,
    unansweredCount: 0,
  };
  assert.equal(learningRows(zero)[0].score, 0);
  assert.equal(learningRows(zero)[0].accuracy, null);
  zero.subtestResults.push(
    { ...zero.subtestResults[0], score: Number.NaN },
    { ...zero.subtestResults[0], score: 1001 },
  );
  assert.equal(learningRows(zero).length, 1);
  assert.deepEqual(cohortLearningRows([]), []);
});

test("learning priorities follow the selected student's lowest normalized scores without mutating source data", () => {
  const source = {
    ...MOCK_EXAM_RESULT,
    subtestResults: [...MOCK_EXAM_RESULT.subtestResults],
  };
  const order = source.subtestResults.map((subtest) => subtest.subtestId);
  const profile = learningProfile([source], source.userId)!;
  assert.deepEqual(
    profile.priorities.map((row) => row.id),
    ["pemahaman_bacaan_menulis", "literasi_indonesia"],
  );
  assert.equal(profile.strongest?.id, "pengetahuan_kuantitatif");
  assert.deepEqual(
    source.subtestResults.map((subtest) => subtest.subtestId),
    order,
  );
});

test("students completing the same package keep separate results and legacy records migrate without loss", () => {
  const first = result("a", "1 November 2026", 500);
  const second = result("b", "2 November 2026", 700);
  const original = { [first.tryoutId]: first };
  const updated = storeStudentResult(original, second);
  assert.equal(
    readStudentResult(updated, "a", first.tryoutId)?.totalScore,
    500,
  );
  assert.equal(
    readStudentResult(updated, "b", second.tryoutId)?.totalScore,
    700,
  );
  assert.equal(
    readStudentResult(updated, "unknown", first.tryoutId),
    undefined,
  );
  assert.equal(Object.values(updated).length, 2);
  assert.deepEqual(original, { [first.tryoutId]: first });
  const revised = storeStudentResult(updated, { ...first, totalScore: 650 });
  assert.equal(
    readStudentResult(revised, "a", first.tryoutId)?.totalScore,
    650,
  );
  assert.equal(
    readStudentResult(revised, "b", second.tryoutId)?.totalScore,
    700,
  );
  assert.equal(Object.values(revised).length, 2);
});
