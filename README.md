# Iván Darío · Psicoterapeuta

Sitio profesional de Iván Darío García Villarreal, psicoterapeuta en Monterrey y en línea.

- **Vista previa pública:** https://peke-producciones.github.io/ivandario/
- **Stack:** [Astro](https://astro.build) (sitio estático, sin JavaScript de framework) · CSS propio con tokens · Manrope + Playfair Display alojadas en el propio sitio.
- **Sistema visual:** «Margen». Se puede ver en `/dev/sistema` durante el desarrollo.
- **Lo que falta para lanzar:** ver [`PENDIENTES.md`](PENDIENTES.md).

---

## Trabajar en local

Requiere Node 22.

```bash
npm install
npm run dev          # http://localhost:4321/ivandario/
npm run build        # genera dist/
npm run preview      # sirve dist/ tal como se publicará
npm run check        # revisión de tipos
```

- `http://localhost:4321/ivandario/dev/sistema` muestra colores, contrastes, tipografía y componentes. Solo existe en desarrollo.
- `SIN_FOTOS=1 npm run dev` muestra el sitio sin marcadores de fotos, tal como se vería al lanzar sin fotografías.

---

## Modo vista previa

`site.ts → preview.showPending`

| Valor | Qué pasa |
|---|---|
| `true` (hoy) | Todo lo que falta aparece en la página con una etiqueta **«Pendiente»**: fotos, cédula, WhatsApp, horarios, etc. El sitio no se indexa en buscadores. |
| `false` (lanzamiento) | Lo pendiente se oculta y los módulos incompletos no se muestran. La guardia de publicación **detiene el build** si queda cualquier marcador. |

No se puede activar `seo.indexable` mientras la vista previa esté encendida: el build lo impide.

---

## Actualizar contenidos

| Qué | Dónde |
|---|---|
| Nombre, precio, duración, modalidades, enlaces, WhatsApp, horarios, formación, fotos | `src/config/site.ts` |
| Motivos de consulta | `src/content/reasons.ts` |
| Los cuatro conceptos del enfoque | `src/content/approach.ts` |
| Preguntas frecuentes | `src/content/faq.ts` |
| Videos de TikTok | `src/content/videos.ts` |
| Artículos | `src/content/articulos/` (copiar `_plantilla.md`) |
| Menú | `src/config/navigation.ts` |
| Aviso de privacidad | `src/pages/aviso-de-privacidad/index.astro` |

### Confirmar un dato pendiente

```ts
// antes
whatsapp: pending<string>('Número profesional de WhatsApp'),
// después (agrega `confirmed` al import de '@/lib/pending')
whatsapp: confirmed('5281XXXXXXXX'),
```

Al confirmarse, el módulo correspondiente se activa solo. Por ejemplo, el WhatsApp activa el botón de contacto, el de la barra móvil y el del footer, y además se agrega a los datos estructurados.

`site.ts` se valida al compilar. Un WhatsApp sin el formato `52` + 10 dígitos, una URL inválida o un título SEO demasiado largo detienen el build con un mensaje claro.

### Fotografías

1. Coloca el original (JPG, lado largo de 2400 px o más) en `src/assets/photos/`, por ejemplo `hero.jpg`.
2. En `site.ts`:

   ```ts
   import heroPortrait from '@/assets/photos/hero.jpg';
   // …
   photos: { hero: confirmed(heroPortrait), … }
   ```

3. El build genera AVIF y WebP en varios tamaños.

Encuadres previstos: **hero 4:5** (sujeto a un tercio, aire hacia la izquierda) y **sobre mí 3:4**. Tratamiento: luz natural, saturación baja, negros cálidos y nunca negro puro.

### Videos de TikTok

En `src/content/videos.ts`, de 3 a 6 videos reales:

```ts
{ url: 'https://www.tiktok.com/@ivan.dario21/video/7300000000000000000', title: 'Cuando la mente no se detiene' },
```

El reproductor oficial solo se carga cuando la persona da clic. Opcionalmente, agrega una portada 9:16 en `src/assets/videos/`.

### Formulario de contacto

Pide únicamente nombre, medio de contacto y un mensaje opcional, con aceptación del aviso de privacidad. Nunca pide información clínica.

Para activarlo, crea un formulario en un servicio de reenvío por correo (por ejemplo [Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com)) y confirma su URL:

```ts
formEndpoint: confirmed('https://formspree.io/f/xxxxxxx'),
```

Mientras no esté configurado, aparece desactivado (en vista previa) o no aparece (en lanzamiento).

### Analítica (sin cookies)

```ts
analytics: { provider: confirmed({ provider: 'plausible', domain: 'tudominio.mx' }) },
// o
analytics: { provider: confirmed({ provider: 'cloudflare', token: 'xxxxxxxx' }) },
```

Eventos de conversión: `doctoralia`, `whatsapp`, `tiktok` y `formulario`. Solo se envía el nombre del evento, **nunca datos personales**. Plausible registra los eventos; Cloudflare solo cuenta visitas.

### Imagen para compartir e íconos

`public/og.png`, `public/apple-touch-icon.png` y `public/favicon-32.png` se generan con:

```bash
npx playwright install chromium   # una sola vez
node tools/generate-images.mjs
```

---

## Publicación

Cada `push` a `main` (o a la rama de desarrollo) publica el sitio en GitHub Pages mediante `.github/workflows/deploy.yml`. El workflow revisa tipos, compila y pasa la guardia antes de publicar.

### Lanzamiento

1. Confirmar en `site.ts` los datos de [`PENDIENTES.md`](PENDIENTES.md).
2. `preview.showPending: false`.
3. `seo.indexable: true`.
4. Si hay dominio propio:
   - en el workflow, `SITE_URL=https://tudominio.mx` y `BASE_PATH=/`;
   - crear `public/CNAME` con el dominio;
   - configurarlo en *Settings → Pages → Custom domain*.
5. En Google Search Console, verificar el sitio (`seo.googleVerification`) y enviar `sitemap-index.xml`.

---

## Estructura

```
src/
  config/site.ts          datos profesionales (fuente única) + validación
  config/navigation.ts    menú
  content/                textos editables y colección de artículos
  lib/                    datos pendientes, rutas, fotos, JSON-LD
  styles/                 tokens, retícula y estilos base
  components/ui/          Button, Mark (subrayado), Folio, Photo, Pending, Section
  components/sections/    una sección por archivo
  components/             Header, Footer, MobileCta, ContactForm
  scripts/                interacciones y eventos de conversión
  layouts/                BaseLayout (head, SEO) y PageLayout (páginas interiores)
  pages/                  portada, aviso de privacidad, artículos, 404, robots.txt
  dev/sistema.astro       muestrario (solo desarrollo)
integrations/             guardia de publicación y rutas de desarrollo
tools/                    generador de imagen OG e íconos
```

## Calidad verificada

- Lighthouse (móvil y escritorio): rendimiento 100, accesibilidad 100, buenas prácticas 100. SEO 100 en la configuración de lanzamiento; en vista previa marca 63 porque el `noindex` es intencional.
- axe-core: 0 errores WCAG 2.2 AA en escritorio y móvil, menú abierto, FAQ abierta, aviso de privacidad y 404.
- Sin desbordes horizontales de 320 a 1920 px, ni errores de consola.
- `prefers-reduced-motion` respetado; navegación completa con teclado.
