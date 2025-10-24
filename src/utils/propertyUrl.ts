/**
 * Utilidades para generar URLs de propiedades con formato ID-slug
 */

/**
 * Genera una URL amigable para SEO combinando ID y slug
 * Formato: /propiedades/1051-casa-del-inca
 * 
 * Si no hay slug, retorna solo el ID: /propiedades/1051
 * 
 * @param id - ID numérico de la propiedad
 * @param slug - Slug opcional de la propiedad
 * @returns Ruta completa para la propiedad
 */
export function getPropertyUrl(id: number, slug?: string | null): string {
  if (slug && slug.trim()) {
    return `/propiedades/${id}-${slug}`;
  }
  return `/propiedades/${id}`;
}

/**
 * Extrae el ID numérico de un parámetro de URL
 * Soporta formatos:
 * - "1051" -> 1051
 * - "1051-casa-del-inca" -> 1051
 * 
 * @param param - Parámetro de la URL ([id])
 * @returns ID numérico de la propiedad
 */
export function extractPropertyId(param: string): number {
  // Si el parámetro contiene un guión, extraer la parte antes del primer guión
  const idPart = param.includes('-') ? param.split('-')[0] : param;
  return parseInt(idPart, 10);
}

/**
 * Genera un slug a partir de un título
 * Convierte a minúsculas, elimina acentos y caracteres especiales
 * 
 * @param title - Título de la propiedad
 * @returns Slug generado
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-"); // Eliminar guiones duplicados
}
