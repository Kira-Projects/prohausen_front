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
  let pais = "";

  const locations = classList
    .filter((c) => c.includes("es_location-"))
    .map((c) => c.replace("es_location-", "").replace(/-/g, " "));

  locations.forEach((location) => {
    const locationLower = location.toLowerCase();

    // Detectar país (excluir de región/comuna)
    if (locationLower === "chile") {
      pais = location;
      return; // No es región ni comuna
    }

    // Detectar regiones conocidas
    const regiones = [
      "valparaiso",
      "metropolitana",
      "region metropolitana",
      "ohiggins",
      "los lagos",
      "libertador b ohiggins",
    ];

    if (regiones.some((r) => locationLower.includes(r))) {
      region = location;
    } else if (location !== pais && !region) {
      // Si no es país ni región, es comuna
      comuna = location;
    } else if (location !== pais && region) {
      // Si ya tenemos región, el siguiente es comuna
      comuna = location;
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
 * Formatea un número con puntos como separadores de miles (estilo chileno)
 * Ejemplo: 14890 → "14.890", 140000000 → "140.000.000"
 */
function formatNumberWithDots(numberStr: string): string {
  const number = parseInt(numberStr);
  if (isNaN(number)) return numberStr;
  return number
    .toLocaleString("es-CL", { useGrouping: true })
    .replace(/,/g, ".");
}

/**
 * Extrae el precio desde el contenido HTML y lo formatea con símbolo $ (peso chileno)
 * Busca patrones como "$ 14.890" o "$14890" o "UF 575"
 */
function extractPrice(content: string): string {
  // Patrón para precio en pesos con formato "$ 14.890"
  const pesosMatch = content.match(/\$\s*([\d.,]+)/);
  if (pesosMatch) {
    // Limpiar el número (remover puntos y comas)
    const cleanNumber = pesosMatch[1].replace(/\./g, "").replace(/,/g, "");
    // Formatear con puntos de miles y devolver con símbolo $
    return `$ ${formatNumberWithDots(cleanNumber)}`;
  }

  // Patrón para precio en UF - convertir a pesos chilenos
  const ufMatch = content.match(/(?:UF|uf)\s*([\d.,]+)/i);
  if (ufMatch) {
    // Limpiar el número (remover puntos y comas)
    const cleanNumber = ufMatch[1].replace(/\./g, "").replace(/,/g, "");
    // Formatear con puntos de miles y devolver con símbolo $
    return `$ ${formatNumberWithDots(cleanNumber)}`;
  }

  // Buscar números grandes que puedan ser precios (más de 3 dígitos)
  const numberMatch = content.match(/\b(\d{3,}(?:[.,]\d{3})*)\b/);
  if (numberMatch) {
    const cleanNumber = numberMatch[1].replace(/\./g, "").replace(/,/g, "");
    // Formatear con puntos de miles y devolver con símbolo $
    return `$ ${formatNumberWithDots(cleanNumber)}`;
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
  const locationData = extractLocationFromClassList(wpProperty.class_list);
  let region = locationData.region;
  const comuna = locationData.comuna;

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
  let halfBathrooms: number | undefined;
  let totalRooms: number | undefined;
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
  let latitude: string | undefined;
  let longitude: string | undefined;

  if (wpProperty.property_meta) {
    // Usar datos de metadatos de Estatik si están disponibles
    // Formatear el precio con símbolo $ y puntos de miles
    const rawPrice = wpProperty.property_meta.price || "0";
    price = rawPrice === "0" ? "0" : extractPrice(rawPrice);

    bedrooms = wpProperty.property_meta.bedrooms
      ? parseInt(wpProperty.property_meta.bedrooms)
      : undefined;
    bathrooms = wpProperty.property_meta.bathrooms
      ? parseInt(wpProperty.property_meta.bathrooms)
      : undefined;

    // NOTA: half_bathrooms y total_rooms NO existen en Estatik por defecto
    halfBathrooms = wpProperty.property_meta.half_bathrooms
      ? parseInt(wpProperty.property_meta.half_bathrooms)
      : undefined;
    totalRooms = wpProperty.property_meta.total_rooms
      ? parseInt(wpProperty.property_meta.total_rooms)
      : undefined;

    // Para mostrar en características principales (línea con íconos)
    // Priorizar land_area (superficie construida) para el display principal
    area =
      wpProperty.property_meta.land_area ||
      wpProperty.property_meta.area ||
      "0";

    // Campos extendidos - CORREGIDOS según los datos reales de Estatik
    // area = 973 (Superficie total/terreno)
    // land_area = 242 (Superficie construida/útil)
    usefulArea = wpProperty.property_meta.land_area; // 242 m² (Tamaño del lote)
    landArea = wpProperty.property_meta.area; // 973 m² (Área total)
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

    // videoUrl viene como objeto serializado, extraer la URL
    if (wpProperty.property_meta.video_url) {
      if (typeof wpProperty.property_meta.video_url === "object") {
        videoUrl = wpProperty.property_meta.video_url.video_url || "";
      } else {
        videoUrl = wpProperty.property_meta.video_url;
      }
    }

    address = wpProperty.property_meta.address;
    zip = wpProperty.property_meta.zip;
    country = wpProperty.property_meta.country;

    // Coordenadas GPS para el mapa
    latitude = wpProperty.property_meta.latitude;
    longitude = wpProperty.property_meta.longitude;
  }

  // Si no hay superficies en property_meta, intentar extraer del contenido
  if (!usefulArea || usefulArea === "") {
    // Buscar patrones como "242 m²" o "242m2" o "242 metros cuadrados"
    const areaMatch = content.match(/(\d+(?:[.,]\d+)?)\s*(?:m[²2]|metros)/i);
    if (areaMatch) {
      usefulArea = areaMatch[1].replace(",", ".");
    }
  }

  if (!landArea || landArea === "") {
    // Buscar patrones como "terreno de 973 m²"
    const landMatch = content.match(
      /terreno[^0-9]*(\d+(?:[.,]\d+)?)\s*(?:m[²2]|metros)/i
    );
    if (landMatch) {
      landArea = landMatch[1].replace(",", ".");
    }
  }

  // Si usefulArea tiene valor, usarlo para 'area' si area está en "0"
  if (area === "0" && usefulArea && usefulArea !== "") {
    area = usefulArea;
  }

  // Si landArea tiene valor y usefulArea no, usar landArea para 'area'
  if (area === "0" && !usefulArea && landArea && landArea !== "") {
    area = landArea;
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

  // Si tenemos address en property_meta, extraer ciudad de ahí (MÁS PRECISO)
  if (address && address.includes(",")) {
    const addressParts = address.split(",").map((p) => p.trim());

    // Formato esperado: "Halimeda, Viña del Mar, Valparaíso, Chile"
    // addressParts[0] = calle
    // addressParts[1] = ciudad/comuna
    // addressParts[2] = región
    // addressParts[3] = país

    if (addressParts.length >= 2) {
      const ciudadFromAddress = addressParts[1];
      if (ciudadFromAddress && ciudadFromAddress.toLowerCase() !== "chile") {
        location = ciudadFromAddress; // Usar la ciudad del address
      }
    }

    if (addressParts.length >= 3) {
      const regionFromAddress = addressParts[2];
      if (regionFromAddress && !region) {
        region = regionFromAddress;
      }
    }
  }

  // Intentar extraer ubicación del título o contenido si no hay en class_list
  if (location === "Sin ubicación") {
    // Buscar patrones comunes de ubicación en el título
    const locationMatch = title.match(/,\s*([^,]+)$/);
    if (locationMatch) {
      location = locationMatch[1].trim();
    }
  }

  // Usar el contenido completo con HTML para la descripción
  // Esto permite que se muestre con formato en el frontend
  let description = content; // Mantener el HTML del contenido completo

  // Si no hay contenido, usar el excerpt
  if (!description || description.length < 50) {
    description = excerpt;
  }

  // Formatear precio para mostrar (agregar puntos como separadores de miles)
  const formattedPrice =
    price !== "0" && price.length > 3
      ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : price;

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
    image: featuredImageUrl || "/placeholder-property.svg",
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
    halfBathrooms: halfBathrooms,
    totalRooms: totalRooms,
    latitude: latitude,
    longitude: longitude,
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
