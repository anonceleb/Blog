import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { byRecency } from '../lib/essays';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays');

  // Newest first; `order` breaks ties between pieces sharing a date, so the
  // feed matches the site's own ordering rather than filesystem order.
  const sorted = [...essays].sort(byRecency);

  const site = context.site ? new URL(context.site).toString() : 'http://localhost:3000';

  return rss({
    title: 'Writing',
    description: 'Stories and notes',
    site,
    items: sorted.map((essay) => {
      const series = essay.data.series;
      return {
        title: essay.data.title,
        description: essay.data.description,
        link: new URL(`/essays/${essay.id}/`, site).toString(),
        pubDate: essay.data.date,
        categories: series ? [essay.data.category, series] : [essay.data.category],
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
