import { MongoClient } from 'mongodb';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no está configurado');
    process.exit(1);
  }

  console.log('🔌 Conectando a MongoDB...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    const db = client.db('prohausen');
    const collection = db.collection('properties');

    // Contar documentos
    const count = await collection.countDocuments();
    console.log(`📊 Total de propiedades: ${count}\n`);

    // Obtener una propiedad de ejemplo
    const sample = await collection.findOne();
    if (sample) {
      console.log('📄 Ejemplo de propiedad:');
      console.log('ID:', sample.id);
      console.log('Título:', sample.title);
      console.log('Slug:', sample.slug);
      console.log('Featured:', sample.featured);
      console.log('Active:', sample.active);
      console.log('Image:', sample.image ? 'Sí' : 'No');
      console.log('Images count:', sample.images?.length || 0);
    }

    // Contar featured
    const featuredCount = await collection.countDocuments({ featured: true });
    console.log(`\n⭐ Propiedades destacadas: ${featuredCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testConnection();
