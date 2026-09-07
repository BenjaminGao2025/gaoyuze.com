import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://gaoyuze.com', output: 'static', trailingSlash: 'always',
  // Preserve HTML-aware whitespace when migrating existing content to Astro 7.
  compressHTML: true,
  integrations: [mdx(), sitemap({ filter: page => !['/404/', '/search/'].some(path => new URL(page).pathname === path) })]
});
