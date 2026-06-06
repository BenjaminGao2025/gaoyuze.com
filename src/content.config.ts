import { defineCollection, z } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'zh']),
    translationKey: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const bookCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['en', 'zh']).default('en'),
    translationKey: z.string(),
    year: z.number(),
    order: z.number().default(0),
    status: z.enum(['seed', 'draft', 'ongoing', 'complete']).default('seed'),
    summary: z.string(),
    chapters: z
      .array(
        z.object({
          title: z.string(),
          href: z.string().optional(),
          status: z.string().optional()
        })
      )
      .default([])
  })
});

export const collections = {
  articles: articleCollection,
  books: bookCollection
};
