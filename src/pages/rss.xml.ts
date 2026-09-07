import rss from '@astrojs/rss';
import { siteConfig } from '../config';
import { getPublishedArticles, getCanonicalArticles, articleHref } from '../utils/content';
export async function GET() {
  const articles = getCanonicalArticles(await getPublishedArticles());
  return rss({ title: siteConfig.title, description: siteConfig.description, site: siteConfig.url,
    items: articles.map(article => ({ title: article.data.title, pubDate: article.data.date, description: article.data.summary, link: articleHref(article), categories: article.data.tags })),
    customData: '<language>zh-Hans</language>'
  });
}
