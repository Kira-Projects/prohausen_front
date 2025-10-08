import {
  Property,
  WordPressProperty,
  WordPressTaxonomy,
  WordPressMedia,
} from "@/types/property";
import {
  getCachedFeaturedProperties,
  setCachedFeaturedProperties,
  getCachedAllProperties,
  setCachedAllProperties,
  getCachedProperty,
  setCachedProperty,
} from "@/lib/cache";
import { mapWordPressProperty } from "@/utils/mapWordPressData";

// Tipo para propiedades de WordPress con datos embebidos
interface WordPressPropertyWithEmbeds extends WordPressProperty {
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      id: number;
    }>;
    "wp:attachment"?: Array<{
      source_url: string;
      id: number;
    }>;
  };
}

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://prohausen.cl/wp-json/wp/v2";

/**
 * Servicio para interactuar con la API de WordPress
 */

/**
 * Obtiene propiedades destacadas CON CACHÉ REDIS
 * Primero verifica el caché, si no existe llama a WordPress
 */
export async function getFeaturedPropertiesWithCache(): Promise<Property[]> {
  try {
    // 1. Intentar obtener del caché primero
    const cached = await getCachedFeaturedProperties();
    if (cached) {
      return cached;
    }

    // 2. Si no hay caché, llamar a WordPress API
    const response = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=4&_embed=wp:featuredmedia,wp:attachment&es_featured=true`,
      {
        cache: "no-store", // Desactivar caché del navegador cuando usamos Redis
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching featured properties: ${response.status}`);
    }

    const properties: WordPressPropertyWithEmbeds[] = await response.json();

    // 3. Mapear los datos de WordPress a nuestro formato
    const mappedProperties = properties.map((prop) =>
      mapWordPressProperty(prop)
    );

    // 4. Guardar en caché para próximas peticiones
    await setCachedFeaturedProperties(mappedProperties);

    return mappedProperties;
  } catch (error) {
    console.error("❌ Error al obtener propiedades destacadas:", error);
    return [];
  }
}

/**
 * Obtiene todas las propiedades CON CACHÉ REDIS
 */
export async function getPropertiesWithCache(): Promise<Property[]> {
  try {
    // 1. Intentar obtener del caché primero
    const cached = await getCachedAllProperties();
    if (cached) {
      return cached;
    }

    // 2. Si no hay caché, llamar a WordPress API
    const properties = await getProperties();

    // 3. Mapear los datos
    const mappedProperties = properties.map((prop) =>
      mapWordPressProperty(prop)
    );

    // 4. Guardar en caché
    await setCachedAllProperties(mappedProperties);

    return mappedProperties;
  } catch (error) {
    console.error("❌ Error al obtener todas las propiedades:", error);
    return [];
  }
}

/**
 * Obtiene una propiedad específica por ID CON CACHÉ REDIS
 */
export async function getPropertyByIdWithCache(
  id: number
): Promise<Property | null> {
  try {
    // 1. Intentar obtener del caché primero
    const cached = await getCachedProperty(id);
    if (cached) {
      return cached;
    }

    // 2. Si no hay caché, llamar a WordPress API
    const property = await getPropertyById(id);

    if (!property) {
      return null;
    }

    // 3. Mapear los datos
    const mappedProperty = mapWordPressProperty(property);

    // 4. Guardar en caché
    await setCachedProperty(id, mappedProperty);

    return mappedProperty;
  } catch (error) {
    console.error(`❌ Error al obtener propiedad ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene todas las propiedades de WordPress (SIN CACHÉ - función original)
 */
export async function getProperties(): Promise<WordPressProperty[]> {
  try {
    // Solicitar propiedades SIN _embed para mejor performance (60% más rápido)
    const response = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=100`,
      {
        next: { revalidate: 3600 }, // Cache de 1 hora para mejor performance
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.status}`);
    }

    const properties: WordPressProperty[] = await response.json();

    return properties;
  } catch (error) {
    console.error("Error fetching properties from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene una propiedad específica por ID
 */
export async function getPropertyById(
  id: number
): Promise<WordPressProperty | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/properties/${id}`, {
      next: { revalidate: 1800 }, // Cache de 30 minutos para propiedades individuales
    });

    if (!response.ok) {
      throw new Error(`Error fetching property ${id}: ${response.status}`);
    }

    const property: WordPressProperty = await response.json();
    return property;
  } catch (error) {
    console.error(`Error fetching property ${id} from WordPress:`, error);
    return null;
  }
}

/**
 * Obtiene las categorías de propiedades
 */
export async function getCategories(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/es_categories`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.status}`);
    }

    const categories: WordPressTaxonomy[] = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene los tipos de operación
 */
