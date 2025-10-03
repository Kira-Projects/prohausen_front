import {
  Property,
  WordPressProperty,
  WordPressTaxonomy,
  PropertyType,
  OperationType,
} from "@/types/property";

/**
 * Extrae el texto plano de HTML
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Extrae información de ubicación desde class_list
 */
function extractLocationFromClassList(classList: string[]): {
  region: string;
  comuna: string;
} {
  let region = "";
  let comuna = "";

  classList.forEach((className) => {
    // Buscar región
    if (className.includes("es_location-")) {
      const location = className.replace("es_location-", "").replace(/-/g, " ");

      // Regiones conocidas
      const regiones = [
        "metropolitana",
        "valparaiso",
        "ohiggins",
        "los lagos",
        "libertador b ohiggins",
        "region metropolitana",
      ];

      const locationLower = location.toLowerCase();

      if (regiones.some((r) => locationLower.includes(r))) {
        region = location;
      } else if (!comuna) {
        comuna = location;
      }
    }
  });

  // Capitalizar primera letra
  region = region.charAt(0).toUpperCase() + region.slice(1);
  comuna = comuna.charAt(0).toUpperCase() + comuna.slice(1);

  return { region, comuna };
}

/**
 * Extrae el tipo de propiedad desde class_list
 */
function extractPropertyType(classList: string[]): PropertyType {
  const typeClass = classList.find((c) => c.includes("es_category-"));
  if (!typeClass) return "Casa";

  const type = typeClass.replace("es_category-", "");

  switch (type.toLowerCase()) {
    case "casa":
      return "Casa";
    case "departamento":
      return "Departamento";
    case "parcela":
      return "Parcela";
    case "penthouse":
      return "Penthouse";
    case "derecho-a-llave":
      return "Derecho a llave";
    default:
      return "Casa";
  }
}

/**
 * Extrae el tipo de operación desde class_list
 */
function extractOperationType(classList: string[]): OperationType {
  const operationClass = classList.find((c) => c.includes("es_type-"));
  if (!operationClass) return "Venta";

  const operation = operationClass.replace("es_type-", "");

  return operation.toLowerCase() === "arriendo" ? "Arriendo" : "Venta";
}

/**
 * Verifica si la propiedad es destacada
 */
function isFeatured(classList: string[]): boolean {
  return classList.some((c) => c.includes("es_label-featured"));
}

/**
 * Extrae el precio desde el contenido HTML
 * Busca patrones como "$ 14.890" o "$14890" o "UF 575"
 */
function extractPrice(content: string): string {
  // Patrón para precio en pesos con formato "$ 14.890"
  const pesosMatch = content.match(/\$\s*([\d.,]+)/);
  if (pesosMatch) {
    // Remover puntos (separadores de miles) y devolver solo números
    const cleanPrice = pesosMatch[1].replace(/\./g, "").replace(/,/g, "");
    return cleanPrice;
  }

  // Patrón para precio en UF
  const ufMatch = content.match(/(?:UF|uf)\s*([\d.,]+)/i);
  if (ufMatch) {
    return ufMatch[1].replace(/\./g, "").replace(/,/g, "");
  }

  // Buscar números grandes que puedan ser precios (más de 3 dígitos)
  const numberMatch = content.match(/\b(\d{3,}(?:[.,]\d{3})*)\b/);
  if (numberMatch) {
    return numberMatch[1].replace(/\./g, "").replace(/,/g, "");
  }

  return "0";
}

/**
 * Extrae características como dormitorios y baños desde el contenido
 */
function extractFeatures(content: string): {
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
} {
  const features: {
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
  } = {};

  // Buscar dormitorios
  const bedroomsMatch = content.match(
    /(\d+)\s*(?:dormitorios?|habitaciones?|dorm|camas?)/i
  );
  if (bedroomsMatch) {
    features.bedrooms = parseInt(bedroomsMatch[1]);
  }

  // Buscar baños
  const bathroomsMatch = content.match(/(\d+)\s*baños?/i);
  if (bathroomsMatch) {
    features.bathrooms = parseInt(bathroomsMatch[1]);
  }

  // Buscar área en m²
  const areaMatch = content.match(/(\d+(?:[.,]\d+)?)\s*m[²2]/i);
  if (areaMatch) {
    features.area = areaMatch[1].replace(",", ".");
  }

  return features;
}

/**
 * Mapea una propiedad de WordPress al formato de la aplicación
 */
