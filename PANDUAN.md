# Panduan Personalisasi — Little Universe (Ray → Bella)

Semua isi personal ada di folder `src/data/` dan `public/media/`. Komponen UI tidak perlu disentuh.

## Menjalankan di laptop

```bash
npm install
npm run dev      # buka http://localhost:3000
```

Setiap kali file disimpan, halaman otomatis ter-update.

## 1. Nama & teks utama — `src/data/site.ts`

| Field | Isi sekarang | Muncul di |
| --- | --- | --- |
| `recipient` | `Bella` | Tulisan di amplop |
| `author` | `Ray` | Nama pengirim |
| `monogram` | `B` | Huruf kecil di pojok kiri atas |
| `envelope.seal`, `envelope.addressedTo` | `for Bella`, `To Bella, ...` | Amplop |
| `letter.greeting`, `letter.paragraphs`, `letter.signature` | `Dear Bella,` ... `Ray` | Surat utama |
| `ending.lines` | | Halaman penutup |

Isi surat ada di `letter.paragraphs`: tiap string adalah satu paragraf. Teks boleh ditulis dalam Bahasa Indonesia.

## 2. Ganti foto — `public/media/photos/`

Cara paling gampang: **timpa file dengan nama yang sama** (`photo-01.jpg` sampai `photo-16.jpg`). Pakai format `.jpg`, lebar sekitar 1000–1600 px biar tetap ringan.

| File | Dipakai di |
| --- | --- |
| `photo-01.jpg` | Chapter "The Beginning" (foto pertama) + Timeline "The first hello" |
| `photo-02.jpg` | Chapter "The Beginning" (foto kedua) |
| `photo-03.jpg` – `photo-08.jpg` | Kartu "Little Things" (laugh, texts, rain, stars, blurry photos, brave) |
| `photo-04.jpg` | Juga dipakai di Secret Room |
| `photo-05.jpg` | Juga dipakai di Timeline "first long walk" |
| `photo-09.jpg` – `photo-16.jpg` | Scrapbook "Memories" (m1–m8) |
| `photo-09`, `photo-12`, `photo-14` | Juga dipakai di Timeline (trip, birthday, snow day) |

Kalau bentuk fotomu beda (misalnya portrait padahal slotnya landscape), tambahkan ukuran aslinya sebagai argumen ketiga di file data:

```ts
photo(3, "Bella ketawa", [1080, 1350])   // [lebar, tinggi] dalam pixel
```

Teks kedua (`"Bella ketawa"`) adalah deskripsi foto (alt text); boleh diganti bebas.

## 3. Ganti audio — `public/media/audio/`

Timpa file `.mp3` dengan nama yang sama:

- `voice-letter.mp3` — rekaman suara Ray untuk Bella (halaman surat)
- `secret-note.mp3` — voice note rahasia di Secret Room
- `ambient.mp3` — musik latar (bisa diganti lagu kalian)
- `chime.mp3`, `soft.mp3`, `discover.mp3`, `paper.mp3` — efek suara kecil

## 4. Cerita & kenangan

| File | Yang bisa diubah |
| --- | --- |
| `src/data/chapters.ts` | `beginningStory`: kalimat dan caption di chapter "The Beginning" |
| `src/data/memories.ts` | `littleThings` (20 kartu hal kecil tentang Bella) + `galleryMemories` (judul, tanggal, catatan scrapbook) |
| `src/data/questions.ts` | Kuis: `prompt`, 4 `options`, `answer` (indeks jawaban benar 0–3), `correctNote`, `gentleNote` |
| `src/data/timeline.ts` | Momen penting. `date` (format `YYYY-MM`) menentukan urutan yang benar di puzzle |
| `src/data/secrets.ts` | Pesan di bintang tersembunyi + isi Secret Room (`paragraph`, `caption`, foto, voice note, video opsional) |

Untuk video di Secret Room: taruh file di `public/media/video/secret.mp4`, lalu ubah `video: null` menjadi `video: { src: "/media/video/secret.mp4" }`.

## 5. Reset progress saat testing

Progress Bella disimpan di browser (`localStorage`). Buka `/replay`, lalu pilih **Start completely fresh** untuk mulai dari awal lagi.

## Tips

- Pastikan tanda kutip `"` dan koma `,` di file `.ts` tidak terhapus waktu mengedit teks.
- Kalau mau pakai tanda kutip di dalam teks, gunakan `'` atau tulis `\"`.
- Cek dulu dengan `npm run build` sebelum deploy.
