# Wabro
Pertama kali dibuat oleh afarhansib (https://github.com/afarhansib) dengan library bailey, kali ini saya coba menggunakan whatsapp-web.js
Kirim pesan WhatsApp unik ke banyak nomor sekaligus.

Pastikan di PC anda sudah terinstall nodejs (https://github.com/MicrosoftDocs/windows-dev-docs/blob/docs/hub/dev-environment/javascript/nodejs-on-windows.md).

Klik [link ini](https://youtu.be/ujEuCkUO97U) untuk melihat video panduan instalasi dan penggunaan.

![screenshot app](client/assets/ss-app.png)

## Quickstart guide
1. Download dari Github
2. Jalankan aplikasinya
3. Buka halaman server
4. Scan kode QR
5. Buat data di Sheets/Excel
6. Buka halaman Client
7. Copy paste data tadi
8. Buat template
9. Klik preview
10. Kirim!

## Cara penggunaan
1. Jalankan server aplikasinya, ada dua cara untuk menjalankan aplikasi ini, menggunakan executable atau clone repo ini dan jalankan dengan `node index.js`.
Untuk menjalankan dengan executable, download aplikasi ini di bagian Release di samping kanan, sesuaikan dengan sistem operasi anda. Setelah itu klik dua kali (untuk windows), dan akan terbuka command prompt. Disitu akan keluar url, buka url tersebut di browser anda (saya pakai google chrome). Lalu scan kode qr nya, setelah aktif, buka halaman client di `url/client` contohnya `http://localhost:8000/client`.
2. Buat data di Google Sheet/Microsoft Excel

![contoh data excell](client/assets/ss1.png)

3. Salin dan tempel data, **Pastikan baris pertama adalah judul kolomnya, dan kolom pertama adalah nomor WhatsApp penerima (dengan format 62xxxxxxxx).**

![baris dan kolom pertama](client/assets/ss2.png)

4. Buat template, bungkus judul kolom dengan simbol **{}**, contoh template (sesuai data diatas):
>Calon Pengantin YTH,

>Dengan ini kami konfirmasi jadwal nikah antara saudara *{nama suami}* dengan *{nama istri}* yang akan di laksanakan pada *{tgl akad} {pukul}* bertempat di *{lokasi akad}*.

>Petugas yang hadir dari KUA adalah saudara/bpk. *{nama penghulu}*

>Dimohon kesiapannya 10 menit sebelum acara ijab beralangsung.

>*wassallam*,
5. Cek preview terlebih dahulu
6. Kirim!

## Update
Aplikasi ini menggunakan libarary WhatsApp-web.js, yang bisa jadi di kemudian hari membutuhkan update. Anda bisa mendukung aplikasi ini dengan berdonasi melalui:
Dana/Gopay/OVO atau hubungi whatsapp saya di [wa.me/6281330496884](https://wa.me/6281330496884)

Dukungan anda akan sangat berarti bagi saya dan kelanjutan aplikasi ini :) 

**Aplikasi/tool ini gratis. mohon tidak diperjualbelikan!**

**Saya tidak mencatat/mengumpulkan data dari aplikasi ini.**

