import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const read = path => readFileSync(join('dist', path), 'utf8');
const routes = ['index.html', 'articles/index.html', 'archive/index.html', 'about/index.html', 'search/index.html', '404.html', 'books/index.html'];
for (const path of routes) assert.ok(existsSync(join('dist', path)), `Missing ${path}`);
const entries = JSON.parse(read('search-index.json'));
assert.ok(entries.length >= 6, 'Existing published language versions must remain');
for (const entry of entries) {
  const html = read(entry.href.slice(1) + 'index.html');
  assert.match(html, new RegExp(`lang="${entry.lang === 'zh' ? 'zh-Hans' : 'en'}"`));
  assert.ok(html.includes('https://gaoyuze.com' + entry.href), `Missing canonical ${entry.href}`);
  assert.ok(html.includes('property="og:type" content="article"'));
  assert.ok(!/<script\b/.test(html), `Unexpected client JS on article ${entry.href}`);
}
for (const slug of ['api-authorization-imbalance', 'public-mind-begins']) {
  for (const lang of ['zh', 'en']) assert.ok(existsSync(`dist/articles/${slug}/${lang}/index.html`), `Old URL lost: ${slug}/${lang}`);
}
assert.ok(existsSync('dist/articles/deploy-vless-cloudflare-pages/zh/index.html'));
assert.ok(existsSync('dist/articles/attention-ledger/en/index.html'));
for (const slug of ['one-thousand-hours', 'principles-in-progress']) assert.ok(existsSync(`dist/books/${slug}/index.html`));
assert.ok(!read('index.html').includes('fonts.googleapis.com'));
assert.ok(read('rss.xml').includes('/articles/api-authorization-imbalance/zh/'));
function walk(path) { return readdirSync(path, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(join(path, item.name)) : [join(path, item.name)]); }
for (const path of walk('dist').filter(path => path.endsWith('.html'))) {
  const html = readFileSync(path, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const target = decodeURI(match[1]);
    // All internal links must resolve to a built file (including assets and old chapters).
    assert.ok(existsSync(join('dist', target.endsWith('/') ? target + 'index.html' : target)), `${path}: broken internal link ${target}`);
  }
}
console.log(`PASS: ${entries.length} language versions; existing URLs, HTML metadata, RSS and internal links.`);
