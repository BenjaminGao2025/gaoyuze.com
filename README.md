# Gao Yuze Public Mind

A static Astro + MDX site for long-form public writing, bilingual articles, and living books.

## Cloudflare Pages

Use these settings:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Production branch: main
```

No server, database, login, or payment system is required for this first version.

## Writing

- Articles live in `src/content/articles/`.
- Books live in `src/content/books/`.
- Add bilingual article versions by giving the English and Chinese files the same `translationKey`.
- If only one language exists, that version still publishes normally.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The site builds to `dist/`.
