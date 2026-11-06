# UAT Frontend Euclide

Panduan pengujian manual untuk siswa, tentor, dan admin. Fokus saat ini adalah
alur penggunaan, tampilan, interaksi, dan penyimpanan demo di browser.
**Dokumen ini adalah skenario untuk dijalankan, bukan laporan bahwa semua tes sudah lulus.**

## 1. Persiapan

```powershell
npm run dev:local
```

Buka http://localhost:3000. Gunakan data fiktif, bukan data siswa sungguhan.
Database dan Google OAuth tidak diperlukan untuk UAT demo ini.

- Paket utama: **Coba CBT · 35 soal, 35 menit**, lima soal dan lima menit di setiap subtes.
- Bank awal: **80 soal**, **9 paket**, dan **7 subtes**. Jumlah dapat bertambah setelah tes membuat soal.
- Peran dipilih melalui **Akses Cepat Demo** pada `/login`.
- Untuk hasil yang dapat diulang, mulai pada profil browser khusus pengujian atau jendela incognito baru. LocalStorage antarprofil tidak sama.
- Jangan menghapus seluruh data browser untuk mengulang tes. Selesaikan sesi dan gunakan **Ulangi Ujian**, atau gunakan profil pengujian baru.
- Sesi lama sebelum perubahan paket dapat masih memiliki timer satu menit. Untuk menguji lima menit, mulai sesi baru.
- Estimasi sesi inti: 20–30 menit jika subtes dipindahkan manual. Pengujian expiry perlu menunggu timer lima menit; tidak perlu menjawab semua soal benar.
- Saat ujian aktif, berpindah tab/aplikasi dapat memicu peringatan anti-curang. Baca langkah terlebih dahulu atau gunakan panduan di perangkat kedua. Catat temuan rinci setelah ujian.

### Identitas pelaksanaan

| Isian | Nilai |
|---|---|
| Nama penguji | … |
| Tanggal/jam | … |
| Versi/commit (`git rev-parse --short HEAD`) | … |
| Perangkat dan OS | … |
| Browser dan versi | … |
| Ukuran layar / model HP | … |
| Profil baru atau data tersimpan | … |

Status yang digunakan: **Belum diuji**, **Lulus**, **Gagal**, **Terblokir**, atau
**Ditunda**. Jika gagal, tulis ID temuan dan hasil aktual. Jangan mengubah
ekspektasi hanya untuk menyesuaikan perilaku yang salah.

## 2. Jalur cepat: satu alur utuh

1. Buka `/login` → **Masuk sebagai Siswa** → katalog tryout.
2. Pilih **Coba CBT · 35 soal, 35 menit** → halaman pilihan prodi.
3. Tambahkan **Ilmu Komputer (S1)** dan **Teknik Informatika (D3)**. Keduanya nama prodi fiktif pada daftar demo. Atur prioritas sesuai keinginan.
4. Centang konfirmasi → **Konfirmasi & mulai tryout**. Subtes PU menampilkan lima nomor dan, untuk sesi baru, timer sekitar `05:00`.
5. Pada PU nomor 1, pilih **B**, tandai ragu, pindah nomor 2, lalu kembali nomor 1. Jawaban dan tanda ragu tetap terlihat. Hilangkan tanda ragu untuk mencoba kedua keadaan.
6. Pindah subtes **Pengetahuan Kuantitatif (PK)**. Pada soal pertama, isi **42**. Pindah nomor dan kembali untuk mengecek isian.
7. Pindah subtes **Penalaran Matematika (PM)**. Pada soal matriks (nomor 2 dalam subtes), pilih **A, B, C, E**. Batalkan satu pilihan lalu pilih lagi untuk mencoba checkbox.
8. Pindah subtes **Literasi Indonesia**. Pada soal essay pertama, tulis dua paragraf singkat, misalnya 100 kata pendapat sendiri. Tidak perlu mengirim jawaban nyata atau informasi pribadi.
9. Klik **Kumpulkan** / **Kumpulkan Ujian**. Periksa ringkasan, pilih **Kembali** untuk memastikan belum terkirim. Buka konfirmasi lagi, lalu **Kumpulkan & Selesai**.
10. Halaman hasil menampilkan nama/paket serta dua target prodi awal. **Angka nilai saat ini masih contoh**, bukan hasil perhitungan jawaban di langkah sebelumnya.
11. Klik **Coba prodi alternatif** → ubah daftar simulasi. Pastikan daftar pilihan awal tidak ikut berubah.
12. Kembali ke `/login` → **Masuk sebagai Tentor** → **Perlu dikoreksi**. Cari nama siswa dan paket CBT tadi, buka jawaban essay, isi nilai dan umpan balik, lalu simpan.
13. Periksa tab **Sudah dinilai** dan buka kembali penilaian. Nilai/umpan balik yang disimpan tetap terlihat. Ini penyimpanan demo di browser yang sama.

