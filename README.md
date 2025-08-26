
# Aplikasi Pendataan Warga RT (HTML + JS, siap GitHub/Vercel)

Aplikasi single-page untuk pendataan KK & Anggota secara offline-first (localStorage), cocok untuk hosting statis (GitHub Pages / Vercel).

## Fitur Utama
1. **Beranda**: contoh kesalahan data agar jadi perhatian warga & RT/RW/Pemdes.
2. **Form**:
   - Data KK lengkap (Nomor KK, alamat detail, RT/RW, Ketua RT, Kepala Keluarga, jumlah anggota otomatis, tanggal pembuatan, status KK).
   - Data anggota keluarga **repeatable** (tambah >1 orang): nama, NIK, JK, TTL, hubungan, status kawin, pendidikan, pekerjaan, **detail dokumen** (Nomor + Nama di dokumen + Nama Ayah/Ibu/Suami/Istri).
   - Perubahan administrasi (Penambahan/Pengurangan/Koreksi) + tanggal + dokumen pendukung (teks).
   - Catatan & verifikasi RT (status validasi, catatan, inisial/tanda tangan digital).
   - **Simpan Draft** (localStorage) & **Simpan Final** (masuk tabel di bawah form).
   - **Export Excel Workbook** (.xlsx) per KK (sheet: Ringkasan_KK, Anggota, Perubahan, Verifikasi, Deteksi).
3. **Dashboard RT**:
   - Ringkasan KK & anggota.
   - Filter: hanya bermasalah (⚠️), penambahan/pengurangan, dan koreksi.
   - Daftar deteksi mismatch (nama antar dokumen, NIK, dll).

## Jalankan
- Cukup buka `index.html` di browser modern (Chrome/Edge/Firefox).
- Atau deploy ke GitHub Pages / Vercel (tanpa backend).
- Data tersimpan di `localStorage` (per browser/per perangkat).

## Catatan
- Fitur unggah berkas tidak disertakan (statik). Kolom "dokumen pendukung" berupa teks/nomor dokumen.
- Untuk produksi, integrasikan dengan backend/database & autentikasi.
