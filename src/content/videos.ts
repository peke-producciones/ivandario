/**
 * Videos destacados de TikTok (PROJECT BRAIN §4.7).
 *
 * Agrega entre 3 y 6 videos REALES de @ivan.dario21. Mientras la lista esté
 * vacía, la sección muestra una invitación al perfil.
 *
 * - url:   enlace completo del video (https://www.tiktok.com/@ivan.dario21/video/123…)
 * - title: tema del video, en pocas palabras
 * - cover: opcional. Captura de portada en src/assets/videos/ (formato 9:16)
 *
 * Ejemplo:
 *   import cover1 from '@/assets/videos/ansiedad.jpg';
 *   { url: 'https://www.tiktok.com/@ivan.dario21/video/7300000000000000000', title: 'Cuando la mente no se detiene', cover: cover1 },
 */
import type { ImageMetadata } from 'astro';

export type Video = { url: string; title: string; cover?: ImageMetadata };

export const videos: Video[] = [];

/** Extrae el id numérico de la URL de un video de TikTok. */
export const videoId = (url: string): string | undefined => url.match(/\/video\/(\d+)/)?.[1];
