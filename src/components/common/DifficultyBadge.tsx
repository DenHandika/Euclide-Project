import { normalizeDifficulty } from "@/lib/questionDifficulty";

const tones = {
  Mudah: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Sedang: "border-amber-200 bg-amber-50 text-amber-800",
  Sulit: "border-rose-200 bg-rose-50 text-rose-800",
};

export default function DifficultyBadge({ value }: { value: unknown }) {
  const difficulty = normalizeDifficulty(value);
  return (
    <span
      className={`inline-flex min-h-8 shrink-0 items-center whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold ${tones[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
