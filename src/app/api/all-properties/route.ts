import { NextResponse } from "next/server";
import { getCachedAllProperties } from "@/lib/cache";

// Cache la respuesta por 60 segundos en el edge de Next.js
// Los datos siguen viniendo de Upstash, pero Next.js cachea la respuesta
export const revalidate = 60;

/**
 * GET /api/all-properties
 * Obtiene todas las propiedades desde Upstash Redis cache
 */
export async function GET() {
  try {
    const startTime = performance.now();
    const cachedProperties = await getCachedAllProperties();
    const endTime = performance.now();

    if (!cachedProperties || cachedProperties.length === 0) {
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

    return NextResponse.json({
      success: true,
      properties: cachedProperties,
      cached: true,
      count: cachedProperties.length,
      loadTime: `${loadTime}ms`,
    });
  } catch (error) {
    console.error("Error al obtener propiedades desde caché:", error);

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
