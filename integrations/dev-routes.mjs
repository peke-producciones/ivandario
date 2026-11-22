/**
 * Rutas que solo existen en desarrollo (`npm run dev`).
 * Nunca se incluyen en el build de producción.
 * @returns {import('astro').AstroIntegration}
 */
export default function devRoutes() {
  return {
    name: 'dev-routes',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({
          pattern: '/dev/sistema',
          entrypoint: new URL('../src/dev/sistema.astro', import.meta.url),
        });
      },
    },
  };
}
