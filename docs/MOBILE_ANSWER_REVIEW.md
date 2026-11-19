# Perbaikan input jawaban dan wacana

Lingkup: latihan dan player CBT. Arah visual mengikuti `UI_STYLE.md`: navy-biru,
panel putih, radius 12–16px dan sans-serif. ENERGY 1 / RHYTHM 1 / MOTION 1:
prioritaskan membaca dan menjawab dengan tenang, tanpa animasi baru.

Wacana mendahului soal dan jawaban dalam satu alur pada HP. Desktop tetap memakai
dua kolom; pembatas tinggi/scroll panel wacana hanya berlaku di desktop. Ini
mengurangi perpindahan konteks tanpa membuat bacaan panjang tersembunyi di HP.

## Pemeriksaan kode

- PASS, kontrol: `WrittenAnswer` memakai input/textarea native, label terhubung
  melalui `useId`, tinggi minimal 48px dan focus ring. Latihan merender semua
  empat tipe soal. Esai latihan tidak diklaim benar/salah otomatis.
- PASS, keterbacaan: teks input minimal 16px pada HP. Kontras terhadap putih:
  label 14,63:1, petunjuk 7,58:1, border 4,76:1, focus ring 6,70:1
  (perhitungan luminansi sRGB). Zoom manual tidak dibatasi.
- PASS, interaksi: field mengecualikan proteksi seleksi teks CBT; menu konteks
  input tidak diblokir. Navigasi bawah disembunyikan selama field fokus pada HP.
  Deteksi perpindahan aplikasi tetap menggunakan `visibilitychange`, tanpa
  menghitung `window.blur` sebagai pelanggaran.
- PASS, konsistensi: memakai warna/font/radius existing; tidak membuat aset,
  statistik, testimonial, navigasi atau dependensi baru.
- PASS, verifikasi teknis: TypeScript, 20 tes backend/data/pagination dan build produksi Next.js lulus;
  `/drilling` dan `/exam/to-demo-cepat-00` merespons HTTP 200 di server lokal.

## Validasi perangkat yang belum dijalankan

Akses host browser otomatis tidak tersedia pada sesi ini. HTTP 200 dan pemeriksaan
kode tidak membuktikan keyboard virtual, reflow atau zoom pada perangkat asli.
Delivery gate visual/perangkat masih terbuka: jalankan FE-41 sampai FE-46 di
`UAT_FRONTEND.md` pada Chrome Android dan Safari iPhone, termasuk bacaan panjang,
landscape, zoom manual 200%, mengetik, mengganti kursor dan menutup keyboard.
Validasi perangkat ini tetap perlu dilakukan setelah versi baru tersedia di Vercel.


## Penyederhanaan visual sesuai masukan pengguna

Mode antislop: During, meneruskan pilihan sesi. Arah tetap ENERGY 1 / RHYTHM 1 /
MOTION 1. Fokus halaman adalah soal yang sedang dikerjakan, kemudian hasil dan
pembahasannya. Judul bagian serta jarak menggantikan kartu berlapis. Biru
menandai tindakan/pilihan aktif; warna hasil hanya untuk benar/salah.

- PASS R-04/R-09: sparkle pada pembahasan dan badge petir di atas judul latihan
  dihapus. Judul latihan tidak lagi memuat istilah implementasi KaTeX.
- PASS R-01/R-11/R-12: wacana latihan/CBT dan pembahasan latihan memakai permukaan
  halaman, tanpa kartu berwarna, radius, shadow atau ikon dekoratif tambahan.
- PASS C-3/R-31: alur latihan sekarang soal, input, hasil pemeriksaan, pembahasan,
  lalu tombol soal berikutnya. Tidak perlu melewati tombol lanjut untuk membaca.
- PASS R-25 (pemeriksaan warna kode): isi slate-800 di putih 14,63:1;
  label slate-600 di putih 7,58:1; judul slate-900 di putih 17,85:1.
- Pemeriksaan reflow/keyboard pada HP masih harus dijalankan, bukan dinyatakan
  lulus berdasarkan TypeScript atau pembacaan kode. Akses browser otomatis
  tidak tersedia pada sesi implementasi ini.
