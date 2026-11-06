import type { Question, SubtestId } from '@/types';

// Original practice content for frontend testing, not official SNBT questions.
const letters = ['A', 'B', 'C', 'D', 'E'];
function choice(
  subject: SubtestId,
  n: number,
  stimulus: string,
  question: string,
  options: string[],
  correct: number | number[],
  explanation: string
): Question {
  return {
    id: `demo-${subject}-${n}`,
    subtestId: subject,
    number: n,
    type: Array.isArray(correct) ? 'multi_select' : 'single_choice',
    stimulus,
    question,
    options: options.map((text, i) => ({ id: letters[i], text })),
    correctAnswer: Array.isArray(correct)
      ? correct.map((i) => letters[i])
      : letters[correct],
    explanation,
    maxScore: 10,
    difficulty: n % 3 === 0 ? 'Sukar' : n % 2 === 0 ? 'Mudah' : 'Sedang',
  };
}
function numeric(
  subject: SubtestId,
  n: number,
  stimulus: string,
  question: string,
  answer: number,
  explanation: string
): Question {
  if (n % 4 === 0)
    return {
      id: `demo-${subject}-${n}`,
      subtestId: subject,
      number: n,
      type: 'short_answer',
      stimulus,
      question: `${question} Tuliskan angkanya saja.`,
      correctAnswer: String(answer),
      explanation,
      maxScore: 10,
      difficulty: 'Sedang',
    };
  const values = [answer, answer + 2, answer - 2, answer + 5, answer - 5];
  const rotate = n % 5;
  const options = [...values.slice(rotate), ...values.slice(0, rotate)];
  return choice(
    subject,
    n,
    stimulus,
    question,
    options.map(String),
    options.indexOf(answer),
    explanation
  );
}

const pu: SubtestId = 'penalaran_umum';
const pbm: SubtestId = 'pemahaman_bacaan_menulis';
const ppu: SubtestId = 'pengetahuan_pemahaman_umum';
const li: SubtestId = 'literasi_indonesia';
const en: SubtestId = 'literasi_inggris';

