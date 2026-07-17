// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pip-it-up.vercel.app',
  integrations: [react(), sitemap()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
    },
    {
      provider: fontProviders.google(),
      name: 'Gochi Hand',
      cssVariable: '--font-gochi',
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
    },
    {
      provider: fontProviders.google(),
      name: 'Special Elite',
      cssVariable: '--font-special-elite',
    },
    {
      provider: fontProviders.google(),
      name: 'Courier Prime',
      cssVariable: '--font-courier',
    },
  ],
});