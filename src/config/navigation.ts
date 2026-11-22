/**
 * Navegación principal. El orden sigue el orden de lectura de la portada.
 * `id` es el ancla de la sección (debe coincidir con el id del <section>).
 */
export const navigation = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'enfoque', label: 'Mi enfoque' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'contacto', label: 'Contacto' },
] as const;
