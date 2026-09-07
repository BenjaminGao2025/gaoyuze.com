import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const zh = '/articles/api-authorization-imbalance/zh/';
const en = '/articles/api-authorization-imbalance/en/';
const paths = ['/', '/articles/', '/archive/', '/about/', '/search/', '/books/', zh, en];

test('editorial layouts reflow at narrow, tablet and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}px`).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  }
});

test('contents is accessible, has valid anchors and adapts without scripts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(zh);
  await expect(page.locator('.reading-rail')).toBeVisible();
  await expect(page.locator('.toc-mobile')).toBeHidden();
  for (const link of await page.locator('.toc-desktop a').all()) {
    const id = (await link.getAttribute('href'))!.slice(1);
    expect(await page.evaluate(id => !!document.getElementById(id), id)).toBe(true);
  }
  const proseBox = await page.locator('.prose').boundingBox();
  expect(proseBox!.width).toBeLessThanOrEqual(704);
  expect(proseBox!.width).toBeGreaterThanOrEqual(680);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.reading-rail')).toBeHidden();
  const summary = page.locator('.toc-mobile summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.toc-mobile')).toHaveAttribute('open', '');
  await page.locator('.toc-mobile a').first().click();
  expect(new URL(page.url()).hash).not.toBe('');
});

test('article remains readable with text enlargement and spacing overrides', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(zh);
  await page.addStyleTag({ content: 'html {font-size: 200% !important;} * {line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important;} p {margin-bottom: 2em !important;}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.prose h2').first()).toBeVisible();
  const title = await page.locator('h1').boundingBox();
  expect(title!.width).toBeLessThanOrEqual(390);
});

test('reading controls and print do not require client JavaScript', async ({ page, browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:4321', viewport: { width: 390, height: 844 } });
  const noJS = await context.newPage();
  await noJS.goto(zh);
  await expect(noJS.locator('.prose')).toBeVisible();
  await noJS.locator('.toc-mobile summary').click();
  await expect(noJS.locator('.toc-mobile a').first()).toBeVisible();
  const continueLink = noJS.locator('.continue-reading > a');
  await expect(continueLink).toHaveAttribute('href', /\/articles\/.+/);
  await continueLink.click();
  await expect(noJS.locator('h1')).toBeVisible();
  await context.close();
  await page.goto(zh);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.reading-rail')).toBeHidden();
  await expect(page.locator('.prose')).toBeVisible();
});

test('basic text contrast and real-content screenshots', async ({ page }) => {
  await page.goto('/');
  const colors = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ['--paper', '--ink', '--muted', '--accent'].map(key => style.getPropertyValue(key).trim());
  });
  const luminance = (hex: string) => {
    const rgb = hex.replace('#', '').match(/.{2}/g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const text of colors.slice(1)) {
    const [light, dark] = [luminance(colors[0]), luminance(text)].sort((a, b) => b - a);
    expect((light + .05) / (dark + .05)).toBeGreaterThanOrEqual(4.5);
  }
  mkdirSync('qa/editorial', { recursive: true });
  for (const [name, path] of [['home', '/'], ['article', zh], ['archive', '/archive/'], ['search', '/search/'], ['english', en]]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    await page.screenshot({ path: `qa/editorial/${name}-desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `qa/editorial/${name}-mobile.png`, fullPage: true });
  }
});
