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
| **Orang Tua/Wali (kebutuhan baru)** | Pendamping siswa; hubungan dengan siswa diverifikasi admin | Melihat performa anak yang terhubung secara read-only; rincian login dan laporan dikonfirmasi ke klien (lihat 3.6.1) |

> **Catatan struktur role:** Owner dan Admin awalnya dirancang sebagai dua role terpisah, tapi disederhanakan menjadi **satu role dengan menu identik** — perbedaan "siapa pemilik, siapa staf" cukup diatur lewat data kepegawaian, bukan lewat permission sistem yang berbeda. Admin/Owner juga mewarisi seluruh akses Tentor (bank soal, koreksi essay, analisis siswa), sehingga admin/owner bisa turun tangan langsung tanpa harus login sebagai tentor.

---

## 3. Fitur Inti (Scope MVP)

### 3.1 Autentikasi & Manajemen Akun
- Login terpisah untuk **3 role operasional** (Admin/Owner, Tentor, Siswa), ditambah rencana akses Orang Tua/Wali untuk pemantauan anak (lihat 3.6.1). Implementasi akun dan API saat ini masih mendukung tiga role; akses orang tua belum dibangun.
- **Metode Login Siswa**:
  - Login 1-klik via **Google Sign-In (OAuth)** yang disaring secara otomatis dengan *whitelist* database email siswa aktif di sistem
  - Login manual dengan Kode Siswa / Email terdaftar
- **Identitas internal siswa:** sistem Euclide membuat **Kode Siswa secara otomatis saat registrasi pertama**, dengan format konsisten, misalnya `EUC-2026-0001`. Kode tidak diinput manual oleh admin/orang tua, tidak berasal dari sekolah atau sumber eksternal, dan tidak berubah saat naik tingkat, daftar ulang, atau reaktivasi akun.
  - Tampilkan Kode Siswa pada profil/panel admin dan **kartu atau struk pendaftaran yang dapat dicetak**, agar admin dan orang tua memiliki catatannya.
  - Kode Siswa adalah kunci pencocokan untuk **semua impor massal yang merujuk siswa existing**, termasuk daftar ulang dan pembayaran. Nama hanya untuk verifikasi, bukan kunci pencocokan.
  - NIS merupakan identitas sekolah masing-masing siswa; jika disimpan, hanya sebagai data tambahan, **bukan kunci login/pencocokan impor dan bukan identitas unik global bimbel**.
- **Desain database identitas:** pisahkan primary key teknis `id` (dibuat otomatis oleh database/server, tidak pernah diinput manual, digunakan oleh foreign key) dari `kode_siswa` (business identifier, `NOT NULL` dan `UNIQUE`, digunakan pada Excel/import). Generator Kode Siswa harus aman terhadap registrasi bersamaan; jangan memakai hitungan `MAX + 1` tanpa mekanisme atomik. Kode yang sudah diterbitkan tidak boleh dipakai ulang untuk siswa lain.
- **Status akun siswa**: `aktif`, `nonaktif`, `lulus`, `cuti`
  - **Default MVP:** login ditolak sepenuhnya jika status bukan `aktif`. Status `lulus` memblokir login sama seperti `nonaktif`, baik melalui Google Sign-In maupun login manual; siswa tidak mendapat akses alumni pada MVP.
  - Pemeriksaan status berlaku juga pada sesi yang sudah login dan endpoint fitur terlindungi. Perubahan status menjadi `lulus`/`nonaktif` harus menghentikan akses, bukan hanya menolak login berikutnya.
  - Admin dapat mengubah status individual dari panel kelola siswa; daftar ulang tahunan diproses melalui impor massal dengan preview dan konfirmasi (lihat 3.1.2), bukan wajib diperbarui satu per satu.
  - *(Opsional v1.1)* Auto-nonaktif via cron job berdasarkan `tanggal_berakhir_bimbel`
- **Retensi riwayat:** data siswa tidak dihapus saat nonaktif/lulus. Histori tryout dan nilai tetap tersimpan untuk rekap angkatan dan arsip sesuai hak akses admin/tentor. Istilah arsip *read-only* tidak berarti siswa lulus dapat login pada MVP.
- **Mode alumni read-only (opsional fase lanjutan, bukan kewajiban MVP):** hanya dibangun setelah dikonfirmasi dan disetujui klien. Jika diaktifkan, siswa berstatus `lulus` hanya boleh melihat riwayat tryout dan nilai lama **miliknya sendiri**, tanpa memulai tryout baru atau mengakses fitur aktif lainnya. Pembatasan wajib diterapkan pada server/API, bukan hanya menyembunyikan menu.

