import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Guardia de publicación.
 * Después del build revisa cada HTML generado y detiene la publicación si
 * encuentra marcadores de información pendiente o recursos provisionales.
 * Regla del PROJECT BRAIN: nunca publicar "[PENDIENTE]" en producción.
 */
/** Marcadores permitidos solo en vista previa (preview.showPending = true). */
const PENDING = [
  { pattern: /\bPENDIENTE\b/i, reason: 'marcador de información pendiente' },
  { pattern: /data-pending/, reason: 'componente pendiente' },
  { pattern: /FOTO PROVISIONAL/i, reason: 'fotografía provisional' },
  { pattern: /data-placeholder/i, reason: 'componente provisional' },
];

/** Nunca permitidos. */
const ALWAYS = [
  { pattern: /lorem ipsum/i, reason: 'texto de relleno' },
  { pattern: /\bTODO\b|\bFIXME\b/, reason: 'nota de desarrollo' },
];

const PREVIEW_META = /<meta name="x-preview" content="pending-visible"/;

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
        let previewPending = 0;
        for await (const file of walk(root)) {
          const html = await readFile(file, 'utf8');
          const isPreview = PREVIEW_META.test(html);
          if (isPreview && /name="robots" content="index/.test(html)) {
            problems.push(`${file.replace(root, '')}: vista previa con marcadores pero indexable`);
          }
          for (const { pattern, reason } of ALWAYS) {
            const match = html.match(pattern);
            if (match) problems.push(`${file.replace(root, '')}: ${reason} («${match[0]}»)`);
          }
          for (const { pattern, reason } of PENDING) {
            const matches = html.match(new RegExp(pattern, pattern.flags + 'g'));
            if (!matches) continue;
            if (isPreview) previewPending += matches.length;
            else problems.push(`${file.replace(root, '')}: ${reason} («${matches[0]}»)`);
          }
        }
        if (previewPending) {
          logger.warn(
            `Vista previa: ${previewPending} marcadores de información pendiente visibles (preview.showPending = true).`,
          );
        }
        if (problems.length) {
          throw new Error(
            `Publicación detenida: el sitio contiene contenido no confirmado.\n  ${problems.join('\n  ')}`,
          );
        }
        if (!previewPending) logger.info('Sin marcadores pendientes ni recursos provisionales en el HTML publicado.');
      },
    },
  };
}
