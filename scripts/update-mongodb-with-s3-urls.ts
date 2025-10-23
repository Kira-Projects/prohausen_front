import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL || 'https://prohausen.s3.us-east-2.amazonaws.com';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI no está configurado en .env.local');
  process.exit(1);
}

interface MigrationDetail {
  success: boolean;
  slug: string;
  metadata: {
    propertySlug: string;
    mainImage: string;
    images: string[];
    video: string | null;
    videoUrl: string | null;
    migratedAt: string;
    originalWordPressId: number;
    failedUrls?: string[];
  };
}

interface MigrationReport {
  success: number;
  failed: number;
  details: MigrationDetail[];
}

async function updateMongoDBWithS3URLs() {
  console.log('🚀 Iniciando actualización de MongoDB con URLs de S3...\n');

  // 1. Leer migration-report.json
  const reportPath = path.join(__dirname, 'data', 'migration-report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ No se encontró migration-report.json');
    process.exit(1);
  }

  const report: MigrationReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  console.log(`📊 Propiedades en reporte de migración: ${report.details.length}`);
  console.log(`✅ Exitosas: ${report.success}`);
  console.log(`❌ Fallidas: ${report.failed}\n`);

  // 2. Conectar a MongoDB
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas\n');

    const db = client.db('prohausen');
    const collection = db.collection('properties');

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    // 3. Por cada propiedad en el reporte
    for (const detail of report.details) {
      if (!detail.success) {
        console.log(`⏭️  Saltando ${detail.slug} (migración fallida)`);
        continue;
      }

      const { slug, metadata } = detail;

      try {
        // 4. Construir URLs de S3
        const mainImageUrl = `${S3_BUCKET_URL}/properties/${slug}/${metadata.mainImage}`;
        const imagesUrls = [
          mainImageUrl, // La primera imagen es siempre la principal
          ...metadata.images.map(img => `${S3_BUCKET_URL}/properties/${slug}/${img}`)
        ];

        // 5. Actualizar documento en MongoDB
        const result = await collection.updateOne(
          { slug }, // Buscar por slug
          {
            $set: {
              image: mainImageUrl,
              images: imagesUrls,
              videoUrl: metadata.videoUrl || undefined,
              updatedAt: new Date()
            }
          }
        );

        if (result.matchedCount === 0) {
          console.log(`⚠️  No se encontró propiedad con slug: ${slug}`);
          notFound++;
        } else if (result.modifiedCount > 0) {
          console.log(`✅ Actualizado: ${slug} (${imagesUrls.length} imágenes)`);
          updated++;
        } else {
          console.log(`ℹ️  Sin cambios: ${slug} (ya tenía las URLs)`);
          updated++;
        }

      } catch (error) {
        console.error(`❌ Error actualizando ${slug}:`, error);
        errors++;
      }
    }

    // 6. Reporte final
    console.log('\n📊 RESUMEN DE ACTUALIZACIÓN:');
    console.log('─'.repeat(50));
    console.log(`✅ Actualizadas exitosamente: ${updated}`);
    console.log(`⚠️  No encontradas en MongoDB: ${notFound}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📦 Total procesadas: ${report.details.length}`);
    console.log('─'.repeat(50));

    // 7. Verificar una propiedad actualizada
    if (updated > 0) {
      console.log('\n🔍 Verificando primera propiedad actualizada...');
      const sample = await collection.findOne({ slug: report.details[0].slug });
      
      if (sample) {
        console.log('\n📄 Ejemplo de documento actualizado:');
        console.log('─'.repeat(50));
        console.log('Slug:', sample.slug);
        console.log('Título:', sample.title);
        console.log('Imagen principal:', sample.image);
        console.log('Total imágenes:', sample.images?.length || 0);
        console.log('Primera imagen:', sample.images?.[0]);
        console.log('─'.repeat(50));
      }
    }

    // 8. Guardar reporte de actualización
    const updateReport = {
      timestamp: new Date().toISOString(),
      s3BucketUrl: S3_BUCKET_URL,
      updated,
      notFound,
      errors,
      total: report.details.length
    };

    const updateReportPath = path.join(__dirname, 'data', 'mongodb-s3-update-report.json');
    fs.writeFileSync(updateReportPath, JSON.stringify(updateReport, null, 2));
    console.log(`\n💾 Reporte guardado en: ${updateReportPath}`);

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Desconectado de MongoDB');
  }
}

// Ejecutar
updateMongoDBWithS3URLs().catch(console.error);
