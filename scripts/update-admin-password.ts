/**
 * Script para actualizar la contraseña del administrador
 */

import { getDatabase } from "../src/lib/mongodb";
import { hashPassword } from "../src/lib/auth";

async function updateAdminPassword() {
  try {
    console.log("🔗 Conectando a MongoDB...");
    const db = await getDatabase();

    const adminEmail = "contacto@prohausen.cl";
    const newPassword = "admin2024";

    console.log("🔐 Hasheando nueva contraseña...");
    const hashedPassword = await hashPassword(newPassword);

    console.log("💾 Actualizando contraseña en la base de datos...");
    const result = await db.collection("users").updateOne(
      { email: adminEmail },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      console.log("❌ No se encontró el usuario con email:", adminEmail);
      return;
    }

    if (result.modifiedCount === 0) {
      console.log("⚠️  El usuario existe pero no se modificó (quizás ya tenía esa contraseña)");
      return;
    }

    console.log("✅ Contraseña actualizada exitosamente");
    console.log("");
    console.log("📝 Nuevas credenciales:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Contraseña: ${newPassword}`);
    console.log("");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Ejecutar script
updateAdminPassword()
  .then(() => {
    console.log("✅ Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
