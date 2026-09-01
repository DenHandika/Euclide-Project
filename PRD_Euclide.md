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
- Login terpisah untuk **3 role** (Admin/Owner, Tentor, Siswa)
- **Metode Login Siswa**:
  - Login 1-klik via **Google Sign-In (OAuth)** yang disaring secara otomatis dengan *whitelist* database email siswa aktif di sistem
  - Login manual dengan NIS / Email terdaftar
- **Status akun siswa**: `aktif`, `nonaktif`, `lulus`, `cuti`
  - Login ditolak secara ketat jika status bukan `aktif`
  - Admin mengubah status secara manual dari panel kelola siswa
  - *(Opsional v1.1)* Auto-nonaktif via cron job berdasarkan `tanggal_berakhir_bimbel`
- Data siswa tidak dihapus saat nonaktif/lulus — histori tryout & nilai tetap tersimpan permanen (*Read-Only*) untuk kebutuhan rekap angkatan dan arsip promosi

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

#### 3.3.1 Protokol Keamanan & Anti-Curang (Khusus Smartphone & Desktop)
- **Deteksi Kehilangan Fokus Layar (*Visibility Change / Blur Detection*):**
  - Sistem mencatat dan memberi peringatan visual real-time jika peserta berpindah tab, membuka aplikasi lain (seperti ChatGPT/Google AI), meminimalkan browser, atau mengaktifkan mode *split-screen* di smartphone.
  - Batas toleransi pelanggaran dapat dikonfigurasi (misal maks. 3 kali pelanggaran); jika melebihi batas, sesi ujian otomatis terkunci atau langsung di-submit paksa (*auto-submit on violation*).
- **Proteksi Konten Soal:**
  - Menonaktifkan seleksi teks (*disable text-selection / `user-select: none`*).
  - Memblokir fungsi klik kanan (*disable context menu*) dan kombinasi tombol copy-paste (`Ctrl+C`, `Ctrl+V`, `Cmd+C`).
  - Mode layar penuh (*fullscreen trigger*) yang mengunci interaksi selama sesi tryout berlangsung.

### 3.4 Penilaian
- Auto-grading untuk 3 tipe soal objektif
- Antrean koreksi manual untuk essay (interface tentor: baca jawaban → beri skor 0–100 → feedback opsional)
- Skor final siswa baru terkunci setelah semua komponen essay dinilai (jika ada campuran tipe soal)

### 3.5 Sistem Passing-Grade & Rasionalisasi 4 Pilihan SNBT Dinamis
- **Pemilihan 4 Pilihan Program Studi (Standar SNBT BPPP Terbaru):**
  - Siswa dapat menentukan hingga **4 Pilihan Program Studi** (kombinasi Sarjana S1, Sarjana Terapan D4, dan Diploma D3) sebelum memulai simulasi ujian maupun diubah di profil target siswa.
  - Aturan kombinasi pilihan mengikuti regulasi resmi SNPMB BPPP:
    - *Pilihan 1:* Bebas (S1 / D4 / D3)
    - *Pilihan 2:* Bebas (S1 / D4 / D3)
    - *Pilihan 3:* Program Vokasi (D4 / D3)
    - *Pilihan 4:* Program Vokasi (D3)
    - *(Atau variasi 2 Akademik S1 + 2 Vokasi D4/D3).*
- **Cakupan Basis Data Nasional (Universitas, Institut, & Politeknik Negeri):**
  - Database referensi mencakup seluruh perguruan tinggi negeri di Indonesia (PTN Akademik & Politeknik Negeri Vokasi).
  - Skema data referensi: `ptn_nama`, `jenjang (S1/D4/D3)`, `rumpun (Saintek/Soshum)`, `daya_tampung (kuota SIDATA PTN)`, `peminat_tahun_lalu`, `keketatan_persen`, `target_skor_historis`, `tahun_akademik_berlaku`.
- **Pembaruan Data Dinamis per Tahun Ajaran:**
  - Data referensi daya tampung dan skor target dipisahkan dari kode program.
  - Admin/Owner dapat memperbarui atau mengimpor data PTN/Politeknik tahunan secara massal via **file Excel (.xlsx / CSV)** di setiap awal tahun ajaran baru tanpa perlu redeploy aplikasi.
- **Evaluasi Rasionalisasi & Simulasi Interaktif (*What-If Analysis*):**
  - Sistem membandingkan skor tertimbang hasil tryout siswa terhadap target passing grade ke-4 jurusan terpilih $\to$ status indikator:
    - 🟢 **Lolos (Zona Aman):** Skor siswa $\ge$ Target Passing Grade.
    - 🟡 **Mendekati (Zona Waspada):** Skor siswa terpaut $\le 35$ poin dari target.
    - 🔴 **Perlu Peningkatan:** Skor siswa masih berada di bawah ambang batas.
  - Di halaman hasil evaluasi, siswa dapat melakukan simulasi ganti jurusan secara bebas (*What-If Simulator*) untuk menguji peluang kelulusan pada kombinasi kampus dan program studi lainnya.

