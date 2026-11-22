/** Comportamiento de la interfaz. Todo es mejora progresiva: sin JS el sitio funciona. */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Aparición de bloques y subrayados al entrar en pantalla (una sola vez). */
export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-mark="view"]');
  if (!targets.length) return;
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );
  targets.forEach((el) => io.observe(el));
}

/** Filete inferior del header cuando la página deja la parte superior. */
export function initHeaderState(): void {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    document.documentElement.toggleAttribute('data-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

/** Marca en la navegación la sección que se está leyendo. */
export function initScrollSpy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
  const sections = links
    .map((link) => document.getElementById(link.dataset.spy ?? ''))
    .filter((s): s is HTMLElement => Boolean(s));
  if (!sections.length) return;

  const setActive = (id: string | null) => {
    for (const link of links) {
      if (link.dataset.spy === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(null);
    }).observe(hero);
  }
}

/** Menú móvil sobre <dialog>: foco atrapado, Esc y bloqueo de fondo nativos. */
export function initMenu(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn || typeof dialog.showModal !== 'function') return;

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
  });
  dialog.addEventListener('close', () => openBtn.setAttribute('aria-expanded', 'false'));
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-menu-link]').forEach((link) =>
    link.addEventListener('click', () => dialog.close()),
  );
  // Si la pantalla crece a escritorio con el menú abierto, se cierra.
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}

/** Barra inferior móvil: visible cuando los CTA del hero salen de pantalla y antes del contacto. */
export function initMobileCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const hero = document.querySelector('[data-hero-actions]') ?? document.querySelector('[data-hero]');
  if (!bar) return;
  if (!hero) {
    bar.setAttribute('data-visible', '');
    return;
  }
  let heroVisible = true;
  let contactVisible = false;
  const update = () => bar.toggleAttribute('data-visible', !heroVisible && !contactVisible);

  new IntersectionObserver(([entry]) => {
    // Solo cuenta como «fuera» si el usuario ya pasó los CTA (no si están debajo).
    heroVisible = entry.isIntersecting || entry.boundingClientRect.top > 0;
    update();
  }).observe(hero);

  const contact = document.getElementById('contacto');
  if (contact) {
    new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      update();
    }).observe(contact);
  }
}
