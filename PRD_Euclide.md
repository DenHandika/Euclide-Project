# Product Requirements Document — Euclide

**Platform Tryout & Manajemen Bimbel**
Versi 0.1 (Draft) · 27 Agustus 2026

---

## 1. Latar Belakang & Tujuan

Euclide dibangun untuk sebuah lembaga bimbel dengan basis siswa **600–700 orang**, dengan estimasi **300–350 siswa mengakses tryout secara bersamaan** pada sesi puncak. Kebutuhan utama klien adalah satu sistem terintegrasi yang menggabungkan:

1. Mesin tryout online (setara fitur kompetitor seperti Alphastude/SIAPPTN)
2. Sistem analisis kelulusan PTN yang bisa menyesuaikan diri terhadap perubahan kriteria tiap tahun
3. Manajemen operasional bimbel (tentor, jadwal, pendaftaran, pembayaran)

Tidak ditemukan produk siap-pakai (Alphastude, SIAPPTN, TryoutPintar) yang mencakup seluruh scope ini dalam satu sistem — sebagian besar hanya modul tryout tanpa manajemen bimbel, atau sebaliknya. Euclide dikembangkan custom untuk mengisi celah tersebut.

---

## 2. Target Pengguna & Role

| Role | Deskripsi | Akses Utama |
|---|---|---|
| **Admin/Owner** | Pemilik & staf operasional (satu role, menu identik) | Semua data, analitik lintas kelas/tentor, laporan agregat, pendaftaran siswa, kuota kelas, pencatatan pembayaran, jadwal — **plus semua akses Tentor** (bank soal, koreksi essay, analisis siswa) |
| **Tentor** | Pengajar | Input bank soal, koreksi essay, analisis siswa bimbingannya |
| **Siswa** | Peserta bimbel | Mengerjakan tryout, melihat hasil & rekomendasi |

> **Catatan struktur role:** Owner dan Admin awalnya dirancang sebagai dua role terpisah, tapi disederhanakan menjadi **satu role dengan menu identik** — perbedaan "siapa pemilik, siapa staf" cukup diatur lewat data kepegawaian, bukan lewat permission sistem yang berbeda. Admin/Owner juga mewarisi seluruh akses Tentor (bank soal, koreksi essay, analisis siswa), sehingga admin/owner bisa turun tangan langsung tanpa harus login sebagai tentor.

---

## 3. Fitur Inti (Scope MVP)

### 3.1 Autentikasi & Manajemen Akun
- Login terpisah untuk 4 role di atas
- **Status akun siswa**: `aktif`, `nonaktif`, `lulus`, `cuti`
  - Login ditolak jika status bukan `aktif`
  - Admin mengubah status secara manual dari panel kelola siswa
  - *(Opsional v1.1)* Auto-nonaktif via cron job berdasarkan `tanggal_berakhir_bimbel`
- Data siswa tidak dihapus saat nonaktif/lulus — histori tryout & nilai tetap tersimpan untuk kebutuhan rekap

### 3.2 Bank Soal
- Input soal oleh **tentor dan admin**
- **4 tipe soal**:
  | Tipe | Penilaian |
  |---|---|
  | Pilihan tunggal (ABC) | Otomatis |
  | Pilihan ganda kompleks (lebih dari satu jawaban benar) | Otomatis |
  | Isian singkat | Otomatis (exact-match / pattern match) |
  | Essay | Manual oleh tentor |
- Tagging soal per mapel/subtes dan per jurusan/PTN terkait
- Riwayat pemakaian soal (berapa kali dipakai di paket tryout mana)

> **Catatan input rumus matematika (penting untuk usability tentor non-teknis):** Tentor tidak boleh diharuskan mengetik sintaks LaTeX/KaTeX manual (`$$...$$`). MVP wajib menyediakan **editor rumus visual** (contoh: MathLive) — tentor klik/pilih simbol matematika, sistem generate kode KaTeX otomatis di baliknya. Import massal dari Word (.docx, via mammoth.js) bisa untuk teks dan gambar, tapi rumus hasil konversi dari Equation Editor Word (format OMML) kemungkinan perlu dikoreksi manual lewat editor visual setelah import — ini bukan proses 100% otomatis. Import dari foto (OCR matematika via API seperti Mathpix) masuk roadmap Fase 3, bukan MVP, karena berbayar per-penggunaan dan akurasinya perlu koreksi manual juga.

