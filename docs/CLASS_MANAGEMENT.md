# Uji kelas, ruang, tentor, dan jadwal

Buka `/admin/classes`, lalu gunakan **Tambah kelas** atau **Ubah kelas** pada kartu.
Kuota cepat tetap dapat diubah melalui **Ubah kuota**. Data disimpan pada
LocalStorage `euclide_batches`, bukan PostgreSQL.

## Skenario manual

1. Tambah kelas dengan nama baru, program, kuota, dan dua sesi mingguan pada hari
   yang sama dengan jam, ruang, serta tentor berbeda. Simpan: kelas muncul dengan nol siswa, jadwal terbaca, dan jumlah
   kelas/kursi pada dashboard ikut berubah. Refresh: data tetap ada.
2. Ubah ruang, tentor, hari/jam pada masing-masing sesi, serta status dan kuota kelas. ID kelas dan jumlah siswa
   terdaftar harus tetap sama. Menyimpan mengosongkan filter pencarian agar hasil
   perubahan dapat ditemukan. Membatalkan tidak mengubah kelas.
3. Coba kuota di bawah jumlah siswa, nama duplikat, jam selesai sebelum mulai,
   dan dua sesi yang bertumpuk. Penyimpanan ditolak dengan pesan penjelasan.
4. Buat dua kelas pada hari/jam sama dengan ruang atau tentor sesi yang sama. Tolak konflik.
   Jam yang bersambung tepat, ruang/tentor berbeda, dan kelas berstatus selesai
   tidak menghasilkan konflik lintas kelas.
5. Ubah kelas lama: jadwal teks yang dikenali disusun menjadi sesi tanpa menghapus
   data lama ketika batal. Jadwal yang tidak dikenali ditampilkan untuk disusun
   ulang sebelum menyimpan.
6. Uji di HP dan desktop: input 16px, kontrol dapat digulir saat keyboard terbuka,
   tambah/hapus sesi, Tab/Shift+Tab, Escape, tombol Batal dan Tutup. Tidak ada
   navigasi di balik modal yang bisa diaktifkan selama formulir terbuka.
7. Buka pilihan ruang/tentor: daftar putih mengikuti desain aplikasi, opsi aktif
   memiliki tanda centang, dan teks ketikan memfilter saran. Coba nama baru,
   klik pilihan, panah atas/bawah lalu Enter, Tab, serta Escape saat daftar terbuka.
   Enter saat komposisi IME tidak memilih atau menyimpan. Daftar melayang lewat
   Popover API dan CSS anchor positioning, tanpa mendorong formulir. Posisi dapat
   dibalik ketika ruang layar tidak cukup. Browser tanpa anchor positioning
   memakai panel melayang di bawah layar; tanpa Popover API panel CSS tetap
   berada di dalam dialog. Uji juga buka/tutup, scroll, batas layar dan keyboard HP.

Skenario di atas belum diklaim telah dijalankan melalui browser. Uji unit mencakup
parsing jadwal lama, validasi jam/kuota, duplikasi nama, dan konflik mingguan.

## Batas saat ini

- Ruang dan tentor adalah nama dengan saran dari kelas yang sudah ada. Ini belum
  master ruang bertanda ID atau pembuatan akun tentor. Pemeriksaan konflik memakai
  kecocokan nama per sesi setelah normalisasi spasi/huruf besar, bukan identitas akun.
- Setiap sesi menyimpan hari, jam mulai/selesai, ruang, dan tentornya sendiri.
  Satu kelas dapat memiliki beberapa sesi per hari dengan sumber daya berbeda.
  Sesi berulang setiap minggu dalam WIB. Belum ada rentang tanggal, hari libur, pergantian pengajar khusus tanggal tertentu,
  atau sesi lintas tengah malam.
- Jadwal lama yang tidak bisa dibaca belum dapat diperiksa bentroknya. Saat
  backend dibuat, jadwal dan sumber daya perlu dinormalisasi serta divalidasi
  kembali secara transaksional di server. Penyimpanan browser bukan pengendalian
  kuota atau bentrok untuk banyak admin sekaligus.

Jadwal lama yang hanya memiliki ruang/tentor pada kelas tetap dibaca dengan
mengisi sumber daya tersebut ke tiap sesi. Saat disimpan, sesi menjadi sumber
utama; field ruang/tentor tingkat kelas hanya ringkasan untuk kompatibilitas
dengan pencarian dan tampilan lama. Data lama tidak dihapus saat membuka form.
