# Reimbursement Coding Challenge
Aplikasi pengajuan reimbursement simpel dengan menggunakan Laravel 12 &amp; ReactJS + TypeScript

## Dev Dependency
- PHP minimal versi 8.3
- NodeJS versi LTS
- Database MySQL atau MariaDB

## Cara Instalasi
- Download atau clone repository dengan command `git clone git@github.com:ghivarra/eproc-coding-test nama_folder` atau `git clone https://github.com/ghivarra/eproc-coding-test.git nama_folder`
- Pindah pada root folder/aplikasi atau buka folder `nama_folder` barusan
- Jalankan command `bash deploy-starter.sh` untuk menginstalasi dependency Laravel dan React
- Sebelum lanjut, **pastikan sesuaikan dahulu** konfigurasi file `.env` terutama database (DB_NAME, DB_USERNAME, DB_PASSWORD)
- Bila sudah oke, jalankan command `bash deploy-database.sh` untuk melakukan migrasi
- Jalankan command `composer run dev` maka aplikasi akan bisa diakses pada `http://localhost:8000` atau `http://127.0.0.1:8000`

## Homepage
Halaman home akan langsung mengarahkan ke login dan pembuatan user sehingga lebih mudah untuk mencoba