const reasoning: Question[] = [
  choice(
    pu,
    1,
    'Semua anggota klub astronomi mengikuti observasi malam. Rani adalah anggota klub astronomi.',
    'Pernyataan yang pasti benar adalah …',
    [
      'Rani mengikuti observasi malam.',
      'Semua peserta observasi adalah anggota klub.',
      'Rani memimpin klub.',
      'Rani tidak mengikuti observasi.',
      'Semua siswa anggota klub.',
    ],
    0,
    'Rani termasuk anggota klub; aturan untuk semua anggota berlaku juga untuk Rani.'
  ),
  choice(
    pu,
    2,
    'Jika hujan turun, latihan dilakukan di aula. Hari ini latihan tidak dilakukan di aula.',
    'Simpulan yang sah adalah …',
    [
      'Hari ini pasti panas.',
      'Hari ini hujan turun.',
      'Hari ini tidak hujan.',
      'Aula sedang direnovasi.',
      'Latihan dibatalkan.',
    ],
    2,
    'Modus tollens: jika P maka Q; tidak Q berarti tidak P. Tidak hujan tidak selalu berarti panas.'
  ),
  choice(
    pu,
    3,
    'Urutan presentasi: Dita sebelum Eko; Eko sebelum Fajar. Gita tampil setelah Fajar.',
    'Siapa yang pasti tampil paling awal dari keempat orang itu?',
    ['Eko', 'Fajar', 'Gita', 'Dita', 'Tidak dapat ditentukan'],
    3,
    'Hubungan urutannya lengkap: Dita, Eko, Fajar, lalu Gita.'
  ),
  choice(
    pu,
    4,
    'Jumlah pengunjung perpustakaan Senin sampai Kamis: 18, 24, 30, 36. Pola pertambahan tetap.',
    'Jika pola berlanjut, jumlah pengunjung Jumat adalah …',
    ['38', '40', '42', '44', '48'],
    2,
    'Setiap hari bertambah 6; Jumat menjadi 36 + 6 = 42.'
  ),
  choice(
    pu,
    5,
    'Setelah sekolah menambah tempat sampah terpilah, jumlah sampah tercampur berkurang. Pada bulan yang sama sekolah juga mengadakan pelatihan pemilahan.',
    'Mengapa belum tepat menyimpulkan bahwa penambahan tempat sampah adalah satu-satunya penyebab?',
    [
      'Data pasti salah.',
      'Pelatihan juga dapat memengaruhi hasil.',
      'Tempat sampah tidak pernah bermanfaat.',
      'Sampah tercampur justru meningkat.',
      'Tidak ada perubahan lain.',
    ],
    1,
    'Ada faktor lain yang berubah bersamaan, yaitu pelatihan. Pengamatan ini belum memisahkan pengaruh kedua faktor.'
  ),
  choice(
    pu,
    6,
    'Sebagian peserta olimpiade mengikuti klub sains. Semua anggota klub sains memperoleh akses laboratorium.',
    'Pilih semua simpulan yang pasti benar.',
    [
      'Sebagian peserta olimpiade memperoleh akses laboratorium.',
      'Semua peserta olimpiade anggota klub sains.',
      'Semua anggota klub sains memperoleh akses laboratorium.',
      'Tidak ada peserta olimpiade yang mendapat akses.',
      'Semua pengguna laboratorium peserta olimpiade.',
    ],
    [0, 2],
    'Peserta olimpiade yang termasuk klub sains memperoleh akses. Premis tidak menyatakan bahwa semua peserta masuk klub atau bahwa semua pengguna lab peserta olimpiade.'
  ),
  choice(
    pu,
    7,
    'Sebuah survei kebiasaan membaca hanya disebarkan kepada pengunjung perpustakaan kota.',
    'Kelemahan utama bila hasilnya digunakan untuk menggambarkan semua penduduk adalah …',
    [
      'Jumlah buku tidak diketahui.',
      'Survei dilakukan di kota.',
      'Semua responden pasti berbohong.',
      'Sampel cenderung berisi orang yang memang mengunjungi perpustakaan.',
      'Membaca tidak dapat diteliti.',
    ],
    3,
    'Pemilihan sampel dapat menimbulkan bias karena penduduk yang tidak mengunjungi perpustakaan tidak terwakili.'
  ),
  choice(
    pu,
    8,
    'Kotak A lebih berat daripada B. Kotak C lebih ringan daripada B. Kotak D lebih berat daripada A.',
    'Urutan dari paling ringan adalah …',
    ['A, B, C, D', 'C, B, A, D', 'D, A, B, C', 'B, C, A, D', 'C, A, B, D'],
    1,
    'Dari informasi diperoleh C < B < A < D.'
  ),
];

