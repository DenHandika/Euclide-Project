# Menjalankan Euclide secara lokal

Gunakan folder repository yang sama, `E:\Project Euclide`. Hosting, penyedia,
dan biaya server belum dipilih. Perintah di bawah tidak melakukan deployment online.

## Persiapan

Node.js dan dependensi sudah tersedia pada komputer pengembangan saat ini.
Pada checkout baru, pasang dependensi menggunakan `npm ci`.

```powershell
npm run local:init
npm run local:check
```

`local:init` hanya membuat `.env.local` jika belum ada, dengan auth secret acak.
File yang sudah ada tidak ditimpa. `.env.local` diabaikan Git; jangan menyalin
password atau secret ke chat maupun commit. `local:check` hanya membaca konfigurasi,
menguji koneksi PostgreSQL lokal dan checksum migrasi, serta memeriksa keberadaan
admin aktif. Nilai kredensial tidak dicetak. Exit code 1 berarti setup backend
belum lengkap, bukan bahwa halaman demo tidak dapat dijalankan.

## Menjalankan aplikasi

Untuk mengedit kode dengan pembaruan otomatis:

```powershell
npm run dev:local
```

Untuk mencoba hasil build seperti deployment lokal:

```powershell
npm run build
npm run start:local
```

Buka http://localhost:3000. Kedua mode memakai port 3000 dan bind hanya ke
`127.0.0.1`; hentikan mode sebelumnya dengan Ctrl+C sebelum berpindah mode.
Jangan menjalankan build ketika server development masih menggunakan folder
`.next` yang sama. Halaman utama, `/tryouts`, `/login`, dan halaman admin/tentor
masih menggunakan prototipe. Berhasil membuka halaman bukan bukti integrasi backend.

Jika `npm` di PowerShell bermasalah, gunakan CLI yang terpasang:

```powershell
& 'C:/Program Files/nodejs/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run dev:local
```

## Mengaktifkan PostgreSQL dan login backend

1. Pastikan PostgreSQL lokal berjalan. Buka `.env.local` di editor, lalu isi
   `DATABASE_MIGRATION_URL` untuk database khusus `euclide` dan user pemilik schema.
   Isi `DATABASE_URL` dengan koneksi aplikasi ke database yang sama. Password pada
   URL harus di-URL-encode; jangan mengubah konfigurasi autentikasi PostgreSQL
   menjadi tanpa password. Jika belum memiliki user aplikasi, koneksi pemilik
   hanya boleh dipakai sementara untuk pengembangan lokal.
2. Jalankan `npm run db:setup`, kemudian `npm run db:migrate`. Migrasi menambahkan
   schema aplikasi; tidak menghapus database existing.
3. Isi `BOOTSTRAP_ADMIN_EMAIL` dan `BOOTSTRAP_ADMIN_NAME`, lalu jalankan
   `npm run db:bootstrap-admin` untuk admin pertama saja.
4. Isi kredensial Google OAuth pada `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`.
   Callback lokal: `http://localhost:3000/api/auth/callback/google`.
   Pertahankan `NEXTAUTH_URL=http://localhost:3000` dan gunakan alamat localhost
   yang sama di browser agar cookie dan pemeriksaan Origin konsisten.
5. Jalankan kembali `npm run local:check`, lalu restart aplikasi setelah mengubah
   environment. Uji login backend melalui `/api/auth/signin`, identitas di
   `/api/me`. Halaman demo `/login` belum mengaktifkan autentikasi backend.

Tidak ada bypass login atau akun admin dengan password bawaan. Google OAuth
memerlukan internet meskipun aplikasi dan PostgreSQL berjalan lokal.

## Batas implementasi

- UI masih menggunakan React Context/LocalStorage dan sebagian data contoh.
- API PostgreSQL merupakan fondasi terpisah; belum terhubung ke seluruh UI.
- Migrasi 004 menambahkan Kode Siswa otomatis; `nis` menjadi metadata opsional.
  UI dan impor lama masih memakai field prototipe, belum memakai API baru.
  Jangan impor data siswa sungguhan sebelum integrasi dan validasinya selesai.
- Redis, queue worker, object storage, CI/CD, dan monitoring belum dikonfigurasi.
- Belum diuji untuk 350 peserta serentak atau dinyatakan siap produksi.

Validasi lokal: `npm run test:backend` dan `npm run build`. Tes backend memakai
PGlite terisolasi, bukan membuktikan koneksi ke layanan PostgreSQL komputer.
Kontrak API dan kebijakan timer ada di [SETUP.md](SETUP.md).
