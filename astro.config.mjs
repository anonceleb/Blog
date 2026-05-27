// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashwin-kumar.com',
  trailingSlash: 'always',     // Matches the clean /essays/slug/ style
});
