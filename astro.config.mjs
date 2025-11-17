import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/static';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
});
