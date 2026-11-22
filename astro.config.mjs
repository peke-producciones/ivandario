// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import devRoutes from './integrations/dev-routes.mjs';
import publishGuard from './integrations/publish-guard.mjs';

/**
 * Dónde se publica el sitio.
 * Hoy: GitHub Pages (https://peke-producciones.github.io/ivandario/).
 * Con dominio propio: SITE_URL=https://tudominio.mx y BASE_PATH=/ (ver README).
 */
const SITE_URL = process.env.SITE_URL ?? 'https://peke-producciones.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/ivandario';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [devRoutes(), publishGuard(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: false,
  devToolbar: { enabled: false },
});
