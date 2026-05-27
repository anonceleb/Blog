import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    category: z.string().default('Uncategorized'),
    description: z.string().optional(),
  }),
});

export const collections = { essays };
