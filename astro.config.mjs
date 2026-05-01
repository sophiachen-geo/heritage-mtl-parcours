// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Pour un déploiement sur GitHub Pages, l'URL de base correspond au nom du dépôt.
// Si vous utilisez un domaine personnalisé ou un dépôt nommé `username.github.io`,
// remplacez `base` par '/' et ajustez `site` en conséquence.
export default defineConfig({
  site: 'https://sophiachen-geo.github.io/heritage-mtl-parcours',
  base: '/heritage-mtl-parcours/',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  image: {
    // Les images locales sont optimisées automatiquement par Sharp.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
