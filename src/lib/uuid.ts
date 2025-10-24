import { v4 as uuidv4 } from "uuid";

/**
 * Genera un nombre único para el archivo usando UUID
 * @param originalName Nombre original del archivo
 * @returns Nombre único con UUID: uuid-{uuid}.{extension}
 * 
 * NOTA: Esta función NO requiere variables de entorno AWS
 * Se puede usar de forma segura en componentes del cliente
 */
export function generateUniqueFileName(originalName: string): string {
  const extension = originalName.split(".").pop();
  const uuid = uuidv4();
  return `uuid-${uuid}.${extension}`;
}

/**
 * Genera un ID único para la carpeta de la propiedad
 * @returns ID único con formato: uuid-{uuid}
 * 
 * NOTA: Esta función NO requiere variables de entorno AWS
 * Se puede usar de forma segura en componentes del cliente
 */
export function generatePropertyFolderId(): string {
  return `uuid-${uuidv4()}`;
}
