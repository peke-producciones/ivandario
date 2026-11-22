import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Guardia de publicación.
 * Después del build revisa cada HTML generado y detiene la publicación si
 * encuentra marcadores de información pendiente o recursos provisionales.
 * Regla del PROJECT BRAIN: nunca publicar "[PENDIENTE]" en producción.
 */
const FORBIDDEN = [
  { pattern: /\bPENDIENTE\b/, reason: 'marcador de información pendiente' },
  { pattern: /FOTO PROVISIONAL/i, reason: 'fotografía provisional' },
  { pattern: /data-placeholder/i, reason: 'componente provisional' },
  { pattern: /lorem ipsum/i, reason: 'texto de relleno' },
  { pattern: /\bTODO\b|\bFIXME\b/, reason: 'nota de desarrollo' },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** @returns {import('astro').AstroIntegration} */
export default function publishGuard() {
  return {
    name: 'publish-guard',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const problems = [];
        for await (const file of walk(root)) {
          const html = await readFile(file, 'utf8');
          for (const { pattern, reason } of FORBIDDEN) {
            const match = html.match(pattern);
            if (match) problems.push(`${file.replace(root, '')}: ${reason} («${match[0]}»)`);
          }
        }
        if (problems.length) {
          throw new Error(
            `Publicación detenida: el sitio contiene contenido no confirmado.\n  ${problems.join('\n  ')}`,
          );
        }
        logger.info('Sin marcadores pendientes ni recursos provisionales en el HTML publicado.');
      },
    },
  };
}