Jika salah satu langkah tidak dapat dilanjutkan, catat hasil aktual dan ID
skenario terkait di bawah. Jangan menyatakan seluruh alur lulus hanya karena
halaman hasil berhasil terbuka.

## 3. Skenario siswa: masuk dan katalog

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-01 | Buka `/`. Klik Program belajar, Cara bergabung, dan FAQ; buka/tutup satu FAQ. | Navigasi menuju bagian yang benar; FAQ dapat dibaca; tidak ada nama siswa demo pada navigasi landing publik. | Belum diuji |
| FE-02 | Buka `/login`, pilih Masuk sebagai Siswa. | Masuk ke katalog; identitas siswa yang tampil sesuai akun demo aktif. Ini bukan bukti login OAuth. | Belum diuji |
| FE-03 | Pada profil baru buka `/tryouts`; periksa sembilan kartu. | Ada 9 paket; paket Coba CBT memuat 35 soal, 35 menit, dan 7 subtes. Judul kartu tidak semuanya sama. | Belum diuji |
| FE-04 | Cari `Literasi`, lalu cari `paket-tidak-ada-123`; klik Tampilkan semua tryout. | Pencarian menyaring paket; kata kunci tanpa hasil menampilkan pesan kosong; tombol reset mengembalikan katalog. | Belum diuji |
| FE-05 | Coba filter UTBK lengkap, TPS & matematika, Literasi. | Kategori sesuai isi subtes; kategori aktif terlihat; pencarian dan filter dapat digabung. | Belum diuji |

## 4. Pilihan prodi sebelum ujian

Gunakan sesi yang belum dimulai. Hapus pilihan pada editor melalui tombol Hapus
untuk mencoba kondisi kosong; jangan menghapus data browser.

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-06 | Pilih paket, kosongkan pilihan prodi, coba mulai. | Pesan minimal satu pilihan terlihat; tombol mulai nonaktif; timer belum dimulai. | Belum diuji |
| FE-07 | Tambah Ilmu Komputer S1 dan Kedokteran S1, lalu tambah Manajemen S1. | Dua S1 valid; tiga S1 ditolak dengan penjelasan kombinasi. | Belum diuji |
| FE-08 | Dari tiga S1, hapus Manajemen dan tambah Akuntansi Manajerial D4. | Dua S1 + satu D4 valid; D3 tidak wajib untuk kombinasi tiga pilihan campuran ini. | Belum diuji |
| FE-09 | Pada kombinasi dua S1 + satu D4, tambah Teknologi Rekayasa Perangkat Lunak D4. Lalu ganti salah satu D4 dengan Teknik Informatika D3. | Empat pilihan tanpa D3 tidak valid; dua S1 + satu D4 + satu D3 valid. | Belum diuji |
| FE-10 | Coba tambah prodi yang sudah dipilih, coba pilihan kelima, lalu naik/turunkan prioritas. | Tidak ada prodi ganda dan maksimal empat pilihan; urutan berubah sesuai tindakan. | Belum diuji |
| FE-11 | Pilih kombinasi valid, centang konfirmasi, ubah urutan, periksa kembali konfirmasi. | Perubahan pilihan meminta konfirmasi ulang; mulai hanya ketika kombinasi valid dan sudah dikonfirmasi. | Belum diuji |
| FE-12 | Mulai ujian; kembali ke halaman persiapan paket yang sama. | Halaman menjelaskan sesi sudah berjalan, menampilkan pilihan awal, dan menyediakan Lanjutkan tryout tanpa mengganti target sesi. | Belum diuji |

