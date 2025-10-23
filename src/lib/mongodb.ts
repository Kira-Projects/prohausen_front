import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usar una variable global para preservar el cliente a través de hot reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En producción, crear un nuevo cliente
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Exportar una función para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("prohausen"); // Especificar explícitamente la base de datos
}

// Exportar el cliente promise para uso directo si es necesario
export default clientPromise;
