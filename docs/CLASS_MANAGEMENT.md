# Uji kelas, ruang, tentor, dan jadwal

Buka `/admin/classes`, lalu gunakan **Tambah kelas** atau **Ubah kelas** pada kartu.
Kuota cepat tetap dapat diubah melalui **Ubah kuota**. Data disimpan pada
LocalStorage `euclide_batches`, bukan PostgreSQL.

## Skenario manual

1. Tambah kelas dengan nama baru, program, ruang, tentor, kuota, dan dua sesi
   mingguan. Simpan: kelas muncul dengan nol siswa, jadwal terbaca, dan jumlah
   kelas/kursi pada dashboard ikut berubah. Refresh: data tetap ada.
2. Ubah ruang, tentor, hari/jam, status, serta kuota. ID kelas dan jumlah siswa
   terdaftar harus tetap sama. Menyimpan mengosongkan filter pencarian agar hasil
   perubahan dapat ditemukan. Membatalkan tidak mengubah kelas.
3. Coba kuota di bawah jumlah siswa, nama duplikat, jam selesai sebelum mulai,
   dan dua sesi yang bertumpuk. Penyimpanan ditolak dengan pesan penjelasan.
4. Buat dua kelas pada hari/jam sama dengan ruang atau tentor sama. Tolak konflik.
   Jam yang bersambung tepat, ruang/tentor berbeda, dan kelas berstatus selesai
   tidak menghasilkan konflik lintas kelas.
5. Ubah kelas lama: jadwal teks yang dikenali disusun menjadi sesi tanpa menghapus
   data lama ketika batal. Jadwal yang tidak dikenali ditampilkan untuk disusun
   ulang sebelum menyimpan.
6. Uji di HP dan desktop: input 16px, kontrol dapat digulir saat keyboard terbuka,
   tambah/hapus sesi, Tab/Shift+Tab, Escape, tombol Batal dan Tutup. Tidak ada
   navigasi di balik modal yang bisa diaktifkan selama formulir terbuka.

Skenario di atas belum diklaim telah dijalankan melalui browser. Uji unit mencakup
parsing jadwal lama, validasi jam/kuota, duplikasi nama, dan konflik mingguan.

## Batas saat ini

- Ruang dan tentor adalah nama dengan saran dari kelas yang sudah ada. Ini belum
  master ruang bertanda ID atau pembuatan akun tentor. Pemeriksaan konflik memakai
  kecocokan nama setelah normalisasi spasi/huruf besar, bukan identitas akun.
- Semua sesi satu kelas menggunakan ruang/tentor yang sama dan berulang setiap
  minggu, dalam WIB. Belum ada rentang tanggal, hari libur, pergantian pengajar,
  atau sesi lintas tengah malam.
- Jadwal lama yang tidak bisa dibaca belum dapat diperiksa bentroknya. Saat
  backend dibuat, jadwal dan sumber daya perlu dinormalisasi serta divalidasi
  kembali secara transaksional di server. Penyimpanan browser bukan pengendalian
  kuota atau bentrok untuk banyak admin sekaligus.
