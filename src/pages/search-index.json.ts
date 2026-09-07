import type { APIRoute } from 'astro';
import { getPublishedArticles, articleHref, plainText } from '../utils/content';
export const GET: APIRoute = async () => {
  const all = await getPublishedArticles();
  const entries = all.map(article => ({ title: article.data.title, summary: article.data.summary, tags: article.data.tags, lang: article.data.lang, href: articleHref(article), text: plainText(article.body) }));
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
