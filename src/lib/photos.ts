import type { ImageMetadata } from 'astro';
import { site } from '@/config/site';
import { isConfirmed, type Field } from './pending';

/** ¿Se muestran marcadores de fotos pendientes? (desarrollo o vista previa) */
export const showPhotoPlaceholders = (): boolean =>
  (import.meta.env.DEV || site.preview.showPending) && !process.env.SIN_FOTOS;

/**
 * ¿Debe reservarse el espacio de una fotografía?
 * - Foto confirmada: siempre.
 * - Pendiente: solo en desarrollo o con la vista previa activa (se ve el marcador).
 *   `SIN_FOTOS=1 npm run dev` muestra la variante tipográfica de lanzamiento.
 */
export function hasPhotoSlot(field: Field<ImageMetadata>): boolean {
  return isConfirmed(field) || showPhotoPlaceholders();
}
