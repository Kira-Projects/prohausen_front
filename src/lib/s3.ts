import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Re-exportar funciones UUID (no requieren AWS credentials)
export { generateUniqueFileName, generatePropertyFolderId } from "./uuid";

// Validar variables de entorno
if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('Missing environment variable: "AWS_ACCESS_KEY_ID"');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('Missing environment variable: "AWS_SECRET_ACCESS_KEY"');
}

if (!process.env.AWS_REGION) {
  throw new Error('Missing environment variable: "AWS_REGION"');
}

if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error('Missing environment variable: "AWS_S3_BUCKET_NAME"');
}

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Sube un archivo a S3
 * @param file Buffer o stream del archivo
 * @param key Ruta/nombre del archivo en S3 (ej: "properties/123/image-1.jpg")
 * @param contentType MIME type del archivo (ej: "image/jpeg")
 * @returns URL pública del archivo
 */
export async function uploadToS3(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    // No usar ACL - el bucket tiene política pública configurada
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // Construir URL pública
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
}

/**
 * Sube un archivo grande a S3 usando multipart upload
 * @param file Buffer o stream del archivo
 * @param key Ruta/nombre del archivo en S3
 * @param contentType MIME type del archivo
 * @returns URL pública del archivo
 */
export async function uploadLargeFileToS3(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // No usar ACL - el bucket tiene política pública configurada
    },
  });

  await upload.done();

  // Construir URL pública
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
}

/**
 * Elimina un archivo de S3
 * @param key Ruta/nombre del archivo en S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  const params: DeleteObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}

/**
 * Extrae la key de S3 desde una URL pública
 * @param url URL pública del archivo en S3
 * @returns Key del archivo (path sin el dominio)
 */
export function extractS3KeyFromUrl(url: string): string {
  const urlPattern = new RegExp(
    `https://${BUCKET_NAME}\\.s3\\.${process.env.AWS_REGION}\\.amazonaws\\.com/(.+)`
  );
  const match = url.match(urlPattern);
  if (!match || !match[1]) {
    throw new Error("Invalid S3 URL");
  }
  return match[1];
}

export default s3Client;
