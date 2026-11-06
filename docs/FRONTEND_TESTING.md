# Uji frontend dengan data contoh

Untuk pengujian berurutan dengan langkah, hasil yang diharapkan, dan kolom
status, gunakan [UAT_FRONTEND.md](UAT_FRONTEND.md). Mulai dari jalur cepat di bagian 2.

Fokus saat ini: mencoba UI sebelum integrasi backend/database dilanjutkan.
Data asli siswa tidak diperlukan. Bank memuat **80 soal** pada tujuh subtes,
dengan pilihan ganda, pilihan jamak, isian singkat, dan essay. Konten latihan
ditulis untuk demo, bukan soal resmi SNBT atau paket ujian terkalibrasi.

| Paket | Soal | Menit |
|---|---:|---:|
| Coba CBT (tujuh subtes, lima soal per subtes, empat tipe soal) | 35 | 35 |
| UTBK-SNBT Seri 1 | 42 | 42 |
| UTBK-SNBT Seri 2 | 35 | 35 |
| TPS lengkap | 24 | 24 |
| Penalaran & Kuantitatif | 16 | 16 |
| Literasi Indonesia & English | 16 | 16 |
| Penalaran Umum | 9 | 9 |
| PBM & PPU | 16 | 16 |
| Matematika Kontekstual | 12 | 12 |

Durasi disederhanakan untuk pengujian. Seri berbeda dapat memakai sebagian
soal bank yang sama; ini bukan janji paket soal independen untuk ujian resmi.

1. Jalankan `npm run dev:local`, buka `/login` dan gunakan peran demo Siswa.
2. Di `/tryouts`, coba pencarian judul dan filter kategori. Kartu harus mengikuti
   judul, jumlah, subtes, dan durasi aktual setiap paket.
3. Mulai dari **Coba CBT · 35 soal, 35 menit** (lima soal dan lima menit per subtes). Pilih prodi, konfirmasi, lalu coba
   pilihan ganda, checkbox, isian, essay, tandai ragu, dan palet nomor.
4. Coba paket Seri 1 untuk banyak nomor dalam satu subtes serta teks/rumus panjang.
5. Di `/drilling`, pindah ke tujuh subtes; setiap subtes sekarang memiliki soal.
6. Di `/admin/questions`, cari soal `demo-...` dan coba edit soal. Bank demo baru
   digabungkan dengan soal tersimpan tanpa menghapus edit/custom di LocalStorage.

Penilaian/riwayat hasil, timer, dan autosave masih mengikuti implementasi demo
frontend; hasil belum dihitung oleh integrasi server. Paket yang sudah pernah
diselesaikan membuka hasil; pilih paket baru atau gunakan tombol ulangi pada hasil.
Perubahan jumlah soal tidak mereset sesi atau menghapus LocalStorage secara otomatis.

Validasi data: `npm run test:demo`. Pengujian meliputi kunci opsi, perhitungan
numerik, cakupan tipe/subtes, serta konsistensi jumlah soal dan durasi paket.
