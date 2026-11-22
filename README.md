# Iván Darío · Psicoterapeuta

Sitio profesional de Iván Darío García Villarreal, psicoterapeuta en Monterrey y en línea.

- **Vista previa pública:** https://peke-producciones.github.io/ivandario/
- **Stack:** [Astro](https://astro.build) (sitio estático) · CSS propio con tokens · Manrope + Playfair Display alojadas en el propio sitio.
- **Sistema visual:** «Margen». Ver `/dev/sistema` en desarrollo.

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
- En desarrollo, las fotos que faltan aparecen como bloques «Foto provisional». Para ver el sitio tal como se publicaría hoy (sin fotos), ejecuta `SIN_FOTOS=1 npm run dev`.

---

## Actualizar contenidos

Todos los datos profesionales están en **`src/config/site.ts`**: nombre, precio, duración, modalidades, enlaces, WhatsApp, horarios, formación y fotografías.

### Datos pendientes

Lo que todavía no está confirmado se escribe con `pending('…')` y **no aparece en el sitio**. Para publicarlo:

```ts
// antes
whatsapp: pending<string>('Número profesional de WhatsApp'),
// después
whatsapp: confirmed('5281XXXXXXXX'),
```

(Agrega `confirmed` al `import` de `@/lib/pending`.)

Al confirmar un dato, el módulo correspondiente se activa solo. Por ejemplo, al confirmar el WhatsApp aparecen el botón flotante y el botón de contacto.

El archivo se valida al compilar: un WhatsApp sin el formato `52` + 10 dígitos, una URL inválida o un título SEO demasiado largo detienen el build con un mensaje claro.

### Fotografías

1. Coloca la imagen original (JPG, lado largo de 2400 px o más) en `src/assets/photos/`, por ejemplo `hero.jpg`.
2. En `site.ts`, impórtala y confírmala:

   ```ts
   import heroPortrait from '@/assets/photos/hero.jpg';
   // …
   photos: { hero: confirmed(heroPortrait), … }
   ```

3. El build genera automáticamente versiones AVIF/WebP en varios tamaños.

Encuadres previstos: **hero 4:5**, **sobre mí 3:4**, **respiro 21:9**, **avatar 1:1** y **Open Graph 3:2**.

### Guardia de publicación

`integrations/publish-guard.mjs` revisa el HTML generado y **detiene el build** si encuentra marcadores como `PENDIENTE`, fotos provisionales o texto de relleno. Así, la información incompleta nunca llega a publicarse.

### Indexación en buscadores

`seo.indexable` está en `false` mientras el sitio es una vista previa: la página lleva `noindex` y `robots.txt` bloquea a los buscadores. Cámbialo a `true` en el lanzamiento, con los textos ya revisados.

---

## Publicación

Cada `push` a `main` (o a la rama de desarrollo) publica el sitio en GitHub Pages mediante `.github/workflows/deploy.yml`.

**Configuración única:** en GitHub ve a *Settings → Pages → Build and deployment → Source* y elige **GitHub Actions**.

### Pasar a dominio propio

1. En el workflow, cambia `SITE_URL` por `https://tudominio.mx` y `BASE_PATH` por `/`.
2. Agrega el dominio en *Settings → Pages → Custom domain* y crea `public/CNAME` con el dominio.
3. Cambia `seo.indexable` a `true` cuando el contenido esté aprobado.

---

## Estructura

```
src/
  config/site.ts          datos profesionales (fuente única)
  config/navigation.ts    menú
  lib/                    utilidades (datos pendientes, rutas, fotos)
  styles/                 tokens, retícula y estilos base
  components/ui/          Button, Mark (subrayado), Folio, Photo
  components/sections/    una sección por archivo
  components/Header.astro · MobileCta.astro
  scripts/                interacciones y eventos de conversión
  layouts/BaseLayout.astro
  pages/                  rutas públicas
  dev/sistema.astro       muestrario (solo desarrollo)
integrations/             guardia de publicación y rutas de desarrollo
```

## Eventos de conversión

Los enlaces con `data-track="…"` emiten eventos (`doctoralia`, `whatsapp`, `tiktok`, `formulario`). Solo se envía el nombre del evento, **nunca datos personales**. El proveedor de analítica (sin cookies) se conecta en `src/scripts/track.ts`.
