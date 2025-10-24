import { config } from "dotenv";
import { MongoClient } from "mongodb";

// Cargar variables de entorno
config({ path: ".env.local" });

// Validar variables de entorno
if (!process.env.MONGODB_URI) {
  throw new Error("❌ Falta la variable de entorno MONGODB_URI");
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "prohausen";
const MONGODB_COLLECTION = "properties";

async function main() {
  console.log("🧹 Iniciando limpieza de MongoDB\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db(MONGODB_DB);
    const collection = db.collection(MONGODB_COLLECTION);

    // Contar documentos antes de limpiar
    const countBefore = await collection.countDocuments();
    console.log(`📊 Documentos encontrados: ${countBefore}\n`);

    if (countBefore === 0) {
      console.log("✅ La colección ya está vacía\n");
      return;
    }

    // Eliminar todos los documentos
    console.log("🗑️  Eliminando todos los documentos...");
    const deleteResult = await collection.deleteMany({});
    console.log(`✅ Eliminados: ${deleteResult.deletedCount} documentos\n`);

    // Eliminar todos los índices (excepto _id)
    console.log("🗑️  Eliminando índices...");
    await collection.dropIndexes();
    console.log("✅ Índices eliminados\n");

    // Verificar
    const countAfter = await collection.countDocuments();
    console.log("=".repeat(60));
    console.log("📊 RESULTADO DE LIMPIEZA");
    console.log("=".repeat(60));
    console.log(`Documentos antes: ${countBefore}`);
    console.log(`Documentos después: ${countAfter}`);
    console.log(`Total eliminado: ${deleteResult.deletedCount}`);
    console.log("=".repeat(60) + "\n");

    console.log("✅ MongoDB limpiado exitosamente");
    console.log("💡 Ahora puedes ejecutar: npm run migrate:metadata\n");
  } catch (error) {
    console.error("❌ Error durante la limpieza:", error);
    throw error;
  } finally {
    await client.close();
    console.log("✅ Conexión a MongoDB cerrada");
  }
}

// Ejecutar
main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
