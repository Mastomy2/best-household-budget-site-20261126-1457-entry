# PundiKita — Anggaran Rumah Tangga Keluarga Wijaya

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Mastomy2/best-household-budget-site-20261126-1457-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Mastomy2/best-household-budget-site-20261126-1457-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

PundiKita adalah situs anggaran rumah tangga Keluarga Wijaya (Makassar) yang
berjalan dari berkas statis, tanpa request jaringan, di desktop maupun HP.
Pemasukan November 2026 Rp 13.700.000, pengeluaran Rp 7.446.200 (35 transaksi
1–26 Nov), sisa Rp 6.253.800 — semua angka dihitung dari satu daftar transaksi,
jadi Beranda, Anggaran, Transaksi dan Laporan selalu cocok.

## Halaman

- **Beranda** — sisa bulan ini, KPI pemasukan/pengeluaran/tabungan, grafik
  pemasukan vs pengeluaran 6 bulan, donat pengeluaran per kategori, anggaran
  yang hampir habis, transaksi terakhir
- **Transaksi** — 35 transaksi November: tambah, ubah, hapus, cari, saring
  per kategori, unduh CSV; tersimpan di localStorage
- **Anggaran** — 8 kategori dengan bilah kemajuan (Tagihan 96%, Belanja
  Harian 92%) dan aturan amplop keluarga
- **Tujuan** — 4 tujuan tabungan (Dana Darurat 62%, DP Rumah 43%, Liburan
  58%, Laptop Dimas 33%) dengan tombol setor Rp 100 rb / Rp 500 rb
- **Tagihan** — 4 lunas November, 4 mendatang (total Rp 2.204.000), tombol
  “Tandai lunas”
- **Laporan** — tabel 6 bulan (Jun–Nov 2026), per kategori vs anggaran,
  tiga bulan paling hemat
- **Kalkulator** — aturan 50/30/20 dengan slider penghasilan, dibandingkan
  dengan kondisi nyata keluarga bulan ini

## Kontrol yang berfungsi

Form tambah transaksi, ubah/hapus per baris, pencarian dan saring kategori,
unduh CSV, setor ke tujuan, tandai tagihan lunas, slider kalkulator — semuanya
memperbarui angka di seluruh situs karena datanya satu (localStorage).

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

Tidak ada build step dan tidak ada dependensi: `app/` hanya HTML, CSS dan ES
module yang ditulis tangan, grafik SVG digambar dari `app/data.js` sendiri.

## Entri make.fun

Entri untuk kompetisi [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457)
di make.fun. `main.ts` (Node 22) menyalin `app/` dan `screenshots/` ke
`/output` dan menulis `/output/dossier.json` dengan library make.fun yang
divendor di `vendor/makefun-frontend.ts`.
