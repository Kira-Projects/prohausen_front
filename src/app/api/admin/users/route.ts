import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/db/users";
import { withAuth, withAdminRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Obtiene todos los usuarios (solo administradores)
 */
async function getHandler(request: NextRequest, context: unknown, userId: string) {
  try {
    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener usuarios",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Crea un nuevo usuario (solo administradores)
 */
async function postHandler(request: NextRequest, context: unknown, userId: string) {
  try {
    const body = await request.json();
    const { nombre, email, password } = body;

    // Validar campos
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Crear usuario con role "user" (no permitimos crear admins desde la UI)
    const newUser = await createUser(nombre, email, password, "user");

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    
    if (error instanceof Error && error.message === "El email ya está registrado") {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al crear usuario",
      },
      { status: 500 }
    );
  }
}

// Exportar con protección de autenticación y rol de administrador
export const GET = withAuth(withAdminRole(getHandler));
export const POST = withAuth(withAdminRole(postHandler));
