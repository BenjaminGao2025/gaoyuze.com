import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const article = '/articles/api-authorization-imbalance/zh/';
test('desktop, mobile and keyboard reading', async ({ page }) => {
  mkdirSync('qa', { recursive: true });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await expect(page.locator('h1')).toHaveText('你好，我是高瑜泽。');
  await page.screenshot({ path: 'qa/home-desktop.png', fullPage: true });
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.goto(article);
  await expect(page.locator('.prose h2').first()).toBeVisible();
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await page.screenshot({ path: 'qa/article-desktop.png', fullPage: true });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ['/', article, '/archive/', '/search/']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow: ${width}px ${path}`).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'qa/home-mobile.png', fullPage: true });
  await page.goto(article);
  await page.screenshot({ path: 'qa/article-mobile.png', fullPage: true });
});
test('Chinese full-text search, empty and no-result states', async ({ page }) => {
  await page.goto('/search/');
  await page.getByLabel('搜索文章标题、标签和正文').fill('会话校验通过');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await expect(page.locator('#search-results')).toContainText('前后端鉴权不对等');
  await page.getByLabel('搜索文章标题、标签和正文').fill('zz-no-matching-query-001');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await expect(page.locator('#search-status')).toContainText('没有找到');
  await page.getByLabel('搜索文章标题、标签和正文').fill('');
  await expect(page.locator('#search-results article')).toHaveCount(0);
  await page.goto('/search/?q=API');
  await expect(page.locator('#search-results article').first()).toBeVisible();
});
test('published translations and missing draft URLs', async ({ page }) => {
  await page.goto(article);
  await page.locator('.language-switch').getByRole('link', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const response = await page.goto('/articles/qa-hidden-0/zh/');
  expect(response?.status()).toBe(404);
});
