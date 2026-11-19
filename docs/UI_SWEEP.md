# Perapian ikon, tombol dan teks antarmuka

## Cetak kuitansi dari dialog

- Kuitansi dirender melalui portal langsung ke body. Saat dialog terbuka,
  media print mengeluarkan seluruh elemen aplikasi lain dari layout cetak dengan
  display:none. Aturan visibility:hidden global dan absolute positioning lama
  dihapus karena menyisakan tinggi halaman dan berkonflik dengan dialog modal.
- Cetak tidak menutup dialog atau menghapus pembayaran. Setelah tutup, scroll
  dan fokus tombol pemicu dipulihkan. Pilihan printer/PDF tetap milik browser.
- TypeScript lulus. UAT print preview A4, simpan/batal, tutup/buka kembali, dan
  cetak halaman biasa tanpa dialog perlu diperiksa langsung di browser.

## Dashboard admin dengan grafik

- Menu desktop/mobile menggunakan nama Dashboard. Halaman admin menampilkan grafik
  batang pembayaran per bulan tagihan, diagram donat status siswa, dan grafik
  keterisian kelas. Kelas dan periode pembayaran memakai pagination.
- Agregasi menggunakan catatan Context yang tersimpan di browser. Tidak membuat
  tren pertumbuhan atau menganggap bulan tagihan sebagai tanggal penerimaan kas.
  Periode tidak dikenal tetap ditampilkan, bukan dibuang.
- Grafik pembayaran memiliki tabel data melalui disclosure native; status siswa
  memiliki tabel jumlah yang selalu terlihat. Warna disertai label dan nominal.
  Tidak ada animasi otomatis. Detail pembayaran dan kuitansi ada di menu Pembayaran.
- Tes agregasi mencakup urutan lintas tahun, penggabungan periode, pemisahan status,
  data kosong, nominal tidak valid, dan jumlah akun. Verifikasi visual perangkat
  tetap perlu dilakukan; browser automation tidak tersedia pada sesi ini.

Lingkup pemeriksaan kode: 31 file TSX di `src/app` dan `src/components`.
Mengikuti arah visual Euclide dan antislop During: ENERGY 1 / RHYTHM 1 /
MOTION 1. Tidak menambahkan aset atau animasi. Tujuannya menjaga fokus pada
soal/hasil dan memberi ruang yang cukup untuk tindakan pengguna.

## Perubahan

- Hapus semua referensi ikon Sparkles, termasuk yang tidak dipakai, pada hasil
  ujian, analisis, login, bank soal dan komponen impor/editor rumus.
- Judul hasil dan analisis menjadi teks biasa, tanpa badge dekoratif.
- Perbaiki `px-4.5` pada Katalog tryout: nilai tersebut tidak ada pada spacing
  konfigurasi Tailwind proyek. Gunakan tombol bersama dengan padding valid.
- Aksi hasil menjadi tombol penuh per baris pada HP, dengan gap 12px, lalu
  membungkus sesuai ruang pada layar lebih lebar.
- Kelompok tindakan admin, penilaian, impor, kuitansi, pilihan prodi dan konfirmasi
  submit ujian memakai wrap/gap. Toolbar rumus mempertahankan simbol ringkas
  dengan jarak yang lebih longgar.
- Kontrol sentuh memakai ukuran minimum 44px dan navigasi bawah mendapat padding
  safe-area. Scroll-padding membantu fokus tetap terjangkau di antara bar tetap.
- Hapus kata demo/prototipe dari tampilan sesuai instruksi eksplisit pengguna.
  Ini menggantikan pilihan label visual sebelumnya, bukan perubahan integrasi
  backend. Batas fungsional/data contoh tetap dicatat dalam panduan pengembangan.
  Peringatan rasionalisasi bukan hasil seleksi resmi tetap dipertahankan.
- Identifier paket/soal dan penyimpanan lokal tetap dipakai agar sesi lama tidak
  putus. Tidak mengganti data, autentikasi, timer, atau penilaian.

## Delivery gate yang diperiksa

- PASS R-04/R-09: pemindaian 31 file TSX tidak menemukan referensi ikon bintang
  atau kata demo/prototipe pada JSX text; import data internal bukan teks UI.
- PASS R-03/R-31 (kode): aksi hasil memakai min-height dan wrap; spacing Tailwind
  pecahan diperiksa terhadap konfigurasi, tidak ada lagi token yang tidak valid.
- PASS R-11/R-12: judul tidak lagi memerlukan pill/shadow tambahan; tombol
  Katalog tryout mengikuti radius dan warna kontrol Euclide yang sudah ada.
- PASS R-39 (kode): link tetap link, tombol tetap tombol; kontrol sentuh memiliki
  minimum target tanpa memaksa ukuran ikon visual. Zoom manual tidak dibatasi.
- PASS R-25: tombol bersama navy/putih 9,49:1; label slate-600/putih 7,58:1,
  mengikuti perhitungan warna pada pemeriksaan admin sebelumnya.
- PASS teknis: build produksi Next.js, TypeScript, tujuh tes data/pagination,
  dan `git diff --check` lulus.

## Belum terverifikasi di perangkat