## 5. Pengerjaan CBT

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-13 | Mulai Coba CBT pada sesi baru. Buka tiap subtes. | Setiap subtes memiliki lima soal; nomor 1–5 dapat dipilih; timer sesi baru sekitar lima menit. | Belum diuji |
| FE-14 | Pada PU pilih B di nomor 1; ganti ke C; pindah nomor lalu kembali. | Hanya satu opsi aktif; pilihan terakhir tetap C; indikator jumlah terjawab sesuai. | Belum diuji |
| FE-15 | Pada PM nomor 2, pilih A, B, C, E; batalkan B lalu pilih kembali. | Beberapa opsi dapat aktif; toggle tidak menghapus pilihan lain; pilihan tetap ada ketika berpindah nomor. | Belum diuji |
| FE-16 | Pada PK nomor 1 ketik 42; pindah nomor dan kembali; kosongkan isian. | Isi kembali terlihat; setelah dikosongkan soal tidak lagi dihitung sebagai terjawab. | Belum diuji |
| FE-17 | Isi essay Literasi Indonesia dengan dua paragraf; pindah nomor dan kembali. | Teks dan pemisahan paragraf tidak hilang; indikator jumlah kata mengikuti teks; tidak dianggap otomatis benar/salah. | Belum diuji |
| FE-18 | Tandai soal kosong ragu; isi jawaban; lepaskan tanda ragu. Bandingkan palet dan ringkasan. | Status kosong, terjawab, dan ragu konsisten. Terjawab+ragu tidak dihitung dua kali sebagai dua jawaban. | Belum diuji |
| FE-19 | Klik nomor 5, Soal Sebelumnya/Prev, dan Soal Berikutnya/Next. Coba tombol pada batas subtes. | Soal yang ditampilkan sesuai nomor; tidak ada soal kosong/tidak terdefinisi; perpindahan subtes jelas. | Belum diuji |
| FE-20 | Buka soal rumus integral/matriks dan ubah ukuran teks A/A+/A++. Pada HP coba tab Wacana dan Soal. | Rumus terbaca; teks tidak saling menimpa; bacaan dan opsi bisa dijangkau tanpa kehilangan jawaban. | Belum diuji |
| FE-21 | Jawab PU nomor 1, pindah PK nomor 3 dan isi jawaban; refresh halaman. | Target: semua jawaban serta posisi subtes/nomor terakhir pulih. Periksa jawaban dan posisi secara terpisah; lihat K-02 untuk celah yang sudah teridentifikasi. | Belum diuji |
| FE-22 | Pada sesi khusus, biarkan timer satu subtes habis tanpa klik. | Target: pindah ke subtes berikutnya sekali; jawaban tetap tersimpan; tidak mendapat tambahan waktu pada subtes yang selesai. Timer demo masih memiliki batas K-03. | Belum diuji |
| FE-23 | Pada sesi khusus anti-curang, pindah tab sekali lalu kembali. | Peringatan tampil. Catat jumlah pelanggaran aktual; satu perpindahan tidak semestinya menggandakan hitungan. Uji ini terpisah dari alur utama. | Belum diuji |
| FE-24 | Klik Kumpulkan, bandingkan ringkasan jawaban dengan yang diisi; pilih Kembali. Lalu kumpulkan dan konfirmasi. | Batal tidak menyelesaikan ujian; konfirmasi membuka hasil; sesi selesai tidak bisa dilanjutkan sebagai sesi aktif. | Belum diuji |

Navigasi subtes saat ini dapat diklik bebas. Jangan menyimpulkan bahwa subtes
sebelumnya sudah terkunci atau aturan simulasi SNBT ketat sudah terpenuhi.

