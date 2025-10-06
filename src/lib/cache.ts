import { Redis } from "@upstash/redis";
import { Property } from "@/types/property";

// Inicializar cliente Redis de Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
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
    console.log(
      "🔍 [Cache] Consultando Redis con key:",
      CACHE_KEYS.FEATURED_PROPERTIES
    );
    console.log(
      "🔍 [Cache] Redis URL:",
      process.env.UPSTASH_REDIS_REST_URL ? "✅ OK" : "❌ MISSING"
    );
    console.log(
      "🔍 [Cache] Redis Token:",
      process.env.UPSTASH_REDIS_REST_TOKEN
        ? "✅ OK (length:" + process.env.UPSTASH_REDIS_REST_TOKEN.length + ")"
        : "❌ MISSING"
    );

    const startTime = performance.now();
    const cached = await redis.get<Property[]>(CACHE_KEYS.FEATURED_PROPERTIES);
    const endTime = performance.now();

    console.log("📊 [Cache] Resultado de Redis:", {
      tieneResultado: !!cached,
      esArray: Array.isArray(cached),
      cantidad: cached?.length || 0,
      tiempoMs: Math.round(endTime - startTime),
    });

    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log("✅ [Cache] Primera propiedad:", {
        id: cached[0].id,
        title: cached[0].title,
        price: cached[0].price,
        image: cached[0].image ? "✅ Tiene imagen" : "❌ Sin imagen",
      });
    }

    return cached;
  } catch (error) {
    console.error(
      "❌ [Cache] Error obteniendo cache de propiedades destacadas:",
      error
    );
    return null;
  }
}

export async function setCachedFeaturedProperties(
  properties: Property[]
): Promise<void> {
  try {
    // SIN TTL - dura para siempre (hasta actualización manual)
    await redis.set(CACHE_KEYS.FEATURED_PROPERTIES, properties);

    // Guardar timestamp de última actualización
    await redis.set(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());

    console.log(
      `✅ Cache actualizado: ${properties.length} propiedades destacadas (sin expiración)`
    );
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

    console.log(
      `✅ Cache actualizado: ${properties.length} propiedades totales (sin expiración)`
    );
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
    console.log(`✅ Cache actualizado: Propiedad ${id} (sin expiración)`);
  } catch (error) {
    console.error(`Error guardando cache de propiedad ${id}:`, error);
  }
}

export async function invalidateAllCache(): Promise<void> {
  try {
    await redis.del(CACHE_KEYS.FEATURED_PROPERTIES);
    await redis.del(CACHE_KEYS.ALL_PROPERTIES);
    await redis.del(CACHE_KEYS.LAST_UPDATE);
    console.log("✅ Cache invalidado completamente");
  } catch (error) {
    console.error("Error invalidando cache:", error);
  }
}

export async function invalidatePropertyCache(id: number): Promise<void> {
  try {
    await redis.del(CACHE_KEYS.PROPERTY_DETAIL(id));
    console.log(`✅ Cache invalidado para propiedad ${id}`);
  } catch (error) {
    console.error(`Error invalidando cache de propiedad ${id}:`, error);
  }
}
