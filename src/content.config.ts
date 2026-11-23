/**
 * Colecciones de contenido.
 *
 * ARTÍCULOS — src/content/articulos/*.md
 * Copia `_plantilla.md`, cámbiale el nombre (será la URL) y escribe.
 * Los archivos que empiezan con «_» o tienen `draft: true` no se publican.
 * Mientras no haya artículos publicados, la sección /articulos/ no existe.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articulos = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articulos' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(170),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articulos };
