import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  setCachedFeaturedProperties,
  setCachedAllProperties,
  invalidateAllCache,
} from "@/lib/cache";
import { mapWordPressProperty } from "@/utils/mapWordPressData";
import type { WordPressProperty } from "@/types/property";

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://prohausen.cl/wp-json/wp/v2";

/**
 * Obtiene URLs de imágenes desde WordPress por ID de propiedad
 * Consulta TODAS las imágenes adjuntas (attachments) a una propiedad
 * Límite aumentado a 100 para soportar propiedades con muchas imágenes
 */
async function getPropertyImageUrls(propertyId: number): Promise<string[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/media?parent=${propertyId}&per_page=100`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const mediaItems = await response.json();
    return mediaItems
      .map((item: { source_url?: string }) => item.source_url)
      .filter((url: string | undefined): url is string => !!url);
  } catch (error) {
    console.warn(
      `⚠️ Error obteniendo imágenes para propiedad ${propertyId}:`,
      error
    );
    return [];
  }
}

/**
 * API Endpoint para refrescar el caché manualmente
 * Solo accesible con contraseña correcta
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verificar contraseña
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2024";

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    console.log("🔄 Iniciando actualización de caché...");

    // 1. Limpiar caché existente en Upstash
    await invalidateAllCache();
    console.log("🗑️ Caché anterior limpiado");

    // 2. Obtener propiedades destacadas de WordPress
    const featuredResponse = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=4&_embed=wp:featuredmedia,wp:attachment&es_featured=true`,
      { cache: "no-store" }
    );

    if (!featuredResponse.ok) {
      throw new Error(
        `Error al obtener propiedades destacadas: ${featuredResponse.status}`
      );
    }

    const featuredProperties = await featuredResponse.json();

    // Mapear propiedades destacadas con imágenes (incluyendo galería)
    const mappedFeatured = await Promise.all(
      (featuredProperties as WordPressProperty[]).map(async (prop) => {
        const images: string[] = [];

        // 1. Imagen destacada
        if (prop._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
          images.push(prop._embedded["wp:featuredmedia"][0].source_url);
        } else if (prop._embedded?.["wp:featuredmedia"]?.[0]?.guid?.rendered) {
          images.push(prop._embedded["wp:featuredmedia"][0].guid.rendered);
        }

        // 2. Imágenes de la galería
        const galleryUrls = await getPropertyImageUrls(prop.id);
        galleryUrls.forEach((url) => {
          if (!images.includes(url)) {
            images.push(url);
          }
        });

        console.log(
          `📸 Imágenes para ${prop.id} (${prop.title.rendered}):`,
          images.length,
          "imágenes"
        );

        const featuredImage = images[0] || "";
        const mapped = mapWordPressProperty(prop, featuredImage);
        mapped.images = images; // ✅ TODAS las imágenes sin límite
        return mapped;
      })
    );

    // 3. Obtener todas las propiedades de WordPress (con imágenes)
    const allResponse = await fetch(
      `${WORDPRESS_API_URL}/properties?per_page=100&_embed=wp:featuredmedia`,
      { cache: "no-store" }
    );

    if (!allResponse.ok) {
      throw new Error(
        `Error al obtener todas las propiedades: ${allResponse.status}`
      );
    }

    const allProperties = await allResponse.json();

    // Mapear todas las propiedades con imágenes (incluyendo galería)
    console.log(
      `📦 Procesando ${
        (allProperties as WordPressProperty[]).length
      } propiedades...`
    );

    const mappedAll = await Promise.all(
      (allProperties as WordPressProperty[]).map(async (prop, index) => {
        const images: string[] = [];

        // 1. Imagen destacada
        if (prop._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
          images.push(prop._embedded["wp:featuredmedia"][0].source_url);
        } else if (prop._embedded?.["wp:featuredmedia"]?.[0]?.guid?.rendered) {
          images.push(prop._embedded["wp:featuredmedia"][0].guid.rendered);
        }

        // 2. Imágenes de la galería
        const galleryUrls = await getPropertyImageUrls(prop.id);
        galleryUrls.forEach((url) => {
          if (!images.includes(url)) {
            images.push(url);
          }
        });

        // Log progreso cada 10 propiedades
        if ((index + 1) % 10 === 0) {
          console.log(
            `⏳ ${index + 1}/${
              (allProperties as WordPressProperty[]).length
            } procesadas`
          );
        }

        const featuredImage = images[0] || "";
        const mapped = mapWordPressProperty(prop, featuredImage);
        mapped.images = images; // ✅ TODAS las imágenes sin límite
        return mapped;
      })
    );

    console.log(`✅ Todas las propiedades procesadas`);

    // 4. Guardar en Upstash SIN TTL (dura para siempre)
    await setCachedFeaturedProperties(mappedFeatured);
    await setCachedAllProperties(mappedAll);
    console.log(
      `💾 Guardado en Upstash: ${mappedFeatured.length} destacadas, ${mappedAll.length} totales`
    );

    // 5. Revalidar páginas de Next.js (ISR)
    revalidatePath("/");
    revalidatePath("/propiedades");
    console.log("♻️ Páginas revalidadas");

    // 6. Guardar timestamp de última actualización
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "Caché actualizado exitosamente",
      propertiesCount: mappedAll.length,
      featuredCount: mappedFeatured.length,
      timestamp,
    });
  } catch (error) {
    console.error("❌ Error al actualizar caché:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar caché",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Método GET para verificar que el endpoint está activo
 */
export async function GET() {
  return NextResponse.json({
    message: "Admin cache refresh endpoint",
    status: "ready",
    usage: "POST with { password: 'your-password' }",
  });
}
