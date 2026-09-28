> **Dibatalkan (26 September 2026):** efek guntingan kertas sobek sudah diterapkan lalu dicabut atas permintaan pemilik. Gambar kembali ke bentuk semula. Dokumen ini disimpan sebagai catatan saja.

# Gambar bergaya guntingan kertas sobek — Desain

Tanggal: 26 September 2026
Status: menunggu review

## Tujuan

Gambar di dalam konten tampil seperti foto cetak yang digunting dari majalah: foto duduk di atas sisa kertas putih yang pinggirannya sobek, sedikit miring, dengan bayangan tipis di atas latar krem halaman. Tujuannya memberi rasa kolase/handmade yang hangat tanpa mengorbankan kesan editorial premium.

## Keputusan yang sudah diambil

| Pertanyaan | Keputusan |
|---|---|
| Gaya sobekan | Foto cetak di atas kertas putih yang disobek (bukan foto yang disobek langsung, bukan sobek satu sisi) |
| Cakupan | Semua gambar di dalam konten. Hero diptych dan foto Promo tetap penuh sampai tepi |
| Rasa kolase | Sobek dan sedikit miring (±2° maksimum). Tanpa selotip |
| Teknik | Masker CSS dari pola pinggiran sobek SVG yang berulang di empat sisi |

## Struktur

### Komponen

- `src/styles/paper-cutout.css` berisi seluruh gaya efek ini dan di-import di `SiteLayout.astro`.
- `src/components/PaperCutout.astro` adalah pembungkus untuk file `.astro`. Props:
  - `as`: `"figure"` (default) atau `"a"`
  - `href`: wajib bila `as="a"`
  - `tear`: `1`–`4`, memilih pola sobekan
  - `tilt`: angka derajat, dibatasi ke rentang −2…2
  - `class`: kelas tambahan dari pemanggil, untuk menjaga kelas layout yang sudah ada
- `LookbookGallery.tsx` (React) tidak memakai komponen Astro. Kelas dan atribut yang sama (`paper-cutout`, `data-tear`) ditulis langsung di markup-nya.

### Markup yang dihasilkan

```html
<figure class="paper-cutout [kelas-lama]" data-tear="2" style="--tilt: -1.2deg">
  <img …>
  <!-- overlay yang sudah ada (tanda tangan, caption) tetap di sini -->
</figure>
```

### Lapisan visual (belakang → depan)

1. **Bayangan.** `filter: drop-shadow(...)` di elemen pembungkus, supaya bayangan mengikuti bentuk sobekan.
2. **Kertas.** Pseudo-element `::before` memenuhi pembungkus. Warnanya off-white hangat (token baru `--paper-cut: #fbfaf6`) dengan tekstur serat halus berupa SVG `feTurbulence` kecil sebagai `background-image` beropasitas rendah. Bentuknya dipotong oleh masker sobek.
3. **Foto.** Diberi jarak dari tepi kertas lewat `--cut-inset: clamp(8px, 1vw, 14px)`. Tepi foto lurus.

### Masker sobek

- Ada 4 pola pinggiran sobek berbentuk SVG path, masing-masing strip horizontal dengan tinggi ±14px yang bisa diulang (tile seamless).
- Masker disusun dari 5 lapisan `mask-image`: strip atas, strip bawah (dibalik), strip kiri dan kanan (diputar, `repeat-y`), serta satu persegi di tengah. Kelimanya digabung dengan `mask-composite: add`.
- SVG disimpan sebagai data URI di CSS. Tidak ada request jaringan tambahan.
- `data-tear` memilih pola, dan tiap sisi memakai offset `mask-position` berbeda supaya keempat sisi tidak terlihat identik.
- Awalan `-webkit-mask-*` ditambahkan untuk Safari.

### Kemiringan

- `transform: rotate(var(--tilt, 0deg))` di pembungkus.
- Nilainya tetap per gambar (ditulis di markup atau dihitung dari indeks), tidak diacak saat runtime, sehingga tidak ada lompatan dan tidak ada perbedaan hasil SSR/hidrasi.

## Penerapan per section

