/**
 * Script para migrar imágenes desde WordPress a AWS S3 con sistema UUID
 * 
 * Este script:
 * 1. Lee properties.json con URLs de imágenes de WordPress
 * 2. Descarga cada imagen
 * 3. Genera UUID único para cada propiedad
 * 4. Sube imágenes a S3 con estructura: properties/uuid-xxx/uuid-yyy.webp
 * 5. Genera reporte con URLs nuevas y UUIDs
 */

import { config } from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Cargar variables de entorno
config({ path: ".env.local" });

// Configuración
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const AWS_REGION = process.env.AWS_REGION!;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface PropertyImages {
  id: number;
  title: string;
  image: string;
  images: string[];
  videoUrl?: string;
}

interface MigrationResult {
  propertyId: number;
  propertyTitle: string;
  folderId: string;
  imageUrls: string[];
  originalImageUrl: string;
  errors: string[];
}

/**
 * Descarga una imagen desde una URL
 */
async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Seguir redirección
        if (response.headers.location) {
          downloadImage(response.headers.location)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    }).on("error", reject);
  });
}

/**
 * Obtiene la extensión del archivo desde la URL
 */
function getExtensionFromUrl(url: string): string {
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath).toLowerCase();
  // Si tiene extensión válida, usarla; si no, defaultear a .jpg
  return ext.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? ext : ".jpg";
}

/**
 * Sube un buffer de imagen a S3
 */
async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Obtiene el Content-Type basado en la extensión
 */
function getContentType(extension: string): string {
  const ext = extension.toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return types[ext] || "image/jpeg";
}

/**
 * Migra las imágenes de una propiedad
 */
async function migratePropertyImages(
  property: PropertyImages
): Promise<MigrationResult> {
  const result: MigrationResult = {
    propertyId: property.id,
    propertyTitle: property.title,
    folderId: `uuid-${uuidv4()}`,
    imageUrls: [],
    originalImageUrl: property.image,
    errors: [],
  };

  console.log(`\n📦 Procesando propiedad #${property.id}: ${property.title}`);
  console.log(`   Carpeta UUID: ${result.folderId}`);
  console.log(`   Total de imágenes: ${property.images.length}`);

  for (let i = 0; i < property.images.length; i++) {
    const imageUrl = property.images[i];
    const imageNumber = i + 1;

    try {
      console.log(`   [${imageNumber}/${property.images.length}] Descargando...`);
      
      // Descargar imagen
      const buffer = await downloadImage(imageUrl);
      
      // Generar nombre único con UUID
      const extension = getExtensionFromUrl(imageUrl);
      const fileName = `uuid-${uuidv4()}${extension}`;
      const s3Key = `properties/${result.folderId}/${fileName}`;
      
      // Subir a S3
      console.log(`   [${imageNumber}/${property.images.length}] Subiendo a S3...`);
      const contentType = getContentType(extension);
      const s3Url = await uploadToS3(buffer, s3Key, contentType);
      
      result.imageUrls.push(s3Url);
      console.log(`   ✅ [${imageNumber}/${property.images.length}] Subida exitosa`);
      
      // Delay para no saturar
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      const errorMsg = `Error en imagen ${imageNumber} (${imageUrl}): ${error}`;
      console.error(`   ❌ ${errorMsg}`);
      result.errors.push(errorMsg);
    }
  }

  console.log(
    `✅ Propiedad #${property.id} completada: ${result.imageUrls.length}/${property.images.length} imágenes`
  );

  return result;
}

/**
 * Main
 */
async function main() {
  console.log("🚀 Iniciando migración de imágenes a AWS S3 con UUID\n");

  // Validar variables de entorno
  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_REGION) {
    throw new Error("Faltan variables de entorno AWS");
  }

  // Leer properties.json
  const propertiesPath = path.join(__dirname, "data", "properties.json");
  console.log(`📖 Leyendo propiedades desde: ${propertiesPath}\n`);
  
  const properties: PropertyImages[] = JSON.parse(
    fs.readFileSync(propertiesPath, "utf-8")
  );

  console.log(`📊 Total de propiedades a migrar: ${properties.length}\n`);

  const results: MigrationResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  // Procesar cada propiedad
  for (const property of properties) {
    try {
      const result = await migratePropertyImages(property);
      results.push(result);
      
      if (result.errors.length === 0) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error fatal en propiedad #${property.id}:`, error);
      errorCount++;
    }
  }

  // Guardar reporte
  const reportPath = path.join(__dirname, "data", "s3-migration-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DE MIGRACIÓN");
  console.log("=".repeat(60));
  console.log(`✅ Propiedades exitosas: ${successCount}`);
  console.log(`❌ Propiedades con errores: ${errorCount}`);
  console.log(`📄 Reporte guardado en: ${reportPath}`);
  console.log("=".repeat(60) + "\n");

  // Mostrar ejemplo de resultado
  if (results.length > 0) {
    console.log("📋 Ejemplo de resultado:");
    console.log(JSON.stringify(results[0], null, 2));
  }
}

// Ejecutar
main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
