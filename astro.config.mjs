// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // ← Change this to your real domain (e.g. https://yourname.com) before deploying
  trailingSlash: 'always',     // Matches the clean /essays/slug/ style
});
