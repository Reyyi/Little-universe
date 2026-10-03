# A Little Universe Made For You

A private, cinematic interactive story built with Next.js 15, GSAP, Motion, Lenis, R3F, Howler and Zustand.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Making it yours

Panduan Bahasa Indonesia (ganti foto, teks, audio): lihat [`PANDUAN.md`](./PANDUAN.md).

All personal content lives in `src/data/` — no copy is hard-coded in components.

| File | What it holds |
| --- | --- |
| `site.ts` | Intro / envelope / letter / voice letter / ending copy, audio paths |
| `chapters.ts` | Chapter list, constellation positions, unlock rules, Beginning story beats |
| `memories.ts` | 20 Little Things cards + scrapbook gallery entries |
| `questions.ts` | Quiz questions (answer index, kind notes) |
| `timeline.ts` | Timeline puzzle events (sorted by `date`) |
| `secrets.ts` | 7 hidden stars (route + position) and the secret room |

Replace the placeholder files in `public/media/photos` and `public/media/audio` (same names, or update paths in the data files). Regenerate placeholders with `python3 scripts/generate-placeholders.py`.

Progress is stored in `localStorage` under `little-universe:v1`; `/replay` offers New Game+ or a full reset.
