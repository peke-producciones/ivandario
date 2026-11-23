/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATOS PROFESIONALES — ARCHIVO CENTRAL
 * ─────────────────────────────────────────────────────────────────────────────
 *  Todo lo que el sitio dice sobre Iván Darío sale de aquí.
 *
 *  · Datos confirmados: se escriben directamente.
 *  · Datos pendientes:  pending('nota')  → NO se muestran en el sitio.
 *  · Para publicar un dato pendiente: cámbialo por confirmed(valor).
 *
 *  Al guardar, el archivo se valida. Si un dato tiene un formato incorrecto
 *  (por ejemplo, un WhatsApp sin lada), el sitio no compila y te dice por qué.
 *  Ver README.md → «Actualizar contenidos».
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import { pending, type Field } from '@/lib/pending';

// Fotografías: cuando existan, colócalas en src/assets/photos/ e impórtalas aquí.
// import heroPortrait from '@/assets/photos/hero.jpg';

const data = {
  person: {
    /** Nombre de marca: el que se usa en titulares, logotipo y navegación. */
    displayName: 'Iván Darío',
    /** Nombre completo: datos estructurados, aviso de privacidad y créditos. */
    fullName: 'Iván Darío García Villarreal',
    profession: 'Psicoterapeuta',
  },

  /** Concepto central de marca. */
  concept: 'Entenderte también es una forma de avanzar.',

  audience: ['Adultos', 'Adolescentes'],

  service: {
    name: 'Psicoterapia individual',
    durationMin: 45,
    durationMax: 60,
    price: 700,
    currency: 'MXN',
  },

  modalities: {
    inPerson: {
      label: 'Presencial',
      area: 'Monterrey y área metropolitana',
      region: 'Nuevo León',
      country: 'México',
    },
    online: {
      label: 'En línea',
      detail: 'Sesiones mediante videollamada',
      platform: pending<string>('Plataforma de videollamada'),
    },
  },

  links: {
    doctoralia: 'https://www.doctoralia.com.mx/perfil/ivan-dario-garcia',
    tiktok: {
      handle: '@ivan.dario21',
      url: 'https://www.tiktok.com/@ivan.dario21',
    },
  },

  contact: {
    /** Formato internacional sin signos: 52 + 10 dígitos. Ej.: confirmed('5281XXXXXXXX') */
    whatsapp: pending<string>('Número profesional de WhatsApp'),
    email: pending<string>('Correo profesional'),
    /** URL del servicio que recibe el formulario (p. ej. Formspree o Web3Forms). */
    formEndpoint: pending<string>('Servicio de envío del formulario de contacto'),
  },

  legal: {
    /** Domicilio para el aviso de privacidad (puede ser distinto al del consultorio). */
    privacyAddress: pending<string>('Domicilio del responsable para el aviso de privacidad'),
    /** El aviso de privacidad es un borrador hasta que lo revise un abogado. */
    privacyReviewed: false,
  },

  analytics: {
    /** Analítica sin cookies. Ej.: confirmed({ provider: 'plausible', domain: 'tudominio.mx' }) */
    provider: pending<{ provider: 'plausible'; domain: string } | { provider: 'cloudflare'; token: string }>(
      'Servicio de analítica sin cookies',
    ),
  },

  location: {
    address: pending<string>('Dirección exacta del consultorio'),
  },

  schedule: pending<string>('Horarios de atención'),
  availability: pending<string>('Disponibilidad de citas'),

  credentials: {
    license: pending<string>('Cédula profesional'),
    education: pending<string[]>('Universidad y títulos académicos'),
    certifications: pending<string[]>('Diplomados y certificaciones'),
    experience: pending<string>('Experiencia clínica'),
  },

  approach: {
    detailed: pending<string>('Enfoque terapéutico detallado'),
  },

  policies: {
    cancellation: pending<string>('Condiciones de cancelación y reservación'),
  },

  photos: {
    hero: pending<ImageMetadata>('Retrato principal 4:5'),
    about: pending<ImageMetadata>('Retrato «Sobre mí» 3:4'),
    // hero: confirmed(heroPortrait),
  },

  preview: {
    /**
     * Vista previa: todo lo que falta aparece en la página con una etiqueta
     * «Pendiente» (fotos incluidas). Cambiar a false para el lanzamiento: entonces
     * lo pendiente se oculta y la guardia impide publicar cualquier marcador.
     */
    showPending: true,
  },

  seo: {
    /**
     * false mientras el sitio es una vista previa: añade «noindex» y bloquea
     * robots. Cambiar a true en el lanzamiento, con los textos ya aprobados.
     */
    indexable: false,
    locale: 'es_MX',
    title: 'Iván Darío · Psicoterapeuta en Monterrey y en línea',
    description:
      'Psicoterapia individual para adultos y adolescentes, presencial en Monterrey y área metropolitana, y en línea. Sesiones de 45 a 60 minutos, $700 MXN.',
  },
};

