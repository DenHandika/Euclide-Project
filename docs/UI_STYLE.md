# Acuan visual Euclide

Halaman baru dan dialog mengikuti arah visual halaman koreksi esai serta kelas.
Tujuan: platform belajar yang mudah dibaca siswa, pengajar, dan admin di desktop/HP.

- Font sans-serif untuk judul, label, tabel, dan formulir. Monospace dibatasi
  pada konten teknis yang memerlukannya, misalnya teks format impor dan timer.
- Latar halaman abu-biru muda; permukaan putih, garis slate tipis, serta aksen
  navy lembut. Hindari bingkai navy tegas di setiap elemen.
- Panel memakai radius sekitar 16–24px; dialog 24px; tombol/input sekitar12px;
  badge dan progress membulat. Sudut cetak kuitansi boleh tetap lurus.
- Tombol dan input umumnya setinggi minimal44px. Tombol simbol rumus dibuat
  ringkas tetapi tetap memiliki area sentuh minimal36px. Fokus keyboard terlihat.
- Status tetap memiliki teks; warna bukan satu-satunya penanda. Tabel dan
  pemisah baris tetap digunakan saat membantu pembacaan data.
- Gunakan `StatusBadge` dari `src/components/common/StatusBadge.tsx` untuk
  penanda status, atau `AccountStatusBadge` untuk status akun siswa. Badge
  memiliki ikon, warna lembut, tinggi konsisten, dan teks satu baris. Hindari
  mendefinisikan ulang badge lewat span dengan ukuran/padding berbeda-beda.
- Halaman pengelolaan memakai lebar layar dengan padding20–32px, termasuk
  navigasinya. Tabel menjaga kode/nomor telepon satu baris; pada layar kecil
  daftar siswa berubah menjadi kartu. Landing publik tetap memiliki batas
  lebar agar teks pengenalan nyaman dibaca.
- Perubahan visual tidak mengubah data contoh, validasi, atau alur bisnis.
- Daftar data memakai `usePagination` dan komponen `Pagination` bersama.
  Pencarian/filter dijalankan sebelum pembagian halaman, perubahan filter/ukuran
  halaman kembali ke halaman pertama, dan nomor urut memakai offset halaman.
  Ringkasan jumlah/validasi impor tetap berdasarkan seluruh data. Tampilan HP
  menyederhanakan kontrol nomor menjadi sebelumnya/berikutnya dan halaman aktif.

Penyelarasan mencakup siswa, bank soal, pembayaran/kasir, dialog impor siswa/soal,
toolbar rumus, kuitansi layar, notifikasi, pemilih peran demo, latihan soal,
ringkasan admin, analisis tentor, dan halaman hasil. Halaman kelas dan koreksi
sudah lebih dahulu diperbarui. Tetap lakukan UAT pada HP serta buka dialognya;
berhasil memuat halaman tidak membuktikan seluruh interaksi visual sudah diuji.
