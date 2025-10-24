import { NextRequest, NextResponse } from "next/server";
import {
  getAllProperties,
  createProperty,
  getNextPropertyId,
} from "@/lib/db/properties";
import { PropertyCreateInput } from "@/types/property";
import { withAdminAuth } from "@/lib/auth";

/**
 * GET /api/admin/properties
 * Lista todas las propiedades con filtros opcionales
 * Requiere autenticación
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withAdminAuth(async (req: NextRequest, _context: unknown) => {
  try {
    const { searchParams } = new URL(req.url);

    // Extraer filtros de los query params
    const filters = {
      active:
        searchParams.get("active") !== null
          ? searchParams.get("active") === "true"
          : undefined,
      featured:
        searchParams.get("featured") !== null
          ? searchParams.get("featured") === "true"
          : undefined,
      operation: searchParams.get("operation") || undefined,
      type: searchParams.get("type") || undefined,
      region: searchParams.get("region") || undefined,
      comuna: searchParams.get("comuna") || undefined,
    };

    const properties = await getAllProperties(filters);

    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    return NextResponse.json(
      { error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/properties
 * Crea una nueva propiedad
 * Requiere autenticación
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = withAdminAuth(async (req: NextRequest, _context: unknown) => {
  try {
    const body = await req.json();

    // Validar campos requeridos
    const requiredFields = [
      "title",
      "slug",
      "location",
      "description",
      "price",
      "area",
      "type",
      "operation",
      "region",
      "comuna",
      "image",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo '${field}' es requerido` },
          { status: 400 }
        );
      }
    }

    // Generar el siguiente ID si no se proporciona
    const nextId = body.id || (await getNextPropertyId());

    const propertyData: PropertyCreateInput = {
      id: nextId,
      title: body.title,
      slug: body.slug,
      location: body.location,
      description: body.description,
      price: body.price,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      area: body.area,
      type: body.type,
      operation: body.operation,
      region: body.region,
      comuna: body.comuna,
      featured: body.featured || false,
      active: body.active !== undefined ? body.active : true,
      image: body.image,
      images: body.images || [],
      usefulArea: body.usefulArea,
      landArea: body.landArea,
      floors: body.floors,
      floorNumber: body.floorNumber,
      groundLevel: body.groundLevel,
      yearBuilt: body.yearBuilt,
      features: body.features || [],
      videoUrl: body.videoUrl,
      address: body.address,
      zip: body.zip,
      country: body.country,
      halfBathrooms: body.halfBathrooms,
      totalRooms: body.totalRooms,
      mapIframe: body.mapIframe,
      folderId: body.folderId,
    };

    const newProperty = await createProperty(propertyData);

    return NextResponse.json(
      {
        success: true,
        message: "Propiedad creada exitosamente",
        data: newProperty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear propiedad:", error);

    // Manejar errores de duplicados (E11000)
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        {
          error:
            "Ya existe una propiedad con ese ID o slug. Por favor usa valores únicos.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear la propiedad" },
      { status: 500 }
    );
  }
});
