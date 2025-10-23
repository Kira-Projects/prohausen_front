import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/lib/db/properties";

// Forzar dynamic rendering para evitar errores en build
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/property/[id]
 * Obtiene una propiedad específica desde MongoDB Atlas por ID
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

    const startTime = performance.now();

    // Obtener propiedad directamente de MongoDB
    const property = await getPropertyById(propertyId);

    const endTime = performance.now();
    const loadTime = Math.round(endTime - startTime);

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Propiedad no encontrada",
          property: null,
          source: "mongodb",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: property,
      source: "mongodb",
      loadTime: `${loadTime}ms`,
    });
  } catch (error) {
    console.error("Error al obtener propiedad desde MongoDB:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener propiedad desde MongoDB",
        property: null,
        source: "mongodb",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