#### 3.1.1 Daftar Ulang & Pencegahan Akun Duplikat

- **Daftar ulang adalah alur tahunan normal untuk mayoritas siswa**, berlangsung pada akhir tahun ajaran ketika siswa naik tingkat bimbel dan wajib membayar kembali biaya pendaftaran. Proses mencakup **300+ siswa dalam periode singkat**, sehingga tidak boleh bergantung pada input atau perubahan status satu per satu. Siswa gap year/mengulang UTBK yang kembali juga menggunakan alur identitas yang sama.
- Siswa yang daftar ulang **wajib menggunakan akun yang sama**, bukan membuat identitas siswa baru. Akun yang sudah `aktif` tetap menggunakan identitas tersebut; akun `lulus` atau `nonaktif` diaktifkan kembali setelah konfirmasi proses daftar ulang.
- Pertahankan ID siswa, Kode Siswa, dan keterkaitan seluruh histori tryout/nilai tahun sebelumnya agar progres lintas tahun tersambung pada satu identitas. Pendaftaran kelas/angkatan baru dicatat sebagai pendaftaran baru yang terhubung ke akun existing.
- Sebelum membuat akun melalui form pendaftaran/admin, sediakan langkah **cari siswa existing berdasarkan Kode Siswa/nama**, termasuk akun `lulus` dan `nonaktif`. Jika ditemukan, tampilkan opsi **daftar ulang/aktifkan kembali** beserta identitas siswa untuk diperiksa admin.
- Kode Siswa tidak dapat ditetapkan manual saat membuat akun baru. Validasi server dan constraint unik database mencegah kode duplikat. Nama hanya dipakai untuk menemukan kandidat; kesamaan nama tidak boleh otomatis menggabungkan akun karena siswa berbeda dapat memiliki nama yang sama.
- Impor siswa baru dan impor daftar ulang merupakan alur berbeda. Pada impor siswa baru, sistem membuat `id` dan `kode_siswa` otomatis untuk setiap registrasi baru yang disetujui, lalu menyediakan hasil kode untuk kartu/struk. Data yang mengacu Kode Siswa existing ditandai untuk ditinjau melalui alur siswa existing; **impor daftar ulang tidak pernah otomatis membuat akun baru** (lihat 3.1.2).
- **Kriteria penerimaan MVP:** akun `lulus`/`nonaktif` tidak dapat login; daftar ulang mempertahankan ID dan Kode Siswa lama; histori nilai tetap tersambung setelah reaktivasi; pembuatan akun dengan Kode Siswa existing ditolak.

#### 3.1.2 Import Massal Daftar Ulang Tahunan (Wajib MVP)

Fitur **Import Daftar Ulang** disediakan tersendiri di panel Admin/Owner, terpisah dari impor siswa baru dan impor pembayaran SPP bulanan rutin. Mendukung sedikitnya 300 baris siswa dalam satu batch tanpa admin harus mengubah akun satu per satu.

**Alur wajib:**