const editing: Question[] = [
  choice(
    pbm,
    1,
    'Para siswa-siswa mengikuti kegiatan membaca bersama.',
    'Perbaikan agar kalimat efektif adalah …',
    [
      'Para siswa mengikuti kegiatan membaca bersama.',
      'Para siswa-siswa semuanya mengikuti.',
      'Siswa-siswa para mengikuti kegiatan.',
      'Para semua siswa-siswa membaca.',
      'Kegiatan para siswa-siswa mengikuti.',
    ],
    0,
    'Kata para sudah menunjukkan jamak, sehingga pengulangan siswa-siswa tidak diperlukan.'
  ),
  choice(
    pbm,
    2,
    'Sekolah mengadakan lokakarya. Kegiatan tersebut bertujuan meningkatkan keterampilan menulis siswa.',
    'Gabungan kalimat paling efektif adalah …',
    [
      'Sekolah mengadakan lokakarya untuk meningkatkan keterampilan menulis siswa.',
      'Sekolah untuk lokakarya siswa meningkatkan.',
      'Lokakarya sekolah mengadakan dan tujuan bertujuan.',
      'Sekolah mengadakan karena lokakarya.',
      'Keterampilan menulis sekolah mengadakan siswa.',
    ],
    0,
    'Keterangan tujuan dengan untuk menyatukan kedua informasi tanpa pengulangan.'
  ),
  choice(
    pbm,
    3,
    'Rina tetap berangkat ke perpustakaan … hujan turun cukup deras.',
    'Konjungsi yang sesuai adalah …',
    ['karena', 'sehingga', 'meskipun', 'agar', 'lalu'],
    2,
    'Hubungannya pertentangan: keberangkatan tetap terjadi walaupun hujan deras.'
  ),
  choice(
    pbm,
    4,
    'Kegiatan akan dilaksanakan pada hari senin di kota bandung.',
    'Penulisan huruf kapital yang tepat adalah …',
    [
      'hari senin di Kota bandung',
      'hari Senin di kota Bandung',
      'Hari senin di kota bandung',
      'hari SENIN di kota BANDUNG',
      'Hari Senin Di Kota Bandung',
    ],
    1,
    'Nama hari Senin dan nama kota Bandung diawali huruf kapital; kata umum hari dan kota di tengah kalimat tidak perlu kapital.'
  ),
  choice(
    pbm,
    5,
    '(1) Kebun sekolah dimanfaatkan sebagai ruang belajar. (2) Siswa mengamati pertumbuhan tanaman setiap pekan. (3) Pengamatan itu dicatat dalam jurnal. (4) Harga tiket pesawat naik menjelang libur.',
    'Kalimat yang tidak padu dengan paragraf adalah …',
    [
      'Kalimat (1)',
      'Kalimat (2)',
      'Kalimat (3)',
      'Kalimat (4)',
      'Semua kalimat padu',
    ],
    3,
    'Paragraf membahas pembelajaran di kebun; harga tiket pesawat tidak mendukung topik itu.'
  ),
  choice(
    pbm,
    6,
    'Pilih bentuk kata baku untuk melengkapi laporan kegiatan.',
    'Manakah semua kata yang penulisannya baku?',
    ['aktivitas', 'resiko', 'analisis', 'praktek', 'izin'],
    [0, 2, 4],
    'Bentuk baku adalah aktivitas, risiko, analisis, praktik, dan izin.'
  ),
  choice(
    pbm,
    7,
    'Program membaca membutuhkan kerja sama guru … orang tua.',
    'Kata penghubung yang menyatakan penambahan adalah …',
    ['tetapi', 'atau', 'karena', 'dan', 'meskipun'],
    3,
    'Guru dan orang tua merupakan dua pihak yang bersama-sama dibutuhkan; dan menyatakan penambahan.'
  ),
  choice(
    pbm,
    8,
    'Siswa meneliti kualitas air. Mereka membandingkan sampel dari tiga lokasi. Setelah itu, … menyusun laporan.',
    'Kata rujukan yang tepat mengisi bagian kosong adalah …',
    ['air', 'mereka', 'lokasi', 'itu', 'sampel'],
    1,
    'Mereka merujuk kepada siswa sebagai pelaku penelitian dan penyusunan laporan.'
  ),
];