> **Catatan metodologi (penting untuk ekspektasi klien):** MVP menggunakan sistem skor tertimbang manual (bobot ditentukan tentor), bukan kalibrasi statistik IRT seperti kompetitor besar. IRT butuh volume data respons yang jauh lebih besar dari basis 600–700 siswa untuk stabil secara statistik. Migrasi ke IRT bisa dipertimbangkan di fase lanjutan setelah data historis cukup besar.

### 3.6 Analisis per Siswa
- Dashboard tren skor antar tryout (grafik garis)
- Breakdown skor per subtes vs target (radar chart)
- Rekomendasi arah jurusan berdasarkan performa relatif antar mapel (rule-based di MVP)
- Ranking **internal** (sesama siswa Euclide) — **bukan** ranking nasional, ditampilkan dengan jelas ke siswa agar tidak disalahartikan

### 3.7 Manajemen Bimbel (akses Admin/Owner)
- **Tentor**: profil, mapel yang diajar
- **Jadwal kelas**: nama kelas, hari/jam, tentor pengampu, kapasitas kuota dinamis
- **Pendaftaran siswa**: form daftar, validasi kuota (tolak otomatis jika kelas penuh), status menunggu/diterima
- **Pembayaran SPP**:
  - **Pencatatan Manual Kasir**: admin mencatat setiap pembayaran tunai per siswa per bulan (siswa bayar langsung ke admin setelah sesi kelas)
  - **Impor Massal Riwayat Pembayaran via Excel (.xlsx/CSV)**: admin dapat mengunggah spreadsheet rekonsiliasi pembayaran SPP lama/massal untuk mempercepat migrasi data awal tanpa harus menginput ratusan transaksi satu per satu
- **Rekap & monitoring**: laporan siswa yang belum bayar bulan berjalan, riwayat tunggakan, dan cetak kuitansi resmi

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

## 8. Keputusan Final atas Pertanyaan Terbuka

- [x] **Impor massal data siswa dari Excel:** $\to$ **Wajib di MVP**. Menginput 600–700 siswa satu per satu akan memakan waktu admin berhari-hari. Disediakan tombol **"Upload Data Siswa (.xlsx)"** dengan validasi kolom otomatis.
- [x] **Kebijakan retensi data siswa lulus:** $\to$ **Disimpan selamanya (Read-Only)**. Status akun siswa diubah menjadi `graduated`/`lulus`, sehingga histori nilai dan riwayat tryout tetap bisa diakses oleh admin/tentor untuk kebutuhan arsip promosi atau statistik angkatan.
- [x] **Hak akses bank soal antar-tentor:** $\to$ **Bersifat Terbuka/Kolaboratif di Internal Bimbel**. Semua tentor dan admin/owner bisa saling melihat dan menggunakan soal untuk menyusun paket tryout bersama.
- [x] **Sifat kuota kelas:** $\to$ **Dinamis**. Sistem menghitung `jumlah_siswa_aktif < kapasitas_maksimal`. Jika ada siswa yang batal/keluar, slot kelas otomatis terbuka kembali secara real-time.
- [x] **Ekspor PDF/Excel hasil tryout:** $\to$ **Wajib di Fase 2**. Sangat krusial bagi bimbel untuk membagikan rapor hasil tryout bergaya resmi (berlogo Euclide/Bimbel) ke grup WhatsApp orang tua siswa.
- [x] **Rasionalisasi 4 Pilihan PTN & Basis Data Kampus Dinamis:** $\to$ **Wajib di MVP**. Mendukung pemilihan hingga 4 program studi (S1 Akademik & Vokasi D4/D3) sesuai regulasi resmi SNBT BPPP terbaru, dengan basis data seluruh Universitas, Institut, dan Politeknik Negeri yang dapat diperbarui secara dinamis via Excel (.xlsx/CSV) di setiap awal tahun ajaran baru.

---

## 9. Rencana Fase Pengembangan (Disarankan)

| Fase | Cakupan |
|---|---|
| **Fase 1 (MVP)** | Autentikasi 3 role (termasuk Google Sign-In), bank soal (Math visual & import Word), mesin tryout dengan anti-curang, penilaian (auto & essay manual), passing-grade adaptif dasar, import Excel siswa & pembayaran |
| **Fase 2** | Analisis per siswa lengkap, jadwal kelas, pendaftaran + kuota dinamis, ekspor rapor PDF/Excel hasil tryout |
| **Fase 3** | Pencatatan pembayaran manual + rekap kas lengkap, dashboard owner agregat |
| **Fase 4 (opsional, jangka panjang)** | Eksplorasi IRT, payment gateway otomatis (QRIS/VA), notifikasi WA/email |

