/**
 * Rutas internas conscientes del `base` del sitio
 * (hoy `/ivandario` en GitHub Pages; `/` con dominio propio).
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path = '/'): string => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** Enlace a una sección de la portada. En la portada es un ancla pura. */
export const sectionHref = (id: string, isHome = true): string =>
  isHome ? `#${id}` : `${url('/')}#${id}`;
