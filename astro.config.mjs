import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import { VitePWA } from '@vite-pwa/astro';

export default defineConfig({
  output: 'static',
  adapter: netlify(),
  integrations: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/maskable.svg'],
      manifest: {
        name: 'StepPet',
        short_name: 'StepPet',
        description: 'Track steps, streaks, and pet battles with a cozy walking companion.',
        theme_color: '#fbeee0',
        background_color: '#fef8f1',
        start_url: '/',
        display: 'standalone',
        lang: 'en',
        scope: '/',
        icons: [
          {
            src: '/icons/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/maskable.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