## 6. Hasil, simulasi, dan koreksi tentor

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-25 | Setelah submit, periksa hasil: nama, judul, tanggal, grafik, pembahasan, dan target awal. | Elemen tampil tanpa error; target sesuai pilihan awal. Skor/grafik ditandai sebagai contoh, bukan dihitung dari jawaban. | Belum diuji |
| FE-26 | Buka simulasi alternatif; ganti prodi dan prioritas. Tutup simulasi lalu refresh. | Pilihan awal tetap sama; perubahan alternatif tidak mengubah snapshot sesi. | Belum diuji |
| FE-27 | Di simulasi, pilih Teknik Mesin D3 yang belum memiliki target. | Status Target belum tersedia; tidak membuat angka target atau peluang sendiri. | Belum diuji |
| FE-28 | Buka `/login`, pilih Tentor. Pada koreksi esai, coba pencarian, Perlu dikoreksi, Sudah dinilai, dan Semua jawaban. | Data disaring sesuai pencarian/status; pencarian kosong hasil menampilkan pesan; progres mengikuti jumlah jawaban dinilai. | Belum diuji |
| FE-29 | Cari essay dari FE-17/24; buka Koreksi jawaban. Cek nama, soal, jawaban, dan panduan. | Jawaban cocok dengan yang dikirim siswa; rubrik terlihat; nilai dan feedback baru tidak otomatis terisi pujian/nilai contoh. | Belum diuji |
| FE-30 | Pada dialog, coba nilai kosong, -1, 101, dan feedback kosong. Lalu simpan nilai 84 dengan feedback fiktif. | Input tidak valid tidak tersimpan; nilai 84 dan feedback valid tersimpan, dialog tertutup, jawaban berpindah ke Sudah dinilai. | Belum diuji |
| FE-31 | Buka kembali jawaban yang sudah dinilai; ubah nilai lalu Batal. Buka lagi, lalu tutup dengan Escape. Refresh halaman. | Batal tidak menyimpan perubahan; Escape menutup dialog; nilai terakhir yang benar-benar disimpan tetap terlihat. | Belum diuji |

## 7. Bank soal dan latihan — tambahan setelah alur utama

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-32 | Dari menu pengajar/admin, buka Bank soal. Pilih tiap filter subtes. | Semua tujuh subtes punya soal; jumlah sesuai data; rumus, bacaan, dan kunci dapat dibaca pada halaman pengelola. | Belum diuji |
| FE-33 | Buat soal fiktif berjudul `UAT — soal percobaan`, pilih subtes, isi opsi/kunci/pembahasan; simpan dan refresh. | Soal baru muncul dan bertahan di browser. Belum otomatis dimasukkan ke paket statis; lihat K-04. | Belum diuji |
| FE-34 | Buka `/drilling`, pilih setiap subtes, jawab soal objektif, lihat pembahasan, lalu soal berikutnya. | Setiap subtes memiliki soal; opsi/isian dapat digunakan; pembahasan tampil; pindah soal membersihkan jawaban soal sebelumnya. | Belum diuji |
| FE-35 | Ulangi FE-03, 06, 13–20, 24, 28–31 pada HP portrait, lalu landscape. | Tidak ada tombol terpotong/tertutup; teks terbaca; halaman/dialog dapat digulir; palet, bacaan, dan form penilaian bisa diakses dengan sentuhan. | Belum diuji |

### Pagination daftar dan pratinjau impor

| ID | Langkah | Hasil yang diharapkan | Status / temuan |
|---|---|---|---|
| FE-36 | Pada daftar siswa pilih 5 per halaman. Jika ada lebih dari 5 siswa, pindah ke halaman 2, lalu kembali. | Halaman 1 menampilkan nomor 1–5; halaman 2 meneruskan nomor 6, bukan mulai 1. Tidak ada siswa hilang atau ganda antarhalaman. | Belum diuji |
| FE-37 | Di bank soal pindah halaman, ubah filter subtes, kemudian kembalikan filter. Ulangi dengan pencarian di katalog/siswa/koreksi. | Setiap perubahan pencarian/filter kembali ke halaman 1; jumlah dan rentang mengikuti hasil filter. | Belum diuji |
| FE-38 | Ubah jumlah per halaman di bank soal/tryout, siswa/pembayaran, dan kelas/koreksi. Coba halaman terakhir serta hasil kosong. | Data sesuai batas; halaman terakhir tidak memuat baris fiktif; sebelumnya/berikutnya nonaktif di batas; hasil kosong tidak menampilkan halaman invalid. | Belum diuji |
| FE-39 | Pada data impor fiktif lebih dari 50 baris, pindah halaman pratinjau sampai baris terakhir; jangan konfirmasi jika tidak ingin menyimpan. | Semua baris dapat ditinjau, termasuk baris 51 dan seterusnya. Ringkasan valid/error dan jumlah pada tombol simpan menghitung seluruh data, bukan hanya halaman aktif. | Belum diuji |
| FE-40 | Coba kontrol pagination pada HP dan keyboard Tab/Enter. | Tombol dapat difokuskan; halaman aktif jelas; kontrol tidak melebar keluar layar. Di HP tersedia sebelumnya/berikutnya dan nomor halaman saat ini. | Belum diuji |

