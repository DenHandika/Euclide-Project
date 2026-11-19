# Penerapan panduan UI pada ringkasan admin

Lingkup: `/admin`, stylesheet tabel yang diberi prefix `overview-`, serta dialog
kuitansi bersama yang dibuka dari ringkasan dan halaman pembayaran. Mode
antislop During melanjutkan pilihan pengguna pada sesi ini.

## Arah visual

Mengikuti `UI_STYLE.md`: navy, putih dan slate; sans-serif; radius panel 16px,
tombol 8–12px. ENERGY 1 / RHYTHM 1 / MOTION 1. Admin perlu membandingkan kursi
kelas dan membaca catatan pembayaran. Kedua daftar menjadi isi utama; angka
pendukung berbentuk definition list tanpa empat kartu metrik yang identik.
Biru menandai tindakan; tidak ada sparkle, indikator live atau animasi berulang.

## Delivery gate: pemeriksaan kode

- PASS, Hard Gate R-17/R-38: hapus angka tetap 650, nominal fallback dan klaim
  live/terverifikasi. Hitungan siswa aktif memakai status; total pembayaran memakai
  catatan sesuai status. Nilai nol tetap nol. Label Mode demo di UI kemudian
  dihapus atas instruksi eksplisit pengguna; batas data tetap tercatat di dokumen.
- PASS, Purpose Gate R-12/R-31: tidak ada shadow berlapis pada ringkasan.
  Tabel dipertahankan untuk perbandingan lintas baris; scroll dibatasi ke wrapper
  agar lebar tabel tidak menjadi lebar halaman. Tidak ada dependensi baru.
- PASS, Liveliness: arah dan dials mengikuti acuan Euclide di atas; judul kelas,
  pemisah baris dan angka tabular memberikan hierarki baca tanpa ikon dekoratif.
- PASS, Semantik R-32/R-39 (kode): table/caption/th scope, wrapper region bernama
  yang dapat difokuskan, sticky header/baris, petunjuk gulir, link/tombol native,
  progress native dengan label. Padding menyesuaikan lebar container; overflow
  tetap berfungsi jika container query tidak diterapkan.
- PASS, Dialog (kode): showModal, nama dialog terhubung, tombol tutup bernama,
  Escape ditangani melalui cancel; browser mengatur modal/inert tanpa focus trap
  buatan. Cleanup mengembalikan body scroll dan fokus ke pemicu yang masih ada.
  Kuitansi ringkasan hanya tersedia bagi transaksi lunas. Alamat palsu dan klaim
  legal/validasi elektronik dihapus dari pratinjau demo.
- PASS, Kontras (perhitungan sRGB): teks utama di putih 17,85:1; slate-600 di
  putih 7,58:1; header tabel 9,45:1; navy di putih 9,49:1; link hover 8,29:1;
  tombol cetak 7,30:1. Fokus outline menggunakan navy dan tetap terlihat pada
  Forced Colors Mode karena memakai outline, bukan hanya box-shadow.
- PASS, Teknis: pemeriksaan TypeScript dengan noUncheckedSideEffectImports,
  build produksi Next.js, tujuh tes data/pagination, dan diff whitespace.

## Delivery gate perangkat: belum diverifikasi

Host akses browser otomatis tidak tersedia. Pemeriksaan kode di atas tidak
membuktikan reflow, pembaca layar, interaksi dialog ataupun hasil cetak. Ini
perubahan lokal untuk ditinjau; belum di-commit, di-push, atau dinyatakan lulus UAT.

1. Buka `/admin` pada lebar 320, 390, 768 dan 1440px. Gulir tabel, bukan halaman;
   pastikan header dan identitas baris tetap membantu membaca. Ulangi zoom 200%.
2. Dengan Tab, fokuskan kedua tabel lalu gunakan panah untuk menggulir. Periksa
   fokus terlihat dan tombol/link termasuk pagination bisa dipakai dengan Enter.
3. Buka kuitansi, Tab/Shift+Tab di dalamnya, lalu Escape. Fokus kembali ke tombol
   kuitansi, halaman belakang tidak dapat dioperasikan selama dialog terbuka.
4. Cetak dan batalkan print preview; konten kuitansi utuh, aksi navigasi tidak
   ikut tercetak, dialog tetap dapat ditutup setelah preview dibatalkan.
5. Pastikan 28/30 kursi menampilkan dua kursi tersedia; 25/25 menyatakan penuh.
   Periksa halaman pagination berikutnya dan ukuran halaman.
6. Pada profil browser khusus pengujian, uji array siswa/kelas/pembayaran kosong
   dan total nol; pastikan tidak muncul angka pengganti. Jangan menghapus data
   browser pengguna utama untuk menjalankan skenario ini.
7. Periksa NVDA/Firefox atau TalkBack/Chrome: nama tabel, header kolom/baris,
   progress, nama tombol kuitansi dan judul dialog diumumkan sesuai konteks.

## Panduan yang digunakan

- `responsive-table`: header dan row header sticky, wrapper bernama yang dapat
  difokuskan, serta container query. Layout tetap tabel bergulir pada HP untuk
  mempertahankan perbandingan; tidak menyembunyikan kolom atau header tabel.
- `accessibility`: scope/caption, native dialog, label kontrol, fokus outline dan
  pemulihan fokus. Tidak menambahkan keyboard handler pada tombol native.
