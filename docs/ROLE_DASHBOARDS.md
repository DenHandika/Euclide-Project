# Dashboard per peran dan analisis individu

## Halaman

- `/dashboard`: beranda siswa, hasil dan prioritas latihan miliknya, tautan
  melanjutkan sesi, serta pilihan paket dengan pagination.
- `/tentor`: antrean esai, jumlah hasil yang tersedia dan fokus pendampingan
  per siswa. Tautan profil membuka `/tentor/analytics?student=<id>`.
- `/admin`: ringkasan operasional, angka pembayaran dan tindak lanjut yang
  bersumber dari catatan aplikasi. Perhitungan pembayaran tetap seluruh periode.
- `/tentor/analytics`: Ringkasan kelas / Per siswa; filter kelas dan pemilih
  siswa. Tidak menampilkan skor siswa lain untuk mengisi profil yang kosong.

Menu desktop, navigasi HP, logo halaman internal dan akses cepat login diarahkan
ke dashboard perannya. Landing publik `/` tetap terpisah.

## Dasar analisis

Analisis mengambil `examResults` yang tersedia, bukan fallback `getExamResult`
yang dapat menghasilkan salinan skor contoh untuk pengguna yang belum punya hasil.
`learningAnalytics.ts` melakukan pemilihan hasil berdasarkan identitas siswa,
urutan tanggal Indonesia/ISO, normalisasi skor subtes ke 1000 dan rerata kelas.
Rerata kelas memakai satu hasil terbaru per siswa; penyebut tiap subtes hanya
siswa yang memiliki rincian skor subtes tersebut. Nilai nol tetap nol.

Prioritas adalah dua subtes dengan skor relatif paling rendah. Saran aktivitas
bersifat latihan awal sesuai subtes, bukan diagnosis topik rinci atau penentuan
kecocokan jurusan. Tentor tetap meninjau jawaban untuk menyesuaikan materi.

Penyimpanan hasil frontend memakai kunci siswa + paket. Data lama dengan kunci
paket saja dipindahkan saat paket tersebut menerima hasil baru, tanpa menimpa
hasil pemilik sebelumnya. Ini menjaga hasil antarsiswa pada browser yang sama;
bukan implementasi database atau pengamanan akses server.

## Arah visual dan Delivery Gate

Antislop During; ENERGY 2 / RHYTHM 2 / MOTION 1. Identitas tetap navy Euclide,
putih dan slate. Satu bidang navy menjadi pusat perhatian untuk tindakan utama;
panel pendukung menampung data atau pekerjaan nyata, tanpa emoji, sparkle,
blob, ornamen berputar, atau klaim statistik nasional yang tidak bersumber.

- PASS R-04/R-31: koreksi esai menggunakan judul pekerjaan langsung. Emoji
  lambaian tangan dan sapaan cerita dihapus, bukan diganti ikon dekoratif lain.
- PASS R-17/R-38: jumlah siswa, antrean, skor dan agregat mengikuti data tersedia;
  tidak memakai angka tetap 642 peserta atau rerata angkatan 718,4.
- PASS C-3/R-20: siswa berfokus pada langkah belajar, tentor pada penilaian dan
  pendampingan, admin pada operasi. Tindakan memiliki route yang tersedia.
- PASS R-03 (kode): area kerja siswa, katalog, hasil, latihan, persiapan dan CBT
  memakai lebar tersedia. Bacaan dibatasi per blok dengan max-w-prose; pada
  desktop stimulus dan jawaban dapat berdampingan, pada HP tetap berurutan.
- PASS responsive-design (kode): LearningProfile memakai named container query
  untuk dua kolom berdasarkan ruang parent, dengan fallback satu kolom. Judul
  workspace memakai clamp rem + vw, tanpa ukuran teks vw murni.
- PASS R-25 (perhitungan sRGB): putih/navy 9,49:1; teks pendukung hero/navy
  7,09:1; slate-600/putih 7,58:1; progress/track 7,70:1.
- PASS R-39 (kode): select memiliki label, tombol memiliki type dan status,
  progress memiliki nama dan angka teks, riwayat memiliki caption/scope dan
  wrapper gulir keyboard. Tidak menambahkan dependensi atau aset gambar.
- PASS teknis: TypeScript dan 12 tes data, pagination, analisis serta penyimpanan
  hasil per siswa. Build produksi juga diperiksa; tujuh route/CSS memberi HTTP 200.

## Batas verifikasi

UI belum terhubung penuh ke API PostgreSQL. Skor dari mesin frontend masih
mengikuti perilaku prototipe yang dicatat pada K-05 panduan UAT. Penghitungan
hasil ujian produksi, mapping kelas yang boleh dilihat tentor dan otorisasi
server belum diselesaikan oleh penambahan dashboard ini. Data lama yang sudah
tertimpa sebelum perubahan tidak dapat direkonstruksi dari browser.

Uji unit dan respons HTTP tidak membuktikan seluruh kontrol telah diklik atau
layout terverifikasi di HP. Jalankan FE-49–53 pada panduan UAT. Hasil visual
320/390/768/1440/1920px, zoom 200%, fokus keyboard dan pembaca layar belum
diklaim lulus. Perubahan belum dipublikasikan.
