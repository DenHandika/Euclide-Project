export const QUESTION_DIFFICULTIES = ["Mudah", "Sedang", "Sulit"] as const;
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

export function normalizeDifficulty(value: unknown): QuestionDifficulty {
  const label = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (label === "mudah") return "Mudah";
  if (label === "sulit" || label === "sukar") return "Sulit";
  return "Sedang";
}