1. Admin menekan tombol **“Unduh Template Excel”**. Sistem menghasilkan file `.xlsx` **kosong tanpa data siswa**, dengan header tepat: **Kode Siswa**, **Nama untuk verifikasi**, **Kelas/Tingkat Tujuan**, dan **Status Pembayaran Daftar Ulang**. Admin mengisi file menggunakan Kode Siswa yang telah diterbitkan pada kartu/struk pendaftaran, lalu memilih tahun ajaran/periode daftar ulang untuk batch tersebut. Kode Siswa diperlakukan sebagai teks agar format dan nol pada nomor urut tetap utuh. Petunjuk nilai status pembayaran/kelas disediakan agar admin tidak perlu menebak format yang diterima.
2. Admin mengunggah file. Sistem memvalidasi format, kolom wajib, duplikasi Kode Siswa dalam file, kelas/tingkat tujuan, dan nilai status pembayaran sebelum menyiapkan pencocokan.
3. Sistem mencocokkan setiap baris **berdasarkan Kode Siswa ke siswa yang sudah ada**, termasuk siswa aktif, nonaktif, dan lulus:
   - **Kode Siswa cocok dan nama sesuai:** siapkan perubahan status menjadi `aktif` bila sebelumnya `nonaktif`/`lulus`, pendaftaran/perpindahan ke kelas atau tingkat tujuan pada periode baru, serta pencatatan pembayaran pendaftaran ulang sesuai status yang diunggah. Akun yang sudah aktif tetap aktif. ID, Kode Siswa, histori kelas/angkatan, tryout, dan nilai lama tetap dipertahankan.
   - **Kode Siswa cocok tetapi nama berbeda:** tandai **perlu verifikasi manual** dan blokir baris dari eksekusi sampai diperbaiki/diverifikasi admin. Jangan mengganti nama siswa existing dari file. Ini mencegah typo Kode Siswa yang kebetulan cocok dengan siswa lain mengubah akun yang salah.
   - **Kode Siswa tidak ditemukan:** tandai **“Kemungkinan siswa baru”**; **jangan otomatis membuat akun baru**. Admin memeriksa typo Kode Siswa atau memutuskan pendaftaran siswa baru melalui alur terpisah.
   - Baris dengan data tidak valid atau kondisi lain yang belum memiliki aturan (misalnya status `cuti`) masuk antrean pemeriksaan manual, bukan diubah diam-diam.
4. Tampilkan **PREVIEW WAJIB sebelum eksekusi ke database**: jumlah total baris, siswa yang **akan diperbarui**, Kode Siswa tidak ditemukan, dan baris yang perlu diperiksa. Tampilkan rincian per baris: Kode Siswa/nama dalam file dan identitas hasil pencocokan, status akun lama → baru, kelas/tingkat lama → tujuan, serta perubahan status pembayaran. Pada tahap ini belum ada perubahan akun, pendaftaran kelas, atau transaksi pembayaran.
5. Admin memeriksa preview, memperbaiki/mengunggah ulang file bila perlu, atau secara eksplisit mengecualikan baris bermasalah. **Hanya setelah konfirmasi admin**, jalankan perubahan untuk baris valid yang telah disetujui. Baris bermasalah tidak ikut dieksekusi dan tidak boleh dilewati tanpa ditampilkan.
6. Tampilkan ringkasan hasil aktual dan laporan per baris: berhasil, dikecualikan, atau gagal beserta alasannya. Jumlah hasil harus dapat direkonsiliasi dengan preview yang dikonfirmasi.

**Ketentuan integritas proses massal:**

- Konfirmasi harus terikat pada file/batch, periode, dan isi preview yang ditinjau. Jika data siswa, tarif, atau kelas berubah setelah preview, validasi ulang dan minta admin meninjau preview terbaru sebelum menerapkan perubahan yang berbeda.
- Perubahan status, pendaftaran kelas/tingkat, dan pencatatan pembayaran untuk satu siswa harus konsisten dalam satu transaksi: kegagalan pada salah satunya tidak boleh meninggalkan perubahan sebagian. Kuota kelas tujuan harus divalidasi kembali saat eksekusi jika kelas menggunakan batas kapasitas.
- Eksekusi harus **idempotent**: klik konfirmasi berulang, retry jaringan, atau unggahan ulang tidak boleh menggandakan pendaftaran maupun pembayaran siswa untuk periode dan jenis biaya yang sama. Koreksi pembayaran existing harus menjadi tindakan pembaruan eksplisit yang terlihat pada preview.
- Status pembayaran harus menggunakan nilai yang terdokumentasi pada template. Status belum dibayar tidak boleh menghasilkan penerimaan kas fiktif. Karena template hanya memuat status pembayaran, nominal pencatatan harus berasal dari tarif daftar ulang yang dikonfigurasi untuk periode/tingkat dan ditampilkan pada preview; jika tarif belum tersedia atau nilai pembayaran tidak dapat ditentukan, tandai untuk pemeriksaan, jangan mengarang nominal.
- Simpan jejak audit: admin pelaksana, waktu konfirmasi/eksekusi, batch dan periode, identitas siswa, perubahan sebelum/sesudah, serta hasil pemrosesan. Pencocokan nama digunakan untuk verifikasi identitas, bukan sebagai pengganti Kode Siswa atau dasar penggabungan akun otomatis.

