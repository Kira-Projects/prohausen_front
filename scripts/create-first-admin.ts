/**
 * Script para crear el primer usuario administrador (Alice)
 */

import { getDatabase } from "../src/lib/mongodb";
import { hashPassword } from "../src/lib/auth";

async function createFirstAdmin() {
  try {
    console.log("🔗 Conectando a MongoDB...");
    const db = await getDatabase();

    const aliceEmail = "contacto@prohausen.cl";
    const aliceName = "Alice";
    const alicePassword = "admin123"; // Cambiar esta contraseña después del primer login

    // Verificar si Alice ya existe
    const existingUser = await db.collection("users").findOne({ email: aliceEmail });
    
    if (existingUser) {
      console.log("⚠️  Alice ya existe en la base de datos");
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Rol: ${existingUser.role || "user"}`);
      
      // Actualizar a admin si no lo es
      if (existingUser.role !== "admin") {
        await db.collection("users").updateOne(
          { email: aliceEmail },
          { $set: { role: "admin" } }
        );
        console.log("✅ Alice actualizada a rol de administrador");
      } else {
        console.log("✅ Alice ya es administrador");
      }
      return;
    }

    // Crear Alice como administrador
    console.log("👤 Creando usuario Alice...");
    
    const hashedPassword = await hashPassword(alicePassword);
    const now = new Date();

    const newUser = {
      nombre: aliceName,
      email: aliceEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("users").insertOne(newUser);

    if (result.insertedId) {
      console.log("✅ Alice creada exitosamente como administrador");
      console.log("");
      console.log("📝 Credenciales de acceso:");
      console.log(`   Email: ${aliceEmail}`);
      console.log(`   Contraseña: ${alicePassword}`);
      console.log(`   Rol: admin`);
      console.log("");
      console.log("⚠️  IMPORTANTE: Cambia la contraseña después del primer login");
      console.log("   Ve a: Perfil > Cambiar Contraseña");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// Ejecutar script
createFirstAdmin()
  .then(() => {
    console.log("\n✅ Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  });
