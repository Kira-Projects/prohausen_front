/**
 * Script para probar el login del administrador
 */

import { verifyUserCredentials } from "../src/lib/db/users";

async function testLogin() {
  try {
    console.log("🔐 Probando login del administrador...\n");
    
    const email = "contacto@prohausen.cl";
    const password = "admin2024";
    
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);
    
    console.log("Verificando credenciales...");
    const user = await verifyUserCredentials(email, password);
    
    if (!user) {
      console.log("❌ Credenciales incorrectas");
      console.log("   Posibles causas:");
      console.log("   1. La contraseña no coincide");
      console.log("   2. El email no existe");
      console.log("   3. El hash de la contraseña es incorrecto");
      process.exit(1);
    }
    
    console.log("✅ Login exitoso!");
    console.log("\nDatos del usuario:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.nombre}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.role}`);
    
  } catch (error) {
    console.error("❌ Error al probar login:", error);
    if (error instanceof Error) {
      console.error("   Mensaje:", error.message);
      console.error("   Stack:", error.stack);
    }
    process.exit(1);
  }
}

testLogin()
  .then(() => {
    console.log("\n✅ Test completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  });
