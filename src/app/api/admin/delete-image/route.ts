import { NextRequest, NextResponse } from "next/server";
import { deleteFromS3, extractS3KeyFromUrl } from "@/lib/s3";
import { withAuth } from "@/lib/auth";

/**
 * POST /api/admin/delete-image
 * Elimina una imagen de S3
 * Requiere autenticación
 */
export const POST = withAuth(async (req: NextRequest, _context: unknown, _userId: string) => {
  try {
    const body = await req.json();
    const imageUrl = body.imageUrl as string;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No se proporcionó la URL de la imagen" },
        { status: 400 }
      );
    }

    // Extraer la key de S3 desde la URL
    let s3Key: string;
    try {
      s3Key = extractS3KeyFromUrl(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "URL de imagen inválida. Debe ser una URL de S3 válida" },
        { status: 400 }
      );
    }

    // Eliminar de S3
    await deleteFromS3(s3Key);

    return NextResponse.json({
      success: true,
      message: "Imagen eliminada exitosamente",
      data: {
        deletedKey: s3Key,
        deletedUrl: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "Error al eliminar la imagen de S3" },
      { status: 500 }
    );
  }
});
