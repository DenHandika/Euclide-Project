export type Degree = 'S1' | 'D4' | 'D3';
export interface StudyProgram {
  id: string;
  institution: string;
  name: string;
  degree: Degree;
  year: number;
  targetScore: number | null;
}
export const SNBT_RULE_YEAR = 2026;

export function validateChoices(choices: Pick<StudyProgram, 'id' | 'degree'>[]) {
  const invalid = (message: string) => ({ valid: false, message });
  if (choices.length === 0) return invalid('Pilih minimal satu program studi sebelum mulai tryout.');
  if (choices.length > 4) return invalid('Maksimal empat program studi, bukan empat kampus.');
  if (new Set(choices.map(p => p.id)).size !== choices.length) return invalid('Program studi yang sama tidak boleh dipilih dua kali.');
  if (choices.some(p => !['S1', 'D4', 'D3'].includes(p.degree))) return invalid('Jenjang program studi tidak dikenali.');
  const academic = choices.filter(p => p.degree === 'S1').length;
  const d3 = choices.filter(p => p.degree === 'D3').length;
  if (choices.length <= 2) return { valid: true, message: 'Kombinasi pilihan sudah sesuai aturan SNBT 2026.' };
  if (choices.length === 3 && (academic === 1 || academic === 2 || (academic === 0 && d3 >= 1))) {
    return { valid: true, message: 'Kombinasi tiga pilihan sudah sesuai aturan SNBT 2026.' };
  }
  if (choices.length === 4 && (academic === 1 || academic === 2) && d3 >= 1) {
    return { valid: true, message: 'Kombinasi empat pilihan sudah sesuai aturan SNBT 2026.' };
  }
  return invalid(choices.length === 3
    ? 'Untuk tiga pilihan: gabungkan S1 dan vokasi, atau pilih tiga vokasi dengan minimal satu D3.'
    : 'Untuk empat pilihan: pilih 2 S1 + 2 vokasi atau 1 S1 + 3 vokasi, dengan minimal satu D3.');
}

export function evaluateTarget(score: number, target: number | null) {
  if (target === null) return { status: 'unavailable' as const, difference: null, label: 'Target belum tersedia' };
  const difference = Math.round((score - target) * 100) / 100;
  return {
    status: difference >= 0 ? 'aman' as const : difference >= -35 ? 'kompetitif' as const : 'kritis' as const,
    difference,
    label: difference >= 0 ? 'Lolos target' : difference >= -35 ? 'Mendekati target' : 'Perlu peningkatan',
  };
}
