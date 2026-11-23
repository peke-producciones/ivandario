# Pendientes para el lanzamiento

Todo lo que aparece aquí se ve en el sitio con la etiqueta **«Pendiente»** mientras la vista previa esté activa. Cada dato se confirma en `src/config/site.ts` (ver README).

## Información de Iván

| Dato | Dónde aparece | Campo en `site.ts` |
|---|---|---|
| Número profesional de WhatsApp | Contacto, barra móvil, footer, datos estructurados | `contact.whatsapp` |
| Correo profesional | Contacto y aviso de privacidad (derechos ARCO) | `contact.email` |
| Dirección del consultorio | Servicios, datos estructurados | `location.address` |
| Horarios de atención | Servicios | `schedule` |
| Disponibilidad de citas | Servicios | `availability` |
| Plataforma de videollamada | Servicios | `modalities.online.platform` |
| Cédula profesional | Sobre mí, datos estructurados | `credentials.license` |
| Universidad y títulos | Sobre mí | `credentials.education` |
| Diplomados y certificaciones | Sobre mí | `credentials.certifications` |
| Experiencia clínica | Sobre mí | `credentials.experience` |
| Enfoque terapéutico detallado | Mi enfoque | `approach.detailed` |
| Condiciones de cancelación y reservación | Preguntas frecuentes | `policies.cancellation` |

## Material

| Material | Detalle |
|---|---|
| Retrato principal (hero) | Vertical 4:5, playera negra o ropa neutra, luz natural, interior minimalista |
| Retrato «Sobre mí» | Vertical 3:4, expresión de escucha |
| 3 a 6 videos de TikTok | Enlaces a videos reales de @ivan.dario21 (`src/content/videos.ts`) |

## Servicios y legal

| Pendiente | Detalle |
|---|---|
| Servicio para el formulario | Formspree o Web3Forms: crear cuenta y confirmar la URL en `contact.formEndpoint` |
| Analítica sin cookies | Plausible (de pago) o Cloudflare Web Analytics (gratuita) |
| Google Search Console | Código de verificación en `seo.googleVerification` |
| Domicilio para el aviso de privacidad | `legal.privacyAddress` (requisito de ley) |
| Revisión legal del aviso de privacidad | Cuando esté revisado: `legal.privacyReviewed: true` |
| Revisión de textos por Iván | En especial las preguntas frecuentes (adolescentes, confidencialidad, terapia en línea) |
| Dominio propio (opcional) | Ver README → Lanzamiento |
| Uso de «psicólogo» | Hoy el sitio solo dice «psicoterapeuta». Con la cédula confirmada se puede añadir «psicólogo» a títulos y textos |
