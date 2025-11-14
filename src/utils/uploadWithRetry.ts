/**
 * Utilidad para subir archivos con reintentos automáticos
 */

export interface UploadOptions {
  maxRetries?: number;
  retryDelay?: number; // milisegundos
  onProgress?: (progress: number) => void;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Sube un archivo con reintentos automáticos
 * @param uploadFn Función que realiza la subida
 * @param options Opciones de reintento
 * @returns Promise con el resultado de la subida
 */
export async function uploadWithRetry<T>(
  uploadFn: () => Promise<T>,
  options: UploadOptions = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        // Notificar reintento
        if (onRetry) {
          onRetry(attempt, lastError);
        }

        // Esperar antes de reintentar (con backoff exponencial)
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt)
        );
      }
    }
  }

  // Si llegamos aquí, fallaron todos los intentos
  throw lastError || new Error("Error desconocido al subir archivo");
}

/**
 * Sube múltiples archivos en paralelo con reintentos
 * @param files Array de archivos a subir
 * @param uploadFn Función que sube un archivo
 * @param options Opciones de subida
 * @returns Promise con los resultados de las subidas
 */
export async function uploadMultipleWithRetry<T>(
  files: File[],
  uploadFn: (file: File, index: number) => Promise<T>,
  options: UploadOptions & { batchSize?: number } = {}
): Promise<T[]> {
  const { batchSize = 5, onProgress } = options;
  const results: T[] = [];
  let completed = 0;

  // Dividir en lotes para no sobrecargar
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    const batchPromises = batch.map((file, batchIndex) => {
      const actualIndex = i + batchIndex;
      return uploadWithRetry(
        () => uploadFn(file, actualIndex),
        options
      );
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    completed += batch.length;
    if (onProgress) {
      onProgress((completed / files.length) * 100);
    }
  }

  return results;
}