const vocabulary: Question[] = [
  choice(
    ppu,
    1,
    'Taman kota menyediakan ruang bagi warga untuk berinteraksi tanpa harus membeli sesuatu.',
    'Makna berinteraksi dalam konteks tersebut adalah …',
    [
      'saling berhubungan',
      'saling menjauhi',
      'melakukan transaksi wajib',
      'menutup akses',
      'membeli barang',
    ],
    0,
    'Berinteraksi berarti melakukan hubungan timbal balik, misalnya berbincang atau berkegiatan bersama.'
  ),
  choice(
    ppu,
    2,
    'Program ini diharapkan menjadi katalis bagi tumbuhnya kebiasaan membaca.',
    'Kata katalis digunakan secara kiasan untuk menyatakan …',
    [
      'hambatan',
      'hasil akhir',
      'pendorong perubahan',
      'tempat penyimpanan',
      'alat ukur',
    ],
    2,
    'Dalam kalimat ini katalis berarti sesuatu yang mendorong atau mempercepat perubahan.'
  ),
  choice(
    ppu,
    3,
    'Warga mengusulkan solusi yang berkelanjutan, bukan perbaikan sesaat.',
    'Lawan makna berkelanjutan pada konteks tersebut adalah …',
    ['lestari', 'sementara', 'berkesinambungan', 'terencana', 'teratur'],
    1,
    'Kontras yang dinyatakan teks adalah berkelanjutan versus sesaat atau sementara.'
  ),
  choice(
    ppu,
    4,
    'Setiap kelompok menyampaikan argumen yang didukung data pengamatan.',
    'Argumen bermakna …',
    [
      'daftar hadir',
      'perintah tanpa alasan',
      'pendapat beserta alasan pendukung',
      'judul penelitian',
      'angka acak',
    ],
    2,
    'Argumen mengandung pendapat dan alasan yang mendukungnya; pada teks alasannya didukung data.'
  ),
  choice(
    ppu,
    5,
    'Pembangunan taman mempertimbangkan aksesibilitas agar semua warga dapat menggunakannya.',
    'Makna aksesibilitas yang paling sesuai adalah …',
    [
      'kemewahan fasilitas',
      'keindahan warna',
      'luas bangunan',
      'kemudahan menjangkau dan menggunakan',
      'jumlah pengunjung',
    ],
    3,
    'Aksesibilitas berhubungan dengan kemudahan akses, termasuk penggunaan oleh beragam warga.'
  ),
  choice(
    ppu,
    6,
    'Penggunaan energi di gedung itu lebih efisien setelah lampu diganti.',
    'Efisien dalam konteks ini berarti …',
    [
      'menghasilkan manfaat dengan penggunaan sumber daya lebih hemat',
      'selalu memakai teknologi termahal',
      'menggunakan lebih banyak energi',
      'menghilangkan semua biaya',
      'mengurangi semua kegiatan',
    ],
    0,
    'Efisien menekankan pencapaian manfaat dengan penggunaan sumber daya yang lebih hemat, bukan tanpa biaya sama sekali.'
  ),
  choice(
    ppu,
    7,
    'Data yang transparan membantu warga memahami alasan suatu keputusan.',
    'Kata yang dekat maknanya dengan transparan adalah …',
    ['tertutup', 'terbuka', 'rumit', 'rahasia', 'kabur'],
    1,
    'Transparan pada konteks data berarti terbuka dan dapat diketahui, bukan tersembunyi.'
  ),
  choice(
    ppu,
    8,
    'Peneliti mengevaluasi program untuk mengetahui bagian yang perlu diperbaiki.',
    'Tujuan evaluasi dalam kalimat tersebut adalah …',
    [
      'menghapus semua hasil',
      'menghindari pengamatan',
      'menetapkan pemenang',
      'menilai pelaksanaan untuk perbaikan',
      'mengulang judul program',
    ],
    3,
    'Evaluasi adalah penilaian yang menjadi dasar mengetahui kekurangan dan menyusun perbaikan.'
  ),
];

const indoPassage =
  'Perpustakaan sekolah membuka layanan peminjaman hingga sore dua hari dalam sepekan. Dalam uji coba empat pekan, peminjaman meningkat dari rata-rata 40 menjadi 55 buku per pekan. Pustakawan juga menyelenggarakan diskusi buku selama masa uji coba. Ia mengingatkan bahwa kenaikan tersebut belum membuktikan pengaruh perpanjangan jam layanan saja. Sekolah akan mengumpulkan umpan balik sebelum menetapkan kebijakan tetap.';
const gardenPassage =
  'Warga mengubah lahan kosong menjadi kebun bersama. Hasil panen dibagi kepada anggota yang merawat kebun dan sebagian disumbangkan ke dapur komunitas. Kendala utamanya adalah pasokan air pada musim kering. Karena itu, warga merencanakan penampungan air hujan dan jadwal penyiraman bergilir. Mereka ingin kebun tetap berjalan tanpa membebani satu orang saja.';
