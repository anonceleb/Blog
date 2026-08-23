import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Fiction', 'Personal']).default('Fiction'),
    description: z.string().optional(),
    // Stories that belong to a sequence. `seriesOrder` is reading order, 1-based.
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    // Manual tie-break for standalone pieces sharing a date. Lower shows first.
    order: z.number().optional(),
  }),
});

export const collections = { essays };
