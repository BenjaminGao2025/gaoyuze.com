import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '网址标识只能使用小写英文字母、数字和短横线');
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),
    pageSlug: slug,
    lang: z.enum(['zh', 'en']).default('zh'),
    translationKey: z.string().min(1).optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: z.string().default(''),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(true)
  })
});
const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    title: z.string(), pageSlug: slug,
    lang: z.enum(['en', 'zh']).default('en'),
    translationKey: z.string(), year: z.number(),
    order: z.number().default(0),
    status: z.enum(['seed', 'draft', 'ongoing', 'complete']).default('seed'),
    summary: z.string(),
    chapters: z.array(z.object({ title: z.string(), href: z.string().optional(), status: z.string().optional() })).default([])
  })
});
export const collections = { articles, books };