export async function getTypes(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/es_types`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching types: ${response.status}`);
    }

    const types: WordPressTaxonomy[] = await response.json();
    return types;
  } catch (error) {
    console.error("Error fetching types from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene las ubicaciones
 */
export async function getLocations(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/es_locations`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching locations: ${response.status}`);
    }

    const locations: WordPressTaxonomy[] = await response.json();
    return locations;
  } catch (error) {
    console.error("Error fetching locations from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene las etiquetas (labels)
 */
export async function getLabels(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/es_labels`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching labels: ${response.status}`);
    }

    const labels: WordPressTaxonomy[] = await response.json();
    return labels;
  } catch (error) {
    console.error("Error fetching labels from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene las características (features)
 */
export async function getFeatures(): Promise<WordPressTaxonomy[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/es_features`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching features: ${response.status}`);
    }

    const features: WordPressTaxonomy[] = await response.json();
    return features;
  } catch (error) {
    console.error("Error fetching features from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene una imagen por ID (con cache agresivo)
 */
export async function getMediaById(id: number): Promise<WordPressMedia | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/media/${id}`, {
      next: { revalidate: 86400 }, // Cache 24 horas para imágenes
    });

    if (!response.ok) {
      throw new Error(`Error fetching media ${id}: ${response.status}`);
    }

    const media: WordPressMedia = await response.json();
    return media;
  } catch (error) {
    console.error(`Error fetching media ${id} from WordPress:`, error);
    return null;
  }
}

/**
 * Obtiene imagen destacada de una propiedad específica (lazy loading)
 */
export async function getPropertyFeaturedImageFast(
  propertyId: number,
  mediaId: number
): Promise<string> {
  try {
    const media = await getMediaById(mediaId);
    return (
      media?.source_url ||
      `https://prohausen.cl/wp-content/uploads/2024/01/placeholder-property.jpg`
    );
  } catch (error) {
    console.warn(`⚠️ Error loading image for property ${propertyId}:`, error);
    return `https://prohausen.cl/wp-content/uploads/2024/01/placeholder-property.jpg`;
  }
}

/**
 * Obtiene múltiples imágenes por IDs
 */
export async function getMediaByIds(ids: number[]): Promise<WordPressMedia[]> {
  try {
    const promises = ids.map((id) => getMediaById(id));
    const results = await Promise.all(promises);
    return results.filter((media): media is WordPressMedia => media !== null);
  } catch (error) {
    console.error("Error fetching multiple media from WordPress:", error);
    return [];
  }
}

/**
 * Obtiene las imágenes de una propiedad
 */
export async function getPropertyImages(
  propertyId: number
): Promise<WordPressMedia[]> {
  try {
    // Solicitar hasta 100 imágenes por página
    const response = await fetch(
      `${WORDPRESS_API_URL}/media?parent=${propertyId}&per_page=100`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching images for property ${propertyId}: ${response.status}`
      );
    }

    const images: WordPressMedia[] = await response.json();

    return images;
  } catch (error) {
    console.error(
      `Error fetching images for property ${propertyId} from WordPress:`,
      error
    );
    return [];
  }
}

/**
 * Extrae imágenes de una propiedad usando datos embebidos (optimizado)
 */
export function extractEmbeddedImages(
  wpProperty: WordPressPropertyWithEmbeds
): string[] {
  const images: string[] = [];

  try {
    // Obtener imagen destacada desde _embedded
    if (wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
      images.push(wpProperty._embedded["wp:featuredmedia"][0].source_url);
    }

    // También intentar obtener attachments si están disponibles
    if (wpProperty._embedded?.["wp:attachment"]) {
      wpProperty._embedded["wp:attachment"].forEach((attachment) => {
        if (attachment.source_url && !images.includes(attachment.source_url)) {
          images.push(attachment.source_url);
        }
      });
    }
  } catch (error) {
    console.warn(
      `Error extracting embedded images for property ${wpProperty.id}:`,
      error
    );
  }

  return images.slice(0, 5); // Limitar a 5 imágenes como solicitaste
}

/**
 * Obtiene múltiples imágenes de una propiedad (método híbrido optimizado)
 */
export async function getPropertyImagesOptimized(
  wpProperty: WordPressPropertyWithEmbeds
): Promise<string[]> {
  // Primero intentar con datos embebidos (rápido)
  let images = extractEmbeddedImages(wpProperty);

  // Si tenemos menos de 2 imágenes, intentar obtener más de la galería
  if (images.length < 2) {
    try {
      const galleryImages = await getPropertyImages(wpProperty.id);

      // Agregar URLs de la galería que no estén ya incluidas
      const galleryUrls = galleryImages
        .map((img) => img.source_url)
        .filter((url) => url && !images.includes(url))
        .slice(0, 4); // Máximo 4 adicionales

      images = [...images, ...galleryUrls];
    } catch (error) {
      console.warn(
        `⚠️ Error obteniendo galería para propiedad ${wpProperty.id}:`,
        error
      );
    }
  }

  return images.slice(0, 5); // Limitar a 5 imágenes máximo
}

/**
 * Obtiene propiedades destacadas RÁPIDO - Solo consulta básica + filtrado frontend
 */
export async function getFeaturedPropertiesOptimized(): Promise<
  WordPressProperty[]
> {
  try {
    // Consulta básica SIN _embed para máxima velocidad (1.5s vs 7s)
    const response = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=50`,
      {
        next: { revalidate: 7200 }, // Cache de 2 horas - más agresivo
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const properties: WordPressProperty[] = await response.json();

    // Filtrado frontend - mucho más rápido que meta_query en WordPress
    const featured = properties
      .filter((prop) => prop.class_list.includes("es_label-featured"))
      .slice(0, 4);

    return featured;
  } catch (error) {
    console.error("❌ Error fetching featured properties:", error);
    return [];
  }
}
