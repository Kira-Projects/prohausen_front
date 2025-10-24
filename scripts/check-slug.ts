import { config } from "dotenv";
import { MongoClient } from "mongodb";

// Cargar variables de entorno
config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "prohausen";

async function checkSlug() {
  console.log("🔍 Verificando slugs en MongoDB\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db(MONGODB_DB);
    const collection = db.collection("properties");

    // Verificar propiedad 1051
    const property = await collection.findOne({ id: 1051 });
    
    console.log("📋 Propiedad ID 1051:");
    console.log("  Título:", property?.title);
    console.log("  Slug:", property?.slug || "❌ (no tiene slug)");
    console.log("\n🔍 Todos los campos:", Object.keys(property || {}).join(", "));

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Conexión cerrada");
  }
}

checkSlug().catch(console.error);
