import { NextResponse } from "next/server";
import { getCachedFeaturedProperties } from "@/lib/cache";

/**
 * DEBUG: Verificar qué imágenes están en caché
 */
export async function GET() {
  try {
    const properties = await getCachedFeaturedProperties();

    if (!properties) {
      return NextResponse.json({
        error: "No hay propiedades en caché",
      });
    }

    // Verificar imágenes de las primeras 2 propiedades
    const debug = properties.slice(0, 2).map((prop) => ({
      id: prop.id,
      title: prop.title,
      image: prop.image,
      images: prop.images || [],
      imagesCount: prop.images?.length || 0,
    }));

    return NextResponse.json({
      totalProperties: properties.length,
      debug,
      message:
        "Si imagesCount = 1, necesitas actualizar el caché con el panel admin",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error verificando caché",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
