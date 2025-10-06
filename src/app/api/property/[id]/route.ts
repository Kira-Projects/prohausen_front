import { NextRequest, NextResponse } from "next/server";
import { getCachedAllProperties } from "@/lib/cache";

// Cache la respuesta por 60 segundos en el edge de Next.js
// Los datos siguen viniendo de Upstash, pero Next.js cachea la respuesta
export const revalidate = 60;

/**
 * GET /api/property/[id]
 * Obtiene una propiedad específica desde Upstash Redis cache por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params en Next.js 15+
    const resolvedParams = await params;
    const propertyId = parseInt(resolvedParams.id);

    if (isNaN(propertyId)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de propiedad inválido",
          property: null,
        },
        { status: 400 }
      );
    }

    console.log(`🔍 [API] Buscando propiedad ${propertyId} en Upstash...`);

    const startTime = performance.now();

    // Obtener todas las propiedades del cache
    const allProperties = await getCachedAllProperties();

    if (!allProperties || allProperties.length === 0) {
      console.warn("⚠️ [API] No hay propiedades en caché");
      return NextResponse.json(
        {
          success: false,
          error:
            "No hay propiedades en caché. Por favor, actualice el caché desde el panel de administración.",
          property: null,
        },
        { status: 404 }
      );
    }

    // Buscar la propiedad por ID
    const property = allProperties.find((p) => p.id === propertyId);

    const endTime = performance.now();
    const loadTime = Math.round(endTime - startTime);

    if (!property) {
      console.warn(`⚠️ [API] Propiedad ${propertyId} no encontrada en caché`);
      return NextResponse.json(
        {
          success: false,
          error: "Propiedad no encontrada",
          property: null,
        },
        { status: 404 }
      );
    }

    console.log(`✅ [API] Propiedad ${propertyId} encontrada en ${loadTime}ms`);
    console.log(
      `📸 [API] Propiedad tiene ${property.images?.length || 0} imágenes`
    );

    return NextResponse.json({
      success: true,
      property: property,
      cached: true,
      loadTime: `${loadTime}ms`,
    });
  } catch (error) {
    console.error("❌ [API] Error al obtener propiedad desde caché:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener propiedad desde caché",
        property: null,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
