import type { APIRoute } from 'astro';
import { site } from '@/config/site';

/** Mientras el sitio sea vista previa (seo.indexable = false) se bloquea a los buscadores. */
export const GET: APIRoute = ({ site: siteUrl }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemap = new URL(`${base}/sitemap-index.xml`, siteUrl).href;
  const body = site.seo.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
