// Tipos para las propiedades (modelo de MongoDB)
// NOTA: MongoDB almacena URLs de S3 como strings (metadata textual)
// Los archivos multimedia están en AWS S3, MongoDB solo guarda las referencias
export interface Property {
  _id?: string; // ObjectId de MongoDB (opcional para creación)
  id: number; // ID numérico para compatibilidad
  title: string;
  slug: string;
  location: string;
  description: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: PropertyType;
  operation: OperationType;
  region: string;
  comuna: string;
  featured?: boolean;
  active?: boolean; // Estado de la propiedad (activa/inactiva)
  image: string; // URL de imagen principal desde S3
  images?: string[]; // Array de URLs de imágenes desde S3
  // Campos extendidos
  usefulArea?: string;
  landArea?: string;
  floors?: number;
  floorNumber?: number;
  groundLevel?: number;
  yearBuilt?: number;
  features?: string[];
  videoUrl?: string; // URL del video
  address?: string;
  zip?: string;
  country?: string;
  halfBathrooms?: number;
  totalRooms?: number;
  latitude?: string;
  longitude?: string;
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo para crear una propiedad (sin _id, sin timestamps)
export interface PropertyCreateInput {
  id: number;
  title: string;
  slug: string;
  location: string;
  description: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: PropertyType;
  operation: OperationType;
  region: string;
  comuna: string;
  featured?: boolean;
  active?: boolean;
  image: string; // URL desde S3
  images?: string[]; // URLs desde S3
  usefulArea?: string;
  landArea?: string;
  floors?: number;
  floorNumber?: number;
  groundLevel?: number;
  yearBuilt?: number;
  features?: string[];
  videoUrl?: string; // URL del video
  address?: string;
  zip?: string;
  country?: string;
  halfBathrooms?: number;
  totalRooms?: number;
  latitude?: string;
  longitude?: string;
}

// Tipo para actualizar una propiedad (todos los campos opcionales)
export interface PropertyUpdateInput {
  title?: string;
  slug?: string;
  location?: string;
  description?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: PropertyType;
  operation?: OperationType;
  region?: string;
  comuna?: string;
  featured?: boolean;
  active?: boolean;
  image?: string; // URL desde S3
  images?: string[]; // URLs desde S3
  usefulArea?: string;
  landArea?: string;
  floors?: number;
  floorNumber?: number;
  groundLevel?: number;
  yearBuilt?: number;
  features?: string[];
  videoUrl?: string; // URL del video
  address?: string;
  zip?: string;
  country?: string;
  halfBathrooms?: number;
  totalRooms?: number;
  latitude?: string;
  longitude?: string;
}

export type PropertyType =
  | "Casa"
  | "Departamento"
  | "Derecho a llave"
  | "Parcela"
  | "Penthouse";

export type OperationType = "Venta" | "Arriendo";

export interface PropertyFilters {
  operacion?: string;
  categoria?: string;
  region?: string;
  comuna?: string;
}

export interface ContactForm {
  nombre: string;
  telefono: string;
  email: string;
  rentaPromedio?: string;
  complementaRenta: "si" | "no";
  rentaCodeudor?: string;
  comentario: string;
}
