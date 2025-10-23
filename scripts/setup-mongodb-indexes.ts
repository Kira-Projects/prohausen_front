/**
 * Script para configurar los índices de MongoDB
 * 
 * Uso: npm run setup:mongodb
 */

import {
  setupPropertyIndexes,
  listPropertyIndexes,
  getCollectionStats,
} from "../src/lib/setup-mongodb";

async function setupIndexes() {
  try {
    console.log("🚀 Configurando MongoDB...\n");

    // Crear índices
    await setupPropertyIndexes();

    console.log("\n");

    // Listar índices creados
    await listPropertyIndexes();

    console.log("\n");

    // Mostrar estadísticas
    await getCollectionStats();

    console.log("\n✅ Setup completado exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error durante el setup:", error);
    process.exit(1);
  }
}

// Ejecutar setup
setupIndexes();
