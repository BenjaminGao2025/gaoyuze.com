import assert from 'node:assert/strict';
import { writeFileSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const files = ['src/content/articles/qa-hidden-default.md', 'src/content/articles/qa-hidden-explicit.md'];
const marker = 'QA_PRIVATE_SENTINEL_6c012c';
function walk(path) { return readdirSync(path, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(join(path, item.name)) : [join(path, item.name)]); }
try {
  for (const [i, file] of files.entries()) writeFileSync(file, `---\ntitle: ${marker}\npageSlug: qa-hidden-${i}\nlang: zh\ndate: 2026-01-01\nsummary: ${marker}\n${i === 1 ? 'draft: true\n' : ''}---\n\n${marker}\n`);
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
  for (const file of walk('dist').filter(path => /\.(html|json|xml|js)$/.test(path))) assert.ok(!readFileSync(file, 'utf8').includes(marker), `Draft leak in ${file}`);
  console.log('PASS: implicit and explicit drafts absent from generated routes, lists, search, RSS and sitemap.');
} finally {
  for (const file of files) rmSync(file, { force: true });
}
