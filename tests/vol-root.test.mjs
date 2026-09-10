import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../functions/index.js', import.meta.url), 'utf8');
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const html = await readFile(new URL('../public/vol/index.html', import.meta.url), 'utf8');

test('only the root path invokes Pages Functions', async () => {
  const routes = JSON.parse(await readFile(new URL('../public/_routes.json', import.meta.url), 'utf8'));
  assert.deepEqual(routes, { version: 1, include: ['/'], exclude: [] });
});
for (const host of ['gaoyuze.com', 'www.gaoyuze.com', 'gaoyuze-com.pages.dev', 'preview.gaoyuze-com.pages.dev']) {
  test(`blog and preview root pass through unchanged: ${host}`, async () => {
    const expected = new Response('unchanged blog');
    const result = await onRequest({ request: new Request(`https://${host}/`), next: () => expected });
    assert.equal(result, expected);
  });
}
test('vol root serves the resume and preserves the query string', async () => {
  let assetRequest;
  const result = await onRequest({
    request: new Request('https://vol.gaoyuze.com/?source=share'),
    next: () => { throw new Error('Unexpected fallthrough'); },
    env: { ASSETS: { fetch: async request => {
      assetRequest = request;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } } }
  });
  assert.equal(assetRequest.url, 'https://vol.gaoyuze.com/vol/?source=share');
  assert.equal(result.status, 200);
  assert.match(result.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(await result.text(), /高瑜泽/);
});
test('HEAD is preserved and does not invent a body', async () => {
  const result = await onRequest({
    request: new Request('https://vol.gaoyuze.com/', { method: 'HEAD' }),
    env: { ASSETS: { fetch: async request => {
      assert.equal(request.method, 'HEAD'); return new Response(null);
    } } }
  });
  assert.equal(await result.text(), '');
});
test('other methods are refused without fetching assets', async () => {
  const result = await onRequest({ request: new Request('https://vol.gaoyuze.com/', { method: 'POST' }) });
  assert.equal(result.status, 405);
  assert.equal(result.headers.get('Allow'), 'GET, HEAD');
});
test('content and privacy guardrails remain intact', () => {
  for (const required of ['noindex,nofollow,noarchive', '尚未正式商业运营', '重庆合伙人', '两年内晋升', '材料成型及控制工程', '2025.01 — 2026.08', '团队奖']) assert.ok(html.includes(required), required);
  for (const prohibited of ['60 万', '60万', '600K', '1.1M', 'google-analytics', 'googletagmanager', '身份证号', '护照号码']) assert.ok(!html.includes(prohibited), prohibited);
  assert.ok(!/<script[^>]+src=/.test(html));
  assert.equal((html.match(/class="project" href=/g) || []).length, 3);
});
