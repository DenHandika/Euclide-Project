# Prioritas pengembangan Euclide

Prioritas utama: **tryout benar-benar bisa dipakai terlebih dahulu**, kemudian
digitalisasi bisnis bimbel. Target tetap aplikasi operasional dengan data nyata,
bukan berhenti pada prototipe. Pengembangan dan pengujian dimulai di lokal;
repository dan desain yang sudah ada tetap digunakan.
Pemilihan hosting, perbandingan harga penyedia, dan integrasi payment gateway
ditunda. Pencatatan pembayaran manual tetap bagian operasional bimbel.

## Urutan pengerjaan

**Fokus langsung saat ini:** pengguna menguji frontend terlebih dahulu. Gunakan
80 soal dan 9 paket contoh pada [panduan uji frontend](FRONTEND_TESTING.md).
Penambahan backend/database ditunda sampai masukan alur dan tampilan FE terkumpul;
urutan di bawah tetap menjadi rencana integrasi setelah pengujian tersebut.

Pertanyaan pembayaran/reservasi dan pemantauan orang tua pada
[daftar pertanyaan klien](CLIENT_QUESTIONS.md) dibahas sebelum modul bisnisnya
dibangun; jawabannya tidak menjadi penghambat pengerjaan CBT.

1. **Akses minimum untuk tryout:** akun admin pertama, login yang terhubung
   database, whitelist siswa peserta yang telah diverifikasi admin, pemeriksaan
   status akun oleh server, serta akses siswa/tentor/admin yang benar. Kode Siswa
   tetap menggunakan generator yang sudah dibuat. Pendaftaran dan pembayaran
   existing boleh tetap ditangani bimbel secara offline; tidak perlu menunggu
   formulir publik, reservasi kelas, atau gateway. Tidak menggunakan bypass login.
2. **Akademik:** bank soal dan versi terbit, penyusunan paket/subtes, empat tipe
   soal, akses tentor sesuai role, serta koreksi essay manual.
3. **CBT terintegrasi:** UI memakai attempt/jawaban dari API, deadline server,
   autosave dan retry aman, resume setelah refresh, finalisasi saat habis waktu,
   dan perlindungan kunci jawaban. Pilihan PTN/prodi dikonfirmasi sebelum ujian.
4. **Hasil tryout:** hasil dari jawaban sebenarnya, pembahasan mengikuti aturan
   publikasi paket, hasil essay belum final sampai dikoreksi, analisis kelemahan,
   serta perbandingan dengan target prodi awal. Tidak memakai skor dummy.
5. **Kesiapan pemakaian CBT:** pengujian alur siswa/tentor/admin, pemulihan backup,
   pemeriksaan keamanan dan privasi, dan uji beban 300–350 peserta sebelum
   memilih kapasitas hosting serta membuka layanan.
6. **Setelah tryout bisa dipakai — digitalisasi bisnis bimbel:** pendaftaran
   mandiri/persetujuan admin, formulir bertanda tangan orang tua, reservasi kelas,
   pembayaran pendaftaran Rp100.000 yang dicatat admin, SPP/rekap kas, jadwal,
   kuota, dan impor daftar ulang dengan preview wajib serta konfirmasi.
   Tambahkan portal orang tua setelah cakupan dan metode akses dikonfirmasi;
   isolasi data berdasarkan relasi wali–anak harus diperiksa oleh server.
   Integrasi gateway tetap pekerjaan lanjutan, bukan prasyarat modul pembayaran manual.

## Kriteria tryout bisa dipakai

- Admin/tentor menyiapkan soal, paket, jadwal, subtes, dan peserta di database.
- Siswa yang terdaftar dan aktif dapat login, memilih paket serta prodi tujuan,
  kemudian mengerjakan sesuai jadwal dan batas waktu server.
- Jawaban tersimpan di server dan pulih setelah refresh/koneksi tersambung lagi;
  retry tidak menggandakan attempt, jawaban, atau hasil.
- Submit dan kedaluwarsa menghasilkan nilai dari jawaban sebenarnya; essay
  dikoreksi tentor sebelum hasil final. Kunci jawaban tidak dikirim saat ujian.
- Siswa hanya melihat data miliknya; hak tentor/admin serta deaktivasi akun
  berlaku pada API. Alur lengkap dan beban target sudah diuji sebelum dipakai massal.

## Kondisi saat ini

- Landing page dan alur pilihan prodi tersedia; sebagian besar area aplikasi
  masih menggunakan React Context/LocalStorage dan data contoh.
- Fondasi API autentikasi, ujian, dan penilaian sudah ada, belum tersambung
  penuh ke layar aplikasi. Google OAuth dan admin pertama belum dikonfigurasi.
- Migrasi 004 menambahkan `kode_siswa` hasil generator database dengan sequence
  atomik. `nis` dipertahankan sebagai metadata sekolah opsional, bukan kunci.
- API admin untuk pencarian/pembuatan data siswa tersedia. Pembuatan data
  menghasilkan akun `nonactive`; aktivasi menunggu alur pendaftaran selesai.
  Halaman admin dan impor lama belum menggunakan API tersebut.
- Payment gateway, Redis, queue worker, dan deployment online belum dikerjakan.

Setiap langkah harus mencatat perubahan, hasil pengujian, dan batas integrasi
yang tersisa. Label fitur selesai hanya jika frontend dan backend terkait
benar-benar terhubung dan alur penerimaannya sudah diuji.
