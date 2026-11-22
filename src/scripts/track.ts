/**
 * Eventos de conversión: doctoralia · whatsapp · tiktok · formulario.
 *
 * Cualquier elemento con data-track="nombre" envía un evento al hacer clic.
 * Solo se envía el NOMBRE del evento: nunca nombres, mensajes ni datos de la
 * persona (PROJECT BRAIN §07).
 *
 * El proveedor de analítica se conecta en la Fase 6. Mientras tanto los
 * eventos solo se registran en la consola durante el desarrollo.
 */
type Provider = (event: string) => void;

const providers: Provider[] = [];

export function registerProvider(provider: Provider): void {
  providers.push(provider);
}

export function track(event: string): void {
  if (import.meta.env.DEV) console.debug(`[track] ${event}`);
  for (const send of providers) {
    try {
      send(event);
    } catch {
      /* la analítica nunca debe romper la navegación */
    }
  }
}

export function initTracking(): void {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (el?.dataset.track) track(el.dataset.track);
  });
}
