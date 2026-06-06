# Astro Deployment Notes

This repository now contains an Astro + MDX public writing site.

## Cloudflare Pages settings

- Framework preset: `Astro`
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

No server, database, login, or payment system is required for this version.

## Writing

- Articles live in `src/content/articles/`.
- Books live in `src/content/books/`.
- Add bilingual article versions by giving the English and Chinese files the same `translationKey`.
- If only one language exists, that version still publishes normally.