Pagination ini membagi data frontend yang sudah dimuat. Pembatasan query dan
pagination backend belum diintegrasikan. Widget transaksi terbaru pada ringkasan
admin sengaja tetap ringkasan lima transaksi, dengan tautan ke daftar lengkap.

## 8. Batas dan celah yang diketahui dari review kode

Ini temuan review, bukan hasil pelaksanaan UAT di perangkat penguji.

| ID | Kondisi saat ini | Perlakuan dalam UAT |
|---|---|---|
| K-01 | Login Google di `/login` masih simulasi; email yang tidak dikenal bahkan dapat membuat akun demo aktif. Role switch bukan autentikasi/otorisasi sungguhan. | Uji navigasi peran boleh dilakukan. Pengujian whitelist, penolakan email asing, isolasi API, dan keamanan login produksi **Ditunda**, jangan dinyatakan lulus. |
| K-02 | Player menginisialisasi posisi ke subtes/soal pertama setelah mount. Jawaban tersimpan tidak otomatis berarti posisi terakhir ikut pulih. | FE-21 dapat gagal pada posisi. Catat pemulihan jawaban terpisah dari posisi; perlu perbaikan FE. |
| K-03 | Timer frontend memakai interval dan sisa waktu browser, bukan deadline server. Menghentikan browser/koneksi atau berpindah subtes belum membuktikan waktu ujian ketat. | FE-22 menguji tampilan dan transisi saja. Jaminan timer server dan ketahanan manipulasi **Ditunda**. Catat jika subtes mendapat waktu kembali. |
| K-04 | Bank soal yang dibuat di UI tersimpan lokal; paket tryout dibentuk dari bank contoh statis saat kode dimuat. | FE-33 hanya menguji bank lokal. Penyusunan/penerbitan paket dari soal buatan user belum tersedia. |
| K-05 | Skor hasil masih salinan data contoh; simpan nilai essay belum menghitung ulang hasil tryout. | FE-25 menguji tampilan/snapshot. Akurasi skor, ranking, dan finalisasi setelah koreksi **Ditunda**. |
| K-06 | Blur dan visibilitychange dapat sama-sama terpanggil saat berpindah aplikasi; penghitung pelanggaran perlu verifikasi. | FE-23 perlu dicatat, termasuk bila hitungan ganda atau auto-submit terlalu cepat. Deteksi bukan bukti bisa mencegah semua kecurangan. |

Pembayaran, pendaftaran bisnis, portal orang tua, payment gateway, integrasi
PostgreSQL/OAuth, dan uji 350 pengguna tidak masuk UAT frontend ini.

## 9. Format melaporkan temuan

Salin blok berikut untuk setiap masalah. Kirim screenshot hanya jika tidak
memuat secret `.env`, data pribadi nyata, atau informasi browser yang tidak perlu.

```text
ID temuan: BUG-001
Skenario: FE-…
Judul:
Perangkat/browser:
URL/paket/subtes/nomor soal:
Langkah untuk mengulang:
1.
2.
3.
Hasil yang diharapkan:
Hasil aktual:
Frekuensi: selalu / kadang (… dari … percobaan)
Dampak: menghalangi lanjut / fungsi salah / tampilan
Lampiran screenshot/video:
```

Prioritas tindak lanjut: **P0** jawaban hilang/ujian tidak bisa diselesaikan;
**P1** fungsi penting salah atau alur membingungkan; **P2** tata letak/teks/kenyamanan.
Masalah tampilan yang menutup tombol utama juga bisa menjadi P0/P1 sesuai dampak.

## 10. Ringkasan hasil UAT

| Ukuran | Hasil |
|---|---|
| Skenario disiapkan | 40 |
| Skenario dijalankan | … |
| Lulus | … |
| Gagal | … |
| Terblokir | … |
| Belum diuji | … |
| Temuan P0 / P1 / P2 | … / … / … |
| Kesimpulan | Perlu perbaikan / Diterima terbatas untuk demo FE |
| Nama penguji dan tanggal | … |

Penerimaan FE memerlukan alur siswa memilih prodi → mengerjakan empat tipe soal
→ submit → hasil, serta tentor membaca essay → menyimpan penilaian, dapat
diselesaikan pada desktop dan HP tanpa masalah penghalang. Batas K-01–K-06
tetap dicatat dan tidak berubah menjadi kelulusan produk. **UAT FE bukan
persetujuan penggunaan untuk ujian sungguhan atau data siswa nyata.**
