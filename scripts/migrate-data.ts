/**
 * Script de migración de datos desde JSON a MongoDB
 * 
 * Uso:
 * 1. Coloca tu archivo JSON en: scripts/data/properties.json
 * 2. Ejecuta: npm run migrate:properties
 * 
 * El JSON debe tener el siguiente formato:
 * [
 *   {
 *     "id": 1,
 *     "title": "...",
 *     "slug": "...",
 *     ...resto de campos
 *   }
 * ]
 */

import { getDatabase } from "../src/lib/mongodb";
import { setupPropertyIndexes } from "../src/lib/setup-mongodb";
import { Property } from "../src/types/property";
import * as fs from "fs";
import * as path from "path";

async function migrateProperties() {
  try {
    console.log("🚀 Iniciando migración de propiedades...\n");

    // 1. Leer el archivo JSON
    const jsonPath = path.join(__dirname, "data", "properties.json");
    
    if (!fs.existsSync(jsonPath)) {
      console.error("❌ Error: No se encontró el archivo properties.json");
      console.log("📁 Asegúrate de crear el archivo en: scripts/data/properties.json");
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const properties: Property[] = JSON.parse(rawData);

    console.log(`📦 Se encontraron ${properties.length} propiedades en el JSON\n`);

    // 2. Conectar a MongoDB
    const db = await getDatabase();
    const collection = db.collection("properties");

    // 3. Limpiar colección existente (opcional - comentar si no quieres eliminar datos)
    console.log("🗑️  Limpiando colección existente...");
    await collection.deleteMany({});
    console.log("✅ Colección limpiada\n");

    // 4. Agregar timestamps a cada propiedad y remover _id si existe
    const now = new Date();
    const propertiesWithTimestamps = properties.map((property) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...propertyWithoutId } = property;
      return {
        ...propertyWithoutId,
        active: property.active ?? true, // Por defecto activa
        createdAt: property.createdAt || now,
        updatedAt: property.updatedAt || now,
      };
    });

    // 5. Insertar propiedades en MongoDB
    console.log("📥 Insertando propiedades en MongoDB...");
    const result = await collection.insertMany(propertiesWithTimestamps);
    console.log(`✅ Se insertaron ${result.insertedCount} propiedades\n`);

    // 6. Configurar índices
    console.log("🔧 Configurando índices...");
    await setupPropertyIndexes();

    // 7. Verificar inserción
    const totalDocs = await collection.countDocuments();
    const featuredCount = await collection.countDocuments({ featured: true });
    const activeCount = await collection.countDocuments({ active: true });

    console.log("\n📊 Resumen de migración:");
    console.log(`  - Total de propiedades: ${totalDocs}`);
    console.log(`  - Propiedades destacadas: ${featuredCount}`);
    console.log(`  - Propiedades activas: ${activeCount}`);

    // 8. Mostrar algunas propiedades de ejemplo
    console.log("\n📋 Primeras 3 propiedades insertadas:");
    const sampleProperties = await collection.find().limit(3).toArray();
    sampleProperties.forEach((prop, index) => {
      console.log(`\n  ${index + 1}. ${prop.title}`);
      console.log(`     - ID: ${prop.id}`);
      console.log(`     - Slug: ${prop.slug}`);
      console.log(`     - Precio: ${prop.price}`);
      console.log(`     - Destacada: ${prop.featured ? "Sí" : "No"}`);
    });

    console.log("\n🎉 ¡Migración completada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error durante la migración:", error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateProperties();
