import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, generateUniqueFileName } from "@/lib/s3";
import { withAuth } from "@/lib/auth";

/**
 * POST /api/admin/upload-image
 * Sube una imagen a S3 y retorna la URL pública
 * Requiere autenticación
 */
export const POST = withAuth(async (req: NextRequest, _context: unknown, _userId: string) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const propertyId = formData.get("propertyId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WebP",
        },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 10MB" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const uniqueFileName = generateUniqueFileName(file.name);

    // Construir la key de S3 (path)
    const s3Key = propertyId
      ? `properties/${propertyId}/${uniqueFileName}`
      : `properties/temp/${uniqueFileName}`;

    // Convertir el archivo a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a S3
    const imageUrl = await uploadToS3(buffer, s3Key, file.type);

    return NextResponse.json({
      success: true,
      message: "Imagen subida exitosamente",
      data: {
        url: imageUrl,
        key: s3Key,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen a S3" },
      { status: 500 }
    );
  }
});
