# E-Procurement Coding Test
Aplikasi E-Procurement simpel dengan menggunakan Laravel 12 &amp; ReactJS + TypeScript

## Dev Dependency
- PHP minimal versi 8.3
- NodeJS versi LTS
- Database MySQL atau MariaDB

## Cara Instalasi
- Download atau clone repository dengan command 

```
git clone git@github.com:ghivarra/eproc-coding-test nama_folder
``` 
atau 
```
git clone https://github.com/ghivarra/eproc-coding-test.git nama_folder
```

- Pindah pada root folder/aplikasi atau buka folder `nama_folder` barusan
- Jalankan command di bawah ini untuk menginstalasi dependency Laravel dan React

```
bash deploy-starter.sh
```

- Sebelum lanjut, **pastikan sesuaikan dahulu** konfigurasi file `.env` terutama database (DB_NAME, DB_USERNAME, DB_PASSWORD)

- Bila sudah oke, jalankan command di bawah ini untuk melakukan migrasi database
```
bash deploy-database.sh
```
- Terakhir jalankan command di bawah ini maka aplikasi akan bisa diakses pada `http://localhost:8000` atau `http://127.0.0.1:8000`

```
composer run dev
```

## Homepage
Halaman home akan langsung mengarahkan ke login dan pembuatan user sehingga lebih mudah untuk mencoba

## Full PDF Documentation
Untuk Full PDF Documentation, bisa diunduh [di sini](https://github.com/ghivarra/eproc-coding-test/blob/main/documentation/Full-Documentation.pdf)

## Postman Collection
Untuk testing collection dengan Postman, bisa diunduh [di sini](https://github.com/ghivarra/eproc-coding-test/blob/main/documentation/E-Procurement%20-%20Coding%20Test.postman_collection.json)