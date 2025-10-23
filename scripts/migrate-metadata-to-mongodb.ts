import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'prohausen';
const COLLECTION_NAME = 'properties';

// Función para generar slug desde título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface PropertyInput {
  id?: number;
  title: string;
  location?: string;
  description?: string;
  price?: string;
  area?: string;
  type?: string;
  operation?: string;
  region?: string;
  comuna?: string;
  address?: string;
  usefulArea?: string;
  landArea?: string;
  latitude?: string;
  longitude?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  floors?: string | number;
  floorNumber?: string | number;
  yearBuilt?: string | number;
  halfBathrooms?: string | number;
  totalRooms?: string | number;
  featured?: boolean;
  features?: string[];
  images?: unknown[];
  videoUrl?: string;
  [key: string]: unknown;
}

// Función para limpiar y transformar propiedad (guardar SOLO datos del JSON)
function transformProperty(property: PropertyInput) {
  const slug = generateSlug(property.title);
  
  return {
    // ID y Slug
    id: property.id,
    slug,
    
    // Información textual (exactamente como viene del JSON)
    title: property.title || '',
    location: property.location || '',
    description: property.description || '',
    price: property.price || '',
    area: property.area || '',
    type: property.type || '',
    operation: property.operation || '',
    region: property.region || '',
    comuna: property.comuna || '',
    address: property.address || '',
    usefulArea: property.usefulArea || '',
    landArea: property.landArea || '',
    latitude: property.latitude || '',
    longitude: property.longitude || '',
    zip: property.zip || '',
    country: property.country || '',
    
    // Información numérica (convertir a números cuando existen)
    bedrooms: property.bedrooms !== undefined ? parseInt(String(property.bedrooms || 0)) || 0 : undefined,
    bathrooms: property.bathrooms !== undefined ? parseInt(String(property.bathrooms || 0)) || 0 : undefined,
    floors: property.floors !== undefined ? parseInt(String(property.floors || 0)) || 0 : undefined,
    floorNumber: property.floorNumber !== undefined ? parseInt(String(property.floorNumber || 0)) || 0 : undefined,
    yearBuilt: property.yearBuilt !== undefined ? parseInt(String(property.yearBuilt || 0)) || 0 : undefined,
    halfBathrooms: property.halfBathrooms !== undefined ? parseInt(String(property.halfBathrooms || 0)) || 0 : undefined,
    totalRooms: property.totalRooms !== undefined ? parseInt(String(property.totalRooms || 0)) || 0 : undefined,
    
    // Booleanos
    featured: Boolean(property.featured),
    
    // Features (array de características)
    features: Array.isArray(property.features) ? property.features : [],
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Función principal
async function main() {
  console.log('🚀 Iniciando migración de metadata a MongoDB Atlas\n');

  // Verificar URI de MongoDB
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está configurado en .env.local');
    process.exit(1);
  }

  // Leer archivo JSON (MongoDB específico)
  const jsonPath = path.join(__dirname, 'data', 'properties-mongodb.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: No se encontró el archivo properties-mongodb.json');
    console.error(`   Esperado en: ${jsonPath}`);
    process.exit(1);
  }

  const rawProperties = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📦 Total de propiedades a procesar: ${rawProperties.length}\n`);

  let client: MongoClient | null = null;

  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas\n');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Verificar si la colección ya tiene datos
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.warn(`⚠️  La colección ya tiene ${existingCount} documentos`);
      console.log('   ¿Deseas continuar? Esto agregará más propiedades.');
      console.log('   Para limpiar primero, ejecuta: npm run clean:mongodb\n');
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{
        slug: string;
        status: 'success' | 'failed' | 'skipped';
        error?: string;
      }>,
    };

    // Procesar cada propiedad
    for (let i = 0; i < rawProperties.length; i++) {
      const property = rawProperties[i];
      const slug = generateSlug(property.title);
      
      try {
        console.log(`[${i + 1}/${rawProperties.length}] Procesando: ${property.title}`);

        // Verificar si ya existe
        const existing = await collection.findOne({ slug });
        if (existing) {
          console.log(`  ⏭️  Ya existe, saltando...`);
          results.skipped++;
          results.details.push({ slug, status: 'skipped' });
          continue;
        }

        // Transformar y limpiar datos
        const cleanProperty = transformProperty(property);

        // Insertar en MongoDB
        await collection.insertOne(cleanProperty);
        console.log(`  ✅ Insertado: ${slug}`);
        
        results.success++;
        results.details.push({ slug, status: 'success' });

      } catch (error) {
        console.error(`  ❌ Error: ${error}`);
        results.failed++;
        results.details.push({
          slug,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Crear índices
    console.log('\n📑 Creando índices...');
    
    await collection.createIndex({ slug: 1 }, { unique: true });
    console.log('  ✅ Índice: slug (único)');
    
    await collection.createIndex({ type: 1 });
    console.log('  ✅ Índice: type');
    
    await collection.createIndex({ operation: 1 });
    console.log('  ✅ Índice: operation');
    
    await collection.createIndex({ region: 1 });
    console.log('  ✅ Índice: region');
    
    await collection.createIndex({ comuna: 1 });
    console.log('  ✅ Índice: comuna');
    
    await collection.createIndex({ featured: 1 });
    console.log('  ✅ Índice: featured');
    
    await collection.createIndex({ active: 1 });
    console.log('  ✅ Índice: active');
    
    await collection.createIndex({ createdAt: -1 });
    console.log('  ✅ Índice: createdAt (descendente)');

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosas: ${results.success}`);
    console.log(`⏭️  Saltadas:  ${results.skipped}`);
    console.log(`❌ Fallidas:  ${results.failed}`);
    console.log(`📦 Total:     ${rawProperties.length}`);
    console.log('='.repeat(60));

    // Guardar reporte
    const reportPath = path.join(__dirname, 'data', 'mongodb-migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Desconectado de MongoDB Atlas');
    }
  }
}

main().catch(console.error);
