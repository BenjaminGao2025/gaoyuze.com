import { getCollection, type CollectionEntry } from 'astro:content';
import { languageLabels } from '../config';

export type ArticleEntry = CollectionEntry<'articles'>;
export type BookEntry = CollectionEntry<'books'>;
export const articleHref = (article: ArticleEntry) => `/articles/${article.data.pageSlug}/${article.data.lang}/`;
const translationId = (article: ArticleEntry) => article.data.translationKey ?? article.data.pageSlug;

// Every public surface uses this function. Missing draft flags fail closed.
export async function getPublishedArticles() {
  const all = await getCollection('articles');
  const routes = new Set<string>();
  const translations = new Set<string>();
  for (const article of all) {
    const route = articleHref(article);
    const translation = `${translationId(article)}:${article.data.lang}`;
    if (routes.has(route)) throw new Error(`Duplicate article URL: ${route}`);
    if (translations.has(translation)) throw new Error(`Duplicate article translation: ${translation}`);
    routes.add(route);
    translations.add(translation);
  }
  return sortArticlesByDate(all.filter(({ data }) => data.draft === false));
}
export function sortArticlesByDate(articles: ArticleEntry[]) {
  return [...articles].sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}
export function getCanonicalArticles(articles: ArticleEntry[], preferredLanguage = 'zh') {
  const groups = new Map<string, ArticleEntry[]>();
  for (const article of articles) {
    const key = translationId(article);
    groups.set(key, [...(groups.get(key) ?? []), article]);
  }
  return sortArticlesByDate([...groups.values()].map(group => group.find(a => a.data.lang === preferredLanguage) ?? sortArticlesByDate(group)[0]));
}
export function getArticleLanguages(article: ArticleEntry, all: ArticleEntry[]) {
  return all.filter(entry => translationId(entry) === translationId(article))
    .sort((a, b) => a.data.lang === b.data.lang ? 0 : a.data.lang === 'zh' ? -1 : 1)
    .map(entry => ({ label: languageLabels[entry.data.lang], lang: entry.data.lang, href: articleHref(entry) }));
}
export function formatDate(date: Date, lang = 'zh') {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  }).format(date);
}
export function plainText(body = '') {
  return body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>~|]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function getReadingStats(body = '', lang = 'zh') {
  const text = plainText(body);
  const han = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = text.replace(/[\u3400-\u9fff]/g, ' ').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(han / 450 + words / 220));
  return { count: lang === 'zh' ? `${han.toLocaleString('zh-CN')} 字` : `${words.toLocaleString('en-US')} words`, minutes: lang === 'zh' ? `约 ${minutes} 分钟` : `~${minutes} min` };
}
export function getBookStatusLabel(status: BookEntry['data']['status']) {
  return { seed: '构想', draft: '草稿', ongoing: '进行中', complete: '已完成' }[status];
}
