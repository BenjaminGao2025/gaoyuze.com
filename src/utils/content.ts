import type { CollectionEntry } from 'astro:content';

import { languageLabels } from '../config';

export type ArticleEntry = CollectionEntry<'articles'>;
export type BookEntry = CollectionEntry<'books'>;

export function sortArticlesByDate(articles: ArticleEntry[]) {
  return [...articles].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export function getCanonicalArticles(
  articles: ArticleEntry[],
  preferredLanguage = 'en'
) {
  const groups = new Map<string, ArticleEntry[]>();

  for (const article of articles) {
    const existing = groups.get(article.data.translationKey) ?? [];
    groups.set(article.data.translationKey, [...existing, article]);
  }

  return Array.from(groups.values()).map((group) => {
    return (
      group.find((article) => article.data.lang === preferredLanguage) ??
      sortArticlesByDate(group)[0]
    );
  });
}

export function getArticleLanguages(article: ArticleEntry, all: ArticleEntry[]) {
  return all
    .filter((entry) => entry.data.translationKey === article.data.translationKey)
    .sort((a, b) => a.data.lang.localeCompare(b.data.lang))
    .map((entry) => ({
      label: languageLabels[entry.data.lang] ?? entry.data.lang,
      lang: entry.data.lang,
      href: `/articles/${entry.data.slug}/${entry.data.lang}/`
    }));
}

export function formatDate(date: Date, lang = 'en') {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getReadingStats(body = '', lang = 'en') {
  const withoutCode = body.replace(/```[\s\S]*?```/g, ' ');
  const plain = withoutCode
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`>()[\]{}|~:-]/g, ' ');
  const cjkMatches = plain.match(/[\u3400-\u9fff]/g) ?? [];
  const latinText = plain.replace(/[\u3400-\u9fff]/g, ' ');
  const words = latinText.split(/\s+/).filter(Boolean).length;
  const units = lang === 'zh' ? cjkMatches.length + words : words + cjkMatches.length / 2;
  const speed = lang === 'zh' ? 450 : 220;
  const minutes = Math.max(1, Math.ceil(units / speed));
  const count =
    lang === 'zh'
      ? `${cjkMatches.length.toLocaleString()} 字`
      : `${Math.max(words, Math.round(units)).toLocaleString()} words`;

  return {
    count,
    minutes: `~${minutes} min`
  };
}

export function getBookStatusLabel(status: BookEntry['data']['status']) {
  const labels = {
    seed: 'Seed',
    draft: 'Draft',
    ongoing: 'Ongoing',
    complete: 'Complete'
  };

  return labels[status];
}
