import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Forzar dynamic rendering para evitar errores en build
export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * API Endpoint para obtener información del caché
 */
export async function GET() {
  try {
    // Obtener información del caché de Upstash
    const featuredProperties = await redis.get("featured-properties");
    const allProperties = await redis.get("all-properties");
    const lastUpdate = await redis.get("cache-last-update");

    return NextResponse.json({
      lastUpdate: lastUpdate || null,
      propertiesCount: Array.isArray(allProperties) ? allProperties.length : 0,
      featuredCount: Array.isArray(featuredProperties)
        ? featuredProperties.length
        : 0,
      hasFeaturedCache: !!featuredProperties,
      hasAllCache: !!allProperties,
    });
  } catch (error) {
    console.error("Error obteniendo info del caché:", error);
    return NextResponse.json(
      {
        error: "Error al obtener información del caché",
      },
      { status: 500 }
    );
  }
}
