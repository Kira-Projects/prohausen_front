import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/db/properties";

// Forzar dynamic rendering para evitar errores en build
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/all-properties
 * Obtiene todas las propiedades desde MongoDB Atlas
 */
export async function GET() {
  try {
    const startTime = performance.now();
    const properties = await getAllProperties(); // Sin filtro de active
    const endTime = performance.now();

    if (!properties || properties.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No hay propiedades disponibles.",
          properties: [],
          source: "mongodb",
        },
        { status: 404 }
      );
    }

    const loadTime = Math.round(endTime - startTime);

    return NextResponse.json({
      success: true,
      properties: properties,
      source: "mongodb",
      count: properties.length,
      loadTime: `${loadTime}ms`,
    });
  } catch (error) {
    console.error("Error al obtener propiedades desde MongoDB:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener propiedades desde MongoDB",
        properties: [],
        source: "mongodb",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
