import { Redis } from "@upstash/redis";
import { Property } from "@/types/property";

// Obtener variables de entorno (con fallbacks para diferentes contextos)
const UPSTASH_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL ||
  "";

const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN ||
  "";

// Validar que las variables de entorno existen y son URLs válidas
if (!UPSTASH_URL || !UPSTASH_URL.startsWith("http")) {
  throw new Error(
    `❌ UPSTASH_REDIS_REST_URL is not configured or invalid. Received: "${UPSTASH_URL}". ` +
      `Please set it in your .env.local file or Vercel environment variables.`
  );
}

if (!UPSTASH_TOKEN || UPSTASH_TOKEN.length < 10) {
  throw new Error(
    `❌ UPSTASH_REDIS_REST_TOKEN is not configured or invalid. ` +
      `Please set it in your .env.local file or Vercel environment variables.`
  );
}

// Inicializar cliente Redis de Upstash
const redis = new Redis({
  url: UPSTASH_URL,
  token: UPSTASH_TOKEN,
});

const CACHE_KEYS = {
  FEATURED_PROPERTIES: "featured-properties",
  ALL_PROPERTIES: "all-properties",
  PROPERTY_DETAIL: (id: number) => `property-${id}`,
  LAST_UPDATE: "cache-last-update",
};

// ⚠️ NOTA: NO usamos TTL porque el caché se actualiza manualmente con el botón del admin
// El caché dura para siempre hasta que el administrador presione "Reflejar Cambios"

export async function getCachedFeaturedProperties(): Promise<
  Property[] | null
> {
  try {
    const cached = await redis.get<Property[]>(CACHE_KEYS.FEATURED_PROPERTIES);
    return cached;
  } catch (error) {
    console.error("Error obteniendo cache de propiedades destacadas:", error);
    return null;
  }
}

export async function setCachedFeaturedProperties(
  properties: Property[]
): Promise<void> {
  try {
    // SIN TTL - dura para siempre (hasta actualización manual)
    await redis.set(CACHE_KEYS.FEATURED_PROPERTIES, properties);
    await redis.set(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());
  } catch (error) {
    console.error("Error guardando cache de propiedades destacadas:", error);
  }
}

export async function getCachedAllProperties(): Promise<Property[] | null> {
  try {
    const cached = await redis.get<Property[]>(CACHE_KEYS.ALL_PROPERTIES);
    return cached;
  } catch (error) {
    console.error("Error obteniendo cache de todas las propiedades:", error);
    return null;
  }
}

export async function setCachedAllProperties(
  properties: Property[]
): Promise<void> {
  try {
    // SIN TTL - dura para siempre (hasta actualización manual)
    await redis.set(CACHE_KEYS.ALL_PROPERTIES, properties);

    // Guardar timestamp de última actualización
    await redis.set(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());
  } catch (error) {
    console.error("Error guardando cache de todas las propiedades:", error);
  }
}

export async function getCachedProperty(id: number): Promise<Property | null> {
  try {
    const cached = await redis.get<Property>(CACHE_KEYS.PROPERTY_DETAIL(id));
    return cached;
  } catch (error) {
    console.error(`Error obteniendo cache de propiedad ${id}:`, error);
    return null;
  }
}
export async function setCachedProperty(
  id: number,
  property: Property
): Promise<void> {
  try {
    // SIN TTL - dura para siempre (hasta actualización manual)
    await redis.set(CACHE_KEYS.PROPERTY_DETAIL(id), property);
  } catch (error) {
    console.error(`Error guardando cache de propiedad ${id}:`, error);
  }
}

export async function invalidateAllCache(): Promise<void> {
  try {
    await redis.del(CACHE_KEYS.FEATURED_PROPERTIES);
    await redis.del(CACHE_KEYS.ALL_PROPERTIES);
    await redis.del(CACHE_KEYS.LAST_UPDATE);
  } catch (error) {
    console.error("Error invalidando cache:", error);
  }
}

export async function invalidatePropertyCache(id: number): Promise<void> {
  try {
    await redis.del(CACHE_KEYS.PROPERTY_DETAIL(id));
  } catch (error) {
    console.error(`Error invalidando cache de propiedad ${id}:`, error);
  }
}
