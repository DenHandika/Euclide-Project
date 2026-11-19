import test from "node:test";
import assert from "node:assert/strict";
import { paymentPeriods, studentComposition } from "../src/lib/adminDashboard";
import { MOCK_PAYMENTS, MOCK_USERS } from "../src/data/mockData";

const MOCK_STUDENTS = MOCK_USERS.filter((user) => user.role === "siswa");

test("dashboard aggregates by billing period and status, preserving unknown periods", () => {
  const source = MOCK_PAYMENTS[0];
  const periods = paymentPeriods([
    { ...source, month: "Februari 2026", amount: 100, status: "Lunas" },
    { ...source, month: " FEBRUARI 2026 ", amount: 50, status: "Menunggu" },
    { ...source, month: "Desember 2025", amount: 25, status: "Jatuh Tempo" },
    { ...source, month: "", amount: 10 },
    { ...source, month: "Februari 2026", amount: NaN },
    { ...source, month: "Februari 2026", amount: -30 },
  ]);
  assert.deepEqual(
    periods.map((period) => period.label),
    ["Desember 2025", "Februari 2026", "Tanpa periode"],
  );
  assert.equal(periods[0]["Jatuh Tempo"], 25);
  assert.equal(periods[1].Lunas, 100);
  assert.equal(periods[1].Menunggu, 50);
  assert.equal(periods[2].Lunas, 10);
  assert.deepEqual(paymentPeriods([]), []);
});

test("student composition includes each account once and retains empty statuses", () => {
  const composition = studentComposition(MOCK_STUDENTS);
  assert.equal(
    composition.reduce((sum, item) => sum + item.count, 0),
    MOCK_STUDENTS.length,
  );
  assert.equal(
    composition.find((item) => item.status === "active")?.count,
    MOCK_STUDENTS.filter((student) => student.status === "active").length,
  );
  assert.ok(studentComposition([]).every((item) => item.count === 0));
});
