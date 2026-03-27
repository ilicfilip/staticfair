import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fair.pm',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/packages/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
