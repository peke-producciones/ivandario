/**
 * Eventos de conversión: doctoralia · whatsapp · tiktok · formulario.
 *
 * Cualquier elemento con data-track="nombre" envía un evento al hacer clic.
 * Solo se envía el NOMBRE del evento: nunca nombres, mensajes ni datos de la
 * persona (PROJECT BRAIN §07).
 *
 * El proveedor se configura en site.ts → analytics. Con Plausible cada evento
 * se envía como evento personalizado; Cloudflare Web Analytics solo mide
 * visitas. En desarrollo los eventos se registran en la consola.
 */
type Provider = (event: string) => void;

declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

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
  if (typeof window.plausible === 'function') registerProvider((event) => window.plausible?.(event));

  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (el?.dataset.track) track(el.dataset.track);
  });
}
