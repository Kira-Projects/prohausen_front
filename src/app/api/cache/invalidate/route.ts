import { NextRequest, NextResponse } from "next/server";
import { invalidateAllCache } from "@/lib/cache";

/**
 * API Route para invalidar el caché de Redis
 *
 * USO:
 * POST /api/cache/invalidate?secret=prohausen-cache-2024
 *
 * IMPORTANTE: Este endpoint requiere un secret para evitar invalidaciones no autorizadas
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar secret de seguridad
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");

    const CACHE_SECRET =
      process.env.CACHE_INVALIDATE_SECRET || "prohausen-cache-2024";

    if (secret !== CACHE_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid secret" },
        { status: 401 }
      );
    }

    // 2. Invalidar todo el caché
    console.log("🗑️ Invalidando caché de Redis...");
    await invalidateAllCache();

    // 3. Responder con éxito
    return NextResponse.json({
      success: true,
      message: "Caché invalidado exitosamente",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error al invalidar caché:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al invalidar caché",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para verificar estado
 */
export async function GET() {
  return NextResponse.json({
    message: "Cache invalidation endpoint",
    usage: "POST /api/cache/invalidate?secret=YOUR_SECRET",
    status: "ready",
  });
}