**Kriteria penerimaan MVP:** tombol Unduh Template Excel menghasilkan `.xlsx` kosong dengan empat header yang ditentukan; batch 300+ siswa dapat dipreview dan dikonfirmasi tanpa pembaruan individual; pencocokan hanya menggunakan Kode Siswa internal, bukan NIS; upload/preview tidak mengubah data operasional; Kode Siswa tidak ditemukan tidak membuat akun; perbedaan nama dan Kode Siswa duplikat ditandai sebelum eksekusi; hanya baris yang disetujui diperbarui; retry tidak menggandakan pendaftaran/pembayaran; histori siswa tetap tersambung ke akun lama.

#### 3.1.3 Pengajuan Pendaftaran Siswa Baru

- **Keputusan alur:** calon siswa boleh mengajukan pendaftaran mandiri dari landing page publik; Admin/Owner juga dapat membantu menginput pengajuan dari panel admin.
- Pengajuan merupakan data calon siswa, **bukan akun siswa aktif**. Tidak otomatis masuk whitelist login, mendapat akses tryout, atau memperoleh Kode Siswa hanya karena formulir dikirim. Gunakan nomor pengajuan terpisah untuk pelacakan.
- Status pengajuan: `menunggu`, `diterima`, atau `ditolak`. Admin memeriksa identitas, kemungkinan akun lama/duplikat, program/kelas tujuan, dan kuota sebelum memutuskan. Catat admin pemeriksa, waktu, dan alasan keputusan.
- Pada penerimaan siswa baru, server membuat identitas siswa dan Kode Siswa otomatis satu kali; penempatan kelas dan penyelesaian administrasi mengikuti kebijakan pendaftaran. Status pengajuan dan status akun tetap terpisah; persetujuan bukan bypass persyaratan aktivasi/pembayaran.
- Jika ditemukan siswa lama, gunakan akun dan Kode Siswa existing melalui alur daftar ulang, bukan membuat akun kedua. Pengajuan ulang/retry tidak boleh menggandakan akun atau pendaftaran.
- Landing page menjadi halaman publik berisi pengenalan Euclide, program, alur bergabung, dan FAQ. Formulir pengajuan, pelacakan status, serta layar penerimaan/penolakan admin dikembangkan sebagai alur berikutnya, dengan validasi server dan perlindungan spam sebelum dibuka untuk publik.

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

### 3.5 Sistem Passing-Grade Adaptif & Rasionalisasi Pilihan Program Studi SNBT

#### 3.5.1 Alur Preferensi Sebelum Tryout (Permintaan Klien)

- **Alur utama wajib:** pilih paket tryout → pilih PTN dan program studi incaran → validasi kombinasi dan konfirmasi prioritas → mulai tryout → lihat hasil terhadap pilihan tersebut.
- Siswa menetapkan **1–4 program studi sebelum mengerjakan tryout**. Batasnya adalah jumlah program studi, **bukan jumlah kampus**; pilihan dapat berasal dari PTN yang sama maupun berbeda.
- Preferensi pada profil boleh digunakan kembali, tetapi siswa tetap meninjau dan mengonfirmasi pilihan sebelum memulai setiap tryout.
- Urutan pilihan 1–4 menyatakan **prioritas**. Dalam seleksi SNBT, jika diterima pada pilihan yang lebih tinggi, pilihan setelahnya tidak dilanjutkan; jika diterima pada pilihan 1, pilihan 2–4 tidak diproses.
- Simpan salinan pilihan beserta urutan, tahun aturan, dan referensi target skor pada sesi tryout saat ujian dimulai. Perubahan preferensi profil setelahnya tidak mengubah dasar evaluasi hasil tryout tersebut.
- Gunakan istilah **SNBT (Seleksi Nasional Berdasarkan Tes)** untuk fitur dan informasi seleksi yang berlaku; istilah lama “SBMPTN” tidak digunakan untuk alur ini.

#### 3.5.2 Validasi Kombinasi Jenjang Sesuai SNPMB

Akademik = **Sarjana (S1)**. Vokasi = **Diploma Empat/Sarjana Terapan (D4)** atau **Diploma Tiga (D3)**. Kategori ditentukan oleh program studinya, bukan oleh nama atau jenis PTN.

