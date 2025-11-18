import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { withAuth } from "@/lib/auth";
import { generateUniqueFileName } from "@/lib/s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * POST /api/admin/generate-upload-url
 * Genera una URL firmada (presigned URL) para subir imágenes directamente a S3
 * Esto permite al cliente subir directamente sin pasar por Vercel (sin límite de 4.5 MB)
 * Requiere autenticación
 */
export const POST = withAuth(async (req: NextRequest, _context: unknown, _userId: string) => {
  try {
    const body = await req.json();
    const { fileName, fileType, propertyId } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName y fileType son requeridos" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        {
          error: "Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WebP",
        },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const uniqueFileName = generateUniqueFileName(fileName);

    // Construir la key de S3 (path)
    const s3Key = propertyId
      ? `properties/${propertyId}/${uniqueFileName}`
      : `properties/temp/${uniqueFileName}`;

    // Crear comando para S3 (sin ACL, usa política del bucket)
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: fileType,
    });

    // Generar URL firmada (válida por 1 hora)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hora en segundos
    });

    // URL pública final (sin parámetros de firma)
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Log para debugging (eliminar después)
    console.log('✅ Presigned URL generada:', {
      bucket: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      key: s3Key,
      urlLength: presignedUrl.length,
    });

    return NextResponse.json({
      success: true,
      message: "URL de subida generada exitosamente",
      data: {
        uploadUrl: presignedUrl, // Para subir (con firma temporal)
        publicUrl: publicUrl,    // Para guardar en DB (URL permanente)
        key: s3Key,
      },
    });
  } catch (error) {
    console.error("Error al generar presigned URL:", error);
    return NextResponse.json(
      { error: "Error al generar URL de subida" },
      { status: 500 }
    );
  }
});
