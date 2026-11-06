import type { Question, SubtestConfig, SubtestId, Tryout } from '@/types';

export function buildDemoTryouts(
  bank: Question[],
  configs: SubtestConfig[]
): Tryout[] {
  const all = configs.map((config) => config.id);
  function make(
    id: string,
    title: string,
    description: string,
    subjects: SubtestId[],
    take: number,
    last = false,
    quick = false
  ): Tryout {
    const selected = subjects.flatMap((subject) => {
      const available = bank.filter(
        (question) => question.subtestId === subject
      );
      return last ? available.slice(-take) : available.slice(0, take);
    });
    const subtests = subjects.map((subject) => {
      const config = configs.find((item) => item.id === subject)!;
      const questionCount = selected.filter(
        (question) => question.subtestId === subject
      ).length;
      return {
        ...config,
        questionCount,
        durationMinutes: Math.max(5, questionCount),
      };
    });
    return {
      id,
      code: id.replace('to-', 'DEMO-').toUpperCase(),
      title,
      description,
      subtests,
      questions: selected.map((question, i) => ({
        ...question,
        number: i + 1,
      })),
      totalQuestions: selected.length,
      totalDurationMinutes: subtests.reduce(
        (sum, subtest) => sum + subtest.durationMinutes,
        0
      ),
      badge: quick ? 'Coba alur CBT' : 'Paket latihan',
      targetDate: 'Tersedia untuk uji frontend',
      participantsCount: 0,
    };
  }
  return [
    make(
      'to-demo-cepat-00',
      'Coba CBT · 35 soal, 35 menit',
      'Lima soal per subtes, masing-masing lima menit, untuk mencoba navigasi nomor, empat tipe soal, timer, dan pengumpulan. Durasi khusus pengujian, bukan simulasi waktu resmi SNBT.',
      all,
      5,
      false,
      true
    ),
    make(
      'to-utbk-national-01',
      'Tryout UTBK-SNBT · Seri 1',
      'Latihan tujuh subtes dengan logika, bacaan, rumus, isian, dan essay. Jumlah soal dan durasi disederhanakan untuk uji frontend.',
      all,
      6
    ),
    make(
      'to-utbk-national-02',
      'Tryout UTBK-SNBT · Seri 2',
      'Variasi soal tujuh subtes dengan bacaan tentang lingkungan, sekolah, dan kegiatan masyarakat.',
      all,
      5,
      true
    ),
    make(
      'to-tps-lengkap-04',
      'Latihan TPS · Logika, bahasa & angka',
      'Fokus empat subtes TPS: PU, PK, PBM, dan PPU. Cocok untuk mencoba perpindahan subtes dan palet jawaban.',
      all.slice(0, 4),
      6
    ),
    make(
      'to-tps-drilling-02',
      'Latihan Penalaran & Kuantitatif',
      'Persamaan, barisan, fungsi, matriks, geometri, dan persoalan sehari-hari. Termasuk isian dan pilihan jamak.',
      ['pengetahuan_kuantitatif', 'penalaran_matematika'],
      8
    ),
    make(
      'to-literasi-mastery-03',
      'Literasi · Indonesia & English',
      'Bacaan perpustakaan, kebun bersama, bicycle sharing, dan urban trees dengan pembahasan tiap soal.',
      ['literasi_indonesia', 'literasi_inggris'],
      8
    ),
    make(
      'to-tps-logika-05',
      'Fokus Penalaran Umum',
      'Simpulan logis, pola bilangan, urutan, dan evaluasi argumen. Latihan satu subtes untuk sesi singkat.',
      ['penalaran_umum'],
      10
    ),
    make(
      'to-tps-bahasa-06',
      'Fokus Bahasa · PBM & PPU',
      'Kalimat efektif, konjungsi, ejaan, makna kata, dan hubungan antaride dalam bacaan.',
      ['pemahaman_bacaan_menulis', 'pengetahuan_pemahaman_umum'],
      8
    ),
    make(
      'to-tps-matematika-07',
      'Matematika Kontekstual',
      'Latihan luas, diskon, biaya perjalanan, persentase, dan pemodelan numerik. Memuat soal pilihan ganda dan isian.',
      ['penalaran_matematika'],
      12,
      true
    ),
  ];
}
