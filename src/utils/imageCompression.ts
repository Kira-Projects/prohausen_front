/**
 * Utilidades para comprimir imágenes antes de subirlas
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0
  maxSizeMB?: number;
}

/**
 * Comprime una imagen manteniendo la calidad visual
 * @param file Archivo de imagen original
 * @param options Opciones de compresión
 * @returns Promise con el archivo comprimido
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeMB = 10,
  } = options;

  // Si la imagen ya es pequeña, no comprimir
  if (file.size <= maxSizeMB * 1024 * 1024 * 0.5) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Crear canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo crear contexto de canvas"));
          return;
        }

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error al comprimir imagen"));
              return;
            }

            // Crear nuevo archivo
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            // Si la compresión resultó en archivo más grande, usar original
            if (compressedFile.size > file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Error al cargar imagen"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Error al leer archivo"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Comprime un array de imágenes en paralelo
 * @param files Array de archivos
 * @param options Opciones de compresión
 * @param onProgress Callback de progreso (actual, total)
 * @returns Promise con los archivos comprimidos
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const compressedFiles: File[] = [];
  let completed = 0;

  // Comprimir en lotes de 5 para no sobrecargar
  const batchSize = 5;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchPromises = batch.map((file) => compressImage(file, options));
    const batchResults = await Promise.all(batchPromises);
    
    compressedFiles.push(...batchResults);
    completed += batch.length;
    
    if (onProgress) {
      onProgress(completed, files.length);
    }
  }

  return compressedFiles;
}

/**
 * Calcula el porcentaje de reducción de tamaño
 * @param originalSize Tamaño original en bytes
 * @param compressedSize Tamaño comprimido en bytes
 * @returns Porcentaje de reducción
 */
export function calculateReduction(
  originalSize: number,
  compressedSize: number
): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Formatea bytes a formato legible
 * @param bytes Tamaño en bytes
 * @returns String formateado (ej: "2.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
