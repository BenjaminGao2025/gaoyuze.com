import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blank = (value: unknown) => value === null || value === '' ? undefined : value;
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '网址标识只能使用小写英文字母、数字和短横线');
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().trim().min(1),
    pageSlug: slug,
    lang: z.preprocess(blank, z.enum(['zh', 'en']).default('zh')),
    translationKey: z.preprocess(blank, z.string().trim().min(1).optional()),
    date: z.preprocess(blank, z.coerce.date()),
    updated: z.preprocess(blank, z.coerce.date().optional()),
    summary: z.preprocess(blank, z.string().default('')),
    tags: z.preprocess(blank, z.array(z.string()).default([])),
    cover: z.preprocess(blank, z.string().optional()),
    coverAlt: z.preprocess(blank, z.string().optional()),
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