### 3.3 Mesin Tryout
- Timer per sesi, autosave jawaban berkala
- Navigator soal dengan penanda "ragu-ragu"
- Antarmuka berbeda per tipe soal (pilihan tunggal, checkbox, input teks, textarea essay)
- Submit otomatis saat waktu habis

### 3.4 Penilaian
- Auto-grading untuk 3 tipe soal objektif
- Antrean koreksi manual untuk essay (interface tentor: baca jawaban → beri skor 0–100 → feedback opsional)
- Skor final siswa baru terkunci setelah semua komponen essay dinilai (jika ada campuran tipe soal)

### 3.5 Sistem Passing-Grade Adaptif
- Tabel referensi terpisah: `PTN`, `jurusan`, `skor_minimal`, `tahun_berlaku` — **dapat diedit admin/owner tanpa perlu deploy ulang**
- Sistem membandingkan skor tryout siswa terhadap baris tabel ini → status: *lolos / mendekati / perlu ditingkatkan*
- Siswa dapat memilih daftar PTN-jurusan yang diminati untuk dipantau
- Histori beberapa tahun disimpan untuk melihat tren perubahan passing grade

> **Catatan metodologi (penting untuk ekspektasi klien):** MVP menggunakan sistem skor tertimbang manual (bobot ditentukan tentor), bukan kalibrasi statistik IRT seperti kompetitor besar. IRT butuh volume data respons yang jauh lebih besar dari basis 600–700 siswa untuk stabil secara statistik. Migrasi ke IRT bisa dipertimbangkan di fase lanjutan setelah data historis cukup besar.

### 3.6 Analisis per Siswa
- Dashboard tren skor antar tryout (grafik garis)
- Breakdown skor per subtes vs target (radar chart)
- Rekomendasi arah jurusan berdasarkan performa relatif antar mapel (rule-based di MVP)
- Ranking **internal** (sesama siswa Euclide) — **bukan** ranking nasional, ditampilkan dengan jelas ke siswa agar tidak disalahartikan

### 3.7 Manajemen Bimbel (akses Admin/Owner)
- **Tentor**: profil, mapel yang diajar
- **Jadwal kelas**: nama kelas, hari/jam, tentor pengampu, kapasitas kuota
- **Pendaftaran siswa**: form daftar, validasi kuota (tolak otomatis jika kelas penuh), status menunggu/diterima
- **Pembayaran manual**: admin mencatat setiap pembayaran tunai per siswa per bulan (siswa bayar langsung ke admin setelah sesi kelas — bukan payment gateway otomatis di MVP)
- **Rekap & monitoring**: laporan siswa yang belum bayar bulan berjalan, riwayat tunggakan

### 3.8 Dashboard Ringkasan & Akses Tentor (Admin/Owner)
- Statistik lintas kelas/tentor: jumlah siswa aktif, rata-rata skor per kelas, jumlah tryout berjalan, jumlah tunggakan pembayaran
- Karena Admin/Owner mewarisi akses Tentor, menu bank soal, koreksi essay, dan analisis per siswa (lihat 3.2 dan 3.6) juga tersedia di sisi Admin/Owner — tanpa perlu akun terpisah

---

## 4. Di Luar Scope MVP (Roadmap Lanjutan)

| Fitur | Alasan ditunda |
|---|---|
| Kalibrasi skor IRT | Butuh volume data respons besar untuk akurasi |
| Ranking nasional | Butuh basis data lintas-lembaga, tidak tersedia untuk sistem internal |
| Payment gateway otomatis (QRIS/VA) | Klien masih menerima pembayaran tunai langsung; kompleksitas integrasi ditunda |
| Rasionalisasi nilai antar sesi tryout | Turunan dari IRT, sama-sama butuh data besar |
| Notifikasi otomatis (WA/email) | Nice-to-have, bukan blocker fungsi inti |

---

## 5. Kebutuhan Non-Fungsional

