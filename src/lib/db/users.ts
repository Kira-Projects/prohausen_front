import clientPromise from "@/lib/mongodb";
import { User } from "@/types/user";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || "prohausen_db";
const COLLECTION_NAME = "users";

/**
 * Obtiene la colección de usuarios
 */
async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION_NAME);
}

/**
 * Crea un nuevo usuario con contraseña hasheada
 */
export async function createUser(
  nombre: string,
  email: string,
  password: string,
  role: "admin" | "user" = "user" // Por defecto "user"
): Promise<User> {
  const collection = await getUsersCollection();

  // Verificar si el email ya existe
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    nombre,
    email,
    password: hashedPassword,
    role, // Agregar role
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);
  
  const createdUser = await collection.findOne({ _id: result.insertedId });
  if (!createdUser) {
    throw new Error("Error al crear el usuario");
  }

  // No devolver la contraseña
  return {
    id: createdUser._id.toString(),
    nombre: createdUser.nombre,
    email: createdUser.email,
    role: createdUser.role,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
  };
}

/**
 * Obtiene un usuario por su email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ email });
  
  if (!user) return null;
  
  return {
    id: user._id.toString(),
    nombre: user.nombre,
    email: user.email,
    password: user.password,
    role: user.role || "user", // Por defecto "user" si no existe
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const collection = await getUsersCollection();
  
  try {
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      nombre: user.nombre,
      email: user.email,
      role: user.role || "user",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    return null;
  }
}

/**
 * Obtiene todos los usuarios (sin contraseñas)
 */
export async function getAllUsers(): Promise<User[]> {
  const collection = await getUsersCollection();
  const users = await collection.find({}).toArray();
  
  return users.map((user) => ({
    id: user._id.toString(),
    nombre: user.nombre,
    email: user.email,
    role: user.role || "user",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}

/**
 * Actualiza los datos de un usuario
 */
export async function updateUser(
  id: string,
  data: { nombre?: string; email?: string }
): Promise<User> {
  const collection = await getUsersCollection();

  // Si se está actualizando el email, verificar que no exista
  if (data.email) {
    const existingUser = await collection.findOne({ 
      email: data.email,
      _id: { $ne: new ObjectId(id) }
    });
    
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }
  }

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new Error("Usuario no encontrado");
  }

  return {
    id: result._id.toString(),
    nombre: result.nombre,
    email: result.email,
    role: result.role || "user",
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

/**
 * Elimina un usuario
 */
export async function deleteUser(id: string): Promise<boolean> {
  const collection = await getUsersCollection();

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Cambia la contraseña de un usuario
 */
export async function updatePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const collection = await getUsersCollection();

  // Obtener el usuario con la contraseña
  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Verificar la contraseña actual
  const isValid = await bcrypt.compare(currentPassword, user.password || "");
  if (!isValid) {
    throw new Error("Contraseña actual incorrecta");
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Verifica las credenciales de un usuario
 */
export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  // No devolver la contraseña
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
