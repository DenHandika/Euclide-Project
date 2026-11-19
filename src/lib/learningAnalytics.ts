import type { ExamResult, SubtestId } from "@/types";

const months = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];

export function resultTimestamp(date: string): number {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return Date.parse(date) || 0;
  const words = date
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  if (words && months.includes(words[2]))
    return Date.UTC(
      Number(words[3]),
      months.indexOf(words[2]),
      Number(words[1]),
    );
  const numeric = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return numeric
    ? Date.UTC(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]))
    : 0;
}

export function resultsForStudent(results: ExamResult[], userId: string) {
  return results
    .filter((result) => result.userId === userId)
    .sort((a, b) => resultTimestamp(b.date) - resultTimestamp(a.date));
}

export function latestResultsByStudent(results: ExamResult[]) {
  const latest = new Map<string, ExamResult>();
  for (const result of [...results].sort(
    (a, b) => resultTimestamp(b.date) - resultTimestamp(a.date),
  )) {
    if (!latest.has(result.userId)) latest.set(result.userId, result);
  }
  return [...latest.values()];
}

export interface LearningRow {
  id: SubtestId;
  name: string;
  score: number;
  accuracy: number | null;
}

export function learningRows(result: ExamResult): LearningRow[] {
  return result.subtestResults
    .filter(
      (subtest) =>
        Number.isFinite(subtest.score) &&
        subtest.score >= 0 &&
        subtest.maxPossibleScore > 0 &&
        subtest.score <= subtest.maxPossibleScore,
    )
    .map((subtest) => {
      const answered =
        subtest.correctCount + subtest.incorrectCount + subtest.unansweredCount;
      return {
        id: subtest.subtestId,
        name: subtest.subtestName,
        score:
          Math.round((subtest.score / subtest.maxPossibleScore) * 10000) / 10,
        accuracy:
          answered > 0
            ? Math.round((subtest.correctCount / answered) * 100)
            : null,
      };
    });
}

export function learningProfile(results: ExamResult[], userId: string) {
  const history = resultsForStudent(results, userId);
  const latest = history[0];
  if (!latest) return null;
  const rows = learningRows(latest);
  const priorities = [...rows].sort((a, b) => a.score - b.score).slice(0, 2);
  const strongest = [...rows].sort((a, b) => b.score - a.score)[0] ?? null;
  return { history, latest, rows, priorities, strongest };
}

export function cohortLearningRows(results: ExamResult[]) {
  const grouped = new Map<
    SubtestId,
    { id: SubtestId; name: string; total: number; count: number }
  >();
  for (const result of latestResultsByStudent(results))
    for (const row of learningRows(result)) {
      const aggregate = grouped.get(row.id) ?? {
        id: row.id,
        name: row.name,
        total: 0,
        count: 0,
      };
      aggregate.total += row.score;
      aggregate.count++;
      grouped.set(row.id, aggregate);
    }
  return [...grouped.values()].map((row) => ({
    id: row.id,
    name: row.name,
    score: Math.round((row.total / row.count) * 10) / 10,
    count: row.count,
  }));
}

const advice: Record<SubtestId, { focus: string; activity: string }> = {
  penalaran_umum: {
    focus: "Penalaran dan penarikan simpulan",
    activity:
      "Kerjakan 10 soal penalaran. Tulis premis dan alasan memilih simpulan, lalu bahas tiga jawaban yang paling meragukan.",
  },
  pengetahuan_kuantitatif: {
    focus: "Konsep kuantitatif",
    activity:
      "Mulai dari 10 soal rasio, persentase atau aljabar dasar. Catat apakah kesalahan terjadi saat memilih konsep atau menghitung.",
  },
  pemahaman_bacaan_menulis: {
    focus: "Pemahaman bacaan dan kalimat",
    activity:
      "Baca dua teks pendek, tandai gagasan utama dan hubungan antarkalimat, lalu jelaskan alasan tiap koreksi kalimat.",
  },
  pengetahuan_pemahaman_umum: {
    focus: "Makna dan konteks bacaan",
    activity:
      "Latih 10 soal makna kata dan hubungan gagasan. Gunakan bukti kalimat dalam bacaan untuk menguatkan jawaban.",
  },
  literasi_indonesia: {
    focus: "Literasi bahasa Indonesia",
    activity:
      "Latih dua bacaan. Bedakan informasi tersurat, simpulan dan pendapat; tunjukkan paragraf yang menjadi dasar jawaban.",
  },
  literasi_inggris: {
    focus: "Literasi bahasa Inggris",
    activity:
      "Baca satu teks berbahasa Inggris. Ringkas gagasan tiap paragraf dan catat kosakata dalam konteks sebelum menjawab soal.",
  },
  penalaran_matematika: {
    focus: "Pemodelan matematika",
    activity:
      "Kerjakan lima soal kontekstual. Tulis informasi diketahui, model matematika dan pemeriksaan kewajaran hasil.",
  },
};

export function studyAdvice(id: SubtestId) {
  return advice[id];
}
