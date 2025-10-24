import { config } from "dotenv";
import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";

// Cargar variables de entorno
config({ path: ".env.local" });

// Validar variables de entorno
if (!process.env.MONGODB_URI) {
  throw new Error("❌ Falta la variable de entorno MONGODB_URI");
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "prohausen";
const MONGODB_COLLECTION = "properties";

// Interfaces
interface PropertyData {
  id: number;
  title: string;
  location: string;
  description: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: string;
  operation: string;
  region: string;
  comuna: string;
  featured: boolean;
  usefulArea?: string;
  landArea?: string;
  floors?: number;
  floorNumber?: number;
  yearBuilt?: number;
  features?: string[];
  address?: string;
  zip?: string;
  country?: string;
  halfBathrooms?: number;
  totalRooms?: number;
  latitude?: string;
  longitude?: string;
}

interface S3ReportItem {
  propertyId: number;
  propertyTitle: string;
  folderId: string;
  imageUrls: string[];
  originalImageUrl: string;
  errors: string[];
}

interface MongoPropertyDocument {
  id: number;
  title: string;
  location: string;
  description: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: string;
  operation: string;
  region: string;
  comuna: string;
  featured: boolean;
  usefulArea?: string;
  landArea?: string;
  floors?: number;
  floorNumber?: number;
  yearBuilt?: number;
  features?: string[];
  address?: string;
  zip?: string;
  country?: string;
  halfBathrooms?: number;
  totalRooms?: number;
  latitude?: string;
  longitude?: string;
  // Campos de S3
  folderId: string;
  image: string;
  images: string[];
  // Timestamps
  updatedAt: Date;
  createdAt?: Date;
}

async function main() {
  console.log("🚀 Iniciando migración de metadatos a MongoDB\n");

  // 1. Leer archivos
  const propertiesPath = path.join(__dirname, "data", "properties-mongodb.json");
  const s3ReportPath = path.join(__dirname, "data", "s3-migration-report.json");

  if (!fs.existsSync(propertiesPath)) {
    throw new Error(`❌ No se encontró el archivo: ${propertiesPath}`);
  }

  if (!fs.existsSync(s3ReportPath)) {
    throw new Error(`❌ No se encontró el archivo: ${s3ReportPath}`);
  }

  const propertiesData: PropertyData[] = JSON.parse(
    fs.readFileSync(propertiesPath, "utf-8")
  );
  const s3Report: S3ReportItem[] = JSON.parse(
    fs.readFileSync(s3ReportPath, "utf-8")
  );

  console.log(`📊 Propiedades con datos completos: ${propertiesData.length}`);
  console.log(`📊 Propiedades con URLs S3: ${s3Report.length}\n`);

  // 2. Crear mapa de S3 data por ID
  const s3Map = new Map<number, S3ReportItem>();
  s3Report.forEach((item) => {
    s3Map.set(item.propertyId, item);
  });

  // 3. Conectar a MongoDB
  console.log("🔗 Conectando a MongoDB...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db(MONGODB_DB);
    const collection = db.collection<MongoPropertyDocument>(MONGODB_COLLECTION);

    // 4. Procesar cada propiedad
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const property of propertiesData) {
      try {
        const s3Data = s3Map.get(property.id);

        if (!s3Data) {
          console.warn(
            `⚠️  Propiedad #${property.id} no tiene datos de S3 en el reporte`
          );
          errorCount++;
          continue;
        }

        // Combinar datos
        const document: MongoPropertyDocument = {
          ...property,
          folderId: s3Data.folderId,
          image: s3Data.imageUrls[0] || "",
          images: s3Data.imageUrls,
          updatedAt: new Date(),
        };

        // Buscar si ya existe
        const existing = await collection.findOne({ id: property.id });

        if (existing) {
          // Actualizar
          await collection.updateOne(
            { id: property.id },
            {
              $set: {
                ...document,
                createdAt: existing.createdAt, // Mantener fecha de creación original
              },
            }
          );
          console.log(
            `🔄 Actualizada: #${property.id} "${property.title}" - ${s3Data.imageUrls.length} imágenes`
          );
          updatedCount++;
        } else {
          // Insertar
          await collection.insertOne({
            ...document,
            createdAt: new Date(),
          });
          console.log(
            `✅ Insertada: #${property.id} "${property.title}" - ${s3Data.imageUrls.length} imágenes`
          );
          insertedCount++;
        }
      } catch (error) {
        console.error(
          `❌ Error procesando propiedad #${property.id}:`,
          error
        );
        errorCount++;
      }
    }

    // 5. Resumen
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMEN DE MIGRACIÓN A MONGODB");
    console.log("=".repeat(60));
    console.log(`✅ Propiedades insertadas: ${insertedCount}`);
    console.log(`🔄 Propiedades actualizadas: ${updatedCount}`);
    console.log(`❌ Propiedades con errores: ${errorCount}`);
    console.log(`📁 Total procesadas: ${insertedCount + updatedCount}`);
    console.log("=".repeat(60) + "\n");

    // 6. Crear índices (importante para performance)
    console.log("🔧 Creando índices en MongoDB...");
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ featured: 1 });
    await collection.createIndex({ type: 1 });
    await collection.createIndex({ operation: 1 });
    await collection.createIndex({ region: 1 });
    await collection.createIndex({ comuna: 1 });
    console.log("✅ Índices creados correctamente\n");

    // 7. Verificación final
    const totalInDB = await collection.countDocuments();
    console.log(`📊 Total de propiedades en MongoDB: ${totalInDB}`);

    // Mostrar ejemplo de una propiedad
    const sample = await collection.findOne({ id: 2269 });
    if (sample) {
      console.log("\n📄 Ejemplo de propiedad en MongoDB:");
      console.log(
        JSON.stringify(
          {
            id: sample.id,
            title: sample.title,
            folderId: sample.folderId,
            image: sample.image,
            totalImages: sample.images.length,
            price: sample.price,
            bedrooms: sample.bedrooms,
            bathrooms: sample.bathrooms,
            featured: sample.featured,
          },
          null,
          2
        )
      );
    }
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    throw error;
  } finally {
    await client.close();
    console.log("\n✅ Conexión a MongoDB cerrada");
  }
}

// Ejecutar
main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
