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

// Tipos para la respuesta de WordPress API
export interface WordPressProperty {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  template: string;
  es_locations: number[];
  es_categories: number[];
  es_types: number[];
  es_rent_periods: number[];
  es_labels: number[];
  es_statuses: number[];
  es_parkings: number[];
  es_roofs: number[];
  es_exterior_materials: number[];
  es_basements: number[];
  es_floor_coverings: number[];
  es_features: number[];
  es_amenities: number[];
  es_neighborhoods: number[];
  es_tags: number[];
  class_list: string[];
  property_meta?: {
    price?: string;
    bedrooms?: string;
    bathrooms?: string;
    half_bathrooms?: string;
    total_rooms?: string;
    area?: string;
    land_area?: string;
    address?: string;
    zip?: string;
    country?: string;
    floors?: string;
    floor_number?: string;
    basement?: string;
    year_built?: string;
    video_url?:
      | string
      | {
          video_url: string;
          video_iframe: string;
          video_file: string;
        };
    latitude?: string;
    longitude?: string;
    gallery?: string | object; // IDs de imágenes de la galería
  };
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    "wp:featuredmedia": { embeddable: boolean; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": {
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }[];
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url?: string;
      guid?: {
        rendered: string;
      };
      media_details?: {
        sizes?: {
          [key: string]: {
            source_url: string;
          };
        };
      };
    }>;
    "wp:attachment"?: Array<{
      id: number;
      source_url?: string;
      guid?: {
        rendered: string;
      };
      media_details?: {
        sizes?: {
          [key: string]: {
            source_url: string;
          };
        };
      };
    }>;
  };
}

export interface WordPressTaxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>[];
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[];
  };
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

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
