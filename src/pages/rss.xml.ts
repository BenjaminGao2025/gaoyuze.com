import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';
import { getCanonicalArticles, sortArticlesByDate } from '../utils/content';

export async function GET(context: { site?: URL }) {
  const allArticles = await getCollection('articles', ({ data }) => !data.draft);
  const articles = sortArticlesByDate(getCanonicalArticles(allArticles));

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site?.toString() ?? siteConfig.url,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.summary,
      pubDate: article.data.date,
      link: `/articles/${article.data.slug}/${article.data.lang}/`
    }))
  });
}
