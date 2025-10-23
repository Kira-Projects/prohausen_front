import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'prohausen';

// Tipos e interfaces
interface PropertyInput {
  id: number;
  title: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
  [key: string]: unknown;
}

interface MigrationResult {
  success: boolean;
  slug: string;
  metadata?: {
    propertySlug: string;
    mainImage: string;
    images: string[];
    videoUrl: string | null;
    migratedAt: string;
    originalWordPressId: number;
  };
  error?: unknown;
}

// Función para generar slug desde título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Función para descargar archivo (imagen o video) desde URL con reintentos
async function downloadFile(url: string, retries = 3, delayMs = 2000): Promise<Buffer> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, (response) => {
          // Manejar redirecciones
          if (response.statusCode === 301 || response.statusCode === 302) {
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              downloadFile(redirectUrl, retries, delayMs).then(resolve).catch(reject);
              return;
            }
          }

          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          const chunks: Buffer[] = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks)));
          response.on('error', reject);
        }).on('error', reject);
      });
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Esperar antes de reintentar (delay progresivo)
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Max retries reached');
}

// Función para obtener extensión de archivo desde URL
function getFileExtension(url: string): string {
  const match = url.match(/\.(webp|jpg|jpeg|png|gif|mp4|mov|avi|mkv|wmv)(\?|$)/i);
  return match ? match[1].toLowerCase() : 'webp';
}

// Función para verificar si un archivo existe en S3
async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch {
    return false;
  }
}

// Función para subir imagen a S3
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
    // No usar ACL - el bucket debe tener una política pública configurada
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`;
}

// Función para obtener Content-Type desde extensión
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    webp: 'image/webp',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    wmv: 'video/x-ms-wmv',
  };
  return contentTypes[extension] || 'application/octet-stream';
}

// Función principal para migrar una propiedad
async function migratePropertyImages(property: PropertyInput, index: number, total: number) {
  const slug = generateSlug(property.title);
  console.log(`\n[${index + 1}/${total}] Procesando: ${property.title} (${slug})`);

  const imageUrls: string[] = [];
  let mainImageName = '';
  let videoFileName: string | null = null;
  const failedUrls: string[] = [];

  try {
    // 1. Migrar imagen principal
    if (property.image) {
      console.log('  📸 Descargando imagen principal...');
      const extension = getFileExtension(property.image);
      const mainImageKey = `properties/${slug}/main.${extension}`;
      
      // Verificar si ya existe
      const exists = await fileExistsInS3(mainImageKey);
      if (exists) {
        console.log('  ✅ Imagen principal ya existe en S3, saltando...');
        mainImageName = `main.${extension}`;
      } else {
        try {
          const imageBuffer = await downloadFile(property.image, 5, 3000); // 5 reintentos, 3 segundos
          await uploadToS3(imageBuffer, mainImageKey, getContentType(extension));
          console.log(`  ✅ Imagen principal subida: ${mainImageKey}`);
          mainImageName = `main.${extension}`;
        } catch (error) {
          console.error(`  ❌ Error descargando imagen principal:`, error);
          failedUrls.push(property.image);
        }
      }
    }

    // 2. Migrar galería de imágenes
    if (property.images && Array.isArray(property.images)) {
      console.log(`  🖼️  Procesando galería (${property.images.length} imágenes)...`);
      
      for (let i = 0; i < property.images.length; i++) {
        const imageUrl = property.images[i];
        const extension = getFileExtension(imageUrl);
        const imageKey = `properties/${slug}/img-${i + 1}.${extension}`;
        
        // Verificar si ya existe
        const exists = await fileExistsInS3(imageKey);
        if (exists) {
          console.log(`  ⏭️  Imagen ${i + 1}/${property.images.length} ya existe, saltando...`);
          imageUrls.push(`img-${i + 1}.${extension}`);
          continue;
        }

        try {
          const imageBuffer = await downloadFile(imageUrl, 5, 3000); // 5 reintentos, 3 segundos
          await uploadToS3(imageBuffer, imageKey, getContentType(extension));
          imageUrls.push(`img-${i + 1}.${extension}`);
          console.log(`  ✅ Imagen ${i + 1}/${property.images.length} subida`);
          
          // Delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`  ❌ Error en imagen ${i + 1}: ${(error as Error).message}`);
          failedUrls.push(imageUrl);
        }
      }
    }

    // 3. Migrar video si existe
    if (property.videoUrl && property.videoUrl.trim() !== '') {
      console.log('  🎥 Procesando video...');
      const extension = getFileExtension(property.videoUrl);
      const videoKey = `properties/${slug}/video.${extension}`;
      
      // Verificar si ya existe
      const exists = await fileExistsInS3(videoKey);
      if (exists) {
        console.log('  ✅ Video ya existe en S3, saltando...');
        videoFileName = `video.${extension}`;
      } else {
        try {
          console.log('  📥 Descargando video (puede tardar)...');
          const videoBuffer = await downloadFile(property.videoUrl, 3, 5000); // 3 reintentos, 5 segundos
          console.log('  ⬆️  Subiendo video a S3...');
          await uploadToS3(videoBuffer, videoKey, getContentType(extension));
          videoFileName = `video.${extension}`;
          console.log(`  ✅ Video subido: ${videoKey}`);
        } catch (error) {
          console.error(`  ❌ Error procesando video:`, (error as Error).message);
          failedUrls.push(property.videoUrl);
        }
      }
    }

    // 4. Crear metadata.json
    const metadata = {
      propertySlug: slug,
      mainImage: mainImageName,
      images: imageUrls,
      video: videoFileName,
      videoUrl: property.videoUrl || null,
      migratedAt: new Date().toISOString(),
      originalWordPressId: property.id,
      failedUrls: failedUrls.length > 0 ? failedUrls : undefined,
    };

    const metadataKey = `properties/${slug}/metadata.json`;
    await uploadToS3(
      Buffer.from(JSON.stringify(metadata, null, 2)),
      metadataKey,
      'application/json'
    );
    console.log(`  📄 Metadata creado: ${metadataKey}`);

    if (failedUrls.length > 0) {
      console.log(`  ⚠️  ${failedUrls.length} archivos no se pudieron migrar`);
    }

    console.log(`  ✅ Propiedad completada: ${slug}`);
    return { success: true, slug, metadata };

  } catch (error) {
    console.error(`  ❌ Error procesando ${slug}:`, error);
    return { success: false, slug, error };
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando migración de imágenes a AWS S3\n');
  console.log('Configuración:');
  console.log(`  Región: ${process.env.AWS_REGION}`);
  console.log(`  Bucket: ${BUCKET_NAME}\n`);

  // Leer el archivo JSON con las propiedades
  const jsonPath = path.join(__dirname, 'data', 'properties.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: No se encontró el archivo properties.json');
    console.error(`   Esperado en: ${jsonPath}`);
    console.error('\n   Por favor, crea el archivo scripts/data/properties.json con tus propiedades');
    process.exit(1);
  }

  const properties = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📦 Total de propiedades a procesar: ${properties.length}\n`);

  const results = {
    success: 0,
    failed: 0,
    details: [] as MigrationResult[],
  };

  // Procesar cada propiedad
  for (let i = 0; i < properties.length; i++) {
    const result = await migratePropertyImages(properties[i], i, properties.length);
    
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    results.details.push(result);
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Exitosas: ${results.success}`);
  console.log(`❌ Fallidas:  ${results.failed}`);
  console.log(`📦 Total:     ${properties.length}`);
  console.log('='.repeat(60));

  // Guardar reporte
  const reportPath = path.join(__dirname, 'data', 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
}

main().catch(console.error);