export function mapWordPressProperty(
  wpProperty: WordPressProperty,
  featuredImageUrl?: string
): Property {
  const { region, comuna } = extractLocationFromClassList(
    wpProperty.class_list
  );
  const type = extractPropertyType(wpProperty.class_list);
  const operation = extractOperationType(wpProperty.class_list);
  const featured = isFeatured(wpProperty.class_list);

  const content = wpProperty.content.rendered;
  const excerpt = stripHtml(wpProperty.excerpt.rendered);
  const title = stripHtml(wpProperty.title.rendered);

  // Priorizar datos de property_meta si están disponibles
  let price = "0";
  let bedrooms: number | undefined;
  let bathrooms: number | undefined;
  let area = "0";
  let usefulArea: string | undefined;
  let landArea: string | undefined;
  let floors: number | undefined;
  let floorNumber: number | undefined;
  let groundLevel: number | undefined;
  let yearBuilt: number | undefined;
  let videoUrl: string | undefined;
  let address: string | undefined;
  let zip: string | undefined;
  let country: string | undefined;

  if (wpProperty.property_meta) {
    // Usar datos de metadatos de Estatik si están disponibles
    price = wpProperty.property_meta.price || "0";
    bedrooms = wpProperty.property_meta.bedrooms
      ? parseInt(wpProperty.property_meta.bedrooms)
      : undefined;
    bathrooms = wpProperty.property_meta.bathrooms
      ? parseInt(wpProperty.property_meta.bathrooms)
      : undefined;
    area =
      wpProperty.property_meta.area ||
      wpProperty.property_meta.land_area ||
      "0";

    // Campos extendidos
    landArea = wpProperty.property_meta.land_area;
    floors = wpProperty.property_meta.floors
      ? parseInt(wpProperty.property_meta.floors)
      : undefined;
    floorNumber = wpProperty.property_meta.floor_number
      ? parseInt(wpProperty.property_meta.floor_number)
      : undefined;
    groundLevel = wpProperty.property_meta.basement
      ? parseInt(wpProperty.property_meta.basement)
      : undefined;
    yearBuilt = wpProperty.property_meta.year_built
      ? parseInt(wpProperty.property_meta.year_built)
      : undefined;
    videoUrl = wpProperty.property_meta.video_url;
    address = wpProperty.property_meta.address;
    zip = wpProperty.property_meta.zip;
    country = wpProperty.property_meta.country;
  }

  // Fallback: Extraer desde contenido si no hay metadatos
  if (price === "0") {
    price = extractPrice(content + title);
    if (price === "0") {
      price = extractPrice(excerpt);
    }
  }

  // Extraer características del contenido como fallback
  const contentFeatures = extractFeatures(content);
  if (!bedrooms) bedrooms = contentFeatures.bedrooms;
  if (!bathrooms) bathrooms = contentFeatures.bathrooms;
  if (area === "0" && contentFeatures.area) area = contentFeatures.area;

  // Construir ubicación más completa
  let location = comuna || region || "Sin ubicación";

  // Intentar extraer ubicación del título o contenido si no hay en class_list
  if (location === "Sin ubicación") {
    // Buscar patrones comunes de ubicación en el título
    const locationMatch = title.match(/,\s*([^,]+)$/);
    if (locationMatch) {
      location = locationMatch[1].trim();
    }
  }

  // Descripción más robusta
  // Usar el contenido completo como descripción
  let description = excerpt;
  if (!description || description.length < 50) {
    // Usar el contenido completo sin truncar
    const cleanContent = stripHtml(content);
    description = cleanContent;
  }

  // Formatear precio para mostrar (agregar puntos como separadores de miles)
  const formattedPrice =
    price !== "0" && price.length > 3
      ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : price;

  console.log(
    `Mapeando propiedad ${wpProperty.id}: ${title} - Precio: $${formattedPrice}`
  );

  return {
    id: wpProperty.id,
    title: title,
    location: location,
    description: description,
    price: formattedPrice,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    area: area,
    type: type,
    operation: operation,
    region: region || "Sin región",
    comuna: comuna || "Sin comuna",
    featured: featured,
    image: featuredImageUrl || "/placeholder-property.jpg",
    images: featuredImageUrl ? [featuredImageUrl] : [],
    // Campos extendidos
    usefulArea: usefulArea,
    landArea: landArea,
    floors: floors,
    floorNumber: floorNumber,
    groundLevel: groundLevel,
    yearBuilt: yearBuilt,
    features: [], // Se llenará con las taxonomías de features
    videoUrl: videoUrl,
    address: address,
    zip: zip,
    country: country,
  };
}

/**
 * Mapea un array de propiedades de WordPress
 */
export function mapWordPressProperties(
  wpProperties: WordPressProperty[]
): Property[] {
  return wpProperties.map((wpProperty) => mapWordPressProperty(wpProperty));
}

/**
 * Crea un mapa de taxonomías por ID
 */
export function createTaxonomyMap(
  taxonomies: WordPressTaxonomy[]
): Map<number, string> {
  const map = new Map<number, string>();
  taxonomies.forEach((taxonomy) => {
    map.set(taxonomy.id, taxonomy.name);
  });
  return map;
}