const reading: Question[] = [
  choice(
    li,
    1,
    indoPassage,
    'Gagasan utama teks tersebut adalah …',
    [
      'Perpustakaan tidak lagi meminjamkan buku.',
      'Uji coba perluasan layanan perpustakaan dan evaluasinya.',
      'Diskusi buku harus dihentikan.',
      'Semua siswa hanya membaca sore hari.',
      'Sekolah menutup perpustakaan.',
    ],
    1,
    'Teks berfokus pada uji coba jam layanan, perubahan peminjaman, dan rencana evaluasi kebijakan.'
  ),
  choice(
    li,
    2,
    indoPassage,
    'Mengapa kenaikan peminjaman belum dapat dikaitkan dengan jam layanan saja?',
    [
      'Tidak ada buku yang dipinjam.',
      'Uji coba berlangsung setahun.',
      'Ada diskusi buku yang berlangsung bersamaan.',
      'Pustakawan tidak mengamati perubahan.',
      'Jam layanan justru dipersingkat.',
    ],
    2,
    'Diskusi buku adalah faktor lain yang dapat ikut memengaruhi minat peminjaman selama periode yang sama.'
  ),
  choice(
    li,
    3,
    indoPassage,
    'Pilih semua informasi yang secara eksplisit tercantum dalam teks.',
    [
      'Uji coba berlangsung empat pekan.',
      'Peminjaman naik menjadi rata-rata 55 buku per pekan.',
      'Kebijakan sudah ditetapkan permanen.',
      'Layanan hingga sore tersedia setiap hari.',
      'Sekolah akan mengumpulkan umpan balik.',
    ],
    [0, 1, 4],
    'Teks menyatakan empat pekan, rata-rata 55 buku, dan rencana umpan balik. Layanan sore hanya dua hari; kebijakan tetap belum ditetapkan.'
  ),
  choice(
    li,
    4,
    indoPassage,
    'Sikap pustakawan terhadap hasil uji coba dapat digambarkan sebagai …',
    [
      'menolak semua data',
      'terburu-buru',
      'tidak peduli',
      'hati-hati dalam menarik kesimpulan',
      'yakin hanya ada satu penyebab',
    ],
    3,
    'Pustakawan mengakui peningkatan tetapi tidak menyimpulkan satu penyebab sebelum evaluasi lebih lanjut.'
  ),
  choice(
    li,
    5,
    gardenPassage,
    'Masalah utama yang dihadapi kebun bersama adalah …',
    [
      'tidak ada anggota',
      'kekurangan air pada musim kering',
      'hasil panen selalu dibuang',
      'tidak tersedia lahan',
      'semua anggota menolak menyiram',
    ],
    1,
    'Kendala utama yang dinyatakan langsung dalam teks adalah pasokan air pada musim kering.'
  ),
  choice(
    li,
    6,
    gardenPassage,
    'Jadwal penyiraman bergilir terutama bertujuan untuk …',
    [
      'membagi tanggung jawab perawatan',
      'mengurangi jumlah warga',
      'menghentikan panen',
      'menjual lahan',
      'mencegah penggunaan air hujan',
    ],
    0,
    'Teks menekankan agar keberlangsungan kebun tidak membebani satu orang saja.'
  ),
  choice(
    li,
    7,
    gardenPassage,
    'Simpulan yang paling didukung isi teks adalah …',
    [
      'Kebun selalu menghasilkan keuntungan finansial.',
      'Penampungan air sudah selesai dibangun.',
      'Kerja sama dan pengelolaan sumber daya penting bagi kebun.',
      'Hanya satu orang merawat seluruh kebun.',
      'Seluruh hasil panen dijual.',
    ],
    2,
    'Pembagian tugas dan rencana pengelolaan air menunjukkan pentingnya kerja sama serta sumber daya; klaim lainnya tidak dinyatakan.'
  ),
  {
    id: 'demo-literasi_indonesia-8',
    subtestId: li,
    number: 8,
    type: 'essay',
    stimulus: gardenPassage,
    question:
      'Tuliskan pendapat 100–150 kata tentang cara menjaga kebun bersama tetap berjalan. Gunakan informasi dalam teks dan berikan satu saran konkret.',
    correctAnswer: 'rubric_graded',
    explanation:
      'Penilaian manual: kesesuaian dengan teks 30%, alasan dan saran 40%, serta organisasi dan kejelasan bahasa 30%.',
    rubricGuide:
      'Kesesuaian teks (0–30): memahami kendala air dan kerja sama. Alasan dan saran (0–40): usulan konkret dengan alasan. Bahasa dan struktur (0–30): runtut dan mudah dipahami.',
    maxScore: 100,
    difficulty: 'Sukar',
  },
];

