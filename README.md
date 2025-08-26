
# Pendataan Kependudukan RT

## Deskripsi
Aplikasi web sederhana untuk pengisian data kependudukan tingkat RT, menandai data salah, menyimpan draft, dan export Excel Workbook.

## Cara Deploy
1. Buat repository baru di GitHub.
2. Upload seluruh file (index.html, style.css, script.js, README.md).
3. Deploy ke Vercel:
   - Masuk ke [Vercel](https://vercel.com)
   - Pilih 'New Project' > Import GitHub Repo
   - Deploy default sebagai static site

## Cara Menggunakan
1. Buka halaman index.html (via Vercel atau localhost).
2. Isi Data KK & Anggota Keluarga.
3. Klik "Simpan / Finalisasi" untuk menyimpan draft.
4. Dashboard menampilkan semua data, menandai anggota dengan data salah.
5. Klik "Export Excel" untuk mendownload workbook .xlsx (sheet per KK).

## Catatan
- Draft disimpan di browser (LocalStorage), bisa di-update sebelum finalisasi.
