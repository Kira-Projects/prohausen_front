// Tipos para las propiedades
export interface Property {
  id: number;
  title: string;
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
  image: string;
  images?: string[];
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

