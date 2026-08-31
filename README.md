# EUCLIDE — EdTech CBT Tryout & Bimbel Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-Math_Engine-319795?style=flat-square)](https://katex.org/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-22c55e?style=flat-square)](https://recharts.org/)
[![SheetJS](https://img.shields.io/badge/SheetJS-Excel_Parser-107c41?style=flat-square&logo=microsoft-excel)](https://sheetjs.com/)

Platform **Computer-Based Test (CBT)** Tryout dan **Sistem Informasi Manajemen Bimbingan Belajar (Bimbel)** modern berstandar resmi UTBK-SNBT 2026 yang dilengkapi dengan perhitungan Item Response Theory (IRT), rasionalisasi target PTN, bank soal matematika berbasis KaTeX, manajemen kuota kelas, pembukuan kas, serta import massal pembayaran SPP via Excel.

---

## 🚀 Fitur Utama

### 1. 🔀 Interactive Demo Role Switcher (Multi-Peran)
Beralih peran secara instan dengan satu klik melalui widget mengambang (*floating pill*):
- **Super-Admin / Owner Bimbel:** Dashboard keuangan kas, import massal data pembayaran Excel (.xlsx/.csv), manajemen kuota batch, roster siswa, dan bank soal.
- **Tentor / Instruktur:** Antrean koreksi esai manual dengan slider rubrik skor (0–100), bank soal formula KaTeX, dan analitik subtest.
- **Siswa / Peserta:** Engine ujian CBT (Mobile-First), timer subtest presisi, palet nomor berwarna, dan rasionalisasi PTN pasca-ujian.
- **Simulasi Status Khusus:** Uji banner akun *Suspended (Tunggakan SPP)* dan *Graduated (Alumni Expired)*.

### 2. 📱 Mobile-First Student CBT Exam Engine (`/exam/[id]`)
- **Stepper Subtest & Countdown Timer:** Hitung mundur waktu per subtest UTBK dengan auto-advance dan peringatan visual.
- **4 Format Soal UTBK:**
  1. *Pilihan Ganda (ABCDE)*
  2. *Pilihan Majemuk (Kotak Ceklis/Checkbox)*
  3. *Isian Singkat (Short Answer)* dengan auto-validasi case-insensitive
  4. *Esai Argumentatif* dengan penghitung jumlah kata langsung (*live word counter*)
- **Rendering Rumus KaTeX:** Integral $\int$, Matriks $\begin{pmatrix}a&b\\c&d\end{pmatrix}$, pecahan $\frac{a}{b}$, akar $\sqrt{x}$, dan persamaan kalkulus tanpa gambar statis.
- **Palet Nomor Soal Interaktif:**
  - 🟢 Hijau = Sudah Dijawab
  - 🟡 Kuning = Ragu-ragu (Flagged)
  - ⚪ Abu-abu = Belum Dijawab / Kosong
- **Sistem Anti-Kecurangan (Anti-Cheat Client-side):**
  - Mode layar penuh (*Fullscreen toggle*).
  - Deteksi berpindah tab / jendela (`visibilitychange` & `window.blur`) dengan modal peringatan toleransi pelanggaran (*Peringatan 1/3*).
  - Proteksi copy-paste dan disable text selection (`user-select: none`).

### 3. 🎯 Rasionalisasi Peluang PTN SNBT (`/exam/[id]/result`)
- **Kartu Skor IRT:** Skor rata-rata UTBK (0–1000) dan peringkat persentil nasional.
- **Target PTN Passing Grade Analysis:**
  - 🟢 **Zona Aman (Lolos)**
  - 🟡 **Zona Kompetitif (Waspada)**
  - 🔴 **Zona Kritis**
- **Visualisasi Recharts:**
  - **Radar Chart 7 Subtest:** Memetakan kekuatan siswa dibanding rerata nasional BPPP.
  - **Bar Chart:** Distribusi nilai tiap subtest.
- **Catatan Strategi & Pembahasan KaTeX:** Masukan strategi dari Master Tentor dan kunci jawaban langkah demi langkah.

### 4. 📊 Manajemen Keuangan & Excel Bulk Import (`/admin/payments`)
- **SheetJS (.xlsx / .csv) Parser:** Drag-and-drop file spreadsheet pembayaran SPP langsung di browser.
- **Tabel Validasi Baris:** Otomatis mendeteksi baris valid vs error sebelum disimpan ke database.
- **Unduh Template Excel:** Generate sample template file `.xlsx` dengan 1 klik.
- **Entri Kasir Tunai & Cetak Kuitansi:** Form manual walk-in payment dengan generator kuitansi digital resmi yang siap dicetak/disimpan ke PDF.

### 5. ✍️ Bank Soal & Koreksi Esai Tentor (`/admin/questions` & `/tentor/grading`)
- **Editor Formula KaTeX Live:** Pratinjau rumus instan dengan tombol shortcut cepat pecahan, matriks, integral, dan simbol Yunani.
- **Antrean Koreksi Esai:** Tampilan side-by-side soal vs jawaban siswa, slider rubrik 0–100, dan feedback komentar.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Math Rendering:** [KaTeX](https://katex.org/)
- **Charts & Data Viz:** [Recharts](https://recharts.org/)
- **Spreadsheet Engine:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** Reactive Context & LocalStorage Persistence (Zero-DB setup required for Vercel demo)

---

## 📦 Panduan Instalasi Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/project-euclide.git
   cd project-euclide
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

4. **Build untuk produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deployment ke Vercel

Aplikasi ini 100% siap di-deploy ke Vercel tanpa perlu konfigurasi database tambahan karena seluruh state tersimpan secara reaktif dengan persistensi LocalStorage.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📄 Lisensi
Hak Cipta © 2026 EUCLIDE EdTech System. Dikembangkan untuk simulasi UTBK-SNBT dan manajemen bimbel modern.
