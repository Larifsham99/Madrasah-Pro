# Madrasah Pro v2

Sistem pengurusan madrasah — pelajar & waris, kutipan yuran bulanan, resit, surat rasmi dan laporan.
**Boleh dipasang sebagai aplikasi (PWA)** dan berfungsi tanpa internet.

**Pautan aplikasi:** https://larifsham99.github.io/madrasah-pro/

## Log masuk pertama
- Nama pengguna: **admin** · Kata laluan: **admin123** (sila tukar segera di Tetapan → Akaun Saya)
- Admin boleh tambah akaun **Kerani** di Tetapan → Pengguna Sistem.

## Ciri utama
| Kategori | Ciri |
|---|---|
| Pelajar & Waris | Profil penuh, maklumat waris, carian pantas (nama/KP/waris/telefon), profil dengan sejarah yuran |
| Kutipan Yuran | **Bayaran Pantas** (bulan tertunggak auto-dipilih, jumlah auto-dikira), **Mod Pukal** (tekan nama ramai pelajar → resit dijana sekali gus), **Rekod & Resit** (carian, resit tunggal, cetak gabungan), Yuran Sekolah & Makan (boleh satu resit), status bulanan, penyata yuran |
| Resit & WhatsApp | Resit rasmi A4 auto-jana, muat turun PDF, kongsi PDF ke WhatsApp, mesej auto-jana |
| Dokumen | Surat Pengesahan Pelajar, muat naik kepala surat (PNG/JPG), format A4 sedia cetak/PDF |
| Laporan | Kutipan harian/bulanan/tahunan, senarai tunggakan, eksport CSV (Excel) & PDF |
| Tetapan Bayaran | Kadar lalai, jenis yuran lalai, kaedah bayaran, butang amaun pantas, tindakan selepas bayar, awalan no. resit, nota resit |
| Keselamatan & Log Masuk | Pilih nama (tiada taip), PIN 4 digit, kekal log masuk pada peranti, kunci skrin automatik boleh laras, Admin/Kerani |

## Struktur Yuran
- **Yuran Sekolah**: dikenakan **sekali setahun**; boleh dibayar secara **ansuran**.
- **Yuran Makan**: dikenakan **setiap bulan** bermula bulan daftar masuk.

## Penyegerakan Banyak Peranti (Admin, Ustaz, Kerani)
Data disegerak melalui **Google Sheet milik madrasah** (percuma). Sistem berfungsi tanpa internet dan menyegerak secara automatik bila ada sambungan.

**Sediakan sekali sahaja (Admin):**
1. Buka https://sheets.new → namakan *Madrasah Pro Data*.
2. *Sambungan (Extensions) → Apps Script* → tampal kod dari `apps-script/Code.gs` (atau butang **Salin Kod** dalam aplikasi) → Simpan.
3. *Terapkan → Penerapan baharu → Apl web* · Laksana sebagai **Saya** · Akses **Sesiapa sahaja**.
4. Salin URL `/exec` → Madrasah Pro → **Tetapan → Penyegerakan Peranti** → tampal → **Aktifkan**.
5. Tambah pengguna (Tetapan → Pengguna Sistem), kemudian tekan **Hantar WhatsApp** untuk menghantar pautan sambungan kepada Ustaz & Kerani.

**Ustaz / Kerani:** tekan pautan → *Ya, Sambung* → tekan nama → masukkan kata laluan / PIN. Selesai.

## Peranan
| Peranan | Skrin |
|---|---|
| **Pengutip Yuran** (Ustaz) | Ringkas: Kutip · Pukal · Resit · Tunggakan · Akaun |
| **Kerani** | Pemuka · Pelajar · Yuran · Dokumen (Surat Pengesahan, Surat Berhenti, Peringatan Tunggakan, Penyata) · Laporan |
| **Admin** | Semua + Tetapan, Pengguna, Penyegerakan, Sandaran |

Setiap pengguna mempunyai siri no. resit sendiri (cth: `R2026-H0001`) supaya tiada nombor bertindih antara peranti.

## Nota
- Logo lalai resit: muat naik `171855_2.png` ke folder utama repo (atau guna kepala surat di Tetapan).
- Data disimpan dalam peranti (localStorage). Gunakan **Muat Turun Sandaran** untuk backup / pindah peranti.
- Data versi 1 dipindahkan secara automatik.
