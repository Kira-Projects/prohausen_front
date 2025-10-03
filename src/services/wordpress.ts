import {
  WordPressProperty,
  WordPressTaxonomy,
  WordPressMedia,
} from "@/types/property";

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://prohausen.cl/wp-json/wp/v2";

/**
 * Servicio para interactuar con la API de WordPress
 */

/**
 * Obtiene todas las propiedades de WordPress
 */
export async function getProperties(): Promise<WordPressProperty[]> {
  try {
    // Solicitar hasta 100 propiedades por página
    const response = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=100`,
      {
        next: { revalidate: 60 }, // Revalidar cada 60 segundos
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.status}`);
    }

    const properties: WordPressProperty[] = await response.json();

    // Log para ver cuántas propiedades se obtuvieron
    const totalPages = response.headers.get("X-WP-TotalPages");
    const total = response.headers.get("X-WP-Total");
    console.log(
      `Propiedades obtenidas: ${properties.length} de ${total} total (${totalPages} páginas)`
    );

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
      next: { revalidate: 60 },
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
 * Obtiene una imagen por ID
 */
export async function getMediaById(id: number): Promise<WordPressMedia | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/media/${id}`, {
      next: { revalidate: 3600 },
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
    const response = await fetch(
      `${WORDPRESS_API_URL}/media?parent=${propertyId}`,
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
