import { NextRequest, NextResponse } from "next/server";
import { updatePassword } from "@/lib/db/users";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/users/change-password
 * Cambia la contraseña del usuario actual
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validar campos
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Contraseña actual y nueva contraseña son requeridas" },
        { status: 400 }
      );
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Actualizar contraseña
    const success = await updatePassword(userId, currentPassword, newPassword);

    if (!success) {
      return NextResponse.json(
        { error: "Error al actualizar la contraseña" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    
    if (error instanceof Error && error.message === "Contraseña actual incorrecta") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "Usuario no encontrado") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al cambiar la contraseña",
      },
      { status: 500 }
    );
  }
}