| Jumlah program studi | Kombinasi yang diperbolehkan |
|---|---|
| **1–2 pilihan** | Bebas kombinasi S1, D4, dan D3. |
| **3 pilihan** | **2 akademik + 1 vokasi**, atau **1 akademik + 2 vokasi**, atau **3 vokasi dengan minimal 1 D3**. |
| **4 pilihan** | **2 akademik + 2 vokasi dengan minimal 1 D3**, atau **1 akademik + 3 vokasi dengan minimal 1 D3**. |

- Untuk tiga pilihan, syarat minimal satu D3 hanya berlaku pada kombinasi **tiga vokasi**; kombinasi campuran akademik dan vokasi tidak wajib menyertakan D3.
- Empat pilihan semuanya S1 tidak diperbolehkan. Kombinasi empat pilihan yang tidak termasuk dua pola pada tabel juga tidak diperbolehkan.
- Validasi diterapkan pada **komposisi seluruh daftar**, bukan dengan mewajibkan posisi ke-3 selalu vokasi atau posisi ke-4 selalu D3. Urutan tetap mengikuti prioritas siswa.
- **Acuan terverifikasi:** [SNPMB — Informasi Umum UTBK-SNBT 2026, Ketentuan Pilihan Program Studi](https://www.snpmb.id/utbk-snbt/informasi-umum), diperiksa **1 Oktober 2026**. Aturan disimpan dengan tahun berlaku dan ditinjau kembali saat ketentuan resmi tahun berikutnya diterbitkan; aturan 2026 tidak otomatis diklaim berlaku untuk 2027.

#### 3.5.3 Validasi Real-Time & Implikasi Data

- Validasi ulang setiap siswa menambah, mengganti, menghapus, atau mengurutkan pilihan, terutama saat menyusun pilihan ke-3 dan ke-4.
- Tampilkan jumlah pilihan, prioritas, label jenjang, dan pesan koreksi yang mudah dipahami di HP. Contoh: **“Untuk 4 pilihan, sertakan minimal satu prodi D3 dan gunakan kombinasi akademik/vokasi yang diperbolehkan.”**
- Siswa boleh mengedit daftar yang sementara belum valid, tetapi tombol **“Mulai Tryout”** tidak dapat digunakan sampai daftar memenuhi aturan. Jangan mulai timer sebelum pilihan berhasil divalidasi dan sesi ujian dibuat.
- Backend wajib memvalidasi ulang pilihan saat menyimpan preferensi final dan memulai tryout; validasi di browser tidak menjadi satu-satunya pengaman.
- Daftar final berisi 1–4 prodi unik, tersedia untuk tahun seleksi yang dipilih, dengan urutan prioritas berurutan tanpa celah. Perubahan urutan tidak mengubah validitas komposisi jenjang.
- Data referensi program studi wajib menyediakan `program_studi_id`, `ptn_id`, `ptn_nama`, `prodi_nama`, **`jenis_program (akademik/vokasi)`**, dan **`jenjang (S1/D4/D3)`**. Konsistensi: S1 → akademik; D3/D4 → vokasi. Kategori boleh diturunkan otomatis dari jenjang agar tidak bertentangan.
- Simpan preferensi dengan `siswa_id`, `program_studi_id`, `urutan_prioritas`, dan `tahun_seleksi`; salinan untuk evaluasi historis ditautkan ke `sesi_tryout_id` serta versi aturan dan data target yang digunakan.

#### 3.5.4 Referensi PTN & Passing-Grade Tahunan

- Database referensi mencakup PTN peserta SNBT, termasuk Universitas, Institut, dan Politeknik Negeri, beserta program akademik dan vokasinya.
- Selain identitas dan jenjang prodi, simpan `rumpun`, `daya_tampung`, `peminat_tahun_lalu`, `keketatan_persen`, `target_skor_historis`, `tahun_akademik_berlaku`, serta sumber dan metodologi target skor.
- Data daya tampung dan skor target dipisahkan dari kode program. Admin/Owner dapat memperbarui atau mengimpor data tahunan melalui **Excel (.xlsx/CSV)** tanpa redeploy aplikasi.
- Jika referensi target skor belum tersedia, tampilkan status **“Target belum tersedia”**, bukan membuat angka atau status peluang kelulusan.

#### 3.5.5 Hasil, Evaluasi Kekurangan & Simulasi Alternatif

- Setelah tryout selesai, sistem membandingkan skor tertimbang terhadap **setiap program studi yang dipilih sebelum ujian**, ditampilkan sesuai urutan prioritas, bersama target skor dan selisih poin:
  - 🟢 **Lolos Target (Zona Aman):** skor siswa ≥ target passing-grade referensi.
  - 🟡 **Mendekati (Zona Waspada):** skor di bawah target dengan selisih maksimal 35 poin.
  - 🔴 **Perlu Peningkatan:** skor di bawah target dengan selisih lebih dari 35 poin.
- Hasil menunjukkan subtes/materi yang masih lemah, selisih terhadap target belajar, dan rekomendasi latihan yang perlu diprioritaskan. Jika masih ada essay yang belum dikoreksi, hasil diberi label **sementara** sampai penilaian final selesai.
- Status **“Lolos Target”** berarti memenuhi target referensi dalam simulasi Euclide, bukan pengumuman diterima di PTN. Evaluasi tetap ditampilkan untuk seluruh pilihan sebagai bahan belajar, tanpa mengklaim menjalankan seleksi resmi SNPMB.
- *What-If Simulator* tersedia **setelah hasil utama** untuk membandingkan prodi alternatif dengan skor yang sama. Daftar alternatif tetap mengikuti aturan kombinasi SNBT dan tidak menimpa salinan preferensi awal atau hasil historis; siswa dapat menyimpan alternatif valid sebagai preferensi untuk tryout berikutnya.

> **Catatan metodologi (penting untuk ekspektasi klien):** MVP menggunakan sistem skor tertimbang manual (bobot ditentukan tentor), bukan kalibrasi statistik IRT seperti kompetitor besar. IRT butuh volume data respons yang jauh lebih besar dari basis 600–700 siswa untuk stabil secara statistik. Migrasi ke IRT bisa dipertimbangkan di fase lanjutan setelah data historis cukup besar.

### 3.6 Analisis per Siswa
- Dashboard tren skor antar tryout (grafik garis)
- Breakdown skor per subtes vs target (radar chart)
- Rekomendasi arah jurusan berdasarkan performa relatif antar mapel (rule-based di MVP)
- Ranking **internal** (sesama siswa Euclide) — **bukan** ranking nasional, ditampilkan dengan jelas ke siswa agar tidak disalahartikan

#### 3.6.1 Pemantauan Performa oleh Orang Tua/Wali

- **Permintaan klien:** orang tua dapat mengecek performa anaknya. Rancangan awal berupa akses orang tua/wali terpisah yang read-only; metode login, rincian data, dan cara penyajian perlu dikonfirmasi sebelum implementasi (lihat `docs/CLIENT_QUESTIONS.md`). Tidak menggunakan kredensial login siswa bersama-sama.
- Informasi yang diusulkan: riwayat tryout, tren skor, hasil per subtes, materi yang perlu diperbaiki, dan catatan evaluasi tentor yang secara eksplisit diterbitkan untuk orang tua. Tampilkan hasil yang masih menunggu koreksi essay sebagai belum final.
- Orang tua hanya dapat melihat siswa yang memiliki relasi wali–siswa terverifikasi. Desain relasi mendukung satu wali dengan beberapa anak, tanpa mengasumsikan satu email wali hanya boleh terhubung ke satu siswa. Verifikasi jumlah wali per siswa dan mekanisme undangan dengan klien.
- Kode Siswa adalah identifier, **bukan bukti hak akses**. Mengetahui kode/nama siswa atau mengubah parameter URL tidak boleh memberi akses ke datanya. Pemeriksaan relasi dan hak akses wajib ada di setiap endpoint terkait.
- Admin memverifikasi, menambah, dan mencabut hubungan wali–siswa; simpan audit perubahan. Rancangan penyimpanan: akun wali terpisah dan tabel relasi `guardian_student_links` dengan identitas wali, siswa, serta metadata verifikasi/pencabutan. Detail migrasi mengikuti keputusan metode login.
- Akses ini tidak memberi hak mengerjakan ujian, mengubah jawaban/nilai, atau mengakses siswa lain. Kebijakan akses riwayat ketika anak nonaktif/lulus perlu dikonfirmasi, terpisah dari kebijakan blokir login akun siswa.
- **Kriteria penerimaan:** orang tua A tidak dapat membaca performa anak orang tua B, termasuk lewat API langsung; pencabutan relasi menghentikan akses; beberapa anak dapat dipilih hanya jika semua relasinya valid; hasil dan catatan mengikuti status publikasi dari server.

### 3.7 Manajemen Bimbel (akses Admin/Owner)
- **Tentor**: profil, mapel yang diajar
- **Jadwal kelas**: nama kelas, hari/jam, tentor pengampu, kapasitas kuota dinamis
- **Pendaftaran siswa**: form daftar, validasi kuota (tolak otomatis jika kelas penuh), status menunggu/diterima
  - Cari siswa existing berdasarkan Kode Siswa/nama sebelum membuat akun; daftar ulang tahunan menggunakan akun yang sama melalui **Import Massal Daftar Ulang**, dengan preview wajib dan konfirmasi sebelum eksekusi (lihat 3.1.1–3.1.2). Fitur ini terpisah dari impor pembayaran SPP bulanan.
- **Pembayaran SPP**:
  - **Keputusan pengerjaan saat ini:** siswa/orang tua membayar langsung ke admin, kemudian admin mencatat, membuat kuitansi, dan merekap pembayaran. Biaya pendaftaran awal yang disampaikan adalah **Rp100.000**; nominal daftar ulang tahunan dan detail periode perlu dikonfirmasi. Formulir bertanda tangan orang tua serta pembayaran lengkap menjadi syarat penyelesaian pendaftaran, bukan sekadar pengajuan disetujui.
  - Integrasi payment gateway/QRIS otomatis ditunda. Pertanyaan untuk klien mencakup metode pembayaran manual yang diterima, aturan koreksi transaksi, batas waktu reservasi, dan kebutuhan pembayaran online kelak (lihat `docs/CLIENT_QUESTIONS.md`).
  - **Pencatatan Manual Kasir**: admin mencatat setiap pembayaran tunai per siswa per bulan (siswa bayar langsung ke admin setelah sesi kelas)
  - **Impor Massal Riwayat Pembayaran via Excel (.xlsx/CSV)**: admin dapat mengunggah spreadsheet rekonsiliasi pembayaran SPP lama/massal untuk mempercepat migrasi data awal tanpa harus menginput ratusan transaksi satu per satu
    - Pencocokan siswa wajib menggunakan **Kode Siswa** internal; NIS/nama tidak boleh menjadi pengganti kunci. Sediakan tombol **Unduh Template Excel** kosong dengan header sesuai jenis impor, termasuk Kode Siswa dan Nama untuk verifikasi.
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
| Mode alumni read-only | Opsional setelah konfirmasi klien; MVP memblokir login akun `lulus` sepenuhnya |

---

## 5. Kebutuhan Non-Fungsional

- **Skala pengguna**: 600–700 total siswa, hingga ±350 concurrent saat sesi tryout serentak
- **Ketersediaan saat sesi tryout**: prioritas tinggi — downtime saat tryout live sangat merugikan; perlu load testing sebelum sesi resmi pertama
- **Autosave**: jawaban siswa tidak boleh hilang meski koneksi terputus sesaat
- **Keamanan data**: nilai dan data pribadi siswa tidak boleh bisa diakses lintas role tanpa izin (mis. siswa lain tidak bisa lihat nilai siswa lain)

### 5.1 Prioritas Optimasi Performa (disesuaikan skala MVP — jangan over-engineer)

**Wajib di MVP (sepadan dengan skala 600-700 siswa / ~350 concurrent):**
- Database indexing pada kolom yang sering di-query (`kode_siswa`, `tryout_id`, `siswa_id`, dsb.)
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

- [ ] **Pemantauan orang tua:** kebutuhan melihat performa anak telah diminta klien. Konfirmasi metode akses, cakupan laporan, verifikasi wali, dan akses setelah siswa lulus sebelum implementasi (lihat 3.6.1).
- [ ] **Pembayaran dan reservasi:** konfirmasi ke klien alur pencatatan admin, tarif daftar ulang, masa reservasi, dan penanganan formulir belum lengkap setelah pembayaran. Gateway ditunda; bukan prasyarat pengerjaan inti saat ini.

- [x] **Impor massal data siswa dari Excel:** $\to$ **Wajib di MVP**. Menginput 600–700 siswa satu per satu akan memakan waktu admin berhari-hari. Disediakan tombol **"Upload Data Siswa (.xlsx)"** dengan validasi kolom otomatis.
- [x] **Identitas siswa & template impor:** $\to$ `id` teknis dan **Kode Siswa (`kode_siswa`)** dibuat otomatis dan terpisah; Kode Siswa unik serta tetap sepanjang masa akun, dicetak pada kartu/struk pendaftaran, dan digunakan untuk semua pencocokan impor siswa existing. **NIS bukan kunci pencocokan.** Setiap fitur impor massal menyediakan tombol **Unduh Template Excel** kosong dengan header sesuai prosesnya.
- [x] **Kebijakan akun siswa lulus:** $\to$ **MVP memblokir login sepenuhnya** untuk status `lulus`, sama seperti `nonaktif`. Histori nilai dan tryout tetap disimpan sebagai arsip read-only yang dapat diakses admin/tentor sesuai hak akses; mode alumni memerlukan konfirmasi klien dan berada di luar MVP.
- [x] **Daftar ulang tahunan siswa lama:** $\to$ **Import Massal Daftar Ulang wajib MVP** untuk 300+ siswa, dengan akun yang sama, penempatan tingkat/kelas baru, dan pencatatan pembayaran pendaftaran ulang. Preview pencocokan dan perubahan wajib ditinjau sebelum konfirmasi; Kode Siswa tidak ditemukan tidak membuat akun otomatis. Fitur terpisah dari impor SPP bulanan (lihat 3.1.1–3.1.2).
- [x] **Hak akses bank soal antar-tentor:** $\to$ **Bersifat Terbuka/Kolaboratif di Internal Bimbel**. Semua tentor dan admin/owner bisa saling melihat dan menggunakan soal untuk menyusun paket tryout bersama.
- [x] **Sifat kuota kelas:** $\to$ **Dinamis**. Sistem menghitung `jumlah_siswa_aktif < kapasitas_maksimal`. Jika ada siswa yang batal/keluar, slot kelas otomatis terbuka kembali secara real-time.
- [x] **Ekspor PDF/Excel hasil tryout:** $\to$ **Wajib di Fase 2**. Sangat krusial bagi bimbel untuk membagikan rapor hasil tryout bergaya resmi (berlogo Euclide/Bimbel) ke grup WhatsApp orang tua siswa.
- [x] **Rasionalisasi Maksimal 4 Pilihan Program Studi & Basis Data Kampus Dinamis:** $\to$ **Wajib di MVP**. Siswa memilih PTN/prodi dan mengonfirmasi prioritas **sebelum tryout**. Kombinasi S1/D4/D3 divalidasi sesuai aturan SNPMB tahun berlaku (lihat 3.5); batas empat berlaku pada program studi, bukan kampus. Referensi PTN/prodi tahunan dapat diperbarui melalui Excel (.xlsx/CSV).

---

## 9. Urutan Pengembangan — Tryout Dahulu

**Prioritas terbaru:** selesaikan tryout hingga dapat dipakai dengan login,
bank soal, pengerjaan dan penyimpanan jawaban di server, penilaian nyata, serta
pengujian. Digitalisasi bisnis bimbel dikerjakan setelah alur CBT siap. Istilah
MVP pada bagian scope sebelumnya menandai kebutuhan yang sudah dicatat, bukan
alasan menunda kelengkapan atau keamanan tryout dan bukan urutan implementasi.
Rincian pekerjaan dan kriteria penerimaan ada di `docs/DEVELOPMENT.md`.

| Fase | Cakupan |
|---|---|
| **Tahap 1 — Tryout siap dipakai** | Login siswa/tentor/admin dan whitelist peserta, bank soal dan paket/subtes terbit, pilihan prodi sebelum ujian, timer server, autosave/resume, submit dan expiry, penilaian objektif serta koreksi essay, hasil nyata/pembahasan dan evaluasi target, pengujian keamanan serta beban |
| **Tahap 2 — Digitalisasi bisnis bimbel** | Pendaftaran/persetujuan admin, formulir orang tua, jadwal dan kuota/reservasi kelas, pencatatan pendaftaran/SPP manual, rekap kas, impor siswa/daftar ulang/pembayaran dengan preview, laporan operasional |
| **Tahap 3 — Pendampingan dan pelaporan** | Portal performa orang tua setelah konfirmasi cakupan, analisis lanjutan, ekspor rapor PDF/Excel, publikasi prestasi alumni sesuai persetujuan |
| **Tahap 4 — Integrasi lanjutan** | Payment gateway, notifikasi otomatis WA/email; eksplorasi IRT setelah data historis memadai |
