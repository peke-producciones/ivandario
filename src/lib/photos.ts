import type { ImageMetadata } from 'astro';
import { isConfirmed, type Field } from './pending';

/**
 * ¿Debe reservarse el espacio de una fotografía?
 * - Producción: solo si la foto está confirmada.
 * - Desarrollo: siempre (se ve el marcador provisional), salvo con
 *   `SIN_FOTOS=1 npm run dev`, que muestra el sitio tal como se publicaría hoy.
 */
export function hasPhotoSlot(field: Field<ImageMetadata>): boolean {
  if (isConfirmed(field)) return true;
  if (!import.meta.env.DEV) return false;
  return !process.env.SIN_FOTOS;
}