Akses browser otomatis pada sesi ini tidak tersedia. Pemeriksaan seluruh kode
UI bukan klaim bahwa seluruh halaman telah diklik atau diuji visual. Sebelum
penerimaan, cek hasil, katalog, admin, impor dan dialog pada 320/390/768px:
tombol tidak bertabrakan, wrap jelas, zoom 200% dan keyboard tidak menutup kontrol,
serta navigasi bawah tetap terjangkau. Perubahan belum dipublikasikan.

Panduan `form-factor-adaptation` digunakan untuk min-block-size, target sentuh,
jarak antarkontrol, wrap, safe-area dan scroll-padding. Browser tanpa safe-area
menggunakan nilai fallback 0px; tidak menambahkan polyfill atau dependensi.

## Pembahasan hasil: pagination

- PASS pemeriksaan kode: pembahasan menggunakan usePagination bersama, default
  lima soal dengan pilihan 1/5/10; filter dijalankan sebelum pagination dan
  perubahan paket/filter mengembalikan halaman pertama.
- PASS pemeriksaan nomor: tampilan memakai number asli dari soal, bukan index
  halaman. Total tombol Semua mengacu ke seluruh paket, bukan hasil filter.
- PASS pemeriksaan akses: kontrol atas/bawah memiliki nama berbeda; hanya
  kontrol bawah mengumumkan rentang agar screen reader tidak mendengar dua
  pengumuman identik. Setelah navigasi halaman, fokus dan scroll kembali ke
  judul pembahasan. Perubahan ukuran halaman tidak memindahkan fokus select.
- PASS konsistensi visual: pembahasan per soal menjadi teks dengan pemisah,
  tanpa kartu putih bersarang di dalam kartu lainnya; tidak ada ikon baru.
- TypeScript dan tujuh tes data/pagination lulus. Pengujian klik, fokus dan
  reflow perangkat belum dijalankan; skenario FE-47 ditambahkan ke panduan UAT.
- modern-web-guidance dicari dengan dua variasi topik pagination. Tidak ada
  panduan spesifik yang cocok; tidak mengambil panduan lain yang tidak relevan.

## Navigasi latihan

- Tambahkan Sebelumnya/Berikutnya dan posisi soal; batas awal/akhir memakai
  disabled native. Akhir subtes tidak lagi otomatis berputar ke nomor pertama.
- Jawaban dan status sudah diperiksa disimpan per ID soal selama halaman latihan
  terbuka, termasuk ketika berpindah subtes. Ini bukan penyimpanan ke server dan
  belum bertahan jika halaman dimuat ulang atau ditinggalkan.
- Navigasi memindahkan fokus dan scroll ke judul soal tanpa animasi tambahan.
  Tombol di HP tersusun vertikal agar label dan area sentuh tetap cukup.
- Pemeriksaan TypeScript dan tujuh tes data/pagination lulus. FE-48 memuat
  pengujian interaksi yang perlu dijalankan; hasil tersebut belum diklaim lulus.

## Fokus kolom pencarian berikon

- PASS R-31/R-32 (kode): lima wrapper pencarian memakai `eu-search-field`:
  katalog tryout, prodi, kelas, siswa dan koreksi. Indikator fokus dipindah ke
  wrapper membulat dengan `focus-within`; outline input di dalamnya saja yang
  digantikan, bukan outline seluruh formulir/aplikasi.
- PASS R-25: outline navy/putih 9,49:1 memakai outline nyata, sehingga tidak
  bergantung pada shadow saat Forced Colors Mode. Outline bawaan kontrol lain
  tetap ada. Tidak menambahkan animasi, aset, warna atau dependensi.
- TypeScript lulus. Pemeriksaan HTTP katalog mengonfirmasi wrapper dan aturan
  fokus tersedia pada CSS yang disajikan. Tampilan setelah fokus di perangkat
  belum diklaim terverifikasi melalui browser otomatis.
- Panduan `accessibility` dipakai untuk menjaga pengganti indikator fokus yang
  terlihat serta memakai outline, bukan sekadar ring berbasis box-shadow.

## Pencarian berbasis submit

- PASS pemeriksaan kode: lima pencarian memakai SearchForm bersama, form native
  dan tombol submit Cari. Input hanya mengubah draf. Kata kunci terapan berubah
  saat submit, bukan pada onChange; filter hasil memakai memo tanpa dependensi
  pada draf. Tidak ada debounce atau timer pencarian.
- PASS pagination: submit dan reset menaikkan revisi kata kunci agar halaman
  kembali ke awal, termasuk saat kata kunci yang sama dikirim ulang. Reset
  membersihkan draf dan kata kunci terapan sekaligus.
- PASS akses (kode): label terhubung melalui useId, type search, enterKeyHint
  search, target 48px, fokus wrapper dan tombol tetap terlihat. Tidak ada handler
  keydown Enter; implicit submit native mempertahankan penanganan komposisi IME.
- PASS kontras (sRGB): tombol putih/navy 9,49:1; placeholder dan border slate-500
  di putih 4,76:1. Bentuk dan warna mengikuti field yang sudah digunakan.
- TypeScript, build produksi dan 15 tes frontend lulus, termasuk tiga tes baru
  yang memeriksa edit tanpa submit, commit, submit kosong dan reset. Klik/Enter
  pada perangkat belum diklaim telah diuji; jalankan FE-54.
- forms dan ime-safe-enter-submit dipakai sebagai panduan. Pencarian masih
  memfilter data frontend dan memerlukan JavaScript aplikasi, bukan API search
  atau fallback pencarian server baru.