const englishPassage =
  'A school introduced a bicycle-sharing scheme for short trips between its buildings. During the first month, students reported shorter travel times. However, some bicycles were often left outside designated parking areas. The school added clearer signs and asked users to return bicycles to marked spaces. It plans to review the scheme after another month before deciding whether to expand it.';
const sciencePassage =
  'Urban trees provide shade and can reduce the heat absorbed by roads and buildings. Their benefits depend partly on tree species, location, and maintenance. Planting many trees without planning for water and root space may lead to poor survival. For this reason, city planners should consider long-term care as well as the number of trees planted.';
const english: Question[] = [
  choice(
    en,
    1,
    englishPassage,
    'What is the main topic of the passage?',
    [
      'A school bicycle-sharing scheme and its evaluation.',
      'The history of bicycle manufacturing.',
      'A ban on short trips.',
      'The closure of school buildings.',
      'A national traffic law.',
    ],
    0,
    'The passage introduces the scheme, reports initial outcomes, describes a problem, and outlines evaluation.'
  ),
  choice(
    en,
    2,
    englishPassage,
    'Why did the school add clearer signs?',
    [
      'To increase bicycle prices.',
      'To close the parking areas.',
      'To help users return bicycles to designated spaces.',
      'To stop students travelling.',
      'To announce a new building.',
    ],
    2,
    'The signs address bicycles being left outside designated parking areas.'
  ),
  choice(
    en,
    3,
    englishPassage,
    'The word expand most nearly means …',
    ['cancel', 'repair', 'hide', 'make larger', 'measure'],
    3,
    'Expanding the scheme means increasing its scale or coverage.'
  ),
  choice(
    en,
    4,
    englishPassage,
    'Which statements are supported by the passage? Select all that apply.',
    [
      'Students reported shorter travel times.',
      'The scheme has already expanded nationwide.',
      'Parking was an issue during the first month.',
      'The school plans another review.',
      'Every student owns a bicycle.',
    ],
    [0, 2, 3],
    'Shorter travel times, a parking issue, and a planned review are explicit. Nationwide expansion and universal ownership are not stated.'
  ),
  choice(
    en,
    5,
    sciencePassage,
    'What does the author recommend?',
    [
      'Counting trees is the only important task.',
      'Planning for both planting and long-term care.',
      'Removing all trees from roads.',
      'Using the same species everywhere.',
      'Avoiding shade in cities.',
    ],
    1,
    'The final sentence recommends considering long-term care as well as planting numbers.'
  ),
  choice(
    en,
    6,
    sciencePassage,
    'According to the passage, poor survival may result from …',
    [
      'providing root space',
      'careful maintenance',
      'a lack of planning for water and root space',
      'choosing suitable locations',
      'reviewing species',
    ],
    2,
    'The passage directly links poor survival to insufficient planning for water and root space.'
  ),
  choice(
    en,
    7,
    sciencePassage,
    'The tone of the passage is best described as …',
    [
      'informative and advisory',
      'angry and accusatory',
      'humorous and fictional',
      'celebratory without qualification',
      'indifferent',
    ],
    0,
    'It explains benefits and limitations, then offers a practical recommendation.'
  ),
  choice(
    en,
    8,
    sciencePassage,
    'Which title best reflects the passage?',
    [
      'Why Roads Need More Heat',
      'The End of Urban Planning',
      'Trees Never Need Water',
      'Beyond Planting: Caring for Urban Trees',
      'Counting Buildings in Cities',
    ],
    3,
    'The passage stresses that tree planting must be accompanied by suitable planning and ongoing care.'
  ),
];

