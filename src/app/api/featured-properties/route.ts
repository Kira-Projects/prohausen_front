import { NextResponse } from "next/server";
import { getCachedFeaturedProperties } from "@/lib/cache";

// Cache la respuesta por 60 segundos en el edge de Next.js
// Los datos siguen viniendo de Upstash, pero Next.js cachea la respuesta
export const revalidate = 60;

/**
 * GET /api/featured-properties
 * Obtiene las propiedades destacadas desde Upstash Redis cache
 */
export async function GET() {
  try {
    console.log("🔍 [API] Iniciando consulta a Upstash...");
    console.log(
      "🔍 [API] UPSTASH_REDIS_REST_URL:",
      process.env.UPSTASH_REDIS_REST_URL
        ? "✅ Configurado"
        : "❌ NO configurado"
    );
    console.log(
      "🔍 [API] UPSTASH_REDIS_REST_TOKEN:",
      process.env.UPSTASH_REDIS_REST_TOKEN
        ? "✅ Configurado"
        : "❌ NO configurado"
    );

    const startTime = performance.now();
    const cachedProperties = await getCachedFeaturedProperties();
    const endTime = performance.now();

    console.log("📊 [API] Respuesta de Upstash:", {
      tieneResultados: !!cachedProperties,
      cantidad: cachedProperties?.length || 0,
      tiempoMs: Math.round(endTime - startTime),
    });

    if (!cachedProperties || cachedProperties.length === 0) {
      console.warn(
        '⚠️ [API] No hay propiedades en caché. El admin debe presionar "Reflejar Cambios"'
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "No hay propiedades en caché. Por favor, actualice el caché desde el panel de administración.",
          properties: [],
          cached: false,
        },
        { status: 404 }
      );
    }

    const loadTime = Math.round(endTime - startTime);
    console.log(
      `✅ [API] ${cachedProperties.length} propiedades obtenidas de Upstash en ${loadTime}ms`
    );

    return NextResponse.json({
      success: true,
      properties: cachedProperties,
      cached: true,
      count: cachedProperties.length,
      loadTime: `${loadTime}ms`,
    });
  } catch (error) {
    console.error("❌ Error al obtener propiedades desde caché:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener propiedades desde caché",
        properties: [],
        cached: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
