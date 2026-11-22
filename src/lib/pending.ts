/**
 * Dato profesional con estado explícito.
 *
 * Todo dato que el PROJECT BRAIN marca como «información pendiente» se declara
 * con `pending()`. Solo pasa a mostrarse en el sitio cuando se cambia por
 * `confirmed(valor)`. Los componentes leen los datos con `valueOf()`, que
 * devuelve `undefined` mientras el dato esté pendiente: así un módulo
 * incompleto simplemente no se renderiza.
 */
export type Field<T> =
  | { readonly status: 'pending'; readonly note?: string }
  | { readonly status: 'confirmed'; readonly value: T };

export const pending = <T>(note?: string): Field<T> => ({ status: 'pending', note });

export const confirmed = <T>(value: T): Field<T> => ({ status: 'confirmed', value });

export const valueOf = <T>(field: Field<T>): T | undefined =>
  field.status === 'confirmed' ? field.value : undefined;

export const isConfirmed = <T>(field: Field<T>): field is { status: 'confirmed'; value: T } =>
  field.status === 'confirmed';
