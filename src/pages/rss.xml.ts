import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays');

  // Sort newest first for the feed (uses date if present, falls back to title)
  const sorted = [...essays].sort((a, b) => {
    const da = a.data.date ? a.data.date.getTime() : 0;
    const db = b.data.date ? b.data.date.getTime() : 0;
    if (da !== db) return db - da;
    return a.data.title.localeCompare(b.data.title);
  });

  const site = context.site ? new URL(context.site).toString() : 'http://localhost:3000';

  return rss({
    title: 'Writing',
    description: 'Stories and notes',
    site,
    items: sorted.map((essay) => {
      const item: any = {
        title: essay.data.title,
        description: essay.data.description,
        link: new URL(`/essays/${essay.id}/`, site).toString(),
      };
      if (essay.data.date) {
        item.pubDate = essay.data.date;
      }
      return item;
    }),
    customData: `<language>en-us</language>`,
  });
}
