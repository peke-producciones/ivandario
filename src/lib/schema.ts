/**
 * Datos estructurados (JSON-LD) a partir de site.ts.
 * Solo usa información confirmada: no declara especialidades, cédula ni
 * dirección mientras estén pendientes.
 */
import { site } from '@/config/site';
import { valueOf } from '@/lib/pending';
import { faqPlain } from '@/content/faq';

export function homeSchema(siteUrl: URL, ogImage: string) {
  const home = siteUrl.href;
  const personId = `${home}#persona`;
  const serviceId = `${home}#consulta`;
  const address = valueOf(site.location.address);
  const whatsapp = valueOf(site.contact.whatsapp);
  const email = valueOf(site.contact.email);
  const license = valueOf(site.credentials.license);

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: site.person.fullName,
    alternateName: site.person.displayName,
    jobTitle: site.person.profession,
    url: home,
    sameAs: [site.links.tiktok.url, site.links.doctoralia],
    ...(license && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Cédula profesional',
        identifier: license,
      },
    }),
  };

  const business = {
    '@type': 'ProfessionalService',
    '@id': serviceId,
    name: `${site.person.displayName} · ${site.person.profession}`,
    description: site.seo.description,
    url: home,
    image: ogImage,
    founder: { '@id': personId },
    employee: { '@id': personId },
    priceRange: `$${site.service.price} MXN`,
    currenciesAccepted: 'MXN',
    areaServed: [
      { '@type': 'City', name: 'Monterrey' },
      { '@type': 'AdministrativeArea', name: 'Área metropolitana de Monterrey, Nuevo León' },
      { '@type': 'Country', name: 'México' },
    ],
    sameAs: [site.links.doctoralia, site.links.tiktok.url],
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressLocality: 'Monterrey',
        addressRegion: 'Nuevo León',
        addressCountry: 'MX',
      },
    }),
    ...(whatsapp && { telephone: `+${whatsapp}` }),
    ...(email && { email }),
    makesOffer: {
      '@type': 'Offer',
      price: site.service.price,
      priceCurrency: site.service.currency,
      url: site.links.doctoralia,
      itemOffered: {
        '@type': 'Service',
        name: site.service.name,
        serviceType: 'Psicoterapia',
        description: `Sesiones de ${site.service.durationMin} a ${site.service.durationMax} minutos, presenciales en ${site.modalities.inPerson.area} y en línea por videollamada, para adultos y adolescentes.`,
        provider: { '@id': personId },
        audience: { '@type': 'PeopleAudience', audienceType: 'Adultos y adolescentes' },
      },
    },
  };

  const faq = {
    '@type': 'FAQPage',
    mainEntity: faqPlain.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${home}#sitio`,
    url: home,
    name: `${site.person.displayName} · ${site.person.profession}`,
    inLanguage: 'es-MX',
    publisher: { '@id': personId },
  };

  return { '@context': 'https://schema.org', '@graph': [website, person, business, faq] };
}
