import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

async function build() {
  const contentDir = path.resolve(process.cwd(), 'src/content/essays');
  const outDir = path.resolve(process.cwd(), 'public');
  try {
    const files = await fs.readdir(contentDir);
    const items = [];

    for (const f of files) {
      if (!f.endsWith('.md')) continue;
      const p = path.join(contentDir, f);
      const raw = await fs.readFile(p, 'utf8');
      const parsed = matter(raw);
      const title = parsed.data.title || f.replace(/\.md$/, '');
      const slug = f.replace(/\.md$/, '').toLowerCase();
      const description = parsed.data.description || '';
      const content = (parsed.content || '').replace(/\n+/g, ' ').replace(/[#>*`\[\]]/g, ' ').trim();
      const excerpt = description || content.slice(0, 250);
      items.push({
        title,
        slug,
        url: `/essays/${slug}/`,
        excerpt,
        category: parsed.data.category || 'Fiction',
        series: parsed.data.series || null,
        seriesOrder: parsed.data.seriesOrder ?? null,
        date: parsed.data.date ? new Date(parsed.data.date).toISOString().slice(0, 10) : null,
      });
    }

    // Newest first so search results are in a stable, meaningful order.
    items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title));

    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'search.json'), JSON.stringify(items, null, 2), 'utf8');
    console.log(`Wrote ${items.length} items to public/search.json`);
  } catch (err) {
    console.error('Error building search index:', err);
    process.exit(1);
  }
}

build();
