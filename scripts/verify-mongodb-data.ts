import { config } from "dotenv";
import { MongoClient } from "mongodb";

// Cargar variables de entorno
config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "prohausen";

async function main() {
  console.log("🔍 Verificando datos en MongoDB\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db(MONGODB_DB);
    const collection = db.collection("properties");

    // Contar total
    const total = await collection.countDocuments();
    console.log(`📊 Total de propiedades: ${total}\n`);

    // Obtener una propiedad de ejemplo
    const sample = await collection.findOne({ id: 2269 });

    if (sample) {
      console.log("📄 Ejemplo de propiedad (#2269):");
      console.log("=".repeat(60));
      console.log(`ID: ${sample.id}`);
      console.log(`Título: ${sample.title}`);
      console.log(`Precio: ${sample.price}`);
      console.log(`Ubicación: ${sample.location}`);
      console.log(`Tipo: ${sample.type}`);
      console.log(`Operación: ${sample.operation}`);
      console.log(`Dormitorios: ${sample.bedrooms}`);
      console.log(`Baños: ${sample.bathrooms}`);
      console.log(`Featured: ${sample.featured}`);
      console.log(`Folder ID: ${sample.folderId}`);
      console.log(`Imagen principal: ${sample.image}`);
      console.log(`Total de imágenes: ${sample.images?.length || 0}`);
      console.log(`Tiene slug: ${sample.slug ? "SÍ ❌" : "NO ✅"}`);
      console.log(`Tiene descripción: ${sample.description ? "SÍ ✅" : "NO ❌"}`);
      console.log("=".repeat(60) + "\n");

      // Mostrar primera imagen
      if (sample.images && sample.images.length > 0) {
        console.log("🖼️  Primera imagen S3:");
        console.log(sample.images[0]);
        console.log("");
      }
    }

    // Verificar propiedades destacadas
    const featured = await collection.find({ featured: true }).toArray();
    console.log(`⭐ Propiedades destacadas: ${featured.length}`);
    featured.forEach((prop) => {
      console.log(`   - #${prop.id}: ${prop.title}`);
    });

    console.log("\n✅ Verificación completada");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

main();
