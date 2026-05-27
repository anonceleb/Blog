# Writing — A Minimal, Text-First Blog

Extremely clean, Vitalik Buterin-inspired static site built with the latest Astro (v6).

- **Zero dates on the main listing page** — just the writing, grouped by category.
- Add a new essay = drop a `.md` file in `src/content/essays/`.
- Fully static. One-command deploy to Vercel, Netlify, or Cloudflare Pages.
- ~300 lines of CSS total. No frameworks, no JS bloat beyond a 15-line dark mode toggle.
- Static table of contents (generated at build time, zero runtime JS).
- Dark mode that respects system preference + manual toggle.

## Live structure (after `npm run build`)

```
/dist/
├── index.html                 # Grouped list of all essays (no dates)
├── essays/<slug>/index.html   # Individual readable essay pages
├── categories/
│   ├── index.html
│   └── <category>/index.html
├── about/index.html
└── rss.xml
```

## Getting started

```bash
cd /Users/Ashwin/Streak/Blog
npm install
npm run dev          # http://localhost:4321
npm run build        # produces ./dist (ready to deploy)
```

## How to add a new essay (the whole point)

1. Create a new file: `src/content/essays/your-slug-here.md`
2. Add frontmatter:

```md
---
title: "Your Title Here"
date: 2025-05-20          # optional — omit this for old writings
category: "Philosophy"    # or Technology, Personal, Economics, etc.
description: "One-sentence summary for RSS and meta."
---

Your Markdown content starts here.

## Headings become TOC entries automatically

- Lists work
- **Bold**, *italic*, etc.

> Blockquotes too.
```

3. Run `npm run build` (or the dev server hot-reloads).

That's it. No admin UI, no databases, no "publishing" step.

### Adding your old writings without dates dominating the page

**Just leave the `date` field out of the frontmatter.**

- On the homepage and category listings: **no date is ever shown** (by design).
- On the individual essay page: if `date` is present it shows a small "12 Mar 2024 · See all essays" line. If absent, only the "See all essays" link appears.
- The essay still appears in the correct category group and is fully searchable/indexable.

This is the exact reason the date is optional in the schema.

Example of an old undated essay:

```md
---
title: "Notes on Something I Wrote in 2017"
category: "Personal"
---

Everything below is the full text...
```

It will appear cleanly on the home page with zero date noise.

## Customization

### Change the site name / title

Edit `src/layouts/Layout.astro`:

```ts
const siteTitle = "Your Name's Writing";
```

### Change the domain (important for RSS + absolute links)

Edit `astro.config.mjs`:

```js
site: 'https://yourname.com',
```

### Categories

Just use whatever string you want in `category:`. New categories appear automatically on the homepage and `/categories` page. No configuration needed.

### Typography & styling

All design lives in `src/styles/global.css` (one file, heavily commented). Tweak font size, max-width (currently 720px), line-height, etc. there.

## Deployment (one click / one command)

### Vercel
1. Push this repo to GitHub.
2. Import on vercel.com → it auto-detects Astro.
3. Set the root directory if needed and deploy. Done.

### Netlify
- Same flow. Netlify also has excellent Astro support.
- Or drag the `dist` folder into their manual deploy.

### Cloudflare Pages
- Connect repo → build command `npm run build`, output directory `dist`.

All three give you free custom domains + automatic HTTPS.

## RSS

The feed is at `/rss.xml`. Subscribe in any reader. It includes every essay that has a `date` (undated ones are still in the feed but without a pubDate).

## Philosophy of this site

- The reader’s attention is sacred.
- Every extra byte of JavaScript, every heavy font, every tracking pixel, every “related posts” widget is a small act of hostility toward the person who came here to read.
- Dates on a listing page are often noise when you’re browsing ideas rather than news.
- Adding friction to publishing (CMS dashboards, image optimization pipelines, etc.) means you write less.

This setup removes all of that friction while still giving you a beautiful reading experience.

## Commands

| Command          | Action                                      |
|------------------|---------------------------------------------|
| `npm run dev`    | Local dev server                            |
| `npm run build`  | Production build → `./dist`                 |
| `npm run preview`| Serve the production build locally          |

## License

Do whatever you want with it. It’s deliberately boring on purpose.

## Repository & Deployment

- **Git repository:** https://github.com/anonceleb/Blog
- **Deployed to Vercel:** The site is deployed and content is hosted at https://ashwin-kumar.com

Note: search requires a small index file generated from the local markdown files. This runs automatically before `npm run build` (via the `prebuild` script) but you can also run it manually with:

```bash
npm run build-search-index
```
