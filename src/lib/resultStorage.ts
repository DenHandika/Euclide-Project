import type { ExamResult } from "@/types";

const resultKey = (userId: string, tryoutId: string) => `${userId}:${tryoutId}`;

export function readStudentResult(
  records: Record<string, ExamResult>,
  userId: string,
  tryoutId: string,
) {
  const result = records[resultKey(userId, tryoutId)] ?? records[tryoutId];
  return result?.userId === userId ? result : undefined;
}

export function storeStudentResult(
  records: Record<string, ExamResult>,
  result: ExamResult,
) {
  const updated = { ...records };
  const legacy = updated[result.tryoutId];
  if (legacy) {
    // Preserve the previous student's result before replacing a legacy package-only key.
    const key = resultKey(legacy.userId, legacy.tryoutId);
    if (!updated[key]) updated[key] = legacy;
    delete updated[result.tryoutId];
  }
  updated[resultKey(result.userId, result.tryoutId)] = result;
  return updated;
}
