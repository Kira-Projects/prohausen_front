import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, getUserById } from "@/lib/db/users";
import { withAuth, withAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users/[id]
 * Obtiene un usuario por ID (solo administradores)
 */
async function getHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  _userId: string
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener usuario",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Actualiza un usuario (solo administradores)
 */
async function putHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  _userId: string
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, email } = body;

    // Validar que al menos un campo esté presente
    if (!nombre && !email) {
      return NextResponse.json(
        { error: "Debe proporcionar al menos un campo para actualizar" },
        { status: 400 }
      );
    }

    // Validar formato de email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Formato de email inválido" },
          { status: 400 }
        );
      }
    }

    const updateData: { nombre?: string; email?: string } = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;

    const user = await updateUser(id, updateData);

    return NextResponse.json({
      success: true,
      user,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    
    if (error instanceof Error && error.message === "El email ya está registrado") {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
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
        error: "Error al actualizar usuario",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Elimina un usuario (solo administradores)
 */
async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  userId: string
) {
  try {
    const { id } = await params;

    // No permitir que un usuario se elimine a sí mismo
    if (userId === id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 403 }
      );
    }

    const deleted = await deleteUser(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar usuario",
      },
      { status: 500 }
    );
  }
}

// Exportar con protección de autenticación y rol de administrador
export const GET = withAuth(withAdminRole(getHandler));
export const PUT = withAuth(withAdminRole(putHandler));
export const DELETE = withAuth(withAdminRole(deleteHandler));
