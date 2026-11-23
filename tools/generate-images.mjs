/**
 * Genera la imagen para compartir (Open Graph) y los íconos a partir de HTML
 * con las fuentes de la marca.
 *
 *   node tools/generate-images.mjs
 *
 * Requiere Playwright con Chromium instalado (no es dependencia del sitio):
 *   npx playwright install chromium
 *
 * Salida: public/og.png (1200×630), public/apple-touch-icon.png (180×180),
 *         public/favicon-32.png (32×32)
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const root = resolve(fileURLToPath(import.meta.url), '../..');
// Fuentes incrustadas (data URL): una página generada no puede leer archivos locales.
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, `node_modules/@fontsource-variable/${pkg}/files/${file}`)).toString('base64')}`;

const fonts = `
  @font-face { font-family: 'Playfair'; font-weight: 400 900; src: url(${font('playfair-display', 'playfair-display-latin-wght-normal.woff2')}); }
  @font-face { font-family: 'Playfair'; font-style: italic; font-weight: 400 900; src: url(${font('playfair-display', 'playfair-display-latin-wght-italic.woff2')}); }
  @font-face { font-family: 'Manrope'; font-weight: 200 800; src: url(${font('manrope', 'manrope-latin-wght-normal.woff2')}); }
  * { margin: 0; box-sizing: border-box; }
  body { -webkit-font-smoothing: antialiased; }
`;

const og = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  body { width: 1200px; height: 630px; background: #f5f2ec; color: #202020; padding: 64px 72px; display: grid; grid-template-rows: auto 1fr auto; font-family: Manrope; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 18px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
  .brand i { width: 9px; height: 9px; border-radius: 50%; background: #d66b3d; }
  .brand span { font-weight: 500; letter-spacing: .22em; color: #6b665e; font-size: 15px; }
  h1 { align-self: center; font-family: Playfair; font-weight: 400; font-size: 86px; line-height: .98; letter-spacing: -.02em; }
  em { position: relative; }
  em svg { position: absolute; left: 0; bottom: -6px; width: 100%; height: 14px; overflow: visible; }
  .dot { color: #d66b3d; }
  .facts { display: flex; gap: 0; border-top: 1.5px solid #202020; padding-top: 20px; }
  .facts div { flex: 1; font-family: Playfair; font-size: 25px; white-space: nowrap; font-variant-numeric: lining-nums; }
  .facts div + div { padding-left: 24px; border-left: 1px solid #b7b1a7; margin-left: 24px; }
  .facts small { display: block; font-family: Manrope; font-size: 13px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #6b665e; margin-bottom: 6px; }
</style></head><body>
  <p class="brand">Iván Darío <i></i> <span>Psicoterapeuta</span></p>
  <h1>No siempre necesitas<br>tener todo claro para<br><em>comenzar<svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M3 9.5 C 60 4.5, 140 11.5, 210 6.5 S 280 6, 297 7.5" fill="none" stroke="#d66b3d" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></em><span class="dot">.</span></h1>
  <div class="facts">
    <div><small>Atención</small>Adultos y adolescentes</div>
    <div><small>Modalidad</small>Monterrey y en línea</div>
    <div><small>Sesión</small>45–60 min</div>
    <div><small>Precio</small>$700 MXN</div>
  </div>
</body></html>`;

const icon = (size) => `<!doctype html><html><head><style>${fonts}
  body { width: ${size}px; height: ${size}px; background: #202020; display: grid; place-items: center; }
  i { width: ${Math.round(size * 0.28)}px; height: ${Math.round(size * 0.28)}px; border-radius: 50%; background: #d66b3d; }
</style></head><body><i></i></body></html>`;

const browser = await chromium.launch();
const shoot = async (html, w, h, out) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, out) });
  await page.close();
};
await shoot(og, 1200, 630, 'public/og.png');
await shoot(icon(180), 180, 180, 'public/apple-touch-icon.png');
await shoot(icon(32), 32, 32, 'public/favicon-32.png');
await browser.close();
console.log('Listo: public/og.png, public/apple-touch-icon.png, public/favicon-32.png');
