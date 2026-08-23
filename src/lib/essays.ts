import { getCollection, type CollectionEntry } from 'astro:content';

export type Essay = CollectionEntry<'essays'>;

export type Group =
  | { kind: 'series'; name: string; label: string; entries: Essay[] }
  | { kind: 'category'; name: string; label: string; entries: Essay[] };

/**
 * Categories in the order they appear on the home page. `label` is the home
 * page heading: standalone fiction reads as "Stories" there, since the series
 * blocks above it are fiction too and repeating the word is confusing.
 */
const CATEGORY_ORDER = [
  { name: 'Fiction', label: 'Stories' },
  { name: 'Personal', label: 'Personal' },
];

/**
 * Newest first; `order` breaks ties between pieces sharing a date. Keep `order`
 * unique across the whole collection so the feed and the site agree.
 */
export function byRecency(a: Essay, b: Essay) {
  const d = b.data.date.getTime() - a.data.date.getTime();
  if (d !== 0) return d;
  const oa = a.data.order ?? Number.MAX_SAFE_INTEGER;
  const ob = b.data.order ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return a.data.title.localeCompare(b.data.title);
}

/** Reading order within a series. */
export function bySeriesOrder(a: Essay, b: Essay) {
  return (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0);
}

export function seriesSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function categorySlug(name: string) {
  return seriesSlug(name);
}

/** Every entry of a series, in reading order. */
export async function getSeries(name: string) {
  const all = await getCollection('essays');
  return all.filter((e) => e.data.series === name).sort(bySeriesOrder);
}

/**
 * Home page structure: each series as its own block (reading order, newest
 * series first), then the remaining pieces grouped by category (newest first).
 */
export async function getGroups(): Promise<Group[]> {
  const all = await getCollection('essays');

  const seriesNames = [...new Set(all.map((e) => e.data.series).filter(Boolean))] as string[];

  const seriesGroups: Group[] = seriesNames
    .map((name) => ({
      kind: 'series' as const,
      name,
      label: name,
      entries: all.filter((e) => e.data.series === name).sort(bySeriesOrder),
    }))
    // A series is as recent as its most recent instalment.
    .sort((a, b) => latest(b.entries) - latest(a.entries));

  const standalone = all.filter((e) => !e.data.series);
  const categoryGroups: Group[] = CATEGORY_ORDER.map(({ name, label }) => ({
    kind: 'category' as const,
    name,
    label,
    entries: standalone.filter((e) => e.data.category === name).sort(byRecency),
  })).filter((g) => g.entries.length > 0);

  return [...seriesGroups, ...categoryGroups];
}

function latest(entries: Essay[]) {
  return Math.max(...entries.map((e) => e.data.date.getTime()));
}