// ── Validación ───────────────────────────────────────────────────────────────

const field = <T extends z.ZodType>(value: T) =>
  z.discriminatedUnion('status', [
    z.object({ status: z.literal('pending'), note: z.string().optional() }),
    z.object({ status: z.literal('confirmed'), value }),
  ]);

const image = z.custom<ImageMetadata>(
  (v) => typeof v === 'object' && v !== null && 'src' in v && 'width' in v,
  'Debe ser una imagen importada desde src/assets/photos/',
);

const schema = z.object({
  person: z.object({
    displayName: z.string().min(1),
    fullName: z.string().min(1),
    profession: z.string().min(1),
  }),
  concept: z.string().min(1),
  audience: z.array(z.string()).min(1),
  service: z.object({
    name: z.string(),
    durationMin: z.number().int().positive(),
    durationMax: z.number().int().positive(),
    price: z.number().positive(),
    currency: z.literal('MXN'),
  }),
  modalities: z.object({
    inPerson: z.object({ label: z.string(), area: z.string(), region: z.string(), country: z.string() }),
    online: z.object({ label: z.string(), detail: z.string(), platform: field(z.string().min(1)) }),
  }),
  links: z.object({
    doctoralia: z.url(),
    tiktok: z.object({ handle: z.string().startsWith('@'), url: z.url() }),
  }),
  contact: z.object({
    whatsapp: field(z.string().regex(/^52\d{10}$/, 'WhatsApp: 52 seguido de 10 dígitos, sin espacios ni signos')),
    email: field(z.email()),
    formEndpoint: field(z.url().startsWith('https://')),
  }),
  legal: z.object({
    privacyAddress: field(z.string().min(1)),
    privacyReviewed: z.boolean(),
  }),
  analytics: z.object({
    provider: field(
      z.discriminatedUnion('provider', [
        z.object({ provider: z.literal('plausible'), domain: z.string().min(3) }),
        z.object({ provider: z.literal('cloudflare'), token: z.string().min(10) }),
      ]),
    ),
  }),
  preview: z.object({ showPending: z.boolean() }),
  location: z.object({ address: field(z.string().min(1)) }),
  schedule: field(z.string().min(1)),
  availability: field(z.string().min(1)),
  credentials: z.object({
    license: field(z.string().min(1)),
    education: field(z.array(z.string().min(1)).min(1)),
    certifications: field(z.array(z.string().min(1)).min(1)),
    experience: field(z.string().min(1)),
  }),
  approach: z.object({ detailed: field(z.string().min(1)) }),
  policies: z.object({ cancellation: field(z.string().min(1)) }),
  photos: z.object({ hero: field(image), about: field(image) }),
  seo: z.object({
    indexable: z.boolean(),
    locale: z.string(),
    title: z.string().max(70),
    description: z.string().max(170),
  }),
});

const parsed = schema
  .refine((d) => !(d.seo.indexable && d.preview.showPending), {
    message: 'No se puede indexar el sitio con la vista previa activa: cambia preview.showPending a false.',
    path: ['preview', 'showPending'],
  })
  .safeParse(data);
if (!parsed.success) {
  throw new Error(`src/config/site.ts contiene datos inválidos:\n${z.prettifyError(parsed.error)}`);
}

export const site = data;
export type Site = typeof data;
export type { Field };

// ── Derivados de uso frecuente ───────────────────────────────────────────────

const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const facts = {
  price: `${mxn.format(site.service.price)} MXN`,
  duration: `${site.service.durationMin}–${site.service.durationMax} minutos`,
  /** «Adultos y adolescentes» */
  audience: site.audience.map((a, i) => (i ? a.toLowerCase() : a)).join(' y '),
};
