import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/db/users";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auth/me
 * Obtiene la información del usuario actual
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener información del usuario",
      },
      { status: 500 }
    );
  }
}
