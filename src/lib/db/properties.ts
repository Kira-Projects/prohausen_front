import { getDatabase } from "../mongodb";
import {
  Property,
  PropertyCreateInput,
  PropertyUpdateInput,
} from "../../types/property";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "properties";

/**
 * Obtiene todas las propiedades con filtros opcionales
 */
export async function getAllProperties(filters?: {
  active?: boolean;
  featured?: boolean;
  operation?: string;
  type?: string;
  region?: string;
  comuna?: string;
}): Promise<Property[]> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};

  if (filters?.active !== undefined) {
    query.active = filters.active;
  }
  if (filters?.featured !== undefined) {
    query.featured = filters.featured;
  }
  if (filters?.operation) {
    query.operation = filters.operation;
  }
  if (filters?.type) {
    query.type = filters.type;
  }
  if (filters?.region) {
    query.region = filters.region;
  }
  if (filters?.comuna) {
    query.comuna = filters.comuna;
  }

  const properties = await collection
    .find(query)
    .sort({ createdAt: -1 }) // Más recientes primero
    .toArray();

  return properties.map((prop) => ({
    ...prop,
    _id: prop._id.toString(),
  })) as Property[];
}

/**
 * Obtiene propiedades destacadas (featured = true)
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  return getAllProperties({ featured: true });
}

/**
 * Obtiene una propiedad por su ID numérico
 */
export async function getPropertyById(id: number): Promise<Property | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const property = await collection.findOne({ id });

  if (!property) {
    return null;
  }

  return {
    ...property,
    _id: property._id.toString(),
  } as Property;
}

/**
 * Obtiene una propiedad por su slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const property = await collection.findOne({ slug });

  if (!property) {
    return null;
  }

  return {
    ...property,
    _id: property._id.toString(),
  } as Property;
}

/**
 * Obtiene una propiedad por su ObjectId de MongoDB
 */
export async function getPropertyByMongoId(
  mongoId: string
): Promise<Property | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const property = await collection.findOne({ _id: new ObjectId(mongoId) });

  if (!property) {
    return null;
  }

  return {
    ...property,
    _id: property._id.toString(),
  } as Property;
}

/**
 * Crea una nueva propiedad
 */
export async function createProperty(
  propertyData: PropertyCreateInput
): Promise<Property> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const now = new Date();
  const propertyToInsert = {
    ...propertyData,
    active: propertyData.active ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(propertyToInsert);

  const insertedProperty = await collection.findOne({ _id: result.insertedId });

  if (!insertedProperty) {
    throw new Error("Error al crear la propiedad");
  }

  return {
    ...insertedProperty,
    _id: insertedProperty._id.toString(),
  } as Property;
}

/**
 * Actualiza una propiedad por su ID numérico
 */
export async function updatePropertyById(
  id: number,
  updates: PropertyUpdateInput
): Promise<Property | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  return {
    ...result,
    _id: result._id.toString(),
  } as Property;
}

/**
 * Actualiza una propiedad por su ObjectId de MongoDB
 */
export async function updatePropertyByMongoId(
  mongoId: string,
  updates: PropertyUpdateInput
): Promise<Property | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(mongoId) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  return {
    ...result,
    _id: result._id.toString(),
  } as Property;
}

/**
 * Elimina una propiedad por su ID numérico
 */
export async function deletePropertyById(id: number): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const result = await collection.deleteOne({ id });

  return result.deletedCount > 0;
}

/**
 * Elimina una propiedad por su ObjectId de MongoDB
 */
export async function deletePropertyByMongoId(mongoId: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const result = await collection.deleteOne({ _id: new ObjectId(mongoId) });

  return result.deletedCount > 0;
}

/**
 * Busca propiedades por texto (búsqueda full-text)
 */
export async function searchProperties(searchTerm: string): Promise<Property[]> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const properties = await collection
    .find({
      $text: { $search: searchTerm },
      active: true,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return properties.map((prop) => ({
    ...prop,
    _id: prop._id.toString(),
  })) as Property[];
}

/**
 * Cuenta el total de propiedades con filtros opcionales
 */
export async function countProperties(filters?: {
  active?: boolean;
  featured?: boolean;
  operation?: string;
  type?: string;
  region?: string;
  comuna?: string;
}): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const query: Record<string, unknown> = {};

  if (filters?.active !== undefined) {
    query.active = filters.active;
  }
  if (filters?.featured !== undefined) {
    query.featured = filters.featured;
  }
  if (filters?.operation) {
    query.operation = filters.operation;
  }
  if (filters?.type) {
    query.type = filters.type;
  }
  if (filters?.region) {
    query.region = filters.region;
  }
  if (filters?.comuna) {
    query.comuna = filters.comuna;
  }

  return await collection.countDocuments(query);
}

/**
 * Obtiene el siguiente ID disponible para una nueva propiedad
 */
export async function getNextPropertyId(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const lastProperty = await collection
    .find()
    .sort({ id: -1 })
    .limit(1)
    .toArray();

  if (lastProperty.length === 0) {
    return 1;
  }

  return (lastProperty[0].id as number) + 1;
}