- **Skala pengguna**: 600–700 total siswa, hingga ±350 concurrent saat sesi tryout serentak
- **Ketersediaan saat sesi tryout**: prioritas tinggi — downtime saat tryout live sangat merugikan; perlu load testing sebelum sesi resmi pertama
- **Autosave**: jawaban siswa tidak boleh hilang meski koneksi terputus sesaat
- **Keamanan data**: nilai dan data pribadi siswa tidak boleh bisa diakses lintas role tanpa izin (mis. siswa lain tidak bisa lihat nilai siswa lain)

### 5.1 Prioritas Optimasi Performa (disesuaikan skala MVP — jangan over-engineer)

**Wajib di MVP (sepadan dengan skala 600-700 siswa / ~350 concurrent):**
- Database indexing pada kolom yang sering di-query (NIS, tryout_id, siswa_id, dsb.)
- Redis caching (cache-aside) untuk data yang sering dibaca tapi jarang berubah (referensi passing-grade, daftar soal aktif)
- Connection pooling (PgBouncer) — krusial saat ratusan siswa submit jawaban bersamaan
- Rate limiting pada endpoint login & submit jawaban
- CDN untuk asset statis (gambar soal, font, JS bundle)
- Reverse proxy (Nginx) untuk SSL termination dan kompresi — cukup di satu server

**Ditunda ke fase lanjutan (baru relevan kalau skala bertambah signifikan):**
- Load balancing penuh dengan multiple app server instance — baru dibutuhkan kalau Euclide melayani lebih dari satu bimbel klien (multi-tenant) atau satu server terbukti kewalahan meski sudah dioptimasi di atas
- Horizontal auto-scaling

> **Prinsip:** optimasi di atas diurutkan sesuai skala aktual proyek, bukan dipasang semua sekaligus di awal. Load balancer tanpa kebutuhan nyata cuma menambah biaya hosting (minimal 2 instance) dan kompleksitas deployment tanpa manfaat sepadan di tahap MVP.

---

## 6. Tumpukan Teknologi (Rencana)

| Layer | Pilihan |
|---|---|
| Frontend | Next.js |
| Backend | Laravel + Filament (panel admin) |
| Database | PostgreSQL |
| Cache/Session | Redis |
| Storage | S3-compatible (Cloudflare R2) |
| Hosting | VPS (Hetzner, cek ketersediaan region Singapura untuk latensi) |

---

## 7. Identitas Visual

- Logo Euclide: emblem geometris (navy, kuning/amber, merah) di atas latar gelap
- Palet aplikasi: latar terang (putih/krem) dengan aksen warna logo untuk elemen navigasi dan status
- Motif khas: bubble jawaban bergaya lembar OMR, dipakai konsisten di navigasi soal dan indikator status
- Prototipe UI (role Siswa/Tentor/Admin/Owner) sudah dibuat sebagai referensi desain — lihat `euclide_prototype.jsx`

---

## 8. Asumsi & Pertanyaan Terbuka

- [ ] Apakah admin butuh kemampuan **impor massal** data siswa (dari Excel) saat migrasi awal, atau input satu-satu cukup untuk mulai?
- [ ] Berapa lama data tryout siswa yang sudah lulus/nonaktif perlu disimpan? (kebijakan retensi data)
- [ ] Apakah tentor boleh melihat bank soal milik tentor lain, atau hanya soal buatannya sendiri?
- [ ] Format kuota kelas: apakah kuota per kelas tetap sepanjang periode, atau bisa berubah di tengah jalan (mis. ada siswa keluar, kuota terbuka lagi)?
- [ ] Apakah dibutuhkan fitur ekspor hasil tryout ke PDF/Excel untuk dibagikan ke orang tua siswa?

---

## 9. Rencana Fase Pengembangan (Disarankan)

| Fase | Cakupan |
|---|---|
| **Fase 1 (MVP)** | Autentikasi 4 role, bank soal, mesin tryout, penilaian (termasuk essay manual), passing-grade adaptif dasar |
| **Fase 2** | Analisis per siswa lengkap, jadwal kelas, pendaftaran + kuota |
| **Fase 3** | Pencatatan pembayaran manual + rekap, dashboard owner |
| **Fase 4 (opsional, jangka panjang)** | Eksplorasi IRT, payment gateway otomatis, notifikasi WA/email |