| Lokasi | File | Tilt | Catatan |
|---|---|---|---|
| Philosophy | `sections/PhilosophySection.astro` | −1.5° | Tetap mengisi tinggi kolom. Foto `absolute` di dalam area inset |
| Services | `sections/ServicesSection.astro` | +1.2° | `figcaption` "Details make the difference." pindah dari atas foto ke bawah kertas, sebagai teks gelap |
| Cabang | `sections/BranchesSection.astro` (`.campaign-space-photo`) | −0.6° | Foto panorama, sudut kecil |
| Barber ×4 | `sections/BarbersSection.astro` | −1, +1.2, −0.8, +1.5 | `as="a"`. Tanda tangan tetap overlay di atas foto, di dalam area inset |
| Lookbook | `LookbookGallery.tsx` | 0 | Tidak miring. `border-radius` kartu dihapus. Gradien dan caption tetap overlay di foto |
| Jurnal ×3 | `sections/ArticlesSection.astro` | −1, +1, −0.6 | `as="a"` |
| Daftar barber | `pages/barbers/index.astro` | bergantian ±1 | `as="a"`, nomor urut tetap overlay |
| Detail barber | `pages/barbers/[slug].astro` | −0.8° | — |
| Daftar jurnal | `pages/journal/index.astro` | bergantian ±1 | `as="a"` |
| Detail jurnal | `pages/journal/[slug].astro` | +0.8° | — |

Pola sobek (`tear`) diputar 1→4 berdasarkan indeks di tiap daftar.

**Tidak diubah:** hero diptych (`EditorialHero.astro`), foto Promo (`PromoSection.astro`), dan halaman booking.

## Interaksi

- Guntingan yang bisa diklik (`a.paper-cutout`): saat hover atau `:focus-visible`, kemiringan menuju 0°, elemen naik 2px, dan bayangan sedikit membesar. Durasi 240ms dengan easing yang sama seperti tombol.
- Zoom foto lama (Lookbook, Barber, Jurnal) diganti efek "diangkat". Zoom akan meluber ke sisi kertas karena foto sekarang tidak lagi dipotong oleh tepi kotak.
- Outline fokus tetap terlihat. Karena outline mengikuti kotak dan bukan sobekan, outline diberi `outline-offset` lebih besar supaya tidak terpotong masker. Outline dipasang di pembungkus luar yang tidak di-mask.

## Aksesibilitas dan performa

- `@media (prefers-reduced-motion: reduce)` mematikan transisi hover. Bentuk sobek dan kemiringan statis tetap ada.
- Alt text gambar tidak berubah. Kertas dan bayangan murni dekoratif lewat pseudo-element.
- Tidak ada JavaScript baru. Tidak ada gambar raster baru.
- `drop-shadow` hanya dipasang di pembungkus. Di rail Lookbook yang di-scroll, bayangan dibuat lebih tipis (blur kecil) demi performa scroll.

## Pengujian

- Test baru `tests/paper-cutout.test.mjs` (pola `node --test` yang sudah ada, membaca `dist/`):
  - Homepage memiliki `paper-cutout` di section philosophy, services, branches, barbers (4), lookbook, dan articles.
  - `#top` (hero) dan `#promo` **tidak** memiliki `paper-cutout`.
  - Setiap `data-tear` bernilai 1–4, dan setiap `--tilt` berada di rentang −2…2 derajat.
  - Halaman daftar/detail barber dan jurnal memiliki `paper-cutout`.
  - `paper-cutout.css` memuat `mask-composite`, `-webkit-mask`, dan aturan `prefers-reduced-motion`.
- Test lama harus tetap lolos. Test yang mengecek markup barber/lookbook disesuaikan bila nama kelas berubah.
- Cek visual di browser pada lebar 1440, 820, dan 390px: sobekan terlihat di empat sisi, overlay tidak terpotong, rail Lookbook tetap mulus, dan tidak ada scroll horizontal di halaman.

## Di luar cakupan

- Selotip, pin, atau ornamen kolase lain.
- Mengubah foto sumber atau menambah aset raster.
- Efek pada hero, Promo, dan halaman booking.
