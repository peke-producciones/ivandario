/**
 * Preguntas frecuentes (PROJECT BRAIN §4.8).
 * Respuestas informativas y prudentes: no prometen resultados ni sustituyen
 * una evaluación profesional. Revisar con Iván antes del lanzamiento.
 *
 * Cada respuesta es una lista de párrafos.
 */
import { site, facts } from '@/config/site';
import { valueOf } from '@/lib/pending';

const cancellation = valueOf(site.policies.cancellation);

export const faq: { q: string; a: string[] }[] = [
  {
    q: '¿Cómo sé si necesito ir a terapia?',
    a: [
      'No hace falta estar en crisis ni tener un diagnóstico para buscar terapia. Puede ser útil cuando algo que estás viviendo te genera malestar, se repite, afecta tus relaciones, tu trabajo o tus estudios, o cuando simplemente quieres entenderte mejor.',
      'Si tienes dudas, una primera sesión puede ayudarte a aclarar si este espacio es para ti.',
    ],
  },
  {
    q: '¿Qué sucede durante la primera sesión?',
    a: [
      'Es un espacio para conocernos. Conversamos sobre lo que te trae a consulta, lo que esperas del proceso y las dudas que tengas sobre cómo trabajo.',
      'No necesitas preparar nada ni saber exactamente qué decir. Al final podemos acordar juntos si tiene sentido continuar y de qué manera.',
    ],
  },
  {
    q: '¿Puedo tomar terapia aunque no tenga un diagnóstico?',
    a: [
      'Sí. Muchas personas llegan a terapia sin un diagnóstico: por una etapa difícil, una decisión importante, una relación o el deseo de conocerse mejor. La terapia no es solo para situaciones graves.',
    ],
  },
  {
    q: '¿La terapia en línea funciona?',
    a: [
      'Para muchas personas, la terapia por videollamada es una alternativa adecuada: permite mantener la continuidad del proceso sin necesidad de trasladarse.',
      'Lo importante es contar con un lugar privado donde puedas hablar con tranquilidad, una conexión estable y, de preferencia, audífonos. Si en algún momento la modalidad en línea no resulta la más adecuada para tu situación, lo platicaremos para encontrar la mejor opción.',
    ],
  },
  {
    q: '¿Cuánto dura un proceso terapéutico?',
    a: [
      'Depende de cada persona, de lo que te trae a consulta y de tus objetivos. Algunos procesos son breves y otros se extienden más tiempo; no hay una duración única.',
      `Cada sesión dura de ${site.service.durationMin} a ${site.service.durationMax} minutos. La frecuencia y el avance del proceso se revisan juntos a lo largo del camino.`,
    ],
  },
  {
    q: '¿Atiendes adolescentes?',
    a: [
      'Sí, atiendo adolescentes y adultos.',
      'En el caso de menores de edad, para iniciar el proceso se requiere el consentimiento de su madre, padre o tutor, cuya participación puede ser necesaria en algunos momentos.',
      'Al mismo tiempo, el espacio del adolescente se cuida: lo que comparte en sesión es confidencial, con límites que se explican desde el inicio tanto al adolescente como a su familia; por ejemplo, cuando existe un riesgo para su integridad o la de otras personas.',
    ],
  },
  {
    q: '¿Cómo se maneja la confidencialidad?',
    a: [
      'Lo que se habla en terapia es confidencial. Esta confidencialidad tiene límites que se explican desde el inicio: por ejemplo, cuando existe un riesgo serio para tu vida o la de otras personas, o cuando una autoridad competente lo requiera conforme a la ley.',
      'Tus datos personales se tratan de acuerdo con el aviso de privacidad.',
    ],
  },
  {
    q: '¿Puedo cancelar o cambiar una cita?',
    a: cancellation
      ? [cancellation]
      : [
          'Sí. Si necesitas cancelar o cambiar tu cita, avísame con la mayor anticipación posible. Las condiciones de cancelación y reprogramación se informan al momento de agendar.',
        ],
  },
];

/** Para datos estructurados (Fase 6). */
export const faqPlain = faq.map(({ q, a }) => ({ q, a: a.join(' ') }));
export { facts };
