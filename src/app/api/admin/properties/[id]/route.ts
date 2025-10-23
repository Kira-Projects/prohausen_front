import { NextRequest, NextResponse } from "next/server";
import {
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
} from "@/lib/db/properties";
import { PropertyUpdateInput } from "@/types/property";
import { withAdminAuth } from "@/lib/auth";
import { deleteFromS3, extractS3KeyFromUrl } from "@/lib/s3";

/**
 * GET /api/admin/properties/[id]
 * Obtiene una propiedad específica por su ID
 * Requiere autenticación
 */
export const GET = withAdminAuth(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: idParam } = await params;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
      }

      const property = await getPropertyById(id);

      if (!property) {
        return NextResponse.json(
          { error: "Propiedad no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: property,
      });
    } catch (error) {
      console.error("Error al obtener propiedad:", error);
      return NextResponse.json(
        { error: "Error al obtener la propiedad" },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT /api/admin/properties/[id]
 * Actualiza una propiedad existente
 * Requiere autenticación
 */
export const PUT = withAdminAuth(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: idParam } = await params;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
      }

      const body = await req.json();

      // Construir objeto de actualización solo con campos proporcionados
      const updateData: PropertyUpdateInput = {};

      if (body.title !== undefined) updateData.title = body.title;
      if (body.slug !== undefined) updateData.slug = body.slug;
      if (body.location !== undefined) updateData.location = body.location;
      if (body.description !== undefined)
        updateData.description = body.description;
      if (body.price !== undefined) updateData.price = body.price;
      if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms;
      if (body.bathrooms !== undefined) updateData.bathrooms = body.bathrooms;
      if (body.area !== undefined) updateData.area = body.area;
      if (body.type !== undefined) updateData.type = body.type;
      if (body.operation !== undefined) updateData.operation = body.operation;
      if (body.region !== undefined) updateData.region = body.region;
      if (body.comuna !== undefined) updateData.comuna = body.comuna;
      if (body.featured !== undefined) updateData.featured = body.featured;
      if (body.active !== undefined) updateData.active = body.active;
      if (body.image !== undefined) updateData.image = body.image;
      if (body.images !== undefined) updateData.images = body.images;
      if (body.usefulArea !== undefined) updateData.usefulArea = body.usefulArea;
      if (body.landArea !== undefined) updateData.landArea = body.landArea;
      if (body.floors !== undefined) updateData.floors = body.floors;
      if (body.floorNumber !== undefined)
        updateData.floorNumber = body.floorNumber;
      if (body.groundLevel !== undefined)
        updateData.groundLevel = body.groundLevel;
      if (body.yearBuilt !== undefined) updateData.yearBuilt = body.yearBuilt;
      if (body.features !== undefined) updateData.features = body.features;
      if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
      if (body.address !== undefined) updateData.address = body.address;
      if (body.zip !== undefined) updateData.zip = body.zip;
      if (body.country !== undefined) updateData.country = body.country;
      if (body.halfBathrooms !== undefined)
        updateData.halfBathrooms = body.halfBathrooms;
      if (body.totalRooms !== undefined)
        updateData.totalRooms = body.totalRooms;
      if (body.latitude !== undefined) updateData.latitude = body.latitude;
      if (body.longitude !== undefined) updateData.longitude = body.longitude;

      const updatedProperty = await updatePropertyById(id, updateData);

      if (!updatedProperty) {
        return NextResponse.json(
          { error: "Propiedad no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Propiedad actualizada exitosamente",
        data: updatedProperty,
      });
    } catch (error) {
      console.error("Error al actualizar propiedad:", error);

      // Manejar errores de duplicados (slug único)
      if (error instanceof Error && error.message.includes("E11000")) {
        return NextResponse.json(
          { error: "Ya existe una propiedad con ese slug" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Error al actualizar la propiedad" },
        { status: 500 }
      );
    }
  }
);

/**
 * DELETE /api/admin/properties/[id]
 * Elimina una propiedad y sus imágenes de S3
 * Requiere autenticación
 */
export const DELETE = withAdminAuth(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: idParam } = await params;
      const id = parseInt(idParam, 10);

      if (isNaN(id)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
      }

      // Obtener la propiedad primero para eliminar sus imágenes de S3
      const property = await getPropertyById(id);

      if (!property) {
        return NextResponse.json(
          { error: "Propiedad no encontrada" },
          { status: 404 }
        );
      }

      // Eliminar imágenes de S3
      const imagesToDelete: string[] = [];

      if (property.image) {
        imagesToDelete.push(property.image);
      }

      if (property.images && property.images.length > 0) {
        imagesToDelete.push(...property.images);
      }

      // Eliminar todas las imágenes de S3
      const deletePromises = imagesToDelete.map(async (imageUrl) => {
        try {
          const key = extractS3KeyFromUrl(imageUrl);
          await deleteFromS3(key);
          console.log(`✅ Imagen eliminada de S3: ${key}`);
        } catch (error) {
          console.error(`❌ Error al eliminar imagen de S3: ${imageUrl}`, error);
          // Continuar aunque falle la eliminación de alguna imagen
        }
      });

      await Promise.allSettled(deletePromises);

      // Eliminar la propiedad de MongoDB
      const deleted = await deletePropertyById(id);

      if (!deleted) {
        return NextResponse.json(
          { error: "Error al eliminar la propiedad" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Propiedad e imágenes eliminadas exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      return NextResponse.json(
        { error: "Error al eliminar la propiedad" },
        { status: 500 }
      );
    }
  }
);