const mathematics: Question[] = [];
for (let i = 0; i < 4; i++) {
  const pk: SubtestId = 'pengetahuan_kuantitatif';
  const pm: SubtestId = 'penalaran_matematika';
  const a = i + 3,
    b = i + 2,
    x = i + 5,
    n = i * 4;
  mathematics.push(
    numeric(
      pk,
      n + 1,
      `Diketahui persamaan $${a}x + ${b} = ${a * x + b}$.`,
      'Nilai $x$ adalah …',
      x,
      `Kurangi kedua ruas dengan ${b}, lalu bagi ${a}. Diperoleh $x=${x}$.`
    ),
    numeric(
      pk,
      n + 2,
      `Barisan aritmetika memiliki suku pertama $${a}$ dan beda $${b}$.`,
      'Nilai suku ke-8 adalah …',
      a + 7 * b,
      `$U_8=a+7b=${a}+7(${b})=${a + 7 * b}$.`
    ),
    numeric(
      pk,
      n + 3,
      `Data pengamatan: $${x}, ${x + 2}, ${x + 4}, ${x + 6}, ${x + 8}$.`,
      'Rata-rata data tersebut adalah …',
      x + 4,
      `Jumlah kelima data adalah ${5 * (x + 4)}. Rata-ratanya ${5 * (x + 4)} dibagi 5, yaitu ${x + 4}.`
    ),
    numeric(
      pk,
      n + 4,
      `Diberikan fungsi $f(x)=${a}x-${b}$.`,
      'Tentukan $f(6)$.',
      a * 6 - b,
      `Substitusi $x=6$: $f(6)=${a}(6)-${b}=${a * 6 - b}$.`
    ),
    numeric(
      pm,
      n + 1,
      `Sebuah taman berbentuk persegi panjang memiliki panjang ${10 + i * 2} meter dan lebar ${6 + i} meter.`,
      'Berapakah luas taman dalam meter persegi?',
      (10 + i * 2) * (6 + i),
      `Luas persegi panjang = panjang × lebar = ${(10 + i * 2) * (6 + i)} meter persegi.`
    ),
    numeric(
      pm,
      n + 2,
      `Harga sebuah buku Rp${20000 + i * 5000}. Toko memberi diskon 20% tanpa biaya tambahan.`,
      'Berapa harga setelah diskon dalam ribuan rupiah?',
      ((20000 + i * 5000) * 0.8) / 1000,
      `Pembeli membayar 80% harga awal, yaitu Rp${(20000 + i * 5000) * 0.8}. Dalam ribuan rupiah: ${((20000 + i * 5000) * 0.8) / 1000}.`
    ),
    numeric(
      pm,
      n + 3,
      `Paket transportasi mengenakan biaya awal ${8 + i} ribu rupiah dan ${2 + i} ribu rupiah per kilometer.`,
      'Berapa biaya perjalanan 5 kilometer dalam ribuan rupiah?',
      8 + i + (2 + i) * 5,
      `Biaya = biaya awal + 5 × tarif per kilometer = ${8 + i} + 5(${2 + i}) = ${8 + i + (2 + i) * 5} ribu rupiah.`
    ),
    numeric(
      pm,
      n + 4,
      `Sebuah kelas mengumpulkan ${120 + i * 40} botol bekas. Sebanyak 25% diserahkan ke kelompok lain.`,
      'Berapa botol yang masih dimiliki kelas?',
      (120 + i * 40) * 0.75,
      `Bagian yang tersisa 75%, sehingga jumlahnya $0{,}75 \\times ${120 + i * 40}=${(120 + i * 40) * 0.75}$.`
    )
  );
}

export const DEMO_QUESTIONS: Question[] = [
  ...reasoning,
  ...mathematics,
  ...editing,
  ...vocabulary,
  ...reading,
  ...english,
];
