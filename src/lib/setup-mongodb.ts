import { getDatabase } from "./mongodb";

/**
 * Configura los índices en la colección de properties
 * Este script debe ejecutarse una sola vez o cuando se necesite recrear índices
 */
export async function setupPropertyIndexes() {
  try {
    const db = await getDatabase();
    const collection = db.collection("properties");

    console.log("🔧 Configurando índices en MongoDB...");

    // Índice único en el campo 'id' (numérico)
    await collection.createIndex({ id: 1 }, { unique: true, name: "id_unique" });
    console.log("✅ Índice creado: id (único)");

    // Índice único en el campo 'slug'
    await collection.createIndex({ slug: 1 }, { unique: true, name: "slug_unique" });
    console.log("✅ Índice creado: slug (único)");

    // Índice en 'featured' para búsquedas rápidas de propiedades destacadas
    await collection.createIndex({ featured: 1 }, { name: "featured_index" });
    console.log("✅ Índice creado: featured");

    // Índice en 'active' para filtrar propiedades activas/inactivas
    await collection.createIndex({ active: 1 }, { name: "active_index" });
    console.log("✅ Índice creado: active");

    // Índice compuesto para búsquedas frecuentes
    await collection.createIndex(
      { active: 1, featured: 1 },
      { name: "active_featured_index" }
    );
    console.log("✅ Índice creado: active + featured (compuesto)");

    // Índice en 'operation' para filtrar por venta/arriendo
    await collection.createIndex({ operation: 1 }, { name: "operation_index" });
    console.log("✅ Índice creado: operation");

    // Índice en 'type' para filtrar por tipo de propiedad
    await collection.createIndex({ type: 1 }, { name: "type_index" });
    console.log("✅ Índice creado: type");

    // Índice en 'region' y 'comuna' para búsquedas por ubicación
    await collection.createIndex({ region: 1, comuna: 1 }, { name: "location_index" });
    console.log("✅ Índice creado: region + comuna (compuesto)");

    // Índice de texto completo en 'title' y 'description' para búsquedas
    await collection.createIndex(
      { title: "text", description: "text" },
      { name: "text_search_index" }
    );
    console.log("✅ Índice creado: búsqueda de texto (title + description)");

    // Índice en 'createdAt' para ordenar por fecha de creación
    await collection.createIndex({ createdAt: -1 }, { name: "created_at_index" });
    console.log("✅ Índice creado: createdAt (descendente)");

    // Índice en 'updatedAt' para ordenar por última actualización
    await collection.createIndex({ updatedAt: -1 }, { name: "updated_at_index" });
    console.log("✅ Índice creado: updatedAt (descendente)");

    console.log("🎉 ¡Todos los índices se crearon exitosamente!");

    return { success: true };
  } catch (error) {
    console.error("❌ Error al crear índices:", error);
    throw error;
  }
}

/**
 * Lista todos los índices existentes en la colección
 */
export async function listPropertyIndexes() {
  try {
    const db = await getDatabase();
    const collection = db.collection("properties");

    const indexes = await collection.listIndexes().toArray();
    
    console.log("📋 Índices existentes en 'properties':");
    indexes.forEach((index) => {
      console.log(`  - ${index.name}:`, index.key);
    });

    return indexes;
  } catch (error) {
    console.error("❌ Error al listar índices:", error);
    throw error;
  }
}

/**
 * Elimina todos los índices de la colección (excepto el _id por defecto)
 */
export async function dropAllPropertyIndexes() {
  try {
    const db = await getDatabase();
    const collection = db.collection("properties");

    console.log("🗑️  Eliminando todos los índices...");
    await collection.dropIndexes();
    console.log("✅ Índices eliminados exitosamente");

    return { success: true };
  } catch (error) {
    console.error("❌ Error al eliminar índices:", error);
    throw error;
  }
}

/**
 * Obtiene estadísticas de la colección
 */
export async function getCollectionStats() {
  try {
    const db = await getDatabase();
    const stats = await db.command({ collStats: "properties" });

    console.log("📊 Estadísticas de la colección 'properties':");
    console.log(`  - Documentos: ${stats.count}`);
    console.log(`  - Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Índices: ${stats.nindexes}`);
    console.log(`  - Tamaño de índices: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);

    return stats;
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    throw error;
  }
}
