import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://gaoyuze.com', output: 'static', trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: page => !['/404/', '/search/'].some(path => new URL(page).pathname === path) })]
});
